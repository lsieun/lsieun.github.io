---
title: "Linux Kernel"
sequence: "linux-kernel"
---

[UP](/linux.html)


Unix was popular because, originally, the source code was widely available.
For various reasons the Unix license began to forbid the Universities from using the source code in their teaching.
This lead Andy Tannenbaum to write MINIX which then inspired Linus Torvalds to write the Linux kernel for his Intel 386.

这段理解三个意思：

- （1） Unix。刚开始的时候，Unix 由于源代码开放，很受欢迎；后来，由于一些原因，Unix license 禁止大学使用其 source code。
- （2） MINIX。由于不能继续使用 Unix 的 source code，大学教授 Andy Tannenbaum 出于教学目的，编写了 MINIX。
- （3） Linux。是 Linus Torvalds 是受到 MINIX 启发后写的。

## Kernel and Beyond

A fundamental misunderstanding is the relationship between **Linux** and **operating systems**.
Linux is the low level code that interacts with and controls **the hardware of the computer**
(whether it is an Intel 486, Pentium, Sun Sparc, or a Merced).

这段要理解的意思有两个：

- （1）Linux 和 operating systems 是两个不同的概念。
- （2）Linux 的主要作用是与 hardware 进行交互

Linux is the **kernel** of the **operating system**,
(1)providing routines to help applications talk to each other,
(2)allowing many applications to share the CPU at the same time,
and (3)managing the use of memory,
(4)allowing many different applications to run at the same time without interfering with other applications.

接着上一段：

- （3）Linux 是 operating system 的核心(kernel)。换句话说，operating system 是个更大的概念，Linux 是个较小的概念。
- （4）更进一步的说，Linux 就是协调 hardware(CPU/memory)来为 application 进行服务。

While the **kernel** is crucial,
it is **the larger suite of software** that sits on top of the **kernel**
that provides the functional operating system.
Most of **the software applications** at this level come from the **GNU Project**.
These tools include the command line utilities like `ls`, `cp`, `find`, `bash`, and the compilers like `gcc`.
This collection of applications is usually considered to be **the actual operating system** and
hence we refer to the operating system as `GNU/Linux`
in recognition of the **GNU software** coupled with the **Linux kernel**.
`GNU/HURD` is an alternative operating system
using the **GNU software** with the **HURD kernel** being developed by the GNU Project.

这段要理解的四个意思：

- （1） Linux kernel + other software = operating system
- （2） "other software"主要是来自于 GNU Project，其实也就是 GNU software。
- （3） 为了表示对 GNU 的认可，operating systems 可以写成 `GNU/Linux`。换句话说，`GNU/Linux` = Linux Kernel + GNU software
- （4）为了更进一步的理解 `GNU/Linux`，又提出了另一个操作系统 `GNU/HURD`

Sitting on top of this command-line level of the operating system is
what we might refer to as the end user level of the operating system.
This is typically a graphical user interface (GUI) aiming to provide an intuitive,
easy to use system for both the general, non-technical user and the power user.
Such an interface is typically an application that sits on top of and makes considerable use of the operating system.
For `GNU/Linux` this is the **X Window System**.

这段要理解两点：

- （1） 无论是 command-line，还是 GUI，都是属于 operating system 的概念范围之内。只不过 GUI 更容易被 non-technical user 所接受。
- （2） 对于 `GNU/Linux` 来说，它的 GUI 就是 X Window System。

```txt
the end user level of the operating system(GUI) 普通用户
------------------------------------------------------
command-line level of the operating system 技术用户
```

The **Window System** provides a platform for **GUI-based applications**.
Other applications sit on top of the Window System to provide integrated platforms with a common look and feel.
**Gnome**, another GNU project, is one such popular platform.
All Gnome applications have a similar look and share many components and can communicate with each other.
**KDE** is a popular alternative to **Gnome** and while it is not one I use,
I will try to include information about it whenever I can.

这段要理解三个意思：

- （1） Window System 是一个 platform，在这个 platform 之上可以运行各种 GUI-based applications
- （2） Gnome，是一种 platform
- （3） KDE，是一种 platform
