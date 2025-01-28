---
title: "Character Classes"
sequence: "103"
---

[UP](/java/java-text-index.html)

```text
┌────────────────┬────────────────────────────────────┬─────────┐
│     Regex      │                Text                │ Matches │
├────────────────┼────────────────────────────────────┼─────────┤
│     [abc]      │                 b                  │    1    │
├────────────────┼────────────────────────────────────┼─────────┤
│     [abc]      │                cab                 │    3    │
├────────────────┼────────────────────────────────────┼─────────┤
│    [bcr]at     │            bat cat rat             │    3    │
├────────────────┼────────────────────────────────────┼─────────┤
│     [^abc]     │                 g                  │    1    │
├────────────────┼────────────────────────────────────┼─────────┤
│    [^bcr]at    │            sat mat eat             │    3    │
├────────────────┼────────────────────────────────────┼─────────┤
│     [A-Z]      │ Two Uppercase alphabets 34 overall │    2    │
├────────────────┼────────────────────────────────────┼─────────┤
│     [a-z]      │ Two Uppercase alphabets 34 overall │   26    │
├────────────────┼────────────────────────────────────┼─────────┤
│    [a-zA-Z]    │ Two Uppercase alphabets 34 overall │   28    │
├────────────────┼────────────────────────────────────┼─────────┤
│     [1-5]      │ Two Uppercase alphabets 34 overall │    2    │
├────────────────┼────────────────────────────────────┼─────────┤
│     3[0-5]     │ Two Uppercase alphabets 34 overall │    1    │
├────────────────┼────────────────────────────────────┼─────────┤
│   [1-3[7-9]]   │             123456789              │    6    │
├────────────────┼────────────────────────────────────┼─────────┤
│  [1-6&&[3-9]]  │             123456789              │    4    │
├────────────────┼────────────────────────────────────┼─────────┤
│ [0-9&&[^2468]] │             123456789              │    5    │
└────────────────┴────────────────────────────────────┴─────────┘
```

```java
public class RegexSyntaxBCharacterClasses {
    public static void main(String[] args) {
        String[][] matrix = {
                // OR Class
                {"[abc]", "b"},
                {"[abc]", "cab"},
                {"[bcr]at", "bat cat rat"},

                // NOR Class
                {"[^abc]", "g"},
                {"[^bcr]at", "sat mat eat"},

                // Range Class
                {"[A-Z]", "Two Uppercase alphabets 34 overall"},
                {"[a-z]", "Two Uppercase alphabets 34 overall"},
                {"[a-zA-Z]", "Two Uppercase alphabets 34 overall"},
                {"[1-5]", "Two Uppercase alphabets 34 overall"},
                {"3[0-5]", "Two Uppercase alphabets 34 overall"},

                // Union Class
                {"[1-3[7-9]]", "123456789"},

                // Intersection Class
                {"[1-6&&[3-9]]", "123456789"},

                // Subtraction Class
                {"[0-9&&[^2468]]", "123456789"},
        };

        RegexUtils.printCount(matrix);
    }
}
```
