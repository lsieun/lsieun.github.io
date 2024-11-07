---
title: "The differences between System V and BSD Unix"
sequence: "101"
---

[UP](/linux.html)


## Intro: standard syntax and BSD syntax

查看 `ps` 命令的帮助：

```bash
man ps
```

This version of `ps` accepts several kinds of options:

- (1) **UNIX options**, which may be grouped and must be preceded by **a dash**.
- (2) **BSD options**, which may be grouped and must **not** be used with **a dash**.
- (3) **GNU long options**, which are preceded by **two dashes**.

To see every process on the system using **standard syntax**:

```bash
ps -e
ps -ef
ps -eF
ps -ely
```

To see every process on the system using **BSD syntax**:

```bash
ps ax
ps axu
```

要理解 standard syntax 和 BSD syntax 的区别，需要理解两点：

- （1） 从 Unix 到 Linux 的时间线
- （2） System V、BSD 和 POSIX

## The Road From Unix To Linux

### Brief History

As you may know, Unix was "invented" in 1969 and developed in the 70's.
By the 80's there were **two distinct branches**, **System V** and **BSD**.
**System V** was always considered **more commercial**,
while **BSD** was the **university model**,
and was developed during the 80s at the University of California Berkeley.

- 1969, Unix
- 1980s, two major currents: System V and BSD
- 1991, Linux
- 1993, Debian Linux
- 1994, Red Hat Linux
- 2003, Fedora (Red Hat Linux)
- 2004, CentOS (Red Hat Linux)
- 2004, Ubuntu (Debian Linux)

简单总结：

- （1） 在 70 ～ 80 年，这十年，Unix 在发展
- （2） 在 80 ～ 90 年，这十年，Unix 分成两个主要分支：System V（侧重商业）和 BSD（侧重大学、科研）
- （3） 在 90 ～ 2000 年，这十年，Linux 出现，分成两个分支：Debian（社区运营）和 Red Hat（公司运营）
- （4） 在 2000 ～ 2010 年，这十年，从 Debian 和 Red Hat 又产生了更多的分支

![](/assets/images/linux/concept/linux-distribution-timeline.svg)

### Two distinct branches

**BSD** and is considered “university Unix”, or hobbyist Unix, because it came out of UC Berkeley in California.

> UC Berkeley = University of California, Berkeley  
> **BSD** stands for “**Berkeley Software Distribution**

**System V** is pronounced “System Five”, and was developed by AT&T. System V is considered more commercial.

| Branch     | Created By    | Flag              |
|------------|---------------|-------------------|
| `BSD`      | `UC Berkeley` | `university Unix` |
| `System V` | `AT&T`        | `commercial Unix` |

## ps: System V, BSD and POSIX

This dates back to the somewhat tortuous history of Unix.
In particular, for a while, there were **two major currents**:
**System V** developed by **AT&T**, and **BSD** developed at the **University of California, Berkeley**.
This was around the early 1980s, long before Linux (1991), let alone Ubuntu (2004).
Often these two currents made different decisions,
and even today you'll find the occasional reference to “**System V**” and “**BSD**” variants or features.

