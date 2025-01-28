---
title: "字符大小写"
sequence: "103"
---

## Characters

```text
'A': 01000001 (65)
'a': 01100001 (97)
' ': 00100000 (32)
'_': 01011111 (95)
```

### OR: All to lowercase

Use OR (`|`) and space bar coverts English characters to lowercase:

```text
('a' | ' ') == 'a'
('A' | ' ') == 'a'
```

### AND: All to uppercase

Use AND (`&`) and underline coverts English to uppercase:

```text
('b' & '_') == 'B'
('B' & '_') == 'B'
```

### XOR: Switch case

Use XOR (`^`) and space bar for English characters case exchange:

```text
('d' ^ ' ') == 'D'
('D' ^ ' ') == 'd'
```

You can convert any character, `ch`, to the opposite case using `ch ^= 32`.

