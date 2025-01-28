---
title: "git add"
sequence: "101"
---

[UP](/git/git-index.html)


```text
git add <file-name>
```

```text
git add <directory-name>
```

`git add` can also be passed **directories** as arguments instead of **files**.
You can add everything in the current directory and its subdirectories by running `git add`.

When a file is added to **the index**, a file named `.git/index` is created (if it doesn't already exist).
The added file contents and metadata are then added to the index file.

`git add` is used both to **initially add a file to the Git repository** and
to **request that changes to the file be used in the next commit**.

## force

Note that if `git add` fails, you may have `*.tmp` in a `.gitignore` file somewhere.
In this case, add it using `git add --force GitInPracticeReviews.tmp`.
