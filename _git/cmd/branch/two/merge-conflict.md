---
title: "merge conflict"
---

[UP](/git/git-index.html)


merge，根据来源区分：两个 local branch 进行 merge，或者一个 local branch 和一个 remote branch 进行 merge。

Sometimes when you merge one branch into another,
there will have been changes to the same part of the same file in both branches,
and Git can't detect automatically which of these changes is the desired one to include.
In this situation you have what's known as a **merge conflict**, which you'll need to resolve manually.

These situations tend to occur more often in software projects
where multiple users are working on the same project at the same time.
One user might make a bug fix to a file while another refactors it,
and when the branches are merged, a merge conflict results.

After these edits, you can use the `git show` command with a `branchname:filename` argument to show
the current state of the `01-IntroducingGitInPractice.asciidoc` file on each branch.

```text
$ git show master:01-IntroducingGitInPractice.asciidoc
$ git show separate-files:01-IntroducingGitInPractice.asciidoc
```

Now that the merge conflict has been resolved,
it can be marked as resolved with `git add` and then the merge commit committed.
You don't need to run git merge again;
you're still in the middle of a merge operation, which concludes when you `git commit`.

Merge commits have default commit message formats and slightly different diff output.
 Let's take a look at the merge commit by running `git show master`.

You can run `git branch --delete separate-files` to delete the branch now that it's merged.

## Merge conflicts

A **merge conflict** occurs when both branches involved in the merge have changed the same part of the same file.
Git will try to automatically resolve these conflicts but sometimes is unable to do so without human intervention.
This case produces a merge conflict.

HOW CAN CONFLICT MARKERS BE FOUND QUICKLY?
When searching a large file for the merge-conflict markers,
you can enter `<<<<` in your text editor's Find tool to locate them quickly.

The person performing the merge must manually edit the file to produce the correctly merged output,
save it, and mark the merge as resolved.
Sometimes, resolving the conflict involves **picking all the lines of a single version**:
either the previous version's lines or the new branch's lines.
Other times, resolving the conflict involves **combining some lines from the previous version and some lines from the new branch**.

When conflicts have been resolved, a **merge commit** can be made.
This stores the two parent commits and the conflicts that were resolved so they can be inspected in the future.
Unfortunately, sometimes people pick the wrong option or merge incorrectly,
so it's good to be able to later see what conflicts they had to resolve.
