---
title: "JDK Dynamic Proxy Annotation"
sequence: "104"
---

## 示例

```java
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;

@Retention(RetentionPolicy.RUNTIME)
public @interface MyTag {
}
```

```java
@MyTag
public class HelloWorld {
}
```

```java
import java.lang.annotation.Annotation;
import java.util.Arrays;

public class Program {
    public static void main(String[] args) throws Exception {
        Class<?> clazz = HelloWorld.class;
        Annotation[] annotations = clazz.getAnnotations();
        System.out.println("Length: " + annotations.length);
        for (Annotation annotation : annotations) {
            Class<?> implClass = annotation.getClass();
            Class<?> superclass = implClass.getSuperclass();
            Class<?>[] interfaces = implClass.getInterfaces();
            System.out.println("Current Class: " + implClass);
            System.out.println("Super   Class: " + superclass);
            System.out.println("Interfaces   : " + Arrays.toString(interfaces));

            System.out.println("annotationType(): " + annotation.annotationType());
            System.out.println("========= ========= =========");
        }
    }
}
```

```text
Length: 1
Current Class: class com.sun.proxy.jdk.proxy2.$Proxy1
Super   Class: class java.lang.reflect.Proxy
Interfaces   : [interface sample.MyTag]
annotationType(): interface sample.MyTag
========= ========= =========
```

## 输出

使用 Java 8：

```text
-Dsun.misc.ProxyGenerator.saveGeneratedFiles=true
```

使用 Java 11：

```text
-Djdk.proxy.ProxyGenerator.saveGeneratedFiles=true
```

```text
package com.sun.proxy.jdk.proxy2;

import java.lang.invoke.MethodHandles;
import java.lang.reflect.InvocationHandler;
import java.lang.reflect.Method;
import java.lang.reflect.Proxy;
import java.lang.reflect.UndeclaredThrowableException;
import sample.MyTag;

public final class $Proxy1 extends Proxy implements MyTag {
    private static final Method m0;
    private static final Method m1;
    private static final Method m2;
    private static final Method m3;
    private static final Method m4;
    private static final Method m5;

    public $Proxy1(InvocationHandler var1) {
        super(var1);
    }

    public final int hashCode() {
        try {
            return (Integer)super.h.invoke(this, m0, (Object[])null);
        } catch (RuntimeException | Error var2) {
            throw var2;
        } catch (Throwable var3) {
            throw new UndeclaredThrowableException(var3);
        }
    }

    public final boolean equals(Object var1) {
        try {
            return (Boolean)super.h.invoke(this, m1, new Object[]{var1});
        } catch (RuntimeException | Error var2) {
            throw var2;
        } catch (Throwable var3) {
            throw new UndeclaredThrowableException(var3);
        }
    }

    public final String toString() {
        try {
            return (String)super.h.invoke(this, m2, (Object[])null);
        } catch (RuntimeException | Error var2) {
            throw var2;
        } catch (Throwable var3) {
            throw new UndeclaredThrowableException(var3);
        }
    }

    public final int age() {
        try {
            return (Integer)super.h.invoke(this, m3, (Object[])null);
        } catch (RuntimeException | Error var2) {
            throw var2;
        } catch (Throwable var3) {
            throw new UndeclaredThrowableException(var3);
        }
    }

    public final String name() {
        try {
            return (String)super.h.invoke(this, m4, (Object[])null);
        } catch (RuntimeException | Error var2) {
            throw var2;
        } catch (Throwable var3) {
            throw new UndeclaredThrowableException(var3);
        }
    }

    public final Class annotationType() {
        try {
            return (Class)super.h.invoke(this, m5, (Object[])null);
        } catch (RuntimeException | Error var2) {
            throw var2;
        } catch (Throwable var3) {
            throw new UndeclaredThrowableException(var3);
        }
    }

    static {
        try {
            m0 = Class.forName("java.lang.Object").getMethod("hashCode");
            m1 = Class.forName("java.lang.Object").getMethod("equals", Class.forName("java.lang.Object"));
            m2 = Class.forName("java.lang.Object").getMethod("toString");
            m3 = Class.forName("sample.MyTag").getMethod("age");
            m4 = Class.forName("sample.MyTag").getMethod("name");
            m5 = Class.forName("sample.MyTag").getMethod("annotationType");
        } catch (NoSuchMethodException var2) {
            throw new NoSuchMethodError(var2.getMessage());
        } catch (ClassNotFoundException var3) {
            throw new NoClassDefFoundError(var3.getMessage());
        }
    }

    private static MethodHandles.Lookup proxyClassLookup(MethodHandles.Lookup var0) throws IllegalAccessException {
        if (var0.lookupClass() == Proxy.class && var0.hasFullPrivilegeAccess()) {
            return MethodHandles.lookup();
        } else {
            throw new IllegalAccessException(var0.toString());
        }
    }
}
```

