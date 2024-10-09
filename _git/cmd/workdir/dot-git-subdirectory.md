---
title: ".git subdirectory"
sequence: "111"
---

[UP](/git/git-index.html)


## .git subdirectory

running the `find` command.

```text
$ find .git/
.git/
.git/config         // (1) Local configuration
.git/description        // (2) Description file
.git/HEAD                   // (3) HEAD pointer
.git/hooks
.git/hooks/applypatch-msg.sample    // (4) Event hooks
.git/hooks/commit-msg.sample
.git/hooks/fsmonitor-watchman.sample
.git/hooks/post-update.sample
.git/hooks/pre-applypatch.sample
.git/hooks/pre-commit.sample
.git/hooks/pre-merge-commit.sample
.git/hooks/pre-push.sample
.git/hooks/pre-rebase.sample
.git/hooks/pre-receive.sample
.git/hooks/prepare-commit-msg.sample
.git/hooks/push-to-checkout.sample
.git/hooks/update.sample
.git/info
.git/info/exclude    // (5) Excluded files
.git/objects
.git/objects/info    // (6) Object information
.git/objects/pack    // (7) Pack files
.git/refs
.git/refs/heads      // (8) Branch pointers
.git/refs/tags       // (9) Tag pointers
```

- (1) contains the configuration of the local repository.
- (2) is a file that describes the repository.
- (3), (8), and (9) contain a **HEAD pointer**, **branch pointers**, and **tag pointers**, respectively, that point to **commits**.
- (4) shows event hook samples (scripts that run on defined events). For example, `pre-commit` is run before every new commit is made.
- (5) contains files that should be excluded from the repository.
- (6) and (7) contain object information and pack files, respectively, that are used for object storage and reference.

You may see some other files in there, but this is a fresh git init repository — it's what you see by default.  
The `description` file is only used by the GitWeb program, so don't worry about it.
The `config` file contains your project-specific configuration options,
and the `info` directory keeps a global exclude file for ignored patterns that you don't want to track in a `.gitignore` file.
The `hooks` directory contains your client- or server-side hook scripts.

This leaves four important entries: the `HEAD` and (yet to be created) **index files**, and the `objects` and `refs` directories.
These are the core parts of Git.
The `objects` directory stores all the content for your database,
the `refs` directory stores pointers into `commit` objects in that data (branches),
the `HEAD` file points to the `branch` you currently have checked out,
and the `index` file is where Git stores your staging area information.

Git is a content-addressable filesystem. What does that mean?
It means that at the core of Git is a simple key-value data store.
You can insert any kind of content into it, and it will give you back a key that you can use to retrieve the content again at any time.
To demonstrate, you can use the plumbing command `hash-object`, which takes some data, stores it in your `.git` directory,
and gives you back the key the data is stored as.
First, you initialize a new Git repository and verify that there is nothing in the objects directory:

```text
$ git init test
Initialized empty Git repository in /tmp/test/.git/
$ cd test
$ find .git/objects
.git/objects
.git/objects/info
.git/objects/pack
$ find .git/objects -type f
```

But remembering the SHA-1 key for each version of your file isn't practical;
plus, you aren't storing the **filename** in your system — just the content.

The next type we'll look at is the `tree`,
which solves the problem of storing the **filename** and also allows you to store a group of files together.
Git stores content in a manner similar to a UNIX filesystem, but a bit simplified.
All the content is stored as `tree` and `blob` objects,
with `trees` corresponding to UNIX directory entries and `blobs` corresponding more or less to inodes or file contents.
A single `tree` object contains one or more tree entries,
each of which contains a SHA-1 pointer to a blob or subtree with its associated mode, type, and filename.

**You shouldn't edit any of these files directly** until you have a more advanced understanding of Git (or never).
You'll instead modify these files and directories by interacting with the Git repository through Git's filesystem commands.

