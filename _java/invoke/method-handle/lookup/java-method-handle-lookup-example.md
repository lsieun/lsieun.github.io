---
title: "Lookup Intro"
sequence: "101"
---


```java
import java.lang.invoke.MethodHandle;
import java.lang.invoke.MethodHandles;
import java.lang.invoke.MethodType;

public class MethodLookupRun {
    public static void main(String[] args) throws NoSuchMethodException, IllegalAccessException {
        MethodType methodType = MethodType.methodType(String.class);
        MethodHandles.Lookup lookup = MethodHandles.lookup();
        MethodHandle methodHandle = lookup.findVirtual(String.class, "toString", methodType);
        System.out.println(methodHandle);
    }
}
```

## Access Control

One big difference between the Reflection and Method Handles APIs is **access control**.
A `Lookup` object will only return methods
that are accessible to the context where the lookup was created -
and there is no way to subvert this (no equivalent of Reflection's `setAccessible()` hack).

```java
import java.lang.invoke.MethodHandle;
import java.lang.invoke.MethodHandles;
import java.lang.invoke.MethodType;

public class LookupRun {
    public static void lookupDefineClass(MethodHandles.Lookup l) {
        MethodType mt = MethodType.methodType(
                Class.class,
                String.class,
                byte[].class, int.class, int.class);

        try {
            MethodHandle mh = l.findVirtual(ClassLoader.class, "defineClass", mt);
            System.out.println(mh);
        } catch (NoSuchMethodException | IllegalAccessException e) {
            e.printStackTrace();
        }
    }

    public static void main(String[] args) {
        MethodHandles.Lookup l = MethodHandles.lookup();
        lookupDefineClass(l);
    }
}
```

Method handles therefore always comply with the security manager,
even when the equivalent reflective code does not.
They are access-checked at the point where the lookup context is constructed -
the lookup object will not return handles to any methods to which it does not have proper access.

The lookup object, or method handles derived from it, can be returned to other contexts,
including ones where access to the method would no longer be possible.
Under those circumstances, the handle is still executable - **access control is checked at lookup time**.

```java
import java.lang.invoke.MethodHandle;
import java.lang.invoke.MethodHandles;
import java.lang.invoke.MethodType;

public class LookupRun {
    public static void lookupDefineClass(MethodHandles.Lookup l) {
        MethodType mt = MethodType.methodType(
                Class.class,
                String.class,
                byte[].class, int.class, int.class);

        try {
            MethodHandle mh = l.findVirtual(ClassLoader.class, "defineClass", mt);
            System.out.println(mh);
        } catch (NoSuchMethodException | IllegalAccessException e) {
            e.printStackTrace();
        }
    }

    public static class SneakyLoader extends ClassLoader {
        public SneakyLoader() {
            super(SneakyLoader.class.getClassLoader());
        }

        public MethodHandles.Lookup getLookup() {
            return MethodHandles.lookup();
        }
    }

    public static void main(String[] args) {
        MethodHandles.Lookup lookup = MethodHandles.lookup();
        lookupDefineClass(lookup);

        SneakyLoader classloader = new SneakyLoader();
        MethodHandles.Lookup lookupFromClassloader = classloader.getLookup();
        lookupDefineClass(lookupFromClassloader);
    }
}
```
