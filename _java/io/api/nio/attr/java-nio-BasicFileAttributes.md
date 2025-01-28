---
title: "BasicFileAttributes"
sequence: "103"
---

[UP](/java/java-io-index.html)


```text
                       ┌─── space ───┼─── size()
                       │
                       │             ┌─── creationTime()
                       │             │
                       ├─── time ────┼─── lastModifiedTime()
                       │             │
                       │             └─── lastAccessTime()
                       │
BasicFileAttributes ───┤             ┌─── isRegularFile()
                       │             │
                       │             ├─── isDirectory()
                       ├─── type ────┤
                       │             ├─── isSymbolicLink()
                       │             │
                       │             └─── isOther()
                       │
                       └─── other ───┼─── fileKey()
```

## 获取对象

```text
BasicFileAttributes bfa = Files.readAttributes(path, BasicFileAttributes.class);
```

## 使用

### 读取全部属性

```java
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.attribute.BasicFileAttributes;
import java.nio.file.attribute.FileTime;

public class BasicFileAttributeView_A_Read_All {
    public static void main(String[] args) throws IOException {
        // 第 1 步，获取对象
        Path path = Path.of("D:/tmp/abc.txt");
        BasicFileAttributes bfa = Files.readAttributes(path, BasicFileAttributes.class);

        // 第 2 步，读取信息
        long size = bfa.size();
        boolean regularFile = bfa.isRegularFile();
        boolean directory = bfa.isDirectory();
        boolean symbolicLink = bfa.isSymbolicLink();
        boolean other = bfa.isOther();
        FileTime creationTime = bfa.creationTime();
        FileTime modifiedTime = bfa.lastModifiedTime();
        FileTime accessTime = bfa.lastAccessTime();
        Object fileKey = bfa.fileKey();

        // 第 3 步，打印信息
        String[][] matrix = {
                {"path", String.valueOf(path)},
                {"size()", String.valueOf(size)},
                {"isRegularFile()", String.valueOf(regularFile)},
                {"isDirectory()", String.valueOf(directory)},
                {"isSymbolicLink()", String.valueOf(symbolicLink)},
                {"isOther()", String.valueOf(other)},
                {"creationTime()", String.valueOf(creationTime)},
                {"lastModifiedTime()", String.valueOf(modifiedTime)},
                {"lastAccessTime()", String.valueOf(accessTime)},
                {"fileKey()", String.valueOf(fileKey)},
        };

        TableUtils.printTable(matrix, TableType.ONE_LINE);
    }
}
```

```text
┌────────────────────┬──────────────────────────────┐
│        path        │        D:\tmp\abc.txt        │
├────────────────────┼──────────────────────────────┤
│       size()       │             2296             │
├────────────────────┼──────────────────────────────┤
│  isRegularFile()   │             true             │
├────────────────────┼──────────────────────────────┤
│   isDirectory()    │            false             │
├────────────────────┼──────────────────────────────┤
│  isSymbolicLink()  │            false             │
├────────────────────┼──────────────────────────────┤
│     isOther()      │            false             │
├────────────────────┼──────────────────────────────┤
│   creationTime()   │ 2024-09-08T22:37:55.998411Z  │
├────────────────────┼──────────────────────────────┤
│ lastModifiedTime() │ 2024-09-08T23:45:17.4025819Z │
├────────────────────┼──────────────────────────────┤
│  lastAccessTime()  │ 2024-09-17T02:25:21.0978755Z │
├────────────────────┼──────────────────────────────┤
│     fileKey()      │             null             │
└────────────────────┴──────────────────────────────┘
```
