---
title: "Java Native Intro"
sequence: "101"
---

## Components Needed

Here's a brief description of the key components that we need to take into account:

- Java Code – our classes. They will include at least one native method.
- Native Code – the actual logic of our native methods, usually coded in C or C++.
- JNI header file – this header file for C/C++ (include/jni.h into the JDK directory)
  includes all definitions of JNI elements that we may use into our native programs.
- C/C++ Compiler – we can choose between GCC, Clang, Visual Studio,
  or any other we like as far as it's able to generate a native shared library for our platform.

## JNI Elements in Code (Java And C/C++)

Java elements:

- “native” keyword – any method marked as `native` must be implemented in a native, shared lib.
- `System.loadLibrary(String libname)` – a static method that loads a shared library from the file system into memory
  and makes its **exported functions** available for our Java code.


C/C++ elements (many of them defined within `jni.h`)

- JNIEXPORT- marks the function into the shared lib as exportable, so it will be included in the function table, and thus JNI can find it
- JNICALL – combined with JNIEXPORT, it ensures that our methods are available for the JNI framework
- JNIEnv – a structure containing methods that we can use our native code to access Java elements
- JavaVM – a structure that lets us manipulate a running JVM (or even start a new one) adding threads to it, destroying it, etc…

