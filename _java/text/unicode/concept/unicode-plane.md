---
title: "Unicode Plane"
sequence: "102"
---

In the Unicode standard, characters are mapped to values between `0x0` and `0x10FFFF`.

A **plane** is a contiguous group of `65,536` (2^<sup>16</sup>) code points.
There are 17 planes, identified by the numbers `0` to `16`.

- Plane 0 is the **Basic Multilingual Plane** (**BMP**), which contains most commonly used characters.
- The higher planes 1 through 16 are called "**supplementary planes**".

## Unicode Plane

<table>
    <caption>Unicode planes, and code point ranges used</caption>
    <thead>
    <tr>
        <th style="text-align: center;">Basic</th>
        <th style="text-align: center;" colspan="6">Supplementary</th>
    </tr>
    <tr>
        <th style="text-align: center;">Plane 0</th>
        <th style="text-align: center;">Plane 1</th>
        <th style="text-align: center;">Plane 2</th>
        <th style="text-align: center;">Plane 3</th>
        <th style="text-align: center;">Plane 4-13</th>
        <th style="text-align: center;">Plane 14</th>
        <th style="text-align: center;">Plane 15-16</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>0000–FFFF</td>
        <td>10000–1FFFF</td>
        <td>20000–2FFFF</td>
        <td>30000–3FFFF	</td>
        <td>40000–DFFFF</td>
        <td>E0000–EFFFF</td>
        <td>F0000–10FFFF</td>
    </tr>
    <tr>
        <td>Basic Multilingual Plane</td>
        <td>Supplementary Multilingual Plane</td>
        <td>Supplementary Ideographic Plane</td>
        <td>Tertiary Ideographic Plane</td>
        <td>unassigned</td>
        <td>Supplementary Special-purpose Plane</td>
        <td>Supplementary Private Use Area planes</td>
    </tr>
    <tr>
        <td>BMP</td>
        <td>SMP</td>
        <td>SIP</td>
        <td>TIP</td>
        <td>—</td>
        <td>SSP</td>
        <td>SPUA-A/B</td>
    </tr>
    </tbody>
</table>

```text
                                                         ┌─── U+0000 - U+007F: Basic Latin
                                                         │
                                                         ├─── U+0080 - U+00FF: Latin-1 Supplement
                                                         │
                                                         ├─── U+0100 - U+017F: Latin Extended-A
                   ┌─── Basic ───────────┼─── BMP(00) ───┤
                   │                                     ├─── U+0180 - U+024F: Latin Extended-B
                   │                                     │
                   │                                     ├─── U+2500 - U+257F: Box Drawing
                   │                                     │
Unicode::Planes ───┤                                     └─── U+25A0 - U+25FF: Geometric Shapes
                   │
                   │                     ┌─── SMP(01)
                   │                     │
                   │                     ├─── SIP(02)
                   └─── Supplementary ───┤
                                         ├─── TIP(03)
                                         │
                                         └─── SSP(14)
```

## Reference

- [Unicode Planes](https://www.compart.com/en/unicode/plane)
