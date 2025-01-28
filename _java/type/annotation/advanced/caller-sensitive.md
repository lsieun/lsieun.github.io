---
title: "@CallerSensitive"
sequence: "106"
---

Methods that behave differently when called from different places are **caller sensitive** methods.

You will find methods such as `Module.addExports` to be annotated with `@CallerSensitive` in the JDK source code.

```java
public final class Module implements AnnotatedElement {
    @CallerSensitive
    public Module addExports(String pn, Module other);
}
```

Caller sensitive methods can find out which class (and module) is calling them, based on the current callstack.
The privilege of getting this information and basing decisions on it is reserved for code in `java.base`
(although the new `StackWalker` API introduced through [JEP 259: Stack-Walking API](https://openjdk.java.net/jeps/259)
in JDK 9 opens this possibility for application code as well).

```java
package jdk.internal.reflect;

public class Reflection {
    @CallerSensitive
    @HotSpotIntrinsicCandidate
    public static native Class<?> getCallerClass();
}
```

## Example

```java
package sample;

import jdk.internal.reflect.CallerSensitive;
import jdk.internal.reflect.Reflection;

public class HelloWorld {
    @CallerSensitive
    public static void testCallerClass() {
        Class<?> caller = Reflection.getCallerClass();
        System.out.println("Caller: " + caller.getName());
    }
}
```

```java
package sample;

public class Main {
    public static void main(String[] args) {
        HelloWorld.testCallerClass();
    }
}
```

```text
javac --add-exports java.base/jdk.internal.reflect=lsieun.app
```

```text
$ java --patch-module java.base=lsieun-app-1.0-SNAPSHOT.jar --module java.base/sample.Main
WARNING: module-info.class ignored in patch: lsieun-app-1.0-SNAPSHOT.jar
Caller: sample.Main
```

## CallerSensitive

[`sun/reflect/CallerSensitive.java`](https://hg.openjdk.java.net/jdk8/jdk8/jdk/file/tip/src/share/classes/sun/reflect/CallerSensitive.java)

```java
package sun.reflect;

import java.lang.annotation.*;
import static java.lang.annotation.ElementType.*;

/**
 * A method annotated @CallerSensitive is sensitive to its calling class,
 * via sun.reflect.ReflectiongetCallerClass() or via some equivalent.
 *
 * @author John R. Rose
 */
@Retention(RetentionPolicy.RUNTIME)
@Target({METHOD})
public @interface CallerSensitive {
}
```

A **caller-sensitive** method varies its behavior according to the class of its immediate caller.
It discovers its caller's class by invoking the `sun.reflect.Reflection.getCallerClass` method.

[`sun/reflect/Reflection.java`](https://hg.openjdk.java.net/jdk8/jdk8/jdk/file/tip/src/share/classes/sun/reflect/Reflection.java)

```java
package sun.reflect;

public class Reflection {
    /**
     *  Returns the class of the caller of the method calling this method,
     *  ignoring frames associated with java.lang.reflect.Method.invoke() and its implementation.
     */
    @CallerSensitive
    public static native Class<?> getCallerClass();
}
```

The problem, it seems, before [JEP 176: Mechanical Checking of Caller-Sensitive](http://openjdk.java.net/jeps/176),
was that if the caller sensitive method was called through reflection instead of directly,
there had to be a complex process to identify what the actual calling class was.
This was problematic if the method was invoked through reflection.
A simpler process was proposed (and introduced) with `@CallerSensitive`.

Basically, the `@CallerSensitive` annotation is used by the **JVM**:
The JVM will track this annotation and, optionally,
enforce the invariant that the `sun.reflect.Reflection.getCallerClass` method can only report the caller of a method
when that method is marked with this annotation.

`Reflection.getCallerClass()` 要求调用者必须有 `@CallerSensitive` 注解，并且必须有权限（由 bootstrap class loader 或者 extension class loader 加载的类）才可以调用。

## Example

### Java 8

```java
package sample;

import sun.reflect.CallerSensitive;
import sun.reflect.Reflection;

public class HelloWorld {
    @CallerSensitive
    public static void test() {
        new Exception("Exception from HelloWorld").printStackTrace(System.out);
        Class<?> callerClass = Reflection.getCallerClass();
        System.out.println("Caller: " + callerClass);
    }
}
```

```java
package sample;

import java.lang.reflect.Method;

public class Program {
    public static void main(String[] args) throws Exception {
        Class<?> clazz = Class.forName("sample.HelloWorld");
        Method m = clazz.getMethod("test");
        m.invoke(null);
    }
}
```

```text
java.lang.Exception: Exception from HelloWorld
	at sample.HelloWorld.test(HelloWorld.java:9)
	at sun.reflect.NativeMethodAccessorImpl.invoke0(Native Method)
	at sun.reflect.NativeMethodAccessorImpl.invoke(NativeMethodAccessorImpl.java:62)
	at sun.reflect.DelegatingMethodAccessorImpl.invoke(DelegatingMethodAccessorImpl.java:43)
	at java.lang.reflect.Method.invoke(Method.java:498)
	at sample.Program.main(Program.java:9)
Exception in thread "main" java.lang.reflect.InvocationTargetException
	at sun.reflect.NativeMethodAccessorImpl.invoke0(Native Method)
	at sun.reflect.NativeMethodAccessorImpl.invoke(NativeMethodAccessorImpl.java:62)
	at sun.reflect.DelegatingMethodAccessorImpl.invoke(DelegatingMethodAccessorImpl.java:43)
	at java.lang.reflect.Method.invoke(Method.java:498)
	at sample.Program.main(Program.java:9)
Caused by: java.lang.InternalError: CallerSensitive annotation expected at frame 1
	at sun.reflect.Reflection.getCallerClass(Native Method)
	at sample.HelloWorld.test(HelloWorld.java:10)
	... 5 more
```

```text
$ java -Xbootclasspath/a:./target/classes sample.Program
```

Output:

```text
java.lang.Exception: Exception from HelloWorld
	at sample.HelloWorld.test(HelloWorld.java:9)
	at sun.reflect.NativeMethodAccessorImpl.invoke0(Native Method)
	at sun.reflect.NativeMethodAccessorImpl.invoke(NativeMethodAccessorImpl.java:62)
	at sun.reflect.DelegatingMethodAccessorImpl.invoke(DelegatingMethodAccessorImpl.java:43)
	at java.lang.reflect.Method.invoke(Method.java:498)
	at sample.Program.main(Program.java:9)
Caller: class sample.Program
```

### Java 11

```java
package sample;

import jdk.internal.reflect.CallerSensitive;
import jdk.internal.reflect.Reflection;

public class HelloWorld {
    @CallerSensitive
    public static void test() {
        new Exception("Exception from sample.HelloWorld").printStackTrace(System.out);
        Class<?> callerClass = Reflection.getCallerClass();
        System.out.println("Caller: " + callerClass);
    }
}
```

```java
package sample;

import java.lang.reflect.Method;

public class Program {
    public static void main(String[] args) throws Exception {
        Class<?> clazz = Class.forName("sample.HelloWorld");
        Method m = clazz.getMethod("test");
        m.invoke(null);
    }
}
```

```text
$ javac --add-exports java.base/jdk.internal.reflect=ALL-UNNAMED
```

```text
$ java -Xbootclasspath/a:./target/classes --add-opens java.base/jdk.internal.reflect=ALL-UNNAMED sample.Program
```

Output:

```text
java.lang.Exception: Exception from sample.HelloWorld
	at sample.HelloWorld.test(HelloWorld.java:9)
	at java.base/jdk.internal.reflect.NativeMethodAccessorImpl.invoke0(Native Method)
	at java.base/jdk.internal.reflect.NativeMethodAccessorImpl.invoke(NativeMethodAccessorImpl.java:62)
	at java.base/jdk.internal.reflect.DelegatingMethodAccessorImpl.invoke(DelegatingMethodAccessorImpl.java:43)
	at java.base/java.lang.reflect.Method.invoke(Method.java:566)
	at sample.Program.main(Program.java:9)
Caller: class sample.Program
```

## StackWalker

The equivalent would be `java.lang.StackWalker.getCallerClass` since Java SE 9.

```java
package sample;

public class HelloWorld {
    public static void test() {
        new Exception("Exception from sample.HelloWorld").printStackTrace(System.out);
        Class<?> callerClass = StackWalker.getInstance(StackWalker.Option.RETAIN_CLASS_REFERENCE).getCallerClass();
        System.out.println("Caller: " + callerClass);
    }
}
```

```java
package sample;

import java.lang.reflect.Method;

public class Program {
    public static void main(String[] args) throws Exception {
        Class<?> clazz = Class.forName("sample.HelloWorld");
        Method m = clazz.getMethod("test");
        m.invoke(null);
    }
}
```

```text
java.lang.Exception: Exception from sample.HelloWorld
	at sample.HelloWorld.test(HelloWorld.java:5)
	at java.base/jdk.internal.reflect.NativeMethodAccessorImpl.invoke0(Native Method)
	at java.base/jdk.internal.reflect.NativeMethodAccessorImpl.invoke(NativeMethodAccessorImpl.java:62)
	at java.base/jdk.internal.reflect.DelegatingMethodAccessorImpl.invoke(DelegatingMethodAccessorImpl.java:43)
	at java.base/java.lang.reflect.Method.invoke(Method.java:566)
	at sample.Program.main(Program.java:9)
Caller: class sample.Program
```

## JDK

### Unsafe.java

[`sun/misc/Unsafe.java`](https://hg.openjdk.java.net/jdk8/jdk8/jdk/file/tip/src/share/classes/sun/misc/Unsafe.java)

```java
package sun.misc;

public final class Unsafe {
    /**
     * Provides the caller with the capability of performing unsafe operations.
     *
     * <p> The returned <code>Unsafe</code> object should be carefully guarded
     * by the caller, since it can be used to read and write data at arbitrary
     * memory addresses.  It must never be passed to untrusted code.
     *
     * <p> Most methods in this class are very low-level, and correspond to a
     * small number of hardware instructions (on typical machines).  Compilers
     * are encouraged to optimize these methods accordingly.
     *
     */
    @CallerSensitive
    public static Unsafe getUnsafe() {
        Class<?> caller = Reflection.getCallerClass();
        if (!VM.isSystemDomainLoader(caller.getClassLoader()))
            throw new SecurityException("Unsafe");
        return theUnsafe;
    }
}
```

### ClassLoader.java

[`java/lang/ClassLoader.java`](https://hg.openjdk.java.net/jdk8/jdk8/jdk/file/tip/src/share/classes/java/lang/ClassLoader.java)

```java
package java.lang;

public abstract class ClassLoader {
    @CallerSensitive
    public final ClassLoader getParent() {
        if (parent == null)
            return null;
        SecurityManager sm = System.getSecurityManager();
        if (sm != null) {
            checkClassLoaderPermission(this, Reflection.getCallerClass());
        }
        return parent;
    }

    @CallerSensitive
    public static ClassLoader getSystemClassLoader() {
        initSystemClassLoader();
        if (scl == null) {
            return null;
        }
        SecurityManager sm = System.getSecurityManager();
        if (sm != null) {
            checkClassLoaderPermission(scl, Reflection.getCallerClass());
        }
        return scl;
    }
}
```

### Class.java

[`java/lang/Class.java`](https://hg.openjdk.java.net/jdk8/jdk8/jdk/file/tip/src/share/classes/java/lang/Class.java)

```java
package java.lang;

public final class Class<T> implements java.io.Serializable,
        GenericDeclaration,
        Type,
        AnnotatedElement {
    @CallerSensitive
    public static Class<?> forName(String className) throws ClassNotFoundException {
        return forName0(className, true, ClassLoader.getClassLoader(Reflection.getCallerClass()));
    }

    @CallerSensitive
    public static Class<?> forName(String name, boolean initialize, ClassLoader loader) throws ClassNotFoundException
    {
        if (sun.misc.VM.isSystemDomainLoader(loader)) {
            SecurityManager sm = System.getSecurityManager();
            if (sm != null) {
                ClassLoader ccl = ClassLoader.getClassLoader(Reflection.getCallerClass());
                if (!sun.misc.VM.isSystemDomainLoader(ccl)) {
                    sm.checkPermission(SecurityConstants.GET_CLASSLOADER_PERMISSION);
                }
            }
        }
        return forName0(name, initialize, loader);
    }

    @CallerSensitive
    public ClassLoader getClassLoader() {
        ClassLoader cl = getClassLoader0();
        if (cl == null)
            return null;
        SecurityManager sm = System.getSecurityManager();
        if (sm != null) {
            ClassLoader.checkClassLoaderPermission(cl, Reflection.getCallerClass());
        }
        return cl;
    }
}
```

## @CallerSensitive

```java
public abstract class ClassLoader {
    @CallerSensitive
    protected static boolean registerAsParallelCapable() {
        Class<? extends ClassLoader> callerClass =
                Reflection.getCallerClass().asSubclass(ClassLoader.class);
        return ParallelLoaders.register(callerClass);
    }
}
```

## Reference

- [JEP 176: Mechanical Checking of Caller-Sensitive](http://openjdk.java.net/jeps/176)
- [CallerSensitive.java](https://hg.openjdk.java.net/jdk8/jdk8/jdk/file/tip/src/share/classes/sun/reflect/CallerSensitive.java)
