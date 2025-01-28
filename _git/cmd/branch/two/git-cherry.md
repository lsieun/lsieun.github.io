---
title: "git cherry"
---

[UP](/git/git-index.html)


If you have a workflow in which you don't merge your commits to other branches but rather have another person do it,
you may wish to see which of your commits has been merged to another branch.
Git has a tool to do this: `git cherry`.

You wish to see what commits remain unmerged to the `master` branch from the `v0.1-release` branch.

- Change to the directory containing your repository
- Run `git checkout v0.1-release`
- Run `git cherry --verbose master`

```text
$ git cherry --verbose master
- dfe2377f00bb58b0f4ba5200b8f4299d0bfeeb5d Advanced practice technique.
+ a8200e1407d49e37baad47da04c0981f43d7c7ff Add release preface.
```

is prefixed with `-` and shows a commit that has been already included into the `master` branch.
is prefixed with `+` and shows a commit that hasn't yet been included into the `master` branch.

If you omit the `--verbose` (or `-v`) flag from `git cherry`,
it shows just the `-/+` and the full SHA-1 but not the commit subject: for example,
`- dfe2377f00bb58b0f4ba5200b8f4299d0bfeeb5d`.

When you learn about rebasing later, you'll see how `git cherry` can be useful for
showing **what commits will be kept or dropped** after a rebase operation.
