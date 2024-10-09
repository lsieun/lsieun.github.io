---
title: "匹配路径"
sequence: "101"
---

[UP](/java/java-io-index.html)


## Regex

When you specify `regex` for syntax, you can specify any regular expression for pattern.
For example, you might specify regex:`([^\s]+(\.(?i)(png|jpg))$)` to match all files with `.png` and `.jpg` extensions.

```java
import java.io.IOException;
import java.nio.file.FileSystem;
import java.nio.file.FileSystems;
import java.nio.file.Path;
import java.nio.file.PathMatcher;

public class PathMatching {
    public static void main(String[] args) throws IOException {
        FileSystem fileSystem = FileSystems.getDefault();
        PathMatcher pm = fileSystem.getPathMatcher("regex:([^\\s]+(\\.(?i)(png|jpg))$)");

        Path path = Path.of("my.JPG");
        boolean matches = pm.matches(path);
        System.out.println(matches);
    }
}
```

## Glob

```java
import java.io.IOException;
import java.nio.file.FileSystem;
import java.nio.file.FileSystems;
import java.nio.file.Path;
import java.nio.file.PathMatcher;

public class PathMatching {
    public static void main(String[] args) throws IOException {
        FileSystem fileSystem = FileSystems.getDefault();
        PathMatcher pm = fileSystem.getPathMatcher("glob:*.java");

        Path path = Path.of("Abc.java");
        boolean matches = pm.matches(path);
        System.out.println(matches);
    }
}
```
