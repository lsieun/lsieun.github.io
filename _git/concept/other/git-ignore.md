---
title: ".gitignore"
---

[UP](/git/git-index.html)

## 查看帮助

```text
git help gitignore
```

- Each line of a `.gitignore` file matches files with a pattern.
- `#`：add comments by starting a line with a `#` character
- `!`：negate patterns by starting a line with a `!` character.



## 常用操作

### 添加 .gitignore

```text
git add .gitignore
```

You wish to ignore all files with the extension `.tmp` in a Git repository.

```text
*.tmp
```

忽略所有以 `.` 开头的文件，但是 `.gitignore` 例外：

```text
.*
!.gitignore
target/
```

### 删除被忽略的文件

For example, you may have a project in a Git repository
that compiles input files (such as `.c` files) into output files (in this example, `.o` files)
and wish to remove all these output files from the working directory to perform a new build from scratch.

You wish to delete all ignored files from a Git working directory:

```text
git clean --force -X
```

The `-X` argument specifies that `git clean` should remove only **ignored files** from the working directory.
If you wish to remove **ignored files** and all the **untracked files** (as `git clean --force` would do),
you can instead use `git clean -x` (note that the `-x` is lowercase rather than uppercase).

The specified arguments can be combined with the others.
For example, `git clean -xdf` removes all untracked or ignored files (`-x`) and directories (`-d`) from a working directory.
This removes all files and directories for a Git repository that weren't previously committed.
Take care when running this; there will be no prompt, and all the files will be quickly deleted.

Often `git clean -xdf` is run after `git reset --hard`;
this means you'll have to reset all files to their last-committed state and remove all uncommitted files.
This gets you a clean working directory: no added files or changes to any of those files.

此处，我想到文件的三种状态：

- tracked file: `git reset --hard`
- untracked file
- ignored file

## 参考

GitHub also provides a useful collection of gitignore files at [https://github.com/github/gitignore](https://github.com/github/gitignore).
