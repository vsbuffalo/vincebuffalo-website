---
layout: post
title: Simple Parallel Bioinformatics Pipelines with find, basename, and xargs
tags: 
 - hide
---
# Simple Parallel Bioinformatics Pipelines with find, basename, and xargs

## Big-Ass Servers and Data Parallelism

A routine operation in bioinformatics is to process a lot of files on
a so-called ["Big-Ass
Server"](http://jermdemo.blogspot.com/2011/06/big-ass-servers-and-myths-of-clusters.html). In
most cases, these have to be processed using the same tools, in the
same way, making this a prime example of data-parallism. The unit of
data divided across multiple cores is the file. 

Note that there's very little opportunity for task-parallism in
bioinformatics file processing pipelines. Consider a common task of
most bioinformatics sequencing projects (resequencing, RNA-seq, etc):
taking reads from many samples, running quality diagnostics, and
running adapter and quality trimming. None of these steps can be done
in a task-parallel fashion; they must be pipelined.

## Find-Basename-Xargs

Suppose in this example I have genomic sequencing data of 50 human
individuals. All individuals' sequences are in the directory `seq/`
and are semantically named in the format of
`{lane-number}-{individual-id}.fastq`. In this example, suppose I just
want to run each file through my adapter trimming program
[scythe](github.com/vsbuffalo/scythe) in parallel, using four cores.

For such tasks, I frequently use a design pattern I refer to as
"find-basename-xargs" (FBX hereafter). I doubt this is novel, but I do
refer to this specific design pattern frequently. I'll dissect an
example.

Our `seq/` directory contains many files we wish to trim with Scythe,
in parallel. The first step of FBX is to use the `find` command to
find all relevant files. In our case:

    $ find seq -name "*.fastq"
    seq/african-1.fastq
    seq/african-10.fastq
    seq/african-11.fastq
    seq/african-12.fastq
    # [...]

Next, `basename` is used to drop the extension and `seq/` directory,
which leaves us with only the identifying string (I think of this as a
key... you'll see why in a few weeks). Having just the identifying key
allows us to specify the output directory and any file suffixes. We
use `basename` with `xargs` because we're processing each incoming
line from stdin at a time (`-n1` specifes one argument will be taken
at a time). The command results would look like:

    $ find seq -name "*.fastq" | xargs -n1 -I{} basename {} .fastq
    african-1
    african-10
    african-11
    african-12
    # [...]

The argument `-I{}` specifes the replacement string. Since we're the
last positional argument of `basename` is `.fastq`, this is necesary.

Finally, we do the processing with `xargs`. GNU `parallel` also works,
and provides nice additional features. Scythe takes some fixed
arguments (adapter, prior) and file options dependent on the key
(input file, output file). So to run Scythe, on each file in parallel
and output the results to the trimmed directory, we'd use `xargs` with
`-n1 -P4 -I{}`. Our exact command would be:

    find seq -name "*.fastq" | \
      xargs -n1 -I{} basename {} .fastq | \
      xargs -n1 -P10 -I{} scythe -a adapters.fasta -p 0.4 -o trimmed/{}.fastq seq/{}.fastq

Note that we re-specify the directories and extensions so Scythe can
find and process the appropriate file.

## Redirecting Output in Parallel and XBF Chaining

I'm a stickler about gathering and analyzing statistics at all
intermediary steps in a bioinformatics processing pipeline. Scythe
will output summary statistics on found adapters in the reads, but it
prints it out to stderr. With hundreds of files being processed,
simple redirecting stderr to a file via `2>` is ineffective. Since
`xargs` is calling the program, there's no way to redirect a specific
Scythe calls' stderr to a specific file. 

My work around this is to wrap a command call in a bash shell
script. Our shell script would be incredibly simple (a better version
would ensure directories exist):
    
    #!/bin/bash
    set -o nounset
    set -e

    IN=$1
    echo " started running scythe on file '$IN'..." 1>&2
    scythe -a adapters.fasta -p 0.4 -o trimmed/$IN.fastq seq/$IN.fastq 2> stats/$IN-output.txt
    echo " completed scythe on file '$IN'." 1>&2
    echo $IN

And we could call it in the same fashion.

    find seq -name "*.fastq" | \
      xargs -n1 -I{} basename {} .fastq | \
      xargs -n1 -P10 bash run-scythe.bash

A few notes: output message to stderr, not stdout. This allows us to
*chain* the FBX pattern. When a file's processing is complete,
execution will proceed to the echo line and send this file's key to
the next step. This incredibly simple approach allows parallel steps
to be pipelined. If we use Sickle to do quality-based trimming, the
pattern is similar:

    find seq -name "*.fastq" | \
      xargs -n1 -I{} basename {} .fastq | \
      xargs -n1 -P10 bash run-scythe.bash | \
      xargs -n1 -P10 bash run-sickle.bash

