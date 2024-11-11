---
title: "Modified UTF-8"
sequence: "103"
---

Modified UTF-8 (MUTF-8) originated in the Java programming language.

The Java programming language, which uses `UTF-16` for its internal text representation,
supports a non-standard modification of `UTF-8` for string serialization.
This encoding is called **modified UTF-8**.

Java represent characters as 16 bit chars,
but unicode has evolved to contain more than 64K characters.
So some characters, the supplementary characters, has to be encoded in 2 chars (surrogate pair) in Java.

## 从具体解析的值差异来看

The differences between modified UTF-8 and the standard UTF-8 format are the following:

- The null byte '\u0000' is encoded in 2-byte format rather than 1-byte, so that the encoded strings never have embedded nulls.
- Only the 1-byte, 2-byte, and 3-byte formats are used.
- Supplementary characters are represented in the form of surrogate pairs.

In Modified UTF-8, the `null` character (`U+0000`) uses
the two-byte overlong encoding `11000000 10000000` (hexadecimal `C0 80`),
instead of `00000000` (hexadecimal `00`).

```java
import lsieun.utils.BitUtils;
import lsieun.utils.HexUtils;
import lsieun.utils.UTFUtils;

public class HelloWorld {
    public static void main(String[] args) {
        String str = "\u0000";

        byte[] modified_bytes = UTFUtils.getModifiedBytes(str);
        System.out.println(modified_bytes.length);
        System.out.println(HexUtils.toHex(modified_bytes));
        for (byte b : modified_bytes) {
            System.out.println(BitUtils.fromByte(b));
        }

        byte[] standard_bytes = UTFUtils.getStandardBytes(str);
        System.out.println(standard_bytes.length);
        System.out.println(HexUtils.toHex(standard_bytes));
        for (byte b : standard_bytes) {
            System.out.println(BitUtils.fromByte(b));
        }
    }
}
```

```text
2
C080
11000000
10000000
1
00
00000000
```

Modified UTF-8 strings never contain any actual `null` bytes but can contain all Unicode code points including `U+0000`,
which allows such strings (with a `null` byte appended) to be processed by traditional null-terminated string functions.


## Java API

从 Java API 的角度来说，Standard UTF8 和 Modified UTF8 分别影响哪些具体的类（Class）或场景（Scence）呢？

In normal usage, the language supports standard `UTF-8`
when reading and writing strings through `InputStreamReader` and `OutputStreamWriter`
(if it is the platform's default character set or as requested by the program).
However it uses Modified `UTF-8` for object serialization among other applications of `DataInput` and `DataOutput`,
for the Java Native Interface, and for embedding constant strings in class files.

```text
                               ┌─── String
                               │
         ┌─── Standard UTF8 ───┼─── InputStreamReader
         │                     │
         │                     └─── OutputStreamWriter
         │
UTF 8 ───┤                                                   ┌─── DataInput
         │                     ┌─── object serialization ────┤
         │                     │                             └─── DataOutput
         │                     │
         └─── Modified UTF8 ───┼─── Java Native Interface
                               │
                               │
                               └─── class files
```
