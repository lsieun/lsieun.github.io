---
title: "Module File Format"
sequence: "105"
---

Two file format:

- JMODs
- modular JARs

## Java modules (JMODs), shipped with the JDK

During the work on Project Jigsaw, the Java code base was split into about 100 modules,
which are delivered in a new format called `JMOD`.

It's deliberately unspecified to allow a more aggressive evolution
than was possible with the JAR format (which is essentially a ZIP file).
It's reserved for use by the JDK.

To see the modules contained in a JRE or JDK:

```text
java --list-modules
```

这里输出的信息来自于`JDK_HOME/lib/modules`文件。（这一点，有待于验证）

示例：

```text
$ java --list-modules
java.base@11.0.10
java.compiler@11.0.10
java.datatransfer@11.0.10
java.desktop@11.0.10
java.instrument@11.0.10
```

JDKs (not JREs) also contain the raw modules in a `jmods` folder;
and the new `jmod` tool, which you can find in the `bin` folder next to `jmods`,
can be used to output their properties with the `describe` operation.

```text
$ jmod --help
```

```text
$ jmod describe java.sql.jmod
java.sql@11.0.10
exports java.sql
exports javax.sql
requires java.base mandated
requires java.logging transitive
requires java.transaction.xa transitive
requires java.xml transitive
uses java.sql.Driver
platform windows-amd64
```

## Modular JARs: Home-grown modules

We aren't supposed to create JMODs, so how do we deliver the modules we create?
This is where **modular JARs** come in.

Definition: **Modular JAR** and **module descriptor**

A **modular JAR** is just a plain JAR, except for one small detail.
Its root directory contains a **module descriptor**: a `module-info.class` file.

The **module descriptor** holds all the information needed by the **module system**
to create a run-time representation of the module.
All properties of an individual module are represented in this file.

## Module declarations: Defining a module's properties

### Definition: Module declaration

A **module descriptor** is compiled from a **module declaration**.
By convention, this is a `module-info.java` file in the project's root source folder.
The declaration is the pivotal element of modules and thus the module system.

### **Declaration vs. description**

The **module declaration** determines a module's **identity** and **behavior** in the module system.

three basic properties lacking in JARs: **a name**, **explicit dependencies**, and **encapsulated internals**.

### naming modules

The most basic property that JARs are missing is **a name** that the compiler and JVM can use to identify them.

The **module system** leans heavily on a **module's name**.
Conflicting or evolving names in particular cause trouble,
so it's important that the name is

- globally unique
- stable

### requiring modules to express dependencies

Another thing we miss in JARs is the ability to **declare dependencies**.
With JARs, we never know what other artifacts they need to run properly,
and we depend on build tools or documentation to determine that.
With the module system, dependencies have to be made explicit.

**Dependencies** are declared with `requires` directives, which consist of the keyword followed by a **module name**.
The directive states that the declared module depends on the
named one and requires it during **compilation** and at **run time**.

If a dependency is declared with a `requires` directive,
the module system will throw an error if it can't find a module with that exact name.
Compiling as well as launching an application will fail if modules are missing.

- With plain JARs, the JVM sees only relations between **classes**.
- With the module system, the JVM can see relations between **modules**, operating on a higher level of abstraction.

![](/assets/images/java/module/plain-jar-vs-module-system.png)

### exporting packages to define a module's api

The `exports` directive defines a module's public API.
Here you can pick and choose which packages contain types that should be available outside the module and
which packages are only meant for internal use.

```text
module current.module.name {
    requires other.module.name;

    exports package.name.in.current.module;
}
```

The keyword `exports` is followed by the name of a package the module contains.
Only **exported packages** are usable outside the module;
all others are strongly encapsulated within it.

If a module wants to export two packages, it always needs two `exports` directives.
The module system also offers no wildcards like `exports java.util.*` to
make that easier—exposing an API should be a deliberate act.












