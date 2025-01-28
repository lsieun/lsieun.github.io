---
title: "Predefined Character Classes"
sequence: "104"
---

[UP](/java/java-text-index.html)

```text
┌────┬─────┬───┐
│ \d │ 123 │ 3 │
├────┼─────┼───┤
│ \D │ a6c │ 2 │
├────┼─────┼───┤
│ \s │ a c │ 1 │
├────┼─────┼───┤
│ \S │ a c │ 2 │
├────┼─────┼───┤
│ \w │ hi! │ 2 │
├────┼─────┼───┤
│ \W │ hi! │ 1 │
└────┴─────┴───┘
```

```java
public class RegexSyntaxCharacterPredefined {
    public static void main(String[] args) {
        String[][] matrix = {
                // Matching digits, equivalent to [0-9]
                {"\\d", "123"},
                // Matching non-digits, equivalent to [^0-9]
                {"\\D", "a6c"},


                // Matching white space
                {"\\s", "a c"},
                // Matching non-white space
                {"\\S", "a c"},


                // Matching a word character, equivalent to [a-zA-Z_0-9]
                {"\\w", "hi!"},
                // Matching a non-word character
                {"\\W", "hi!"},
        };

        RegexUtils.printCount(matrix);
    }
}
```
