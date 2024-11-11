---
title: "String"
sequence: "102"
---

```text
                             ┌─── copyValueOf()
                             │
                             ├─── format()
          ┌─── static ───────┤
          │                  ├─── join()
          │                  │
          │                  └─── valueOf()
          │
          │                                    ┌─── codePointAt()
          │                                    │
          │                                    ├─── codePointBefore()
          │                                    │
          │                                    ├─── codePointCount()
          │                  ┌─── codepoint ───┤
          │                  │                 ├─── codePoints()
          │                  │                 │
          │                  │                 ├─── offsetByCodePoints()
          │                  │                 │
          │                  │                 └─── regionMatches()
          │                  │
          │                  ├─── pool ────────┼─── intern()
          │                  │
          │                  ├─── bytes ───────┼─── getBytes()
          │                  │
          │                  │                 ┌─── charAt()
          │                  │                 │
          │                  │                 ├─── chars()
          │                  ├─── char ────────┤
          │                  │                 ├─── getChars()
String ───┤                  │                 │
          │                  │                 └─── toCharArray()
          │                  │
          │                  │                                 ┌─── isBlank()
          │                  │                 ┌─── is ────────┤
          │                  │                 │               └─── isEmpty()
          │                  │                 │
          │                  │                 │               ┌─── contains()
          │                  │                 │               │
          │                  │                 ├─── check ─────┼─── startsWith()
          │                  │                 │               │
          │                  │                 │               └─── endsWith()
          │                  │                 │
          │                  │                 │               ┌─── indexOf()
          │                  ├─── content ─────┼─── index ─────┤
          │                  │                 │               └─── lastIndexOf()
          │                  │                 │
          │                  │                 ├─── length ────┼─── length()
          │                  │                 │
          │                  │                 │               ┌─── contentEquals()
          │                  │                 │               │
          │                  │                 ├─── compare ───┼─── equalsIgnoreCase()
          │                  │                 │               │
          │                  │                 │               └─── compareToIgnoreCase()
          │                  │                 │
          │                  │                 └─── regex ─────┼─── matches()
          └─── non-static ───┤
                             │                                   ┌─── toUpperCase()
                             │                 ┌─── case ────────┤
                             │                 │                 └─── toLowerCase()
                             │                 │
                             │                 │                 ┌─── replace()
                             │                 │                 │
                             │                 ├─── replace ─────┼─── replaceAll()
                             │                 │                 │
                             │                 │                 └─── replaceFirst()
                             │                 │
                             │                 │                 ┌─── indent ───┼─── indent()
                             │                 │                 │
                             │                 │                 │              ┌─── strip()
                             │                 │                 │              │
                             │                 │                 │              ├─── stripIndent()
                             │                 ├─── blank ───────┼─── strip ────┤
                             │                 │                 │              ├─── stripLeading()
                             │                 │                 │              │
                             ├─── change ──────┤                 │              └─── stripTrailing()
                             │                 │                 │
                             │                 │                 └─── trim ─────┼─── trim()
                             │                 │
                             │                 │                 ┌─── split()
                             │                 ├─── split ───────┤
                             │                 │                 └─── lines()
                             │                 │
                             │                 │                 ┌─── concat()
                             │                 ├─── grow ────────┤
                             │                 │                 └─── repeat()
                             │                 │
                             │                 │                 ┌─── subSequence()
                             │                 ├─── shrink ──────┤
                             │                 │                 └─── substring()
                             │                 │
                             │                 │                 ┌─── transform()
                             │                 └─── translate ───┤
                             │                                   └─── translateEscapes()
                             │
                             │                 ┌─── describeConstable()
                             ├─── describe ────┤
                             │                 └─── resolveConstantDesc()
                             │
                             └─── format ──────┼─── formatted()
```

- [Java String](https://www.dariawan.com/tutorials/java/java-string/)
- [Java String Methods](https://www.dariawan.com/tutorials/java/java-string-methods/)
- [Java 9 - Compact String and String New Methods](https://www.dariawan.com/tutorials/java/java-9-compact-string-and-string-new-methods/)
- [Java 11 - New Methods in java.lang.String](https://www.dariawan.com/tutorials/java/java-11-new-methods-java-lang-string/)
- [Java 12 - New Methods in String](https://www.dariawan.com/tutorials/java/java-12-new-methods-string/)
