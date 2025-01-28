---
title: "Module Path"
sequence: "101"
---

Before Java 9, you would have used the **class path**, which had plain JARs on it,
to inform compiler and runtime where to find artifacts.
They search it when they're looking for individual types required during compilation or execution.

The module system, on the other hand, promises not to operate on **types**,
but to go one level above them and manage **modules** instead.
One way this approach is expressed is a new concept
that parallels the **class path** but expects **modules** instead of **bare types** or **plain JARs**.

- module path
    - modules
- class path
    - bare types
    - plain JARs

It's important to clarify that only the **module path** processes artifacts as **modules**.
Armed with that knowledge, you can be a little more precise about
what constitutes the universe of **observable modules**.

All **platform modules** in the current runtime as well as
all application modules specified on the command line are called **observable**,
and together they make up the **universe of observable modules**.

the **module path** interpreting every artifact as a module,
the **class path** treats all artifacts as plain JARs, regardless of whether they contain a module descriptor.

> 使用--module-path和--classpath在处理Jar包上的区别

## Module path

A **module path** is a sequence, each element of which is either a **module definition** or **a directory containing module definitions**.

> module path是module definition组成

Each **module definition** is either

- **A module artifact**, i.e., a modular JAR file or a JMOD file containing a compiled module definition, or else
- **An exploded-module directory** whose name is, by convention, the module's name and whose content is an "exploded" directory tree corresponding to a package hierarchy.

> 这里讲module definition的定义

In the latter case **the directory tree** can be **a compiled module definition**,
populated with individual class and resource files and a `module-info.class` file at the root or,
at compile time, **a source module definition**, populated with individual source files and a `module-info.java` file at the root.

```text
                                                       ┌─── a modular JAR file
                     ┌─── module artifact ─────────────┤
                     │                                 └─── a JMOD file
module definition ───┤
                     │                                 ┌─── a compiled module definition
                     └─── exploded-module directory ───┤
                                                       └─── a source module definition
```

A **module path**, like other kinds of paths, is specified by a string of path names separated by
the host platform's path-separator character (':' on most platforms, ';' on Windows).

> module path的分隔符

### module path vs class path

**Module paths** are very different from **class paths**:
Class paths are a means to locate definitions of individual types and resources,
whereas module paths are a means to locate definitions of whole modules.

> 两个概念的差异：class path是“细粒度”的概念，module path是“粗粒度”的概念

Each element of a **class path** is a container of type and resource definitions,
i.e., either a JAR file or an exploded, package-hierarchical directory tree.

> class path

Each element of a **module path**, by contrast, is a module definition or
a directory which each element in the directory is a module definition,
i.e., a container of type and resource definitions,
i.e., either a modular JAR file, a JMOD file, or an exploded module directory.

> module path

### resolution order 

During the resolution process the module system locates a module

> module system如何定位一个module。注意：下面引入了一个概念phase

- by searching along several different paths, dependent upon the phase,
- and also by searching the compiled modules built-in to the environment,

in the following order:

- The **compilation module path** (specified by the command-line option `--module-source-path`) contains module definitions in source form (**compile time only**).

- The **upgrade module path** (`--upgrade-module-path`) contains **compiled definitions of modules**
  intended to be used in preference to the compiled definitions of any upgradeable modules present
  amongst the **system modules** or on the **application module path** (**compile time** and **run time**).

- The **system modules** are the compiled modules built-in to the environment (**compile time** and **run time**).
  These typically include **Java SE and JDK modules** but, in the case of a **custom linked image**,
  can also include **library and application modules**.
  At **compile time** the **system modules** can be overridden via the `--system` option,
  which specifies a JDK image from which to load system modules.

- The **application module path** (`--module-path`, or `-p` for short) contains **compiled definitions** of
  library and application modules (all phases).
  At **link time** this path can also contain Java SE and JDK modules.

The module definitions present on these paths, together with the **system modules**, define the **universe of observable modules**.

```text
universe of observable modules = system modules + module definition on module pathes
```

```text
                                   ┌─── a compiled module definition
                     ┌─── state ───┤
                     │             └─── a source module definition
                     │
module resolution ───┤
                     │             ┌─── compile time
                     │             │
                     └─── phase ───┼─── runtime
                                   │
                                   └─── link time
```

When searching a module path for a module of a particular name,
the module system takes the first definition of a module of that name.

> 当有多个module path当中，包含同名的module，那么选择第一个遇到的。

Version strings, if present, are ignored;
if an element of a module path contains definitions of multiple modules with the same name
then resolution fails and the compiler, linker, or virtual machine will report an error and exit.
It is the responsibility of build tools and container applications to configure module paths so as to avoid version conflicts;
it is not a goal of the module system to address the version-selection problem.

> 如果在同一个module path当中，有同名的module，就会报错。

The **module path** is a list whose elements are **artifacts** or **directories** that contain artifacts.

Depending on the OS, **module path elements** are separated by `:` (Unix-based) or `;` (Windows).
It's used by the module system to locate required modules that aren't found among the platform modules.
Both `javac` and `java` as well as other module-related commands can process it—
the command-line options are `--module-path` and `-p`.

For your own module to be found, you have to use the **module path**,
a concept paralleling the **class path** but expecting **modular JARs** instead of **plain JARs**.
It will be scanned when the compiler searches for referenced modules.

