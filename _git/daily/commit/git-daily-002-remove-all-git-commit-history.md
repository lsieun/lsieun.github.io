---
title: "删除所有 Git 提交历史"
sequence: "102"
---

[UP](/git/git-index.html)


## 方法一

```text
$ git checkout --orphan latest-branch
$ git add -A
$ git commit -am "Truncate history"
$ git branch -D main
$ git branch -m main
$ git push -f origin main
$ git gc --aggressive --prune=all
```

**Checkout/Create Orphan Branch** - Create a new orphan branch in your git repository.
This branch will not show in `git branch` command.

```text
$ git checkout --orphan latest_branch
```

**Add All The Files to Branch** – Add all existing files to your newly created branch.

```text
$ git add -A
```

**Commit The Changes** – After adding all files to your new branch, commit the changes

```text
$ git commit -am "Truncate history"
```

**Delete Main (Default) Branch** – Now you can delete the main (default) branch from your git repository.
This step is permanent.

```text
$ git branch -D main
```

**Rename The Current Branch** – After deleting the old main (default) branch, rename the newly created branch to main.

```text
$ git branch -m main
```

**Push Changes** – All these changes are completed on your local repository,
and now it's time to force push these changes to your remote repository.

```text
$ git push -f origin main
```

## Reference

- [How to remove all git commit history?](https://clearinsights.io/blog/how-to-remove-all-git-commit-history/)
