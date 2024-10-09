---
title: "查看：git ls-files"
sequence: "101"
---

[UP](/git/git-index.html)


```bash
$ git ls-files --help
```

```bash
$ git ls-files
```

When you use `git add`, Git creates an object for the contents of each file you add,
but it doesn't create an object for your **tree** right away.
Instead, it updates **the index**.
The index is found in `.git/index` and keeps track of file pathnames and corresponding blobs.
Each time you run commands such as `git add`, `git rm`, or `git mv`,
Git updates **the index** with the new pathname and blob information.

Whenever you want, you can **create a tree object from your current index**
by capturing a snapshot of its current information with the low-level `git write-tree` command.

At the moment, the index contains exactly one file, `hello.txt`.

```bash
$ git ls-files -s
100644 3b18e512dba79e4c8300dd08aeb37f8e728b8dad 0       hello.txt
```
