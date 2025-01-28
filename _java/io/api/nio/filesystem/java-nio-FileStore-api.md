---
title: "FileStore"
sequence: "102"
---

```text
                               ┌─── name()
             ┌─── basic ───────┤
             │                 └─── type()
             │
             ├─── state ───────┼─── isReadOnly()
             │
             │                               ┌─── getTotalSpace()
             │                               │
FileStore ───┤                 ┌─── space ───┼─── getUsableSpace()
             │                 │             │
             ├─── disk ────────┤             └─── getUnallocatedSpace()
             │                 │
             │                 └─── block ───┼─── getBlockSize()
             │
             │                 ┌─── supportsFileAttributeView()
             │                 │
             └─── attribute ───┼─── getFileStoreAttributeView()
                               │
                               └─── getAttribute()
```
