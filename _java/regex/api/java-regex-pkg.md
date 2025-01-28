---
title: "java.util.regex"
sequence: "101"
---

[UP](/java/java-text-index.html)


The `java.util.regex` package consists of three classes:

- `Pattern` object is a compiled regex.
- `Matcher` object interprets the pattern and performs match operations against an input String.
- `PatternSyntaxException` object is an unchecked exception that indicates a syntax error in a regular expression pattern.

## Pattern

The `Pattern` class provides no public constructors.
To create a pattern, we must first invoke one of its public static `compile` methods,
which will then return a `Pattern` object. These methods accept a regular expression as the first argument.

## Matcher

The `Matcher` class also defines no public constructors.

We obtain a `Matcher` object by invoking the `matcher` method on a `Pattern` object.

## Reference

- [Pattern](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/regex/Pattern.html)
