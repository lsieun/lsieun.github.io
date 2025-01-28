---
title: "ClassLoader Resource"
sequence: "201"
---


TODO:

- [ ] 当有多个相同名字的资源时，ClassLoader 是按怎样的顺序来找的。


```text
URL resource = ClassLoader.getSystemClassLoader().getResource(classResourcePath);
```

```text
               ┌─── getBootstrapResource(String name):URL
               │
               │
               │                                             ┌─── getBootstrapResource(name)
               │                                             │
ClassLoader ───┼─── getResource(String name):URL ────────────┼─── parent.getResource(name)
               │                                             │
               │                                             └─── findResource(name)
               │
               │                                             ┌─── getBootstrapResource(name)
               └─── getSystemResource(String name):URL ──────┤
                                                             └─── systemClassLoader.getResource(name)
```

- 首先，`ClassLoader.getBootstrapResource(String name)` 方法带有 `private` 和 `static` 标识：
  - `private` 标识表明，该方法只能在 `ClassLoader` 类里面调用，不能在类外部调用；
  - `static` 标识表明，该方法不与不任何的 `ClassLoader` 实例相关。
  - 从功能角度上来说，该方法从 boot classpath 上搜索 resource。
- 其次，`ClassLoader.getResource(String name)` 方法带有 `public` 标识：
  - `public` 标识表明，该方法是公开的方法，可以在类外部调用。
  - 当前方法，需要在某一个具体的 `ClassLoader` 上调用。
- 最后，`ClassLoader.getSystemResource(String name)` 方法带有 `public` 和 `static` 标识：
  - `public` 标识表明，该方法是公开的方法，可以在类外部调用。
  - `static` 标识表明，该方法不需要 `ClassLoader` 的实例。
  - 从代码实现的角度上来说，它是使用 System Class Loader 的 `getResource` 方法来实现的。

## ClassLoader

```java
public abstract class ClassLoader {
}
```

### getBootstrapResource

```java
public abstract class ClassLoader {
    private static URL getBootstrapResource(String name) {
        URLClassPath ucp = getBootstrapClassPath();
        Resource res = ucp.getResource(name);
        return res != null ? res.getURL() : null;
    }

    static URLClassPath getBootstrapClassPath() {
        return sun.misc.Launcher.getBootstrapClassPath();
    }
}
```

### getSystemResource

```java
public abstract class ClassLoader {
    public static URL getSystemResource(String name) {
        ClassLoader system = getSystemClassLoader();
        if (system == null) {
            return getBootstrapResource(name);
        }
        return system.getResource(name);
    }
}
```

### getResource

```java
public abstract class ClassLoader {
    public URL getResource(String name) {
        URL url;
        if (parent != null) {
            url = parent.getResource(name);
        } else {
            url = getBootstrapResource(name);
        }
        if (url == null) {
            url = findResource(name);
        }
        return url;
    }

    protected URL findResource(String name) {
        return null;
    }
}
```

### getResources

The reson why it confuses you is that `getResources` works on a class loader
which can have multiple JARs in the classpath.
So if you have multiple JARs with the same resource, you get all.
However it is NOT intended to search inside directories.
With `getResources("META-INF")` you get all `META-INF` directories
in the search path of the `CL` and if the `CL` is a single jar file class loader, you at most get one entry.

```java
public abstract class ClassLoader {
    public Enumeration<URL> getResources(String name) throws IOException {
        @SuppressWarnings("unchecked")
        Enumeration<URL>[] tmp = (Enumeration<URL>[]) new Enumeration<?>[2];
        if (parent != null) {
            tmp[0] = parent.getResources(name);
        } else {
            tmp[0] = getBootstrapResources(name);
        }
        tmp[1] = findResources(name);

        return new CompoundEnumeration<>(tmp);
    }
}
```

### getResourceAsStream

Using `ClassLoader.getResourceAsStream`, you prefix the path with an "/", which is not correct.
`ClassLoader.getResourceAsStream` expects an absolute path and the path starts with the name of the first segment,
e.g. use `ClassLoader.getResourceAsStream("java/lang/ClassLoader.class")` instead of `ClassLoader.getResourceAsStream("/java/lang/ClassLoader.class")`.



## Class

### getResourceAsStream

Using `Class.getResourceAsStream`, you can either provide an absolute path starting with "/",
or provide a path relative to the relevant class, not starting with "/".
E.g. `ClassLoader.class.getResourceAsStream("ClassLoader.class")` or
`ClassLoader.class.getResourceAsStream("/java/lang/ClassLoader.class")` will normally both give you access to the class' byte code.

Both approaches do however require that the class files are available as resources on the class path
using the standard naming conventions for Java runtime environments.
There is no requirement that a Java runtime environment must operate this way.
Java classes may be generated dynamically, causing them to be known by the class loader, but not backed by persistent byte code.
Proprietary class loaders are also not required to use the same mapping between class names and resource paths as the standard class loaders.

## classes

First, you access the "classes" field of the `java.lang.ClassLoader` class to determine which classes are already loaded.
This is a `private` field and if you let your code run in an environment
where specialized class loaders are used (subclasses of `java.lang.ClassLoader`),
you have more or less no idea what is contained in that field.

```java
public abstract class ClassLoader {
    // The classes loaded by this class loader. The only purpose of this table
    // is to keep the classes from being GC'ed until the loader is GC'ed.
    private final Vector<Class<?>> classes = new Vector<>();

    // Invoked by the VM to record every loaded class with this loader.
    void addClass(Class<?> c) {
        classes.addElement(c);
    }
}
```
