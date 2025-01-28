---
title: "Capturing Groups"
sequence: "106"
---

[UP](/java/java-text-index.html)

The API also allows us to **treat multiple characters as a single unit through capturing groups.**
It will attach numbers to the capturing groups, and allow back referencing using these numbers.

```text
┌──────────────┬──────────┬─────────┐
│    Regex     │   Text   │ Matches │
├──────────────┼──────────┼─────────┤
│    (\d\d)    │    12    │    1    │
├──────────────┼──────────┼─────────┤
│    (\d\d)    │   1212   │    2    │
├──────────────┼──────────┼─────────┤
│   (\d\d)\1   │   1212   │    1    │
├──────────────┼──────────┼─────────┤
│ (\d\d)(\d\d) │   1212   │    1    │
├──────────────┼──────────┼─────────┤
│ (\d\d)\1\1\1 │ 12121212 │    1    │
├──────────────┼──────────┼─────────┤
│   (\d\d)\1   │   1213   │    0    │
└──────────────┴──────────┴─────────┘
```

```java
// https://www.baeldung.com/regular-expressions-java
public class RegexSyntaxGroupCapturing {
    public static void main(String[] args) {
        String[][] matrix = {
                {"(\\d\\d)", "12"},
                {"(\\d\\d)", "1212"},

                // back referencing
                {"(\\d\\d)\\1", "1212"},
                {"(\\d\\d)(\\d\\d)", "1212"},
                {"(\\d\\d)\\1\\1\\1", "12121212"},
                {"(\\d\\d)\\1", "1213"},
        };

        RegexUtils.printCount(matrix);
    }
}
```
