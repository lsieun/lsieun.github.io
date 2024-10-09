---
title: "git shortlog"
---

[UP](/git/git-index.html)


## Releasing logs: git shortlog

`git shortlog` shows the output of `git log` in a format
that's typically used for open source software-release announcements.
It displays **commits grouped by author with one commit subject per line**.

```text
git shortlog HEAD~6..HEAD
```
