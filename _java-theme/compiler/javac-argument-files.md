---
title: "javac Argument Files"
---

To shorten or simplify the `javac` command, you can specify one or more files that contain arguments to the `javac` command (except `-J` options).

This enables you to create `javac` commands of any length on any operating system.

```text
                  ┌─── options
                  │
                  ├─── sourcefiles
                  │
javac argument ───┼─── classes
                  │
                  │                                     ┌─── blanks
                  │                   ┌─── separator ───┤
                  │                   │                 └─── new line characters
                  └─── @argfiles ─────┤
                                      │                 ┌─── option
                                      └─── item ────────┤
                                                        │                  ┌─── file name contains embedded spaces
                                                        └─── sourcefile ───┤
                                                                           └─── file names --> relative --> current directory
```

## Argument File

### 分隔符

An argument file can include `javac` **options** and **source file names** in any combination.
The arguments within a file can be separated by **spaces** or **new line characters**.

> argument的分隔符是space和new line characters

### 文件

If a file name contains embedded spaces, then put the whole file name in double quotation marks.

> 文件名当中带有空格

File Names within an argument file are relative to the **current directory**, not the location of the **argument file**.

> 相对路径，要依据“谁”来进行解析

三个不支持：

- Wild cards (*) are not allowed in these lists (such as for specifying `*.java`).
- Use of the at sign (`@`) to recursively interpret files is not supported.
- The `-J` options are not supported because they are passed to the launcher, which does not support argument files.

## 如何使用

When executing the `javac` command, pass in **the path and name of each argument file** with the at sign (`@`) leading character.

## 如何解析

When the `javac` command encounters an argument beginning with the at sign (`@`), it expands the contents of that file into the **argument list**.

## Examples

### Single Argument File

You could use a single argument file named `argfile` to hold all `javac` arguments:

```text
javac @argfile
```

This argument file could contain the contents of both files shown in Example 2

### Two Argument Files

You can create two argument files: one for the `javac` **options** and the other for the **source file names**. Note that the following lists have no line-continuation characters.

Create a file named `options` that contains the following:

```text
-d classes
-g
-sourcepath /java/pubs/ws/1.3/src/share/classes
```

Create a file named `classes` that contains the following:

```text
MyClass1.java
MyClass2.java
MyClass3.java
```

Then, run the `javac` command as follows:

```text
javac @options @classes
```

### Argument Files with Paths

The argument files can have paths, but any file names inside the files are relative to the **current working directory** (not path1 or path2):

```text
javac @path1/options @path2/classes
```
