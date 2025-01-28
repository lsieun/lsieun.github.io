---
title: "Context Classloader"
sequence: "105"
---


In general, context class loaders provide an alternative method to the class-loading delegation scheme introduced in J2SE.

Like we've learned before, classloaders in a JVM follow a hierarchical model such that every class loader has a single parent with the exception of the bootstrap class loader.

However, sometimes when JVM core classes need to dynamically load classes or resources provided by application developers, we might encounter a problem.

For example, in JNDI the core functionality is implemented by bootstrap classes in rt.jar. But these JNDI classes may load JNDI providers implemented by independent vendors (deployed in the application classpath). This scenario calls for the bootstrap class loader (parent class loader) to load a class visible to application loader (child class loader).

J2SE delegation doesn't work here and to get around this problem, we need to find alternative ways of class loading. And it can be achieved using thread context loaders.

The `java.lang.Thread` class has a method `getContextClassLoader()` that returns the `ContextClassLoader` for the particular thread.
The `ContextClassLoader` is provided by the creator of the thread when loading resources and classes.

If the value isn't set, then it defaults to the class loader context of the parent thread.

在 `sun.misc.Launcher` 类的构造方法 `Launcher()` 里，对 Context ClassLoader 进行了设置：

```java
public class Launcher {
    private ClassLoader loader;

    public Launcher() {
        // Create the extension class loader
        ClassLoader extClassLoader;
        try {
            extClassLoader = ExtClassLoader.getExtClassLoader();
        } catch (IOException e) {
            throw new InternalError("Could not create extension class loader", e);
        }

        // Now create the class loader to use to launch the application
        try {
            loader = AppClassLoader.getAppClassLoader(extClassLoader);
        } catch (IOException e) {
            throw new InternalError("Could not create application class loader", e);
        }

        // Also set the context class loader for the primordial thread.
        Thread.currentThread().setContextClassLoader(loader);
        
        // ...
    }
}
```

## Reference

- [Class Loaders in Java](https://www.baeldung.com/java-classloaders)

