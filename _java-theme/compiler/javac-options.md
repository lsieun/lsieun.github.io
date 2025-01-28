---
title: "javac Options"
---

The compiler has a set of **standard options** that are supported on the current development environment.
An additional set of **nonstandard options** are specific to the current virtual machine and compiler implementations
and are subject to change in the future.
Nonstandard options begin with the `-X` option.

## Standard Options

### Path

- `-cp path or -classpath path`

Specifies where to find **user class files**, and (optionally) annotation processors and source files.
This class path **overrides** the user class path in the `CLASSPATH` environment variable.
If neither `CLASSPATH`, `-cp` nor `-classpath` is specified, then the user class path is the **current directory**. See Setting the Class Path.

If the `-sourcepath` option is not specified, then the **user class path** is also searched for **source files**.

If the `-processorpath` option is not specified, then the class path is also searched for **annotation processors**.

- `-sourcepath sourcepath`: Specifies the **source code path** to search for class or interface definitions.

As with the **user class path**, source path entries are separated by colons (`:`) on Oracle Solaris and semicolons(`;`) on Windows and
can be **directories**, **JAR archives**, or **ZIP archives**.
If packages are used, then the local path name within the directory or archive must reflect the package name.

Note: Classes found through the **class path** might be recompiled when their **source files** are also found.

- `-d directory`

Sets the destination directory for class files.
**The directory must already exist** because javac does not create it.
If a class is part of a package, then javac puts the class file in a subdirectory
that reflects the package name and creates directories as needed.

If you specify `-d /home/myclasses` and the class is called `com.mypackage.MyClass`,
then the class file is `/home/myclasses/com/mypackage/MyClass.class`.

If the `-d` option is not specified, then javac puts each class file in the same directory as the source file from which it was generated.

Note: The directory specified by the `-d` option is not automatically added to your **user class path**.

- `-Djava.ext.dirs=directories`: Overrides the location of installed extensions.

### J

- `-Joption`

Passes `option` to the Java Virtual Machine (JVM), where `option` is one of the options described on the reference page for the Java launcher.
For example, `-J-Xms48m` sets the startup memory to 48 MB.

Note: The `CLASSPATH`, `-classpath`, `-bootclasspath`, and `-extdirs` options do not specify the classes used to run javac.
Trying to customize the compiler implementation with these options and variables is risky and often does not accomplish what you want.
If you must customize the complier implementation, then use the `-J` option to pass options through to the underlying Java launcher.

### X

- `-X`: Displays information about **nonstandard options** and exits.

### Debug

- `-g:none`: Does not generate any debugging information.

- `-g:[keyword list]`: Generates only some kinds of debugging information, specified by a comma separated list of keywords.

Valid keywords are:

- `source`: Source file debugging information.
- `lines`: Line number debugging information.
- `vars`: Local variable debugging information.

### 反射

- `-parameters`: Stores formal parameter names of constructors and methods in the generated class file
  so that the method `java.lang.reflect.Executable.getParameters` from the Reflection API can retrieve them.

## Cross-Compilation Options

By default, classes are compiled against **the bootstrap and extension classes** of the platform that `javac` shipped with.
But `javac` also supports cross-compiling, where classes are compiled against a bootstrap and extension classes of a **different Java platform implementation**.
It is important to use the `-bootclasspath` and `-extdirs` options when cross-compiling.

## Nonstandard Options

- `-Xbootclasspath/p:path`: Adds a suffix to the bootstrap class path.
- `-Xbootclasspath/a:path`: Adds a prefix to the bootstrap class path.
- `-Xbootclasspath/:path`: Overrides the location of the bootstrap class files.


- `-Xprefer:[newer,source]`: Specifies which file to read when both a source file and class file are found for a type.

If the `-Xprefer:newer` option is used, then it reads the newer of the source or class file for a type (default).
If the `-Xprefer:source` option is used, then it reads the source file.
Use `-Xprefer:source` when you want to be sure that any annotation processors can access annotations declared with a retention policy of SOURCE.

