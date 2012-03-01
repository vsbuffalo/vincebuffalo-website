---
layout: post
title: The Biologists' Guide to Information Theory
tags:
 - hide
---

# The Biologists' Guide to Information Theory

## Introduction

Information theory is the study of the quantification of
information. The father of information theory is
[Claude Shannon](http://en.wikipedia.org/wiki/Claude_E._Shannon), who
wrote *A Mathematical Theory of Communication* in 1949 while working
at Bell Labs.

To many biologists (and bioinformatians), information theory appears
cryptic and as a result, not of immediate use. However, understanding
the basics of information theory will open up vast methodological
doors, as it's a widely used bases for many analysis techniques.

In my opinion, it's more difficutlt to understand information theory
theory in the context of biology than in the context of communication
(for which it was intended). Thus, to explain information theory to
the biologist, you'll have to trust me that I'll make it relevant at
the end. Most introductions to information theory I've seen don't
involve the context through which it was invented: communication and
compression.

Before I delve into information theory, note that I am not an expert
in this field. If you are, and find a glaring mistake, please let me
know.

## Communication & Compression

There's no more terse and excellent an introduction to communication
that this sentence from Shannon's 1948 paper:

> The fundamental problem of communication is that of reproducing at
>  one point either exactly or approximately a message selected at
>  another point.

The choice of "exactly" or "approximately" a message is related to the
notions of
[lossless](http://en.wikipedia.org/wiki/Lossless_compression) and
[lossy](http://en.wikipedia.org/wiki/Lossy_compression)
compression. Lossy compression discards some information, while
lossless compression does not.

Lossy compression may seem like a terrible idea, but depending on
*what* you lose, it may not me. For example, the sentence:

> They are bombing the north end of the city at 12:40 at night.

with random words discarded is incomprehensible:

> are the end city at 40 night.

Certainly this wouldn't be enough information to warn the people at
the north end of the city of an upcoming attack if it were sent to
them as a communication. It's clear why: words carry different weight
(or information) in a communication. Conjuctions like "the" and "at"
aren't as crucial as nouns "north" and "bomb". Consider this lossy
compression:

> They bomb north end at 12:40 night.

The first message was 61 characters; this message is 35. If it's 12:39
and you're messaging this signal via giant placcards with letters on
them, you're going to opt for this lossy latter message.

However, you don't need lossyness to compress messages. Lossless
compression is used frequently: if you've ever zipped a file, you've
used lossless compression. Even though a zipped and unzipped
dissertation with lossy compression may have the original meaning
preserved, we'd be hard-pressed to find a graduate student willing to
try. Thus, our focus shifts to lossless compression and the limits of
this.

## Lossless compression

How can we compress a message and not lose any of the original? Let's
work with the idea of bits and bytes. If we encode written information
in [ASCII](http://en.wikipedia.org/wiki/Ascii) there are 256 different
characters that we encode for. For example, ASCII 81 refers to the
letter "Q". 81 in binary is 01010001. The leading zero is added to
indicate that that this fits in eight bits, which is known as a byte.

If I transmit our message "They are bombing the north end of the city
at 12:40 at night." in ASCII, it will be 61 bytes, as each of the 61
characters can be encoded in one byte.

How can we compress this? Let's use some R to statistically analyze
this message:

    > table(strsplit('They bomb north end at 12:40 night.', '')[[1]])
    
        : . 0 1 2 4 a b d e g h i m n o r t T y 
      6 1 1 1 1 1 1 1 2 1 2 1 3 1 1 3 2 1 3 1 1

`table` reveals two things: space is the most frequent character in
this message and there certainly aren't 256 different characters in
this message. There are actually only 21 different symbols, yet we
still use the full byte to represent each one. We could use five bits
(2^5 = 32) to represent the 21 characters, and still have some bits
left over. Since our new 21 character system is non-standard (unlike
ASCII), we'd have to transmit our new alphabet with it, which
increases the message size.

If we had to encode a message following this message that had an extra
10 characters, we'd have to (1) expand our character set and (2)
again, transmit this new alphabet with the original. Thus, we have to
be careful with how we choose our system.

Either way, we're still working with a fixed-length code per
character. If we look at Morse code, we see Samuel Morse's insight
(although not immediate): encode frequent characeters like "e" into a
code with a smaller length symbol, like an single dot. Other, less
frequent letters are encoded with a longer symbol, like dash dash dot
dot. Note that Morse code operators use an encoding system that has an
alphabet size of four: dot, dash, letter pause, word pause. In
contrast, our alphabet size with binary was two: 0 and 1.


    > t = paste(readLines('http://www.gutenberg.org/cache/epub/76/pg76.txt'), collapse=" ")
    > table(strsplit(t, '')[[1]])
  
    -      ,      ;      :      !      ?      .      '      " 
    1 119666   3052   8199   1563    450    516    729   5015   5404   3194 
    
    (      )      [      ]      @      *      /      #      %      $      0 
    42     42      2      2      2     28     24      1      1      3     27
    
    1     2      3      4      5      6      7      8      9      a      A 
    60     14     16     10     14     12     11      9      9  35667    912 
    
    b      B      c      C      d      D      e      E      f      F      g 
    6814    624   8059    253  23316    438  48373    707   7736    178  10422 
    
    G      h      H      i      I      j      J      k      K      l      L 
    310  25410    927  23762   4457    688    523   5596     81  17054    392 
    
    m      M      n      N      o      O      p      P      q      Q      r 
    9910    428  32226    590  36160    537   5609    362    180      9  19895 
    
    R      s      S      t      T      u      U      v      V      w      W 
    354  24089   1102  40775   1612  13733    221   2874     70  12134   1213 
    
    x      X      y      Y      z      Z 
    379     74   9894    419    179    6 
    
Again, space is the most common character, followed by "e", then "t",
"o", etc. There's only one percent sign, yet the original file is
still using a whole byte to convey this information.

Suppose represent space with a single 0, "e" with a single "1", and
"t" with "01", and a similar
[variable-length encoding](http://en.wikipedia.org/wiki/Variable-length_code)
for all other letters. If we send the message "te te", it would be
"0110011". However, since we're using a varible length encoding,
there's a uncertain decoding: this could also be the message " ee
te". If we use a delimiter like ";" and add it to our alphabet, we
lose some of the advantage of our compression because we have a longer
message: "01;1;0;01;1". With digital communications, we can't add an
extra symbol for ";", so it would need to be represented as a unique
symbol like "1111", again increasing our message size (and still not
able to be uniquely decoded!).

This is were [prefix codes](http://en.wikipedia.org/wiki/Prefix_code)
are useful: a encoding system with the "prefix property" means that no
symbol can "nest" or be the start of another symbol. With our old
system, the code symbol for space ("0") is the first character of the
code symbol for "t" ("01"), which breaks the prefix property. If
instead we use "000" for "e", "111" for space, and "0110" for "t", we
have variable lengths for each code symbol and there's not uncertainy
in decoding the message "01100001110110000". 

To reemphasize, it's worth going through all this trouble of dealing
with a variable-length encoding scheme because it allow us to take the
most frequent characters like space and "e" and turn them into a
coding symbol like "000" that is much shorter than a byte. In essence,
*we're using the statistical properties of the information we're
transmitting to compress it*.

## Entropy

Information theory is concerned partially with these quantifiable
properties of information. These properties of information
mathematically
[limit how much a message can be losslessly compressed](http://en.wikipedia.org/wiki/Source_coding_theorem), 

## Mutual Information

## Kullback-Leibler Divergence

