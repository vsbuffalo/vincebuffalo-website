---
layout: post
title: Please developers, don't be dicks.
---

# Please developers, don't be dicks.

As the author of a few open source tools, I've had my fair share of
users seeking help. Emails range from the very useful (bug reports,
patches, etc) to the annoying ("can you help guide me through this
process"). But never once (that I can remember) have I been a dick
(and yes, I've wanted to be). It will be tricky to write this without
sounding self-righteous, but I hope to make the case that open source
developers shouldn't be dicks in all cases.

## We've All Been There (WABT)

The first reason to never be a dick is that We've All Been There (I'm
going to give this the acronym WABT). Even the most voracious and
diligent manual readers can suffer from the [XY
problem](http://www.perlmonks.org/?node_id=542341). A user comes
asking how to do Y, which they think is the solution to X. However,
it's a bad solution to X and they don't know this. These situations
will always lead to frustration: users waste time explaining Y and
helpers waste time explaining how to do Y to realize the user wanted
X. But this is not the user's fault; it just takes programming
practice to realize Y is not the correct way to do X.

We've all had these problems in our early stages as developers. Being
a dick in these cases will not help the user grok anything. They're
already frustrated - that's why they're asking for your help. Being a
dick will cause them to get more frustrated and *really* not grasp
anything. They're not going to have an "ah ha!" moment when they're
too busy trying to come up with a witty response to your burn on IRC.

## PCTM has the same number of letters as RTFM

Please Check The Manual (PCTM) has the same number of letters as Read
The Fucking Manual (RTFM). I strongly believe it takes more energy for
a developer to be a dick than to be nice. We've all had dumb questions
that disrupt our workflow, make us angry, etc. But being a dick back
does not discourage this behavior. Write some boilerplate text for
responding to users' questions. Make this a FAQ. Then respond, PCTM
(Please Check the Manual) and send them the link. If they get needy,
tell them open source software doesn't come with a warranty.

## People remember dicks

Someone was once quite rude to me via email (I'll name him Tom). I had
voiced some frustrations with software Tom wrote and he attacked me
for these public comments. Now, as an aside, there's a lot of shitty
software out there, and signals about software quality (even noisy
signals) are *very valuable*. Tom on one hand attacked me for saying
something negative about his software, and on the other hand asked me
to help fix it, emphasizing it was open source software. I agree with
this sentiment 100%, however the email was clearly very angry.

I told another developer who I'll call Jerry about the encounter, and
he laughed. Apparently, Tom nagged Jerry about portability issues of
Jerry's software years ago. This is evidence of my first point,
WABT. It also shows that developers remember interactions with other
developers *really* well. Since then, I've also heard other
programmers complaining about interactions with Tom. This is all too
bad, as Tom is probably very nice in person and certainly a good
programmer.

## If you're a dick, you're hurting OSS

OSS has seen an explosion in recent years. Biologsts, ecologists, and
social scientists that never thought they'd write code are using R to
analyze data. Folks frustrated by Windows are installing Ubuntu and
asking for help. In the early days of the OSS, usenet, and IRC, it was
an acceptable norm to be a dick. Now, it's not.

OSS benefits from a large user base, but it will have growing
pains. Being a dick does not alleviate these pains, it makes them
worse. Let's go back to my story about Tom. 

In the second half of Tom's email (after attacking me), he asked me to
help him fix his software. Now, collaboration can be difficult; code
style clashes, merges fail, frustration is common. In a small project,
you're really in bed with your collaborators. Now that Tom has sent me
the signal he's nasty in correspondences, do you think I'll work on
this project with him? Hell no. I'd rather fork, fix the problem and
encourage others to use my software. Of course this is bad for OSS;
consider this passage from Eric S. Raymond's [Jargon
File](http://catb.org/jargon/html/F/forked.html):

> Forking is considered a Bad Thing - not merely because it implies a lot
of wasted effort in the future, but because forks tend to be
accompanied by a great deal of strife and acrimony between the
successor groups over issues of legitimacy, succession, and design
direction. There is serious social pressure against forking.

Tom's actions guarantee I will avoid working on his projects at all
costs. The two other developers, and anyone else we've told will
too. In the end, the software loses.

## Idolize programmers, not their dickishness

Some abrasive programmers are really gifted. Erik Naggum is regarded
as the [first Usenet
flamer](http://en.wikipedia.org/wiki/Erik_Naggum#Controversy). [Theo
de Raadt](http://en.wikipedia.org/wiki/Theo_de_raadt) forked NetBSD
into what became OpenBSD partially because of issues with other
developers. Richard Stallman gave an AMA on reddit a year ago and the
[most popular
question](http://www.reddit.com/r/gnu/comments/c8rrk/rms_ama/) (since
deleted) was about a young GNU-lover that was nervous about asking RMS
a question and accidentally referred to it as "Linux", not "GNU/Linux"
and RMS ripped him in half.

Now, all of these developers have been dickish and are well-known
because they are gifted visionaries. I'm not sure why, but other
developers admire this dickishness. But don't idolize their
dickishness, idolize their skill. There are also overwhelmingly nice
programmers: [John
McCarthy](http://en.wikipedia.org/wiki/John_McCarthy_(computer_scientist\)),
[Donald Knuth](http://en.wikipedia.org/wiki/Donald_Knuth), and [Alan
Turing](http://en.wikipedia.org/wiki/Alan_Turing) to name a
few. Admire their skill *and* their personality.

## Being a dick hurts science

<a href="http://www.flickr.com/photos/mclapics/6121420214/"
title="Science is great, open it (open science) by mclapics, on
Flickr"><img
src="http://farm7.staticflickr.com/6188/6121420214_7f4fe7200a.jpg"
width="500" height="333" alt="Science is great, open it (open
science)"></a>

There's been an explosion of open source software utilization in the
sciences. My field, bioinformatics, provides an interesting case
study. There are bioinformaticians like myself that write
software. Users are divided into other programmer types (other
bioinformaticians) and biologists (on average, less knowledgeable of
programming). All else equal, biologists and bioinformaticians prefer
free, open source software to costly proprietary software.

For these reasons, being helpful and nice to scientific users is
really important. For biologists, choosing tools is about getting
analysis done quickly and easily. Rude bioinformaticians will quickly
increase the cost of using OSS tools, which is already high for many
biologists who aren't experienced with Unix tools and
programming. Consequently, science could become less open, something
neither group wants.

