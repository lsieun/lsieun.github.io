---
title: "Box-drawing character"
sequence: "202"
---

Unicode provides some box drawing characters, that are more-or-less meant for drawing shapes in the terminal output.

- Block name: **Box Drawing**
- Block range: `U+2500` ... `U+257F`
- Number of code points: 128
- Introduced since: Unicode version 1.1
- Complete list of code points: [unicode.org/charts/PDF/U2500.pdf](https://www.unicode.org/charts/PDF/U2500.pdf)

我的项目地址：[box-drawing-utils](https://github.com/lsieun/box-drawing-utils)

Box Drawing is a Unicode block containing characters for compatibility with legacy graphics standards
that contained characters for making bordered charts and tables, i.e. box-drawing characters.

Box-drawing characters, also known as line-drawing characters,
are a form of semigraphics widely used in text user interfaces to draw various geometric frames and boxes.
In graphical user interfaces, these characters are much less useful
as it is much simpler to draw lines and rectangles directly with graphical APIs.
**Box-drawing characters work only with monospaced fonts**;
however, they are still useful for plaintext comments on websites.

**Courier New** is the most widely used monospace serif font.
**Courier New** is often used with coding displays, and many email providers use it as their default font.
**Courier New** is also the standard font for movie screenplays.

## 正文

代码片段：

```text
UnicodeUtils.print(0x2500, 0x257F);
```

输出结果：

|        | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | A | B | C | D | E | F |
|--------|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| U+2500 | ─ | ━ | │ | ┃ | ┄ | ┅ | ┆ | ┇ | ┈ | ┉ | ┊ | ┋ | ┌ | ┍ | ┎ | ┏ |
| U+2510 | ┐ | ┑ | ┒ | ┓ | └ | ┕ | ┖ | ┗ | ┘ | ┙ | ┚ | ┛ | ├ | ┝ | ┞ | ┟ |
| U+2520 | ┠ | ┡ | ┢ | ┣ | ┤ | ┥ | ┦ | ┧ | ┨ | ┩ | ┪ | ┫ | ┬ | ┭ | ┮ | ┯ |
| U+2530 | ┰ | ┱ | ┲ | ┳ | ┴ | ┵ | ┶ | ┷ | ┸ | ┹ | ┺ | ┻ | ┼ | ┽ | ┾ | ┿ |
| U+2540 | ╀ | ╁ | ╂ | ╃ | ╄ | ╅ | ╆ | ╇ | ╈ | ╉ | ╊ | ╋ | ╌ | ╍ | ╎ | ╏ |
| U+2550 | ═ | ║ | ╒ | ╓ | ╔ | ╕ | ╖ | ╗ | ╘ | ╙ | ╚ | ╛ | ╜ | ╝ | ╞ | ╟ |
| U+2560 | ╠ | ╡ | ╢ | ╣ | ╤ | ╥ | ╦ | ╧ | ╨ | ╩ | ╪ | ╫ | ╬ | ╭ | ╮ | ╯ |
| U+2570 | ╰ | ╱ | ╲ | ╳ | ╴ | ╵ | ╶ | ╷ | ╸ | ╹ | ╺ | ╻ | ╼ | ╽ | ╾ | ╿ |

## Examples

Directory trees

```text
some-directory/
├── Dir_A
│   └── File_C
├── File_A
└── File_B
```

Drawing Git trees

```text
newbranch   ┈┈┈┈┈●───●───●
                /
master ●───●───●
```

Drawing boxes

```text
  ┌──────────┐     ┌──────────┐
  │  File_A  |     |  File_B  |
  └─────┬────┘     └─────┬────┘
        |                |
        └─────┐  ┌─link──┘
              |  |
        ┌─────┴──┴─────┐
        |    inode     |
        | representing |
        |    File_A    |
        └──────────────┘
```

```text
$ ln -s File_A File_B

  ┌──────────┐          ┌──────────┐
  |  File_A  ├───link───|  File_B  |
  └─────┬────┘          └──────────┘
        |
        └─────┐
              |
        ┌─────┴────────┐
        |    inode     |
        | representing |
        |    File_A    |
        └──────────────┘
```

Explaining code visually

```text
┌── link, ln - makes links
│   ┌── Create a symbolic link
│   │                         ┌── the path to the intended symlink
│   │                         │   can use . or ~ or other relative paths
│   │                   ┌─────┴────────┐
ln -s /path/to/original /path/to/symlink
        └───────┬───────┘
                └── the path to the original file/folder
                    can use . or ~ or other relative paths
```

```text
           _______                                 ,        _        _        
          (,     /'                              /'/      /' `\     ' )     _)
               /'                              /' /     /'   ._)    //  _/~/' 
             /'____ .     ,   ____          ,/'  /     (____      /'/_/~ /'   
   _       /'/'    )|    /  /'    )        /`--,/           )   /' /~  /'     
 /' `    /'/'    /' |  /' /'    /'       /'    /          /'  /'     /'       
(_____,/' (___,/(___|/(__(___,/(__   (,/'     (_,(_____,/'(,/'      (_,   
```

## 参考资料

- [Unicode Character Table](https://unicode-table.com/en/blocks/box-drawing/)
- [Using pseudographics in blog posts: drawing ASCII diagrams and boxes](https://clubmate.fi/using-pseudographics-in-blogposts-drawing-ascii-diagrams-and-boxes)
- [ASCII Generator](http://www.network-science.de/ascii/)
- [Stackoverflow: Any Java libraries for drawing ASCII tables?](https://stackoverflow.com/questions/5608588/any-java-libraries-for-drawing-ascii-tables)
- Github:
    - [vdmeer/asciitable](https://github.com/vdmeer/asciitable)
    - [freva/ascii-table](https://github.com/freva/ascii-table)
    - [klaus31/ascii-art-table](https://github.com/klaus31/ascii-art-table)
    - [iNamik/java_text_tables](https://github.com/iNamik/java_text_tables)
