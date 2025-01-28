---
title: "File And Directory"
sequence: "102"
---

- `File`类和`Directory`类
- `FileInfo`类和`DirectoryInfo`类

## File类和Directory类

`File`类和`Directory`类，分别用来对文件和目录进行操作，这两个类可以被实例化，但不能被其它类继承。

`File`类支持对文件的基本操作，包括创建、复制、删除、移动和打开文件的静态方法，并能够创建`FileStream`对象。

`Directory`类，用于创建、移动、枚举、删除目录和子目录的静态方法。

## File

- `File.Exists()`
- `File.Create()`

- 检查文件是否存在
- 创建文件
- 复制和移动文件：
    - `File.Copy()`和`File.Move()`
    - `FileInfo.CopyTo()`和`FileInfo.MoveTo()`
- 删除文件
    - File.Delete()
    - FileInfo.Delete()



## Directory

- `Directory.CreateDirectory()`

- 判断文件夹是否存在
- 创建文件夹
- 移动文件夹
- 删除文件夹
- 遍历文件夹

