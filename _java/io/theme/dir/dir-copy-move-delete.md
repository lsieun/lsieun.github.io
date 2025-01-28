---
title: "文件夹递归：复制、移动、删除"
sequence: "103"
---

[UP](/java/java-io-index.html)


## 概览

The `Files` class's `copy()`, `move()`, and `delete()` methods copy, move, and
delete a single file instead of multiple objects.

When combined with NIO.2's File Tree-Walking API,
you can use these methods to copy, move, and delete hierarchies of files.

```text
                                                      ┌─── Path
                                                      │
                                                      ├─── Set<FileVisitOption>
                         ┌─── Files.walkFileTree() ───┤
                         │                            ├─── maxDepth
                         │                            │
                         │                            └─── FileVisitor<? super Path>
File Tree-Walking API ───┤
                         │                                        ┌─── preVisitDirectory()
                         │                                        │
                         │                                        │                            ┌─── visitFile()
                         └─── FileVisitor ────────────┼─── dir ───┼─── file ───────────────────┤
                                                                  │                            └─── visitFileFailed()
                                                                  │
                                                                  └─── postVisitDirectory()
```

## 编码实现

### DirBuddy

```java
import java.io.IOException;
import java.nio.file.FileVisitOption;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.EnumSet;

public class DirBuddy {
    public static void copy(Path fromPath, Path toPath) throws IOException {
        // fromPath non-exits
        if (!Files.exists(fromPath)) {
            String msg = String.format("%s fromPath path doesn't exist", fromPath);
            System.err.println(msg);
            return;
        }

        // fromPath non-directory
        if (!Files.isDirectory(fromPath)) {
            if (Files.exists(toPath)) {

                // toPath is a directory
                if (Files.isDirectory(toPath)) {
                    // toPath is a file
                    toPath = toPath.resolve(fromPath.getFileName());
                }
            }

            // both are files
            Files.copy(fromPath, toPath, StandardCopyOption.REPLACE_EXISTING);
        }

        // toPath is an existing file
        if (Files.exists(toPath) && !Files.isDirectory(toPath)) {
            String msg = String.format("%s is not a directory%n", toPath);
            System.err.println(msg);
            return;
        }

        // both are directories
        EnumSet<FileVisitOption> options = EnumSet.of(FileVisitOption.FOLLOW_LINKS);
        CopyVisitor copier = new CopyVisitor(fromPath, toPath);
        Files.walkFileTree(fromPath, options, Integer.MAX_VALUE, copier);
    }

    public static void move(Path srcPath, Path dstPath) throws IOException {
        Files.walkFileTree(srcPath, new MoveVisitor(srcPath, dstPath));
    }

    public static void delete(Path dir) throws IOException {
        Files.walkFileTree(dir, new DeleteVisitor());
    }
}
```

### CopyVisitor

