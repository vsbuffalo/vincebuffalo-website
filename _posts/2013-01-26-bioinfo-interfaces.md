---
layout: post
title: Bioinformatics and Interface Design
tags:
 - hide
---

# Bioinformatics and Interface Design

Day to day bioinformatics involves interfacing and executing many
programs to process data. We end up with some refinement of the data
from which we extract biological meaning through data analysis. Given
how much interfacing bioinformatics involves, and how much time this
wastes, this process undergoes very little thought or design
optimization.

Much more attention is needed on the design of interfaces in
bioinformatics, to improve their ease of use, robustness, and
scalability. Interfacing is a low-level problem that we shouldn't be
wasting time on when there are much better high-level problems out
there. 

More bluntly, interfacing is currently an inconvenient glue that full
time bioinformaticians waste too many hours on. There is no better
illustration of this than by looking at how much time we waste in file
parsing tasks. Parsers are most commonly employed in bioinformatics as
crappy interfaces to non-standard formats. We need better designed
interfaces and cleaner interface patterns to help.

I'm hardly the only one to complain about this. Fred Ross had this
sadly accurate description:

> Estimating from my own experience and observation of my colleagues,
>  most bioinformaticists today spend between 90% and 100% of their
>  time stuck in cruft. Methods are chosen because the file formats are
>  compatible, not because of any underlying suitability. Second,
>  algorithms vanish from the field.... I’m worried about
>  the number of bioinformaticists who don’t understand the difference
>  between an O(n) and an O(n^2) algorithm, and don’t realize that it
>  matters.

Sadly he's [parting with bioinformatics](http://madhadron.com/?p=263),
leaving our field with one less person to fix things. If practices are
suboptimal and frustrating now, it's not because people are unprepared
to implement better approaches, it's because they're content with the
status quo because it does work. But, as I'll argue, we shouldn't be
wasting our time on this and much more elegant solutions exist.

## The Lisp Perspective

