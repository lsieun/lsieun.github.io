---
title: "监听服务"
sequence: "102"
---

[UP](/java/java-io-index.html)


```java
import java.io.IOException;
import java.nio.file.*;

public class WatchDirectory {
    public static void main(String[] args) throws IOException {
        FileSystem fileSystem = FileSystems.getDefault();
        WatchService watchService = fileSystem.newWatchService();
        Path dir = fileSystem.getPath("D:/tmp");
        dir.register(
                watchService,
                StandardWatchEventKinds.ENTRY_CREATE,
                StandardWatchEventKinds.ENTRY_DELETE,
                StandardWatchEventKinds.ENTRY_MODIFY
        );

        for (; ; ) {
            WatchKey key;
            try {
                key = watchService.take();
            } catch (InterruptedException e) {
                return;
            }

            for (WatchEvent<?> event : key.pollEvents()) {
                WatchEvent.Kind<?> kind = event.kind();
                if (kind == StandardWatchEventKinds.OVERFLOW) {
                    System.out.println("overflow");
                    continue;
                }

                Path filename = (Path) event.context();
                String info = String.format("%s: %s", event.kind(), filename);
                System.out.println(info);
            }

            boolean valid = key.reset();
            if (!valid) {
                break;
            }
        }

        watchService.close();
    }
}
```
