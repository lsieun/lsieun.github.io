---
title: "git fetch"
---

[UP](/git/git-index.html)


## Fetching changes from a remote without modifying local branches: git fetch

Remember that `git pull` performs two actions:
**fetching the changes from a remote repository** and **merging them into the current branch**.
Sometimes you may wish to download the new commits from the remote repository
without merging them into your current branch (or without merging them yet).
To do this, you can use the `git fetch` command.
`git fetch` performs the fetching action of downloading the new commits
but skips the merge step (which you can manually perform later).

If your `master` branch is tracking the `master` branch on the remote `origin`,
then `git pull` is directly equivalent to running `git fetch && git merge origin/master`.
