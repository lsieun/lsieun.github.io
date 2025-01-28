---
title: "Huffman Algorithm"
---

| Algorithm | lossless | prefix      |
|-----------|----------|-------------|
| Huffman   | lossless | prefix-free |

- Code length is based on probability of occurrence
- Message-by-message probabilities
- A binary tree

Huffman coding works by creating a binary tree of nodes, with each node being either a leaf node or an internal node.

All nodes are initially leaf nodes, and there is one leaf node for every character in the message being compressed.
Then the leaf nodes are combined with internal nodes to form the tree.

A leaf node contains the character and the frequency of usage for that character.

Internal nodes contain links to two child nodes plus a frequency
which is the sum of the frequencies of the two child nodes.

- A variable-length bit sequence

A different, variable-length bit sequence is assigned to each character used in the message.
The specific bit sequence assigned to an individual character is determined
by tracing out the path from **the root of the tree** to **the leaf** that represents that character.

By convention, bit `0` represents following the left child when tracing out the path and
bit `1` represents following the right child when tracing out the path.

- Path lengths are different

The tree is constructed such that the paths from the root to the most frequently used characters are short
while the paths to less frequently used characters are long.
This results in short codes for frequently used characters and long codes for less frequently used characters.

## References

- [Understanding the Huffman Data Compression Algorithm in Java](https://www.developer.com/java/understanding-the-huffman-data-compression-algorithm-in-java/)
