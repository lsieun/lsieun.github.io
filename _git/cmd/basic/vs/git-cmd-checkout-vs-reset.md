---
title: "checkout vs reset"
sequence: "101"
---

[UP](/git/git-index.html)


- `git reset` modifies **the current branch pointer,** so it points to another commit.
- `git checkout` modifies the `HEAD` pointer, so it points to another branch (or, rarely, commit).

具体示例，假如我们处于 `master` 分支：

-  如果执行 `git reset --hard v0.1-release`，会让 `master` 分支指向 `v0.1-release` 分支。
- 如果执行 `git checkout v0.1-release`，会将 current branch (the `HEAD` pointer) 指向 `v0.1-release` 分支。
