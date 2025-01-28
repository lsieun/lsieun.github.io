---
title: "git log"
---

[UP](/git/git-index.html)


## view the commit history

Run `git log` and, if necessary, `q` to exit.

The `git log` output lists all the commits that have been made on the current branch in reverse chronological order (the
most recent commit comes first).

`git log` can take revision or path arguments to specify the output history be shown starting at the given revision or
only include changes to the requested paths.
`git log` can take a `--patch` (or `-p`) flag to show the `diff` for each commit output. It can also take `--stat`
or `--word-diff` flag to show a `diffstat` or `word diff`.

## Listing only certain commits

Sometimes, when examining history, you'll want to filter the commits that are displayed based on some of their metadata.
Perhaps you're tracking down a commit that you can remember was made on **a rough date**, by **a particular person**,
or with **a particular word in its commit message**.

You could do this manually, but sometimes there are too many commits in the history to scan through the `git log` or `gitx` output in a timely fashion.
For these cases, the `git log` command has **various flags and arguments** that you can use to filter which commits are shown in its output.

Let's start by trying to find a commit by **author**, **date**, and **commit message** simultaneously.

You want to list the commits authored by Mike McQuaid after November 10, 2013, with the string “file.” in their message.

- Change to the directory containing your repository
- Run `git log --author "Mike McQuaid" --after "Nov 10 2013" --grep 'file\.'` and, if necessary, `q` to exit.

```text
git log --author "Mike McQuaid" --after "Nov 10 2013" --grep 'file\.'
```

The arguments provided to the log command indicate the following:

- `--author`: specifies a regular expression that matches the contents of the author.
- `--after` (or `--since`): specifies that the only commits shown should be those that were made after the specified date. These dates can be in any format that Git recognizes, such as `Nov 10 2013`, `2014-01-30`, `midnight`, or `yesterday`.
- `--grep`: specifies a regular expression that matches the contents of the commit message. `file\.` was used rather than `file.` to escape the `.` character.

`git log` can take the following arguments:

- A `--max-count` (or `-n`) argument to limit the number of commits shown in the log output.
  I tend to use this often when I only care about something in, say, the last 10 commits and don't want to scroll through more output than that.
- A `--reverse` argument to show the commits in ascending chronological order (oldest commit first).
- A `--before` (or `--until`) argument, which will only show commits before the given date. This is the reverse of `--after`.
- A `--merges` flag (or `--min-parents=2`), which will only show merge commits — commits that have at least two parents.
  If you adopt a branch-heavy workflow with Git, this will be useful in identifying which branches were merged and when.

## Listing commits with different formatting

The default `git log` output format is helpful, but it takes a minimum of six lines of output to display each commit.
It displays the commit SHA-1, author name and email, commit date, and the full commit message
(each additional line of which adds a line to the `git log` output).

Sometimes you'll want to display more information, and sometimes you'll want to display less.
You may even have a personal preference about how the output is presented that doesn't match how it currently is.

You want to list the last two commits in an email format with the oldest displayed first:

```text
$ git log --format=email --reverse --max-count 2
From e15da9bc900fc983511f36872b5d069dabc74205 Mon Sep 17 00:00:00 2001
From: lsieun <331505785@qq.com>
Date: Tue, 2 Nov 2021 01:40:07 +0800
Subject: [PATCH] Merge branch 'eugenp:master' into master


From 615f407cdfe5fd764ad9a16325da2911ccd60369 Mon Sep 17 00:00:00 2001
From: 515882294 <515882294@qq.com>
Date: Tue, 2 Nov 2021 16:09:03 +0800
Subject: [PATCH] BAEL-4286 How to get the value of a bit at a certain position
 from a byte
```

If you specify the `--patch` (or `-p`) flag to `git log`,
you can also format the diff output by specifying flags for `git diff`.
Recall the discussion of word diffs.
`git log --patch --word-diff` shows the word diff (rather than the unified diff) for each log entry.

