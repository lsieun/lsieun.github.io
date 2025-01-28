---
title: "时间属性：创建时间、修改时间、访问时间"
sequence: "102"
---

[UP](/java/java-io-index.html)


## 获取对象

```text
                                              ┌─── getFileAttributeView() --> FileAttributeView
                                              │
                                              ├─── readAttributes() --> BasicFileAttributes
                  ┌─── Files ─────────────────┤
                  │                           ├─── getAttribute()
                  │                           │
                  │                           └─── setAttribute()
                  │
                  │                                                                ┌─── name()
                  │                                                                │
                  │                           ┌─── BasicFileAttributeView ─────────┼─── readAttributes() --> BasicFileAttributes
                  │                           │                                    │
                  │                           │                                    └─── setTimes()
                  ├─── FileAttributeView ─────┤
attribute::api ───┤                           ├─── FileOwnerAttributeView
                  │                           │
                  │                           └─── UserDefinedFileAttributeView
                  │
                  │                           ┌─── space ───┼─── size()
                  │                           │
                  │                           │             ┌─── creationTime()
                  │                           │             │
                  │                           ├─── time ────┼─── lastModifiedTime()
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

```text
                    ┌─── view ─────┼─── getFileAttributeView()
                    │
Files::attribute ───┼─── many ─────┼─── readAttributes()
                    │
                    │              ┌─── setAttribute()
                    └─── single ───┤
                                   └─── getAttribute()
```

```text
BasicFileAttributeView --> BasicFileAttributes
```





## 读取时间

### Files

```java
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.attribute.FileTime;

public class FileTimeAttribute_A_Read {
    public static void main(String[] args) throws IOException {
        Path path = Path.of(".");
        FileTime lastModifiedTime = Files.getLastModifiedTime(path);
        System.out.println("lastModifiedTime = " + lastModifiedTime);
    }
}
```

## 修改时间

使用 `BasicFileAttributeView::setTimes(FileTime lastModifiedTime, FileTime lastAccessTime, FileTime createTime)` 方法：

```java
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.attribute.BasicFileAttributeView;
import java.nio.file.attribute.FileTime;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;

public class FileTimeAttributeModify {
    public static void main(String[] args) throws IOException {
        // 第 1 步，准备时间
        LocalDateTime localDateTime = LocalDateTime.of(2012, 1, 1, 0, 0);
        Instant instant = localDateTime.atZone(ZoneId.systemDefault()).toInstant();
        FileTime fileTime = FileTime.from(instant);

        // 第 2 步，修改时间
        Path path = Paths.get("/path/to/file");
        BasicFileAttributeView attributeView = Files.getFileAttributeView(path, BasicFileAttributeView.class);
        attributeView.setTimes(fileTime, fileTime, fileTime);
    }
}
```
