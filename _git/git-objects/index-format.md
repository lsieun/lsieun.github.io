---
title: "git index format"
---

[UP](/git/git-index.html)


## Index Format

### The Git index file has the following format

All binary numbers are in network byte order.
In a repository using the traditional SHA-1, checksums and object IDs (object names) mentioned below are all computed using SHA-1.
Similarly, in SHA-256 repositories, these values are computed using SHA-256.
Version 2 is described here unless stated otherwise.

- A 12-byte header consisting of
  - 4-byte signature: The signature is { 'D', 'I', 'R', 'C' } (stands for "dircache")
  - 4-byte version number: The current supported versions are 2, 3 and 4.
  - 32-bit number of index entries.
- A number of sorted index entries (see below).
- Extensions.
- Hash checksum over the content of the index file before this checksum.

### Index entry

Index entries are sorted in ascending order on the `name` field, interpreted as a string of unsigned bytes
(i.e. memcmp() order, no localization, no special casing of directory separator '/').
Entries with the same name are sorted by their stage field.

An index entry typically represents a file.
However, if sparse-checkout is enabled in cone mode (`core.sparseCheckoutCone` is enabled) and
the `extensions.sparseIndex` extension is enabled,
then the index may contain entries for directories outside of the sparse-checkout definition.
These entries have mode `040000`, include the `SKIP_WORKTREE` bit,
and the path ends in a directory separator.

<table>
<thead>
<tr>
<th>Length</th>
<th>Name</th>
<th>Meaning</th>
</tr>
</thead>
<tbody>
<tr>
<td>32-bit</td>
<td>ctime seconds</td>
<td>
the last time a file's metadata changed. this is stat(2) data
</td>
</tr>
<tr>
<td>32-bit</td>
<td>ctime nanosecond fractions</td>
<td>this is stat(2) data</td>
</tr>
<tr>
<td>32-bit</td>
<td>mtime seconds</td>
<td>the last time a file's data changed. this is stat(2) data</td>
</tr>
<tr>
<td>32-bit</td>
<td>mtime nanosecond fractions</td>
<td>this is stat(2) data</td>
</tr>
<tr>
<td>32-bit</td>
<td>dev</td>
<td>this is stat(2) data</td>
</tr>
<tr>
<td>32-bit</td>
<td>ino</td>
<td>this is stat(2) data</td>
</tr>
<tr>
<td>32-bit</td>
<td>mode</td>
<td>
<ul>
<li>4-bit object type. valid values in binary are 1000 (regular file), 1010 (symbolic link) and 1110 (gitlink)</li>
<li>3-bit unused</li>
<li>9-bit unix permission. Only 0755 and 0644 are valid for regular files. Symbolic links and gitlinks have value 0 in this field.</li>
</ul>
</td>
</tr>
<tr>
<td>32-bit</td>
<td>uid</td>
<td>this is stat(2) data</td>
</tr>
<tr>
<td>32-bit</td>
<td>gid</td>
<td>this is stat(2) data</td>
</tr>
<tr>
<td>32-bit</td>
<td>file size</td>
<td>This is the on-disk size from stat(2), truncated to 32-bit.</td>
</tr>
<tr>
<td>160-bit</td>
<td>sha1</td>
<td>Object name for the represented object</td>
</tr>
<tr>
<td>16-bit</td>
<td>flags</td>
<td>
<p>A 16-bit 'flags' field split into (high to low bits)</p>
<ul>
<li>1-bit assume-valid flag</li>
<li>1-bit extended flag (must be zero in version 2)</li>
<li>2-bit stage (during merge)</li>
<li>12-bit name length if the length is less than 0xFFF; otherwise 0xFFF is stored in this field.</li>
</ul>
<p>(Version 3 or later) A 16-bit field, only applicable if the "extended flag" above is 1, split into (high to low bits).</p>
<ul>
<li>1-bit reserved for future</li>
<li>1-bit skip-worktree flag (used by sparse checkout)</li>
<li>1-bit intent-to-add flag (used by "git add -N")</li>
<li>13-bit unused, must be zero</li>
</ul>
</td>
</tr>
<tr>
<td></td>
<td>Entry path name</td>
<td></td>
</tr>
</tbody>
</table>

Entry path name (variable length) relative to top level directory (without leading slash).
'/' is used as path separator.
The special path components ".", ".." and ".git" (without quotes) are disallowed.
Trailing slash is also disallowed.

    The exact encoding is undefined, but the '.' and '/' characters
    are encoded in 7-bit ASCII and the encoding cannot contain a NUL
    byte (iow, this is a UNIX pathname).

(Version 4) In version 4, the entry path name is prefix-compressed
relative to the path name for the previous entry (the very first
entry is encoded as if the path name for the previous entry is an
empty string).  At the beginning of an entry, an integer N in the
variable width encoding (the same encoding as the offset is encoded
for OFS_DELTA pack entries; see pack-format.txt) is stored, followed
by a NUL-terminated string S.  Removing N bytes from the end of the
path name for the previous entry, and replacing it with the string S
yields the path name for this entry.

1-8 nul bytes as necessary to pad the entry to a multiple of eight bytes
while keeping the name NUL-terminated.

(Version 4) In version 4, the padding after the pathname does not
exist.

