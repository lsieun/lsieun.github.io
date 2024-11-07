---
title: "Hard Links"
sequence: "102"
---

[UP](/java/java-io-index.html)


## 概览

A **hard link** is a directory entry that associates a name with a file on a file system.
It's basically the same entity as the original file.
All attributes are identical: they have the same file permissions, timestamps, and so on.

![](/assets/images/java/io/soft-link.png)

![](/assets/images/java/io/hard-link.png)

The upper half of each diagram shows the **user perception** of
a soft link or a hard link as an alias for some file.
However, the bottom part shows what is really happening.

For a **soft link**, the file points to an inode and the soft link points to another inode.
The soft link inode references the file inode, which points to the data on the file store.

For a **hard link**, both the file and the hard link point to the file inode,
which points to the data on the file store.

Hard links are more restrictive than soft links:

- The target of the link must exist.
- Hard links are generally not allowed on directories. (HardLink，只针对『文件』，不能对『文件夹』)
- Hard links are not allowed to cross partitions or volumes. In other words, they cannot exist across file systems.
- A hard link looks and behaves like a normal file and so can be hard to find.

## 示例

```java
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;

public class HardLink {
    public static void main(String[] args) throws IOException {
        // prepare
        Path linkPath = Path.of(".", "myHardLink");
        Path targetPath = Path.of("D:/tmp/abc.txt");

        // create
        Path symbolicLink = Files.createLink(linkPath, targetPath);
        Path symbolicLinkAbs = symbolicLink.toAbsolutePath().normalize();

        // read
        boolean isSymbolic = Files.isSymbolicLink(symbolicLink);

        // print
        String[][] matrix = {
                {"linkPath", String.valueOf(linkPath)},
                {"targetPath", String.valueOf(targetPath)},
                {"symbolicLink", String.valueOf(symbolicLink)},
                {"symbolicLinkAbs", String.valueOf(symbolicLinkAbs)},
                {"isSymbolic", String.valueOf(isSymbolic)},
        };
        TableUtils.printTable(matrix, TableType.ONE_LINE);
    }
}
```

```text
D:\git-repo\learn-java-io\target\classes>
┌─────────────────┬─────────────────────────────────────────────────────┐
│    linkPath     │                    .\myHardLink                     │
├─────────────────┼─────────────────────────────────────────────────────┤
│   targetPath    │                   D:\tmp\abc.txt                    │
├─────────────────┼─────────────────────────────────────────────────────┤
│  symbolicLink   │                    .\myHardLink                     │
├─────────────────┼─────────────────────────────────────────────────────┤
│ symbolicLinkAbs │ D:\git-repo\learn-java-io\target\classes\myHardLink │
├─────────────────┼─────────────────────────────────────────────────────┤
│   isSymbolic    │                        false                        │
└─────────────────┴─────────────────────────────────────────────────────┘
```
