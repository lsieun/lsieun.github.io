---
title: "Zip Archive As a Filesystem"
sequence: "103"
---

[UP](/java/java-io-index.html)


One of the benefits of the new `java.nio.file` package introduce with Java 7 is the ability to implement custom filesystems in Java.

Java 7 ships with one such custom filesystem implementation bundled within it: the **Zip Filesystem Provider**.
Using the **Zip Filesystem Provider**, we can open a ZIP archive and treat it like a filesystem:
**reading**, **writing**, **copying**, and **renaming** files using all of the standard `java.nio.file` APIs,
except that all of these operations happen inside the ZIP archive file instead of on the host computer filesystem (as you might otherwise expect).

The key to making this possible is that the NIO File API starts with a `FileSystem` abstraction
that serves as a factory for `Path` objects.
In our previous discussion of the NIO File API we always simply asked for the default filesystem using `Filesystems.getDefault()`.
This time, we are going to target a particular custom filesystem type and destination by constructing a special `URI` for our ZIP archive.
(As we'll discuss in the networking chapters, a `URI` is kind of like a `URL` except that it can be more abstract).

```java
import java.io.IOException;
import java.net.URI;
import java.nio.file.FileSystem;
import java.nio.file.FileSystems;
import java.nio.file.Path;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;

public class ZipFileSystem_A_SupportedView {
    public static void main(String[] args) {
        // uri
        Path zipPath = Path.of("D:/tmp/abc.zip");
        URI zipUri = URI.create("jar:" + zipPath.toUri());

        // env
        Map<String, String> env = new HashMap<>();
        env.put("create", "true");

        // zip filesystem
        try (FileSystem zipfs = FileSystems.newFileSystem(zipUri, env)) {
            Set<String> supportedViews = zipfs.supportedFileAttributeViews();

            String[][] matrix = {
                    {"zipUri", String.valueOf(zipUri)},
                    {"supportedViews", String.valueOf(supportedViews)}
            };
            TableUtils.printTable(matrix, TableType.ONE_LINE);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }
}
```

```text
┌────────────────┬────────────────────────────┐
│     zipUri     │ jar:file:///D:/tmp/abc.zip │
├────────────────┼────────────────────────────┤
│ supportedViews │        [basic, zip]        │
└────────────────┴────────────────────────────┘
```

```java
import java.io.IOException;
import java.io.OutputStream;
import java.io.OutputStreamWriter;
import java.io.PrintWriter;
import java.net.URI;
import java.nio.file.FileSystem;
import java.nio.file.FileSystems;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.HashMap;
import java.util.Map;

public class ZipAsFileSystem {
    public static void main(String[] args) throws IOException {
        // Construct the URI pointing to the ZIP archive
        // Windows
        URI zipURI = URI.create("jar:file:///D:/tmp/MyArchive.zip");
        // Linux
        //URI zipURI = URI.create("jar:file:/Users/pat/tmp/MyArchive.zip");

        // Open or create it and write a file
        Map<String, String> env = new HashMap<>();
        env.put("create", "true");

        try (FileSystem zipfs = FileSystems.newFileSystem(zipURI, env)) {
            Path path = zipfs.getPath("/README.txt");
            OutputStream out = Files.newOutputStream(path);
            try (PrintWriter pw = new PrintWriter(new OutputStreamWriter(out))) {
                pw.println("Hello World!");
            }
        }
    }
}
```

In this snippet, we constructed a `URI` for our ZIP archive using the `URI.create()` method and the special `jar:file:` prefix.
(The Java JAR format is really just the ZIP format with some additional conventions.)
We then used that `URI` with the `Filesystems.newFileSystem()` method to create the right kind of filesystem reference for us.
The `FileSystem` it returns will perform all of its operations on entries within the ZIP,
but otherwise will behave just like we've seen previously.
The other argument to the `newFileSystem()` method is a `Map` containing string properties that are specific to the provider.
In this case, we pass in the value “create” as “true,”
indicating that we want the ZIP filesystem provider to create the archive if it does not already exist.
In order to know what properties can be passed, you'll have to consult the documentation for the particular filesystem provider.

In our preceding snippet, we then create a `Path` for a file `/README.txt` at the root folder of the filesystem and
write a string to it.
Because we are using try-with-resources clauses to encapsulate opening the filesystem and writing to the file,
the resources will be automatically closed for us when the operation is complete.

Other operations proceed just as with “normal” files.
For example, we can move a file by creating a path for the existing file
and a path for the new location and then using the standard `Files.move()` method.

```java
import java.io.IOException;
import java.net.URI;
import java.nio.file.FileSystem;
import java.nio.file.FileSystems;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.HashMap;
import java.util.Map;

public class ZipAsFileSystem {
    public static void main(String[] args) throws IOException {
        // Construct the URI pointing to the ZIP archive
        // Windows
        URI zipURI = URI.create("jar:file:///D:/tmp/MyArchive.zip");
        // Linux
        //URI zipURI = URI.create("jar:file:/Users/pat/tmp/MyArchive.zip");

        // Open or create it and write a file
        Map<String, String> env = new HashMap<>();
        env.put("create", "true");

        // Move the file
        try (FileSystem zipfs = FileSystems.newFileSystem(zipURI, env)) {
            Path path = zipfs.getPath("/README.txt");
            Path toPath = zipfs.getPath("/README2.txt");
            Files.move(path, toPath);
        }
    }
}
```