To define the **module path**, `javac` has a new option: `--module-path`, or `-p` for short.
(The same line of thought is true for launching the application with the JVM.
Accordingly, the same options, `--module-path` and `-p`, were added to `java` as well, where they function just the same.)

```text
javac -d monitor.observer/target/classes ${source-files}
jar --create --file mods/monitor.observer.jar -C monitor.observer/target/classes
```

```text
javac --module-path mods -d monitor.observer.alpha/target/classes ${source-files}
jar --create --file mods/monitor.observer.alpha.jar -C monitor.observer.alpha/target/classes
```

依赖第三方的Jar包：

```text
javac --module-path mods:libs -d monitor.rest/target/classes ${source-files}
```

有`main`方法：

```text
jar --create --file mods/monitor.jar --main-class monitor.Monitor -C monitor/target/classes
```

These JAR files are just like **plain old JARs**, with one exception:
each contains a module descriptor `module-info.class` that marks it as a **modular JAR**.

## Run

```text
java --module-path mods:libs --module monitor
```

The commands `javac`, `jar`, and `java` have been updated to work with modules.
The most obvious and relevant change is the **module path** (command-line option `--module-path` or `-p`).
It parallels the **class path** but is used for **modules**.

## Module resolution: Analyzing and verifying an application's structure

- root module

### root module

The process has to start somewhere,
so the module system's first order of business is to decide on the set of **root modules**.

There are several ways to make a module a root, but the most prominent is specifying the **initial module**.
For the compiler, that's either the module under compilation (if a module declaration is among the source files)
or the one specified with `--module` (if the module source path is used).
In the case of launching the virtual machine, only the `--module` option remains.

### resolves dependencies

Next, the module system **resolves** dependencies.
It checks the root modules' declarations to see
which other modules they depend on and tries to satisfy each dependency with an observable module.
It then goes on to do the same with those modules and so forth.
This continues until either all transitive dependencies of the **initial module** are fulfilled
or the configuration is identified as unreliable.

### module present

Next, let's assume all modules were resolved.
If no errors were found, the module system guarantees that each required module is present.

There are no additional checks during this phase,
so if a module depends on, for example, `com.google.common` (the module name for Google's Guava library)
and an empty module with that name was found, the module system is content.
But the missing types will still cause trouble down the road, in the form of compile-time or run-time errors.
While empty modules are unlikely, a module with a different version than expected,
missing a couple of types, isn't implausible.
Still, a reliable configuration will greatly reduce the number of `NoClassDefFoundError`s that crop up during execution.

## Module graph: Representation of an application's structure

### Module graph

In a module graph, modules (as nodes) are connected according to their dependencies (with directed edges).
The edges are the basis for readability.
The graph is constructed during **module resolution** and available at **run time via the reflection API**.

- module graph
  - module resolution
  - run time: reflection

### Adding modules to the graph

It's important to note that modules that didn't make it into the **module graph** during **resolution**
aren't available later during **compilation** or **execution**, either.

Various use cases can lead to the scenario of modules not making it into the **graph**.
One of them is reflection.
It can be used to have code in one module call code in another without explicitly depending on it.
But without that dependency, the depended-on module may not make it into the graph.

The option `--add-modules ${modules}`, available on `javac` and `java`,
takes a comma-separated list of module names and defines them as **root modules** beyond the **initial module**.
(**root modules** form the initial set of modules from which the module graph is built by resolving their dependencies.)
This enables users to add modules (and their dependencies) to the module graph
that would otherwise not show up because the initial module doesn't directly or indirectly depend on them.

```text
java
--module-path mods:libs
--add-modules monitor.statistics.fancy
--module monitor
```

The `--add-modules` option has three special values: `ALL-DEFAULT`, `ALL-SYSTEM`, and `ALL-MODULE-PATH`.
The first two only work at run time and are used for edge cases.
The last one can be useful, though: with it, all modules on the module path become **root modules**,
and hence all of them make it into the module graph.

Because you can add modules to the graph,
it's only natural to wonder whether you can also remove them.
The answer is yes, kind of: the option `--limit-modules` goes in that direction.

### Adding edges to the graph

When a module is added explicitly, it's on its own in the module graph, without any incoming reads edges.
If access to it is **purely reflective**, that's fine, because the **reflection API implicitly adds a reads edge**.
But for regular access, such as when importing a type from it, **accessibility** rules require **readability**.

```text
java
--module-path mods:libs
--add-modules monitor.statistics.fancy
--add-reads monitor.statistics=monitor.statistics.fancy
--module monitor
```

The compiler-time and run-time option `--add-reads ${module}=${targets}`
adds reads edges from `${module}` to all modules in the comma-separated list ${targets}.
This allows `${module}` to access all public types in packages exported by those modules
even though it has no `requires` directives mentioning them.
If `${targets}` includes `ALL-UNNAMED`, `${module}` can read the class-path content.

## 多个module path中有同名的module

if the module path consists of several entries (directories or individual JARs),
ambiguity checks aren't applied across them!
Each individual entry must contain a module only once;
but if several different entries contain the same module,
the first one (in the order in which they were named on the module path) is picked—it **shadows** the other modules.











