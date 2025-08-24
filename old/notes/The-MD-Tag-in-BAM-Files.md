Title: MD Tags in BAM Files
Date: 2014-01-17

I needed to work with the MD tag in BAM/SAM files for a recent project. There's
not too much discussion online about this, so I took some notes as I went
through examples. 

The MD tag is for SNP/indel calling without looking at the
reference. It does this by carrying information about the reference
that the read does not carry, for a particular alignment. A SNP's
alternate base is carried in the read, but without the MD tag or use
of the alignment reference, it's impossible to know what the reference
base was. Thus, this information is carried in the MD tag. A SNP looks
like:

```
10A3T0T10
```

Here, there are three SNPs:

1. 11 bases in from the *aligned portion of the read*, the reference
   has an A and the read has what ever base is at the 10th position
   (excluding softclips).

2. 15 bases in there's a T in the reference.

3. 16 bases in there's a T in the reference. Note that 0s are use used
   to indicate positions of neighboring SNPs.

Likewise, a reference would be necessary to know the deleted bases
from the reference in an alignment. The MD tag stores this information
too:

```
85^A16
```

Here, there are 85 matches, 1 deletion from the reference (the
reference has an A there and the read doesn't), and then there are 16
matches.

## Example 1: With Insertion

Note that insertions, since they don't represent a loss of information
about the reference, are not stored in MD flag. This has some
interested consequences. Let's look at an example:

```
read seq length: 101
CIGAR: 89M1I11M
MD: 100
```

Immediately, the surprising part is that the MD tag represents 100
matches to the reference, but the read length is 101 bases and the
CIGAR string is 101. This comes back to the core purpose of MD tags:
they only represent information about the read aligned to the
reference. There are 100 bases that align to the reference, and one
insertion that does not.

## Example 2: More Complex Insertion

```
read length: 101
CIGAR: 9M1I91M
MD: 48T42G8
name: HWI-ST222:4:1105:19266:186667#0 // for my reference
```
	
Here, there are SNPs (or errors) in the M (match/mismatch) parts of
the alignment. The total MD length is: 48 + 1 + 42 + 1 + 8 = 100,
which matches our read length *minus insertions*. What gets tricky
(and in my opinion slightly annoying) is that the match component of
the MD tag (the numeric parts) overlaps the insertion, but does not
show it. This means that our read sequence has an insertion at the
10th base. However, here is where things get tricky: the mismatch at
the 49th base (where the reference is a T according to the MD tag) is
actually the 50th base in the read. This is because MD ignores
insertions and we have a 1 base insertion upstream of the mismatching
T. The same is true with the other mismatch (reference has G):
according to MD tag, it's 48 + 1 + 42 + 1 = 92 bases in, but it's
actually 93 bases in.

As an aside, running `samtools calmd` with `-e`, which changes masking
bases to `=` really helps seeing these details. Read inspection in IGV
also helps.

## Example 3: Deletions

Deletions are stored in the MD tag, because these represent a loss of
information with respect to the reference. Let's look at a simple
example:

```
read length: 101
CIGAR: 56M1D45M
MD: 56^A45
read name: HWI-ST222:4:2101:12455:194028#0
```

CIGAR string length is: 56 + 1 + 45 = 102. MD length is 56 + 1 + 45
= 102.  This case is pretty trivial because deletions are indicated in
both the MD tag and CIGAR string

## Example 4: Insertions and Deletions

Here's a trickier example:

```
read length: 101
CIGAR: 31M1I17M1D37M
MD: 6G4C20G1A5C5A1^C3A15G1G15
read name: HWI-ST222:4:1208:7027:16535#0
```

That's a long one! Let's look at the total lengths of CIGAR string and
MD tag. CIGAR length: 31 + 1 + 17 + 1 + 37 = 87. Parsing this is quite tricky.

## Approaches

Initially I thought of a single-pass approach. This would almost
surely involve a finite state automaton that manages four states:
CIGAR token and MD token, read position, reference position. This is
quite tricky, so an easier approach is to rebuild the reference string
with the MD tag, and then use it to compare to the align read
(following positions from CIGAR string). This way only either MD or
CIGAR states need to be kept in focus at same time.
