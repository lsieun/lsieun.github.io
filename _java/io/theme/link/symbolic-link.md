---
title: "Symbolic Links"
sequence: "101"
---

[UP](/java/java-io-index.html)


## 概览

A **symbolic link** (**soft link** or **symlink**) is a special file that references another file.

Symbolic links are typically invisible to applications;
operations on symbolic links are automatically redirected to the link's target
(the file or directory being pointed to).

```text
                              ┌─── createLink()
               ┌─── create ───┤
               │              └─── createSymbolicLink()
Files::link ───┤
               ├─── read ─────┼─── readSymbolicLink()
               │
               └─── check ────┼─── isSymbolicLink()
```

## 示例

### 相对路径

```java
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;

public class LinkSoft_01_Relative {
    public static void main(String[] args) throws IOException {
        // prepare
        Path linkPath = Path.of(".", "myLinkSoftRelative");
        Path targetPath = Path.of("src/main/abc.txt");

        // create
        Path symbolicLink = Files.createSymbolicLink(linkPath, targetPath);
        Path symbolicLinkAbs = symbolicLink.toAbsolutePath().normalize();

        // read
        boolean isSymbolic = Files.isSymbolicLink(symbolicLink);
        Path redirectedPath = Files.readSymbolicLink(symbolicLink);
        Path redirectedPathAbs = redirectedPath.toAbsolutePath().normalize();

        // print
        String[][] matrix = {
                {"linkPath", String.valueOf(linkPath)},
                {"targetPath", String.valueOf(targetPath)},
                {"symbolicLink", String.valueOf(symbolicLink)},
                {"symbolicLinkAbs", String.valueOf(symbolicLinkAbs)},
                {"isSymbolic", String.valueOf(isSymbolic)},
                {"redirectedPath", String.valueOf(redirectedPath)},
                {"redirectedPathAbs", String.valueOf(redirectedPathAbs)},
        };
        TableUtils.printTable(matrix, TableType.ONE_LINE);
    }
}
```

直接运行，会遇到错误：

```text
A required privilege is not held by the client
```

需要用『管理员身份』打开 CMD，然后运行

```text
D:\git-repo\learn-java-io\target\classes>
┌───────────────────┬─────────────────────────────────────────────────────────────┐
│     linkPath      │                    .\myLinkSoftRelative                     │
├───────────────────┼─────────────────────────────────────────────────────────────┤
│    targetPath     │                      src\main\abc.txt                       │
├───────────────────┼─────────────────────────────────────────────────────────────┤
│   symbolicLink    │                    .\myLinkSoftRelative                     │
├───────────────────┼─────────────────────────────────────────────────────────────┤
│  symbolicLinkAbs  │ D:\git-repo\learn-java-io\target\classes\myLinkSoftRelative │
├───────────────────┼─────────────────────────────────────────────────────────────┤
│    isSymbolic     │                            true                             │
├───────────────────┼─────────────────────────────────────────────────────────────┤
│  redirectedPath   │                      src\main\abc.txt                       │
├───────────────────┼─────────────────────────────────────────────────────────────┤
│ redirectedPathAbs │  D:\git-repo\learn-java-io\target\classes\src\main\abc.txt  │
└───────────────────┴─────────────────────────────────────────────────────────────┘
```

### 绝对路径

```java
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;

public class LinkSoft_02_Absolute {
    public static void main(String[] args) throws IOException {
        // prepare
        Path linkPath = Path.of(".", "myLinkSoftAbsolute");
        Path targetPath = Path.of("D:/tmp/");

        // create
        Path symbolicLink = Files.createSymbolicLink(linkPath, targetPath);
        Path symbolicLinkAbs = symbolicLink.toAbsolutePath().normalize();

        // read
        boolean isSymbolic = Files.isSymbolicLink(symbolicLink);
        Path redirectedPath = Files.readSymbolicLink(symbolicLink);
        Path redirectedPathAbs = redirectedPath.toAbsolutePath().normalize();

        // print
        String[][] matrix = {
                {"linkPath", String.valueOf(linkPath)},
                {"targetPath", String.valueOf(targetPath)},
                {"symbolicLink", String.valueOf(symbolicLink)},
                {"symbolicLinkAbs", String.valueOf(symbolicLinkAbs)},
                {"isSymbolic", String.valueOf(isSymbolic)},
                {"redirectedPath", String.valueOf(redirectedPath)},
                {"redirectedPathAbs", String.valueOf(redirectedPathAbs)},
        };
        TableUtils.printTable(matrix, TableType.ONE_LINE);
    }
}
```

```text
D:\git-repo\learn-java-io\target\classes>
┌───────────────────┬─────────────────────────────────────────────────────────────┐
│     linkPath      │                    .\myLinkSoftAbsolute                     │
├───────────────────┼─────────────────────────────────────────────────────────────┤
│    targetPath     │                           D:\tmp                            │
├───────────────────┼─────────────────────────────────────────────────────────────┤
│   symbolicLink    │                    .\myLinkSoftAbsolute                     │
├───────────────────┼─────────────────────────────────────────────────────────────┤
│  symbolicLinkAbs  │ D:\git-repo\learn-java-io\target\classes\myLinkSoftAbsolute │
├───────────────────┼─────────────────────────────────────────────────────────────┤
│    isSymbolic     │                            true                             │
├───────────────────┼─────────────────────────────────────────────────────────────┤
│  redirectedPath   │                           D:\tmp                            │
├───────────────────┼─────────────────────────────────────────────────────────────┤
│ redirectedPathAbs │                           D:\tmp                            │
└───────────────────┴─────────────────────────────────────────────────────────────┘
```
