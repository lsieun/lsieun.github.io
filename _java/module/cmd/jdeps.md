---
title: "jdeps"
sequence: "104"
---

`jdeps` is a tool shipped with the JDK
that analyzes code and gives insights about module dependencies.

`jdeps` analyzes **bytecode**, not **source files**,
so we're interested only in the application's output folder and JAR files.

## jdeps in classpath

We can analyze this application by using the following command:

```text
jdeps -recursive -summary -cp lib/*.jar out
```

The `-recursive` flag makes sure that transitive run-time dependencies are also analyzed.

The `-summary` flag, as the name suggests, summarizes the output.
By default, jdeps outputs the complete list of dependencies for each package, which can be a long list.
The summary shows module dependencies only, and hides the package details.

The `-cp` argument is the classpath we want to use during the analysis, which should correspond to the run-time classpath.

The `out` directory contains the application's class files that must be analyzed.

Omitting the `-summary` argument in the preceding command prints the full dependency graph,
showing exactly which packages require which other packages:

```text
jdeps -cp lib/*.jar out
```

If this is still not enough detail, we can also instruct `jdeps` to print dependencies at the class level:

```text
jdeps -verbose:class -cp lib/*.jar out
```

So far, we have used `jdeps` on a **classpath-based application**. We can also use `jdeps` with **modules**.

## jdeps in module

To invoke `jdeps`, we now have to pass in the **module path**
that contains the application module and the automatic Jackson modules:

```text
jdeps --module-path out:mods -m books
```

## dot files

jdeps can output **dot files** for module graphs using the `-dotoutput` or `--dot-output` flag.

This is a useful format to represent graphs, and it's easy to generate images from this format.

[Graphviz](https://www.graphviz.org/)支持Linux、Windows和Mac等操作系统。

```text
$ dot -Tsvg input.dot -o output.svg
```

- `-O`: Automatically generate output file names based on the input file name and the various output formats specified by the `-T` flags.

```text
$ dot -Tsvg -O ~/family.dot ~/debug.dot
```

## USING JDEPS TO FIND REMOVED OR ENCAPSULATED TYPES AND THEIR ALTERNATIVES

`jdeps` is a tool shipped with the JDK.
One of the things `jdeps` can do is find usages of removed or encapsulated JDK types, and suggest replacements.
`jdeps` always works on class files, not on source code.

```text
jdeps -jdkinternals removed/RemovedTypes.class
```


