---
title:  "history"
sequence: "105"
---

The **history** in Git is the complete list of all **commits** made since the repository was created.
The history also contains references to any **branches**, **merges**, and **tags** made within the repository.

Ideally, **commits** are small and well-described;
follow these two rules, and having a complete history becomes a very useful tool.

## WHY ARE SMALL COMMITS BETTER?
Sometimes it's desirable to pick only some changed files
(or even some changed lines within files)
to include in a commit and leave the other changes to be added in a future commit.
**Commits should be kept as small as possible**.
This allows their message to describe a single change rather than multiple changes that are unrelated
but were worked on at the same time.
**Small commits keep the history readable**;
it's easier when looking at a small commit in the future to understand exactly why the change was made.
If a small commit is later found to be undesirable, it can be easily reverted.
This is much more difficult if many unrelated changes are clumped together into
a single commit and you wish to revert a single change.

## HOW SHOULD COMMIT MESSAGES BE FORMATTED?
The commit message is structured like an email.
**The first line** is treated as **the subject** and **the rest** as **the body**.
The commit subject is used as a summary for that commit when only a single line of the commit message is shown,
and it should be 50 characters or less.
The remaining lines should be wrapped at 72 characters or less and separated from the subject by a single, blank line.
The commit message should describe what the commit does in as much detail as is useful, in the present tense.

## view the commit history

Run `git log` and, if necessary, `q` to exit.



