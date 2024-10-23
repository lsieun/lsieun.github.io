---
title: "String"
sequence: "101"
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
