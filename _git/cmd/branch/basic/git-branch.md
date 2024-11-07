---
title: "git branch"
---

[UP](/git/git-index.html)


To create a new branch and switch to it:

```text
git checkout -b <new-branch-name>
```

To create a branch from a remote branch (the default `<remote-repo>` is `origin`):

```text
git checkout -b <local-branch-name> <remote-repo>/<remote-branch-name>
```

Using `-u` (short for `--set-upstream`) will set up the tracking information during the push.

```text
git push -u <remote-repo> <remote-branch-name>
```

```text
git push --set-upstream origin new-branch
```

## Intro

### pointer

**Branching** allows two independent tracks through history to be created and committed to without either modifying the other.
You can happily commit to an independent branch without the fear of disrupting the work of another branch.

**In Git, a branch is no more than a pointer to a particular commit**. -- 我觉得，这句话谈到了 branch 的本质，就是指向 commit 的指针。

```bash
$ cat .git/refs/heads/master
71780248776f0df1ecc417011c4ace33aada608a
```

The **branch** is pointed to a new commit when a new commit is made on that branch.
A **tag** is similar to a **branch**, but it points to a single commit and remains pointing to the same commit even when new commits are made.
Typically, tags are used for annotating commits;
for example, when you release version 1.0 of your software, you may tag the commit used to build the 1.0 release with a `1.0` tag.
This means you can come back to it in the future, rebuild that release,
or check how certain things worked without fear that it will be somehow changed automatically.

### Branch Name

**CAN BRANCHES BE NAMED ANYTHING?**

A branch can't have **spaces** or **two consecutive dots** (`..`) anywhere in its name,
so `dev..branch` is an invalid branch name and `git branch` will refuse to create it.
The dots case is due to the special meaning of `..` for a commit range for the `git diff` command.

**WHAT NAMES SHOULD YOU USE FOR BRANCHES?**

Name branches according to their contents.

I recommend a format of describing the branch's purpose in **multiple words separated by hyphens**.
For example, a branch that is performing cleanup on the test suite should be named something like `test-suite-cleanup`.

## Local Repo

### New

从 current branch 创建 a new local branch：

```bash
$ git branch <new-branch-name>
```

It creates a new branch but doesn't change to it.


`git branch` can take **a second argument** with the start point for the branch.

```bash
$ git branch <new-branch-name> [<start-point>]
```

This can be used to create branches from **previous commits**.

下面的几种写法达到的效果是一致的：

```bash
$ git branch new-branch
$ git branch new-branch master
$ git branch new-branch HEAD
```

Create an orphan branch (i.e. branch with no parent commit):

```bash
$ git checkout --orphan new-orphan-branch
```

The first commit made on this new branch will have no parents and
it will be the root of a new history totally disconnected from all the other branches and commits.

### Check Out

Once you've **created a local branch**,
you'll want to check out **the contents of another branch** into **Git's working directory**.
The state of all the current files in the working directory
will be replaced with the new state based on the revision to which the new branch currently points.

To switch to an existing branch:

```bash
$ git checkout <branch-name>
```

![](/assets/images/git/branch-pointers.png)

You wish to change to a local branch named `chapter-two` from the current (`master`) branch:

```bash
$ git checkout chapter-two
```

`git checkout` is requesting the checkout of **a particular branch**
so the current state of that branch is checked out into **the working directory**.

![](/assets/images/git/head-pointer-with-multiple-branches.png)

**Make sure you've committed any changes on the current branch before checking out a new branch**.
If you don't do this, `git checkout` will refuse to check out the new branch
if there are changes in that branch to a file with uncommitted changes.
If you wish to overwrite these uncommitted changes anyway, you can force this with `git checkout --force`.
Another solution is `git stash`, which allows temporary storage of changes.

We can quickly switch to the previous branch using:

```bash
$ git checkout -
```

Sometimes you may need to move several of your recent commits to a new branch.
This can be achieved by branching and "rolling back", like so:

```bash
git branch <new_name>
git reset --hard HEAD~2 # Go back 2 commits, you will lose uncommitted work.
git checkout <new_name>
```

Here is an illustrative explanation of this technique:

```text
 Initial state       After `git branch <new-name>`    After `git reset --hard HEAD~2`
 
                             newBranch                        newBranch
                                 ↓                                ↓
A-B-C-D-E (HEAD)         A-B-C-D-E (HEAD)                 A-B-C-D-E (HEAD)
        ↑                        ↑                            ↑
      master                   master                       master
```

### New And Check Out

To create a new branch and switch to it:

```bash
$ git checkout -b <new-branch-name>
```

To check out a branch at a point other than the last commit of the current branch (also known as `HEAD`):

```bash
$ git checkout -b <new-branch-name> [<start-point>]
```

几个示例：

```bash
$ git checkout -b new-branch some_other_branch  # branch
$ git checkout -b new-branch af295              # commit
$ git checkout -b new-branch HEAD~5             # ref
$ git checkout -b new-branch v1.0.5             # tag
```

### List

Git provides multiple commands for listing branches.
All commands use the function of `git branch`, which will provide a list of a certain branches,
depending on which options are put on the command line.

