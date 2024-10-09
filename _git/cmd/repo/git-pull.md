---
title: "git pull"
---

[UP](/git/git-index.html)


## Pulling changes from another repository: git pull

`git pull` downloads the new commits from another repository and merges the remote branch into the current branch.
If you run `git pull` on the local repository, you just see a message stating Already `up-to-date`.

`git pull` actually does a `git fetch && git merge`

```text
git pull = git fetch + git merge
```

`git pull` can take a `--rebase` flag that performs a **rebase** rather than a **merge**.

## Pulling a branch and rebasing commits: git pull --rebase

Rebasing is often useful when you're pulling commits into your current branch.
You almost certainly don't want to create a merge commit
just because you've made commits on your current branch and want to fetch new commits from upstream.
A merge commit will be created, however, if you've committed on this branch and pull in new commits.
Instead of creating a merge conflict, you can use `git pull --rebase`.

You want to pull commits from `origin/master` and rebase your current commits in `master` on top of the upstream changes.

- Change to the directory containing your repository
- Run `git pull --rebase`

Recall that `git pull` is equivalent to running `git fetch && git merge`,
and `git pull --rebase` is equivalent to running `git fetch && git rebase`.

This is the same as if you had run `git rebase origin/master` after `git fetch`.

`git pull --rebase` is sometimes recommended as a sensible default to use instead of `git pull`.
You'll rarely want to create a merge commit on a `git pull` operation,
so using `git pull --rebase` guarantees that this won't happen.
This means when you do push this branch, it will have a simpler, cleaner history.
Once you understand how to rebase and solve conflicts, I recommend using `git pull --rebase` by default.
