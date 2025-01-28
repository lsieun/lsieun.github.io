---
title: "The Five Buckets of Compression Algorithms"
---

Data compression algorithms are a really, really big space.
Fortunately, these algo‐ rithms fall into a few buckets, which makes things a lot easier to understand.
To throw the words at you, they are **variable-length codes**, **statistical compression**, **dictionary encodings**,
**context modeling**, and **multicontext modeling**.

Each of these five high-level buckets contains a horde of algorithm variations, which is a good thing;
each variation differs slightly in intended input data, performance, memory constraints, and output sizes.
Picking the correct variant means carrying out tests on your data and the encoders to find the one that works best.

Data compression is a practical application of Shannon's research, which asks, “How
compact can we make a message before we can no longer recover it?”


It is important to realize that a **symbol** is not necessarily a character of **text**:
a symbol can be any amount of data we choose, but it is often one byte's worth.

