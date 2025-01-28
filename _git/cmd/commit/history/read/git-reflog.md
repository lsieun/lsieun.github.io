---
title: "git reflog"
---

[UP](/git/git-index.html)


Each commit points to the previous (parent) commit
and that this is repeated all the way to the branch's initial commit.
As a result, **the branch pointer** can be used to reference
not just the current commit it points to, but also every previous commit.
If a previous commit changes in any way, then its SHA-1 hash changes too.
This in turn affects the SHA-1 of all its descendant commits.
This provides good protection in Git from accidentally rewriting history,
because all commits effectively provide a checksum of the entire branch up until this point.

Git's `reflog` (or **reference log**) is updated whenever a commit pointer is updated
(like a HEAD pointer or branch pointer).
This includes previous actions you've seen that don't involve rewriting history,
such as committing and changing branches.
Let's see the `reflog` contents for your previous actions on the repository.

You wish to view the state of the `reflog` for the `HEAD` pointer:

- Change to the directory containing your repository
- Run `git checkout master`
- Run `git reflog`

```text
$ git reflog
3e3c417 HEAD@{0}: checkout: moving from v0.1-release to master
a8200e1 HEAD@{1}: commit: Add release preface.
dfe2377 HEAD@{2}: checkout: moving from master to v0.1-release
3e3c417 HEAD@{3}: revert: Revert "Advanced practice technique."
```

`HEAD@{0}` is another type of **ref** and can be used with commands
such as `git log` and `git cherry-pick` to view the state based on that commit.
I always prefer to use the SHA-1, because SHA-1s for particular commits never change,
but `HEAD@{0}` for example will change with any action that affects the `HEAD` pointer.

Remember `git stash`? When you use the `git stash` commands, they don't appear in the `git reflog` output.
Again, for this reason, once you learn about **rewriting history**,
I'd recommend making commits and rewriting them later rather than relying too much on `git stash`.

Running `git reflog` is an alias for `git log --walk-reflogs --abbrev-commit --pretty=oneline`.
`git reflog` can also take all `git log` flags such as `--max-count` and `--patch`.
You can see the `git log` formatting flags with `git log --help`.

Like `git log`, `git reflog` can be passed **a ref** as the final argument.
If this isn't specified, it defaults to `HEAD`.
For example, you can view how the `master` branch has changed over time by using `git reflog master`.

ARE REFLOGS SHARED BETWEEN REPOSITORIES?
Reflogs are per repository.
They aren't shared with other repositories when you `git push` and aren't fetched when you `git fetch`.
As a result, they can only be used to see actions that were made in the Git repository on your local machine.
Bear this in mind when you're rewriting history:
you can easily view the previous state on your current machine, but not that from other machines. 
