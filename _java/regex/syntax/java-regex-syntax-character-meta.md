---
title: "Meta Characters"
sequence: "102"
---

[UP](/java/java-text-index.html)

## 介绍

- the dot `.` matches any character
- The API supports several other meta characters, `<([{\^-=$!|]})?*+.>`

## 示例

```text
┌───────┬────────┬─────────┐
│ Regex │  Text  │ Matches │
├───────┼────────┼─────────┤
│   .   │  foo   │    3    │
├───────┼────────┼─────────┤
│ foo.  │ foofoo │    1    │
└───────┴────────┴─────────┘
```

```java
public class RegexSyntaxACharacterMeta {
    public static void main(String[] args) {
        String[][] matrix = {
                {".", "foo"},
                {"foo.", "foofoo"},
        };

        RegexUtils.printCount(matrix);
    }
}
```
