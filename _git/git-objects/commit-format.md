---
title: "git objects: commit format"
---

[UP](/git/git-index.html)


要考虑 commit 的三种情况：

- 第一种，root commit，它没有 parent
- 第二种，普通的 commit，它有一个 parent
- 第三种，merge 的 commit，它有两个或多个 parent

Top level:

```text
commit {size}\0{content}
```

{content}:

```text
tree {tree_sha}
{parents}
author {author_name} <{author_email}> {author_date_seconds} {author_date_timezone}
committer {committer_name} <{committer_email}> {committer_date_seconds} {committer_date_timezone}

{commit message}
```
