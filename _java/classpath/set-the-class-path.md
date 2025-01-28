---
title: "Setting the Class Path"
---

## 两种设置方式

The class search path (class path) can be set using
either the `-classpath` option when calling a JDK tool (the preferred method)
or by setting the `CLASSPATH` environment variable.

> 有两种方式：-classpath 和 CLASSPATH

The `-classpath` option is preferred because you can set it individually for each application
without affecting other applications and without other applications modifying its value.

> 推荐使用 -classpath

```text
sdkTool -classpath classpath1:classpath2...

setenv CLASSPATH classpath1:classpath2...
```

## 两个目标

Class paths to the **JAR**, **zip** or **class files**.

> 两个目标：具体的文件（.jar 或.zip）和文件夹

Each class path should end with **a file name** or **directory** depending on what you are setting the class path to, as follows:

- For a JAR or zip file that contains class files, the class path ends with the name of the zip or JAR file.
- For class files in an unnamed package, the class path ends with the directory that contains the class files.
- For class files in a named package, the class path ends with the directory that contains the root package, which is the first package in the full package name.

## 分隔符

Multiple path entries are separated by semicolons(`;`) in Windows and colons(`:`) in Oracle Solaris.

## 默认值

The default class path is the current directory.

Setting the `CLASSPATH` variable or using the `-classpath` command-line option overrides that default,
so if you want to include the current directory in the search path, then you must include a dot (`.`) in the new settings.

## 忽略

Class path entries that are neither **directories** nor **archives** (`.zip` or JAR files) nor the asterisk (`*`) wildcard character are ignored.
