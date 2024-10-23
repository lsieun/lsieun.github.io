---
title: "Module Reflection"
sequence: "104"
---

## Modifying Modules

In addition to analyzing a module's properties,
you can also use `Module` to modify them by calling these methods:

- `addExports` exports a package to a module.
- `addOpens` opens a package to a module.
- `addReads` lets the module read another one.
- `addUses` makes the module use a service.

There's no `addProvides` method,
because exposing new implementations that were not known at compile-time is deemed to be a rare use case.

```java
package java.lang;

public final class Module implements AnnotatedElement {
    @CallerSensitive
    public Module addReads(Module other) {
        if (this.isNamed()) {
            Module caller = getCallerModule(Reflection.getCallerClass());
            if (caller != this) {
                throw new IllegalCallerException(caller + " != " + this);
            }
            implAddReads(other, true);
        }
        return this;
    }
    
    @CallerSensitive
    public Module addExports(String pn, Module other) {
        if (isNamed()) {
            Module caller = getCallerModule(Reflection.getCallerClass());
            if (caller != this) {
                throw new IllegalCallerException(caller + " != " + this);
            }
            implAddExportsOrOpens(pn, other, /*open*/false, /*syncVM*/true);
        }

        return this;
    }

    @CallerSensitive
    public Module addOpens(String pn, Module other) {
        if (isNamed()) {
            Module caller = getCallerModule(Reflection.getCallerClass());
            // forward open packages
            if (caller != this && (caller == null || !isOpen(pn, caller)))
                throw new IllegalCallerException(pn + " is not open to " + caller);
            implAddExportsOrOpens(pn, other, /*open*/true, /*syncVM*/true);
        }

        return this;
    }

    @CallerSensitive
    public Module addUses(Class<?> service) {
        if (isNamed() && !descriptor.isAutomatic()) {
            Module caller = getCallerModule(Reflection.getCallerClass());
            if (caller != this) {
                throw new IllegalCallerException(caller + " != " + this);
            }
            implAddUses(service);
        }

        return this;
    }
}
```

```text
Module target = ...; // Somehow obtain the module you want to export to
Module module = getClass().getModule(); // Get the module of the current class
module.addExports("javamodularity.export.atruntime", target);
```

When looking these over, you may wonder why it's possible to export or open packages of a module.
Doesn't that go against **strong encapsulation**?

Here's the thing: these methods are **caller sensitive**(`@CallerSensitive`),
meaning they behave differently based on the code that calls them.
For the call to succeed, it either has to come
from within **the module that's being modified** or from **the unnamed module**.
Otherwise it will fail with an `IllegalCallerException`.

```text
public boolean openJavaLangTo(Module module) {
    Module base = Object.class.getModule();
    base.addOpens("java.lang", module);
    return base.isOpen("java.lang", module);
}
```

When you try to add an export to any module other than the **current module** where the call is executing from,
an exception is thrown by the VM.
You cannot escalate privileges of a module from the outside through the module reflection API.

Using reflection to change module behavior at run-time goes against the philosophy of the Java module system.

## Annotations

Modules can also be annotated.
At run-time, those annotations can be read through the `java.lang.Module` API.
Several default annotations that are part of the Java platform can be applied to modules,
for example, the `@Deprecated` annotation:

```java
@Deprecated
module m {
}
```

When you require a deprecated module, the compiler generates a warning.
Another default annotation that can be applied to modules is `@SuppressWarnings`.

It's also possible to define your own annotations for modules.
To this end, a new target element type `ElementType.MODULE` is defined:

```java
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Retention(RetentionPolicy.RUNTIME)
@Target(value = {ElementType.MODULE, ElementType.PACKAGE})
public @interface CustomAnnotation {
}
```

```java
import lsieun.core.annotation.CustomAnnotation;

@CustomAnnotation
module lsieun.app {
    requires lsieun.core;
}
```

`Module` implements `AnnotatedElement`.
In code, you can use `getAnnotations` on a `Module` instance to get an array of all annotations on a module.
The `AnnotatedElement` interface offers various other methods to find the right annotation.

