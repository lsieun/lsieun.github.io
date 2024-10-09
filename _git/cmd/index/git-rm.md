---
title: "git rm"
sequence: "103"
---

[UP](/git/git-index.html)


Removing version-controlled files is safer than removing non-version-controlled files
because even after removal, the files still exist in the history.

```text
$ git rm <filename>
$ git commit --message "remove unfavourable file"
```

Git only interacts with the Git repository when you explicitly give it commands,
which is why when you remove a file, Git doesn't automatically run a `git rm` command.
The `git rm` command is indicating to Git not just that **you wish for a file to be removed**,
but also (like `git mv`) that **this removal should be part of the next commit**.

If you want to see a simulated run of `git rm` without actually removing the requested file,
you can use `git rm -n` (or `--dry-run`).
This will print the output of the command as if it were running normally and indicate success or failure,
but without removing the file.

To remove a directory and all the unignored files and subdirectories within it,
you need to use `git rm -r` (where the `-r` stands for recursive).
When run, this deletes the directory and all unignored files under it.
This combines well with `--dry-run` if you want to see what would be removed before removing it.

WHAT IF A FILE HAS UNCOMMITTED CHANGES?
If a file has uncommitted changes but you still wish to remove it,
you need to use the `git rm -f` (or `--force`) option to indicate to Git that
you want to remove it before committing the changes.
