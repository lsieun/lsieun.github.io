---
title: "git blame"
---

[UP](/git/git-index.html)


I'm sure all developers have been in a situation
where they've seen some line of code in a file and wondered why it is was written that way.
As long as the file is stored in a Git repository,
it's easy to query who made a change as well as when and why (given a good commit message was used) a certain change was made.

You could do this by using `git diff` or `git log --patch`,
but neither of these tools is optimized for this particular use case;
they both usually require reading through a lot of information you aren't interested in to find the information you want.
Instead, let's see how to use a command designed specifically for this use case: `git blame`.

You wish to show the commit, person, and date on which each line of `GitInPractice.asciidoc` was changed.

```text
$ git blame --date=short 01-IntroducingGitInPractice.asciidoc
^6576b68 GitInPractice.asciidoc (Mike McQuaid 2013-09-29 1) = Git In Practice
6b437c77 GitInPractice.asciidoc (Mike McQuaid 2013-09-29 2) == Chapter 1
07fc4c3c GitInPractice.asciidoc (Mike McQuaid 2013-10-11 3) // think of funny first line that editor will approve.
ac14a504 GitInPractice.asciidoc (Mike McQuaid 2013-11-09 4) == Chapter 2
ac14a504 GitInPractice.asciidoc (Mike McQuaid 2013-11-09 5) // write two chapters
```

The blame output shows the following:
- `--date=short` is used to display only the date (not the time).
  This accepts the same formats as the `--date` flag for git log.
  It was used in the preceding listing to make it more readable, because `git blame` lines tend to be very long.
- The `^` (caret) prefix on the first line indicates that this line was inserted in the initial commit.
- Each line contains the short SHA-1, filename (if the line was changed when the file had a different name),
  parenthesized name, date, line number, and line contents.
  For example, in commit `6b437c77` on `September 29, 2013`, `Mike McQuaid` added the `== Chapter 1` line to `GitInPractice.asciidoc`
  (although the file is now named 01-IntroducingGitInPractice.asciidoc).

`git blame` is only showing changes to lines in the file and ignoring that the file was renamed.
This is useful, because it means you don't lose all blame data whenever you rename a file.
我有一个想法，使用程序生成不同的分支，然而来查看不同分支的内容

`git blame` has a `--show-email` (or `-e`) flag that can show **the email address of the author** instead of **the name**.

You can use the `-w` flag to **ignore whitespace changes** when finding where the line changes came from.
Sometimes people fix stuff like indentation or whitespace on a line,
which makes no functional difference to the code in most programming languages.
In these cases, you want to ignore whitespace changes so you can look at the changes that affect program behavior.

The `-s` flag hides **the author name** and **date** in the output (and takes precedence over `--show-email`/`-e`).
This can be useful for displaying a more concise output format and looking up this information
by passing the SHA-1 to `git show` at a later point.

If the `-L` flag is specified and followed with a line range — for example, `-L 40,60` —
then only the lines in that range are shown.
This can be useful if you know already what subset of the file you care about and
don't want to have to search through it again in the `git blame` output.
