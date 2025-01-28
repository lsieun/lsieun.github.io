---
title: "分支"
sequence: "101"
---

[UP](/git/git-index.html)


**In Git, a branch is no more than a pointer to a particular commit**.
我觉得，这句话谈到了 branch 的本质，就是指向 commit 的指针。

## 查看帮助

```text
git help branch
```

## 本地

查看分支：

```text
git branch
```

创建本地分支：

```text
git branch dev
```

切换本地分支：

```text
git checkout dev
```

创建本地分支并切换到该分支：

```text
git checkout -b dev
```

To check out a branch at a point other than the **last commit** of the current branch (also known as `HEAD`):

```bash
$ git checkout -b <new-branch-name> [<start-point>]
```

几个示例：

```bash
$ git checkout -b new-branch some_other_branch  # branch
$ git checkout -b new-branch af295              # commit
$ git checkout -b new-branch HEAD~5             # ref
$ git checkout -b new-branch v1.0.5             # tag
```

## 远程

```text
git branch -r
git branch --remotes
```

## 本地与远程

### 本地 -> 远程

将本地 `dev` 分支推送到远程 `origin/dev` 分支：

```text
git checkout dev
git push -u origin dev

或者

git checkout dev && git push -u origin dev
```

```text
$ git branch -v
* main 0e1a571 2023-02-04

$ git branch -vv
* main 0e1a571 [origin/main] 2023-02-04
```

### 远程 -> 本地

根据远程 `origin/dev` 分支，创建 `local dev` 分支，并切换到 `local dev` 分支：

```text
git checkout -b dev origin/dev
```
