---
title: "Quantifiers"
sequence: "105"
---

[UP](/java/java-text-index.html)

```text
┌─────────┬────────┬─────────┐
│  Regex  │  Text  │ Matches │
├─────────┼────────┼─────────┤
│   \a?   │   hi   │    3    │
├─────────┼────────┼─────────┤
│ \a{0,1} │   hi   │    3    │
├─────────┼────────┼─────────┤
│   \a*   │   hi   │    3    │
├─────────┼────────┼─────────┤
│ \a{0,}  │   hi   │    3    │
├─────────┼────────┼─────────┤
│   \a+   │   hi   │    0    │
├─────────┼────────┼─────────┤
│ \a{1,}  │   hi   │    0    │
├─────────┼────────┼─────────┤
│  a{3}   │ aaaaaa │    2    │
├─────────┼────────┼─────────┤
│  a{3}   │   aa   │    0    │
├─────────┼────────┼─────────┤
│ a{2,3}  │  aaaa  │    1    │
├─────────┼────────┼─────────┤
│ a{2,3}? │  aaaa  │    2    │
└─────────┴────────┴─────────┘
```

```java
// https://www.baeldung.com/regular-expressions-java
public class RegexSyntaxQuantifiers {
    public static void main(String[] args) {
        String[][] matrix = {
                // ? = {0,1}
                {"\\a?", "hi"},
                {"\\a{0,1}", "hi"},

                // * = {0,}
                {"\\a*", "hi"},
                {"\\a{0,}", "hi"},

                // + = {1,}
                {"\\a+", "hi"},
                {"\\a{1,}", "hi"},

                // {m}
                {"a{3}", "aaaaaa"},
                {"a{3}", "aa"},

                // {m,n}  greedy
                // {m,n}? lazy
                {"a{2,3}", "aaaa"},
                {"a{2,3}?", "aaaa"},
        };

        RegexUtils.printCount(matrix);
    }
}
```
