---
title: "JGit Intro"
sequence: "101"
---

This project is licensed under the EDL (Eclipse Distribution License).

[learn-jgit][learn-jgit]

The [JGit](https://www.eclipse.org/jgit/) core library requires Java 8, [JSch](http://www.jcraft.com/jsch/) to make SSH connections and [JavaEWAH](https://github.com/lemire/javaewah) for fast bit array manipulations.

Source Code:

- [Google: JGit](https://gerrit.googlesource.com/jgit/)
- [Gitee Mirror: JGit](https://gitee.com/mirrors/jgit)

JGit has two basic levels of API: **plumbing** and **porcelain**. The terminology for these comes from Git itself. JGit is divided into the same areas:

- porcelain APIs: front-end for common user-level actions (similar to Git command-line tool)
- plumbing APIs: direct interacting with low-level repository objects

The starting point for most JGit sessions is in the `Repository` class.
The first thing we are going to do is the creation of a new `Repository` instance.

The `init` command will let us create an empty repository:


