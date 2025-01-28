---
title: "Path"
sequence: "101"
---

[UP](/java/java-io-index.html)


## 思维导图

```text
                                                              ┌─── String
        ┌─── static ───────┼─── path.instance ───┼─── of() ───┤
        │                                                     └─── URI
        │
        │                                          ┌─── getFileSystem()
        │                  ┌─── filesystem ────────┤
        │                  │                       └─── watch.service ─────┼─── register()
        │                  │
        │                  │                       ┌─── root ──────┼─── getRoot()
        │                  │                       │
        │                  │                       ├─── parent ────┼─── getParent()
Path ───┤                  │                       │
        │                  ├─── path.components ───┼─── file ──────┼─── getFileName()
        │                  │                       │
        │                  │                       │               ┌─── getNameCount()
        │                  │                       │               │
        │                  │                       └─── subpath ───┼─── getName(int index)
        │                  │                                       │
        │                  │                                       └─── subpath()
        │                  │
        │                  │                       ┌─── absolute ───┼─── toAbsolutePath()
        │                  │                       │
        └─── non-static ───┤                       │                ┌─── resolve()
                           │                       │                │
                           │                       ├─── relative ───┼─── resolveSibling()
                           ├─── path.scenario ─────┤                │
                           │                       │                └─── relativize()
                           │                       │
                           │                       ├─── link ───────┼─── toRealPath()
                           │                       │
                           │                       └─── normal ─────┼─── normalize(): eliminate redundant name elements
                           │
                           │                       ┌─── isAbsolute()
                           │                       │
                           ├─── path.check ────────┼─── startsWith()
                           │                       │
                           │                       └─── endsWith()
                           │
                           │                       ┌─── uri ────┼─── toUri()
                           └─── path.convert ──────┤
                                                   └─── file ───┼─── toFile()
```

## 示例

```java
import java.nio.file.FileSystem;
import java.nio.file.Path;

public class PathRun {
    public static void main(String[] args) {
        Path path = Path.of("D:\\git-repo\\learn-java-io\\src\\main\\java\\lsieun\\io\\theme\\path\\PathRun.java");
        FileSystem fileSystem = path.getFileSystem();
        Path root = path.getRoot();
        Path parent = path.getParent();
        Path absolutePath = path.toAbsolutePath();
        Path fileName = path.getFileName();

        String[][] matrix = {
                {"getFileSystem()", fileSystem.toString()},
                {"getRoot()", root.toString()},
                {"getParent()", parent.toString()},
                {"toAbsolutePath()", absolutePath.toString()},
                {"getFileName()", fileName.toString()},
        };

        TableUtils.printTable(matrix, TableType.ONE_LINE);

        int nameCount = path.getNameCount();
        String[][] matrix2 = new String[nameCount + 1][2];
        matrix2[0][0] = "getNameCount()";
        matrix2[0][1] = String.valueOf(nameCount);
        if (nameCount > 0) {
            for (int i = 0; i < nameCount; i++) {
                Path name = path.getName(i);
                int row = i + 1;
                matrix2[row][0] = String.format("getName(%d)", i);
                matrix2[row][1] = name.toString();
            }
        }
        TableUtils.printTable(matrix2, TableType.ONE_LINE);


        if (nameCount > 0) {
            String[][] matrix3 = new String[nameCount + 2][2];
            matrix3[0][0] = "toAbsolutePath()";
            matrix3[0][1] = absolutePath.toString();
            matrix3[1][0] = "getNameCount()";
            matrix3[1][1] = String.valueOf(nameCount);

            for (int i = 1; i <= nameCount; i++) {
                Path subpath = path.subpath(0, i);
                int row = i + 1;
                matrix3[row][0] = String.format("subpath(0, %d)", i);
                matrix3[row][1] = subpath.toString();
            }

            TableUtils.printTable(matrix3, TableType.ONE_LINE);
        }


    }
}
```

