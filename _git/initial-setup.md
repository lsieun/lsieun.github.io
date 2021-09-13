---
title:  "Initial Setup"
sequence: "101"
---

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

