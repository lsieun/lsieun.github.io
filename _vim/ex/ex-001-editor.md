---
title: "ex Editor"
sequence: "101"
---

`vi` is the visual mode of the more general, underlying **line editor**, which is `ex`.

## ex Commands

### Basic Operation(open/print/line number)

假如有一个`hello.txt`文件，内容如下：

```txt
烨烨惊雷难入眠，
风挟细雨叩窗栏。
懒起近窗问何事，
相逢总归有前缘。
```

使用`ex Editor`打开`hello.txt`文件：

```bash
$ ex hello.txt
"hello.txt" 4L, 100C
Entering Ex mode.  Type "visual" to go to Normal mode.
```

`ex` commands consist of **a line address** (which can simply be a line number) plus **a command**;
they are finished with a carriage return (by hitting `ENTER`).
One of the most basic commands is `p` for **print** (to the screen).

输入`1p`，打印第1行

```vim
:1p
烨烨惊雷难入眠，
```

In fact, you can leave off the `p`, because a line number by itself is equivalent to a print command for that line.

输入`1,3`，打印1~3行数据

```vim
:1,3
烨烨惊雷难入眠，
风挟细雨叩窗栏。
懒起近窗问何事，
```

**A command without a line number** is assumed to affect **the current line**.

### from ex to vi

The command `:vi` will get you from `ex` to `vi`.

输入`vi`，由`ex Editor`转到`vi Editor`

```vim
:vi
```

### from vi to ex

To invoke an `ex` command from `vi`, you must type the special bottom-line character **`:`** (colon).
Then type **the command** and press `ENTER` to execute it.

## Editing with ex

Obviously, you will use `dw` or `dd` to delete **a single word** or **line**
rather than using the `delete` command in `ex`.
However, when you want to **make changes that affect numerous lines**, you will find the `ex` commands more useful.
They allow you to modify large blocks of text with a single command.

> 总结：ex commands适合于对多行文本进行操作。

These `ex` commands are listed here, along with abbreviations for those commands.

| Full name | Abbreviation | Meaning                         |
|:---------:|:------------:|---------------------------------|
| `delete`  |     `d`      | Delete lines                    |
|  `move`   |     `m`      | Move lines                      |
|  `copy`   |     `co`     | Copy lines                      |
|  `copy`   |     `t`      | Copy lines (a synonym for `co`) |

### Line Address

You already know how to think of **files** as **a sequence of numbered lines**.

For each `ex` editing command, you have to tell `ex` which line number(s) to edit.
And for the `ex move` and `copy` commands, you also need to tell `ex` where to move or copy the text to.

You can specify line addresses in several ways:

- With **explicit line numbers**
- With **symbols** that help you specify line numbers **relative to your current position** in the file
- With **search patterns** as addresses that identify the lines to be affected

### Defining a Range of Lines

```vim
:3,18d         # Delete lines 3 through 18.
:160,224m23    # Move lines 160 through 224 to follow line 23.
:23,29co100    # Copy lines 23 through 29 and put after line 100.
:1,10#         # To temporarily display the line numbers  from line 1 to line 10.
```

如何显示行号：

```vim
:set number
#或者
:set nu
```

如何隐藏行号：

```vim
:set nonumber
或者
:set nonu
```

You can also use the `CTRL-G` command to display the current line number.
Yet **another way to identify line numbers** is with the `ex =` command:

```vim
:=             # Print the total number of lines.
:.=            # Print the line number of the current line.
:/pattern/=    # Print the line number of the first line that matches pattern.
```

### Line Addressing Symbols

You can also use **symbols** for **line addresses**.

- **A dot** (`.`) stands for **the current line**;
- and `$` stands for **the last line of the file**.
- `%` stands for **every line in the file**; it's the same as the combination `1,$`.

**These symbols** can also be combined with **absolute line addresses**.

> 注意，在Normal模式下，`$`表示一行的结尾；而在`ex`模式下，`$`表示文件的最后一行。

```vim
:.,$d         # Delete from current line to end of file.
:20,.m$       # Move from line 20 through the current line to the end of the file.
:%d           # Delete all the lines in a file.
:%t$          # Copy all lines and place them at the end of the file
```

The symbols `+` and `-` work like **arithmetic operators**.

```vim
:.,.+20d      # Delete from current line through the next 20 lines.
:226,$m.-2    # Move lines 226 through the end of the file to two lines above the current line.
:.,+20#       # Display line numbers from the current line to 20 lines further on in the file.
```

The number `0` stands for **the top of the file** (imaginary line 0).
`0` is equivalent to `1-`, and both allow you to move or copy lines to the very start of a file,
before the first line of existing text.

```vim
:-,+t0     # Copy three lines (the line above the cursor through the line below the cursor) and put them at the top of the file.
```

### Search Patterns

Another way that `ex` can address lines is by using **search patterns**.

```vim
:/pattern/d     # Delete the next line containing pattern.
:/pattern/+d    # Delete the line below the next line containing pattern.
:.,/pattern/m23 # Take the text from the current line (`.`) through the first line containing pattern and put it after line 23.
```

Note that **a pattern** is delimited by a **slash** both **before** and **after**.