```text
┌──────────────────┬───────────────────────────────────────────────────────────────────────────┐
│ getFileSystem()  │                   sun.nio.fs.WindowsFileSystem@378bf509                   │
├──────────────────┼───────────────────────────────────────────────────────────────────────────┤
│    getRoot()     │                                    D:\                                    │
├──────────────────┼───────────────────────────────────────────────────────────────────────────┤
│   getParent()    │       D:\git-repo\learn-java-io\src\main\java\lsieun\io\theme\path        │
├──────────────────┼───────────────────────────────────────────────────────────────────────────┤
│ toAbsolutePath() │ D:\git-repo\learn-java-io\src\main\java\lsieun\io\theme\path\PathRun.java │
├──────────────────┼───────────────────────────────────────────────────────────────────────────┤
│  getFileName()   │                               PathRun.java                                │
└──────────────────┴───────────────────────────────────────────────────────────────────────────┘

┌────────────────┬───────────────┐
│ getNameCount() │      10       │
├────────────────┼───────────────┤
│   getName(0)   │   git-repo    │
├────────────────┼───────────────┤
│   getName(1)   │ learn-java-io │
├────────────────┼───────────────┤
│   getName(2)   │      src      │
├────────────────┼───────────────┤
│   getName(3)   │     main      │
├────────────────┼───────────────┤
│   getName(4)   │     java      │
├────────────────┼───────────────┤
│   getName(5)   │    lsieun     │
├────────────────┼───────────────┤
│   getName(6)   │      io       │
├────────────────┼───────────────┤
│   getName(7)   │     theme     │
├────────────────┼───────────────┤
│   getName(8)   │     path      │
├────────────────┼───────────────┤
│   getName(9)   │ PathRun.java  │
└────────────────┴───────────────┘

┌──────────────────┬───────────────────────────────────────────────────────────────────────────┐
│ toAbsolutePath() │ D:\git-repo\learn-java-io\src\main\java\lsieun\io\theme\path\PathRun.java │
├──────────────────┼───────────────────────────────────────────────────────────────────────────┤
│  getNameCount()  │                                    10                                     │
├──────────────────┼───────────────────────────────────────────────────────────────────────────┤
│  subpath(0, 1)   │                                 git-repo                                  │
├──────────────────┼───────────────────────────────────────────────────────────────────────────┤
│  subpath(0, 2)   │                          git-repo\learn-java-io                           │
├──────────────────┼───────────────────────────────────────────────────────────────────────────┤
│  subpath(0, 3)   │                        git-repo\learn-java-io\src                         │
├──────────────────┼───────────────────────────────────────────────────────────────────────────┤
│  subpath(0, 4)   │                      git-repo\learn-java-io\src\main                      │
├──────────────────┼───────────────────────────────────────────────────────────────────────────┤
│  subpath(0, 5)   │                   git-repo\learn-java-io\src\main\java                    │
├──────────────────┼───────────────────────────────────────────────────────────────────────────┤
│  subpath(0, 6)   │                git-repo\learn-java-io\src\main\java\lsieun                │
├──────────────────┼───────────────────────────────────────────────────────────────────────────┤
│  subpath(0, 7)   │              git-repo\learn-java-io\src\main\java\lsieun\io               │
├──────────────────┼───────────────────────────────────────────────────────────────────────────┤
│  subpath(0, 8)   │           git-repo\learn-java-io\src\main\java\lsieun\io\theme            │
├──────────────────┼───────────────────────────────────────────────────────────────────────────┤
│  subpath(0, 9)   │         git-repo\learn-java-io\src\main\java\lsieun\io\theme\path         │
├──────────────────┼───────────────────────────────────────────────────────────────────────────┤
│  subpath(0, 10)  │  git-repo\learn-java-io\src\main\java\lsieun\io\theme\path\PathRun.java   │
└──────────────────┴───────────────────────────────────────────────────────────────────────────┘
```

## Reference

- [Differences Between Paths.get and Path.of](https://www.baeldung.com/java-paths-get-path-of)
- [Java – Path vs File](https://www.baeldung.com/java-path-vs-file)
