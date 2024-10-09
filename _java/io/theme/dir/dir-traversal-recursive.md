---
title: "文件夹遍历（递归）"
sequence: "102"
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

### Files.walkFileTree

```text
Files.walkFileTree(Path, FileVisitor)
```

```text
tmp
├─── abc.txt
├─── subdir
│    └─── README.txt
└─── xyz.dat
```

```java
import java.io.IOException;
import java.nio.file.FileVisitResult;
import java.nio.file.Path;
import java.nio.file.SimpleFileVisitor;
import java.nio.file.attribute.BasicFileAttributes;

public class DoNothingVisitor extends SimpleFileVisitor<Path> {

    private static final String INDENT = "    ";
    private int count = 0;

    @Override
    public FileVisitResult preVisitDirectory(Path dir, BasicFileAttributes attrs) throws IOException {
        String info = String.format("%s%s: %s", INDENT.repeat(count), "preVisitDirectory", dir);
        System.out.println(info);
        count++;

        return super.preVisitDirectory(dir, attrs);
    }

    @Override
    public FileVisitResult visitFile(Path file, BasicFileAttributes attrs) throws IOException {
        String info = String.format("%s%s: %s", INDENT.repeat(count), "visitFile", file);
        System.out.println(info);

        return super.visitFile(file, attrs);
    }


    @Override
    public FileVisitResult visitFileFailed(Path file, IOException ioe) throws IOException {
        String info = String.format("%s%s: %s", INDENT.repeat(count), "visitFileFailed", file);
        System.out.println(info);

        return super.visitFileFailed(file, ioe);
    }

    @Override
    public FileVisitResult postVisitDirectory(Path dir, IOException ioe) throws IOException {
        count--;
        String info = String.format("%s%s: %s", INDENT.repeat(count), "postVisitDirectory", dir);
        System.out.println(info);

        return super.postVisitDirectory(dir, ioe);
    }
}
```

```java
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;

public class FileTree_A_WalkFileTree {
    public static void main(String[] args) throws IOException {
        Path path = Path.of("D:/tmp/");
        Files.walkFileTree(path, new DoNothingVisitor());
    }
}
```

```java
preVisitDirectory: D:\tmp
    visitFile: D:\tmp\abc.txt
    preVisitDirectory: D:\tmp\subdir
        visitFile: D:\tmp\subdir\README.txt
    postVisitDirectory: D:\tmp\subdir
    visitFile: D:\tmp\xyz.dat
postVisitDirectory: D:\tmp
```

### Files.walk

```java
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;
import java.util.stream.Stream;

public class FileTree_B_Walk {
    public static void main(String[] args) {
        // dir
        Path dirPath = Path.of(".");

        // walk
        try (Stream<Path> stream = Files.walk(dirPath, Integer.MAX_VALUE)) {
            List<Path> entries = stream.toList();
            for (Path entry : entries) {
                System.out.println(entry);
            }
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }
}
```

### Files.find

```java
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.attribute.BasicFileAttributes;
import java.util.List;
import java.util.function.BiPredicate;
import java.util.stream.Stream;

public class FileTree_C_Find {
    public static void main(String[] args) {
        // dir
        Path dirPath = Path.of(".");
        String ext = ".java";

        // predicate
        BiPredicate<Path, BasicFileAttributes> predicate = (path, attrs) ->
                attrs.isRegularFile() && path.getFileName().toString().endsWith(ext);

        // find
        try (Stream<Path> stream = Files.find(dirPath, Integer.MAX_VALUE, predicate)) {
            List<Path> entries = stream.toList();
            for (Path entry : entries) {
                System.out.println(entry);
            }
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }
}
```
