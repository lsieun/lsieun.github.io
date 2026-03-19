---
title: "git remote"
---

[UP](/git/index.html)


There are now two repositories: **a local repository** and **a remote repository**.

![Git add/commit/push/pull/checkout cycle](/assets/images/git/git-local-remote-workflow-cycle.png)

查看帮助

```text
$ git remote --help
```

## 查看远程仓库

命令：

```text
git remote -v
git remote --verbose
```

示例：

```text
$ git remote --verbose
origin  https://github.com/lsieun/tutorials (fetch)      注意，这里是 fetch URL
origin  https://github.com/lsieun/tutorials (push)       注意，这里是 push URL
```

## 添加远程仓库

语法：

```text
git remote add <name> <URL>
```

示例：

```text
git remote add origin https://github.com/GitInPractice/GitInPracticeRedux.git.
```

## 删除远程仓库

```text
git remote remove gitee
```

## 其它

- `git remote` can also be called with the `rename` subcommands to alter remotes accordingly.
- `git remote show` queries and shows verbose information about the given remote.
- `git remote prune` deletes any remote references to branches that have been deleted from the remote repository by other users.
