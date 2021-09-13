---
title:  ".git subdirectory"
sequence: "111"
---

## .git subdirectory

running the `find` command.

```text
$ find .git/
.git/
.git/config         // (1) Local configuration
.git/description        // (2) Description file
.git/HEAD                   // (3) HEAD pointer
.git/hooks
.git/hooks/applypatch-msg.sample    // (4) Event hooks
.git/hooks/commit-msg.sample
.git/hooks/fsmonitor-watchman.sample
.git/hooks/post-update.sample
.git/hooks/pre-applypatch.sample
.git/hooks/pre-commit.sample
.git/hooks/pre-merge-commit.sample
.git/hooks/pre-push.sample
.git/hooks/pre-rebase.sample
.git/hooks/pre-receive.sample
.git/hooks/prepare-commit-msg.sample
.git/hooks/push-to-checkout.sample
.git/hooks/update.sample
.git/info
.git/info/exclude    // (5) Excluded files
.git/objects
.git/objects/info    // (6) Object information
.git/objects/pack    // (7) Pack files
.git/refs
.git/refs/heads      // (8) Branch pointers
.git/refs/tags       // (9) Tag pointers
```

- (1) contains the configuration of the local repository.
- (2) is a file that describes the repository.
- (3), (8), and (9) contain a **HEAD pointer**, **branch pointers**, and **tag pointers**, respectively, that point to **commits**.
- (4) shows event hook samples (scripts that run on defined events). For example, `pre-commit` is run before every new commit is made.
- (5) contains files that should be excluded from the repository.
- (6) and (7) contain object information and pack files, respectively, that are used for object storage and reference.

**You shouldn't edit any of these files directly** until you have a more advanced understanding of Git (or never).
You'll instead modify these files and directories by interacting with the Git repository through Git's filesystem commands.

## workflow

The typical workflow is that you'll change the contents of files in a repository, review the **diffs**,
add them to the **index**,
create a new **commit** from the contents of the **index**,
and repeat this cycle.

{:refdef: style="text-align: center;"}
![typical workflow](/assets/images/git/git-typical-workflow.png)
{: refdef}

