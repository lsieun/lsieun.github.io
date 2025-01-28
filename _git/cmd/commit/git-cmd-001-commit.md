---
title: "Commit"
sequence: "101"
---

[UP](/git/git-index.html)


## 命令格式

```text
git commit --message "This is a commit message"
```

The `--message` flag for `git commit` can be abbreviated to `-m` (all abbreviations use a single `-`). If this flag is
omitted, Git opens a text editor
(specified by the `EDITOR` or `GIT_EDITOR` environment variable) to prompt you for the commit message.

`git commit` can be called with `--author` and `--date` flags to override the auto-set metadata in the new commit.

## Commit 的组成部分

## 撤销 commit

撤销 commit：

```text
git reset --soft HEAD^
```

注意，仅仅是撤回 commit 操作，修改的代码仍然保留。

Type can be

- `feat`     (new feature)
- `fix`      (bug fix)
- `refactor` (refactoring production code)
- `style`    (formatting, missing semicolons, etc.; no code change)
- `docs`     (changes to documentation)
- `test`     (adding or refactoring tests; no production code change)
- `chore`    (updating grunt tasks etc.; no production code change)

Remember to

- Capitalize the subject line
- Use the imperative mood in the subject line
- Do not end the subject line with a period
- Separate subject from body with a blank line
- Use the body to explain what and why vs. how
- Can use multiple lines with "-" for bullet points in body
- Limit the subject line to 50 characters
- Wrap the body at 72 characters
