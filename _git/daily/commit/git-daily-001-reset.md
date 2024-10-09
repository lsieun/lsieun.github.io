---
title: "让 branch 指向某次 Commit"
sequence: "101"
---

[UP](/git/git-index.html)


## 撤销某次 Commit 提交

将当前 branch 指向某个 commit：

```text
git reset [<mode>] [<commit>]
```

```text
git reset --soft HEAD^
```

- `--hard` resets **the index staging area** and **working tree**  (discards all the changes)
- `--mixed` resets **the staging area** but **not the working tree**
  (leaves the changes but removes them from the staging area),
- `--soft` resets neither **the staging area** nor **the working tree**
  but just changes the `HEAD` pointer to point to the previous commit.

This means if you run `git commit` (with no other arguments) after a `git reset --soft HEAD^`,
the contents of **the index staging area** (and therefore the commit) will be the same as the commit that was just reset.

| git reset option | HEAD | branch | index staging area | working tree |
|------------------|------|--------|--------------------|--------------|
| --hard           | YES  | NO     | YES                | YES          |
| --mixed          | YES  | NO     | YES                | NO           |
| --soft           | YES  | NO     | NO                 | NO           |
