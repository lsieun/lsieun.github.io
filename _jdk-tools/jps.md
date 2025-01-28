---
title: "jps"
sequence: "105"
---

jps - the Java Virtual Machine Process Status Tool

## SYNOPSIS

```text
jps [options] [hostid]
```

## OPTIONS

The `jps` command supports a number of options that modify the output of the command.
These options are subject to change or removal in the future.

- `-q`: Suppress the output of the class name, JAR file name, and arguments passed to the main method, producing only a list of local VM identifiers.
- `-m`: Output the arguments passed to the `main` method. The output may be `null` for embedded JVMs.
- `-l`: Output the full package name for the application's `main` class or the full path name to the application's JAR file.
- `-v`: Output the arguments passed to the JVM.
- `-V`: Output the arguments passed to the JVM through the flags file (the `.hotspotrc` file or the file specified by the `-XX:Flags=<filename>` argument).
- `-Joption`: Pass option to the `java` launcher called by `jps`. For example, `-J-Xms48m` sets the startup memory to 48 megabytes.
  It is a common convention for `-J` to pass options to the underlying VM executing applications written in Java.

## Example

By default (no command line options) the output shows the local VM identifier (lvmid) and a short form of the class name or JAR file
that the VM was started from on the local machine.
The lvmid is normally the operating system's process identifier for the JVM. For example:

Showing PID with java process name:

```text
$ jps
7756 Program
9056 Tank.jar
```

Showing process arguments passed to the `main` method:

```text
$ jps -m
7756 Program first second third
9056 Tank.jar abc def hij
```

Showing the full package name for the application's main class or the full path name to the application's JAR file:

```text
$ jps -l
7756 sample.Program
9056 ./target/Tank.jar
```

```text
$ jps -lm
7756 sample.Program first second third
9056 ./target/Tank.jar abc def hij
```

Showing only process id:

```text
$ jps -q
7756
9056
```

Showing the JVM options passed to the process:

```text
$ jps -v
7756 Program -Duser.language=en -Duser.country=US
9056 Tank.jar -Duser.language=en -Duser.country=US
```

Showing process id and process name only:

```text
$ jps -V
7756 Program
9056 Tank.jar
```

## Reference

- [jps - Java Virtual Machine Process Status Tool](https://docs.oracle.com/javase/7/docs/technotes/tools/share/jps.html)
- []()
- []()
