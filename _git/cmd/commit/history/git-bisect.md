---
title: "git bisect"
---

[UP](/git/git-index.html)


The only thing worse than finding a bug in software and having to fix it is having to fix the same bug multiple times.
A bug that was found, fixed, and has appeared again is typically known as a **regression**.

The traditional workflow for finding regressions is fairly painful.
You typically keep checking out older and older revisions in the version control history
until you find a commit in which the bug wasn't present,
check out newer and newer revisions until you find where it happens again,
and repeat the process to narrow it down.
It's a tedious exercise, which is made worse by your having to fix the same problem again.

Fortunately, Git has a useful tool that makes this process much easier for you: `git bisect`.
It uses a binary search algorithm to identify the problematic commit as quickly as possible;
it effectively automates the process of searching backward and forward through history.

The `git bisect` command takes `good` and `bad` arguments
that you use to tell it that a particular commit didn't have the bug (`good`) or did have the bug (`bad`).
It assumes that the bug disappears and reappears multiple times but occurred once,
so it can make the assumption that the commit that caused a particular bug is the first one chronologically that contains that bug.
It uses this assumption, records the `good` and `bad` commits,
and uses this information to narrow down the commits each time.
For example, if it was bisecting between commits from Monday (`good`) to Friday (`bad`),
then if a commit on Wednesday was known to be `good`, it could narrow the search to Monday, Tuesday, or Wednesday.
This halving of the search space each time is known as a binary search
because it makes a binary decision each time: was the `bad` commit before or after this one?

## bisect

```text
git bisect start
git bisect bad
git bisect good 48c86d6
```

To start a bisect you need to run three commands.

- The first command starts the bisect.
- The second command tells Git which commit is the bad commit with the bug.
  If you leave this blank, as we have, Git will just use the latest commit.
- The final command tells Git which commit is known to not have this bug.
  In our example we know that in commit `48c86d6` there is no bug.

Now after you run these three commands,
Git will choose the commit in the middle of these two commits and grab all the code from that commit.
You can then test to see if the bug is in this commit or not.
If the bug is present you just type `git bisect bad` and
it will select the commit that is halfway between this bad commit and the last good commit.
If the bug is not present then you can type `git bisect good` and
Git will select the commit that is halfway between this good commit and the last bad commit.
You keep repeating this process of typing either `good` or `bad`
until eventually you are able to narrow it down to the exact commit that caused the bug.
