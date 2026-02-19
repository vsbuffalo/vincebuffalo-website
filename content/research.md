---
title: "Research"
date: 2015-12-04
aliases:
  - /research/
---

## Across-species Population Genetics and Lewontin's Paradox of Variation

<figure>
<img src="/images/diversity_popsize_full.png" alt="Lewontin's Paradox of Variation" />
<figcaption>

A visualization of Lewontin's Paradox of Variation. This combines pairwise diversity estimates from Leffler et al. (2012), Corbett-Detig et al. (2015), and Romiguier et al. (2014) with census population sizes I've estimated using inferred range sizes and population densities estimated using macroecological scaling relationships. The gray ribbon illustrates genetic diversity under a neutral model were effective population size to equal census population size (\(N_e = N_c\)), for mutation rates ranging from \(1\times10^{-8}-1\times10^{-9}\). The gray dashed line is the ordinary least squares estimate, and the blue dashed line is the estimated relationship after accounting for phylogeny using mixed-effects models.

</figcaption>
</figure>

## Detecting Polygenic Adaptation From Temporal Genomic Data

<figure>
<img src="/images/rapidadapt_examples.png" alt="Rapid adaptation examples" />
<figcaption>

Two motivating examples of rapid phenotypic adaptation from the literature. Left, PC1 of beak size in Darwin's finches shifts rapidly and unpredictably due to selection responding to changing environments, from [Grant and Grant (2002)](https://science.sciencemag.org/content/296/5568/707). Right, a rapid shift in flowering time in *Brassica rapa* after a multiyear drought across wet and dry sites, from [Franks, Sim, and Weis (2007)](https://www.pnas.org/content/104/4/1278). A central aim of my research is detecting the signal of such rapid phenotypic shifts in genomic data, and understanding how it impacts genetic variation in the genome.

</figcaption>
</figure>

<aside>
<sup>1</sup>A trait, or phenotype is said to be <em>polygenic</em> when more than one one gene (and anywhere from tens to thousands of genes) affect the trait's value. Numerous polygenic traits impact fitness, such as body size in animals or flowering time in plants.
</aside>

During my PhD, I became fascinated by the problem of detecting rapid polygenic<sup>1</sup> adaptation. We have seen extensive examples of rapid polygenic adaptation in natural populations, where over short "ecological" timescales a population's trait average changes due to an environmental change or other stimulus. However, detecting such adaptation at a genomic level is challenging, since the effects of selection are distributed across all of the many sites contributing to the trait, and the subtle allele frequency changes can be mistaken for random genetic drift. This leaves us in an unfortunate place: while ecologists and evolutionary biologists can observe rapid phenotypic changes in natural populations, detecting these adaptive events in genomic data that is now widely available is incredibly difficult. Yet, we need to understand how rapid phenotypic adaptation affects genome-wide variation to have a complete view of how evolution is working in populations. **Connecting evolutionary quantitative genetics with population genomic data is a central theme in my research.**