```java
import java.io.IOException;
import java.nio.file.*;
import java.nio.file.attribute.BasicFileAttributes;
import java.nio.file.attribute.FileTime;

class CopyVisitor extends SimpleFileVisitor<Path> {
    private final Path fromPath;
    private final Path toPath;

    private final StandardCopyOption copyOption = StandardCopyOption.REPLACE_EXISTING;

    CopyVisitor(Path fromPath, Path toPath) {
        this.fromPath = fromPath;
        this.toPath = toPath;
    }

    @Override
    public FileVisitResult preVisitDirectory(Path dir, BasicFileAttributes attrs) throws IOException {
        // copy folder
        Path targetPath = getTargetPath(dir);
        if (!Files.exists(targetPath)) {
            Files.createDirectory(targetPath);
        }

        return FileVisitResult.CONTINUE;
    }

    @Override
    public FileVisitResult visitFile(Path file, BasicFileAttributes attrs) throws IOException {
        // copy file
        Path targetPath = getTargetPath(file);
        Files.copy(file, targetPath, copyOption);

        return FileVisitResult.CONTINUE;
    }

    @Override
    public FileVisitResult visitFileFailed(Path file, IOException ioe) {
        ioe.printStackTrace(System.err);
        return FileVisitResult.CONTINUE;
    }

    @Override
    public FileVisitResult postVisitDirectory(Path dir, IOException ioe)
    {
        if (ioe == null)
        {
            Path relativePath = fromPath.relativize(dir);
            Path newDir = toPath.resolve(relativePath);
            try
            {
                FileTime time = Files.getLastModifiedTime(dir);
                Files.setLastModifiedTime(newDir, time);
            }
            catch (IOException ioe2)
            {
                String msg = String.format("cannot change lastModifiedTime: %s", newDir);
                System.err.println(msg);
            }
        }
        else
        {
            // should probably throw the exception to terminate the walk
            ioe.printStackTrace(System.err);
        }

        return FileVisitResult.CONTINUE;
    }

    Path getTargetPath(Path sourcePath) {
        Path relativePath = fromPath.relativize(sourcePath);
        Path targetPath = toPath.resolve(relativePath);

        String[][] matrix = {
                {"fromPath", String.valueOf(fromPath)},
                {"toPath", String.valueOf(toPath)},
                {"relativePath", String.valueOf(relativePath)},
                {"sourcePath", String.valueOf(sourcePath)},
                {"targetPath", String.valueOf(targetPath)},
        };
        TableUtils.printTable(matrix, TableType.ONE_LINE);

        return targetPath;
    }
}
```

### MoveVisitor

```java
import java.io.IOException;
import java.nio.file.*;
import java.nio.file.attribute.BasicFileAttributes;

class MoveVisitor extends SimpleFileVisitor<Path> {
    private final Path srcPath;
    private final Path dstPath;

    MoveVisitor(Path srcPath, Path dstPath) {
        this.srcPath = srcPath;
        this.dstPath = dstPath;
    }

    @Override
    public FileVisitResult preVisitDirectory(Path dir, BasicFileAttributes attrs) throws IOException {
        Path targetPath = dstPath.resolve(srcPath.relativize(dir));
        Files.copy(
                dir,
                targetPath,
                StandardCopyOption.REPLACE_EXISTING,
                StandardCopyOption.COPY_ATTRIBUTES
        );
        return FileVisitResult.CONTINUE;
    }

    @Override
    public FileVisitResult visitFile(Path file, BasicFileAttributes attr) throws IOException {
        Path targetPath = dstPath.resolve(srcPath.relativize(file));
        Files.move(
                file,
                targetPath,
                StandardCopyOption.REPLACE_EXISTING,
                StandardCopyOption.ATOMIC_MOVE
        );
        return FileVisitResult.CONTINUE;
    }

    @Override
    public FileVisitResult postVisitDirectory(Path dir, IOException ioe) throws IOException {
        if (ioe == null) {
            Files.delete(dir);
        }
        else {
            throw ioe;
        }
        return FileVisitResult.CONTINUE;
    }
}
```

### DeleteVisitor

```java
import java.io.IOException;
import java.nio.file.FileVisitResult;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.SimpleFileVisitor;
import java.nio.file.attribute.BasicFileAttributes;

class DeleteVisitor extends SimpleFileVisitor<Path> {
    @Override
    public FileVisitResult visitFile(Path file, BasicFileAttributes attr) throws IOException {
        if (Files.deleteIfExists(file)) {
            String msg = String.format("deleted regular file %s", file);
            System.out.println(msg);
        }
        else {
            String msg = String.format("couldn't delete regular file %s", file);
            System.out.println(msg);
        }
        return FileVisitResult.CONTINUE;
    }

    @Override
    public FileVisitResult postVisitDirectory(Path dir, IOException ioe) throws IOException {
        if (ioe == null) {
            if (Files.deleteIfExists(dir)) {
                String msg = String.format("deleted directory %s", dir);
                System.out.println(msg);
            }
            else {
                String msg = String.format("couldn't delete directory %s", dir);
                System.out.println(msg);
            }
        }
        else {
            throw ioe;
        }
        return FileVisitResult.CONTINUE;
    }
}
```
