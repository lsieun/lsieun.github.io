---
title: "Files"
sequence: "103"
---

[UP](/java/java-io-index.html)


```text
              ┌─── file.store ───┼─── getFileStore()
              │
              │                                                                 ┌─── delete()
              │                                      ┌─── one ───┼─── delete ───┤
              │                                      │                          └─── deleteIfExists()
              │                                      │
              │                  ┌─── common ────────┤                           ┌─── isSameFile()
              │                  │                   │           ┌─── compare ───┤
              │                  │                   │           │               └─── mismatch()   JDK12
              │                  │                   └─── two ───┤
              │                  │                               ├─── copy ──────┼─── copy()
              │                  │                               │
              │                  │                               └─── move ──────┼─── move()
              │                  │
              │                  │                   ┌─── create ────┼─── createFile()
              │                  │                   │
              │                  │                   │               ┌─── type ────────────┼─── probeContentType()
              │                  │                   │               │
              │                  │                   │               │                     ┌─── byte[] ───┼─── readAllBytes()
              │                  │                   │               │                     │
              │                  │                   │               ├─── read ────────────┼─── text ─────┼─── readString()
              │                  ├─── file ──────────┤               │                     │
              │                  │                   │               │                     │              ┌─── readAllLines()
              │                  │                   │               │                     └─── lines ────┤
              │                  │                   │               │                                    └─── lines(): LAZY
              │                  │                   │               │
              │                  │                   │               │                                           ┌─── byte[]
              │                  │                   │               │                     ┌─── write() ─────────┤
              │                  │                   └─── content ───┼─── write ───────────┤                     └─── lines
              │                  │                                   │                     │
              │                  │                                   │                     └─── writeString() ───┼─── text
              │                  │                                   │
              │                  │                                   │                     ┌─── newInputStream()
              │                  │                                   ├─── in/out ──────────┤
              │                  │                                   │                     └─── newOutputStream()
              │                  │                                   │
              │                  │                                   │                     ┌─── newBufferedReader()
              │                  │                                   ├─── reader/writer ───┤
              │                  │                                   │                     └─── newBufferedWriter()
              │                  │                                   │
              │                  │                                   └─── channel ─────────┼─── newByteChannel()
              │                  │
              │                  │                                     ┌─── createDirectory()
              ├─── path ─────────┤                   ┌─── create ──────┤
              │                  │                   │                 └─── createDirectories()
              │                  │                   │
              │                  │                   │                                                                    ┌─── Path
              │                  │                   │                                       ┌─── newDirectoryStream() ───┤
              │                  │                   │                 ┌─── not.recursive ───┤                            └─── filter: DirectoryStream.Filter<? super Path>
              │                  ├─── directories ───┤                 │                     │
              │                  │                   │                 │                     └─── list(): LAZY ───────────┼─── Path
Files::api ───┤                  │                   │                 │
              │                  │                   │                 │                                            ┌─── Path
              │                  │                   │                 │                                            │
              │                  │                   │                 │                                            ├─── Set<FileVisitOption>
              │                  │                   └─── traversal ───┤                     ┌─── walkFileTree() ───┤
              │                  │                                     │                     │                      ├─── maxDepth
              │                  │                                     │                     │                      │
              │                  │                                     │                     │                      └─── FileVisitor<? super Path>
              │                  │                                     │                     │
              │                  │                                     │                     │                      ┌─── Path
              │                  │                                     │                     │                      │
              │                  │                                     └─── recursive ───────┼─── walk(): LAZY ─────┼─── maxDepth
              │                  │                                                           │                      │
              │                  │                                                           │                      └─── FileVisitOption
              │                  │                                                           │
              │                  │                                                           │                      ┌─── Path
              │                  │                                                           │                      │
              │                  │                                                           │                      ├─── maxDepth
              │                  │                                                           └─── find(): LAZY ─────┤
              │                  │                                                                                  ├─── matcher: BiPredicate<Path, BasicFileAttributes>
              │                  │                                                                                  │
              │                  │                                                                                  └─── FileVisitOption
              │                  │
              │                  │                                ┌─── createSymbolicLink()
              │                  │                   ┌─── soft ───┤
              │                  ├─── link ──────────┤            └─── readSymbolicLink()
              │                  │                   │
              │                  │                   └─── hard ───┼─── createLink()
              │                  │
              │                  │                   ┌─── createTempFile()
              │                  └─── temp ──────────┤
              │                                      └─── createTempDirectory()
              │
              │                                     ┌─── exists()
              │                  ┌─── exists ───────┤
              │                  │                  └─── notExists()
              │                  │
              │                  ├─── visibility ───┼─── isHidden()
              │                  │
              │                  │                  ┌─── isRegularFile()
              │                  │                  │
              │                  ├─── type ─────────┼─── isDirectory()
              │                  │                  │
              │                  │                  └─── isSymbolicLink()
              │                  │
              │                  ├─── space ────────┼─── size()
              │                  │
              │                  │                  ┌─── getLastModifiedTime()
              │                  ├─── time ─────────┤
              │                  │                  └─── setLastModifiedTime()
              │                  │
              └─── attribute ────┤                  ┌─── getOwner()
                                 ├─── owner ────────┤
                                 │                  └─── setOwner()
                                 │
                                 │                  ┌─── isAccessible()
                                 │                  │
                                 │                  ├─── isReadable()
                                 │                  │
                                 │                  ├─── isWritable()
                                 ├─── permission ───┤
                                 │                  ├─── isExecutable()
                                 │                  │
                                 │                  ├─── getPosixFilePermissions()
                                 │                  │
                                 │                  └─── setPosixFilePermissions()
                                 │
                                 │                  ┌─── view ───┼─── getFileAttributeView()
                                 │                  │
                                 └─── advanced ─────┼─── many ───┼─── readAttributes()
                                                    │
                                                    │            ┌─── setAttribute()
                                                    └─── one ────┤
                                                                 └─── getAttribute()
```

