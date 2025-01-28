---
title: "Entropy"
---

## Breaking Entropy

The truth is that, in practice, **it's entirely possible to compress data to a form smaller than defined by entropy**.
We do this by exploiting two properties of real data.
**Entropy**, as defined by Shannon, cares only about **probability of occurrence**, regardless of **symbol ordering**.
But **ordering** is **one fundamental piece of information for real data sets**, and so are **relationships between symbols**.

For example, these two sets, the ordered `[1,2,3,4]` and the unordered `[4,1,2,3]`, have the same entropy,
but you intuitively recognize that there is additional information in that ordering.
Or using letters, `[Q,U,A,R,K]` and `[K,R,U,Q,A]` also have the same entropy.
But not only does `[Q,U,A,R,K]` represent a word with meaning in the English language,
there are rules about the occurrence of letters. For example, Q is usually followed by U.

**The key to breaking entropy** is to exploit **the structural organization of a data set**
to transform its data into a new representation that has a lower entropy than the source information.

### Ordering Matters!

Entropy says that **the ordering of symbols** doesn't matter,
but **delta coding** proves that to not be the case.
If there's a high correlation between two adjacent values,
**delta coding** can transform the data in such a way that it changes the entropy to a lower value.

### Symbol Grouping Matters!

Symbol grouping proves that if there are various groupings of contiguous values in our data set,
we can use them to reduce entropy.
Basically, by preprocessing our data to find optimal symbol groupings, we get a lower entropy score.



Recall that every set of data has some informational content,
which is called its **entropy**.
The entropy of a set of data is the sum of the entropies of each of its symbols.
The entropy `S` of a symbol `z` is defined as:

