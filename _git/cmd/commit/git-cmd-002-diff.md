---
title: "git diff"
sequence: "102"
---

[UP](/git/git-index.html)


## Viewing the differences between commits: git diff

`git diff` 是在 history 的基础上的一种功能。

A `diff` (also known as a **change** or **delta**) is the difference between two commits.
In Git you can request a **diff** between any two **commits**, **branches**, or **tags**.
It's often useful to be able to request the difference between two parts of the history for analysis.

The various ways of displaying diffs in version control typically allow you to narrow them down to the file, directory, and even committer.

You wish to view the differences between the previous commit and the latest:

- Change directory to the Git repository
- Run `git diff master~1 master` (you may need to press `Q` to exit afterward).

`git diff` can take path arguments after a `--` to request only the differences between particular paths.
For example, `git diff master~1 master -- GitInPractice.asciidoc` shows
only the differences to the `GitInPractice.asciidoc` file between the previous and latest commits.

```text
git diff master~1 master -- GitInPractice.asciidoc
```

These `git diff` invocations are all equivalent:

- `git diff master~1 master`
- `git diff master~1..master`
- `git diff master~1..`
- `git diff master^ master`
- `git diff master~1 HEAD`
- `git diff 6576b68 6b437c7`

`git diff` without an argument displays the differences between
**the current working directory** and **the index staging area**.
`git diff master` displays the differences between **the current working directory** and **the last commit** on the default `master` branch.

If `git diff` is run with no arguments, it shows the differences
between **the index staging area** and **the current state of the files** tracked by Git:
any changes you've made but not yet added with `git add`.

`git diff origin/master` shows the differences between **the current working tree state** and the `origin` remote's `master` branch.

## Diff formats

Diffs are shown by default in Git in a format known as **a unified format diff**.
Diffs are used often by Git to indicate changes to files, for example when navigating through history or viewing what you're about to commit.

Sometimes it's desirable to display diffs in different formats.
Two common alternatives to a typical unified format diff are a `diffstat` and `word diff`.

### diffstat

```text
$ git diff --stat master~1 master
 .../core-java-lang-operators-2/pom.xml             |   5 +
 .../GetABitFromIntegralValueUnitTest.java          | 119 +++++++++++++++++++++
 2 files changed, 124 insertions(+)
```

Rather than showing the breakdown of exactly what has changed,
it indicates **what files have changed** and **a brief overview of how many lines were involved in the changes**.
This can be useful when getting a quick overview of what has changed without needing all the detail of a normal unified format diff.

### Word diff format

```text
$ git diff --word-diff master~1 master
```

A word diff is similar to a unified format diff but shows modifications **per word** rather than **per line**.
This is particularly useful when viewing changes to **plain text** rather than **code**;
in README files, we probably care more about **individual word choices** than knowing that **an entire line has changed**,
and the special characters (`[-]{+}`) aren't used as often in prose as in code.

## 使用场景

| command                            | old                | new               |
|------------------------------------|--------------------|-------------------|
| `git diff`                         | index staging area | working directory |
| `git diff <commit_id> <commit_id>` | repository         | repository        |

If a file is staged, but was modified after it was staged,
`git diff` will show the differences between the current file(working directory) and the staged version(index staging area).

### index vs work dir

### repo vs index

Show differences for staged files:

```bash
$ git diff --staged
```

This will show the changes between **the previous commit** and **the currently staged files**.

You can also use the following commands to accomplish the same thing:

```bash
$ git diff --cached
```

Which is just a synonym for `--staged` or

```bash
$ git status -v
```

Which will trigger the verbose settings of the `status` command.

### repo vs work dir

To show all staged and unstaged changes, use:

```bash
$ git diff HEAD
```

You can also use the following command:

```bash
$ git status -vv
```

The difference being that the output of the latter will actually tell you
which changes are staged for commit and which are not.

### repo vs repo:两个 commit

```bash
$ git diff 1234abc..6789def    # old   new
```

Show the changes made in the last 3 commits:

```bash
$ git diff @~3..@    # HEAD -3   HEAD
```

Note: the two dots (`..`) is optional, but adds clarity.

Show differences between current version and last version

```bash
$ git diff HEAD^ HEAD
```

This will show the changes between the previous commit and the current commit.

### repo vs repo:两个 branch

Show the changes between the tip of `new` and the tip of `original`:

```bash
$ git diff original new     # equivalent to original..new
```

Show all changes on `new` since it branched from `original`:

```bash
$ git diff original...new     # equivalent to $(git merge-base original new)..new
```

Using only one parameter such as

```bash
$ git diff original
```

is equivalent to

```bash
git diff original..HEAD
```

### specific file or directory

Show differences for a specific file or directory:

```bash
$ git diff myfile.txt
```

This also works for directories:

```bash
$ git diff documentation
```

To show the difference between some version of a file in a given commit and the local `HEAD` version
you can specify the commit you want to compare against:

```bash
$ git diff 27fa75e myfile.txt
```

Or if you want to see the version between two separate commits:

```bash
git diff 27fa75e ada9b57 myfile.txt
```

To show the difference between the version specified by the hash `ada9b57` and the latest commit on the branch `my_branchname`
for only the relative directory called `my_changed_directory/` you can do this:

```bash
git diff ada9b57 my_branchname my_changed_directory/
```

## 其它

### 细粒度比较：word

Viewing a word-diff for long lines:

```bash
$ git diff [HEAD|--staged...] --word-diff
```

Rather than displaying lines changed, this will display di ﬀ erences within lines. For example, rather than:

```text
-Hello world
+Hello world!
```

Where the whole line is marked as changed, `word-diff` alters the output to:

```text
Hello [-world-]{+world!+}
```

You can omit the markers `[-`, `-]`, `{+`, `+}` by specifying `--word-diff=color` or `--color-words`.

### patch-compatible diff

Sometimes you just need a diff to apply using patch. The regular `git --diff` does not work. Try this instead:

```bash
$ git diff --no-prefix > some_file.patch
```

Then somewhere else you can reverse it:

```bash
$ patch -p0 < some_file.patch
```
