---
title: "Bracket: `[]`, `()`"
sequence: "112"
---

[UP](/java/java-text-index.html)

## `[]`: Range

```java
public class RegexSyntaxRange {
    public static void main(String[] args) {
        String[][] matrix = {
                // Matching uppercase letters
                {"[A-Z]", "Two Uppercase alphabets 34 overall"},
                // Matching lowercase letters
                {"[a-z]", "Two Uppercase alphabets 34 overall"},
                // Matching both upper case and lower case letters
                {"[a-zA-Z]", "Two Uppercase alphabets 34 overall"},


                // Matching a given range of numbers
                {"[1-5]", "Two Uppercase alphabets 34 overall"},
                // Matching another range of numbers
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

```text
┌────────────────┬────────────────────────────────────┬────┐
│     [A-Z]      │ Two Uppercase alphabets 34 overall │ 2  │
├────────────────┼────────────────────────────────────┼────┤
│     [a-z]      │ Two Uppercase alphabets 34 overall │ 26 │
├────────────────┼────────────────────────────────────┼────┤
│    [a-zA-Z]    │ Two Uppercase alphabets 34 overall │ 28 │
├────────────────┼────────────────────────────────────┼────┤
│     [1-5]      │ Two Uppercase alphabets 34 overall │ 2  │
├────────────────┼────────────────────────────────────┼────┤
│     3[0-5]     │ Two Uppercase alphabets 34 overall │ 1  │
├────────────────┼────────────────────────────────────┼────┤
│   [1-3[7-9]]   │             123456789              │ 6  │
├────────────────┼────────────────────────────────────┼────┤
│  [1-6&&[3-9]]  │             123456789              │ 4  │
├────────────────┼────────────────────────────────────┼────┤
│ [0-9&&[^2468]] │             123456789              │ 5  │
└────────────────┴────────────────────────────────────┴────┘
```