`git log` can take a `--date` flag, which takes various parameters to display the output dates in different formats.
For example, `--date=relative` displays all dates relative to the current date; 6 weeks ago and `--date=short` display only
the date, such as 2013-11-28. `iso` (or iso8601), `rfc` (or rfc2822), `raw`, `local`, and `default` formats are also available,
but I won't detail them in this book.

经常使用：

```text
$ git log --date=relative -n 2
$ git log --date=short -n 2

```

不经常使用：

```text
$ git log --date=iso -n 2
$ git log --date=rfc -n 2
$ git log --date=raw -n 2
$ git log --date=local -n 2
$ git log --date=default -n 2
```

The `--format` (or `--pretty`) flag can take various parameters, such as `email`;
`medium`, which is the default if no format was specified;
and `oneline`, `short`, `full`, `fuller`, and `raw`.
Different formats are better used in different situations depending on how much of their displayed information you care about at that time.

You may have noticed that the `full` output contains details about an author and a committer,
and the `fuller` output additionally contains details of the author date and commit date.

```text
$ git log --format=fuller
commit 334181a038e812050051776b69f0a80187abbeed
Author: BrewTestBot <brew-test-bot@googlegroups.com>
AuthorDate: Thu Jan 9 23:48:16 2014 +0000
Commit: Mike McQuaid <mike@mikemcquaid.com>
CommitDate: Fri Jan 10 08:19:50 2014 +0000
rust: add 0.9 bottle.
...
```

WHY DO COMMITS HAVE AN AUTHOR AND A COMMITTER?
The `fuller` commit output shows that for a commit, there are two recorded actions:
**the original author** of the commit and **the committer** (the person who added this commit to the repository).
These two attributes are both set at `git commit` time.
If they're both set at once, then why are they separate values?
Remember, you've seen repeatedly that commits are like emails and can be formatted as emails and sent to others.
If I have a public repository on GitHub, other users can clone my repository but can't commit to it.

In these cases they may send me commits through a **pull request** or by email.
If I want to include these in my repository,
the separation between committing and authoring means I can then include these commits,
and Git stores the person who, for example, made the code changes and
the person who added these changes to the repository (hopefully after reviewing them).
This means you can keep the original attribution for the person who did the work
but still record the person who added the commit to the repository and (hopefully) reviewed it.
This is particularly useful in open source software;
with other tools, such as Subversion, if you don't have commit access to a repository,
the best attribution you could hope for would be something like “Thanks to Mike McQuaid for this commit!”
in the commit message.

## Custom output format

If none of the `git log` output formats meets your needs,
you can create your own custom format using a **format string**.
The format string uses placeholders to fill in various attributes per commit.

Let's create a more prose-like format for git log.

```text
$ git log --format="%ar %an did: %s"
```

Here I've specified the format string with %ar %an did: %s. In this format string
- `%ar` is the relative format date on which the commit was authored.
- `%an` is the name of the author of the commit.
- `did`: is text that's displayed the same in every commit and isn't a placeholder.
- `%s` is the **commit message subject** (the first line).

You can see the complete list of these placeholders in `git log --help`.
The large number of placeholders should mean you can customize `git log` output into almost any format.

## The ultimate log output

As mentioned previously, often the git log output is too verbose or
doesn't display all the information you wish to query in a compact format.
It's also not obvious from the output how local or remote branches relate to the output.

```text
$ git log --oneline --graph --decorate
* 129cce6 (origin/master, origin/HEAD, master) Merge branch 'testing'
|\
| * a86067a (origin/testing, testing) testing branch commit
* | 1a36bd6 master branch commit
...
```

- The `*` means a commit that was made.
- Each line follows a single branch.

Typing `git log --oneline --graph --decorate` is unwieldy,
so you'll see laterhow to shorten this to something like `git l` by using an alias.

## Searching Logs

You can also use the `log` command to search for specific changes in the code.
For example you can search for the text `A promise in JavaScript is very similar` as follows.

```text
git log -S "A promise in JavaScript is very similar"
```
