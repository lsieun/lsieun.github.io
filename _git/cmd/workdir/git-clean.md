---
title: "git clean"
---

[UP](/git/git-index.html)


## Deleting untracked files: git clean

When working in a Git repository, some tools may output undesirable files into your working directory.
Some text editors may use temporary files, operating systems may write thumbnail cache files, or programs may write crash dumps.

When you wish to remove these files, you could remove them manually.
But it's easier to ask Git to do so,
because it already knows which files in **the working directory** are versioned and which are **untracked**.

You can view the files that are currently **tracked** by running `git ls-files`.
You can run `git ls-files --others` (or `-o`) to show the currently **untracked files** (there should be none).

You wish to remove an untracked file named `GitInPracticeIdeas.tmp` from a Git working directory.

```text
git clean --force
```

`git clean` requires the `--force` argument because this command is potentially dangerous;
with a single command, you can remove many, many files very quickly.
Remember that accidentally losing any file or change committed to the Git system is nearly impossible.
This is the opposite situation; `git clean` will happily remove thousands of files very quickly,
and they can't be easily recovered (unless you backed them up through another mechanism).

To make `git clean` a bit safer, you can preview what will be removed before doing so by using `git clean -n` (or `--dry-run`).
This behaves like `git rm --dry-run` in that it prints the output of the removals that would be performed but doesn't actually do so.

To remove **untracked directories** as well as **untracked files**, you can use the `-d` (“directory”) parameter.
