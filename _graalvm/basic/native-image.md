---
title: "Native Image"
sequence: "103"
---

Native Image is a technology to compile Java code ahead-of-time to a binary – a native executable.

```text
Native Image: Java code --> native executable
```

A native executable includes only the code required at run time,
that is the application classes, standard-library classes,
the language runtime, and statically-linked native code from the JDK.

```text
native executable = application classes + standard-library classes + language runtime + statically-linked native code
```

An executable file produced by Native Image has several important **advantages**, in that it

```text
有哪些优势
```

- Uses a fraction of the resources required by the Java Virtual Machine, so is cheaper to run
- Starts in milliseconds
- Delivers peak performance immediately, with no warmup
- Can be packaged into a lightweight container image for fast and efficient deployment
- Presents a reduced attack surface

A native executable is created by the **Native Image builder** or `native-image`
that processes your application classes and other metadata
to create a binary for a specific operating system and architecture.

First, the `native-image` tool performs static analysis of your code
to determine the classes and methods that are **reachable** when your application runs.

Second, it compiles classes, methods, and resources into a binary.
This entire process is called **build time**
to clearly distinguish it from the compilation of Java source code to bytecode.

The `native-image` tool can be used to build a **native executable**,
which is the default, or a **native shared library**.
This quick start guide focuses on building a native executable; to learn more about native shared libraries, go here.

```text
$ native-image --version
native-image 17.0.8 2023-07-18
GraalVM Runtime Environment Oracle GraalVM 17.0.8+9.1 (build 17.0.8+9-LTS-jvmci-23.0-b14)
Substrate VM Oracle GraalVM 17.0.8+9.1 (build 17.0.8+9-LTS, serial gc, compressed references)
```

## 一个示例

```text
# 获取 classpath
CP=`find lib | tr '\n' ':'`

# 获取 GRAALVM_VERSION
GRAALVM_VERSION=`native-image --version`

# 设置ARTIFACT
ARTIFACT=my-spring-boot-app

echo "[-->] Compiling Application '$ARTIFACT' with $GRAALVM_VERSION"

# 指定 MAINCLASS
MAINCLASS=demo.DemoConfig

# 测试启动
java -cp $CP $MAINCLASS

native-image \
  -J-Xmx4G \
  -H:+TraceClassInitialization \
  -H:Name=$ARTIFACT \
  -Dspring.native.remove-unused-autoconfig=true \
  -Dspring.native.remove-yaml-support=true \
  -cp $CP $MAINCLASS
```

## Reference

- [Native Image](https://docs.oracle.com/en/graalvm/jdk/17/docs/reference-manual/native-image/)
