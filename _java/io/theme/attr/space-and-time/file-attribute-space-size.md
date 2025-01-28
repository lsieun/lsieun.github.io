---
title: "空间属性：文件大小"
sequence: "101"
---

[UP](/java/java-io-index.html)


## Files.size()

```java
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;

public class FileSizeAttributeRun {
    public static void main(String[] args) throws IOException {
        Path path = Path.of("README.md");
        long size = Files.size(path);
        System.out.println("size = " + size);
    }
}
```

查看 `Files.size()` 的源码，可以看到它是通过 `BasicFileAttributes` 类的实现的：

```java
public final class Files {
    public static long size(Path path) throws IOException {
        return readAttributes(path, BasicFileAttributes.class).size();
    }
}
```

## BasicFileAttributes.size()

```java
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.attribute.BasicFileAttributes;

public class FileSizeAttributeRun {
    public static void main(String[] args) throws IOException {
        Path path = Path.of("README.md");
        BasicFileAttributes basicFileAttributes = Files.readAttributes(path, BasicFileAttributes.class);
        long size = basicFileAttributes.size();
        System.out.println("size = " + size);
    }
}
```
