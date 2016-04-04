Title: A Genealogical Look at Shared Ancestry on the X Chromosome

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

![A genealogy back five generations. <em>k</em> generations back, one has <em>2<sup>k</sup></em> ancestors. The shaded individual is a present-day female.](/images/genealogy.png)

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
material; a beautiful visualization of this is Morgan's original 1918
illustration of crossing over:

![](/images/morgan-crossover.svg)

When we look at how much DNA two relatives share (e.g. how much DNA my
grandmother and I share by looking at our 23andme results), we see it occurs in
large blocks.  Essentially, the fact that on average only one crossover occurs
per chromosome<sup>3</sup> per generation limits how much the genome is broken
up through the generations. While on average ¼ of my DNA should be identical to
my grandmother's DNA (we say such genetic material is **identical by descent**)
there's variance around this ¼ because the genome is a finite place and
recombination is limited. In other words, the fraction of my genome that
derives from my grandmother isn't like randomly sampling 6.6 billion marbles
(the number of basepairs in a diploid human genome), a quarter of which are
colored red (i.e. come from my grandmother) and the rest white (i.e. come from
my other ancestors). Rather, a more appropriate model is that these marbles are
connected by string that is cut and reattached (much like Morgan envisioned in
his illustration).

So if we wish to take genomic datasets and look at recent ancestry, 

In our paper and others (Donnelly 1983; Huff et al., 2011; Thomas et al., 1994)
this process of recombination breaking up genetic material back through the
generations is modelled as a stochastic process occurring along a chromosome.
In these approximations, each generation a Poisson-distributed number $B$ of
recombinational breakpoints fall uniformly over a chromosome. This creates
$B+1$ segments. As in Morgan's original illustration, this leads to
complementary gametes, with alternating paternal and maternal segments (the
black and white segments in the rightmost figure).  We approximate this
procedure by assuming each segment's state is randomly chosen by a coin-flip,
as this makes the later mathematics much easier (and as we show in the paper,
is a pretty good approximation).

In probabilistic models of 

## X Genealogies

![](/images/xtree.png)

<script src="/static/js/d3.v3.min.js" charset="utf-8"></script>
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
    height: 4em;
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



Auto chromosome: 
<div id="auto-family-arc"></div>
<div id="auto-desc" class="arc-text"></div>
<div id="auto-help" class="arc-text">loading...</div>

<div 

X chromosome: 
<div id="x-family-arc"></div>
<div id="x-desc" class="arc-text"></div>
<div id="x-help" class="arc-text">loading...</div>

<div id="xshared"></div>

<!-- requisite JS below -->
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
