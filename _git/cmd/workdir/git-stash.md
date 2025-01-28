---
title: "git stash"
---

[UP](/git/git-index.html)


## Temporarily stashing some changes: git stash

You wish to stash all your uncommitted changes for later retrieval:

```text
git stash save
```

`git stash save` creates **a temporary commit** with a prepopulated commit message and
then returns your current branch to the state before the temporary commit was made.
It's possible to access this commit directly, but you should only do so through `git stash` to avoid confusion.

## stash list

You can see all the stashes that have been made by running `git stash list`.

```text
$ git stash list
stash@{0}: WIP on master: e013d30 remove tmporary file
```

This shows the single stash that you made.
You can access it using `ref stash@{0}`;
for example, `git diff stash@{0}` will show you the difference between the working directory and the contents of that stash.

```text
$ git diff stash@{0}
```

If you save another stash, it will become `stash@{0}` and the previous stash will become `stash@{1}`.
This is because the stashes are stored on a stack structure.
A stack structure is best thought of as being like a stack of plates.
You add new plates on the top of the existing plates; and if you remove a single plate, you take it from the top.
Similarly, when you run `git stash`, the new stash is added to the top (it becomes `stash@{0}`)
and the previous stash is no longer at the top (it becomes `stash@{1}`).

DO YOU NEED TO USE GIT ADD BEFORE GIT STASH?
No, `git add` is not needed.
`git stash` stashes your changes regardless of whether they've been added to **the index staging area** by `git add`.

DOES GIT STASH WORK WITHOUT THE SAVE ARGUMENT?
If `git stash` is run with no `save` argument, it performs the same operation; the `save` argument isn't needed.
I've used it in the examples because it's more explicit and easier to remember. 

## Reapplying stashed changes: git stash pop

You wish to pop the changes from the last `git stash save` into the current working directory:

```text
git stash pop
```

When running `git stash pop`, the top stash on the stack (`stash@{0}`) is applied to the working directory and removed from the stack.
If there's a second stash in the stack (`stash@{1}`), it's now at the top (it becomes `stash@{0}`).
This means if you run `git stash pop` multiple times,
it will keep working down the stack until no more stashes are found, at which point it will output `No stash found`.

## Clearing stashed changes: git stash clear

You may have stashed changes with the intent of popping them later,
but then realize that you no longer wish to do so — the changes in the stack are now unnecessary,
so you want to get rid of them all.
You could do this by popping each change off the stack and then deleting it,
but it would be handy to have a command that allows you to do this in a single step.
Thankfully, `git stash clear` does just this.

You wish to clear all previously stashed changes:

```text
git stash clear
```

Clearing the stash is done without a prompt and removes every previous item from the stash, so be careful when doing so.
Cleared stashes can't be easily recovered.
For this reason, once you learn about history rewriting,
I'd recommend making commits and rewriting them later rather than relying too much on `git stash`.
