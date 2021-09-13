---
title:  "Commit"
sequence: "102"
---

## 命令格式

```text
git commit --message "This is a commit message"
```

The `--message` flag for `git commit` can be abbreviated to `-m` (all abbreviations use a single `-`).
If this flag is omitted, Git opens a text editor
(specified by the `EDITOR` or `GIT_EDITOR` environment variable) to prompt you for the commit message.

`git commit` can be called with `--author` and `--date` flags to override the auto-set metadata in the new commit.



### What is a SHA-1 Hash?

A SHA-1 hash is a secure hash digest function that is used extensively in Git.
It outputs a 160-bit (20-byte) hash value, which is usually displayed as a 40-character hexadecimal string.
The hash is used to uniquely identify commits by Git by their contents and metadata.
They're used instead of incremental revision numbers (like in Subversion) due to the distributed nature of Git.
When you commit locally, Git can't know whether your commit occurred before or after another commit on another machine,
so it can't use ordered revision numbers.
The full 40 characters are rather unwieldy,
so Git often shows shortened SHA-1s (as long as they're unique in the repository).
Anywhere that Git accepts a SHA-1 unique commit reference,
it will also accept the shortened version (as long as the shortened version is still unique within the repository).

## Commit的组成部分

Creating a **commit** stores the changes to one or more files.

Each commit contains 
- a message entered by the author,
- details of the commit author,
- a unique commit reference (in Git, **SHA-1 hashes** such as `86bb0d659a39c98808439fadb8dbd594bec0004d`)
- a pointer to the preceding commit (known as the **parent commit**),
- the date the commit was created, and
- a pointer to the contents of files when the commit was made.

The file contents are typically displayed as the **diff**
(the differences between the files before and the files after the commit).

{:refdef: style="text-align: center;"}
![](/assets/images/git/commit-parts.png)
{: refdef}

## 撤销commit

撤销commit：

```text
git reset --soft HEAD^
```

注意，仅仅是撤回commit操作，修改的代码仍然保留。
