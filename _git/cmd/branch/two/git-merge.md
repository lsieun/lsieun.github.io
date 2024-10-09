---
title: "git merge"
---

[UP](/git/git-index.html)


## Merging branches and always creating a merge commit

a basic merge of two branches by using `git merge branchname`,
where `branchname` is the name of the branch you wish to merge into **the current branch**.

Recall that a **merge commit** is one that has multiple parents and
is displayed in GitX by the convergence of two or more branch **tracks**.
`git merge` provides various options for merging branches without creating merge commits,
using various strategies or resolving conflicts with a graphical merge tool.

WHY WOULD YOU WANT TO FORCE THE CREATION OF A MERGE COMMIT?
Although fast-forward merges can sometimes be useful in some Git workflows,
you should explicitly signify the merging of a branch even if it isn't necessary to do so.
This explicit indication of a merge through the creation of a merge commit can show all the metadata present in any other commit,
such as who performed the merge, when, and why.
In software projects, merging a new feature is usually done by merging a branch,
and it's useful for regression testing and history visualization for this feature merge to be more explicit.

Let's start by setting up how to perform a merge that could be made without creating a merge commit: a fast-forward merge.
Recall that a **fast-forward merge** means the incoming branch has the current branch as an ancestor.
This means commits have been made on the incoming branch,
but none have been made on the current branch since the incoming branch was branched from it.

You wish to merge the `chapter-spacing` branch into the `master` branch and create a merge commit — not perform a **fast-forward** merge.

- Change to the directory containing your repository
- Run `git checkout master`.
- Run `git merge --no-ff chapter-spacing`.

```text
$  git merge --no-ff chapter-spacing
Merge made by the 'recursive' strategy.
01-IntroducingGitInPractice.asciidoc | 1 +
1 file changed, 1 insertion(+)
```

You can now delete the merged `chapter-spacing` branch by running `git branch --delete chapter-spacing` from the `master` branch.

In this case, where the branch contained a single commit, this may not be terribly useful.
But on larger features, this explicit indication of branches can aid history visualization.

`git merge` can also take a `--ff-only` flag, which does the opposite of `no-ff`:
it ensures that a merge commit is never created.
If the merge can only be made with a merge commit (there are conflicts that need to be resolved and marked in a merge commit),
the merge isn't performed.

## Merge strategies

A **merge strategy** is an algorithm that Git uses to decide how to perform a merge.
The previous merge output stated that it was using the `recursive` merge strategy.

You can select a strategy by passing the `--strategy` (or `-s`) flag to `git merge`, followed by the name of the strategy.
For example, to select the default, `recursive` strategy, you could also call `git merge --strategy=recursive`.

Certain strategies (such as `recursive`) can also take options by passing the `--strategy-option` (or `-X`) flag.
For example, to set the patience diff option for the recursive strategy, you'd call `git merge --strategy-option=patience`.

The following are some useful merge strategies:

- `recursive`: Merges one branch into another and automatically detects renames.
  This strategy is the **default** if you try to merge a single branch into another.
- `octopus`: Merges multiple branches at once but fails on a merge conflict.
  This strategy is the default if you try to merge two or more branches into another
  by running a command like `git merge branch1 branch2 branch3`.
  You'll never set it explicitly, but it's worth remembering that you can't manually resolve merge conflicts
  if you merge multiple branches at once.
  In my experience, this means it's worth always merging branches one at a time.
- `ours`: Performs a normal merge but ignores all the changes from the incoming branch.
  This means the resulting tree is the same as it was before the merge.
  This can be useful when you wish to merge a branch and indicate this in the history without wanting to include any of its changes.
  For example, you could use this to merge the results of a failed experiment and then delete the experimental branch afterward.
  In this case, the experiment would remain in the history without being in the current code.
- `subtree`: A modified version of the `recursive` strategy
  that detects whether the tree structures are at different levels and adjusts them if needed.
  For example, if one branch had all the files in the directory `A/B/C` and
  the other had all the same files in the directory `A/B`,
  then the subtree strategy would handle this case;
  `A/B/C/README.md` and `A/B/README.md` could be merged despite their different tree locations.

Some useful merge strategy options for a `recursive` merge (currently the only strategy with options) are as follows:

- ours: Automatically solves any merge conflicts by always selecting the previous version from the current branch
  (instead of the version from the incoming branch).
- `theirs`: The reverse of `ours`.
  This option automatically solves any merge conflicts
  by always selecting the version from the incoming branch (instead of the previous version from the current branch).
- `patience`: Uses a slightly more expensive `git diff` algorithm to try to decrease the chance of a merge conflict.
- `ignore-all-space`: Ignores whitespace when selecting which version should be chosen in case of a merge conflict.
  If the incoming branch has made only whitespace changes to a line, the change is ignored.
  If the current branch has introduced whitespace changes but the incoming branch has made non-whitespace changes, then that version is used.

Neither of these lists is exhaustive, but these are the strategies and options I've found are most commonly used.
You can examine all the merge strategies and options by running `git help merge`.

## Merging an existing branch into the current branch: git merge

At some point, you have a branch you're done with, and you want to bring all the commits made on it into another branch.
This process is known as a **merge**.

When a merge is requested, all the commits from another branch are pulled into the current branch.
Those commits then become part of the history of the branch.

- Run `git checkout master` to check out the branch you wish to merge `chapter-two` into.
- Run `git merge chapter-two`.

WHAT IF YOU TRY TO MERGE THE SAME COMMIT INTO A BRANCH MULTIPLE TIMES?
`git merge` won't merge the same commit into a branch multiple times;
it will exit and output Already `up-to-date`, rather than performing the merge.

后面讲的是 merge 之后，这个分支该如何处理。

After a merge, you may decide to **keep the existing branch**
to add more commits to it and perhaps merge again at a later point
(only the new commits will need to be merged next time).
Alternatively, you can **delete the branch** and make future commits on Git's default `master` branch,
and create another branch when needed in the future.
