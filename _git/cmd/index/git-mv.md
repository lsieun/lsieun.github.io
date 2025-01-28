---
title: "git mv"
sequence: "102"
---

[UP](/git/git-index.html)


## Renaming or moving a file: git mv

Git keeps track of changes to files in the working directory of a repository by their name.
When you **move or rename a file**, Git doesn't see that a file was moved;
it sees that **there's a file with a new filename**, and **the file with the old filename was deleted**
(even if the contents remain the same).
As a result, **renaming or moving a file in Git is essentially the same operation**;
both tell Git to look for an existing file in a new location.

```text
$ git mv myFile.txt newFile.txt
$ git commit --message "rename myFile.txt to newFile.txt"
```

Moving and renaming files in version control systems rather than deleting and re-creating them is done to preserve their history.
For example, when a file has been moved into a new directory,
you'll still be interested in the previous versions of the file before it was moved.
In Git's case, it will try to auto-detect renames or moves on `git add` or `git commit`;
if a file is deleted and a new file is created, and those files have a majority of lines in common,
Git will automatically detect that the file was moved and `git mv` isn't necessary.
Despite this handy feature, it's good practice to use `git mv`
so you don't need to wait for a `git add` or `git commit` for Git to be aware of the move and
so you have consistent behavior across different versions of Git (which may have differing move auto-detection behavior).

After running `git mv`, the move or rename will be added to Git's **index staging area**,
which means the change has been staged for inclusion in the next commit.

It's also possible to **rename files or directories** and **move files or directories** into
**other directories in the same Git repository** using the `git mv` command and the same syntax as earlier.
