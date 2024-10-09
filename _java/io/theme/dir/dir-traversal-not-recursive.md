---
title: "文件夹遍历（非递归）"
sequence: "101"
---

[UP](/java/java-io-index.html)


## 概览

```text
                                       ┌─── immediate ───┼─── Files.newDirectoryStream()
                 ┌─── not.recursive ───┤
                 │                     └─── lazy ────────┼─── Files.list()
dir.traversal ───┤
                 │                     ┌─── immediate ───┼─── Files.walkFileTree()
                 └─── recursive ───────┤
                                       │                 ┌─── Files.walk()
                                       └─── lazy ────────┤
                                                         └─── Files.find()
```

## 示例

### Files.newDirectoryStream

#### 所有文件

```java
import java.io.IOException;
import java.nio.file.DirectoryStream;
import java.nio.file.Files;
import java.nio.file.Path;

public class DirectoryList {
    public static void main(String[] args) throws IOException {
        Path path = Path.of("D:/git-repo/learn-java-io");
        DirectoryStream<Path> ds = Files.newDirectoryStream(path);
        for (Path p : ds) {
            System.out.println(p);
        }
        ds.close();
    }
}
```

```text
D:\git-repo\learn-java-io\.git
D:\git-repo\learn-java-io\.gitignore
D:\git-repo\learn-java-io\.idea
D:\git-repo\learn-java-io\LICENSE
D:\git-repo\learn-java-io\pom.xml
D:\git-repo\learn-java-io\README.md
D:\git-repo\learn-java-io\src
D:\git-repo\learn-java-io\target
```

#### 过滤：filter

```java
import java.io.IOException;
import java.nio.file.DirectoryStream;
import java.nio.file.Files;
import java.nio.file.Path;

public class DirectoryList {
    public static void main(String[] args) throws IOException {
        Path path = Path.of("D:/git-repo/learn-java-io");
        DirectoryStream.Filter<Path> filter = new DirectoryStream.Filter<Path>() {
            @Override
            public boolean accept(Path entry) throws IOException {
                return entry.toString().endsWith(".md");
            }
        };
        DirectoryStream<Path> ds = Files.newDirectoryStream(path, filter);
        for (Path p : ds) {
            System.out.println(p);
        }
        ds.close();
    }
}
```

```text
D:\git-repo\learn-java-io\README.md
```

#### 过滤：glob

a globbing pattern (a simple regular expression-type pattern)

```java
import java.io.IOException;
import java.nio.file.DirectoryStream;
import java.nio.file.Files;
import java.nio.file.Path;

public class DirectoryList {
    public static void main(String[] args) throws IOException {
        Path path = Path.of("D:/git-repo/learn-java-io");
        DirectoryStream<Path> ds = Files.newDirectoryStream(path, "*.md");
        for (Path p : ds) {
            System.out.println(p);
        }
        ds.close();
    }
}
```

```text
D:\git-repo\learn-java-io\README.md
```
