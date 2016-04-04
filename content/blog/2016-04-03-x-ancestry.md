Title: A Genealogical Look at Shared Ancestry on the X Chromosome

<style type="text/css" media="screen">
  #mainsvg {
    margin-left: auto;
    margin-right: auto;
    display: block;
  }
  .arc-male {
    fill: #43a2ca;
  }
  .arc-female {
    fill: #de2d26;
  }
  .highlighted {
    fill: #333; 
  }
  .arc-text {
    display: block;
    height: 1em;
    margin-top: 1em;
    font-family: Helvetica;
    color: #333;
    text-align: center;
  }
  #src {
    margin-top: 4em;
    font-family: Helvetica;
    text-align: center;
    color: #333;
  }
  .chrom-female {
   fill: #ddd;
  }
  .chrom-male {
    fill: #bbb;
  }
  .chrom-bg {
    fill: #fff;
  }
  .mum-segment {
    fill: #d4151d;
  }
  .dad-segment {
    fill: #3790be;
  }
</style>

Graham Coop, Steve Mount, and my preprint *[A Genealogical Look at Shared
Ancestry on the X Chromosome
](http://biorxiv.org/content/early/2016/04/03/046912)* has been recently been
posted on bioRxiv, so in the spirit of both outreach and continuing Graham's
terrific series of blog posts<sup>1</sup> on genetic genealogy, I'm writing
about our paper on X chromosome genealogy and recent ancestry. Before diving
into the details about X chromosome ancestry, we'll review genealogies and
ancestry, and then genetic ancestry. Then, we'll look at the embedded X
genealogy and how the special inheritance pattern of the X chromosome changes
recent X ancestry.

<aside><sup>1</sup> For example, see Graham's posts [on how many genomic blocks
you share with a
cousin](http://gcbias.org/2013/12/02/how-many-genomic-blocks-do-you-share-with-a-cousin/),
[how your number of genetic ancestors grows back in
time](https://gcbias.org/2013/11/11/how-does-your-number-of-genetic-ancestors-grow-back-over-time/),
and [how much of your genome is inherited from a particular
ancestor](https://gcbias.org/2013/11/04/how-much-of-your-genome-do-you-inherit-from-a-particular-ancestor/)
</aside>

## Genealogies

Each human, as a sexually reproducing species with two sexes, has two parents.
You have two parents, four grandparents, eight great-grandparents, 16
great-great grandparents, and $k$ generations back have $2^k$
great<sup>$(k-2)$</sup> grandparents, and in general $2^k$ ancestors $k$
generations back. An example genealogy back five generations is shown below:

![A genealogy back five generations. <em>k</em> generations back, one has <em>2<sup>k</sup></em> ancestors. Circles indicate females, and squares males. The shaded individual is a present-day female.](/images/genealogy.png)

Of course, these genealogical ancestors are not necessarily all *distinct*
individuals; as you go further back through the generations, some of these
$2^k$ individuals aren't distinct — they're the same person. Intuitively, this
occurs when one's two parents are actually related some number of generations
back. For example, one's two parents could be 9<sup>th</sup> degree
cousins—e.g. if we assume a generation time of about 30 years, this means these
parents shared an ancestor around 270 years ago. This phenomenon is known as
*pedigree collapse*, and it's a source of inbreeding. The further back through
the generation you go back, pedigree collapse *must* happen—it's exceedingly
unlikely that 20 generations ago, your 10,48,576 ancestors are all
distinct.<sup>2</sup> While pedigree collapse definitely occurs, throughout the
rest of this blog post (and in our paper) we ignore it, as we model ancestry
that's recent enough where pedigree collapse isn't a large problem.

<aside> <sup>2</sup> Some beautiful probability theory by Chang (1999) has show
that the **most recent common ancestor** (the ancestor from which all current
individuals in the population descend from) of a population of size *N* lived
$T_N = \log_2(N)$ generations ago. Furthermore, rather amazingly, any
individual $1.77 \log_2(N)$ generations ago that has *any* present-day
descendents are actually (with very high probability) ancestors of *all* modern
day individuals.</aside>

## Genetic Ancestry

Since each of us have two parents, we receive half of our genetic material from
each parent. We share ½ of our genome with our mother, and ½ with our father.
Since your mother shares half her genetic material with her two parents, you
share ¼ of your genetic material with each grandparent. In general, on average
you'll share ½<sup>k</sup> of your genome with an ancestor $k$ generations in
the past. Since the number of crossovers per chromosome is limited, close
relatives are likely to share large contiguous segments of their genetic
material; a beautiful visualization of this is Morgan's 1916
illustration of crossing over:

![Thomas Hunt Morgan's 1916 illustration of crossing over.](/images/morgan-crossover.svg)

When we look at how much DNA two relatives share, we see it occurs in large
blocks. For example, using [23andme](https://www.23andme.com/)'s Ancestry Tools
I can see how much DNA my grandmother and I share—around 14 Morgans spread
across 21 long segments. Essentially, the fact that on average only one
crossover occurs per chromosome<sup>3</sup> per generation limits how much the
genome is broken up through the generations. While on average ¼ of my DNA
should be identical to my grandmother's DNA (we say such genetic material is
**identical by descent**) there's variance around this ¼ because the genome is
a finite place and recombination is limited. In other words, the fraction of my
genome that derives from my grandmother isn't like randomly sampling 6.6
billion marbles (the number of basepairs in a diploid human genome), a quarter
of which are colored red (i.e. come from my grandmother) and the rest white
(i.e. come from my other ancestors). Rather, a more appropriate model is that
these marbles are connected by string that is cut and reattached (much like
Morgan envisioned in his illustration).

So if we wish to take genomic datasets and understand the large shared segments
between relatives due to their shared ancestry<sup>4</sup> we need a more
appropriate mathematical model than the simple model of sampling marbles.
Numerous brilliant probabilists and statistical geneticists have tackled this
using probability theory and stochastic processes (Donnelly 1983; Huff et al.,
2011; Thomas et al., 1994). Some of the mathematical details are rather complex
(leading to fun conceptualizations like "a random walk on a hypercube"), but
the underlying model can be simplified considerably. I describe the model in
the paragraph below, but you can skip this without losing too much if you don't
like maths.

Each generation, we can imagine that crossing over randomly breaks the 22 human
autosome at $B$ positions, creating $B+22$ segments. As in Morgan's original
illustration (above), this leads to complementary gametes, with alternating
paternal and maternal segments (the black and white segments in the rightmost
figure). Mathematically, tracking these alternate segments is a bit tricky, so
can approximate the process<sup>5</sup> by imaging that each of the segments is
passed on to the next generation with probability ½—a flip of a fair coin.
Since we don't actually know how many breakpoints have occurred, we model them
as a random process. In our case, we use the Poisson distribution to assign a
probability to the event that some number of breakpoints $b$ occurs.  This idea
of using the Poisson distribution to model recombination has a long history in
genetics, going back to Haldane (1919). If we then imagine that this same
process occurs over and over again, across all of the $k$ individuals that
connect you and one of your ancestors in the <em>k<sup>th</sup></em>
generation, the total number of breakpoints is a Poisson distributed, but since
it happened over $k$ individuals, the rate is $k$ times faster. Then, for a
segment to survive to be passed from your ancestor in the
<em>k<sup>th</sup></em> generation to you, it must survive *k* independent coin
flips—an event that occurs with probability ½<sup>k</sup>. By a nice property
of Poisson processes known as *Poisson thinning*, this coin-flipping process
can be incorporated directly into the Poisson process by changing it's rate.
Then, the expected number of segments $N$ shared between you and your ancestor
in the <em>k<sup>th</sup></em> generation is:

$$\mathbb{E}[N] = \frac{1}{2^k}(22 + 33k)$$

where 33 is the total genetic length of the human autosomes in Morgans, a unit
defined as the average number of recombinations that occur (and is named after
the Morgan that created the figure above). Since our approximation is a Poisson
process, we can do more than just find an expression for the *average* number
of segments you share with an ancestor, but calculate probabilities of sharing
zero segments (such that your genealogical ancestor is not a genetic ancestor)
and calculate the distribution of segment lengths. Additionally, these models
can be easily extended to handle the segments shared between cousins.

What's fascinating about this is that your may not share genetic material with
your genealogical ancestors. If you play around with the equation above with
different values of $k$, you'll see around $k=9$ that you're expected to share
less than one segment with your ancestors 9 generations back. We can visualize
this using an arc diagram, which depicts a present-day individual in the center
as the white half-circle, your two parents, four grandparents, and so forth:  

<div id="auto-family-arc"></div>
<div id="auto-desc" class="arc-text"></div>
<div id="auto-help" class="arc-text">loading...</div>

<figcaption> An arc diagram of one's genealogical ancestors and their genetic
contributions to the present-day individual. Female ancestors are colored red,
and male ancestors are colored blue. This visualization uses simulated genetic
ancestry back through the generations, and the opacity of the red or blue arcs
grows fainter with the less genetic material shared between that ancestor and
you. Completely white arcs are genealogical ancestors that contribute zero
genetic material to you. Hover over an ancestor to highlight it and find how
much genetic material it has contributed to the present-day
individual.</figcaption>

We see that one's genetic ancestors don't grow as rapidly one's genealogical
ancestors. There's a lot more to say about this, but luckily Graham has already
written a [terrific blog
post](https://gcbias.org/2013/11/11/how-does-your-number-of-genetic-ancestors-grow-back-over-time/)
on this topic.

## X Genealogies

In our paper, we curious how these processes would play out on the X
chromosome. The human genome contains 22 autosome pairs and one sex chromosome
pair, give us 23 pairs (i.e. the 23 from 23andme), plus one mitochondrial
genome. However, unlike the autosomes, the X chromosome undergoes a special
inheritance pattern. Males have only one X chromosome, and a Y chromosome. In
contrast, females have two X chromosomes. Each generation, individuals pass a
haploid set of chromosomes to their offspring—meaning they take the 23 pairs
and pass a combination of each pair. Since males have two different sex
chromosomes (the X and the Y), these two different chromosomes don't recombine
like the autosomes (except for over a small region called the pseudo-autosomal
region). Instead, the male either passes his X to a daughter or a Y to a son.
Females, having two X chromosomes, do pass a recombined X chromosome to their
son or daughter. Since the X can only recombine over its entire length in
females, we call these female meioses **recombinational meioses**. Note that
with the autosomes, every meiosis is a recombinational meiosis.

What's fascinating is that this different inheritance pattern leads the X
chromosome to have a different genealogy than the one's biparental genealogy.
Since males don't pass X chromosomes to their sons, one's X genealogy only
includes a subset of one's total ancestors, and is embedded inside of one's
total genealogy. Below is an X genealogy for a present-day female:

![An X genealogy going back five generations, with females drawn as circles and males as squares. Shaded individuals are X ancestors, while unshaded individuals are not X ancestors. The numbers indicate the number of recombinational meioses to that ancestor.](/images/xtree.png)

Note the number of X ancestors one has back through the generations, 2, 3, 5,
8, etc. This sequence is the famous [Fibonacci
sequence](https://en.wikipedia.org/wiki/Fibonacci_number) offset by two. Thus,
one's number of X ancestors is the $k+2$ Fibonacci number, $\mathcal{F}_{k+2}$.
This sequence crops up throughout
[nature](https://en.wikipedia.org/wiki/Fibonacci_number#In_nature) and
mathematics.

Another feature of X genealogies is that unlike the autosomes, where
chromosomes undergo recombination every generation and in every ancestor, the
number of X recombinational meiosis vary by lineage. This is because the number
of females that occur in a lineage to an X ancestor in the 5<sup>th</sup>
generation vary depending on the lineage. In the leftmost lineage, a female
occurs each generation. In contrast, the rightmost X lineage (with all shaded
individuals) alternates between male and female ancestors.  Since the X
chromosome only undergoes recombination over its entire length in females, the
specific lineage to an X ancestor impacts how quickly genetic relatedness
breaks down. In our paper, we sought to characterize this lineage-specific rate
and see how it affects genetic relatedness. 

<div id="xshared"></div><figcaption>A example of a present-day female's X
material being broken up across her X ancestors in her X genealogy back through
the generations.</figcaption>

Our models are similar to the autosomal models described earlier, except given
that we don't know the particular lineage to an X ancestor, we need to average
over the number of possible recombinational meiosis that could occur. We found
that the number of lineages to an X ancestor $k$ generations back with $r$
recombinational meioses is:

$${ r + 1 \choose k-r}$$

Since one has $\mathcal{F}_{k+2}$ X ancestors $k$ generations back, the
probability of $r$ recombinational meioses occurring is:

$$P_R(R=r) = \frac{{ r + 1 \choose k-r}}{\mathcal{F}_{k+2}}$$

Averaging over this number of recombinational meioses gives us a model for the
number and length of segments shared identically by descent on the X. It turns
out the Poisson thinning approximation described earlier doesn't work as well
as another model we call the Poisson-Binomial model. I won't cover the detailed
derivation here (see the
[preprint](http://biorxiv.org/content/early/2016/04/03/046912) if you're
interested), but we find the distribution of X segment number to be well
approximated by:

$$P(N=n \;|\; k, \nu) = \sum_{r=\lfloor k/2 \rfloor}^k \sum_{b=0}^\infty \text{Bin}(N=n \;|\; l=b+1, p=1/2^r) \; \text{Pois}(B=b \;|\; \lambda=\nu r) \; \frac{{r+1 \choose k-r}}{\mathcal{F}_{k+2}} $$

As with the autosomes, it's possible one's X genealogical ancestors don't
contribute X genetic material to their present-day descendent. For example,
here is a simulated X genealogy with opacity of an ancestor indicating that
ancestor's genetic contribution to the present-day individual:

<div id="x-family-arc"></div>
<div id="x-desc" class="arc-text"></div>
<div id="x-help" class="arc-text">loading...</div>

<figcaption>An X genealogy depicted as an arc diagram. Red ancestors are females, blue are males. The opacity indicates the genetic contribution the present-day individual. White ancestors are those that make no genetic contribution to the present-day individual. Gray arcs are genealogical ancestors that are not X ancestors.</figcaption>

## What recent ancestry on the X can tell us



<!-- requisite JS below -->
<script src="/static/js/d3.v3.min.js" charset="utf-8"></script>
<script src="/static/js/familyarc.js" type="text/javascript" charset="utf-8"></script>
<script src="/static/js/sharedsegments2.js" type="text/javascript" charset="utf-8"></script>
<script type="text/javascript" charset="utf-8">
  var human_x = {
    'nancestors': function(k) {
      return (Math.pow(φ, k+2) - Math.pow(ψ, k+2))/Math.sqrt(5);
    },
    'genlen': 1.96,
  };

  var single_chrom = {
    'nancestors': function(k) {
      return Math.pow(2, k);
    },
    'genlen': 5,
  }
  d3.json("/static/js/x.json", function(data) {
    var config = single_chrom;
    config.genlen = data.genlen;
    if (data.type == 'x') {
      config = human_x;
      //config.tight = true;
    }
    config.animate = true;
    // maxgen: also change in sharedsegments2.js, filter()
    config.maxgen = 4; //d3.max(data.sims[0].map(function(d) { return d.gen; }));
    var drawShared = segmentsTree(config);
    d3.select("#xshared")
      .datum(data.sims[0])
      .call(drawShared);
  });
</script>