Interpretation of index entries in split index mode is completely
different. See below for details.

### Extensions

Extensions are identified by **signature**. Optional extensions can be ignored if Git does not understand them.

Git currently supports **cache tree** and **resolve undo** extensions.

<table>
<thead>
<tr>
<th>Length</th>
<th>Name</th>
<th>Meaning</th>
</tr>
</thead>
<tbody>
<tr>
  <td>4-byte</td>
  <td>extension signature</td>
  <td>If the first byte is 'A'..'Z' the extension is optional and can be ignored.</td>
</tr>
<tr>
  <td>32-bit</td>
  <td>size of the extension</td>
  <td></td>
</tr>
<tr>
  <td></td>
  <td>Extension data</td>
  <td></td>
</tr>
</tbody>
</table>

- 4-byte extension signature. If the first byte is 'A'..'Z' the extension is optional and can be ignored.
- 32-bit size of the extension
- Extension data

#### Cache tree

Since the index does not record entries for directories,
the cache entries cannot describe tree objects that already exist in the object database
for regions of the index that are unchanged from an existing commit.
The cache tree extension stores a recursive tree structure that describes the trees
that already exist and completely match sections of the cache entries.
This speeds up tree object generation from the index for a new commit
by only computing the trees that are "new" to that commit.
It also assists when comparing the index to another tree, such as `HEAD^{tree}`,
since sections of the index can be skipped
when a tree comparison demonstrates equality.

The recursive tree structure uses nodes
that store a number of cache entries, a list of subnodes, and an object ID (OID).
The OID references the existing tree for that node, if it is known to exist.
The subnodes correspond to subdirectories that themselves have cache tree nodes.
The number of cache entries corresponds to the number of cache entries in the index
that describe paths within that tree's directory.

The extension tracks the full directory structure in the cache tree extension,
but this is generally smaller than the full cache entry list.

When a path is updated in index,
Git invalidates all nodes of the recursive cache tree corresponding to the parent directories of that path.
We store these tree nodes as being "invalid" by using "-1" as the number of cache entries.
Invalid nodes still store a span of index entries,
allowing Git to focus its efforts when reconstructing a full cache tree.

The signature for this extension is { 'T', 'R', 'E', 'E' }.

A series of entries fill the entire extension; each of which consists of:

- NUL-terminated path component (relative to its parent directory);
- ASCII decimal number of entries in the index that is covered by the tree this entry represents (`entry_count`);
- A space (ASCII 32);
- ASCII decimal number that represents the number of subtrees this tree has;
- A newline (ASCII 10); and
- Object name for the object that would result from writing this span of index as a tree.

An entry can be in an invalidated state and is represented
by having a negative number in the `entry_count` field.
In this case, there is no object name and the next entry starts immediately after the newline.
When writing an invalid entry, `-1` should always be used as `entry_count`.

The entries are written out in the top-down, depth-first order.
The first entry represents the root level of the repository,
followed by the first subtree--let's call this A--of the root level (with its name relative to the root level),
followed by the first subtree of A (with its name relative to A), and so on.
The specified number of subtrees indicates when the current level of the recursive stack is complete.

#### Resolve undo

A conflict is represented in the index as a set of higher stage entries.
When a conflict is resolved (e.g. with "git add path"),
these higher stage entries will be removed and a stage-0 entry with proper resolution is added.

When these higher stage entries are removed, they are saved in the resolve undo extension,
so that conflicts can be recreated (e.g. with "git checkout -m"),
in case users want to redo a conflict resolution from scratch.

The signature for this extension is { 'R', 'E', 'U', 'C' }.

A series of entries fill the entire extension; each of which consists of:

- NUL-terminated pathname the entry describes (relative to the root of the repository, i.e. full pathname);

- Three NUL-terminated ASCII octal numbers, entry mode of entries in
  stage 1 to 3 (a missing stage is represented by "0" in this field);
  and

- At most three object names of the entry in stages from 1 to 3
  (nothing is written for a missing stage).

#### Split index

In split index mode, the majority of index entries could be stored in a separate file.
This extension records the changes to be made on top of that to produce the final index.

The signature for this extension is { 'l', 'i', 'n', 'k' }.

The extension consists of:

- Hash of the shared index file. The shared index file path
  is $GIT_DIR/sharedindex.<hash>. If all bits are zero, the
  index does not require a shared index file.

- An ewah-encoded delete bitmap, each bit represents an entry in the
  shared index. If a bit is set, its corresponding entry in the
  shared index will be removed from the final index.  Note, because
  a delete operation changes index entry positions, but we do need
  original positions in replace phase, it's best to just mark
  entries for removal, then do a mass deletion after replacement.

- An ewah-encoded replace bitmap, each bit represents an entry in
  the shared index. If a bit is set, its corresponding entry in the
  shared index will be replaced with an entry in this index
  file. All replaced entries are stored in sorted order in this
  index. The first "1" bit in the replace bitmap corresponds to the
  first index entry, the second "1" bit to the second entry and so
  on. Replaced entries may have empty path names to save space.

The remaining index entries after replaced ones will be added to the final index.
These added entries are also sorted by entry name then stage.

## Reference

- [Git index format](https://github.com/git/git/blob/master/Documentation/technical/index-format.txt)
