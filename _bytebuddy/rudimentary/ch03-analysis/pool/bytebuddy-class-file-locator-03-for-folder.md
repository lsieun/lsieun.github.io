---
title: "ClassFileLocator.ForFolder"
sequence: "103"
---

## ForFolder

```java
import net.bytebuddy.dynamic.ClassFileLocator;

import java.io.File;
import java.io.IOException;

public class HelloWorldAnalysis {
    public static void main(String[] args) throws IOException {
        String filepath = "D:\\git-repo\\learn-byte-buddy\\target\\classes";
        String className = "sample.HelloWorld";

        try (
                ClassFileLocator folderLocator = new ClassFileLocator.ForFolder(new File(filepath));
        ) {
            ClassFileLocator.Resolution resolution = folderLocator.locate(className);
            byte[] bytes = resolution.resolve();
            System.out.println(bytes.length);
        }
    }
}
```

## 源码

```java
public interface ClassFileLocator extends Closeable {
    class ForFolder implements ClassFileLocator {
        private final File folder;

        public ForFolder(File folder) {
            this.folder = folder;
        }

        public Resolution locate(String name) throws IOException {
            File file = new File(folder, name.replace('.', File.separatorChar) + CLASS_FILE_EXTENSION);
            if (file.exists()) {
                InputStream inputStream = new FileInputStream(file);
                try {
                    return new Resolution.Explicit(StreamDrainer.DEFAULT.drain(inputStream));
                } finally {
                    inputStream.close();
                }
            } else {
                return new Resolution.Illegal(name);
            }
        }
    }
}
```
