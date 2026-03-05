---
title: "HEAD 介绍"
sequence: "101"
---

[UP](/git/index.html)


HEAD answers the question: **Where am I right now in the repository?**
It is a pointer to the currently checked-out branch or commit,
which in turn contains an immutable snapshot of your entire code base at a given time.

```text
HEAD 可以指向 branch，也可以指向 commit
另外，branch 本身也是指向 commit
```

## HEAD 是什么

When working with Git, only one branch can be checked out at a time - and this is what's called the **"HEAD" branch**.
Often, this is also referred to as the "active" or "current" branch.

```text
笔记：HEAD 是表示当前分支
```

Git makes note of this current branch in a file located inside the Git repository, in `.git/HEAD`.
(This is an internal file, so it should not be manually manipulated!)

```text
笔记：HEAD 这个抽象概念，具体表现形式是一个 .git/HEAD 文件
```

```text
$ cat .git/HEAD
ref: refs/heads/master
```

```text
$ git branch
* dev
  main

$ cat .git/HEAD
ref: refs/heads/dev

$ git checkout main
Switched to branch 'main'
Your branch is up to date with 'origin/main'.

$ git branch
  dev
* main

$ cat .git/HEAD
ref: refs/heads/main
```

## HEAD ref

- HEAD caret: `HEAD^`
- HEAD tilde: `HEAD~`

![](/assets/images/git/head/git-head-relative-refs.jpg)

- `HEAD`: The current reference point in a git log.
- `HEAD~`: shorthand for `HEAD~1`. It means reference HEAD's first parent.
- `HEAD~2`: means reference HEAD's grandparent, or first parent's parent.
- `HEAD~3`: means reference HEAD's great-grandparent, or first parent's parent's parent. So you see the pattern … 👍?
- `HEAD^`: shorthand for `HEAD^1`. It means reference HEAD's first parent.
- `HEAD^2`: means reference HEAD's second parent. This scenario comes during merging of a branch.

Now we can combine `~` and `^` for scenarios
where a commit has more than one parent.
For example, `HEAD~2^2` gives us second grandparent of the `HEAD` reference commit.

Use case:

- `~` is used to go number of generation back and is generally linear in appearance.
- `^` is used on merge commits where a commit can have more than 1 parent.
  Hence, looks like forks in a road.

## @ 符号

在 Git `1.8.4` 版本之后，可以使用 `@` 符号代替 `HEAD`，这样书写起来会比较方便。

例如，下面两条批令是相同的效果：

```text
$ git show HEAD --oneline
$ git show @ --oneline
```

## Reference

- [What is HEAD in Git?](https://blog.git-init.com/what-is-head-in-git/)
- [How HEAD works in git](https://jvns.ca/blog/2024/03/08/how-head-works-in-git/)
