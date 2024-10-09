---
title: "git revert"
sequence: "103"
---

[UP](/git/git-index.html)


Reverting a previous commit: git revert

You may occasionally make a commit that you regret.
You'll then want to undo the commit until you can fix it so it works as intended.

In Git you can **rewrite history** to hide such mistakes,
but this is generally considered bad practice if you've already pushed a commit publicly.
In these cases, you're better off instead using `git revert`.

You wish to revert a commit to reverse its changes:

- Change to the directory containing your repository
- Run `git checkout master`
- Run `git revert c18c9ef`

```text
$ git revert c18c9ef
[master 3e3c417] Revert "Advanced practice technique."
1 file changed, 1 insertion(+), 1 deletion(-)
```

`git revert` can take a `--signoff` (or `-s`) flag, which behaves similarly to that of `git cherry-pick`;
it appends a **Signed-off-by** line to the end of the commit message.
For example, if this flag had been used in the last example,
the commit message would have had `Signed-off-by: Mike McQuaid <mike@mikemcquaid.com>` appended to it.
