---
title: "Boundary Matchers"
sequence: "107"
---

[UP](/java/java-text-index.html)

```text
┌─────────┬─────────────────────────────┬─────────┐
│  Regex  │            Text             │ Matches │
├─────────┼─────────────────────────────┼─────────┤
│  ^dog   │      dogs are friendly      │    1    │
├─────────┼─────────────────────────────┼─────────┤
│  ^dog   │   are dogs are friendly?    │    0    │
├─────────┼─────────────────────────────┼─────────┤
│  dog$   │ Man's best friend is a dog  │    1    │
├─────────┼─────────────────────────────┼─────────┤
│  dog$   │ is a dog man's best friend? │    0    │
├─────────┼─────────────────────────────┼─────────┤
│ \bdog\b │      a dog is friendly      │    1    │
├─────────┼─────────────────────────────┼─────────┤
│ \bdog\b │  dog is man's best friend   │    1    │
├─────────┼─────────────────────────────┼─────────┤
│ \bdog\b │   snoop dogg is a rapper    │    0    │
├─────────┼─────────────────────────────┼─────────┤
│ \bdog\B │   snoop dogg is a rapper    │    1    │
└─────────┴─────────────────────────────┴─────────┘
```

```java
// https://www.baeldung.com/regular-expressions-java
public class RegexSyntax_D_BoundaryMatchers {
    public static void main(String[] args) {
        String[][] matrix = {
                // the beginning of the text
                {"^dog", "dogs are friendly"},
                {"^dog", "are dogs are friendly?"},

                // the end of the text
                {"dog$", "Man's best friend is a dog"},
                {"dog$", "is a dog man's best friend?"},

                // word boundary
                {"\\bdog\\b", "a dog is friendly"},
                {"\\bdog\\b", "dog is man's best friend"},
                {"\\bdog\\b", "snoop dogg is a rapper"},
                {"\\bdog\\B", "snoop dogg is a rapper"},
        };

        RegexUtils.printCount(matrix);
    }
}
```
