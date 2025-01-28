---
title: "git objects: tree format"
---

[UP](/git/git-index.html)


The format of a `tree` object:

```text
tree [content size]\0[Entries having references to other trees and blobs]
```

The format of each `entry` having references to other trees and blobs:

```text
[mode] [file/folder name]\0[SHA-1 of referencing blob or tree]
```
