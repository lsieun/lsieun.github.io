---
title: "Shell Vs Terminal Vs Console"
sequence: "shell-terminal-console"
---

[UP](/linux.html)


URL:

- https://code.tutsplus.com/tutorials/the-command-line-is-your-best-friend--net-30362
- http://linuxcommand.org/lc3_lts0010.php
- https://superuser.com/questions/144666/what-is-the-difference-between-shell-console-and-terminal

![](/assets/images/linux/concept/cmd-console-terminal-shell-schema.png)

In ye olden days, these three items were **separate hardware**.
**The console** was nothing more than **a monitor** and **keyboard**;
it had **no computing capabilities**.
It connected to a terminal, via a serial interface, the most common being the RS-232 connector.

**A terminal** is akin to an end-point to a mainframe.
It usually had **some computing capabilities** and could communicate over a network,
or some form of specialized connection, to a mainframe.
A terminal also provided **administrative rights** to the system, which was why it was usually kept in a closed room.
The consoles from the employees' area connected to these terminals,
allowing them to work without having administrative access to the mainframe.

**Consoles** and **terminals** eventually merged in **a single device**,
the most notorious being the **VT terminals** emulated in modern Linux distributions.

![](/assets/images/linux/concept/cmd-vt100-vt101.png)

**The shell** is the actual program capable of reading the user's input and providing the result on the screen.
A shell can be textual (like the CLI) or graphical (like Windows' GUI).
In today's computing, a shell is much more than a simple interface between the user and system.
It is responsible for managing processes, windows, applications, commands and other aspects of the system.

**The shell** interprets the commands entered through the command line,
and a user can combine **multiple commands** into **a single script**.
Modern shells have a scripting language of their own, providing the ability to perform complex decisions.

> 这段理解两个意思：  
> （1）script 是 command 的集合；  
> （2）command 和 script 都是 shell 处理的对象。

Most modern Linux distributions, as well as Mac OSX, use a shell, called `BASH`.
Solaris and OpenIndiana use `KornShell` by default, which is another variant of `BASH`.
