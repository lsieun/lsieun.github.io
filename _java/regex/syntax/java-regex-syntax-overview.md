---
title: "Regex Syntax 概览"
sequence: "101"
---

[UP](/java/java-text-index.html)

- 枚举：`[abc]`
- 范围：`[a-z]`
- 逻辑：
    - 或（并集）：`[1-3[7-9]]`
    - 且（交集）：`[1-6&&[3-9]]`
    - 非：`[^abc]`

```text
                                                                ┌─── Meta Character ─────────────────┼─── `.`
                                                                │
                                                                │                                                    ┌─── OR ──────┼─── `[abc]`
                                                                │                                                    │
                                                                │                                                    ├─── NOR ─────┼─── `[^abc]`
                                                                │                                    ┌─── basic ─────┤
                                                                │                                    │               │             ┌─── `[A-Z]`
                                                                │                                    │               │             │
                                                                │                                    │               │             ├─── `[a-z]`
                                                                │                                    │               └─── Range ───┤
                                                                ├─── Character Classes ──────────────┤                             ├─── `[a-zA-Z]`
                                                                │                                    │                             │
                                   ┌─── Single Characters ──────┤                                    │                             └─── `[1-5]`
                                   │                            │                                    │
                                   │                            │                                    │               ┌─── Union ──────────┼─── `[1-3[7-9]]`
                                   │                            │                                    │               │
                                   │                            │                                    └─── complex ───┼─── Intersection ───┼─── `[1-6&&[3-9]]`
                                   │                            │                                                    │
                                   │                            │                                                    └─── Subtraction ────┼─── `[0-9&&[^2468]]`
                                   │                            │
                                   │                            │                                                       ┌─── `\d` ───┼─── `[0-9]` ───┼─── digits
                                   │                            │                                    ┌─── digits ───────┤
         ┌─── Character ───────────┤                            │                                    │                  └─── `\D` ───┼─── `[^0-9]` ───┼─── non-digits
         │                         │                            │                                    │
         │                         │                            │                                    │                  ┌─── `\s` ───┼─── white space
         │                         │                            └─── Predefined Character Classes ───┼─── whitespace ───┤
         │                         │                                                                 │                  └─── `\S` ───┼─── non-white space
         │                         │                                                                 │
         │                         │                                                                 │                  ┌─── `\w` ───┼─── `[a-zA-Z_0-9]` - word character
         │                         │                                                                 └─── word ─────────┤
         │                         │                                                                                    └─── `\W` ───┼─── non-word character
         │                         │
         │                         └─── Groups of Characters
         │
Regex ───┤                         ┌─── `?` ────────────┼─── `{0,1}` ───┼─── zero or one time
         │                         │
         │                         ├─── `*` ────────────┼─── `{0,}`
         ├─── Quantifiers ─────────┤
         │                         ├─── `+` ────────────┼─── `{1,}`
         │                         │
         │                         │                    ┌─── `{m}`
         │                         └─── brace syntax ───┤
         │                                              └─── `{m,n}`
         │
         │                         ┌─── `^` ────┼─── the beginning of the text
         │                         │
         └─── Boundary Matchers ───┼─── `$` ────┼─── the end of the text
                                   │
                                   └─── `\b` ───┼─── word boundary
```
