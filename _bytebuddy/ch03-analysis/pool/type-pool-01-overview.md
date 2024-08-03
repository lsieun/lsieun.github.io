---
title: "TypePool概览"
sequence: "111"
---

## TypePool 接口

使用 `TypePool` 的主要目的，就是来获取一个 `TypeDescription` 对象：

```text
TypePool ---> TypePool.Resolution ---> TypeDescription
```

```java
public interface TypePool {
    Resolution describe(String name);
    void clear();

    interface Resolution {
        boolean isResolved();

        TypeDescription resolve();
    }
}
```

## TypePool 具体实现

`TypePool` 接口有四个主要实现：

- `TypePool.Empty` 提供一个空的实现
- `TypePool.Explicit` 直接使用 `TypeDescription` 对象
- `TypePool.ClassLoading` 使用 `ClassLoader` 对象，由 `ClassLoader` 加载某个 `Class` 对象，再将 `Class` 对象转换成 `TypeDescription` 对象
- `TypePool.Default` 使用 `ClassFileLocator` 对象，由 `ClassFileLocator` 加载代表某个类的 `byte[]`，再将 `byte[]` 对象转换成 `TypeDescription` 对象

```text
            ┌─── TypePool.Empty
            │
            ├─── TypePool.Explicit ───────┼─── TypeDescription
TypePool ───┤
            ├─── TypePool.ClassLoading ───┼─── ClassLoader ───┼─── Class ───┼─── TypeDescription
            │
            └─── TypePool.Default ────────┼─── ClassFileLocator ───┼─── byte[] ───┼─── TypeDescription
```

### TypePool.Empty

```java
public interface TypePool {
    enum Empty implements TypePool {

        INSTANCE;

        public Resolution describe(String name) {
            return new Resolution.Illegal(name);
        }

        public void clear() {
            /* do nothing */
        }
    }
}
```

### TypePool.Explicit

```java
public interface TypePool {
    class Explicit extends AbstractBase.Hierarchical {
        private final Map<String, TypeDescription> types;

        public Explicit(TypePool parent, Map<String, TypeDescription> types) {
            super(CacheProvider.NoOp.INSTANCE, parent);
            this.types = types;
        }

        @Override
        protected Resolution doDescribe(String name) {
            TypeDescription typeDescription = types.get(name);
            return typeDescription == null
                    ? new Resolution.Illegal(name)
                    : new Resolution.Simple(typeDescription);
        }
    }
}
```

### TypePool.ClassLoading

```java
public interface TypePool {
    
}
```

### TypePool.Default

```java
public interface TypePool {
    class Default extends AbstractBase.Hierarchical {
        public static TypePool ofSystemLoader() {
            return of(ClassFileLocator.ForClassLoader.ofSystemLoader());
        }

        public static TypePool ofPlatformLoader() {
            return of(ClassFileLocator.ForClassLoader.ofPlatformLoader());
        }

        public static TypePool ofBootLoader() {
            return of(ClassFileLocator.ForClassLoader.ofBootLoader());
        }

        public static TypePool of(@MaybeNull ClassLoader classLoader) {
            return of(ClassFileLocator.ForClassLoader.of(classLoader));
        }

        public static TypePool of(ClassFileLocator classFileLocator) {
            return new Default(new CacheProvider.Simple(), classFileLocator, ReaderMode.FAST);
        }
    }
}
```



## 总结



```text
            ┌─── Empty
            │
            │                                                                        ┌─── ofSystemLoader()
            │                                                                        │
            │                                                                        ├─── ofPlatformLoader()
            │                                                                        │
            │                                         ┌─── Default (byte[]) ─────────┼─── ofBootLoader()
TypePool ───┤                                         │                              │
            │                                         │                              ├─── of(ClassLoader classLoader)
            │                                         │                              │
            │                                         │                              └─── of(ClassFileLocator classFileLocator)
            │                                         │
            │                                         │                              ┌─── of(ClassLoader classLoader)
            │                                         │                              │
            └─── AbstractBase ───┼─── Hierarchical ───┤                              ├─── of(ClassLoader classLoader, TypePool parent)
                                                      │                              │
                                                      ├─── ClassLoading (loader) ────┼─── ofSystemLoader()
                                                      │                              │
                                                      │                              ├─── ofPlatformLoader()
                                                      │                              │
                                                      │                              └─── ofBootLoader()
                                                      │
                                                      └─── Explicit (description)
```
