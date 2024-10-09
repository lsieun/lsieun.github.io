---
title: "FileVisitor"
sequence: "104"
---

[UP](/java/java-io-index.html)


```text
                           ┌─── preVisitDirectory()
                           │
                           │                            ┌─── visitFile()
FileVisitor ───┼─── dir ───┼─── file ───────────────────┤
                           │                            └─── visitFileFailed()
                           │
                           └─── postVisitDirectory()
```

```text
                                                  ┌─── preVisitDirectory()
                                                  │
                                                  │                            ┌─── visitFile()
                  ┌─── FileVisitor ───┼─── dir ───┼─── file ───────────────────┤
                  │                               │                            └─── visitFileFailed()
                  │                               │
                  │                               └─── postVisitDirectory()
file.tree.walk ───┤
                  │                                          ┌─── Path
                  │                                          │
                  │                                          ├─── FileVisitOption:FOLLOW_LINKS
                  └─── Files ─────────┼─── walkFileTree() ───┤
                                                             ├─── maxDepth
                                                             │
                                                             └─── FileVisitor<? super Path>
```
