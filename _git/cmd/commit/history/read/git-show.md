---
title: "git show"
---

[UP](/git/git-index.html)


`git show` is a command similar to `git log`, but it shows a single commit.
It also defaults to showing what was changed in that commit.
Remember that `git log` has a `--patch` (or `-p`) argument to show what was changed by each commit in its output.

```text
$ git show HEAD^
```

输出结果后半段的内容：
It's the equivalent of typing `git diff HEAD^^..HEAD^` — the difference between the previous commit and the one before it.

The `git show HEAD^` output is equivalent to `git log --max-count=1 --patch HEAD^`.

```text
git show branchname
git show master
```

```text
git show branchname:filename
```
