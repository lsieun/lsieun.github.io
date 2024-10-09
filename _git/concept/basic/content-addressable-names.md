---
title: "Content-Addressable Names"
sequence: "102"
---

The **Git object store** is organized and implemented as a **content-addressable storage system**.

## Content-Addressable Names

Specifically, each object in the object store has a unique name produced
by applying SHA1 to the contents of the object, yielding an SHA1 hash value.
Because the complete contents of an object contribute to the hash value and
the hash value is believed to be effectively unique to that particular content,
the SHA1 hash is a sufficient index or name for that object in the object database.
Any tiny change to a file causes the SHA1 hash to change, causing the new version of the file to be indexed separately.

## SHA1

SHA1 values are 160-bit values that are usually represented as a 40-digit hexadecimal number,
such as `9da581d910c9c4ac93557ca4859e767f5caf5169`.

```text
SHA1 占 160 bits = 20 byte，使用 40 个十六进制表示
```

Sometimes, during display, SHA1 values are abbreviated to a smaller, unique prefix.

```text
缩写
```

Git users speak of **SHA1**, **hash code**, and sometimes **object ID** interchangeably.

```text
别名：SHA1 = hash code = object ID
```

An important characteristic of the SHA1 hash computation is that it always computes the same ID for identical content,
regardless of where that content is.
In other words, the same file content in different directories and even on different machines
yields the exact same SHA1 hash ID.
Thus, the SHA1 hash ID of a file is an effective globally unique identifier.

```text
identical content --> same SHA1
```

A powerful corollary is that files or blobs of arbitrary size can be compared for equality across the Internet
by merely comparing their SHA1 identifiers.

> corollary 必然的结果（或结论）a situation, an argument or a fact that is the natural and direct result of another one

## Git Tracks Content

It's important to see Git as something more than a VCS: **Git is a content tracking system**.

**Git's content tracking** is manifested in two critical ways
that differ fundamentally from almost all other revision control systems.

**First, Git's object store is based on the hashed computation of the contents of its objects**,
not on the file or directory names from the user's original file layout.
Thus, when Git places a file into the object store,
it does so based on the hash of the data and not on the name of the file.
In fact, Git does not track file or directory names, which are associated with files in secondary ways.
Again, Git tracks content instead of files.

If two separate files have exactly the same content, whether in the same or different directories,
Git stores a single copy of that content as a blob within the object store.
Git computes the hash code of each file according solely to its content,
determines that the files have the same SHA1 values and thus the same content,
and places the blob object in the object store indexed by that SHA1 value.
Both files in the project, regardless of where they are located in the user's directory structure,
use that same object for content.

If one of those files changes, Git computes a new SHA1 for it,
determines that it is now a different blob object, and adds the new blob to the object store.
The original blob remains in the object store for the unchanged file to use.

**Second, Git's internal database efficiently stores every version of every file**
- not their differences - as files go from one revision to the next.
Because Git uses the hash of a file's complete content as the name for that file,
it must operate on each complete copy of the file.
It cannot base its work or its object store entries on only part of the file's content
nor on the differences between two revisions of that file.

The **typical user view of a file**
that it has revisions and appears to progress from one revision to another revision
is simply an artifact.

```text
用户视角
```

Git computes this history as a set of changes between different blobs with varying hashes,
rather than storing a file name and set of differences directly.
It may seem odd, but this feature allows Git to perform certain tasks with ease.

## Pathname Versus Content

Git's physical data layout isn't modeled after the user's file directory structure.
Instead, it has a completely different structure that can, nonetheless, reproduce the user's original layout.
Git's internal structure is a more efficient data structure for its own internal operations and storage considerations.

When Git needs to create a working directory, it says to the filesystem:
"Hey! I have this big blob of data that is supposed to be placed at pathname path/to/directory/file.
Does that make sense to you?"
The filesystem is responsible for saying
"Ah, yes, I recognize that string as a set of subdirectory names, and I know where to place your blob of data! Thanks!"
