---
title: "FileStore"
sequence: "102"
---

[UP](/java/java-io-index.html)




## 示例

### 查看信息

```java
import java.io.IOException;
import java.nio.file.FileStore;
import java.nio.file.Files;
import java.nio.file.Path;

public class FileStoreInfo {
    public static void main(String[] args) throws IOException {
        Path path = Path.of("D:/git-repo/learn-java-io");
        FileStore fileStore = Files.getFileStore(path);

        String name = fileStore.name();
        String type = fileStore.type();
        boolean readOnly = fileStore.isReadOnly();
        long totalSpace = fileStore.getTotalSpace();
        long unallocatedSpace = fileStore.getUnallocatedSpace();
        long usableSpace = fileStore.getUsableSpace();
        long blockSize = fileStore.getBlockSize();

        String[][] matrix = {
                {"name()", name},
                {"type()", type},
                {"isReadOnly()", String.valueOf(readOnly)},
                {"getTotalSpace()", String.valueOf(totalSpace)},
                {"getUnallocatedSpace()", String.valueOf(unallocatedSpace)},
                {"getUsableSpace()", String.valueOf(usableSpace)},
                {"getBlockSize()", String.valueOf(blockSize)},
        };
        TableUtils.printTable(matrix, TableType.ONE_LINE);
    }
}
```

```text
┌───────────────────────┬──────────────┐
│        name()         │  Local Disk  │
├───────────────────────┼──────────────┤
│        type()         │     NTFS     │
├───────────────────────┼──────────────┤
│     isReadOnly()      │    false     │
├───────────────────────┼──────────────┤
│    getTotalSpace()    │ 214747312128 │
├───────────────────────┼──────────────┤
│ getUnallocatedSpace() │ 158551887872 │
├───────────────────────┼──────────────┤
│   getUsableSpace()    │ 158551887872 │
├───────────────────────┼──────────────┤
│    getBlockSize()     │     512      │
└───────────────────────┴──────────────┘
```

### 遍历

```java
import java.nio.file.FileStore;
import java.nio.file.FileSystem;
import java.nio.file.FileSystems;

public class FileStoreList {
    public static void main(String[] args) {
        FileSystem fileSystem = FileSystems.getDefault();
        Iterable<FileStore> fileStores = fileSystem.getFileStores();
        for (FileStore fs : fileStores) {
            System.out.println(fs);
        }
    }
}
```

```text
(C:)
Local Disk (D:)
New Volume (E:)
```
