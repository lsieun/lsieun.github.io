---
title: "Coding"
---

When we talk about **coding**, we mean the assignment of **binary sequences** to elements of an **alphabet**.
The set of binary sequences is called a **code**, and the individual members of the set are called **codewords**.
An **alphabet** is a collection of symbols called **letters**.

```text
coding: binary sequences --> alphabet
```

For example, the alphabet consists of the 26 lowercase letters, 26 uppercase letters, and a variety of punctuation marks.
In the terminology, a comma is a letter.
The ASCII code for the letter `a` is `1000011`, the letter `A` is coded as `1000001`,
and the letter “,” is coded as 0011010.
Notice that the ASCII code uses the same number of bits to represent each symbol.
Such a code is called a **fixed-length code**.
If we want to reduce the number of bits required to represent different messages,
we need to use a different number of bits to represent different symbols.
If we use fewer bits to represent symbols that occur more often,
on the average we would use fewer bits per symbol.
The average number of bits per symbol is often called the **rate of the code**.
The idea of using fewer bits to represent symbols that occur more often is the same idea that is used in Morse code:
the codewords for letters that occur more frequently are shorter than for letters that occur less frequently.
For example, the codeword for `E` is `·`, while the codeword for `Z` is `− − · ·.




