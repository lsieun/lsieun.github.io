---
title: "在 JVM 退出时，删除临时文件"
sequence: "101"
---

[UP](/java/java-io-index.html)


## Runtime.addShutdownHook()

```java
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.concurrent.TimeUnit;

public class RemoveTemporaryDirectoryOnJvmExit {
    public static void main(String[] args) throws IOException, InterruptedException {
        Path path = Files.createTempDirectory(
                Path.of("D:/tmp"),
                "images"
        );

        TimeUnit.SECONDS.sleep(10);

        Runtime.getRuntime().addShutdownHook(new Thread() {
            @Override
            public void run() {
                try {
                    Files.delete(path);
                } catch (IOException e) {
                    throw new RuntimeException(e);
                }
            }
        });
    }
}
```

## File.deleteOnExit()

```java
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.concurrent.TimeUnit;

public class RemoveTemporaryDirectoryOnJvmExit {
    public static void main(String[] args) throws IOException, InterruptedException {
        Path path = Files.createTempDirectory(
                Path.of("D:/tmp"),
                "images"
        );

        File file = path.toFile();
        file.deleteOnExit();

        TimeUnit.SECONDS.sleep(10);
    }
}
```
