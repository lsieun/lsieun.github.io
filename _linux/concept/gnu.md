---
title: "GNU"
sequence: "gnu"
---

[UP](/linux.html)


从“概念”的角度来说，

```txt
operating system = Linux kernel + other software
```

从“时间线”上来说，

- 1984 年，Richard Stallman 发起了 GNU Project
- 1991 年，Linus Torvalds 发布 Linux kernel

## What is “Linux”?

“Linux” itself is just the kernel – the core part of the operating system.
Other software, such as the GNU C compiler used to compile the kernel,
bash command-line shell, GNU shell utilities (all the basic commands you would use on a command line),
X.org graphical server, a graphical desktop like Unity,
and the software that runs on top of the graphical desktop, like Firefox,
are all produced by different groups of developers.

Linux distributions assemble all this disparate software from different developers and call the complete package “Linux.”

## The GNU Project

The **GNU Project** was begun in `1984` by Richard Stallman of MIT
with the aim to develop a complete free
(meaning free for everyone to look at, to learn from, and to build upon) software operating system.

In `1989` he codified the terms
under which this free software was released, producing the **GNU Public License (GPL)**
which is the basis on which much of the `GNU/Linux` operating system is released.
**The license** is often referred to as **the copyleft license** in contrast to the restrictive practise of **copyright**.

By `1991`, the GNU project had finished many of the pieces of the GNU operating system,
including the GNU C Compiler (gcc), bash command-line shell, many shell utilities, the Emacs text editor, and more.
Other parts of the operating system could be provided by already-existing free software,
such as the X Window System, which provided a graphical desktop.

> 到了 1911 年，GNU 项目中已经具备了许多的软件，只差一个 kernal 部分。

However, the core part of the operating system – the GNU Hurd kernel – was not complete.
The GNU Project chose an ambitious microkernel design for the kernel, resulting in long delays.
(As of 2013, the GNU Hurd kernel has been in development for 23 years and no stable version has ever been released.)

## Linux Arrives

The kernel was seen as “the last missing piece” of the GNU operating system by the GNU project.
In `1991`, Linus Torvalds released the first version of the Linux kernel.
There was now enough software for a completely free operating system, and distributors
(like modern “Linux distributions”) assmbled the Linux kernel, GNU software, and X Window System together.

![](/assets/images/linux/concept/gnu-linux-naming-controversy.jpg)

Many users installed the **GNU tools** on many different computers as replacements for vendor supplied tools.
This provided these users with **a consistency** across the **many different platforms** they used.
The tools even eventually appeared under MS/Windows, providing a Unix-like environment on a very different operating system.

> GNU tools 开始流行起来，是因为它们在 many different platforms 提供了 consistency。

The tools developed by the **GNU project** include such essential utilities as
the **GNU file management utilities** and the **GNU text file processing utilities**.
The **GNU file management utilities** include fundamental command line tools like
`ls` (to list information about files/documents),
`mkdir` (to create new directories/folders),
`mv` (to move directories and files around),
`rm` (to remove files), and many more.
The **GNU text file processing commands** include
`cat` (to concatenate files together),
`head` (to preview the top few lines of a file),
`sort` (to sort the contents of a file),
and `wc` (to count the number of lines, words, and bytes in a file).

GNU Project 的 tools，这里举了两种类型的例子：

- （1） 文件管理：ls/mkdir/mv/rm
- （2） 文件内容：cat/head/sort/wc

![](/assets/images/linux/concept/gnu-love.jpg)

## GNU Software

The toolkits developed by the GNU project are comprehensive.

- comprehensive
    - 全部的；所有的；（几乎）无所不包的；详尽的 including all, or almost all, the items, details, facts, information, etc., that may be concerned

- `awk`： A powerful yet simple pattern-based scripting language.
- `bash`： The Bourne Again SHell is compatible with the traditional Unix `sh` and offers many extensions found in `csh` and `ksh`. It is similar in concept to `DOS`.
- `fileutils`： File management utilities.
- `findutils`： The `find` utility is frequently used both interactively and in shell scripts to find files which match certain criteria and perform arbitrary operations on them.
- `gcc`： A free compiler collection for C, C++, Objective C and other languages. This compiler is used widely, on multiple platforms, including MS/Windows.
- `gdb`： A source-level debugger for C, C++ and Fortran.
- `tar`: An archive utility.
- `textutils`: A set of utilities for manipulating text.
- `time`: A utility to report on the time taken to execute other programs.
- `wget`: A non-interactive web browser to retrieve files from the Internet using HTTP and FTP.

There are though many also that are **GUI-based** and end user focused, including `Gnome`, `KDE`, The `Gimp`, and `Gnumeric`.

- `gnome`： The GNU desktop which provides a consistent graphical user interface for common applications including everything from spreadsheets to mail clients, and more.
- `gtk+`： A GUI toolkit for the X Window System. All **Gnome** packages use this toolkit for their consistent look and feel.
- `gzip`： GNU's program for compressing and decompressing files.
- `kde`: An alternative, and very popular desktop which provides a consistent graphical user interface for common applications including everything from spreadsheets to mail clients, and more.
