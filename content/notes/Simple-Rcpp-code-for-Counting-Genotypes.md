Title: Using Rcpp and C++ to Count Genotypes
Date: 2015-12-05
Category: notes

I had a matrix (88662 loci x 2060 genotypes) of maize chromosome 1 genotypes, encoded as 0, 1, 2 (e.g. the number of alternate alleles). I needed genotype counts per row, which at first glance is quite easy to solve: just use `apply` and `table`:

     counts <- apply(chr1g, 1, table)

What's the problem with this approach? First, technical: if a row only has genotypes 0 and 2, we don't get counts for 1, which makes merging into a matrix later on a total nightmare (evident because `apply` is smart enough to return a list). Second, it ignores `NA`, which is not good. We can fix this with `exclude=NULL`:

    counts <- apply(chr1g, 1, function(x) table(x, exclude=NULL))

This doesn't solve our first problem, and it's a bit slower. `apply(chr1g, 1, table)` took:

      user  system elapsed
    84.638   3.110  87.865

Where as `apply(chr1g, 1, function(x) table(x, exclude=NULL))` takes:

       user  system elapsed
    108.718   5.708 114.609

(and no, passing `exclude=NULL` to directly to `apply` doesn't make it faster). The way around the first technical issue is to use factors. `as.factor` removes dimensions, so we're out of luck converting the whole matrix at once (plus, this would require a copy in memory and these objects are moderately large). So, we could so something like:

    count <- apply(chr1g, 1, function(x) table(factor(x, levels=c(0, 1, 2, NA)), exclude=NULL))})

This works well, but is also not too fast (chromosome 1 is 15% of our dataset):

      user  system elapsed
    95.918   5.746 101.861

Rcpp stands out as a simple solution here: this is very easy to code up (it took me literally five minutes). Looking at the timing first:

      user  system elapsed
     8.427   1.573  10.027

We see we have a clear winner. The whole dataset is 573,392 rows. Overall, this would take `(95.918 / 88662)* 573392 = 620.3178` seconds or about 10 minutes to complete on all data. Chances are, I'll have to run this code a few times as the analysis changes. In contrast, the Rcpp method takes `(8.427 / 88662)* 573392 = 54.49882` seconds. That's under 6 minutes to code and implement a working, faster solution in Rcpp!

The code is quite easy to understand too:

    #include <Rcpp.h>

    using namespace Rcpp;

    // [[Rcpp::export]]
    IntegerVector countGenotypes(IntegerVector x) {
        // This method is a specialized version of R's table that counts genotypes
        // encoded as 0, 1, 2 in a vector (and also returns NA) always of length 4,
        // always as numbers of 0, 1, 2, NA. This allows faster usage with apply, as
        // we don't need to convert to factor to get all genotype counts, even if
        // none are present.
        CharacterVector names = CharacterVector::create("0", "1", "2", "NA");
        IntegerVector genocounts(4);
        genocounts.fill(0);
        for (int i = 0; i < x.length(); i++) {
                if (!IntegerVector::is_na(x[i])) {
                        genocounts[x[i]] += 1;
                } else {
                        genocounts[3] += 1;
                }
        }
        genocounts.attr("names") = names;
        return genocounts;
    }
