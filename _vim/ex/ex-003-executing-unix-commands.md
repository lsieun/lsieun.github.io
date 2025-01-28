---
title: "Executing Unix Commands"
sequence: "103"
---

You can display or read in the results of **any Unix command** while you are editing in `vi`.
**An exclamation mark** (`!`) tells `ex` to create a shell and to regard what follows as a Unix command:

```vim
:!command

:!date    #  if you are editing and you want to check the time or date without exiting vi
:r !date  #  read the results of a Unix command into your file
```

If you want to give **several Unix commands in a row** without returning to `vi` editing in between,
you can create a shell with the `ex` command:

```vim
:sh
```

When you want to **exit the shell** and return to `vi`, press `CTRL-D`.

You can also send **a block of text** as **standard input** to **a Unix command**.
**The output** from this command replaces **the block of text in the buffer**.

```vim
:96,99!sort    # pass lines 96 through 99 through the sort filter and replace those lines with the output of sort.
```
