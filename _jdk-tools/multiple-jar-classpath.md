---
title: "Add multiple JAR in to Classpath"
sequence: "103"
---

## CLASSPATH

The `CLASSPATH` environment variable

## Command-line

Include the name of the JAR file in `-classpath` command-line option.

Use Java 6 wildcard option to include multiple JAR

- 1) Use quotes (`"`)
- 2) Use `*` only, not `*.jar`

Windows:

```text
java -cp "Test.jar;lib/*" my.package.MainClass
```

Linux:

```text
java -cp "Test.jar:lib/*" my.package.MainClass
```

## Jar

Include the jar name in the `Class-Path` option in the manifest.

## ext Directory

Adding JAR in ext directory

```text
C:\Program Files\Java\jdk1.8\jre\lib\ext
```

