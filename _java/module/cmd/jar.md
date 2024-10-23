---
title: "jar"
sequence: "103"
---

The jar tool can be used without change to create **modular JAR files**,
since a **modular JAR file** is just **a JAR file** with a `module-info.class` file in its root directory.

```text
modular JAR = plain JAR + module-info.class
```

## jar tool

The `jar` tool implements the following new options to allow the insertion of additional information into **module descriptors** as modules are packaged:

- `--main-class=<class-name>`, or `-e <class-name>` for short, causes `<class-name>` to be recorded
  in the `module-info.class` file as the class containing the module's `public static void main` entry point.
  (This is not a new option; it already records the main class in the JAR file's manifest.)

- `--module-version=<version>` causes `<version>` to be recorded in the `module-info.class` file as the module's version string.

- `--hash-modules=<pattern>` causes hashes of the content of the specific modules that depend upon this module,
  in a particular set of observable modules, to be recorded in the `module-info.class` file for later use in the validation of dependencies.
  Hashes are only recorded for modules whose names match the regular expression `<pattern>`.
  If this option is used then the `--module-path` option, or `-p` for short,
  must also be used to specify the set of observable modules for the purpose of computing the modules that depend upon this module.

- `--describe-module`, or `-d` for short, displays the module descriptor, if any, of the specified JAR file.

The `jar` tool's `--help` option can be used to show a complete summary of its command-line options.

## JAR-file manifest

Two new JDK-specific JAR-file manifest attributes are defined to correspond to the `--add-exports` and `--add-opens` command-line options:

- `Add-Exports: <module>/<package>( <module>/<package>)*`
- `Add-Opens: <module>/<package>( <module>/<package>)*`

The value of each attribute is a **space-separated** list of **slash-separated** `module-name/package-name` pairs.

A `<module>/<package>` pair in the value of an `Add-Exports` attribute has the same meaning as the command-line option

```text
--add-exports <module>/<package>=ALL-UNNAMED
```
A `<module>/<package>` pair in the value of an `Add-Opens` attribute has the same meaning as the command-line option

```text
--add-opens <module>/<package>=ALL-UNNAMED
```

Each attribute can occur at most once, in the main section of a `MANIFEST.MF` file.

> 出现次数：1次

A particular pair can be listed more than once.

> 同样的`<module>/<package>`可以出现多次

If a specified module was not resolved, or if a specified package does not exist, then the corresponding pair is ignored.

> 如果不存在，那么会忽略掉

These attributes are interpreted only in the **main executable JAR file** of an application,
i.e., in the JAR file specified to the `-jar` option of the Java run-time launcher;
they are ignored in all other JAR files.

> 这些属性只在main executable JAR当中有效

