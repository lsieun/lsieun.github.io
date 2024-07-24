---
title: "Dependency Scopes"
sequence: "103"
---

[UP](/maven-index.html)


When we declare a dependency, we can specify a **dependency scope**.
The scope indicates the classpaths in which the dependency will be included.
There are five dependency scopes, and they are summarized in the following table:

## compile

This is the **default scope**.
Dependencies at `compile` scope will be available in all the classpaths with which Maven deals;
they are used to compile and test our project, and they are packaged in WAR and EAR archives.

## provided

Dependencies at this scope are available only during the `compile`, `test-compile`, and `test` phases.
They are **not** packaged in WAR and EAR archives.

## runtime

Runtime dependencies are used during the `test` phase and packaged in WAR and EAR archives.
They are included in the runtime classpath of WEB and EE applications,
but are not used to compile our project and its unit tests.
We should use this scope if we need these dependencies just to run our project and its unit tests.

## test

These dependencies are available only in the `test-compile` and `test` phases to compile and run the unit tests.

## system

This scope is not recommended.
It is similar to the provided scope,
but we have to specify the full path of the artifact using the `<systemPath>` child element of the `<dependency>` element.
Dependencies at this scope will not be searched in Maven repositories.

```xml
<dependency>
    <groupId>com.sun</groupId>
    <artifactId>tools</artifactId>
    <version>8</version>
    <scope>system</scope>
    <systemPath>${env.JAVA_HOME}/lib/tools.jar</systemPath>
</dependency>
```
