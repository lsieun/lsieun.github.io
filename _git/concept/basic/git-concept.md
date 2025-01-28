---
title: "git concept"
sequence: "101"
---

[UP](/git/git-index.html)


## Two primary data structures

Within a repository, Git maintains two primary data structures, **the object store** and **the index**.
All of this repository data is stored at the root of your working directory in a hidden subdirectory named `.git`.

```text
                                                                                  ┌─── HEAD
                                                              ┌─── names ─────────┤
                                                              │                   └─── branch.name
                                                              │
                                         ┌─── Refs ───────────┤                                                    ┌─── .git/refs/heads/
                                         │                    │                                                    │
                                         │                    │                   ┌─── space ───┼─── .git/refs/ ───┼─── .git/refs/remotes/
                                         │                    │                   │                                │
                                         │                    └─── perspective ───┤                                └─── .git/refs/tags/
                                         │                                        │
                                         │                                        └─── time ────┼─── permanent
                                         │
                                         │                                                       ┌─── lightweight
                                         │                                        ┌─── tag ──────┤
                                         │                                        │              └─── annotated
                                         │                                        │
               ┌─── Repository (.git) ───┤                    ┌─── Git.Objects ───┼─── commit
               │                         │                    │                   │
               │                         │                    │                   ├─── tree
               │                         ├─── Object.Store ───┤                   │
               │                         │                    │                   └─── blob
               │                         │                    │
               │                         │                    │                   ┌─── space ───┼─── .git/objects/
               │                         │                    └─── perspective ───┤
               │                         │                                        └─── time ────┼─── permanent
               │                         │
Git Concept ───┤                         │                                        ┌─── space ───┼─── .git/index
               │                         │                    ┌─── perspective ───┤
               │                         └─── Index.Area ─────┤                   └─── time ────┼─── transitory
               │                                              │
               │                                              └─── cmd ───────────┼─── git ls-files -s
               │
               │                                                             ┌─── tracked file
               │                                                             │
               │                                            ┌─── classify ───┼─── untracked file
               │                                            │                │
               └─── Working.Directory ───┼─── File.State ───┤                └─── ignored file
                                                            │
                                                            └─── cmd ────────┼─── git status
```

- **The object store** is designed to be efficiently copied during a clone operation.
- **The index** is transitory information, is private to a repository, and can be created or modified on demand as needed.

### Git Object Types

At the heart of Git's repository implementation is the **object store**.
It contains your original data files and all the log messages, author information, dates,
and other information required to rebuild any version or branch of the project.

**Git places only four types of objects in the object store: the blobs, trees, commits, and tags**.
These four atomic objects form the foundation of Git's higher level data structures.

**Blobs**: Each version of a file is represented as a blob.
A blob is treated as being opaque.
A blob holds a file's data but does not contain any metadata about the file or even its name.

**Trees**: A tree object represents one level of directory information.
It records blob identifiers, path names, and a bit of metadata for all the files in one directory.
It can also recursively reference other (sub)tree objects and
thus build a complete hierarchy of files and subdirectories.

**Commits**: A commit object holds metadata for each change introduced into the repository,
including the author, committer, commit date, and log message.
Each commit points to a tree object that captures, in one complete snapshot,
the state of the repository at the time the commit was performed.
The initial commit, or root commit, has no parent.
Most commits have one commit parent, although later we explain how a commit can reference more than one parent.

**Tags**: A tag object assigns an arbitrary yet presumably human-readable name to a specific object, usually a commit.
Although `9da581d910c9c4ac93557ca4859e767f5caf5169` refers to an exact and well-defined commit,
a more familiar tag name like `Ver-1.0-Alpha` might make more sense!


### Index

**The index** is a temporary and dynamic binary file that describes **the directory structure of the entire repository**.
More specifically, the index captures a version of the project's overall structure at some moment in time.
The project's state could be represented by a commit and a tree from any point in the project's history,
or it could be a future state toward which you are actively developing.

One of the key, distinguishing features of Git is that
it enables you to alter the contents of the index in methodical, well-defined steps.
**The index** allows a separation between **incremental development steps** and **the committal of those changes**.

