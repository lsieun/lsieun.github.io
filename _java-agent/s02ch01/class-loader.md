---
title: "ClassLoader"
sequence: "212"
---

[UP]({% link _java-agent/java-agent-01.md %})

```text
                                 ┌─── findClass ──────┼─── defineClass
ClassLoader ───┼─── loadClass ───┤
                                 └─── resolveClass
```

```text
                               ┌─── define: ClassLoader.defineClass
               ┌─── loading ───┤
               │               └─── transform
class state ───┤
               │               ┌─── redefine: Instrumentation.redefineClasses
               └─── loaded ────┤
                               └─── retransform: Instrumentation.retransformClasses
```

```text
                                 ┌─── findClass ──────┼─── defineClass --> ClassFileTransformer.transform
ClassLoader ───┼─── loadClass ───┤
                                 └─── resolveClass
```

## loadClass

- `findLoadedClass(String)`: This method is called to see if this `Class` has not loaded
- If not loaded, continue to go down, to see the **parent class loader**, recursive calls `loadClass()`
- If the **parent class loader** is `null`, **boot class loader** is used to find the corresponding Class
- If not found, call `findClass(String)`

```java
public abstract class ClassLoader {

    public Class<?> loadClass(String name) throws ClassNotFoundException {
        return loadClass(name, false);
    }

    protected Class<?> loadClass(String name, boolean resolve)
        throws ClassNotFoundException
    {
        synchronized (getClassLoadingLock(name)) {
            // First, check if the class has already been loaded
            Class<?> c = findLoadedClass(name);
            if (c == null) {
                long t0 = System.nanoTime();
                try {
                    if (parent != null) {
                        c = parent.loadClass(name, false);
                    } else {
                        c = findBootstrapClassOrNull(name);
                    }
                } catch (ClassNotFoundException e) {
                    // ClassNotFoundException thrown if class not found
                    // from the non-null parent class loader
                }

                if (c == null) {
                    // If still not found, then invoke findClass in order
                    // to find the class.
                    long t1 = System.nanoTime();
                    c = findClass(name);

                    // this is the defining class loader; record the stats
                    sun.misc.PerfCounter.getParentDelegationTime().addTime(t1 - t0);
                    sun.misc.PerfCounter.getFindClassTime().addElapsedTimeFrom(t1);
                    sun.misc.PerfCounter.getFindClasses().increment();
                }
            }
            if (resolve) {
                resolveClass(c);
            }
            return c;
        }
    }
}
```

## findClass

- This method finds the class with the fully qualified name as a parameter.
- Usually to be implemented by subclasses.

```java
public abstract class ClassLoader {
    protected Class<?> findClass(String name) throws ClassNotFoundException {
        throw new ClassNotFoundException(name);
    }
}
```

```java
public class URLClassLoader extends SecureClassLoader implements Closeable {
    protected Class<?> findClass(final String name)
        throws ClassNotFoundException
    {
        final Class<?> result;
        try {
            result = AccessController.doPrivileged(
                new PrivilegedExceptionAction<Class<?>>() {
                    public Class<?> run() throws ClassNotFoundException {
                        String path = name.replace('.', '/').concat(".class");
                        Resource res = ucp.getResource(path, false);
                        if (res != null) {
                            try {
                                return defineClass(name, res);
                            } catch (IOException e) {
                                throw new ClassNotFoundException(name, e);
                            }
                        } else {
                            return null;
                        }
                    }
                }, acc);
        } catch (java.security.PrivilegedActionException pae) {
            throw (ClassNotFoundException) pae.getException();
        }
        if (result == null) {
            throw new ClassNotFoundException(name);
        }
        return result;
    }
}
```

## defineClass

- This method is responsible for the conversion of **an array of bytes** into **an instance of a class**.
- And before we use the class, we need to **resolve** it.

```java
public abstract class ClassLoader {

    protected final Class<?> defineClass(String name, byte[] b, int off, int len)
        throws ClassFormatError
    {
        return defineClass(name, b, off, len, null);
    }

    protected final Class<?> defineClass(String name, byte[] b, int off, int len,
                                         ProtectionDomain protectionDomain)
        throws ClassFormatError
    {
        protectionDomain = preDefineClass(name, protectionDomain);
        String source = defineClassSourceLocation(protectionDomain);
        Class<?> c = defineClass1(name, b, off, len, protectionDomain, source);
        postDefineClass(c, protectionDomain);
        return c;
    }

}
```

## resolveClass

For a given class, `resolveClass` method resolves all the immediately needed class references for the class;
this will result in recursively calling the class loader to ask it to load the referenced class.

```java
public abstract class ClassLoader {
    protected final void resolveClass(Class<?> c) {
        resolveClass0(c);
    }

    private native void resolveClass0(Class<?> c);
}
```

## 总结

本文内容总结如下：

- 第一点，`ClassLoader` 当中这几个方法之间的调用顺序：`loadClass` --> `findClass` --> `defineClass` --> `resolveClass`
- 第二点，这四个方法中，我们关注的重点是 `defineClass`，它这里对应了 Java Agent 当中的 “define” 这个概念。

