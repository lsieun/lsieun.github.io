---
title: "Standard Input, Output, and Error"
sequence: "101"
---

[UP](/bash.html)


Keeping with the Unix theme of “everything is a file,” programs such as `ls` actually send their results to a special file called **standard output** (often expressed as `stdout`) and their status messages to another file called **standard error** (`stderr`). By default, both **standard output** and **standard error** are linked to **the screen** and not saved into **a disk file**.

In addition, many programs take input from a facility called **standard input** (`stdin`), which is, by default, attached to the **keyboard**. I/O redirection allows us to change where output goes and where input comes from. Normally, output goes to **the screen** and input comes from **the keyboard**, but with I/O redirection, we can change that.

```txt
keyboard(device) -- stdin(data 流) -- program() -- stdout/stderr(data 流) -- Terminal(device)
```
