---
title: "AttributeView"
sequence: "101"
---

[UP](/java/java-io-index.html)


## 思维导图

```text
                                                                                     ┌─── DosFileAttributeView
                                                                                     │
                                                                                     ├─── JrtFileAttributeView
                                                ┌─── BasicFileAttributeView ─────────┤
                                                │                                    ├─── PosixFileAttributeView
                                                │                                    │
                                                │                                    └─── ZipFileAttributeView
                 ┌─── FileAttributeView ────────┤
                 │                              │                                    ┌─── AclFileAttributeView
                 │                              ├─── FileOwnerAttributeView ─────────┤
AttributeView ───┤                              │                                    └─── PosixFileAttributeView
                 │                              │
                 │                              └─── UserDefinedFileAttributeView
                 │
                 └─── FileStoreAttributeView
```

```text
                                                                                     ┌─── readAttributes()
                                                ┌─── BasicFileAttributeView ─────────┤
                                                │                                    └─── setTimes(lastModifiedTime, lastAccessTime, createTime)
                                                │
                                                │                                    ┌─── getOwner()
                                                ├─── FileOwnerAttributeView ─────────┤
                 ┌─── FileAttributeView ────────┤                                    └─── setOwner()
                 │                              │
                 │                              │                                    ┌─── list()
                 │                              │                                    │
                 │                              │                                    ├─── size()
                 │                              │                                    │
AttributeView ───┤                              └─── UserDefinedFileAttributeView ───┼─── read()
                 │                                                                   │
                 │                                                                   ├─── write()
                 │                                                                   │
                 │                                                                   └─── delete()
                 │
                 └─── FileStoreAttributeView
```



```text
                                          ┌─── from(long, TimeUnit)
                                          │
            ┌─── static ─────┼─── from ───┼─── fromMillis()
            │                             │
            │                             └─── from(Instant)
FileTime ───┤
            │                           ┌─── to(TimeUnit)
            │                           │
            └─── instance ───┼─── to ───┼─── toMillis()
                                        │
                                        └─── toInstant()
```
