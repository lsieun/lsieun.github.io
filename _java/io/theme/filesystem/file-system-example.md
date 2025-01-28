---
title: "FileSystem"
sequence: "101"
---

[UP](/java/java-io-index.html)


## 示例

### FileSystemProvider

```java
import java.nio.file.spi.FileSystemProvider;
import java.util.List;

public class FileSystem_A_ProviderList {
    public static void main(String[] args) {
        List<FileSystemProvider> providerList = FileSystemProvider.installedProviders();
        int size = providerList.size();

        String[][] matrix = new String[size + 1][2];
        matrix[0][0] = "provider";
        matrix[0][1] = "getScheme()";
        for (int i = 0; i < size; i++) {
            FileSystemProvider provider = providerList.get(i);
            String scheme = provider.getScheme();
            matrix[i + 1][0] = String.valueOf(provider);
            matrix[i + 1][1] = scheme;
        }
        TableUtils.printTable(matrix, TableType.ONE_LINE);
    }
}
```

```text
┌───────────────────────────────────────────────────┬─────────────┐
│                     provider                      │ getScheme() │
├───────────────────────────────────────────────────┼─────────────┤
│   sun.nio.fs.WindowsFileSystemProvider@7cc355be   │    file     │
├───────────────────────────────────────────────────┼─────────────┤
│   jdk.nio.zipfs.ZipFileSystemProvider@6e8cf4c6    │     jar     │
├───────────────────────────────────────────────────┼─────────────┤
│ jdk.internal.jrtfs.JrtFileSystemProvider@12edcd21 │     jrt     │
└───────────────────────────────────────────────────┴─────────────┘
```

### 默认文件系统

```java
import java.nio.file.FileSystem;
import java.nio.file.FileSystems;
import java.nio.file.spi.FileSystemProvider;

public class FileSystem_B_Provider {
    public static void main(String[] args) {
        // filesystem
        FileSystem fileSystem = FileSystems.getDefault();

        // provider
        FileSystemProvider provider = fileSystem.provider();
        String scheme = provider.getScheme();


        // print
        String[][] matrix = {
                {"provider", String.valueOf(provider)},
                {"getScheme()", scheme}
        };
        TableUtils.printTable(matrix, TableType.ONE_LINE);
    }
}
```

```text
┌─────────────┬───────────────────────────────────────────────┐
│  provider   │ sun.nio.fs.WindowsFileSystemProvider@378bf509 │
├─────────────┼───────────────────────────────────────────────┤
│ getScheme() │                     file                      │
└─────────────┴───────────────────────────────────────────────┘
```

### 根目录

```java
import java.nio.file.FileSystem;
import java.nio.file.FileSystems;
import java.nio.file.Path;

public class FileSystem_C_RootDirectory {
    public static void main(String[] args) {
        FileSystem fileSystem = FileSystems.getDefault();
        Iterable<Path> rootDirectories = fileSystem.getRootDirectories();

        for (Path path : rootDirectories) {
            System.out.println(path);
        }
    }
}
```

```text
C:\
D:\
E:\
```

### 更新 Jar 包

```java
import java.io.File;
import java.io.IOException;
import java.net.URI;
import java.nio.file.*;
import java.util.HashMap;
import java.util.Map;

public class ZipFileSystem {
    public static void main(String[] args) {
        String jarPath = "D:/tmp/xyz.jar";
        Map<String, String> fileMap = new HashMap<>();
        fileMap.put("files/999/def.txt", "D:/tmp/def.txt");
        updateJar(jarPath, fileMap);
    }

    public static void updateJar(String jarPath, Map<String, String> fileMap) {
        Map<String, String> env = new HashMap<>(16);
        env.put("create", "true");
        // env.put("create", "false");
        File jarFile = new File(jarPath);
        URI uri = URI.create("jar:" + jarFile.toURI());

        try (FileSystem zipfs = FileSystems.newFileSystem(uri, env)) {
            for (Map.Entry<String, String> entry : fileMap.entrySet()) {
                Path pathInZipfile = zipfs.getPath(entry.getKey());
                Path externalTxtFile = Paths.get(entry.getValue());
                if (!Files.exists(pathInZipfile)) {
                    Files.createDirectories(pathInZipfile);
                }
                Files.copy(externalTxtFile, pathInZipfile, StandardCopyOption.REPLACE_EXISTING);
            }
        } catch (IOException ex) {
            ex.printStackTrace();
        }
    }
}
```
