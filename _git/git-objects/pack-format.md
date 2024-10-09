---
title: "git pack format"
---

[UP](/git/git-index.html)


## The Packfile Index

- A 4-byte magic number '\377tOc' which is an unreasonable `fanout[0]` value.

- A 4-byte version number (= 2)

- The header consists of 256 4-byte network byte order integers.  N-th entry of this table records the number of
  objects in the corresponding pack, the first byte of whose
  object name is less than or equal to N.  This is called the
  'first-level fan-out' table.

- A table of sorted object names. These are packed together
  without offset values to reduce the cache footprint of the
  binary search for a specific object name.

- A table of 4-byte CRC32 values of the packed object data.
  This is new in v2 so compressed data can be copied directly
  from pack to pack during repacking without undetected
  data corruption.

- A table of 4-byte offset values (in network byte order).
  These are usually 31-bit pack file offsets, but large
  offsets are encoded as an index into the next table with
  the msbit set.

- A table of 8-byte offset entries (empty for pack files less
  than 2 GiB).  Pack files are organized with heavily used
  objects toward the front, so most object references should
  not need to refer to this table.

- The same trailer as a v1 pack file:

  A copy of the pack checksum at the end of
  corresponding packfile.

  Index checksum of all of the above.

## pack format

`.pack` files have the following format:

- **A header** appears at the beginning and consists of the following:

  4-byte signature: The signature is: {'P', 'A', 'C', 'K'}

  4-byte version number (network byte order): Git currently accepts version number 2 or 3 but generates version 2 only.

  4-byte number of objects contained in the pack (network byte order)

  Observation: we cannot have more than 4G versions ;-) and more than 4G objects in a pack.

- The header is followed by **number of object entries**, each of which looks like this:

  (undeltified representation)
  n-byte type and length (3-bit type, (n-1)*7+4-bit length)
  compressed data

  (deltified representation)
  n-byte type and length (3-bit type, (n-1)*7+4-bit length)
  base object name if `OBJ_REF_DELTA` or a negative relative
  offset from the delta object's position in the pack if this
  is an `OBJ_OFS_DELTA` object
  compressed delta data

  Observation: length of each object is encoded in a variable
  length format and is not constrained to 32-bit or anything.

- The trailer records **a pack checksum** of all of the above.

N.B. The length in the header is the length of the **uncompressed** data, while the data stream is **compressed**. So how do you know where the next entry starts? Unless you have the pack index file (which git-upload-pack didn't send), you don't.

### Object types

Valid object types are:

- OBJ_COMMIT (1)
- OBJ_TREE (2)
- OBJ_BLOB (3)
- OBJ_TAG (4)
- OBJ_OFS_DELTA (6)
- OBJ_REF_DELTA (7)

Type `5` is reserved for future expansion. Type `0` is invalid.

## References

- [The Git Pack Format](http://driusan.github.io/git-pack.html)
- [Unpacking Git packfiles](https://codewords.recurse.com/issues/three/unpacking-git-packfiles)
- [pack-format](https://git-scm.com/docs/pack-format)
- [Git pack format](https://github.com/git/git/blob/master/Documentation/technical/pack-format.txt)
- [The Packfile](https://shafiul.github.io//gitbook/7_the_packfile.html)
