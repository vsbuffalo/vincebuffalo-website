---
layout: post
title: The Danger of Multireads in RNA-seq
tags:
 - hide
---

*Note: this is a draft! Please submit a correction if you see a problem.*

# The Danger of Multireads in RNA-seq

## Introduction

Experiments utilizing RNA-Sequencing (RNA-Seq) are taking
off. Suddenly researchers can assay the gene expression of non-model
organisms without having to pre-specify probe sequences and print
expensive microarray chips. The expression of novel isoforms and
unannotated genes can come through clearly. It's a great technology
for a variety of reasons, and the count nature of the data is
statistically interesting (I gave a short talk on this topic;
[slides here](github.com/vsbuffalo/rna_seq_talk)).

Recently, I've become concerned about an issue with RNA-seq data that
I believe *could* seriously confound analyses downstream of
RNA-seq. As with microarrays, many researchers are interested in
co-expressed genes after finding an initial list of differentially
expressed genes between treatments. The gene-centric approach of
finding a few differentially genes that should explain differences in
the treatment groups is simplistic; finding co-expressed genes via
statistical or machine learning methods can give important insights
into activated pathways, etc. All of these stem around one issue: the
**multiread**.

## The Multiread

A multiread is a read that maps equally well to more than one place on
the reference sequence (either a genome or transcriptome with RNA-seq,
more on this later). The default behavior of BWA is to randomly assign
a multiread to one of the positions it maps to (Bowtie has various
options). 

Even though this seems like insensible way of dealing with multireads,
it is very common (and also not as insensible as it seems *prima
facie*). Removing the reads is removing signal; keeping the reads and
using random assignment keeps the signal, but adds random noise.

## Why do we find multireads?

Let's conjecture where we might find multireads mapping. This is
conjecture because I'm still doing research into this topic; I will
report findings in this post in the future.

Consider a read that's 20 base pairs (super short, yes). We may start
with the question "is it rare that this sequence occurs twice
(non-overlapping) in a genome of 3 billion base pairs?" Assume both
the read and the genome sequences are random.

This question is non-trivial. To get a sense of how this is actually a
complex problem, I *highly* recommend
[Ted Donnnelly's TED talk](http://www.ted.com/talks/peter_donnelly_shows_how_stats_fool_juries.html)
for an illuminating example, But let's simplify it, and to do so, let
use monkeys and first ask an easier question: "is it rare that this
sequence occurs once in this 3 billion base pair genome?" If this is
sufficiently rare, two occurences is *extremely* rare.

Let's suppose that
[a monkey is pounding on a typewriter with four keys][1]. How long
before he types out our read of 20 base pairs, assuming uniform and
independent probability of hitting each key (i.e. he doesn't have a
tendency to hit `A` more often after `T`, and he doesn't hit `G` more
often than all other keys)? 

[1]: http://en.wikipedia.org/wiki/Infinite_monkey_theorem

If we look at the complement event, that he doesn't type out our read,
the probability is:

$$ P(X) = \left(1 - \frac{1}{4^{20}} \right)^n $$

With a random genome of 3 billion bases, the probability that we don't
see this read is 0.9972752 - very high. We can quickly see that the
probability of seeing two perfect matches of a 20bp in a 3 billion bp
genome is exceedingly rare. So why do we get multireads?

We get multireads for the same reason that
[the common probabilistic argument against evolution](http://www.mathematicsofevolution.com/ChaptersMath/Chapter_150__Probability_of_Evolution__.html)
weak: the genome is not a random string. In the case of multireads, we
have paralogs, gene-families, protein domains, and alternative
splicing that could lead to a sequencing mapping equally well to more
than a single location within the reference sequence.

Which of these leads to multireads in RNA-seq projects depends on the
choice of a reference sequence.

## Genome versus Transcriptome based RNA-seq experiments

Depending on how well-annotated an organism's genome is, RNA-seq may
be done with either the genome or the transcriptome. If no assembled
well-annotated genome exists, an organism's transcriptome (or an
assembled one from the RNA-seq reads) must be used as the reference in
mapping the reads.

### Alternative Splicing and Transcriptome Mapping

Suppose we have a transcriptome reference. Since we're dealing with
transcripts (and suppose we're dealing with a eukaryotic organism with
alternative splicing) we're going to have many transcripts that come
from the same gene region. If we have three transcripts from the same
gene region, they'll have common exons. These common exons will have
common sequence, and any cDNA read from this common sequence region
will be unable to be uniquely identified as belonging to a specific
transcript of the three. With the default behavior of BWA, the counts
will distributed across these transcripts.

Multireads caused by this are different in that they are caused by a
bioinformatic choice: the transcriptome mapping. Had these reads been
mapped to the genome, they would have all mapped to the same
exon. This is why transcript-level count data from a transcriptome
mapping can be seriously biased (more on this later), and one should
typically sum transcript counts up to the gene-level.

### Protein Domains, Paralogs, and Gene Families

RNA-seq experiments that map reads to the genome avoid the issues
caused by alternative splicing, at the expense that differential
isoform expression cannot be estimated (without special approachs). A
gene's counts for a particular sample is simply the number of reads
that map within the annotation exon regions of that gene... or is it?

This would be approximately true if the rest of the genome were random
(as above). However, conserved protein domains, paralogs, and entire
gene families could lead to a read mapping equally well to a few
locations. Since a gene duplication event is followed by mutations,
the extent of multireads due to paralogous regions may be minimal (I'm
currently looking into this).

As an aside, there is some simplification here: paired-end reads
certainly decrease this probability. In addition to multireads,
there's also the issue of equally well mapping reads with
mismatches. Consider a cDNA read aligned to the genome. Suppose this
read cross an exon splice boundary, so the last 5 bases *won't* map to
the genome's intron sequence. Instead, this gene maps to a
non-expressed paralog with only two base mismatches. This is a bit of
a contrived example, but it's not unreasonable to assume there's a
huge amount of complexity behind the effect of sequence homology in
gene counts.

## Bias due to multireads

### Underestimate of upregulated genes

These issues so far just seem to cause noise: a few reads that were
biologically from gene A are aligning to paralog B and paralog C. How
much could this affect an experiment?

Suppose gene A is upregulated so that its expression is twice the
normal value. However, since we have homologous regions in paralogs B
and C, some cDNA reads from A are now being mapping to B and C. This
leads to an underestimate of the true expression of A - this it the
first problem of multireads.

### Artifactual coexpression 

There's also another bias potentially caused by multireads:
artifactual coexpression. By this I mean groups of genes that appear
to have similar ("co-") expression across samples. Searching for
coexpression is a very common step in any gene expression study. Genes
never act alone, and one infer that coexpression of many genes is
unlikely to happen by chance and is thus biologically meaningful. If a
plant is responding to salinity stresses, its reaction will involve
detection, initiation of response, signalling, etc: all of these will
likely lead to some genes involve being coexpressed.

Multireads confound this assessment of coexpression. In our previous
example, we supposed that the expression of A increased two-fold. With
potentially paralogous sequence in B and C, we would see the
expression level be underestimated. However, we would also see the
expression of B and C rise in concert with *any* expression changes in
A. In effect, B and C are mirroring any changes in the expression of
A, leading to artifactual coexpression, that is, expression due merely
to the standard RNA-seq mapping procedures. The most unfortuante part
is that it's not biologically preposterous for genes in a gene family
to coexpressed, so no mental alarms may be sounded in the
bioinformatician or biologist's head.

## What can we do?


