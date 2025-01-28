---
title: "git push"
---

[UP](/git/git-index.html)


## Pushing changes to a remote repository: git push

Only changes specifically requested are sent,
and Git (which can operate over HTTP, SSH, or its own protocol `[git://]`) ensures that
only the differences between the repositories are sent.
As a result, you can push **small changes** from **a large local repository** to **a large remote repository** very quickly
as long as they have most commits in common.

You wish to push the changes from the local `GitInPracticeRedux` repository to the `origin` remote on GitHub.

- Change directory to the Git repository
- Run `git push --set-upstream origin master`, and enter your GitHub username and password when requested.

By passing `--set-upstream` option to `git push`,
you tell Git that you want the local `master` branch you've just pushed to track the `origin` remote's branch `master`.
The `master` branch on the `origin` remote (which is often abbreviated `origin/master`) is now known as the **tracking branch** (or `upstream`) for your local `master` branch.

The `git push --set-upstream` (or `-u`) flag and explicit specification of `origin` and `master` are only required the first time
you push to create a remote branch (without them, some versions of Git may output fatal:
The current branch master has no upstream branch.).
After that, a `git push` with no arguments will default to running the equivalent of `git push origin master`.
This is set up by default by `git clone` when you clone a repository.

`git push` can take an `--all` flag, which pushes all branches and tags at once.
Be careful when doing this: you may push some branches with work in progress.

`git push` can take a `--force` flag, which disables some checks on the remote repository to allow rewriting of history. **This is very dangerous**.

A **tracking branch** is the default push or fetch location for a branch.
This means in future you can run `git push` with no arguments on this branch,
and it will do the same thing as running `git push origin master`:
push the current branch to the `origin` remote's `master` branch.

## Rewriting history on a remote branch: git push --force

If you modify history on a branch and then try to perform a `git push` operation, it will fail.
This is to stop you from accidentally writing remote history that other users are relying on.
It's possible to do this, but you need to be more explicit in your syntax to indicate that
you're aware you're performing a dangerous operation.

You wish to rewrite the history on the remote `origin/inspiration` branch
based on the contents of the local `inspiration` branch.

- Change to the directory containing your repository
- Run `git checkout inspiration`
- Run `git pull --rebase`
- Run `git push origin +inspiration` again

You can also use `git push --force` instead of specifying the remote branch name prefixed with `+`,
but this is not advised because it's less safe;
depending on your Git configuration, you could accidentally force-push multiple branches at once.
By default in some Git versions, a push will push all branches with matching local and remote branch names,
so these will all be force-pushed if `git push --force` is run without parameters.

Remember that the reflog isn't pushed remotely, so if you unintentionally rewrite history on the remote branch,
there's no way to recover commits you didn't have locally without direct access to the Git repository on the server.
For this reason, you should be careful when rewriting remote branches.
A good rule of thumb is to only ever do it on branches that nobody else is using.
Avoid doing it on shared branches, and never do it on the master branch.
Also, do a `git pull` immediately before any forced push to try to ensure that
you aren't rewriting commits on the remote branch that you don't have locally.
Of course, it's still possible for someone to push a commit just after you do a `git pull`,
which you overwrite (which is why `git push --force` is a dangerous operation).
