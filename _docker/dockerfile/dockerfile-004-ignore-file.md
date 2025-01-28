---
title: ".dockerignore file"
sequence: "104"
---

## 作用

Before the docker CLI sends the context to the docker daemon,
it looks for a file named `.dockerignore` in the root directory of the context.
If this file exists, the CLI modifies the context to exclude files and directories that match patterns in it.
This helps to **avoid unnecessarily sending large or sensitive files and directories** to the daemon and
potentially adding them to images using `ADD` or `COPY`.

## 分割和匹配

The CLI interprets the `.dockerignore` file as **a newline-separated list of patterns**
similar to the file globs of Unix shells.
For the purposes of matching, the root of the context is considered to be **both the working and the root directory.**
For example, the patterns `/foo/bar` and `foo/bar` both exclude a file or directory
named `bar` in the `foo` subdirectory of `PATH` or in the root of the git repository located at URL.
Neither excludes anything else.

## Comment

If a line in `.dockerignore` file starts with `#` in column `1`,
then this line is considered as a comment and is ignored before interpreted by the CLI.

Here is an example `.dockerignore` file:

```text
# comment
*/temp*
*/*/temp*
temp?
```

This file causes the following build behavior:

- `# comment`: Ignored.
- `*/temp*`: Exclude files and directories whose names start with `temp` in any immediate subdirectory of the root.
  For example, the plain file `/somedir/temporary.txt` is excluded, as is the directory `/somedir/temp`.
- `*/*/temp*`: Exclude files and directories starting with `temp` from any subdirectory
  that is two levels below the **root**. For example, `/somedir/subdir/temporary.txt` is excluded.
- `temp?`: Exclude files and directories in the root directory whose names are a one-character extension of `temp`.
  For example, `/tempa` and `/tempb` are excluded.

## filepath.Match

Matching is done using Go's `filepath.Match` rules.

## filepath.Clean

A preprocessing step removes leading and trailing whitespace and eliminates `.` and `..` elements
using Go's `filepath.Clean`.
Lines that are blank after preprocessing are ignored.

## **special wildcard**

Beyond Go's `filepath.Match` rules, Docker also supports a special wildcard string `**`
that matches any number of directories (including zero).
For example, `**/*.go` will exclude all files that end with `.go` that are found in all directories,
including the root of the build context.

## exclamation mark

Lines starting with `!` (exclamation mark) can be used to make exceptions to exclusions.
The following is an example `.dockerignore` file that uses this mechanism:

```text
*.md
!README.md
```

All markdown files except `README.md` are excluded from the context.

The placement of `!` exception rules influences the behavior:
the last line of the `.dockerignore` that matches a particular file determines whether it is included or excluded.
Consider the following example:

```text
*.md
!README*.md
README-secret.md
```

No markdown files are included in the context except README files other than `README-secret.md`.

Now consider this example:

```text
*.md
README-secret.md
!README*.md
```

All the `README` files are included.
The middle line has no effect because `!README*.md` matches `README-secret.md` and comes last.

## Dockerfile + dockerignore

You can even use the `.dockerignore` file to exclude the `Dockerfile` and `.dockerignore` files.
These files are still sent to the daemon because it needs them to do its job.
But the `ADD` and `COPY` instructions do not copy them to the image.

