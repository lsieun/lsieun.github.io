---
title: "javac Programmatic Interface"
---

The `javac` command supports the new Java Compiler API defined by the classes and interfaces in the `javax.tools` package.

## Example

To compile as though providing command-line arguments, use the following syntax:

```text
JavaCompiler javac = ToolProvider.getSystemJavaCompiler();
```

The example writes **diagnostics** to the standard output stream and returns the exit code that javac would give when called from the command line.

You can use other methods in the `javax.tools.JavaCompiler` interface to handle **diagnostics**, control where files are read from and written to, and more.
