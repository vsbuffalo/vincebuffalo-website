---
layout: post
title: Using Names Pipes and Process Substitution in Bioinformatics
tags:
 - hide
---

# Using Names Pipes and Process Substitution in Bioinformatics

It's hard not to fall in love with Unix as a bioinformatician. In a
[past post](http://vincebuffalo.org/2013/01/26/bioinfo-interfaces.html)
I mentioned how Unix pipes are an extremely elegant way to interface
bioinformatics programs (and do interprocess communication in
general). In exploring other ways of interfacing programs in Unix,
I've discovered two great but overlooked ways of interfacing programs:
the named pipe and process substition.

## Where Pipes Don't Work

Unix pipes are great, but they don't work in all situations. A good
example is in the quality pipeline that my past colleagues and I at
the UC Davis Bioinformatics Core developed. We wanted a robust
workflow for removing adapter contamination and quality trimming
reads. I wrote [Scythe](https://github.com/vsbuffalo/scythe), a
Bayesian adapter trimmer and my coworker Nik wrote
[Sickle](https://github.com/najoshi/sickle), a single and paired-end
windowed quality trimmer. By our design, Scythe was meant to be run
first (since considers base quality in classifying adapters, even
low-quality bases can be informative), and then Sickle after. In
keeping with the
[Unix philophy](en.wikipedia.org/wiki/Unix_philosophy) ("write
programs that do one thing and do it well"), both programs were
separate, and needed to be interfaced somehow. The only problem is
that Sickle takes two files: adapter trimmed forward and reverse read
pairs. 

    $ scythe -a adapters.fa in1.fq > in1-scythed.fq
    $ scythe -a adapters.fa in2.fq > in2-scythed.fq
    $ sickle -t sanger -f in1-scythed.fq -r in2-scythed.fq \
	  -o in1-sickled.fq -p in2-sickled.fq -s in-singles-sickled.fq

Even if you're unfamiliar with these particular programs, you'll
notice that with two input files, a standard Unix pipe (`|`) wouldn't
work. Additionally, the two Scythe processes could be run in parallel,
as the contaminant removal is independent. With workflows like the
simple one above, we're not only missing out on the data parallelism
of running Scythe in parallel, but we're also needlessly reading from
and writing to the disk,
[a very slow operation](http://www.eecs.berkeley.edu/~rcs/research/interactive_latency.html).

## Named Pipes

One solution to this problem is to use **named pipes**. A named pipe,
also known as a FIFO (after First In First Out, a concept in computer
science), is a special sort of file we can create with `mkfifo`:


    $ mkfifo fqin
	$ prw-r--r--    1 vinceb  staff          0 Aug  5 22:50 fqin
	
You'll notice that this is indeed a special type of file: `p` for
pipe. You interface with these as if they were files, but they behave
like pipes: 

    $ echo "hello, named pipes" > fqin &
	[1] 16430
	$ cat < fqin
	[1]  + 16430 done       echo "hello, named pipes" > fqin
	hello, named pipes
	
Hopefully you can see the power despite the simple example. Even
though the syntax is similar to shell redirection to a file, *we're
not actually writing anything to our disk*. Note to that the `[1] +
16430 done` line is printed because we ran the first line as a
background process (to free up a promt). We could also run the same
command in a different terminal window. To remove the named pipe, just
use `rm`.

We could create and use two named pipes to solve our earlier
bottlenecks in running Scythe and Sickle, but Unix offers an even more
elegant way: process substitution.

## Process Substitution

**Process substitution** uses the same mechanism as named pipes, but
does so without the need to actually create a pipe. These are also
aptly called "anonymous named pipes". Named pipes are implemented in
most modern shells and can be used through the syntax `<(command arg1
arg2)`. The shell runs these commands, and passes their output to a
file descriptor, which on Unix systems will be something like
`/dev/fd/11`. This file descriptor will then be used in place of the
file argument, creating a simple interface. Running a command in
parenthesis in a shell invokes a seperate subprocess, so multiple uses
of `<()` are run in parallel automatically (schedule is handled by
your kernel here, so you may want to use this cautiously on shared
systems where more explicity setting the number of processes may be
preferable).

Our Scythe/Sickle workflow could then be expressed (and parallelized)
as:

    $ sickle pe -t sanger \
	  -f <(scythe -a adapter.fa in1.fq) \
	  -r <(scythe -a adapter.fa in1.fq) \
	  -o out1.fq -p out2.fq -s outs.fq 2> sickle.stderr

Scythe will trim the adapters from each file in a separate, parallel
subshell intsance and the results will be streamed to the anonymous
named pipe. The shell automatically inserts the path of the anonymous
named pipe in the `-f` and `-r` file arguments, and Sickle doesn't
know the difference. In fact, if we see this process in htop or with
ps, it looks like:

    $ ps aux | grep sickle
    vince  [...] sickle pe -f /dev/fd/63 -r /dev/fd/62 -t sanger -o out1.fq -p out2.fq -s outs.fq 2> sickle.stderr
	
## Speed

So, is this really faster? Yes, quite. 
	
