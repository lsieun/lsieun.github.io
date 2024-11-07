---
title: "git rebase"
sequence: "104"
---

[UP](/git/git-index.html)


![](/assets/images/git/commit/git-rebase-illustrated.png)

![](/assets/images/git/commit/rebase/git-rebase-example-001.png)

![](/assets/images/git/commit/rebase/git-rebase-example-002.png)

![](/assets/images/git/commit/rebase/git-rebase-example-003.png)

![](/assets/images/git/commit/rebase/git-rebase-example-004.png)

![](/assets/images/git/commit/rebase/git-rebase-example-005.png)


A **rebase** is a method of rewriting history in Git that is similar to a **merge**.
A **rebase** involves changing the parent of a commit to point to another.

You wish to rebase the `inspiration` branch on top of the `v0.1-release` branch:

- Change to the directory containing your repository
- Run `git checkout inspiration`
- Run `git rebase v0.1-release`

The argument to `git rebase` can be **any ref**.
You could rebase on **an arbitrary commit**, but this is generally a bad idea.
You should usually rebase on top of either **an updated branch** or **a different branch/tag**.

If you made multiple commits to the wrong branch, you can't use `git rebase` as is to fix this.
But you can do so with `git rebase --interactive`.

If you wanted to undo this operation, you could run `git branch --force inspiration 88e8b4b`
to reset the `inspiration` branch pointer to point back to the existing commit, essentially undoing the rebase.

## merge conflict

Sometimes `git rebase` operations may fail in a way similar to a `git merge` or `git cherry-pick` operation.
There may be a **merge conflict** where changes have been made to the same parts of the same files
that have been modified in rebased commits.
The main difference when resolving a `git rebase` (or `git cherry-pick`) conflict is that,
because there's no merge commit, it has to be done for each commit at a time.

There are three suggested flags:

- `git rebase --continue` should be run after the normal merge conflict- resolution process of manually
  resolving the conflicts and marking them as fixed using git add.
  This continues the rebase operation by rebasing any further commits and, if successful, updating the rebased branch.
- `git rebase --skip` means that, rather than solving the merge conflicts in this particular commit,
  the commit is skipped and the next one is applied instead.
  This may make sense in certain situations where the functionality of this commit has already been made
  by another commit on the branch you're rebasing on top of, making this commit redundant.
- `git rebase --abort` gives up on the `git rebase` process altogether and returns the branch to its state before the rebase was attempted.

## Reference

- [How to Use Git Rebase – Tutorial for Beginners](https://www.freecodecamp.org/news/how-to-use-git-rebase/)
