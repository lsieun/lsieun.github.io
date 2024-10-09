---
title: "git init"
---

[UP](/git/git-index.html)


- repository
  - local repository
    - bare repository
    - non-bare repository
  - remote repository

## git init

```text
$ git init
Initialized empty Git repository in .git/
```

Git doesn't care whether you start with a completely empty directory or if you start with a directory full of files.
In either case, the process of converting the directory into a Git repository is the same.

To signify that your directory is a Git repository,
the `git init` command creates a hidden directory, called `.git`, at the top level of your project.
Git places all its revision information in this one, top-level `.git` directory.

Everything in your `~/public_html` directory remains untouched.
Git considers it your project's **working directory**, or the directory where you alter your files.
In contrast, the repository hidden within `.git` is maintained by Git.

## Initializing a local repository in a server hosting format: git init --bare

The Git repositories you've seen have all had a similar structure:
**the working directory** contains a checkout of the files in the current branch and
**a `.git` subdirectory** that contains the repository data.

Git stores data in a highly space-efficient format.
The checked-out files in a repository's working directory
may sometimes take up more space than the compressed version of all files stored in the `.git` directory!

On a server, **the working directory** should never be used directly, so it's better to not create one at all.
Because you'll be sending/receiving Git objects to/from various Git clients with `git push`, `git fetch`, and `git pull`,
you don't need to have the actual files checked out on disk.
A Git repository without a working directory is known as a **bare repository**.
The major difference compared to the first repository you created is that this repository isn't in a `.git` directory.

You wish to create a bare Git repository:

- Change to the directory you wish to contain your new repository directory
- Run `git init --bare GitInPracticeBare.git`

```text
$ git init --bare GitInPracticeBare.git
Initialized empty Git repository in /Users/mike/GitInPracticeBare.git/
```

Bare repositories don't allow new commits to be created locally; they must be pushed from another repository.

HOW SHOULD YOU NAME BARE REPOSITORIES?
When creating bare repositories,
it's good practice to name them with the extension `.git` to make it clear that they're bare.

To clone this Git repository into a non-bare repository on the same machine,
run `git clone` with the path on disk to the repository and the new, non-bare repository name as arguments:
for example, `git clone /Users/mike/GitInPracticeBare.git GitInPracticeNonBare`.
