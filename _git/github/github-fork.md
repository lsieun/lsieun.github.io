---
title: "Github status"
sequence: "301"
---

[UP](/git/git-index.html)


## Working with forks

### Remove a commit on GitHub?

First, remove the commit on your local repository. You can do this using `git rebase -i`.
For example, if it's your last commit, you can do `git rebase -i HEAD~2` and delete the second line within the editor window that pops up.

Then, force push to GitHub by using `git push origin +branchName --force`

---

If nobody has pulled or cloned your fork, you can rewrite history forcefully. Do `git rebase -i HEAD~2` and **delete the offending commit**, then `git push --force`. This will break any other repo based on your fork, so do not do this if you suspect anyone else is using your repo.

### Syncing a fork

Sync a fork of a repository to keep it up-to-date with the upstream repository.

Syncing a fork from the command line

```text
git fetch upstream
```

## References

- [Syncing a fork](https://docs.github.com/en/github/collaborating-with-pull-requests/working-with-forks/syncing-a-fork)
- [Creating a pull request from a fork](https://docs.github.com/en/github/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-a-pull-request-from-a-fork)
