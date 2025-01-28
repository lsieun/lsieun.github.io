---
title: "Data Compression"
sequence: "102"
---


**Data compression** is the process of applying an encoding algorithm to the given data to represent it in a smaller size.

Suppose you have a string, `777778888`. One way to encode it is `5748`,
which can be interpreted as “five sevens and four eights.”
By this encoding, you have reduced the length of the string from nine characters to four characters.
The algorithm you applied to compress `777778888` as `5748` is called **Run Length Encoding** (**RLE**).
The RLE encodes the data by replacing the repeated sequence of data by the counter number and one copy of data.
The RLE is easy to implement. It is suitable only in situations where you have more repeated data.

The reverse of **data compression** is called **data decompression**.
Here, you apply an algorithm to the compressed data to get back the original data.

There are two types of data compression: **lossless** and **lossy**.

In **lossless data compression**, you get your original data back when you decompress the data.
For example, if you decompress 5748, you can get your original data (777778888) back without losing any information.
You can get the information back in this example because RLE is a lossless data compression algorithm.
Other lossless data compression algorithms are LZ77, LZ78, LZW, Huffman coding, Dynamic Markov Compression (DMC), etc.

In **lossy data compression**, you lose some of the data during the compression process and
you will not be able to recover the original data fully when you decompress the compressed data.
Lossy data compression is acceptable in some situations, such as viewing pictures, audios, and videos,
where the audience will not see a noticeable difference when they use the decompressed data.
Compared to the lossless data compression,
lossy data compression achieves a higher compression ratio at the cost of the lower data quality.
Examples of lossy data compression algorithms are Discrete Cosine Transform (DCT),
A-Law Compander, Mu-Law Compander, Vector Quantization, etc.

`DEFLATE` is a lossless data compression algorithm,
which is used for compressing data in ZIP and GZIP file formats.
GZIP is an abbreviation for GNU ZIP.
GNU is a recursive acronym for GNU's Not UNIX.
The **ZIP file format** is used for **data compression** and **file archival**.
A **file archival** is the process of combining multiple files into one file for convenience of storage.
Typically, you compress multiple files and put them together in an archive file.

You may have worked with files with an extension of `.zip`.
A ZIP file uses the ZIP file format.
It combines multiple files into one `.zip` file by, optionally, compressing them.

If you are a UNIX user, you must have worked with a `.tar` or `.tar.gz` file.
Typically, on UNIX, you use a two-step process to create a compressed archive file.
First, you combine multiple files into a `.tar` archive file using the tar file format (tar stands for **T**ape **Ar**chive),
and then you compress that archive file using the GZIP file format to get a `.tar.gz` or `.tgz` file.
A `.tar.gz` or `.tgz` file is also called a **tarball**.
**A tarball is more compressed as compared to a ZIP file.**
A ZIP file compresses multiple files separately and archives them.
A tarball archives the multiple files first and then compresses them.
Because a tarball compresses the combined files together,
it takes advantage of data repetition among all files during compression,
resulting in a better compression than a ZIP file.

`ZLIB` is a general-purpose lossless data compression library.
It is free and not covered by any patents.
Java provides support for data compression using the ZLIB library.
`Deflater` and `Inflater` are two classes in the `java.util.zip` package
that support general-purpose data compression/decompression functionality in Java using the ZLIB library.
Java provides classes to support ZIP and GZIP file formats.
It also supports another file format called the JAR file format, which is a variation of the ZIP file format.
