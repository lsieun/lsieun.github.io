---
title: "所有者属性"
sequence: "101"
---

[UP](/java/java-io-index.html)


## 读取

```java
import java.io.IOException;
import java.nio.file.FileSystem;
import java.nio.file.FileSystems;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.attribute.UserPrincipal;

public class FileOwnerAttribute_A_Read {
    public static void main(String[] args) throws IOException {
        FileSystem fileSystem = FileSystems.getDefault();
        Path path = fileSystem.getPath("D:/tmp/abc.txt");
        UserPrincipal owner = Files.getOwner(path);

        String[][] matrix = {
                {"fileSystem", String.valueOf(fileSystem)},
                {"path", String.valueOf(path)},
                {"owner", String.valueOf(owner)},
        };
        TableUtils.printTable(matrix, TableType.ONE_LINE);
    }
}
```

```text
┌────────────┬───────────────────────────────────────┐
│ fileSystem │ sun.nio.fs.WindowsFileSystem@6acbcfc0 │
├────────────┼───────────────────────────────────────┤
│    path    │            D:\tmp\abc.txt             │
├────────────┼───────────────────────────────────────┤
│   owner    │     DESKTOP-LBJA2CC\liusen (User)     │
└────────────┴───────────────────────────────────────┘
```

```java
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;

public class FileAttribute_Read {
    public static void main(String[] args) throws IOException {
        // prepare
        Path path = Path.of("D:/tmp/abc.txt");
        String attributeName = "owner:owner";

        // attribute
        Object attribute = Files.getAttribute(path, attributeName);
        System.out.println("attribute = " + attribute);
    }
}
```

## 设置

```java
import java.io.IOException;
import java.nio.file.FileSystem;
import java.nio.file.FileSystems;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.attribute.UserPrincipal;
import java.nio.file.attribute.UserPrincipalLookupService;

public class FileOwnerAttribute_B_Write {
    public static void main(String[] args) throws IOException {
        FileSystem fileSystem = FileSystems.getDefault();
        UserPrincipalLookupService service = fileSystem.getUserPrincipalLookupService();
        UserPrincipal userPrincipal = service.lookupPrincipalByName("Guest");

        Path path = fileSystem.getPath("D:/tmp/abc.txt");
        UserPrincipal oldOwner = Files.getOwner(path);
        Files.setOwner(path, userPrincipal);
        UserPrincipal newOwner = Files.getOwner(path);

        String[][] matrix = {
                {"fileSystem", String.valueOf(fileSystem)},
                {"path", String.valueOf(path)},
                {"oldOwner", String.valueOf(oldOwner)},
                {"newOwner", String.valueOf(newOwner)},
        };
        TableUtils.printTable(matrix, TableType.ONE_LINE);
    }
}
```

直接运行，遇到错误：

```text
This security ID may not be assigned as the owner of this object
```

The exception is thrown by `setOwner()` for the following reason:
**The owner of a new object must be one of the users or groups you have been given the right to assign as the owner.**
Typically, this is your user account and,
if you are an administrator, the administrator's local group.

The solution to this problem is to **elevate the privilege of the java application**
by running cmd (the command interpreter) as an administrator.

使用『管理员身份』运行 CMD，然后运行：

```text
┌────────────┬───────────────────────────────────────┐
│ fileSystem │ sun.nio.fs.WindowsFileSystem@34a245ab │
├────────────┼───────────────────────────────────────┤
│    path    │            D:\tmp\abc.txt             │
├────────────┼───────────────────────────────────────┤
│  oldOwner  │     DESKTOP-LBJA2CC\liusen (User)     │
├────────────┼───────────────────────────────────────┤
│  newOwner  │     DESKTOP-LBJA2CC\Guest (User)      │
└────────────┴───────────────────────────────────────┘
```
