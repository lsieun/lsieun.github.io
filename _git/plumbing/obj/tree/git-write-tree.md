---
title: "git write-tree"
sequence: "101"
---

[UP](/git/git-index.html)


Before peering at the contents of the tree object in more detail,
let's check out an important feature of SHA1 hashes:

```text
$ git write-tree
68aba62e560c0ebc3396e8ae9335232cd93a3f60

$ git write-tree
68aba62e560c0ebc3396e8ae9335232cd93a3f60

$ git write-tree
68aba62e560c0ebc3396e8ae9335232cd93a3f60
```

Every time you compute another tree object for the same index, the SHA1 hash remains exactly the same.
Git doesn't need to recreate a new tree object.
If you're following these steps at the computer, you should be seeing exactly the same SHA1 hashes.

In this sense, the hash function is a true function in the mathematical sense:
For a given input, it always produces the same output.
Such a hash function is sometimes called a **digest** to emphasize that
it serves as a sort of summary of the hashed object.
Of course, any hash function, even the lowly parity bit, has this property.
