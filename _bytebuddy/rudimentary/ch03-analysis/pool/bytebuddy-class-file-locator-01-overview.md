---
title: "ClassFileLocator 概览"
sequence: "101"
---

## 介绍

`ClassFileLocator` 是一个接口，位于 `net.bytebuddy.dynamic` 包。

```java
package net.bytebuddy.dynamic;

public interface ClassFileLocator extends Closeable {
    Resolution locate(String name) throws IOException;

    interface Resolution {
        boolean isResolved();

        byte[] resolve();
    }
}
```

`ClassFileLocator` 的作用是获取 `byte[]`：由 `ClassFileLocator` 获取一个 `ClassFileLocator.Resolution`，再进一步得到 `byte[]`。

```text
ClassFileLocator ---> ClassFileLocator.Resolution ---> byte[]
```

## ClassFileLocator

```java
public interface ClassFileLocator extends Closeable {
    Resolution locate(String name) throws IOException;
}
```

### 不同实现

`ClassFileLocator` 有不同的实现：

![](/assets/images/bytebuddy/pool/bytebuddy-class-file-locator-overview.png)



### 分类

TODO: 这里缺少了 Filtering

```text
                                     ┌─── none ──────────┼─── NoOp
                                     │
                                     ├─── byte[] ────────┼─── Simple
                                     │
                                     │                   ┌─── ForClassLoader
                                     │                   │
                                     ├─── classloader ───┼─── ForModule
                                     │                   │
                    ┌─── single ─────┤                   └─── ForUrl
                    │                │
                    │                │                   ┌─── ForModuleFile
                    │                │                   │
                    │                ├─── file ──────────┼─── ForJarFile
ClassFileLocator ───┤                │                   │
                    │                │                   └─── ForFolder
                    │                │
                    │                └─── agent ─────────┼─── ForInstrumentation
                    │
                    │                ┌─── PackageDiscriminating
                    └─── multiple ───┤
                                     └─── Compound
```

```text
                                     ┌─── none ──────────┼─── NoOp
                                     │
                                     │                                  ┌─── of(String typeName, byte[] binaryRepresentation)
                                     │                                  │
                                     │                                  ├─── of(DynamicType dynamicType)
                                     ├─── byte[] ────────┼─── Simple ───┤
                                     │                                  ├─── of(Map<TypeDescription, byte[]> binaryRepresentations)
                                     │                                  │
                                     │                                  └─── ofResources(Map<String, byte[]> binaryRepresentations)
                                     │
                                     │                                                       ┌─── ofSystemLoader()
                                     │                                                       │
                                     │                                                       ├─── ofPlatformLoader()
                                     │                                          ┌─── of ─────┤
                                     │                                          │            ├─── ofBootLoader()
                                     │                                          │            │
                                     │                                          │            └─── of(ClassLoader classLoader)
                                     │                   ┌─── ForClassLoader ───┤
                                     │                   │                      │            ┌─── read(Class<?> type)
                                     │                   │                      │            │
                                     │                   │                      │            ├─── read(Class<?>... type)
                                     │                   │                      │            │
                                     │                   │                      └─── read ───┼─── read(Collection<? extends Class<?>> types)
                                     │                   │                                   │
                                     ├─── classloader ───┤                                   ├─── readToNames(Class<?>... type)
                                     │                   │                                   │
                                     │                   │                                   └─── readToNames(Collection<? extends Class<?>> types)
                                     │                   │
                    ┌─── single ─────┤                   │                      ┌─── ofBootLayer()
                    │                │                   ├─── ForModule ────────┤
                    │                │                   │                      └─── of(JavaModule module)
                    │                │                   │
                    │                │                   └─── ForUrl
                    │                │
                    │                │                                         ┌─── of(File file)
                    │                │                                         │
                    │                │                                         ├─── ofClassPath()
                    │                │                   ┌─── ForJarFile ──────┤
                    │                │                   │                     ├─── ofClassPath(String classPath)
                    │                │                   │                     │
                    │                │                   │                     └─── ofRuntimeJar()
                    │                │                   │
                    │                │                   │                     ┌─── ofBootPath()
                    │                │                   │                     │
ClassFileLocator ───┤                │                   │                     ├─── ofBootPath(File bootPath)
                    │                ├─── file ──────────┤                     │
                    │                │                   │                     ├─── ofModulePath()
                    │                │                   ├─── ForModuleFile ───┤
                    │                │                   │                     ├─── ofModulePath(String modulePath)
                    │                │                   │                     │
                    │                │                   │                     ├─── ofModulePath(String modulePath, String baseFolder)
                    │                │                   │                     │
                    │                │                   │                     └─── of(File file)
                    │                │                   │
                    │                │                   └─── ForFolder
                    │                │
                    │                │                                              ┌─── fromInstalledAgent(ClassLoader classLoader)
                    │                └─── agent ─────────┼─── ForInstrumentation ───┤
                    │                                                               └─── of(Instrumentation instrumentation, Class<?> type)
                    │
                    │                ┌─── PackageDiscriminating
                    └─── multiple ───┤
                                     └─── Compound
```

## ClassFileLocator.Resolution


```java
public interface ClassFileLocator extends Closeable {
    interface Resolution {
        boolean isResolved();

        byte[] resolve();
    }
}
```

### Explicit

```java
public interface ClassFileLocator extends Closeable {
    interface Resolution {
        class Explicit implements Resolution {
            private final byte[] binaryRepresentation;

            public Explicit(byte[] binaryRepresentation) {
                this.binaryRepresentation = binaryRepresentation;
            }

            public boolean isResolved() {
                return true;
            }

            public byte[] resolve() {
                return binaryRepresentation;
            }
        }
    }
}
```

### Illegal

```java
public interface ClassFileLocator extends Closeable {
    interface Resolution {
        class Illegal implements Resolution {

            private final String typeName;

            public Illegal(String typeName) {
                this.typeName = typeName;
            }

            public boolean isResolved() {
                return false;
            }

            public byte[] resolve() {
                throw new IllegalStateException("Could not locate class file for " + typeName);
            }
        }
    }
}
```

## 总结

本文内容总结如下：

- 第一点，从整体上来说，`ClassFileLocator` 的作用是获取 `byte[]`。起点是 `ClassFileLocator`，终点是 `byte[]`。
- 第二点，从使用的角度来说，根据具体的场景，选择合适的 `ClassFileLocator` 实现类。
