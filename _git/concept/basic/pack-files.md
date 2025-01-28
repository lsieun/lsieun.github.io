---
title: "pack files"
sequence: "103"
---

Over time, all the information in the **object store** changes and grows,
tracking and modeling your project edits, additions, and deletions.
To use disk space and network bandwidth efficiently,
Git compresses and stores the objects in **pack files**, which are also placed in the **object store**.

```text
                   ┌─── tracked file
                   │
git.files.state ───┼─── untracked file
                   │
                   └─── ignored file
```

### Pack Files

An astute reader may have formed a lingering question about Git's data model and its storage of individual files:
Isn't it incredibly inefficient to store the complete content of every version of every file directly?
Even if it is compressed, isn't it inefficient to have the complete content of different versions of the same file?
What if you only add, say, one line to a file, doesn't Git store the complete content of both versions?

Luckily, the answer is "No, not really!"

Instead, Git uses a more efficient storage mechanism called a **pack file**.
To create a packed file, Git first locates files whose content is very similar and
stores the complete content for one of them.
It then computes the differences, or deltas, between similar files and stores just the differences.
For example, if you were to just change or add one line to a file,
Git might store the complete, newer version and then take note of the one line change as a delta and store that in the pack too.

Storing a complete version of a file and the deltas needed to construct other versions of similar files is not a new trick.
It is essentially the same mechanism that other VCSs such as RCS have used for decades.

Git does the file packing very cleverly, though.
Since Git is driven by content it doesn't really care if the deltas it computes
between two files actually pertain to two versions of the same file or not.
That is, Git can take any two files from anywhere within the repository and compute deltas between them
if it thinks they might be similar enough to yield good data compression.
Thus, Git has a fairly elaborate algorithm to locate and
match up potential delta candidates globally within a repository.
Furthermore, Git is able to construct a series of deltas from one version of a file to a second, to a third, etc.

Git also maintains the knowledge of the original blob SHA1 for each complete file
(either the complete content or as a reconstruction after deltas are applied) within the packed representation.
This provides the basis for an index mechanism to locate objects within a pack.

Packed files are stored in the object store alongside the other objects.
They are also used for efficient data transfer of repositories across a network.