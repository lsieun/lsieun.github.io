---
title: "Unix"
sequence: "unix"
---

[UP](/linux.html)


`GNU/Linux` is fashioned on **Unix**.
Unix dates from 1969 when Ken Thompson at Bell Telephone Laboratories initiated work on this new operating system.
The name Unix is a pun on an alternative operating system of the time called `MULTICS`
(MULTiplexed Information and Computing Service).
MULTICS was developed by The Massachusetts Institute of Technology, General Electric and Bell Labs.
**Unix** was originally spelt **UNICS**, an acronym for **UNiplexed Information and Computing Service**!

这段两个理解：

- （1） `GNU/Linux` 是模仿的 Unix
- （2）第一版 Unix 是 1969 年，第一版 Linux 是 1991 年，中间间隔 22 年

**Some of the basic ideas** introduced by `Multics` and then `Unix` were the **tree structured file system**,
a program for command interpretation (called the **shell**),
the structure and nature of text files and the semantics of I/O operations.

**Some of the philosophy** that rose with the development of Unix included the desire
**to write programs that performed one task and to do it well**,
**to write programs that worked together to perform larger tasks**,
and **to write programs that communicated with each other using text from one program to the other**.

这段理解三个意思：

- （1） 从 `Multics` 到 `Unix`，再到 `GNU/Linux`，传承下来一些 ideas 和 philosophy
- （2） 这些 ideas 包括：tree structured file system/shell/text files/IO
- （3） 这些 philosophy 包括： one task and to do it well/work together/communicate using text

**The advantages of Unix** were quickly identified by many and
quite a few varieties of Unix emerged over time.
**Sun Microsystems** have pioneered many of the developments in Unix, 
followed by such greats as the old Digital Equipment Corporation
(DEC, which was swallowed by Compaq, which was swallowed by Hewlett-Packard),
Silicon Graphics Incorporated (SGI), International Business Machines (IBM), and Hewlett-Packard (HP).
**A variety of flavours** have existed,
including SunOS, Solaris, Ultrix, Irix, BSD, System V, HPUX, and so on.
Although computer programs written for one version of Unix could sometimes be ported to other versions,
it was not always an easy task.
**The diversity of Unix implementations** (more so than the proprietary nature of most of them)
made it difficult for `Unix` to become **a commodity operating system**.

> Unix 的优点，很快获得到认可。之后，分化成许多不同的 Unix 具体实现，这也就让不同的 Unix 之间的兼容性问题。

The **GNU project** worked hard to free software development from nuances of each of the different Unix versions
through providing **a common programming language environment** (`GNU C`) and
**a sophisticated packaging tool** (`autoconf` and `automake`) to carefully hide the differences.

> 这个时候，GNU project 站出来解决这个问题。

`GNU/Linux` has now become **the most popular Unix variant** and all the major Unix players support GNU/Linux in some way.

> 到现在，`GNU/Linux` 成为最受欢迎的 Unix variant。

## Unix Tools

A particularly touted feature of Unix comes from **a tools philosophy**
where **complex tasks are performed by bringing together a collection of simpler tools**.
This is contrasted with the philosophy of
**providing monolithic applications that in one fell swoop solve all your problems, supposedly**.
The reality is often different.

Most operating systems supply a collection of basic utility programs for managing your files
(things like arranging your files into folders, trashing files, and copying files from one place to another).
Large applications then provide the word processing, spreadsheet, and web browsing functionality.

Unix places less emphasis on the monolithic applications.
Instead, **tools provide simple functionality, focusing on doing well what they are designed to do**.
They simply pass their results on to another tool once they're done.
Unix **pipes** provide the mechanism for doing this:
**one tool pipes its output on to another tool**.
This allows complex actions to be performed by piping together a collection of simpler commands.

A simple example is to determine the number of users logged on to your system:

```bash
who | wc -l
```

The `who` command will list, one per line, each user logged on.
The `wc` command will count the number of characters, words, and lines that it comes across,
with the `-l` option only counting the number of lines.
(GNU tools, like Unix, introduce options with the minus sign.)

For various reasons though **this tools philosophy was often overlooked**
when large monolithic applications arose that did not adhere to the philosophy--they did not share components.
Common tools such as Netscape, ghostview, Acrobat, FrameMaker, and OpenOffice essentially share very little.
Compare that with the Microsoft community where, for example, an application like Internet Explorer is component-based.
This is now changing in the GNU world with the operating system software and
the **Gnome** project encouraging component-based architectures.

## Open, Free, and Stable

**Another feature of Unix** is that **Unix applications** tend to **use open file formats**
allowing a variety of tools to collaborate to work on those open formats.
Indeed, this has been a key in recent developments to remove the strangle-hold of Microsoft proprietary formats.
Rather than electronic document storage providing a longer term solution to the archival of documents,
it is delivering an even shorter lifetime than paper-based archives!
How can that be so?
The formats created by proprietary software are often binary and not fully publicly specified.
How many packages today can read old Word Perfect and MS Word documents?
The standardisation on open formats, often text-based formats like XML that allow anyone to read them,
provides a solution to this problem.

> 这里重点是 Open

So why Unix? It is a conceptually simple operating system
facilitating creativity by not restricting the developer but rather providing them
with **the freedom to learn from, build upon, and modify the system**.
Many have found it to be a fun operating system to work with
allowing many innovative developments **to be freely combined** in new and
even more innovative ways to deliver powerful ideas.
A very large world wide group of people willingly provide **excellent, free support** over the Internet,
particularly through Stack Overflow.
Anyone can freely learn more about the operating system by studying the code itself.
Everyone has **the freedom to contribute the operating system or to any other open source software tools**
that they use and want to improve or extend.

> 这里重点是 Free

Finally, **stability**. 
There is very little doubt that `GNU` and `Linux` are extremely stable.
**The habit of rebooting your older MS/Windows computer** every time you come back to it
is something we seem to be encouraged to do because of the tendency for this operating system
to be less careful in managing its use of memory.
Also, when you install a new package under MS/Windows chances are you will need to reboot the computer.
**Most Linux users rarely need to reboot their machine** except for a kernel update and even that is being addressed.

> 这里重点是 Stable

Check the `uptime` on your computer and you might find the machine has not been rebooted for months or years.

```bash
server@cloud$ uptime
 00:55:30 up 265 days,  2:47,  2 users,  load average: 2.79, 3.58, 3.91
laptop@home$ uptime
 10:55:45 up 6 days, 17:02,  1 user,  load average: 1.37, 0.78, 0.39
```

Here's two variations of `uptime` for reference:

```bash
$ uptime -p  # Pretty print.
up 37 weeks, 6 days, 2 hours, 47 minutes

$ uptime -s  # Since.
2018-10-07 22:08:08
```

## Is Linux Unix?

URL: https://www.computerhope.com/issues/ch001589.htm

**No**. **Linux** is often called "**Unix-like**"
because it functions in much the same way as UNIX.
For instance, it uses a command-line interface.
Also, many of its basic commands have the same name and serve the same purpose, like those found in UNIX.

However, **the Linux operating system is not directly descended from any of UNIX's code**.
Additionally, it does not comply with the official single UNIX specification technical standard as defined by the Open Group.
