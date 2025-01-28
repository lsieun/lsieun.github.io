---
title: "Root modules"
sequence: "102"
---

The **module system** constructs a **module graph**
by resolving the transitive closure of the dependences of a set of **root modules**
with respect to the set of **observable modules**.

When the **compiler** (`javac`) compiles code in the **unnamed module**,
or the **java launcher** (`java`) is invoked and
the main class of the application is loaded from the **class path** into the **unnamed module** of the **application class loader**,
then the **** of **root modules** for the **unnamed module** is computed as follows:

- The `java.se` module is a root, if it exists.
  If it does not exist then every `java.*` module on the **upgrade module path** or
  among the system modules that exports at least one package, without qualification, is a root.

- Every non-`java.*` module on the **upgrade module path** or
  among the system modules that exports at least one package, without qualification, is also a root.

Otherwise, the default set of **root modules** depends upon the **phase**:

- At **compile time** it is usually the set of modules being compiled;

- At **link time** it is empty; and

- At **run time** it is the application's main module, as specified via the `--module` (or `-m` for short) launcher option.

It is occasionally necessary to add modules to the **default root set**
in order to ensure that specific platform, library, or service-provider modules will be present in the resulting module graph.
In any phase the option

```text
--add-modules <module>(,<module>)*
```

where `<module>` is a module name, adds the indicated modules to the default set of **root modules**.


This option may be used more than once.

> 可以使用多次

As a special case at **run time**,
if `<module>` is `ALL-DEFAULT` then the default set of **root modules** for the **unnamed module**,
as defined above, is added to the root set.
This is useful when the application is a container that hosts other applications
which can, in turn, depend upon modules not required by the container itself.

> special case - run time: ALL-DEFAULT

As a further special case at **run time**,
if `<module>` is `ALL-SYSTEM` then all system modules are added to the root set,
whether or not they are in the default set.
This is sometimes needed by test harnesses.
This option will cause many modules to be resolved; in general, `ALL-DEFAULT` should be preferred.

> special case - run time: ALL-SYSTEM

As a final special case, at both **run time** and **link time**,
if `<module>` is `ALL-MODULE-PATH` then all observable modules found on the relevant module paths are added to the root set.
`ALL-MODULE-PATH` is valid at both **compile time** and **run time**.
This is provided for use by build tools such as Maven,
which already ensure that all modules on the module path are needed.
It is also a convenient means to add automatic modules to the root set.

> special case - run time + link time: ALL-MODULE-PATH


