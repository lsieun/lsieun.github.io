---
title: "文件时间属性"
sequence: "101"
---

## 修改

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
        Path path = Paths.get("/path/to/file");
        BasicFileAttributeView attributeView = Files.getFileAttributeView(path, BasicFileAttributeView.class);

        LocalDateTime newCreationTime = LocalDateTime.of(2012, 1, 1, 0, 0);
        Instant instant = newCreationTime.atZone(ZoneId.systemDefault()).toInstant();
        FileTime fileTime = FileTime.from(instant);
        attributeView.setTimes(fileTime, fileTime, fileTime);
    }
}
```
