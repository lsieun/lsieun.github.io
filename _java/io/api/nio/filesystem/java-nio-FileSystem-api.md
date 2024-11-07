---
title: "FileSystem"
sequence: "101"
---

[UP](/java/java-io-index.html)


## 概览

### 操作系统

An **operating system** can host one or more **file systems**.

```text
OS 与 file system 的关系是一对多
```

### 文件系统

```text
                             ┌─── regular files
                             │
file system ───┼─── files ───┼─── directories
                             │
                             │                     ┌─── soft/symbolic links
                             └─── link ────────────┤
                                                   └─── hard links
```

## API

![](/assets/images/java/io/filesystem-and-provider.png)

### FileSystem

```text
              ┌─── provider ───────┼─── provider()
              │
              │                                     ┌─── isOpen()
              │                    ┌─── resource ───┤
              ├─── itself.state ───┤                └─── close()
              │                    │
              │                    └─── writable ───┼─── isReadOnly()
              │
FileSystem ───┤                                                      ┌─── getFileStores()
              │                                   ┌─── file.store ───┤
              │                                   │                  └─── getRootDirectories()
              │                    ┌─── step.1 ───┤
              │                    │              │                  ┌─── getSeparator()
              │                    │              │                  │
              │                    │              └─── path ─────────┼─── getPath()
              │                    │                                 │
              └─── container ──────┤                                 └─── getPathMatcher()
                                   │
                                   ├─── step.2 ───┼─── attribute ───┼─── supportedFileAttributeViews()
                                   │
                                   │                              ┌─── getUserPrincipalLookupService()
                                   └─── step.3 ───┼─── service ───┤
                                                                  └─── newWatchService()
```

- 第 1 步，存储主体信息：有一个硬盘（file store），设计一种文件的唯一标识（文件路径，path），对信息进行存储。
- 第 2 步，存储附属信息：文件的创建者信息、时间信息（创建时间、修改时间）
- 第 3 步，与“外界”交互的服务：`UserPrincipalLookupService` 是外部提供的服务，这样内部的文件可以记录用户的信息；
  `WatchService` 是 FileSystem 内部提供的服务，让运行在进程里的程序（外部）感知到文件的变化。

### FileSystems

```text
               ┌─── getDefault()
               │
               ├─── getFileSystem(URI uri)
FileSystems ───┤
               │                              ┌─── uri/path
               │                              │
               └─── newFileSystem() ──────────┼─── env
                                              │
                                              └─── classloader
```

### FileSystemProvider

```text
                      ┌─── static ───────┼─── installedProviders()
                      │
                      │                  ┌─── provider ─────┼─── getScheme()
                      │                  │
                      │                  │                  ┌─── getFileSystem()
                      │                  ├─── filesystem ───┤
                      │                  │                  └─── newFileSystem()
                      │                  │
                      │                  │                  ┌─── getFileStore()
                      │                  ├─── filestore ────┤
                      │                  │                  └─── getPath()
                      │                  │
FileSystemProvider ───┤                  │                  ┌─── copy()
                      │                  │                  │
                      │                  │                  ├─── move()
                      │                  │                  │
                      │                  │                  │              ┌─── delete()
                      │                  ├─── path ─────────┼─── delete ───┤
                      │                  │                  │              └─── deleteIfExists()
                      │                  │                  │
                      │                  │                  │              ┌─── checkAccess()
                      │                  │                  │              │
                      │                  │                  └─── check ────┼─── isHidden()
                      │                  │                                 │
                      │                  │                                 └─── isSameFile()
                      └─── non-static ───┤
                                         │                  ┌─── createDirectory()
                                         ├─── dir ──────────┤
                                         │                  └─── newDirectoryStream()
                                         │
                                         │                                                              ┌─── newInputStream()
                                         │                                    ┌─── classic.io.stream ───┤
                                         │                                    │                         └─── newOutputStream()
                                         │                  ┌─── content ─────┤
                                         │                  │                 │                         ┌─── newByteChannel()
                                         │                  │                 │                         │
                                         │                  │                 └─── channel ─────────────┼─── newFileChannel()
                                         ├─── file ─────────┤                                           │
                                         │                  │                                           └─── newAsynchronousFileChannel()
                                         │                  │
                                         │                  │                 ┌─── getFileAttributeView()
                                         │                  │                 │
                                         │                  └─── attribute ───┼─── readAttributes()
                                         │                                    │
                                         │                                    └─── setAttribute()
                                         │
                                         │                  ┌─── createLink()
                                         │                  │
                                         └─── link ─────────┼─── createSymbolicLink()
                                                            │
                                                            └─── readSymbolicLink()
```