If none of this so far concerns you, you should to learn Lisp. Not to
use in bioinformatics, but because it will change your
perspective. Learning Lisp will allow you to see what high-level
*really* means, and you'll see how Common Lisp implementations like
SBCL beautifully allow the low-level to interact with the
high-level. SBCL implements Common Lisp's high-level elegance (the
[for macro](http://www.gigamonkeys.com/book/loop-for-black-belts.html)
is a good example), while simultaneously achieving [good
performance](http://benchmarksgame.alioth.debian.org/u32/benchmark.php?test=fasta&lang=all)
via [assembly-level
optimization](http://sbcl-internals.cliki.net/VOP). Even more
amazingly, with VOPs, you're writing highly-optimized low-level code
with high-level macros.

Why should you, the bioinformatician, care about this interactivity
between low-level and high-level code in some Lisp implementation
you've never heard of? Because bioinformatics involves a lot of
low-level and high-level interactivity. Command-line programs solve
low-level problems, usually with C or C++ implementations because they
need to do computationally intensive tasks like alignment or assembly,
on huge amounts of data quickly. But really we're interested in the
higher-level biological questions, which require tons of data
processing and execution of low-level programs to tackle. For small
tasks, bioinformaticians interface with these lower-level programs via
command-line interaction. For complicated execution pipelines that
require running many programs and passing data between them, it's
standard practice to write scripts that make systems calls to
programs, parse their output, and pass it to another program. This is
the current and de facto execution and interfacing practice that we
need to reassess, because if Lisp is somewhere on the elegance scale
near 9, this practice is around a 4.


## The Current Interfacing Practice and its Paradigm

The current practice is characterized by system calls from a scripting
language to execute larger bioinformatics programs, parse any output
files created, and repeat. In my mind, I see this as a paradigm
in which
[state](http://en.wikipedia.org/wiki/State_(computer_science)) is
stored on the file system, and execution is achieved by passing a
stringified set of command-line arguments to a system call.

This practice and paradigm has been the standard for bioinformatics for
ages. It's clunky and inelegant, but it works for routine
bioinformatics tasks. Portability of these pipelines involves awkward
tasks like ensuring all called programs are in a user's
`$PATH`. Program state is stored on the disk, the [slowest
component](http://www.eecs.berkeley.edu/~rcs/research/interactive_latency.html)
apart from the network. Here's a better look at how to [really
understand how costly storing state on a disk can be (zoom into this
image)](http://i.imgur.com/X1Hi1.gif).

Storing state on a slow, highly-mutable, non-concurrent component is
only acceptable if it's too big to store in memory. Bioinformatics
certainly has tasks that produce files too large to store in
memory. However, if a user had a task with little memory overhead, the
complete lack of interfaces other than the command-line to all
aligners, mappers, assemblers, etc would require the user write to the
disk. If they're clever, they can invoke a subprocess from a script
and capture standard out, but then they're back to parsing text as a
sloppy interface, rather than handling higher-level models or
objects. This needs to change.

While I'm maybe being a little harsh on the current paradigm, I should
say some parts are elegant. Unix piping is extremely elegant, and
avoids any latency due to writing to the disk between execution
steps. Workflows like this example from the samtools mpileup [man
page](http://samtools.sourceforge.net/mpileup.shtml) are clear and
powerful:

    samtools mpileup -uf ref.fa aln1.bam aln2.bam | bcftools view -bvcg - > var.raw.bcf  
    bcftools view var.raw.bcf | vcfutils.pl varFilter -D100 > var.flt.vcf  

The real drawback of the current system occurs when a user wants to
leverage the larger command-line programs for something novel. Most
aligners assume you want to align a few sequences, output the results,
and then stop. A user that wants an aligner to align a few sequences,
and then proceed down different paths depending on the output has to
go through the huge hassle of writing the sequences to a FASTA file or
serializing the sequences in the FASTA format, invoking a subprocess,
and then either passing it a filename, or (if the tool supports this),
passing the serialized string to the subprocess through standard
in. If the command-line tool has overheard for starting up, this is
incurred during each subprocess call (even if it could be shared and
the overhead amortized across subprocess calls).

## File Formats and Interfacing

To make matters worse, many bioinformatics formats like FASTA, FASTQ,
and GTF are either ill-defined or implemented differently across
libraries, making them risky interface formats. In contrast, consider
the elegance of Google's [protocol
buffers](http://code.google.com/p/protobuf/). This allow users to
write their data structures in the protocol buffer [interface
description
language](http://en.wikipedia.org/wiki/Interface_description_language),
and compile interfaces for C++, Java, and Python. This is the type of
high-level functionality bioinformatics needs to interface incredibly
complex data structures, yet we're still stuck in the text parsing
stone age.

## Foreign Function Interfaces and Shared Libraries

Foreign Foreign Interfaces to shared libraries are rare in
bioinformatics, likely due to [path
dependence](http://en.wikipedia.org/wiki/Path_dependence) more than
impracticality. Large bioinformatics programs like aligners,
assemblers, and mappers are most commonly written in C or C++, which
allow code to be compiled as a shared library relatively
painlessly. Nonetheless, execution of these programs is done via the
clunky system call interface.

So what is a foreign function interface? It's an interface through
which one programming language can call functions of another (foreign)
language. It's related to an Application Programming Interface (API),
which is a more general term referring to a type of protocol that
allows separate programs to interface. But FFIs are mostly lower level
than APIs. 

FFIs could solve a few problems for bioinformaticians. First, they
would allow much more code recycling: rather than writing your own
FASTA/FASTQ parser, you can just link against a shared library with
that routine. Instantly, that shared library can be separately
developed and improved. Wonderfully, compilers optimize the hell out
of everything, so any routines in your library that aren't used by
your code won't make it into your executable.

Second, FFIs allow modularity. Genome assemblers are packed to the
gills with useful functions. So are aligners. Yet unless the developer
took the time to separate this out via subcommand or API (like git or
samtools), you're unlikely to ever be able to access this
functionality. Developers with an eye for better program design will
write higher level functions that could be utilized through a
FFI. Now, novel bioinformatics tasks that may require a tiny call to
an assembler, or a few parallel calls to an aligner can be tackled
without the system call rubbish, or re-implementing everything.

With FFIs, functionality in a shared library can be wrapped in the
higher-level scripting languages we most commonly use. Rather than
wrapping entire programs through the command line (as [BioPython
does](http://github.com/biopython/biopython/blob/master/Bio/Align/Applications/_Muscle.py)),
we can wrap low-level function to borrow functionality, or high-level
functions to run entire programs with more direct interfaces.

Note that I'm not arguing that your average biologist should suddenly
start trying to understand [position-indepedent
code](http://en.wikipedia.org/wiki/Position-independent_code) is and
compile shared libraries to avoid making systems calls in their
scripts. Sometimes a system call is the right tool for the job. But
bioinformatics software developers should reach for a system call not
because it's the only interface, but because it's the best interface
for a particular task. Maybe someday we'll even see thin wrappers
coming packaged *with* bioinformatics tools (even if under `contrib/`
and written by other developers) — I can dream, right?

## FFI in Practice

Here's an example in practice: I needed to assemble many sets of
sequences for a pet project. I really wanted to avoid needlessly
writing FASTA files of these sets of sequences to disk, as this is
quite costly. However, most assemblers were designed solely to be
interfaced through the command-line. The inelegance of writing
thousands of files, making thousands of system calls to an assembler,
then reading and parsing the results not appealing, so I wrote
[pyfermi](http://github.com/vsbuffalo/pyfermi), a simple Python
interface to [Heng Li's](http://lh3lh3.users.sourceforge.net/) [Fermi
assembler](https://github.com/lh3/fermi) (note that this software is
experimental, so use it with caution). First off, I couldn't have done
this without Heng's excellent assembler and code, so I owe him a debt
of gratitude. The Fermi source has a beautiful example of high-level
functions that can be interfaced with relative ease: see the
`fm6_api_*` functions used in
[example.c](https://github.com/lh3/fermi/blob/master/example.c).

I was able to write a few extra C functions in pyfermi (mostly to deal
with `void *` necessary because Python's ctypes can't handle foreign
types AFAIK), and
[compile](https://github.com/vsbuffalo/pyfermi/blob/master/Makefile)
Fermi as a shared library. Was able to do all this in *far* less time
than it would have taken me to go down the route of writing thousands
of files and making syscalls.

## The Importance of Good Tools

Overall, we need to be more conscious of the tools we use, and how we
use them. I strongly believe tools and methods shape how we look at
and solve problems. A data programmer only trained in Perl will likely
at some point wage a messy war trying to produce decent statistical
graphics. Likewise, a statistician only trained in t-tests and ANOVA,
will only see normally distributed data (and apply every
transformation under the sun to force their data into this shape). I'm
hardly the first person to argue that this occurs: this idea is known
as the **law of the instrument**. Borrowing a 1964 quote from Abraham
Kaplan (and
[Wikipedia](http://en.wikipedia.org/wiki/Law_of_the_instrument#History)):

> I call it the law of the instrument, and it may be formulated as
> follows: Give a small boy a hammer, and he will find that everything
> he encounters needs pounding.

Earlier in our bioinformatics careers, we're trained in file formats,
writing scripts, and calling large programs via the command-line. This
becomes a hammer, and all problems start looking like nails. However,
the old practice and paradigms are breaking down as the scale of our
data and the complexity of our problems increase. New School
bioinformatics is needed, so let's start
[talking](http://twitter.com/vsbuffalo) about how we do it.
