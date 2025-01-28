---
title: "Automatic Modules"
sequence: "104"
---

**Automatic modules** are the bridge between the **class path** and **explicitly named modules**.
The goal is to migrate all existing modules/subprojects/libraries to Java 9 named modules.
However, during the migrating process, you can always add them to the module path to use them as automatic modules.

Java turns the appropriate JAR into a so-called **automatic module**.
Any JAR on the module path without a `module-info` file becomes an **automatic module**.
**Automatic modules implicitly export all their packages.**
A name for this automatic module is invented automatically, derived from the JAR name.
You have a few ways to derive the name, but the easiest way is to use the `jar` tool with the `--describe-module` argument:

```text
jar --file=./expenses.readers/target/dependency/httpclient-4.5.3.jar \
    --describe-module
```