In my PhD work, Graham Coop and I show that temporal genomic data (allele frequencies sampled from a population over many generations) provides a way to detect polygenic adaptation over very short timescales. The signal we use is that a neutral allele (i.e. an allele that does not directly affect fitness) behaves differently through time when selection is present. In particular, the allele frequency changes each generation (e.g. \(\Delta p_0 = p_1 - p_0, \Delta p_1 = p_2 - p_0, \) etc.) under drift are independent, and consequently the covariance between allele frequency changes (e.g. \(\text{cov}(\Delta p_t, \Delta p_s)\)) is expected to be zero. However, when heritable fitness variation exists in the population, this creates covariances in allele frequency changes that we can directly measure from genomic data. We call this **temporal autocovariance**. In our *Genetics* paper, *[The Linked Selection Signature of Rapid Adaptation in Temporal Genomic Data](https://www.genetics.org/content/213/3/1007)* we work out mathematical expressions for its strength and show how we can estimate additive genetic variance for fitness using measured levels of temporal autocovariance.

<figure>
<img src="/images/sim-pred-covs-varyl-alt.png" alt="Simulation results" />
<figcaption>

Simulation results (points) show that our mathematical expressions for temporal autocovariance (lines) match closely. Additionally, the level of temporal autocovariance is a function of the total additive genetic variance in a region, and is invariant with respect to the number of loci (different colors). Since we currently lack mathematical models of the additive variance through time, we have used the different measures of this variation over time from the simulations to predict the level of temporal autocovariance (these are the different lines); more detail can be found in our manuscript.

</figcaption>
</figure>

In addition to allowing us to detect polygenic adaptation from temporal genomic data, temporal autocovariance also allows us to address a long standing issue in evolutionary genetics: how can we quantify the effects of selection and drift on genome-wide allele frequency changes? This is a long-standing problem in evolutionary genetics, going back to the vitriolic debates between R.A. Fisher and Sewall Wright in the 1940s. For the first time, we can directly partition how much of the variance in allele frequency change is directly caused by linked selection. In our *Genetics* paper, we have developed an estimator, **G**, which quantifies the proportion of the total variance in allele frequency change that is due to linked selection<sup>2</sup>.

<aside>
<sup>2</sup> This is defined as the sum of the covariances terms (only non-zero in the presence of linked selection) divided by the total variance:
\[G = \frac{\sum_{i \ne j} \text{cov}(\Delta p_i, \Delta p_j)}{\text{Var}(p_t - p_0)}\]
</aside>

In a second paper, published in [PNAS](https://www.pnas.org/content/early/2020/08/07/1919039117/), we apply these ideas to three published temporal genomic datasets. We find extensive evidence in three studies that linked selection effects genome-wide allele frequencies over short timescales. Overall we estimate that at least 17% to 37% of allele frequency change is driven by selection in these experiments (using our measure **G** mentioned earlier). Results from a reanalysis of one of these studies is shown below:

<figure>
<img src="/images/figure-1.png" alt="Barghi et al. reanalysis" />
<figcaption>

In one study we re-analyzed, [Barghi et al. (2019)](https://journals.plos.org/plosbiology/article?id=10.1371/journal.pbio.3000128), we find that temporal autocovariances decay through time as our theory predicts (due to the effect of decreasing associated fitness variation and recombination shuffling genetic backgrounds), shown here in Figure A, which plots the rows of the temporal variance-covariance matrix (shown on the right). In Figure B, we show our measure **G**, the cumulative effects of linked selection on the proportion of total variation due to linked selection (schematic shown on bottom right).

</figcaption>
</figure>

Finally, we also find evidence of reversals in the direction of selection in the Barghi et al. (2019) data, indicated by negative temporal covariances over long periods of time. A huge benefit of our approach is that we can tease out a signal of these more complicated selection dynamics with genome-wide data that may not be evident by analyzing individual allele frequency trajectories.

Overall, this work begins to address two long-standing problems in evolutionary biology: how can we detect polygenic adaptation over short timescales, and how can we quantify the effects of drift versus selection on genome-wide variation? As more temporal datasets continue to be created, we can also begin to reconcile our short-term estimates of the genome-wide impact of selection with estimates of how selection shapes genomic diversity over longer periods, from single contemporaneous samples. Furthermore, I hope to quantify the extent to which fluctuating selection acting over short timescales are occurring in natural populations, and the impact they have on genetic variation.

## X Chromosome Genealogies

<figure>
<img src="/images/x-arc.png" alt="X chromosome genealogy simulation" />
<figcaption>

One simulation of an X-genealogy 10 generations back. Gray indicates genealogical ancestors that are not X ancestors, blue indicates male ancestors, red indicates female ancestors, and white indicates genealogical X ancestors that do not share genetic material with the present day individual. The transparency of the red and blue arcs is proportional to the genetic material shared that X ancestor and the present-day individual.

</figcaption>
</figure>

During summer 2015, Graham, [Steve Mount](http://www.clfs.umd.edu/labs/mount/), and I worked out a set of probability distributions that model the number of blocks and their lengths one shares with an [X chromosome](https://en.wikipedia.org/wiki/X_chromosome) ancestor *k* generations back in the past. Additionally, we modelled the number and lengths blocks one shares with a present-day relative on the X chromosome. As ancestry services like [23andme](https://www.23andme.com/) and [ancestry.com](http://www.ancestry.com/) use identical by descent blocks<sup>1</sup> between individuals to infer shared ancestry, Graham and I were curious how much information about ancestry is in X chromosomes and what these block distributions look like.

<aside>
<sup>1</sup>A stretch of DNA that that derived from a common ancestor without being broken by recombination or changed via mutation is <strong>identical by descent</strong>. For more technical details on identity by descent, see <a href="http://www.genetics.org/content/194/2/301.short">this terrific review</a> by Elizabeth Thompson (Thompson, 2012).
</aside>

<figure>
<img src="/images/tree.png" alt="X chromosome blocks shared between ancestors" />
<figcaption>
X chromosome blocks shared between a present-day individual and their ancestors.
</figcaption>
</figure>

Since the heterogametic sex only has *one* X ancestor (e.g. in humans, males have only one X ancestor in the previous generation — their mother), one's number of X ancestors *k* generations back is curiously enough the \((k+2)^\text{th}\) [Fibonacci number](https://en.wikipedia.org/wiki/Fibonacci_number). Additionally, X chromosomes only undergo meiotic recombination in females, so the distribution of recombinational meioses varies depending on the lineage to a particular ancestor. This leads to some neat combinatorics that we use in our derivation of our distributions.

Graham, Steven, and I have written up this manuscript, and a preprint is now available [bioRxiv](http://biorxiv.org/content/early/2016/04/03/046912). As an scientific outreach component, I've also written [a blog post](/blog/a-genealogical-look-at-shared-ancestry-on-the-x-chromosome/) about X genealogies and recent ancestry. See also Graham's terrific blog posts on [one's number of genetic ancestors](http://gcbias.org/2013/11/11/how-does-your-number-of-genetic-ancestors-grow-back-over-time/), [how much genome one shares with a particular ancestor](http://gcbias.org/2013/11/04/how-much-of-your-genome-do-you-inherit-from-a-particular-ancestor/), and the Thanksgiving question on everyone's mind: [how of my genome do I share with a particular cousin](http://gcbias.org/2013/12/02/how-many-genomic-blocks-do-you-share-with-a-cousin/)?