Here's how it works. As the developer, you execute Git commands to stage changes in the index.
Changes usually add, delete, or edit some file or set of files.
The index records and retains those changes, keeping them safe until you are ready to commit them.
You can also remove or replace changes in the index.
Thus, the index allows a gradual transition, usually guided by you,
from one complex repository state to another, presumably better state.

The index plays an important role in **merges**,
allowing multiple versions of the same file to be managed, inspected, and manipulated simultaneously.

## workflow

The typical workflow is that you'll change the contents of files in a repository, review the **diffs**,
add them to the **index**,
create a new **commit** from the contents of the **index**,
and repeat this cycle.

![typical workflow](/assets/images/git/git-typical-workflow.png)

## index staging area

Git doesn't add anything to the index without your instruction.
As a result, the first thing you have to do with a file you want to include in a Git repository is request that
Git add it to the index.

When a file is added to the index, a file named `.git/index` is created
(if it doesn't already exist). The added file contents and metadata are then added to the index file.

You've requested two things of Git here:

- Git should **track the contents of the file** as it changes (this isn't done without an explicit `git add`).
- The contents of the file when `git add` was run should be added to the **index**, ready to create the next commit.

## commit

Creating a **commit** stores the changes to one or more files.

Each commit contains

- a message entered by the author,
- details of the commit author,
- a unique commit reference (in Git, **SHA-1 hashes** such as `86bb0d659a39c98808439fadb8dbd594bec0004d`)
- a pointer to the preceding commit (known as the **parent commit**),
- the date the commit was created, and
- a pointer to the contents of files when the commit was made.

The file contents are typically displayed as the **diff**
(the differences between the files before and the files after the commit).

![](/assets/images/git/commit-parts.png)

## Object store


Figure 1.2 showed an example of a commit object and how it stores metadata and referenced file contents.
The file-contents reference is actually a reference to **a tree object**.
**A tree object** stores a reference to all the **blob objects** at a particular point in time
and **other tree objects** if there are any subdirectories.
**A blob object** stores the contents of a particular version of a particular single file in the Git repository.

![](/assets/images/git/commit-blob-tree-objects.png)

## Refs

In Git, `refs` are the possible ways of addressing individual commits.
They're an easier way to refer to a specific **commit** or **branch** when specifying an argument to a Git command.

### branch name

**The first ref** you've already seen is a branch
(which is `master` or `main` by default if you haven't created any other branches).
**Branches are pointers to specific commits**.
Referencing the branch name `master` is the same as referencing the SHA-1 of the commit at the top of the `master` branch,
such as the short SHA-1 `6b437c7` in the last example.
Whenever you might type `6b437c7` in a command, you can instead type `master`, and vice versa.
**Using branch names is quicker and easier** to remember for referencing commits than always using SHA-1s.

**Refs can also have modifiers appended**.
Suffixing a ref with `~1` is the same as saying “one commit before that ref.”
For example, `master~1` is the penultimate commit on the master branch: the short SHA-1 `6576b68` in the last example.
Another equivalent syntax is `master^`, which is the same as `master~1` (and `master^^` is equivalent to `master~2`).

### HEAD

**The second ref** is the string `HEAD`.
`HEAD` always points to the top of whatever you currently have checked out,
so it's almost always **the top commit** of **the current branch** you're on.
If you have the `master` branch checked out, then `master` and `HEAD` (and `6b437c7`) are equivalent.
See the `master/HEAD` pointers demonstrated in the following figure.

![](/assets/images/git/refs-master-head.png)

These `git diff` invocations are all equivalent:

- `git diff master~1 master`
- `git diff master~1..master`
- `git diff master~1..`
- `git diff master^ master`
- `git diff master~1 HEAD`
- `git diff 6576b68 6b437c7`

### rev-parse

You can also use the tool `git rev-parse` if you want to see what SHA-1 a given ref expands to.

```text
$ git rev-parse master
030e4624ad709a606374d827961187a6146b03a6

$ git rev-parse HEAD
030e4624ad709a606374d827961187a6146b03a6

$ git rev-parse 030e46
030e4624ad709a606374d827961187a6146b03a6
```
