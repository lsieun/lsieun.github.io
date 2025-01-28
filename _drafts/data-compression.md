---
title: "Data Compression"
image: /assets/images/data-compression/data-compression-cover.jpg
permalink: /data-compression.html
---

In signal processing, **data compression** is the process of encoding information using fewer bits than the original representation.
Any particular compression is either **lossy** or **lossless**.  
**Lossless compression** reduces bits by identifying and eliminating statistical redundancy.
No information is lost in lossless compression.  
**Lossy compression** reduces bits by removing unnecessary or less important information.

**Data compression entails two processes**:
in one process the data is **compressed**, or **encoded**, to reduce its size;
in a second process it is **uncompressed**, or **decoded**, to return it to its original state.

## Lossless Compression

- [LZ77 Algorithm]({% link _data-compression/lossless/lz77.md %})
- [Huffman Algorithm]({% link _data-compression/lossless/huffman.md %})
- [Deflate Algorithm]({% link _data-compression/lossless/deflate.md %})

## Lossy Compression

## Checksum

- [Cyclic Redundancy Check]({% link _data-compression/check/crc.md %})

## All

{%
assign filtered_posts = site.data-compression |
sort: "sequence"
%}
<ol>
    {% for post in filtered_posts %}
    {% assign num = post.sequence | abs %}
    <li>
        <a href="{{ post.url }}" target="_blank">{{ post.title }}</a>
    </li>
    {% endfor %}
</ol>

## References

EBook

- Khalid Sayood 《Introduction to Data Compression》
- Understanding Compression

Website:

- [stanford: Data Compression](https://cs.stanford.edu/people/eroberts/courses/soco/projects/data-compression/overview/index.htm)
