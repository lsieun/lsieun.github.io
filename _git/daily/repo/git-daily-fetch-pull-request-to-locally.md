---
title: "将 Pull Request 拉取到本地"
sequence: "101"
---

[UP](/git/git-index.html)


## GitHub

```text
git fetch upstream pull/$pull_request_number/head:$local_branch_name
git checkout local_branch_name
```

```text
git fetch upstream pull/1/head:local_branch_name
git checkout local_branch_name
```

### 示例一

仓库地址：

```text
https://github.com/ardalis/Specification
```

```text
# 第 1 步，克隆远程仓库到本地
$ git clone https://github.com/ardalis/Specification

# 第 2 步，切换到项目目录
$ cd Specification/

# 第 3 步，查看远程仓库的标识，为『 origin 』
$ git remote -v
origin  https://github.com/ardalis/Specification (fetch)
origin  https://github.com/ardalis/Specification (push)

# 第 4 步，将远程仓库『 origin 』 的 Pull Request 拉取到本地 tmp-branch 分支
$ git fetch origin pull/1/head:tmp-branch
From https://github.com/ardalis/Specification
 * [new ref]         refs/pull/1/head -> tmp-branch

# 到这里，在 .git\refs\heads 目录里新增了一个 tmp-branch 分支

# 第 5 步，查看本地分支
$ git branch
* main
  tmp-branch

# 第 6 步，切换到目标分支。这时，就可以看到 Pull Request 中的修改信息了。
$ git checkout tmp-branch
Switched to branch 'tmp-branch'
```
