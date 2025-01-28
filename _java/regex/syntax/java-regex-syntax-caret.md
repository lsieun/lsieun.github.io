---
title: "Caret: `^`"
sequence: "113"
---

[UP](/java/java-text-index.html)

- `^`: the beginning of the text
- `[^abc]`: NOR

## NOR

```java
public class RegexSyntaxCaretNor {
    public static void main(String[] args) {
        String[][] matrix = {
                {"[^abc]", "g"},
                {"[^bcr]at", "sat mat eat"}
        };

        RegexUtils.printCount(matrix);
    }
}
```

```text
┌──────────┬─────────────┬───┐
│  [^abc]  │      g      │ 1 │
├──────────┼─────────────┼───┤
│ [^bcr]at │ sat mat eat │ 3 │
└──────────┴─────────────┴───┘
```


