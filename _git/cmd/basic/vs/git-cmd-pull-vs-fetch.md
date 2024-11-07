---
title: "pull vs fetch"
sequence: "102"
---

[UP](/git/git-index.html)


```text
git pull = git fetch + git merge
```

The "git pull" command is a combination of two other Git commands: "git fetch" and "git merge."
It fetches changes from the remote repository and automatically merges them into the current branch.

举例，假如 Remote Repository 里有一个 `index.html` 文件

- 如果执行 `git pull` 会将 `index.html` 拉取到 Local Repository 和 Working Directory
- 如果执行 `git fetch` 会将 `index.html` 拉取到 Local Repository，
  然后再执行 `git merge` 会将 Local Repository 中的 `index.html` 拉取到 Local Repository

![](/assets/images/git/workflow/git-workflow.png)

![](/assets/images/git/vs/git-fetch-vs-merge.gif)

![](/assets/images/git/vs/git-fetch-vs-merge-2.gif)


## Reference

- [Git Pull and Git Fetch: Understanding the Differences](https://www.linkedin.com/pulse/git-pull-fetch-understanding-differences-your-devops-guide/)
- [Difference between Git fetch and pull](https://www.theserverside.com/blog/Coffee-Talk-Java-News-Stories-and-Opinions/Git-pull-vs-fetch-Whats-the-difference)
