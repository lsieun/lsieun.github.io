---
title: "PathMatcher"
sequence: "102"
---

[UP](/java/java-io-index.html)

## 概览

`FileSystem` 是一个『支撑平台』，是 `Path` 和 `PathMatcher` 进行匹配的共同基础。

```text
                                     ┌─── path ──────┼─── getPath()
                 ┌─── FileSystem ────┤
                 │                   │                                        ┌─── regex
                 │                   └─── matcher ───┼─── getPathMatcher() ───┤
path.matching ───┤                                                            └─── glob
                 │
                 ├─── PathMatcher ───┼─── matches(path)
                 │
                 └─── Path
```

```java
@FunctionalInterface
public interface PathMatcher {
    boolean matches(Path path);
}
```

```java
public abstract class FileSystem implements Closeable {
    public abstract PathMatcher getPathMatcher(String syntaxAndPattern);

    public abstract Path getPath(String first, String... more);
}
```

- `syntaxAndPattern`, which identifies **a pattern language (syntax)** and **a pattern (pattern)** via this syntax:

```text
syntax:pattern
```

Two pattern languages are supported: `regex` and `glob`.

## Regex

## Glob

Alternatively, you can specify glob for syntax.
**The glob pattern language is more limited than regex;**
it resembles regular expressions with a simpler syntax.

The JDK documentation offers **several examples** of **glob expressions**:

- `*.java`: Match a path that represents a file name ending in `.java`.
- `*.*`: Match file names containing a period character.
- `*.{java,class}`: Match file names ending with `.java` or `.class`.
- `foo.?`: Match file names starting with `foo.` and a single character extension.
- `/home/*/*`: Match Unix-like paths such as `/home/gus/data`.
- `/home/**`: Match Unix-like paths such as `/home/gus` and `/home/gus/data`.
- `C:\\*`: Match Windows-like paths such as `C:\foo` and `C:\bar`.
  (The backslash is escaped. As a Java string literal, the pattern would be `C:\\\\*`.)


The JDK documentation also identifies **several rules** for interpreting **glob patterns**:

- The `*` character matches zero or more characters of a name element without crossing directory boundaries.
- The `**` characters match zero or more characters crossing directory boundaries.
- The `?` character matches exactly one character of a name element.
- The backslash character (`\`) is used to escape characters that would otherwise be interpreted as special characters.
  For example, the expression `\\` matches a single backslash and the expression `\{` matches a left brace.
- The `[` and `]` characters delimit a bracket expression that
  matches a single character of a name element out of a set of characters.
  For example, `[abc]` matches `a`, `b`, or `c`.
- The hyphen (`-`) may be used to specify a range, so `[a-z]` specifies a range that matches from `a` to `z` (inclusive).
  These forms can be mixed, so `[abce-g]` matches `a`, `b`, `c`, `e`, `f`, or `g`.
  If the character after the `[` is a `!`, the `!` is used for negation,
  so `[!a-c]` matches any character except for `a`, `b`, or `c`.

- Within a **bracket expression**, the `*`, `?`, and `\` characters match themselves.
  The hyphen matches itself when it's the first character in the brackets,
  or when it's the first character after the `!` when negating.
- The `{` and `}` characters identify a group of subpatterns,
  where the group matches when any subpattern in the group matches.
  The comma is used to separate the subpatterns. Groups cannot be nested.
- Leading period/dot characters in file names are treated as regular characters in match operations.
  For example, the `*` glob pattern matches file name `.login`.
- All other characters match themselves in an implementation-dependent manner.
  This includes characters representing any name separators.
- The matching of root elements is highly implementation-dependent and is not specified.
