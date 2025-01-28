$ vi harbor.ymljj---
title: "selection"
sequence: "102"
---

## Zone selection

```text
<action>a<object>
# or
<action>i<object>
```

高手进阶：

- `i` 表示 `inner`，打开 Vim 后，执行 `:help object-select` 可以看详细介绍。

- `aw` = a word
- `iw` = inner word

These command can only be used after an operator in visual mode.
But they are very powerful.
Their main pattern is:

```text
<action>a<object> and <action>i<object>
```

- The `action` can be any action, for example,
    - `d` (delete)
    - `y` (yank)
    - `v` (select in visual mode).
- The `object` can be:
    - `w` a word,
    - `W` a WORD (extended word),
    - `s` a sentence,
    - `p` a paragraph.
    - But also, natural character such as `"`, `'`, `)`, `}`, `]`.

Suppose the cursor is on the first `o` of `(map (+) ("foo"))`.

- `vi"` → will select `foo`.
- `va"` → will select `foo`.
- `vi)` → will select `foo`.
- `va)` → will select `("foo")`.
- `v2i)` → will select `map (+) ("foo")`
- `v2a)` → will select `(map (+) ("foo"))`

![](/assets/images/vim/text-objects.png)

## Select rectangular blocks

Rectangular blocks are very useful for commenting many lines of code.

Typically:

```text
0<C-v><C-d>I-- [ESC]
```


- `^` → go to the first non-blank character of the line
- `<C-v>` → Start block selection
- `<C-d>` → move down (could also be `jjj` or `%`, etc…)
- `I-- [ESC]` → write `--` to comment each line

![](/assets/images/vim/rectangular-blocks.gif)

Note: in Windows you might have to use `<C-q>` instead of `<C-v>` if your clipboard is not empty.

## Visual selection: `v`, `V`, `<Ctrl+v>`

We saw an example with `<C-v>`.
There is also `v` and `V`.
Once the selection has been made, you can:

- `J` → join all the lines together.
- `<` (resp. `>`) → indent to the left (resp. to the right).
- `=` → auto indent

![](/assets/images/vim/auto-indent.gif)

Add something at the end of all visually selected lines:

- `Ctrl + V`：进入 block selection
- `G`: go to desired line (`jjj` or `<C-d>` or `/pattern` or `%` etc…)
- `$` go to the end of the line
- `A`, write text, `ESC`.

![](/assets/images/vim/append-to-many-lines.gif)


