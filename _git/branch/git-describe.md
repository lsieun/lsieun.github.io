---
title: "git describe"
sequence: "101"
---

[UP](/git/git-index.html)


You want to generate a version number for a software project based on existing tags in the repository.

- Change to the directory containing your repository
- Run `git describe --tags`

```text
$ git describe --tags
v0.1-1-g72901a1

$ git log --oneline
72901a1 (HEAD -> master) add hello asm
e013d30 (tag: v0.1) remove tmporary file
b234ab0 add tmporary file.
030e462 (newBranch) second commit
00b5ca6 (secondBranch) This is a commit message
```

It's hyphenated into three parts:
- `v0.1` is the most recent tag on the current branch.
- `1` indicates that one commit has been made since the most recent tag (v0.1) on the current branch.
- `g72901a1` is the current commit SHA-1 prepended with a `g` (which stands for `git`).

If you'd run `git describe --tags` when on the previous commit (the `v0.1` tag),
it would've output `v0.1`.

If `git describe` is passed a **ref**, it generates the version number for that particular commit.
For example, `git describe --tags v0.1` outputs `v0.1`, and `git describe --tags 0a5e328` outputs `v0.1-1-g0a5e328`.

If you wish to generate the long-form versions for tagged commits,
you can pass the `--long` flag.
For example, `git describe --tags --long v0.1` outputs `v0.1-0-g725c33a`.

If you wish to use a longer or shorter SHA-1 ref,
you can configure this using the `--abbrev` flag.
For example, `git describe --tags --abbrev=5` outputs `v0.1-1-g0a5e3`.
Note that if you use very low values (such as `--abbrev=1`),
`git describe` may use more than you've requested if it requires more to uniquely identify a commit.
