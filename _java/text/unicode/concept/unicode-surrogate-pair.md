---
title: "双子星：Surrogate Pair"
sequence: "104"
---

## Intro

In the Unicode character encoding, characters are mapped to values between `0x0` and `0x10FFFF`.

Internally, Java uses the UTF-16 encoding scheme to store strings of Unicode text.
In UTF-16, 16-bit (two-byte) code units are used.
Since 16 bits can only contain the range of characters from `0x0` to `0xFFFF`,
some additional complexity is used to store values above this range (`0x10000` to `0x10FFFF`).
This is done using pairs of code units known as surrogates.

The surrogate code units are in two ranges known as "high surrogates" and "low surrogates",
depending on whether they are allowed at the start or end of the two-code-unit sequence.

Early Java versions represented Unicode characters using the 16-bit char data type.
This design made sense at the time,
because all Unicode characters had values less than 65,535 (0xFFFF) and could be represented in 16 bits.
Later, however, Unicode increased the maximum value to 1,114,111 (0x10FFFF).
Because 16-bit values were too small to represent all the Unicode characters in Unicode version 3.1,
32-bit values — called code points — were adopted for the UTF-32 encoding scheme.
But 16-bit values are preferred over 32-bit values for efficient memory use,
so Unicode introduced a new design to allow for the continued use of 16-bit values.
This design, adopted in the UTF-16 encoding scheme,
assigns 1,024 values to 16-bit high surrogates(in the range `U+D800` to `U+DBFF`) and
another 1,024 values to 16-bit low surrogates(in the range `U+DC00` to `U+DFFF`).
It uses a high surrogate followed by a low surrogate — a surrogate pair — to represent
(the product of 1,024 and 1,024)1,048,576 (0x100000) values between 65,536 (0x10000) and 1,114,111 (0x10FFFF) .

## Range

- `U+D800` - `U+DB7F`: High Surrogates
- `U+DB80` - `U+DBFF`: High Private Use Surrogates
- `U+DC00` - `U+DFFF`: Low Surrogates
- `U+E000` - `U+F8FF`: Private Use Area

![](/assets/images/java/text/UTF-16_encoding.svg)

## More Info

### Length

```text
"🌉".length()  //2, Expectations was it should return 1

"🌉".codePointCount(0,"🌉".length())  //1, To get the number of Unicode characters in a Java String  
```

### Equality

Represent "🌉" to String using Unicode `\ud83c\udf09` as below and check equality.

```text
"🌉".equals("\ud83c\udf09") // true
```

Java does not support UTF-32

```text
"🌉".equals("\u1F309") // false
```

## Reference

- [What is a "surrogate pair" in Java?](https://stackoverflow.com/questions/5903008/what-is-a-surrogate-pair-in-java) 这里有很多有用的知识，我没有整理
- [UTF-16](https://en.wikipedia.org/wiki/UTF-16)
    - [UTF-16_encoding.svg](https://upload.wikimedia.org/wikipedia/commons/5/58/UTF-16_encoding.svg)
