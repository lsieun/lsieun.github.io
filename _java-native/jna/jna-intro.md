---
title: "JNA Intro"
sequence: "101"
---

JNA = Java Native Access library

use the Java Native Access library (JNA for short) to access native libraries
without writing any JNI (Java Native Interface) code.

JNA is a platform independent technology to call Native C APIs from the Java code.
It supports multiple platforms and the following C library types.

- DLL (Dynamic Link Library) on Windows platforms.
- SO (Shared Object) on Linux platforms.

## Two Components

### JNA

This is the core artifact of JNA and contains only the binding library and the core helper classes.

```text
JNA = the binding library + core helper classes
```

### JNA Platform

This artifact holds cross-platform mappings and mappings for a number of commonly used platform functions,
including a large number of Win32 mappings as well as a set of utility classes that simplify native access.
The code is tested and the utility interfaces ensure that native memory management is taken care of correctly.

## Make Library Available

Make your target library available to your Java program. There are several ways to do this:

- **The preferred method** is to set the `jna.library.path` system property to the path to your target library.
  This property is similar to `java.library.path`, but only applies to libraries loaded by JNA.
- Change the appropriate library access environment variable before launching the VM.
  This is `PATH` on Windows, `LD_LIBRARY_PATH` on Linux, and `DYLD_LIBRARY_PATH` on OSX.
- Make your native library available on your classpath, under the path `{OS}-{ARCH}/{LIBRARY}`,
  where `{OS}-{ARCH}` is JNA's canonical prefix for native libraries (e.g. `win32-x86`, `linux-amd64`, or `darwin`).
  If the resource is within a jar file it will be automatically extracted when loaded.

## Declare Java interface

Declare a Java interface to hold the native library methods by extending the `Library` interface.

Following is an example of mapping for the Windows kernel32 library.

```java
package com.sun.jna.examples.win32;

import com.sun.jna.*;

// kernel32.dll uses the __stdcall calling convention (check the function
// declaration for "WINAPI" or "PASCAL"), so extend StdCallLibrary
// Most C libraries will just extend com.sun.jna.Library,
public interface Kernel32 extends StdCallLibrary { 
    // Method declarations, constant and structure definitions go here
}
```

Within this interface, define an instance of the native library using the `Native.load(Class)` method,
providing the native library interface you defined previously.

```text
Kernel32 INSTANCE = Native.load("kernel32", Kernel32.class);

// Optional: wraps every call to the native library in a
// synchronized block, limiting native calls to one at a time
Kernel32 SYNC_INSTANCE = Native.synchronizedLibrary(INSTANCE);
```

The `INSTANCE` variable is for convenient reuse of a single instance of the library.
Alternatively, you can load the library into a local variable
so that it will be available for garbage collection when it goes out of scope.
A Map of options may be provided as the third argument to `load` to customize the library behavior;
some of these options are explained in more detail below.

The `SYNC_INSTANCE` is also optional;
use it if you need to ensure that your native library has only one call to it at a time.

## Declare Methods

Declare methods that mirror the functions in the target library
by defining Java methods with the same name and argument types as the native function.
You may also need to declare native structures to pass to your native functions.
To do this, create a class within the interface definition that extends `Structure` and add public fields
(which may include arrays or nested structures).

```text
@FieldOrder({ "wYear", "wMonth", "wDayOfWeek", "wDay", "wHour", "wMinute", "wSecond", "wMilliseconds" })
public static class SYSTEMTIME extends Structure {
    public short wYear;
    public short wMonth;
    public short wDayOfWeek;
    public short wDay;
    public short wHour;
    public short wMinute;
    public short wSecond;
    public short wMilliseconds;
}

void GetSystemTime(SYSTEMTIME result);
```

You can now invoke methods on the library instance just like any other Java class.

```text
Kernel32 lib = Kernel32.INSTANCE;
SYSTEMTIME time = new SYSTEMTIME();
lib.GetSystemTime(time);

System.out.println("Today's integer value is " + time.wDay);
```

## Projects Using JNA

JNA is a mature library with dozens of contributors and hundreds of commercial and non-commercial projects that use it.

- [JNAerator](https://github.com/nativelibs4java/JNAerator): Pronounced "generator",
  auto-generates JNA mappings from C headers, by Olivier Chafik.

## Reference

Baeldung

- [Using JNA to Access Native Dynamic Libraries](https://www.baeldung.com/java-jna-dynamic-libraries)
- [Guide to JNI (Java Native Interface)](https://www.baeldung.com/jni)
- [tutorials/java-native/](https://github.com/eugenp/tutorials/tree/master/java-native)

Github

- [java-native-access/jna](https://github.com/java-native-access/jna)
- [Getting Started with JNA](https://github.com/java-native-access/jna/blob/master/www/GettingStarted.md)
- [Demo applications/examples](https://github.com/java-native-access/jna/tree/master/contrib)

Wiki

- [Java Native Access(JNA)](https://en.wikipedia.org/wiki/Java_Native_Access)
- [Java Native Interface (JNI)](https://en.wikipedia.org/wiki/Java_Native_Interface)


- [从零开始的JNA之路(一)：jna包的获取与C语言库调用](https://blog.csdn.net/Shenpibaipao/article/details/79212071)
- [从零开始的JNA之路(二)：自定义DLL的调取](https://blog.csdn.net/Shenpibaipao/article/details/79214757)
- [从零开始的JNA之路(三)：利用jna-platform.jar调取窗口及安装键盘钩子](https://blog.csdn.net/Shenpibaipao/article/details/79220794)
- [java通过jna、jna-platform调用winapi的窗口程序](https://blog.csdn.net/yhj_911/article/details/104269991)
- [Java通过JNA方式调用DLL](https://blog.csdn.net/feinifi/article/details/79838827)