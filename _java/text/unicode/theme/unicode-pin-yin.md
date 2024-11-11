---
title: "拼音"
sequence: "101"
---

```java
import java.util.List;
import java.util.function.Function;

public class PinYin {
    public static void main(String[] args) {
        int[] array = {
                'ā', 'á', 'ǎ', 'à', // a
                'ē', 'é', 'ě', 'è', // e
                'ī', 'í', 'ǐ', 'ì', // i
                'ō', 'ó', 'ǒ', 'ò', // o
                'ū', 'ú', 'ǔ', 'ù', // u
        };

        List<Pair<String, Function<Integer, ?>>> funcList = List.of(
                Pair.of("↓", Character::toChars),
                Pair.of("Name", Character::getName)
        );

        BoxUtils.printArrayWithTitle(array, funcList);
    }
}
```

```text
┌─────┬───┬──────────────────────────────────┐
│     │ ↓ │               Name               │
├─────┼───┼──────────────────────────────────┤
│ 257 │ ā │ LATIN SMALL LETTER A WITH MACRON │
├─────┼───┼──────────────────────────────────┤
│ 225 │ á │ LATIN SMALL LETTER A WITH ACUTE  │
├─────┼───┼──────────────────────────────────┤
│ 462 │ ǎ │ LATIN SMALL LETTER A WITH CARON  │
├─────┼───┼──────────────────────────────────┤
│ 224 │ à │ LATIN SMALL LETTER A WITH GRAVE  │
├─────┼───┼──────────────────────────────────┤
│ 275 │ ē │ LATIN SMALL LETTER E WITH MACRON │
├─────┼───┼──────────────────────────────────┤
│ 233 │ é │ LATIN SMALL LETTER E WITH ACUTE  │
├─────┼───┼──────────────────────────────────┤
│ 283 │ ě │ LATIN SMALL LETTER E WITH CARON  │
├─────┼───┼──────────────────────────────────┤
│ 232 │ è │ LATIN SMALL LETTER E WITH GRAVE  │
├─────┼───┼──────────────────────────────────┤
│ 299 │ ī │ LATIN SMALL LETTER I WITH MACRON │
├─────┼───┼──────────────────────────────────┤
│ 237 │ í │ LATIN SMALL LETTER I WITH ACUTE  │
├─────┼───┼──────────────────────────────────┤
│ 464 │ ǐ │ LATIN SMALL LETTER I WITH CARON  │
├─────┼───┼──────────────────────────────────┤
│ 236 │ ì │ LATIN SMALL LETTER I WITH GRAVE  │
├─────┼───┼──────────────────────────────────┤
│ 333 │ ō │ LATIN SMALL LETTER O WITH MACRON │
├─────┼───┼──────────────────────────────────┤
│ 243 │ ó │ LATIN SMALL LETTER O WITH ACUTE  │
├─────┼───┼──────────────────────────────────┤
│ 466 │ ǒ │ LATIN SMALL LETTER O WITH CARON  │
├─────┼───┼──────────────────────────────────┤
│ 242 │ ò │ LATIN SMALL LETTER O WITH GRAVE  │
├─────┼───┼──────────────────────────────────┤
│ 363 │ ū │ LATIN SMALL LETTER U WITH MACRON │
├─────┼───┼──────────────────────────────────┤
│ 250 │ ú │ LATIN SMALL LETTER U WITH ACUTE  │
├─────┼───┼──────────────────────────────────┤
│ 468 │ ǔ │ LATIN SMALL LETTER U WITH CARON  │
├─────┼───┼──────────────────────────────────┤
│ 249 │ ù │ LATIN SMALL LETTER U WITH GRAVE  │
└─────┴───┴──────────────────────────────────┘
```

## Reference

- [中文轉拼音/漢字轉拼音](https://www.ifreesite.com/pinyin/)
- [Unicode Block “Latin Extended-A”](https://www.compart.com/en/unicode/block/U+0100)
- [Unicode Block “Latin Extended-B”](https://www.compart.com/en/unicode/block/U+0180)
- [Unicode Block “Combining Diacritical Marks”](https://www.compart.com/en/unicode/block/U+0300)