Initially, the `.git/objects` directory (the directory for all of Git's objects) is empty, except for a few placeholders.

```text
$ find .git/objects/
.git/objects/
.git/objects/pack
.git/objects/info
```

Let's now carefully create a simple object:

```text
echo "hello world" > hello.txt
git add hello.txt
```

If you typed "hello world" exactly as it appears here (with no changes to spacing or capitalization),
then your `objects` directory should now look like this:

```text
$ find .git/objects/
.git/objects/
.git/objects/pack
.git/objects/info
.git/objects/3b
.git/objects/3b/18e512dba79e4c8300dd08aeb37f8e728b8dad
```

```bash
$ find .git/objects/ -type f
```

```bash
$ echo "hello world" | git hash-object -w --stdin
3b18e512dba79e4c8300dd08aeb37f8e728b8dad
```

The hash in this case is `3b18e512dba79e4c8300dd08aeb37f8e728b8dad`.
The 160 bits of an SHA1 hash correspond to 20 bytes,
which takes 40 bytes of hexadecimal to display,
so the content is stored as `.git/objects/3b/18e512dba79e4c8300dd08aeb37f8e728b8dad`.
Git inserts a `/` after the first two digits to improve filesystem efficiency.
(Some filesystems slow down if you put too many files in the same directory;
making the first byte of the SHA1 into a directory is an easy way to create a fixed,
256-way partitioning of the namespace for all possible objects with an even distribution.)

To show that Git really hasn't done very much with the content in the file
(it's still the same comforting "hello world"),
you can use the hash to pull it back out of the object store any time you want:

```text
$ git cat-file -p 3b18e512dba79e4c8300dd08aeb37f8e728b8dad
hello world
```

```text
# long SHA1
$ git cat-file -p 3b18e512dba79e4c8300dd08aeb37f8e728b8dad
hello world
```

```text
# short SHA1
$ git rev-parse 3b18e512d
3b18e512dba79e4c8300dd08aeb37f8e728b8dad
```

When you use `git add`, Git creates an object for the contents of each file you add,
but it doesn't create an object for your **tree** right away.
Instead, it updates **the index**.
The index is found in `.git/index` and keeps track of file pathnames and corresponding blobs.
Each time you run commands such as `git add`, `git rm`, or `git mv`,
Git updates **the index** with the new pathname and blob information.

At the moment, the index contains exactly one file, `hello.txt`.

```text
$ git ls-files -s
100644 3b18e512dba79e4c8300dd08aeb37f8e728b8dad 0	hello.txt
```

Whenever you want, you can **create a tree object from your current index**
by capturing a snapshot of its current information with the low-level `git write-tree` command.

Here you can see the association of the file, `hello.txt`, and the `3b18e5...` blob.

Next, let's capture **the index state** and save it to **a tree object**:

```text
$ git write-tree
68aba62e560c0ebc3396e8ae9335232cd93a3f60

$ find .git/objects/
.git/objects/
.git/objects/pack
.git/objects/info
.git/objects/3b
.git/objects/3b/18e512dba79e4c8300dd08aeb37f8e728b8dad
.git/objects/68
.git/objects/68/aba62e560c0ebc3396e8ae9335232cd93a3f60
```

Now there are two objects: the "hello world" object at `3b18e5` and a new one, the tree object, at `68aba6`.
As you can see, the SHA1 object name corresponds exactly to the subdirectory and filename in `.git/objects`.

But what does a tree look like?
Because it's an object, just like the blob, you can use the same low-level command to view it.

```text
$ git cat-file -p 68aba6
100644 blob 3b18e512dba79e4c8300dd08aeb37f8e728b8dad    hello.txt
```

The contents of the object should be easy to interpret.
The first number, 100644, represents the file attributes of the object in octal,
which should be familiar to anyone who has used the Unix chmod command.
Here, `3b18e5` is the object name of the **hello world** blob, and `hello.txt` is the name associated with that blob.

## Steps

```bash
$ git init
Initialized empty Git repository in /home/liusen/my-git-repo/.git/
$ find .git/
.git/
.git/branches
...
.git/refs
.git/refs/heads
.git/refs/tags
.git/HEAD
.git/config
.git/objects
.git/objects/pack
.git/objects/info
$ cat .git/HEAD 
ref: refs/heads/master
$ cat .git/refs/heads/master
cat: .git/refs/heads/master: No such file or directory
$ git branch --list
$ git rev-parse HEAD
HEAD
fatal: ambiguous argument 'HEAD': unknown revision or path not in the working tree.
Use '--' to separate paths from revisions, like this:
'git <command> [<revision>...] -- [<file>...]'
```

| 步骤         | 主要命令                                           | 次要命令                             |
|------------|------------------------------------------------|----------------------------------|
| 第一步 file   | `echo "hello world" > hello.txt`               |                                  |
|            |                                                | `echo "hello world"              | git hash-object --stdin` |
| 第二步 blob   | `git hash-object -w hello.txt`                 |                                  |
|            |                                                | `find .git/objects/ -type f`     |
|            |                                                | `git cat-file -p <blob_id>`      |
| 第三步 index  | `git update-index --add hello.txt`             |                                  |
|            |                                                | `git ls-files -s`                |
| 第四步 tree   | `git write-tree`                               |                                  |
|            |                                                | `find .git/objects/ -type f`     |
|            |                                                | `git cat-file -p <tree_id>`      |
| 第五步 commit | `echo 'first commit'                           | git commit-tree 68aba6`          |  |
|            |                                                | `find .git/objects/ -type f`     |
|            |                                                | `git cat-file -p <commit_id>`    |
|            |                                                | `git log`, `git log <commit_id>` |
| 第六步 master | `git update-ref refs/heads/master <commit_id>` |                                  |
|            |                                                | `find .git/refs/ -type f`        |
|            |                                                | `cat .git/refs/heads/master`     |
|            |                                                | `git rev-parse master`           |
| 第七步 HEAD   | `git symbolic-ref HEAD refs/heads/master`      |                                  |
|            |                                                | `cat .git/HEAD`                  |
|            |                                                | `git symbolic-ref HEAD`          |
|            |                                                | `git rev-parse HEAD`             |
