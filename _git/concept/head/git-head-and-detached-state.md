---
title: "HEAD 与 Detached State"
sequence: "102"
---

[UP](/git/git-index.html)


## Attached & detached state

First, it's essential to know that the `HEAD` pointer can be in either of two states: **attached** or **detached**.

The default state is **attached**,
where any manipulation of the history is automatically recorded to the branch `HEAD` is currently referencing.

In a **detached** state, experimental changes can be made without impacting any existing branch,
as `HEAD` is referencing the underlying commit directly and is not "attached" to a particular branch.

## Detached HEAD

In rare cases, the HEAD file does NOT contain a branch reference, but a SHA-1 value of a specific revision.
This happens when you checkout a specific commit, tag, or remote branch.
Your repository is then in a state called **Detached HEAD**.

要将 `HEAD` 指向某个 commit，可以使用以下命令：

```shell
git checkout <commit-id>
```

这个命令会将 `HEAD` 移动到指定的 `<commit-id>` 所表示的提交上，从而进入 detached HEAD 状态。在这种状态下，你可以查看特定提交的内容，进行测试或其他操作。

如果想要在 `HEAD` 指向某一 commit 后创建一个新分支，可以在命令中指定一个新分支名称：

```shell
git checkout -b <new-branch-name> <commit-id>
```

这将会创建一个新分支，并将 `HEAD` 指向指定的 commit，使得新分支从该 commit 开始。
