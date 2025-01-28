---
title: "javac Intro"
---

## Synopsis

```text
javac [options] [sourcefiles] [classes] [@argfiles]
```

Arguments can be in any order:

- `options`: Command-line options. See Options.
- `sourcefiles`: One or more source files to be compiled (such as MyClass.java).
- `classes`: One or more classes to be processed for annotations (such as MyPackage.MyClass).
- `@argfiles`: One or more files that list options and source files. The -J options are not allowed in these files.

## Description

There are two ways to pass source code file names to `javac`.

- For a small number of source files, list the file names on the command line.
- For a large number of source files, list the file names in a file that is separated by **blanks** or **line breaks**.
  Use the list file name preceded by an at sign (`@`) with the `javac` command.

By default, the compiler puts each class file in the same directory as its source file.
You can specify a separate destination directory with the `-d` option.

## Searching for Types

To compile a source file, the compiler often needs information about a type,
but the type definition is not in the source files specified on the command line.

> 编译一个source file，javac需要引用到其它的类型（type），可能是一个class file，也可能是另一个source file

The compiler needs type information for every class or interface used, extended, or implemented in the source file.
This includes classes and interfaces not explicitly mentioned in the source file, but that provide information through inheritance.

> 编译每个source file，需要“探寻”其实现的层层父类和接口

For example, when you create a subclass of `java.awt.Window`,
you are also using the ancestor classes of `Window`:
`java.awt.Container`, `java.awt.Component`, and `java.lang.Object`.

> 举例说明

When the compiler needs type information, it searches for a **source file** or **class file** that defines the type.
The compiler searches for **class files** first in **the bootstrap and extension classes**,
then in the **user class path** (which by default is the current directory).
The **user class path** is defined by setting the `CLASSPATH` environment variable or by using the `-classpath` option.

> 查找类的顺序：bootstrap class --> extension classes --> user class path

If you set the `-sourcepath` option, then the compiler searches the indicated path for source files.
Otherwise, the compiler searches the **user class path** for both **class files** and **source files**.

> class path在一定程度上承担了source path的功能

You can specify different bootstrap or extension classes with the `-bootclasspath` and the `-extdirs` options.

A successful type search may produce **a class file**, **a source file**, or both.
If both are found, then you can use the `-Xprefer` option to instruct the compiler which to use.
If `newer` is specified, then the compiler uses the newer of the two files.
If `source` is specified, the compiler uses the source file.
The default is `newer`.

> 如果class file和source file同时存在，那么应该选择哪个呢？

If a type search finds a **source file** for a required type,
either by itself, or as a result of the setting for the `-Xprefer` option,
then the compiler reads the source file to get the information it needs.
By default the compiler also compiles the source file.
You can use the `-implicit` option to specify the behavior.
If `none` is specified, then no class files are generated for the source file.
If `class` is specified, then class files are generated for the source file.

> 如果查找到一个source file，可以根据-implicit选项来决定是否生成class file。

The compiler might not discover the need for some type information until after annotation processing completes.
When the type information is found in a source file and no `-implicit` option is specified,
the compiler gives a warning that the file is being compiled without being subject to annotation processing.
To disable the warning, either specify the file on the command line
(so that it will be subject to annotation processing) or
use the `-implicit` option to specify whether or not class files should be generated for such source files.

