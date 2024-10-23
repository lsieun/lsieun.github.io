---
title: "--add-exports and --add-exports"
sequence: "104"
---

## add-exports

```text
--add-exports <source-module>/<package>=<target-module>(,<target-module>)*
```

where `<source-module>` and `<target-module>` are module names and `<package>` is the name of a package.

The `--add-exports` option can be used more than once,
but at most once for any particular combination of source module and package name.

> 可以使用多次

The effect of each instance is to add a **qualified export** of the **named package** from the **source module** to the **target module**.

> 作用

This is, essentially, a command-line form of an `exports` clause in a **module declaration**,
or an invocation of an unrestricted form of the `Module::addExports` method.

> 等价的操作

## Example

If, for example, the module `jmx.wbtest` contains a white-box test
for the unexported `com.sun.jmx.remote.internal` package of the `java.management module`,
then the access it requires can be granted via the option

```text
--add-exports java.management/com.sun.jmx.remote.internal=jmx.wbtest
```

```text
--add-exports java.base/java.lang=lsieun.app
```

### ALL-UNNAMED

As a special case, if the `<target-module>` is `ALL-UNNAMED`
then the source package will be exported to **all unnamed modules**,
whether they exist initially or are created later on.

```text
ALL-UNNAMED = all unnamed modules
```

Thus access to the `sun.management` package of the `java.management` module can be granted to
all code on the **class path** via the option

```text
--add-exports java.management/sun.management=ALL-UNNAMED
```

## add-opens

The `--add-exports` option enables access to the **public types** of a specified package.
It is sometimes necessary to go further and enable access to **all non-public elements**
via the `setAccessible` method of the core reflection API.
The `--add-opens` option can be used, at run time, to do this.

The `--add-opens` option has the same syntax as the `--add-exports` option:

```text
--add-opens <source-module>/<package>=<target-module>(,<target-module>)*
```

where `<source-module>` and `<target-module>` are module names and `<package>` is the name of a package.

The `--add-opens` option can be used more than once, but at most once for any particular combination of source module and package name.

> 可以使用多次

The effect of each instance is to add a **qualified open** of the named package from the source module to the target module.

> 作用：qualified open

This is, essentially, a command-line form of an `opens` clause in a **module declaration**,
or an invocation of an unrestricted form of the `Module::addOpens` method.

> 等价操作

As a consequence, code in the target module will be able to use the **core reflection API** to access **all types, public and otherwise**,
in the named package of the source module so long as the target module reads the source module.

> open --> core reflection API --> all types, public and otherwise

```text
--add-opens <src.module>/<package>=<target.module>
```

```text
java --add-opens java.base/java.lang=ALL-UNNAMED
```