| Command                            | Goal                            |
|------------------------------------|---------------------------------|
| `git branch`                       | List local branches             |
| `git branch -v`                    | List local branches verbose     |
| `git branch --merged`              | List merged branches            |
| `git branch --no-merged`           | List unmerged branches          |
| `git branch --contains [<commit>]` | List branches containing commit |

Git will if possible, indicate the currently selected branch with a star next to it.

```text
$ git branch
* master        注意，“*”表示当前 branch
  newBranch
```

Note:

- Adding an additional `v` to `-v` e.g. `git branch -avv` or `git branch -vv` will print the name of the upstream branch as well.
- Branches shown in **red color** are **remote branches**.

### Delete

To delete a branch locally. Note that this will not delete the branch if it has any **unmerged changes**:

```bash
$ git branch -d <branch-name>
```

To delete a branch, even if it has **unmerged changes**:

```bash
$ git branch -D <branch-name>
```

**WHY DELETE THE REMOTE BRANCH BEFORE THE LOCAL BRANCH?**

You had merged all the `new-branch` changes into the `master` branch and pushed this to `origin/master`.
As a result, the `new-branch` and `origin/new-branch` branches are no longer needed.

But Git will refuse to delete a local branch with `git branch --delete` if

- it hasn't been merged into the current branch (`master`) or
- its changes haven't been pushed to its tracking branch (`origin/new-branch`).

**WHY DELETE THE BRANCHES?**

**Sometimes branches** in version control systems **are kept for a long time**, and **sometimes they're temporary**.
**A long-running branch** may be one that represents the version deployed to a particular server.
**A short-running branch** may be a single bug fix or feature that has been completed.
In Git, once a branch has been merged, the history of the branch is still visible in the history,
and the branch can be safely deleted, because a merged branch is, at that point,
just a ref to an existing commit in the history of the branch it was merged into.

### Rename

将 current branch 进行改名:

```bash
$ git branch -m <new-branch-name>
```

为 another branch 进行改名:

```bash
$ git branch -m <another-branch-name> <new-branch-name>
```

### Search

To list local branches that contain a specific commit or tag

```bash
$ git branch --contains <commit>
```

To list local and remote branches that contain a specific commit or tag:

```bash
$ git branch -a --contains <commit>
```

## Remote Repo

### List

| Command          | Goal                                    |
|------------------|-----------------------------------------|
| `git branch -r`  | List remote branches                    |
| `git branch -rv` | List remote branches with latest commit |

### Delete

Delete a remote branch:

```bash
git push --delete <remote-repo> <remote-branch-name>
```

You wish to delete the branch named `new-branch` on the remote `origin`.

```bash
$ git push --delete origin new-branch
```

To delete a local remote-tracking branch:

```bash
$ git branch --delete --remotes <remote-repo>/<branch-name>
$ git branch -dr <remote-repo>/<branch-name> # Shorter
```

```bash
$ git fetch <remote> --prune # Delete multiple obsolete tracking branches
$ git fetch <remote> -p      # Shorter
```

## Local-Remote Repo

### New

To create a branch from a remote branch (the default `<remote-repo>` is `origin`):

```bash
$ git branch <local-branch-name> <remote-repo>/<remote-branch-name>
```

### New And Check Out

```bash
$ git checkout -b <local-branch-name> <remote-repo>/<remote-branch-name>
```

If a given branch name is only found on one remote, you can simply use

```bash
$ git checkout -b <same-branch-name>
```

which is equivalent to

```bash
$ git checkout -b <same-branch-name> <remote-repo>/<same-branch-name>
```

### List

| Command                               | Goal                                     |
|---------------------------------------|------------------------------------------|
| `git branch -a` Or `git branch --all` | List remote and local branches           |
| `git branch -av`                      | List remote and local branches (verbose) |

### track

`git branch` can take a `--track` flag, which, combined with a start point,
sets the upstream for the branch (similar to `git push --set-upstream` but without pushing anything remotely yet).

To set upstream to track the remote branch - type:

- `git branch --set-upstream-to=<remote>/<branch> <branch>`
- `git branch -u <remote>/<branch> <branch>`

To verify which remote branches your local branches are tracking:

```bash
$ git branch -vv
```

There are three ways of creating a new branch feature which tracks the remote branch `origin/feature`:

- `git checkout --track -b feature origin/feature`
- `git checkout -t origin/feature`
- `git checkout feature` - assuming that there is no local `feature` branch and there is only one remote with the `feature` branch.

### Push local branch to remote

Push commits made on your local branch to a remote repository:

```bash
$ git push <remote-repo> <remote-branch-name>
```

As an example, you usually run `git push origin master` to push your local changes to your `origin` repository.

Using `-u` (short for `--set-upstream`) will set up the tracking information during the push.

```bash
$ git push -u <remote-repo> <remote-branch-name>
```

```bash
$ git push --set-upstream origin new-branch
```

You've pushed your local `new-branch` branch and created a new remote branch named `new-branch` on **the remote repository**.

Remember that now the local `new-branch` branch is tracking the remote `new-branch` branch,
so any future `git pull` or `git push` on the `new-branch` branch will use the `origin` remote's `new-branch` branch.

By default, git pushes the local branch to a remote branch with the same name.
If you want to use a different name for the remote branch,
append the remote name after the local branch name, separated by `:`:

```bash
$ git push <remote-repo> <local-branch-name>:<remote-branch-name>
```
