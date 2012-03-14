---
layout: post
title: Some Ramblings on Machine Learning in Science
---

# The Unbelievable Debate: Some Ramblings on Machine Learning in Science

In between refactoring some `qrqc` code this morning and looking at
RNA-seq data, I grabbed some cold brew coffee and caught up on some
missed tweets. Admittedly, my brain glosses over most tweets, but
[this tweet](https://twitter.com/#!/drewconway/status/176725770885017600)
from Drew Conway had the right mix of keywords to actually make me
click and read the link:

> The data science debate: domain expertise or machine learning? by
>  @medriscoll http://bit.ly/zr17Z2

I don't mean for this title to be inflammatory, but I do believe this
debate is a bit unbelievable. Machine learning *is* magical; I imagine
that everyone that has studied it goes through a
[hype cycle](http://en.wikipedia.org/wiki/Hype_cycle)-like set of
epiphanies. This is my hype cycle story, and why I believe machine
learners need to calm down, collaborate with domain experts, and
together tackle hard problems.

## Social Sciences and Machine Learning Caution

<a href="http://www.flickr.com/photos/lselibrary/3990093924/"
title="Restored Phillips Machine, 1993 by LSE Library, on Flickr"><img
src="http://farm3.staticflickr.com/2459/3990093924_2de07186ae.jpg"
width="390" height="500" alt="Restored Phillips Machine, 1993"></a>
*[MONIAC](http://en.wikipedia.org/wiki/Moniac): social science machine learning?*

Biologists, it's true: I'm not one of you. I'm a transplant from the
social sciences. Specifically, from political science and economics
(with statistics too), where my interests lie in methodology and
comparative politics.

In the social sciences, the dimensionality of most problems is small
enough that data mining is (at least in my experience) frowned upon. A
lot of political data is collected by hand, often by undergraduates
toiling away for meager pay as they try to understand some cryptic
event coding protocol. There are some very large *p* data sets: The
[Political Instability Task Force's](http://globalpolicy.gmu.edu/pitf/)
data set is something I'll keep mentioning. Mining this data with
algorithms *looking* for interesting relationships was exactly how I
was taught *not* to do political science.

I recall one story of a candidate giving a job talk mentioning he used
forward step-wise regression to find interesting variables (in a
presumably small *p* data set) and three people immediately stood up
and left. I was proud to be knowledgeable of, but avoid statistical
learning techniques. Political science had flirted with neural
networks to understand massive state failure data sets, but my endless
gripe was there these were *predictive*, not *causal* models. The
latter required some *a priori* testable theory, often derived from an
intimate knowledge of political crisis in a variety of countries. Just
as I thought biologists knew *c. elegans* or *s. cerevisiae* well
enough to form interesting experiment ideas, political scientists knew
many political crises well enough to form theories and test them on a
larger set of data in a quantitatively rigorous fashion. I also
believed that predictive models of state failure may predict recorded
(even when out-sample!) state failures well, but a model backed in a
good theory that fits existing data slightly less well could predict
unseen cases even better
([Bruce Bueno de Mesquita has an entire wonderful book about game theory being such a model](http://www.amazon.com/Predictioneers-Game-Brazen-Self-Interest-Future/dp/1400067871)).


## The Machine Learning Awakening

When I made the jump to analyzing gene expression data, I was
initially astounded at how many algorithms were thrown at it. I had
this vision of the hard sciences having randomization and
experimentation at their disposal to lead to the purest causal
findings. Looking for any differences in 30,000 genes' expression
values and then forming hypotheses after seemed backwards. Microarrays
shocked biology with what they revealed about cancer and the cell, but
they probably shocked the methods of experimental biology more. If
your average biologist had a tenuous knowledge of p-values to begin
with, now microarrays analysts were throwing around false discovery rates,
empirical Bayesian techniques, Storey's q-value, etc. 

However, as I analyzed more and more sets of data, the initial
reluctance I had about employing machine learning algorithms
disappeared. In hype cycle terms, I was climbing the peak of inflated
expectations. A quote from Michael E. Driscoll's article captures
this excitement:

> Claudia Perlich, a three-time winner of the KDD Nuggets competition,
> stood up and shared how she had won contests in domains as varied as
> "breast cancer, movie prediction, and sales performance - and I can
> tell you I knew next to nothing about those things when I started."

This optimism is abundant, and not entirely without
justification. Coming from a non-biological background yet thoroughly
understanding machine learning provides an immensely satisfying
feeling of understanding of the cell. Employing all sorts of machine
learning techniques, I could find "biologically interesting" genes in
data sets and help biologists understand the cell.

## A Few Epiphanies and a Dip of Disillusionment

The Hype Cycle's lowest stage is the "trough of
disillusionment". Machine learning in biology certainly hasn't had its
trough (and I don't think it will), but it is priming up to have its
"slope of enlightenment" and "plateau of productivity". There will be
future machine learning hype cycles in biology, especially as multiple
heterogeneous data sets need to be simultaneously mined to understand the
cell with the systems approach.

My personal dip didn't happen because machine learning left me with a
particularly terrible result - it occurred because (1) because of an
interaction I had with an experimental biologist and (2) I realized
how wonderfully complex the cell is.

### Let's Put That in This

The first interaction I had was with a graduate student friend of
mine. We were discussing an interesting finding the Korf Lab made:
that some introns lead to increased expression
([paper here](http://www.frontiersin.org/plant_genetics_and_genomics/10.3389/fpls.2011.00098/full)). Introns
traditionally haven't had the same attention as promoters of enhancers
in regulating gene expression. A member of the Korf lab had previously
mentioned intron-mediated expression in passing to me, and I
immediately started imagining what ways I could look for such an
effect *in silico*. As I understood it, *in silico* was how it was
first discovered, further increasing my admiration of algorithms
applied to biology. When my friend mentioned it again, the first thing
she said was, "well, we just need to take that intron and put it in
something".

I immediately agreed, but I realized something: I hadn't thought of
that simple step the first time I thought about intron-mediated
expression. Machine learning can bring so much wealth in finding
interesting relationships that my mind had glossed over the most
important question in science: whether these relationships were
spurious or causal. This is why my training in the social sciences was
rigidly anti-machine learning: it's far too easy to let our thought
processes about *understanding* a complex system be biased by some
spurious relationships machine learning and predictive models can
quickly give us.


### The Complexity of the Cell

The epiphany was gradual (and still occurring): the cell is
wonderfully complex, or as my mind puts it "fucking awesomely
complex". Machine learning applied to gene expression data gives
valuable insights into a complex system, but it's really a messy
snapshot. I think we'll look at current pristine RNA-seq experiments
in twenty years and we'll realize they're giving us an image into
cellular activity that is akin to a photograph from a cheap Soviet-era
camera.

Measuring gene expression from many cells glosses over interesting
variation in each cell; this is certainly not a new
complaint. However, even a *single* cell image is messy: mRNAs that
make their way into gene expression values may have never been
exported from the nucleus, they could have been degraded by the cell,
silenced, undergone post translational modification, etc. What's
astounding is that these systems are not just complex, but are
amazingly accurate. Cellular data is messy, but the cell certainly
isn't. Development is a prime example of how tightly regulated these
processes are. It's up to us to understand these tightly regulated
systems with the messy images scientific data gives us. Machine
learning is a necessary, but not sufficient tool to help us understand
the cell.

As an example, genes interact in groups, and many algorithms can gloss
over this detail. If an algorithm tries to find a sparse set of genes
that are biologically interesting to the problem at hand, it may be
indifferent to which it includes from a set of co-expressed genes
(consider the lasso against the elastic net here). If a biologist
reviews these findings, they could easily miss something vastly
important based on machine learning's indifference.

## Let's Use Both.

These epiphanies are now what guides my path through biology and
machine learning. I still love and am infatuated with machine learning
(although, I much prefer the phrase statistical learning). However, if
we wish to understand a complex system, we need to take the approach
that modern biology does: leverage machine learning with *a priori*
biological expert knowledge to bootstrap findings. We need to design
experiments that also harness the power of machine learning to help us
*understand*, and not just *predict* the behavior of complex
systems. Applied machine learners need to realize the power of
experimental data. Chances are if you're finding everything you think
is out there with just machine learning, you're making a mistake or
your problem is too simple.

