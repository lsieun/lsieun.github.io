---
title: "Module And Reflection"
sequence: "104"
---

When doing reflection, the runtime takes care of automatically setting up a **readability relation** (`requires`),
so this step is taken care of.
Next it will find out that the class is not exported nor opened (and therefore not accessible) at run-time,
and this is not automatically “fixed” by the runtime.

If the runtime is smart enough to add a **readability relation** automatically,
why doesn't it also take care of opening the package?
This is about **intentions** and **module ownership**.
When code uses reflection to access code in another module,
the **intention** from that module's perspective is clearly to read the other module.
It would be unnecessary extra boilerplate to be (even more) explicit about this.
The same is not true for `exports`/`opens`.
The **module owner** should decide which packages are exported or opened.
Only the module itself should define this intention,
so it can't be automatically inferred by the behavior of some other module.

By default Java 9 runs with `--illegal-acces=permit`.
Why did we still have to explicitly open our package for reflection?
Remember that the `--illegal-access` flag affects only code on the **classpath**.

## Not-Limited And Limited

### Not-Limited

The module system doesn't limit visibility:
calls like `Class::forName` or reflection to get references to constructors, methods, and fields succeed.

```java
module lsieun.utils {
    requires transitive lsieun.core;

    exports lsieun.utils;
}
```

```java
package lsieun.utils;

class PrintUtils {
    private static final int data = 10;

    private PrintUtils() {
    }

    static void sayPackageOnly() {
        System.out.println("Package Only");
    }

    private static void sayPrivate() {
        System.out.println("Private");
    }
}
```

```java
module lsieun.app {
    requires lsieun.utils;
}
```

```java
package sample;

import java.lang.reflect.Constructor;
import java.lang.reflect.Field;
import java.lang.reflect.Method;

public class HelloWorld {
    public static void main(String[] args) throws Exception {
        Class<?> clazz = Class.forName("lsieun.utils.PrintUtils");
        System.out.println("Class Name: " + clazz.getName());

        Constructor<?>[] constructors = clazz.getDeclaredConstructors();
        System.out.println("Constructor:");
        for (Constructor<?> c : constructors) {
            String constructorName = c.getName();
            System.out.println("    " + constructorName);
        }

        Field[] fields = clazz.getDeclaredFields();
        System.out.println("Field:");
        for (Field f : fields) {
            String fieldName = f.getName();
            System.out.println("    " + fieldName);
        }

        Method[] methods = clazz.getDeclaredMethods();
        System.out.println("Method:");
        for (Method m : methods) {
            String methodName = m.getName();
            System.out.println("    " + methodName);
        }
    }
}
```

### Limited

Accessibility is limited:
if access isn't given by the reflected module,
then invoking a constructor or method, accessing a field,
and calls to `AccessibleObject::setAccessible` will fail with an `InaccessibleObjectException`.

## Deep Reflection

**Deep reflection** is using the reflection API to get access to **nonpublic elements of a class**.

## Module Declarations

Oracle: [Module Declarations](https://docs.oracle.com/javase/specs/jls/se11/html/jls-7.html#jls-7.7)

For code outside a normal module,
the reflective access granted to types in the module's exported (and not opened) packages
is specifically to the public and protected types in those packages,
and the public and protected members of those types.
The reflective access granted to types in the module's opened packages
(whether exported or not) is to all types in those packages, and all members of those types. No reflective access is granted to types, or their members, in packages which are not exported or opened. Code inside the module enjoys reflective access to all types, and all their members, in all packages in the module.

For code outside an open module, the reflective access granted to types in the module's opened packages (that is, all packages in the module) is to all types in those packages, and all members of those types. Code inside the module enjoys reflective access to all types, and all their members, in all packages in the module.
