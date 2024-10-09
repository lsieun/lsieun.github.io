---
title: "git clone"
---

[UP](/git/git-index.html)


The process of creating **a new local repository** from **an existing remote repository** is known as **cloning a repository**.

With Git, it's known as **cloning** because you're making a complete copy of that repository by downloading all **commits**,
**branches**, and **tags**;
you're putting the complete history of the repository onto your local machine.


```text
$ git clone https://github.com/GitInPractice/GitInPracticeRedux.git
Cloning into 'GitInPracticeRedux'...
remote: Enumerating objects: 78, done.
remote: Total 78 (delta 0), reused 0 (delta 0), pack-reused 78
Receiving objects: 100% (78/78), 7.59 KiB | 409.00 KiB/s, done.
Resolving deltas: 100% (27/27), done.
```

```text
$ cd GitInPracticeRedux/

$ git remote --verbose
origin  https://github.com/GitInPractice/GitInPracticeRedux.git (fetch)
origin  https://github.com/GitInPractice/GitInPracticeRedux.git (push)
```

`git clone` can take `--bare` and `--mirror` flags, which create a repository suitable for hosting on a server.

`git clone` can also take a `--depth` flag followed by a positive integer, which creates a shallow clone.
A shallow clone is one where only the specified number of revisions are downloaded from the remote repository;
it's limited, because it can't be cloned/fetched/pushed from or pushed to.
This can be useful for reducing the clone time for very large repositories.

The `--recurse-submodules` (or `--recursive`) flag initializes all the Git submodules in the repository.

## Mirroring a repository: git clone --mirror

There are times when you wish to host a new Git repository that's a mirror of another — a functionally identical copy.
This could be for backup, providing a local cache for increased speed, or moving a repository to another location.
Recall that `git clone` creates a clone of the repository locally with **all commits, branches, and tags**
that are in the repository you've cloned from.

If you `git clone` a repository with a branch named `testing`,
your new, local clone will contain a remote branch named `origin/testing`.
But what if you wanted this to create not only the `origin/testing` remote branch
but also a local branch named `testing`?
In this case, you'd use the `--mirror` flag for `git clone`,
which creates local branches for all remote branches it finds (or, in Git terminology, matches all refs locally).
This is useful when you want to create an exact copy of another repository (a mirror)
so others can clone from it and get the same results as cloning from the original repository, or to keep as a backup.
`git clone --mirror` is effectively what GitHub does when you fork a repository:
it makes a complete copy that can be modified without changing the original repository and creates all the same branches.

You wish to mirror an existing remote repository:

- Change to the directory you wish to contain your new repository directory
- Run `git clone --mirror https://github.com/GitInPractice/GitInPracticeRedux.git`

```text
$ git clone --mirror https://gitee.com/lsieun/learn-java-asm
```

```text
                    ┌─── 注意，这里是 bare repository
             ┌──────┴──────┐
Cloning into bare repository 'learn-java-asm.git'...
remote: Enumerating objects: 542, done.
remote: Counting objects: 100% (542/542), done.
remote: Compressing objects: 100% (487/487), done.
remote: Total 799 (delta 249), reused 0 (delta 0), pack-reused 257
Receiving objects: 100% (799/799), 243.87 KiB | 326.00 KiB/s, done.
Resolving deltas: 100% (373/373), done.
```

`git clone --mirror` creates a **bare repository** when it creates a mirror.
This is because `--mirror` is used only when hosting a repository for other repositories to pull from.

`git clone` can take the following tags:

- No flags: Creates a normal (non-bare) repository with remote branches
- `--bare` flag: Creates a bare repository with remote branches
- `--mirror` flag: Creates a bare repository with remote branches and local branches for every remote branch

```text
$ ls
HEAD  config  description  hooks/  info/  objects/  packed-refs  refs/
                                                        │
                                                        └─── this is packed-refs file
```

The `packed-refs` file contains all the packed refs (refs in Git's format for data internal and external transfer).
It contains **all the created branches, pull requests, and tags**
that were created in this repository.
These will now be shared with any other repositories that clone this one.
