---
title: "java.nio.file.Path"
sequence: "102"
---

[UP](/java-nio.html)


## Intro

The `Path` object implements the `java.lang.Iterable` interface,
which can be used to iterate through its literal path components
(e.g., the slash separated “tmp” and “foo.txt” in the preceding snippet).
Although if you want to traverse the path to find other files or directories,
you might be more interested in the `DirectoryStream` and `FileVisitor`.
`Path` also implements the `java.nio.file.Watchable` interface,
which allows it to be monitored for changes.

```java
public interface Path extends Comparable<Path>, Iterable<Path>, Watchable {
    // ... 
}
```

## Relative Path

`Path` has convenience methods for resolving paths relative to a file or directory.

```text
Path patPath = fs.getPath("/User/pat/");
Path patTmp = patPath.resolve("tmp"); // "/User/pat/tmp"

// Same as above, using a Path
Path tmpPath = fs.getPath("tmp");
Path patTmp = patPath.resolve( tmpPath ); // "/User/pat/tmp"

// Resolving a given absolute path against any path just yields given path
Path absPath = patPath.resolve("/tmp"); // "/tmp"

// Resolve sibling to Pat (same parent)
Path danPath = patPath.resolveSibling("dan"); // "/Users/dan"
```

In this snippet, we've shown the `Path.resolve()` and `Path.resolveSibling()` methods
used to find files or directories relative to a given `Path` object.

The `resolve()` method is generally used to append a relative path to an existing `Path` representing a directory.
If the argument provided to the `resolve()` method is an absolute path,
it will just yield the absolute path (it acts kind of like the Unix or DOS “cd” command).

The `resolveSibling()` method works the same way,
but it is relative to the parent of the target `Path`;
this method is useful for describing the target of a `move()` operation.

## Path to classic file and back

To bridge the old and new APIs, corresponding `toPath()` and `toFile()` methods have been provided
in `java.io.File` and `java.nio.file.Path`, respectively, to convert to the other form.
Of course, the only types of `Path`s that can be produced from `File` are paths
representing **files** and **directories** in the **default host filesystem**.

```text
Path tmpPath = fs.getPath("/tmp");
File file = tmpPath.toFile();

File tmpFile = new File("/tmp");
Path path = tmpFile.toPath();
```
