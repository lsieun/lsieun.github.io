---
title: "文件和目录的常用操作"
sequence: "102"
---

[UP](/java/java-io-index.html)


## 创建文件

```text
boolean result = file.createNewFile();
Path newPath = Files.createFile(path);
```

## 创建目录

```text
boolean result = file.mkdir();
File newPath = Files.createDirectory(path);
```

创建多级目录：

```text
boolean result = file.mkdirs();
File newPath = Files.createDirectories(path);
```

## 操作

### 移动文件

```text
boolean result = file.renameTo(new File("baeldung/tutorial2.txt"));
Path newPath = Files.move(path, Paths.get("baeldung/tutorial2.txt"));
```

### 删除文件

```text
boolean result = file.delete();
Files.delete(Paths.get(path));
```

## 元数据

```text
// java.io API
boolean fileExists = file.exists();
boolean fileIsFile = file.isFile();
boolean fileIsDir = file.isDirectory();
boolean fileReadable = file.canRead();
boolean fileWritable = file.canWrite();
boolean fileExecutable = file.canExecute();
boolean fileHidden = file.isHidden();

// java.nio API
boolean pathExists = Files.exists(path);
boolean pathIsFile = Files.isRegularFile(path);
boolean pathIsDir = Files.isDirectory(path);
boolean pathReadable = Files.isReadable(path);
boolean pathWritable = Files.isWritable(path);
boolean pathExecutable = Files.isExecutable(path);
boolean pathHidden = Files.isHidden(path);
```
