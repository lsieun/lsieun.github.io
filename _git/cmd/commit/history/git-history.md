---
title: "history"
sequence: "105"
---

[UP](/git/git-index.html)


The **history** in Git is the complete list of all **commits** made since the repository was created. The history also
contains references to any **branches**, **merges**, and **tags** made within the repository.

Ideally, **commits** are **small** and **well-described**; follow these two rules, and having a complete history becomes
a very useful tool.

history 关联的一个主要对象是 commit。

## WHY ARE SMALL COMMITS BETTER?

Sometimes it's desirable to pick only some changed files
(or even some changed lines within files)
to include in a commit and leave the other changes to be added in a future commit.
**Commits should be kept as small as possible**. This allows their message to describe a single change rather than
multiple changes that are unrelated but were worked on at the same time.
**Small commits keep the history readable**; it's easier when looking at a small commit in the future to understand
exactly why the change was made. If a small commit is later found to be undesirable, it can be easily reverted. This is
much more difficult if many unrelated changes are clumped together into a single commit and you wish to revert a single
change.

## HOW SHOULD COMMIT MESSAGES BE FORMATTED?

The commit message is structured like an email.
**The first line** is treated as **the subject** and **the rest** as **the body**. The commit subject is used as a
summary for that commit when only a single line of the commit message is shown, and it should be 50 characters or less.
The remaining lines should be wrapped at 72 characters or less and separated from the subject by a single, blank line.
The commit message should describe what the commit does in as much detail as is useful, in the present tense.

## WHY ARE COMMITS STRUCTURED LIKE EMAILS?

Remember that commits are structured like emails?
This is because Git was initially created for use by the Linux kernel project, which has a high-traffic mailing list.
People frequently send commits (known as **patches**) to the mailing list.
Previously there was an implicit format that people used to turn a requested change into an email for the mailing list,
but Git can convert commits to and from an email format to facilitate this.
Commands such as `git format-patch`, `git send-mail`, and `git am` (an abbreviation for “apply mail-box”)
can work directly with email files to convert them to/from Git commits.
This is particularly useful for open source projects where everyone can access the Git repository but fewer people have write access to it.
In this case, someone could send me an email that contains all the metadata of a commit using one of these commands.
Nowadays, typically this is done with a GitHub pull request instead.

## gitk

It's also useful to graphically visualize history. Gitk is a tool for viewing the history of Git repositories. It's
usually installed with Git but may need to be installed by your package manager or separately. Its ability to
graphically visualize Git's history is partic- ularly helpful when history becomes more complex  (say, with merges and
remote branches).

To view the commit history with `gitk`, follow these steps:

- Change directory to the Git repository
- Run `gitk`

## Rewriting history

Git is unusual compared to many other version control systems in that it allows history to be rewritten.

Sometimes you may want to highlight only broader changes to files in a version control system over a period of time
instead of sharing every single change that was made in reaching the final state.

![](/assets/images/git/squash-multiple-commits-into-a-single-commit.png)

In the figure the **commits** are **squashed** together:
so instead of having three commits with the latter two fixing mistakes from the first commit,
we've squashed them together to create a single commit for the window feature.
You'd only rewrite history like this if you were working on a separate branch that didn't have other work from other people relying on it yet,
because it has changed some parent commits (so, without intervention, other people's commits may point to commits that no longer exist).

## Avoiding and recovering from disasters

Any operation that acts on **commits** (such as `git rebase`) rather than **the working directory**
(such as `git reset --hard` with uncommitted changes) is easily recoverable
using `git reflog` for 90 days after the changes were made.

The main rule to avoid data loss therefore is **commit early and commit often**.
Now that you know how to rewrite history, you should think of committing
not as a complex operation but similar to a Save operation in most other pieces of software.
Commit whenever you've written anything useful that you don't want to lose,
and then rewrite your history later into small, readable commits.

The easiest (and most common) way to lose data with Git is
when it hasn't been committed and you accidentally run `git reset --hard` or `git checkout --force`,
and it's overwritten on disk.
This can be somewhat avoided by having regular backups of your repository
while you work (such as using Time Machine on OS X),
but it's generally better to let Git handle this for you by committing more often.

Another way to secure your data with Git is to regularly push to remote work branches
that you've agreed nobody else will commit to.
If you've agreed that no one else will commit to these work branches,
it's reasonable to rewrite and force-push to them in the same way you might rewrite a local branch.
This means these changes will be safe on the remote repository and downloaded by anyone else's git fetch from this repository.
This is useful in case there is a hardware failure on your machine; you can get back the data from the branch on the remote repository.

If things ever go really badly and you suffer disk corruption with important but unpushed commits in your repository,
you can run the `git fsck` tool.
It verifies the integrity of the repository and prints out any missing or corrupt objects that it finds.
You can then remove these corrupt objects, restore them from backups,
or check whether other users of the same repository have the same objects.
Hopefully the corrupted objects aren't those with the most recent work you wish to recover.
