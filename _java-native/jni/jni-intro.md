---
title: "JNI Intro"
sequence: "101"
---


The generated C/C++ function will always contain **two parameters**
in addition to the regular parameters originally declared in the native Java method.

The **first parameter** is a pointer to a structure that contains the interface to the JVM.
(Note that this `JNIEnv` is not the actual name of the structure.
The name of the structure is `JNIEnv_` and `const struct JNINativeInterface_` for C++ and C respectively.
This structure contains all the functions necessary to interact with the JVM and to work with Java objects.
For example, it includes functions for instantiating objects, throwing exceptions,
converting native arrays to/from Java arrays, native strings to/from Java strings etc.
With this pointer, although it is not that easy, we can virtually do everything that Java code can do.

The **second argument** differs depending on whether the native method is non-static or static.
It is a reference to the object (`jobject`) for a non-static native method and
is a reference to its Java class (`jclass`) for static method.

The `JNIEXPORT` and `JNICALL` are macros used to specify the calling and linkage convention of
both Java native methods and their implementations.
In Linux like OS, they are blank macros (defined in `<JAVA_HOME>/include/linux/jni_md.h`) as follows:

```text
#ifndef _JAVASOFT_JNI_MD_H_
#define _JAVASOFT_JNI_MD_H_

#ifndef __has_attribute
  #define __has_attribute(x) 0
#endif
#if (defined(__GNUC__) && ((__GNUC__ > 4) || (__GNUC__ == 4) && (__GNUC_MINOR__ > 2))) || __has_attribute(visibility)
  #ifdef ARM
    #define JNIEXPORT     __attribute__((externally_visible,visibility("default")))
    #define JNIIMPORT     __attribute__((externally_visible,visibility("default")))
  #else
    #define JNIEXPORT     __attribute__((visibility("default")))
    #define JNIIMPORT     __attribute__((visibility("default")))
  #endif
#else
  #define JNIEXPORT
  #define JNIIMPORT
#endif

#define JNICALL

typedef int jint;
#ifdef _LP64
typedef long jlong;
#else
typedef long long jlong;
#endif

typedef signed char jbyte;

#endif /* !_JAVASOFT_JNI_MD_H_ */
```

在 Windows 操作系统下，`jdk1.8.0_202\include\win32\jni_md.h` 文件内容如下：

```text
#ifndef _JAVASOFT_JNI_MD_H_
#define _JAVASOFT_JNI_MD_H_

#define JNIEXPORT __declspec(dllexport)
#define JNIIMPORT __declspec(dllimport)
#define JNICALL __stdcall

typedef long jint;
typedef __int64 jlong;
typedef signed char jbyte;

#endif /* !_JAVASOFT_JNI_MD_H_ */
```

## Create Shared Library

```text
gcc -shared -I/usr/local/jdk08/include \
-I/usr/local/jdk08/include/linux JNITestImpl.c -o libtest.so
```

```text
gcc -shared -I${JAVA_HOME}/include \
-I${JAVA_HOME}/include/linux JNITestImpl.c -o libtest.so
```

Note that to compile, we need the system header file `<JAVA_HOME>/include/jni.h`,
which in turn includes `<JAVA_HOME>/include/linux/jni_md.h`.
So, include these two directories `<JAVA_HOME>/include` and `<JAVA_HOME>/include/linux` during compilation.
The symbolic name `<JAVA_HOME>` represents the directory where Java was installed.
For our system, Java home directory was `/usr/local/jdk08`.
So, we included two directories `/usr/local/jdk08/include` and `/usr/local/jdk08/include/linux`
so that the compiler `gcc` can recognize header files `jni.h` and `jni_md.h`.

## Running the Program

```text
java -Djava.library.path=. JNITest
```

The location of the library may also be specified using `LD_LIBRARY_PATH` environment variable as follows:

```text
export LD_LIBRARY_PATH=$LD_LIBRARY_PATH:.
```

We can then run the Java program directly as follows:

```text
java JNITest
```

For convenience, we write a shell script as follows:

```text
#make.sh
javac JNITest.java
javah JNITest
gcc -shared -I${JAVA_HOME}/include \
-I${JAVA_HOME}/include/linux JNITestImpl.c -o libtest.so
java -Djava.library.path=. JNITest
```

Give the execution permission as follows:

```text
chmod +x make.sh
```

We can now perform all JNI tasks by executing this shell script:

```text
./make.sh
```

## Using C++

```text
g++ -fPIC -shared -I/usr/local/jdk08/include \
-I/usr/local/jdk08/include/linux JNITestImpl.cpp -o libtest.so
```

```text
g++ -fPIC -shared -I${JAVA_HOME}/include \
-I${JAVA_HOME}/include/linux JNITestImpl.cpp -o libtest.so
```

The shell script will look like this:

```text
#make.sh
javac JNITest.java
javah JNITest
g++ -fPIC -shared -I/usr/local/jdk08/include \
-I/usr/local/jdk08/include/linux JNITestImpl.cpp -o libtest.so
java -Djava.library.path=. JNITest 
```

## Reference

- [JNI 入门教程](https://www.runoob.com/w3cnote/jni-getting-started-tutorials.html)，在Windows下生成DLL文件
- [Compiling and Running a Java Program with a Native Method](https://www.eg.bucknell.edu/~mead/Java-tutorial/native1.1/stepbystep/index.html)
