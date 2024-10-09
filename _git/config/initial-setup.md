---
title: "Initial Setup"
sequence: "101"
---

[UP](/git/git-index.html)


## Git author

Once you've installed Git, the first thing you need to do is to tell Git your name and email (particularly before creating any commits).
Rather than usernames, Git uses **a name** and **an email address** to identify the author of a commit.

```text
$ git config --global user.name "Mike McQuaid"
$ git config --global user.email mike@mikemcquaid.com
$ git config --global user.email
mike@mikemcquaid.com
```

## Creating a repository: git init

A **Git repository** is the local collection of all the files related to a particular Git version control system and contains a `.git` subdirectory in its root.
Git keeps track of the state of the files in the repository's directory on disk.

Git repositories store all their data on your local machine.
Making commits, viewing history, and requesting differences between commits are all local operations
that don't require a network connection.
This makes all these operations much faster in Git than with centralized version control systems such as Subversion.

Let's start by initializing an empty, new local repository:

```text
$ cd /Users/mike/
$ git init GitInPracticeRedux
Initialized empty Git repository in
/Users/mike/GitInPracticeRedux/.git/
```

`git init` can be run without any arguments to create the local Git repository in the current directory. 

```text
$ mkdir hello-git
$ cd hello-git/
$ git init
Initialized empty Git repository in /home/liusen/hello-git/.git/
[liusen@centos7 hello-git]$ find .
.
./.git
./.git/branches
./.git/hooks
./.git/hooks/applypatch-msg.sample
./.git/hooks/commit-msg.sample
./.git/hooks/fsmonitor-watchman.sample
./.git/hooks/post-update.sample
./.git/hooks/pre-applypatch.sample
./.git/hooks/pre-commit.sample
./.git/hooks/pre-merge-commit.sample
./.git/hooks/prepare-commit-msg.sample
./.git/hooks/pre-push.sample
./.git/hooks/pre-rebase.sample
./.git/hooks/pre-receive.sample
./.git/hooks/push-to-checkout.sample
./.git/hooks/update.sample
./.git/info
./.git/info/exclude
./.git/description
./.git/refs
./.git/refs/heads
./.git/refs/tags
./.git/HEAD
./.git/config
./.git/objects
./.git/objects/pack
./.git/objects/info
```
