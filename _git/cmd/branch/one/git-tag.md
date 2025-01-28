---
title: "git tag"
---

[UP](/git/git-index.html)


## Creating a tag: git tag

A **tag** is another **ref** (or pointer) for a single commit.
**Tags** differ from **branches** in that they're (usually) permanent.
Rather than pointing to the work in progress on a feature,
they're generally used to describe a version of a software project.

For example, if you were releasing version 1.3 of your software project,
you'd tag the commit that you release to customers as v1.3 to store that version for later use.
Then if a customer later complained about something being broken in v1.3,
you could check out that tagged commit and test against it,
confident that you were using the same version of the software that the customer was.
This is one of the reasons you shouldn't modify tags; once you've released a version to customers,
if you want to update it, you'll likely release a new version such as 1.4 rather than changing the definition of 1.3.

You wish to tag the current state of the `GitInPracticeReduxmaster` branch as version v0.1.

- Change to the directory containing your repository
- Run `git checkout master`.
- Run `git tag v0.1`
- Run `git tag`

All tags in the current repository (not just the current branch) are listed by `git tag`.

`git tag` can take various flags:
- The `--list` (or `-l`) flag lists all the tags that match a given pattern. For example, the tag v0.1 will be matched and listed by `git tag list --v0.*`.
- The `--force` (or `-f`) flag updates a tag to point to the new commit. This is useful for occasions when you realize you've tagged the wrong commit.
- The `--delete` (or `-d`) flag deletes a tag. This is useful if you've created a tag with the wrong name rather than just pointing to the wrong commit.

Run `git push` to push the `master` branch to `origin/master`.
You may notice that **it doesn't push any of the tags**.
After you've tagged a version and verified that it's pointing to the correct commit and has the correct name,
you can push it using `git push --tags`.
This pushes all the tags you've created in the local repository to the remote repository.
These tags will then be fetched by anyone using `git fetch` on the same repository in future.

HOW CAN YOU UPDATE REMOTE TAGS?
You've seen that by using `git tag --delete` or `git tag --force`,
it's possible to delete or modify tags locally.
It's also possible to push these changes to the remote repository with `git push --tags --force`,
but doing so is not advised.
If other users of the repository want to have their tags updated, they will need to delete them locally and refetch.
This is intentionally cumbersome, because Git intends tags to be static and
so doesn't change them locally without users' explicit intervention.

If you realize you've tagged the wrong commit and wish to update it after pushing,
it's generally a better idea to tag a new version and push that instead.
This complexity is why `git push` requires the `--tags` argument to push tags.
