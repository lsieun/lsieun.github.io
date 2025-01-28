---
title: "Module Types"
sequence: "105"
---

## Module Types

### Application modules

Application modules—A non-JDK module;
the modules Java developers create for their own projects, be they libraries, frameworks, or applications.
These are found on the module path. For the time being, they will be modular JARs.

### Initial module

Application module where compilation starts (for `javac`) or containing the main method (for `java`).

- how to specify it when launching the application with the java command.
- which module the compilation starts with.

### Root modules

Where the JPMS starts resolving dependencies.
In addition to containing the main class or the code to compile,
the **initial module** is also a **root module**.
In tricky situations, it can become necessary to define root modules beyond the initial one.

### Platform modules

Modules that make up the JDK.
These are defined by the Java SE Platform Specification (prefixed with `java.`)
as well as JDK-specific modules (prefixed with `jdk.`).

- they're stored in optimized form in a `modules` file in the runtime's `libs` directory.

### Incubator modules

Nonstandard platform modules whose names always start with `jdk.incubator`.
They contain experimental APIs
that could benefit from being tested by adventurous developers before being set in stone.

### System modules

In addition to creating a run-time image from a subset of platform modules,
`jlink` can also include application modules.
The platform and application modules found in such an image are collectively called its **system modules**.
To list them, use the `java` command in the image's `bin` directory and call `java --list-modules`.

### Observable modules

All **platform modules** in the current runtime as well as all **application modules** specified on the command line;
modules that the JPMS can use to fulfill dependencies.
Taken together, these modules make up the universe of **observable modules**.

### Base module

The distinction between application and platform modules exists only to make communication easier.
To the module system, all modules are the same, except one: the platform module `java.base`,
the so-called base module, plays a particular role.

## Other Types

Platform modules and most application modules have module descriptors that are given to them by the module's creator.
Do other modules exist? Yes:

- Explicit modules
- Automatic modules
- Named modules
- Unnamed modules

### Explicit modules

Platform modules and most application modules that have **module descriptors** given to them by the module's creator.

### Automatic modules

Automatic modules —Named modules **without a module description**
(spoiler: plain JARs on the module path).
These are application modules created by the runtime, not a developer.

### Named modules

Named modules —The set of **explicit modules** and **automatic modules**.
These modules have a name, either defined by a descriptor or inferred by the JPMS.

### Unnamed modules

Unnamed modules —Modules that aren't named (spoiler: class path content) and hence aren't explicit.

Both **automatic** and **unnamed modules** become relevant in the context of
migrating an application to the module system.

![](/assets/images/java/module/module-types.png)



