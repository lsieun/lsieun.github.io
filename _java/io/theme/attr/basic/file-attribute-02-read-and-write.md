---
title: "读取和设置单个属性"
sequence: "102"
---

[UP](/java/java-io-index.html)



## 读取单个属性

```text
[view-name:]attribute-name
```

```java
import java.io.IOException;
import java.lang.reflect.Method;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.attribute.BasicFileAttributeView;
import java.nio.file.attribute.BasicFileAttributes;

public class BasicFileAttributeView_B_Read_Single {
    public static void main(String[] args) throws IOException {
        // 第 1 步，获取对象
        Path path = Path.of("D:/tmp/abc.txt");
        BasicFileAttributeView view = Files.getFileAttributeView(path, BasicFileAttributeView.class);
        String name = view.name();


        // 第 2 步，收集信息
        Method[] declaredMethods = BasicFileAttributes.class.getDeclaredMethods();
        int length = declaredMethods.length;
        String[][] matrix = new String[length + 1][2];
        matrix[0][0] = "path";
        matrix[0][1] = String.valueOf(path);

        int index = 1;
        for (Method m : declaredMethods) {
            String methodName = m.getName();
            String attributeName = String.format("%s:%s", name, methodName);
            Object attribute = Files.getAttribute(path, attributeName);
            matrix[index][0] = String.format("Files.getAttribute(%s)", attributeName);
            matrix[index][1] = String.valueOf(attribute);
            index++;
        }


        // 第 3 步，打印信息
        TableUtils.printTable(matrix, TableType.ONE_LINE);
    }
}
```

```text
┌────────────────────────────────────────────┬──────────────────────────────┐
│                    path                    │        D:\tmp\abc.txt        │
├────────────────────────────────────────────┼──────────────────────────────┤
│       Files.getAttribute(basic:size)       │             2296             │
├────────────────────────────────────────────┼──────────────────────────────┤
│   Files.getAttribute(basic:isDirectory)    │            false             │
├────────────────────────────────────────────┼──────────────────────────────┤
│  Files.getAttribute(basic:isRegularFile)   │             true             │
├────────────────────────────────────────────┼──────────────────────────────┤
│     Files.getAttribute(basic:isOther)      │            false             │
├────────────────────────────────────────────┼──────────────────────────────┤
│ Files.getAttribute(basic:lastModifiedTime) │ 2024-09-17T06:36:31.6719662Z │
├────────────────────────────────────────────┼──────────────────────────────┤
│  Files.getAttribute(basic:lastAccessTime)  │ 2024-09-17T02:25:21.0978755Z │
├────────────────────────────────────────────┼──────────────────────────────┤
│   Files.getAttribute(basic:creationTime)   │ 2024-09-08T22:37:55.998411Z  │
├────────────────────────────────────────────┼──────────────────────────────┤
│  Files.getAttribute(basic:isSymbolicLink)  │            false             │
├────────────────────────────────────────────┼──────────────────────────────┤
│     Files.getAttribute(basic:fileKey)      │             null             │
└────────────────────────────────────────────┴──────────────────────────────┘
```

## 设置单个属性

```java
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.attribute.FileTime;
import java.time.Instant;

public class BasicFileAttributeView_C_Write_Single {
    public static void main(String[] args) throws IOException {
        // 第 1 步，获取对象
        Path path = Path.of("D:/tmp/abc.txt");
        String attributeName = "basic:lastModifiedTime";

        // 第 2 步，修改之前
        printAttribute(path, attributeName);


        // 第 3 步，修改信息
        Files.setAttribute(
                path,
                attributeName,
                FileTime.from(Instant.now().plusSeconds(60))
        );


        // 第 4 步，修改之后
        printAttribute(path, attributeName);
    }


    static void printAttribute(Path path, String attributeName) throws IOException {
        Object attribute = Files.getAttribute(path, attributeName);

        String[][] matrix = {
                {"path", path.toString()},
                {attributeName, String.valueOf(attribute)}
        };

        TableUtils.printTable(matrix, TableType.ONE_LINE);
    }
}
```

```text
┌────────────────────────┬──────────────────────────────┐
│          path          │        D:\tmp\abc.txt        │
├────────────────────────┼──────────────────────────────┤
│ basic:lastModifiedTime │ 2024-09-17T09:32:09.2401077Z │
└────────────────────────┴──────────────────────────────┘

┌────────────────────────┬──────────────────────────────┐
│          path          │        D:\tmp\abc.txt        │
├────────────────────────┼──────────────────────────────┤
│ basic:lastModifiedTime │ 2024-09-17T11:00:32.2841749Z │
└────────────────────────┴──────────────────────────────┘
```
