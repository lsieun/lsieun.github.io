---
title: "文件属性有哪些？"
sequence: "101"
---

[UP](/java/java-io-index.html)


```text
                                         ┌─── existence ────┼─── exists()
                                         │
                                         │                  ┌─── isRegularFile()
                                         ├─── type ─────────┤
                                         │                  └─── isDirectory()
                                         │
                                         ├─── space ────────┼─── size()
             ┌─── Files ─────────────────┤
             │                           │                  ┌─── isReadable()
             │                           │                  │
             │                           ├─── permission ───┼─── isWritable()
             │                           │                  │
             │                           │                  └─── isExecutable()
             │                           │
             │                           └─── visibility ───┼─── isHidden()
attribute ───┤
             │                           ┌─── space ───┼─── size()             空间
             │                           │
             │                           │             ┌─── creationTime()
             │                           │             │
             │                           ├─── time ────┼─── lastModifiedTime() 时间
             │                           │             │
             │                           │             └─── lastAccessTime()
             │                           │
             └─── BasicFileAttributes ───┤             ┌─── isRegularFile()
                                         │             │
                                         │             ├─── isDirectory()
                                         ├─── type ────┤
                                         │             ├─── isSymbolicLink()
                                         │             │
                                         │             └─── isOther()
                                         │
                                         └─── other ───┼─── fileKey()
```

## 示例

### 可用的属性

```java
import java.nio.file.FileSystem;
import java.nio.file.FileSystems;
import java.util.Set;

public class FileAttribute_A_List {
    public static void main(String[] args) {
        FileSystem fileSystem = FileSystems.getDefault();
        Set<String> fileAttributeViews = fileSystem.supportedFileAttributeViews();
        for (String view : fileAttributeViews) {
            System.out.println(view);
        }
    }
}
```

```text
owner
dos
acl
basic
user
```

```text
Note: All FileSystems support the basic file attribute view so you should see at least `basic` in the output.
```

### 属性是否支持

```java
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.attribute.*;
import java.util.List;

public class FileAttribute_B_Support {
    static boolean isSupported(Class<? extends FileAttributeView> clazz) {
        return Files.getFileAttributeView(Path.of("."), clazz) != null;
    }

    public static void main(String[] args) {
        List<Class<? extends FileAttributeView>> list = List.of(
                BasicFileAttributeView.class,
                DosFileAttributeView.class,

                FileOwnerAttributeView.class,
                AclFileAttributeView.class,
                PosixFileAttributeView.class,

                UserDefinedFileAttributeView.class
        );

        int num = list.size();
        String[][] matrix = new String[num][2];
        for (int i = 0; i < num; i++) {
            Class<? extends FileAttributeView> clazz = list.get(i);
            boolean supported = isSupported(clazz);
            matrix[i][0] = String.format("isSupported(%s.class)", clazz.getSimpleName());
            matrix[i][1] = String.valueOf(supported);
        }

        TableUtils.printTable(matrix, TableType.ONE_LINE);
    }
}
```

```text
┌─────────────────────────────────────────────────┬───────┐
│    isSupported(BasicFileAttributeView.class)    │ true  │
├─────────────────────────────────────────────────┼───────┤
│     isSupported(DosFileAttributeView.class)     │ true  │
├─────────────────────────────────────────────────┼───────┤
│    isSupported(FileOwnerAttributeView.class)    │ true  │
├─────────────────────────────────────────────────┼───────┤
│     isSupported(AclFileAttributeView.class)     │ true  │
├─────────────────────────────────────────────────┼───────┤
│    isSupported(PosixFileAttributeView.class)    │ false │
├─────────────────────────────────────────────────┼───────┤
│ isSupported(UserDefinedFileAttributeView.class) │ true  │
└─────────────────────────────────────────────────┴───────┘
```

