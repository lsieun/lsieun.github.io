---
title: "git cherry-pick"
---

[UP](/git/git-index.html)


Sometimes you may wish to include only a single commit from a branch onto the current branch
rather than merging the entire branch.
For example, you may want to back-port a single bug-fix commit
from a development branch into a stable release branch.
You could do this by manually creating the same change on that branch,
but a better way is to use the tool that Git provides: `git cherry-pick`.

You wish to cherry-pick a commit from the `v0.1-release` branch to the `master` branch.

- Change to the directory containing your repository
- Run `git checkout master`
- Run `git cherry-pick v0.1-release`

WHY DOES THE SHA-1 CHANGE ON A CHERRY-PICK?
Recall that the SHA-1 of a commit is based on its tree and metadata (which includes the parent commit SHA-1).
Because the resulting `master` branch `cherry-picked` commit has a different parent
than the commit that was cherry-picked from the `v0.1-release` branch, the commit SHA-1 differs also.

`git cherry-pick` (like many other Git commands) can take a **ref** as the parameter rather than only a specific commit.
As a result, you could have interchangeably used `git cherry-pick dfe2377`
(where `dfe2377` is the most recent commit on the v0.1-release branch) in the previous example with the same result.
You can pass **multiple refs** to `cherry-pick`, and they will be cherry-picked onto the current branch in the order requested.

HOW MANY COMMITS SHOULD YOU CHERRY PICK?
Cherry-picking is best used for individual commits that may be out of sequence.
The classic use case highlighted earlier is back-porting bug fixes from a development branch to a stable branch.
When this is done, it's effectively duplicating the commits (rather than sharing them as with a merge).
If you find yourself wanting to cherry-pick the entire contents of a branch, you'd be better off merging it instead.

`git cherry-pick` can take various flags:

- If the `--edit` flag is passed to `git cherry-pick`, it prompts you for **a commit message** before committing.
- If you're cherry-picking from a public branch (one you'll push remotely) to another public branch,
  you can use the `-x` flag to append a line to the cherry-picked commit's message
  saying **which commit this change was picked from**.
  For example, if this flag had been used in the last example, the commit message would have had
  (cherry picked from commit dfe2377f00bb58b0f4ba5200b8f4299d0bfeeb5d) appended to it.
- When you want to indicate in the commit message **which person cherry-picked a particular change** more explicitly than
  the Committer metadata set by default, you can use the `--signoff` (or `-s`) flag.
  This appends a Signed-off-by line to the end of the commit message.
  For example, if this flag had been used in the last example,
  the commit message would have had Signed-off-by:  Mike McQuaid <mike@mikemcquaid.com> appended to it.
- If **there's a merge conflict** on a `cherry-pick`, you need to resolve it in a fashion similar to a `git merge`
  (or in the same fashion as `git rebase`).
  This involves resolving the conflict and running `git add`, but then using `git cherry-pick`
  --continue instead of `git commit` to commit the changes.
  If you want to abort the current cherry-pick, perhaps because you've realized the merge conflict is too complex,
  you can do this using `git cherry-pick --abort`.

WHEN WOULD YOU SIGN OFF A COMMIT?
Signing off a commit is generally used in projects to indicate that a commit was checked by someone else before being included.
I'm a maintainer of the Homebrew open source project and use signing off to indicate to other maintainers that I was the one who merged this commit.
This information is also included as the Author meta data in the commit,
but the sign-off makes it more readily accessible.
The same process could be used in companies when a developer reviews the work of another and wants to signify this in a commit message. 
