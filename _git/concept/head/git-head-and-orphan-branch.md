---
title: "HEAD 与 Orphan 分支"
sequence: "103"
---

[UP](/git/git-index.html)


## HEAD

文件位置：`.git/HEAD`

内容：

### master 分支

```text
# 当前是 master 分支
$ git branch
  dev
* master

$ cat .git/HEAD
ref: refs/heads/master

$ cat .git/refs/heads/master
ea1dba234d678e21f7a297e38d79056d4c496bcf

$ git rev-parse master
ea1dba234d678e21f7a297e38d79056d4c496bcf

$ git rev-parse HEAD
ea1dba234d678e21f7a297e38d79056d4c496bcf
```

### dev 分支

```text
# 切换到 dev 分支
$ git checkout dev
Switched to branch 'dev'

$ git branch
* dev
  master
  
$ cat .git/HEAD
ref: refs/heads/dev

$ cat .git/refs/heads/dev
5982d1e849edbbc79a2eb08850f1ade6408cb52a

$ git rev-parse dev
5982d1e849edbbc79a2eb08850f1ade6408cb52a

$ git rev-parse HEAD
5982d1e849edbbc79a2eb08850f1ade6408cb52a
```

### orphan 分支

```text
# 切换到一个 orphan 分支
$ git checkout --orphan new-orphan-branch
Switched to a new branch 'new-orphan-branch'

# 查看不到新分支的信息
$ git branch
  dev
  master

# HEAD 指向了 refs/heads/new-orphan-branch
$ cat .git/HEAD
ref: refs/heads/new-orphan-branch

# 但是，此时具体的 new-orphan-branch 没有创建
$ ls .git/refs/heads
dev  master
```
