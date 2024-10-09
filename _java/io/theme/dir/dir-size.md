---
title: "文件夹：占用空间"
sequence: "104"
---

[UP](/java/java-io-index.html)


## Java 6

```java
import java.io.File;

public class DirectorySizeJava6 {
    private static long getFolderSize(File folder) {
        long length = 0;
        if (folder == null) {
            return length;
        }
        if (folder.isFile()) {
            return folder.length();
        }

        File[] files = folder.listFiles();
        if (files == null) {
            return length;
        }

        for (File file : files) {
            if (file.isFile()) {
                length += file.length();
            } else {
                length += getFolderSize(file);
            }
        }
        return length;
    }


    public static void main(String[] args) {
        File folder = new File("D:\\git-repo\\learn-java-io\\src");
        long length = getFolderSize(folder);
        System.out.println(length);
    }
}
```

## With Java 7

Next – let's see how to **use Java 7 to get the folder size**.
In the following example – we use `Files.walkFileTree()` to traverse all files in the folder to sum their sizes:

```java
import java.io.IOException;
import java.nio.file.*;
import java.nio.file.attribute.BasicFileAttributes;
import java.util.concurrent.atomic.AtomicLong;

public class DirectorySizeJava7 {
    public static void main(String[] args) throws IOException {
        AtomicLong size = new AtomicLong(0);
        Path folder = Paths.get("src/");

        Files.walkFileTree(folder, new SimpleFileVisitor<Path>() {
            @Override
            public FileVisitResult visitFile(Path file, BasicFileAttributes attrs) throws IOException {
                size.addAndGet(attrs.size());
                return FileVisitResult.CONTINUE;
            }
        });

        System.out.println(size);
    }
}
```

Note how we're leveraging the filesystem tree traversal capabilities here and
making use of the **visitor pattern** to help us visit and calculate the sizes of each file and subfolder.

## With Java 8

Now – let's see how to get the folder size using **Java 8, stream operations and lambdas**.
In the following example – we use `Files.walk()` to traverse all files in the folder to sum their size:

```java
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

public class DirectorySizeJava8 {
    public static void main(String[] args) throws IOException {
        Path folder = Paths.get("src/");
        long size = Files.walk(folder)
                .filter(p -> p.toFile().isFile())
                .mapToLong(p -> p.toFile().length())
                .sum();
        System.out.println(size);
    }
}
```

Note: `mapToLong()` is used to generate a `LongStream`
by applying the `length` function in each element – after which we can sum and get a final result.

## With Apache Commons IO

Next – let's see how to get the folder size using **Apache Commons IO**.
In the following example – we simply use `FileUtils.sizeOfDirectory()` to get the folder size:

```java
import org.apache.commons.io.FileUtils;

import java.io.File;

public class DirectionSizeApacheCommonsIO {
    public static void main(String[] args) {
        File folder = new File("src/");
        long size = FileUtils.sizeOfDirectory(folder);
        System.out.println(size);
    }
}
```

Note that this to the point utility method implements a simple Java 6 solution under the hood.

Also, note that the library also provides a `FileUtils.sizeOfDirectoryAsBigInteger()` method
that deals with **security restricted directories** better.

## With Guava

Now – let's see how to calculate the size of a folder using **Guava**.
In the following example – we use `Files.fileTreeTraverser()` to traverse all files in the folder to sum their size:

```java
import com.google.common.io.Files;

import java.io.File;
import java.util.stream.StreamSupport;

public class DirectorySizeGuava {
    public static void main(String[] args) {
        File folder = new File("src/");

        Iterable<File> files = Files.fileTraverser().breadthFirst(folder);
        long size = StreamSupport.stream(files.spliterator(), false) .filter(f -> f.isFile())
                .mapToLong(File::length).sum();
        System.out.println(size);
    }
}
```

## Human Readable Size

Finally – let's see how to get a more user readable representation of the folder size – not just a size in bytes:

```java
import java.io.File;
import java.text.DecimalFormat;

public class HumanReadableSize {
    public static void main(String[] args) {
        File folder = new File("D:\\Software\\apache-maven");
        long size = FileUtils.sizeOfDirectory(folder);

        String[] units = new String[]{"B", "KB", "MB", "GB", "TB"};
        int unitIndex = (int) (Math.log10(size) / 3);
        double unitValue = 1 << (unitIndex * 10);

        String readableSize = new DecimalFormat("#,##0.#")
                .format(size / unitValue) + " "
                + units[unitIndex];
        System.out.println(readableSize);
    }
}
```

Note: We used `DecimalFormat(“#,##0,#”)` to round the result into one decimal place.

## Notes

Here are some notes about folder size calculation:

- Both `Files.walk()` and `Files.walkFileTree()` will throw a `SecurityException`
  if the security manager denies access to the starting file.
- The infinite loop may occur if the folder contains **symbolic links**.

## Reference

- [Java – Directory Size](https://www.baeldung.com/java-folder-size)
