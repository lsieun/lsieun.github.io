---
title: "Unicode And Java"
sequence: "103"
---

## Java 与 Unicode 的关系

在 `java.lang.Character` 类的文档中，有 Java 与 Unicode 的对应关系：

| Java Release | Unicode Version |
|--------------|-----------------|
| Java SE 15   | Unicode 13.0    |
| Java SE 13   | Unicode 12.1    |
| Java SE 12   | Unicode 11.0    |
| Java SE 11   | Unicode 10.0    |
| Java SE 9    | Unicode 8.0     |
| Java SE 8    | Unicode 6.2     |
| Java SE 7    | Unicode 6.0     |
| Java SE 5.0  | Unicode 4.0     |
| Java SE 1.4  | Unicode 3.0     |
| JDK 1.1      | Unicode 2.0     |
| JDK 1.0.2    | Unicode 1.1.5   |

In Java, a Unicode escape sequence starts with the characters `\u` followed by **four hexadecimal digits**
that represent the Unicode code point of the desired character.

```java
public class UnicodeCharacterDemo {
    public static void main(String[] args) {
        // Unicode escape sequence
        char unicodeChar = '\u0041';
        // point for 'A'
        System.out.println("Unicode Character: " + unicodeChar);
    }
}
```

```text
Unicode Character: A
```

## Reference

- [Fun with Unicode in Java](https://www.codetab.org/post/java-unicode-basics/)

