---
title: "git reset"
---

[UP](/git/git-index.html)


There are times when you've made changes to files in the working directory
but you don't want to commit these changes.

You wish to reset the state of all the files in your working directory to their last committed state.

```text
git reset --hard
```

The `--hard` argument signals to `git reset` that
you want it to reset both the **index staging area** and **the working directory** to
the state of the previous commit on this branch.
If run without an argument, it defaults to `git reset --mixed`,
which resets **the index staging area** but **not the contents of the working directory**.
In short, `git reset --mixed` only undoes `git add`, but `git reset --hard` undoes `git add` and all file modifications.

DANGERS OF USING GIT RESET --HARD
Take care when you use `git reset --hard`;
it will immediately and without prompting remove all uncommitted changes to any file in your working directory.
This is probably the command that has caused me more regret than any other;
I've typed it accidentally and removed work I hadn't intended to.
Remember that it's very hard to lose work with Git?
If you have uncommitted work, this is one of the easiest ways to lose it!
A safer option may be to use Git's `stash` functionality instead.

## Resetting a branch to a previous commit

When you used `git reset` previously, you used it either with no arguments (which implies `--mixed`) or with `--hard`.
Remember, `--hard` resets **the index** and **the working directory**, and `--mixed` resets **the index** but **not the working directory**.
In short, `--hard` discards any uncommitted work, whereas `--mixed` unstages it (effectively reversing a `git add`).

`git reset` can also take **a ref** as an argument.
Rather than just resetting to **the last commit**,
this allows you to reset **a branch** to **any other commit** in the repository.

Let's create a temporary commit (that hasn't been pushed) that you can reset.

In this case, let's try resetting to the previous commit on the same branch; this is an alternative to using `git revert`.

You wish to undo the last commit on the `master` branch:

- Change to the directory containing your repository
- Run `git checkout master`
- Run `git reset HEAD^`

You have reset the `master` branch pointer to point to **a previous commit**.

`git reflog` is useful in avoiding the loss of commits.
Let's imagine that you reset the previous commit but later realize this was a mistake.
Let's run `git reflog` and see if you can get anything useful from the output.

`reflog` has kept the record that this `reset` was made and the SHA-1s at each stage in this process.

Let's use the SHA-1 output from the reflog (and the previous `git commit` command) to restore this commit again:

- Change to the directory containing your repository
- Run `git checkout master`
- Run `git reset 4455fa9`

WHEN ARE COMMITS REMOVED FROM THE REFLOG?
Commits in the reflog that are older than 90 days and not ancestors of any other,
newer commit in the reflog are removed by the `git gc` command.
`git gc` can be run manually, but it never needs to be
because it's run periodically by commands such as `git fetch`.
In short, when you've removed a commit from all branches,
you have 90 days to recover the data before Git will destroy it.
In my experience, this is more than enough time;
typically if I haven't remembered that I accidentally removed a commit within a few days, I never will.



`git reset` can also take **a list of paths** as the last arguments to the command.
These can be separated using `--` between **the ref** and **the list of paths**.
The `--` is optional but makes more explicit the separation between **the ref** and **paths**.
After all, it's possible (if unlikely) that you could have a file and path with the same name.
For example, to reset **the contents** of the `00-Preface.asciidoc` file to the previous commit,
you'd run `git reset HEAD^ -- 00-Preface.asciidoc`.

In addition to `--hard` and `--mixed`, `git reset` can also take a `--soft` argument.
The `--soft` argument can be compared to `--mixed` and `--hard`, as shown earlier.
Whereas `--hard` resets **the index staging area** and **working tree**  (discards all the changes)
and `--mixed` resets **the staging area** but **not the working tree**
(leaves the changes but removes them from the staging area),
`--soft` resets neither **the staging area** nor **the working tree**
but just changes the `HEAD` pointer to point to the previous commit.
This means if you run `git commit` (with no other arguments) after a `git reset --soft HEAD^`,
the contents of **the index staging area** (and therefore the commit) will be the same as the commit that was just reset.

| git reset option | HEAD | branch | index staging area | working tree |
|------------------|------|--------|--------------------|--------------|
| --hard           | YES  | NO     | YES                | YES          |
| --mixed          | YES  | NO     | YES                | NO           |
| --soft           | YES  | NO     | NO                 | NO           |

You can also perform **a combined reset and commit operation** to modify the previous commit using `git commit --amend`.
`git commit --amend` resets to the previous commit and
then creates a new commit with the same commit message as the commit that was just reset.
It uses `git reset --soft HEAD^` and then runs `git commit --reedit-message` with the previous (now reset) commit as an argument.
This means it adds anything you have currently added to
the index staging area to the changes from the previous commit and prompts for a new commit message.
I most commonly use this to adjust the previous commit message if I realize I've made a typo or omitted useful information.

## Example

### Destroy Local Changes

By running the below command you can wipe out all changes on your local branch to exactly what is in the remote branch:

```text
git reset --hard origin/main
```