The `ps` command dates back from one of the first releases of **Unix**
(it wasn't in version 1, the earliest man page I can find online is from version 5 (p.94) in 1974).
At the time, `ps` just had a few options,
for example `ps` a would display all processes instead of just the user's,
and `ps x` would display processes with no terminal attached.
You'll note that the options don't start with `-`: at the time,
the convention of using `-` for options wasn't near-systematic like it is today,
it was mostly a thing for commands that took file names as normal arguments.

Over time, the various strands of Unix extended `ps` with many more options.
The **BSD** variant chose to retain **the original syntax**, with no leading `-`, and `a` and `x` still exist today.
The **System V** variant chose to adopt the syntactic convention of `-` for options,
and used different letters (for example `ps -e` to display all processes).
Oracle (formerly Sun) Solaris is an example of a **System V** variant
(Solaris also ships a separate `ps` executable, in a directory which is not on the default PATH,
for applications written with BSD in mind).

At the time Linux came onto the scene,
the people who used it would often have prior experience of one Unix variant or another.
Linux sometimes did things the **System V** way, sometimes the **BSD** way, sometimes its own way,
either based on technical considerations or based on the experience and tastes of whoever implemented the feature.
Linux's `ps` command started out with BSD-like options,
e.g. `ps ae` to display all processes and include environment variables in the listing.
Over time (in the late 1990s, I don't remember exactly when),
the authors of Linux's `ps` added options for people who were used to **System V**.
So today either `ps ax` or `ps -e` will list all processes under Linux,
and there is even an environment variable (`PS_PERSONALITY`)
to make `ps` behave more like various Unix old Unix variants,
for the sake of old scripts and people with set habits.

People who used several Unix variants didn't like that they'd have to modify their programs and their habits
when switching from one Unix variant to another.
So there was an effort to standardize a subset of functionality.
This led to the **POSIX** standard (led by the **IEEE**), which Ubuntu by and large follows.
The first edition whose scope included the `ps` command came out in 1992;
this one isn't available online, but the 1997 edition is.
For the `ps` command, like in many other cases, **POSIX** adopted the **System V** way of doing things.

The `ps` command's **standard syntax** is one that is compatible with both **System V** and **POSIX**.
In addition, that syntax can be said to be standard because it uses `-` to introduce options by default.
Some options exist only in one of the two syntaxes; fortunately they can be mixed in the same call.

Generally speaking, “**BSD**” vs “**System V**” doesn't have any technical implication.
It refers to history: “**BSD**” is whatever choice **BSD** made in the 1980s and thereabouts(大约；上下),
“**System V**” is whatever choice **AT&T** and their partners (especially Sun) made.
“**POSIX**” is whatever choice the **IEEE** standardization committee made.

## More Difference

### The location of binaries

One of the main differences was the location of binaries.
**System V** standardized configurations, software installation, and handling network programming,
which was in line with its corporate focus.

**System V** placed its files in `/usr/bin/` and `/usr/sbin`.

**BSD** placed its files in `/bin/` and `/sbin/`.

### Startup scripts

Another big difference is in startup scripts:
**BSD** used a script in `/etc/rc` to initialize itself and didn't use runlevels.
The `/etc/rc` file is what files were run by `init`.
To avoid having to edit `/etc/rc`,
BSD variants supported a site-specific `/etc/rc.local` file that runs near the end of the boot process.
Later BSD's, including FreeBSD and beyond, executes scripts out of the `/etc/rc.d` directory.

**System V** uses what's now called SysV (Sis Vee) Style Init.
SysV Style Init uses what are called **runlevels**, and a SysV system is always in exactly one **runlevel**.
These include normal operation, single user mode, shutdown, and others.
When you switch from one runlevel to another a series of scripts are run before and after.

### Future

Over time, the two types have blended significantly,
and modern operating systems (such as Linux) tend to have features of both.

One big difference between BSD and Linux is that
Linux is a kernel
while BSD is an operating system.
That's the biggest difference between BSD and Linux:
Linux is a a collection of little pieces, while BSD is one thing.

## Roman Numerals

Roman numerals(罗马数字) are a system of numerical notations used by the Romans.

The following table gives the Latin letters used in Roman numerals and the corresponding numerical values they represent.

| character | numerical value |
|-----------|-----------------|
| I         | 1               |
| V         | 5               |
| X         | 10              |
| L         | 50              |
| C         | 100             |
| D         | 500             |
| M         | 1000            |

The following table gives the (Europeanized) Roman numerals for the first few positive integers.

| #  | RN   | #  | RN    | #  | RN     |
|----|------|----|-------|----|--------|
| 1  | I    | 11 | XI    | 21 | XXI    |
| 2  | II   | 12 | XII   | 22 | XXII   |
| 3  | III  | 13 | XIII  | 23 | XXIII  |
| 4  | IV   | 14 | XIV   | 24 | XXIV   |
| 5  | V    | 15 | XV    | 25 | XXV    |
| 6  | VI   | 16 | XVI   | 26 | XXVI   |
| 7  | VII  | 17 | XVII  | 27 | XXVII  |
| 8  | VIII | 18 | XVIII | 28 | XXVIII |
| 9  | IX   | 19 | XIX   | 29 | XXIX   |
| 10 | X    | 20 | XX    | 30 | XXX    |

## Reference

- [What is the difference between standard syntax and BSD syntax?](https://askubuntu.com/questions/484982/what-is-the-difference-between-standard-syntax-and-bsd-syntax)
