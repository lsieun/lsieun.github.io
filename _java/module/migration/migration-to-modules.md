---
title: "Migration to Modules"
sequence: "102"
---

## Migration Strategies

A typical application has application code (your code) and library code.

- application
  - application code
  - library code

## Mixing Classpath and Module Path

To make gradual migration possible, we can mix the usage of **classpath** and **module path**.
This is not an ideal situation, since we only partially benefit from the advantages of the Java module system.
However, it is extremely helpful for migrating in small steps.

```text
CP=lib/jackson-annotations-2.8.8.jar:
CP+=lib/jackson-core-2.8.8.jar:
CP+=lib/jackson-databind-2.8.8.jar

javac -cp $CP -d out --module-source-path src -m books
```

**Modules cannot read the classpath**, so our **module** can't access types on the **classpath**.

Not being able to read from the classpath is a good thing, even when it requires some work during migration,
because we want to be explicit about our dependencies.
When modules can read the classpath, besides their explicit dependencies, all bets are off.

If we can't rely on the classpath,
the only way forward is to make the code that our module relies on available as a module as well.

## Automatic Modules

The Java module system has a useful feature to deal with code that isn't a module yet: **automatic modules**.

An automatic module can be created by moving an existing JAR file from the classpath to the module path,
without changing its contents.
This turns the JAR into a module, with a module descriptor generated on the fly by the module system.
In contrast, **explicit modules** always have a user-defined module descriptor.
All modules we've seen so far, including platform modules, are explicit modules.
Automatic modules behave differently than explicit modules.

An automatic module has the following characteristics:

- It does not contain `module-info.class`.
- It has a module name specified in `META-INF/MANIFEST.MF` or derived from its filename.
- It **requires transitive all other resolved modules**.
- It exports all its packages.
- It reads the classpath (or more precisely, the **unnamed module**).
- It cannot have split packages with other modules.

What does it mean to **require transitive all other resolved modules**?
An automatic module requires every module in the already resolved module graph.
Remember, there still is no explicit information in an automatic module 
telling the module system which other modules it really needs.
This means the JVM can't warn at startup when dependencies of automatic modules are missing.
We, as developers, are responsible for making sure the module path (or classpath) contains all required dependencies.
This is not very different from working with the classpath.

All modules in the module graph are `required transitive` by **automatic modules**.
This effectively means that if you require one automatic module,
you get implied readability to all other modules “for free.”

The name of an automatic module can be specified
in the newly introduced `Automatic-Module-Name` field of a `META-INF/MANIFEST.MF` file.
This provides a way for library maintainers to choose a module name
even before they fully migrate the library to be a module.

If no name is specified, the module name is derived from the JAR's filename.
The naming algorithm is roughly the following:

- Dashes (`-`) are replaced by dots (`.`).
- Version numbers are omitted.

We can now successfully compile the program by using the following command:

```text
CP=lib/jackson-annotations-2.8.8.jar:
CP+=lib/jackson-core-2.8.8.jar

javac -cp $CP --module-path mods -d out --module-source-path src -m books
```

To run the program, we also have to update the java invocation:

```text
java -cp $CP --module-path mods:out -m books/demo.Main
```

### WARNINGS WHEN USING AUTOMATIC MODULES

Although **automatic modules** are essential to migration, they should be used with some caution.
Whenever you write a `requires` on an **automatic module**, make a mental note to come back to this later.
If the library is released as an **explicit module**, you want to use that instead.

**Two warnings** were added to the compiler to help with this as well.
Note that it is only a recommendation that Java compilers support these warnings,
so different compiler implementations may have different results.
The first warning is **opt out** (enabled by default),
and will give a warning for every `requires transitive` on an **automatic module**.
The warning can be disabled with the `-Xlint:-requires-transitive-automatic` flag.
Notice the dash (`-`) after the colon.
The second warning is **opt in** (disabled by default),
and will give a warning for every `requires` on an **automatic module**.
This warning can be enabled with the `-Xlint:requires-automatic` (no dash after the colon) flag.
The reason that the first warning is enabled by default is that it is a more dangerous scenario.
You expose a (possibly volatile) automatic module to consumers of your module through implied readability.

Replace **automatic modules** with **explicit modules** when available,
and ask the library maintainer for one if not available yet.
Also remember that such a module may have a more restricted API,
because the default of having all packages exported is likely not what the library maintainer intended.
This can lead to extra work when switching from an **automatic module** to an **explicit module**,
where the library maintainer has created a module descriptor.

## Automatic Modules and the Classpath

All code on the **classpath** is part of the **unnamed module**.

Code in a module you're compiling can't access code on the classpath.

The **unnamed module** exports all code on the classpath and reads all other modules.
There is a big restriction, however: **the unnamed module itself is readable only from automatic modules**!





