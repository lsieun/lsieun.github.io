---
title: "The NIO File API"
sequence: "101"
---

[UP](/java-nio.html)


The new NIO File API, introduced with Java 7,
can be thought of as either a replacement for or a complement to the classic API.
Included in the NIO package, the new API is nominally part of an effort to **move Java toward a higher performance** and
**more flexible** style of I/O supporting **selectable** and asynchronously interruptable **channels**.
However, in the context of working with files, the new API's strength is that it provides a fuller abstraction of the filesystem in Java.

In addition to better support for existing, real world, filesystem types—
including for the first time the ability to copy and move files, manage links,
and get detailed file attributes like owners and permissions—
the new File API allows entirely new types of filesystems to be implemented directly in Java.
The best example of this is the new ZIP filesystem provider
that makes it possible to “mount” a ZIP archive file as a filesystem
and work with the files within it directly using the standard APIs, just like any other filesystem.
Additionally, the NIO File package provides some utilities
that would have saved Java developers a lot of repeated code over the years,
including directory tree change monitoring, filesystem traversal (a visitor pattern),
filename “globbing,” and convenience methods to read entire files directly into memory.

We'll cover the **basic File API** in this section and return to the **NIO API** again
at the end of the chapter when we cover the full details of NIO buffers and channels.
In particular, we'll talk about `ByteChannels` and `FileChannel`,
which you can think of as alternate, buffer-oriented streams for reading and writing files and other types of data.

## FileSystem and Path

The main players in the `java.nio.file` package are: the `FileSystem`,
which represents an underlying storage mechanism and serves as a factory for `Path` objects;
the `Path`, which represents a file or directory within the filesystem;
and the `Files` utility, which contains a rich set of static methods for
manipulating `Path` objects to perform all of the basic file operations analogous to the classic API.

The `FileSystems` (plural) class is our starting point. It is a factory for a `FileSystem` object:

```text
// The default host computer filesystem
FileSystem fs = FileSystems.getDefault();

// A custom filesystem
// Windows
URI zipURI = URI.create("jar:file:///D:/tmp/MyArchive.zip");
// Linux
//URI zipURI = URI.create("jar:file:/Users/pat/tmp/MyArchive.zip");
FileSystem zipfs = FileSystems.newFileSystem(zipURI, env));
```

As shown in this snippet, often we'll simply ask for the default filesystem to manipulate files in the host computer's environment,
as with the classic API.
But the `FileSystems` class can also construct a `FileSystem` by taking a `URI` (a special identifier)
that references a custom filesystem type.

`FileSystem` implements `Closeable` and when a `FileSystem` is closed,
all open file channels and other streaming objects associated with it are closed as well.
Attempting to read or write to those channels will throw an exception at that point.
Note that the **default filesystem** (associated with the host computer) cannot be closed.

```java
public abstract class FileSystem implements Closeable {
    // ...
}
```

Once we have a `FileSystem`, we can use it as a factory for `Path` objects that represent files or directories.
A `Path` can be constructed using a string representation just like the classic `File`,
and subsequently used with methods of the `Files` utility to create, read, write, or delete the item.

```text
Path fooPath = fs.getPath("/tmp/foo.txt");
OutputStream out = Files.newOutputStream(fooPath);
```

By default, if the file does not exist, it will be created and if it does exist,
it will be truncated (set to zero length)
before new data is written—but you can change these results using options.