```text
                                                                                    ┌─── APPEND
                                                                                    │
                                                                                    ├─── CREATE
                                                                                    │
                                                                                    ├─── CREATE_NEW
                                                                                    │
                                                                                    ├─── DELETE_ON_CLOSE
                                                                                    │
                                                                                    ├─── DSYNC
                                      ┌─── OpenOption ───┼─── StandardOpenOption ───┤
                                      │                                             ├─── READ
                                      │                                             │
                                      │                                             ├─── SPARSE
                                      │                                             │
               ┌─── open.or.create ───┤                                             ├─── SYNC
               │                      │                                             │
               │                      │                                             ├─── TRUNCATE_EXISTING
               │                      │                                             │
               │                      │                                             └─── WRITE
               │                      │
               │                      └─── LinkOption ───┼─── NOFOLLOW_LINKS
               │
file.option ───┤                                                                    ┌─── REPLACE_EXISTING
               │                                                                    │
               │                      ┌─── CopyOption ───┼─── StandardCopyOption ───┼─── COPY_ATTRIBUTES
               │                      │                                             │
               ├─── copy.or.move ─────┤                                             └─── ATOMIC_MOVE
               │                      │
               │                      └─── LinkOption ───┼─── NOFOLLOW_LINKS
               │
               └─── traversal ────────┼─── FileVisitOption ───┼─── FOLLOW_LINKS
```

```text
                                                            ┌─── newInputStream()
                                         ┌─── i/o stream ───┤
                                         │                  └─── newOutputStream()
                                         │
                 ┌─── OpenOption ────────┼─── writer ───────┼─── newBufferedWriter()
                 │                       │
                 │                       ├─── channel ──────┼─── newByteChannel()
                 │                       │
                 │                       └─── path ─────────┼─── write()
                 │
                 │                       ┌─── copy()
                 ├─── CopyOption ────────┤
                 │                       └─── move()
                 │
                 │                                                       ┌─── exists()
                 │                                         ┌─── exist ───┤
                 │                                         │             └─── notExists()
                 │                       ┌─── check ───────┤
                 │                       │                 │             ┌─── isRegularFile()
                 │                       │                 └─── type ────┤
Files::option ───┤                       │                               └─── isDirectory()
                 │                       │
                 │                       │                                    ┌─── getFileAttributeView()
                 ├─── LinkOption ────────┤                                    │
                 │                       │                                    ├─── readAttributes()
                 │                       │                 ┌─── basic ────────┤
                 │                       │                 │                  ├─── getAttribute()
                 │                       │                 │                  │
                 │                       │                 │                  └─── setAttribute()
                 │                       └─── attribute ───┤
                 │                                         ├─── time ─────────┼─── getLastModifiedTime()
                 │                                         │
                 │                                         ├─── owner ────────┼─── getOwner()
                 │                                         │
                 │                                         └─── permission ───┼─── getPosixFilePermissions()
                 │
                 │                       ┌─── find()
                 └─── FileVisitOption ───┤
                                         └─── walk()
```
