---
title: "git remote"
---

[UP](/git/git-index.html)


There are now two repositories: **a local repository** and **a remote repository**.

![Git add/commit/push/pull/checkout cycle](/assets/images/git/git-local-remote-workflow-cycle.png)


## Adding a remote repository: git remote add

If your local repository needs to send data to or receive data from a repository on another machine,
it will need to add **a remote repository**.
**A remote repository** is one that's typically stored on another computer.
`git push` sends your new commits to it, and `git fetch` retrieves from it any new commits made by others.

You wish to add the new GitInPractice remote repository to your current repository:

- Change directory to the Git repository
- `Run git remote add origin` with your repository URL appended. So if your username is `GitInPractice` and your repository is named `GitInPracticeRedux`

```text
git remote add origin https://github.com/GitInPractice/GitInPracticeRedux.git.
```

You can verify that this remote has been created successfully by running `git remote --verbose`.

```text
$ git remote --verbose
origin  https://github.com/lsieun/tutorials (fetch)      注意，这里是 fetch URL
origin  https://github.com/lsieun/tutorials (push)       注意，这里是 push URL
```

## remove

```text
git remote remove gitee
```

`git remote` can also be called with the `rename` and `remove` (or `rm`) subcommands to alter remotes accordingly.
`git remote show` queries and shows verbose information about the given remote.
`git remote prune` deletes any remote references to branches that have been deleted from the remote repository by other users.
