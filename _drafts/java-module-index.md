---
title: "Java Platform Module System"
image: /assets/images/java/module/java-jpms-logo.png
permalink: /java/java-module-index.html
---

Java 9 introduces a new level of abstraction above **packages**,
formally known as the **Java Platform Module System** (**JPMS**).

## Basic

<table>
    <thead>
    <tr>
        <th style="text-align: center;">Basic</th>
        <th style="text-align: center;">Command Line</th>
        <th style="text-align: center;">Concept</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>
{%
assign filtered_posts = site.java |
where_exp: "item", "item.path contains 'java/module/basic/'" |
sort: "sequence"
%}
<ol>
    {% for post in filtered_posts %}
    {% assign num = post.sequence | abs %}
    <li>
        <a href="{{ post.url }}">{{ post.title }}</a>
    </li>
    {% endfor %}
</ol>
        </td>
        <td>
{%
assign filtered_posts = site.java |
where_exp: "item", "item.path contains 'java/module/cmd/'" |
sort: "sequence"
%}
<ol>
    {% for post in filtered_posts %}
    {% assign num = post.sequence | abs %}
    <li>
        <a href="{{ post.url }}">{{ post.title }}</a>
    </li>
    {% endfor %}
</ol>
        </td>
        <td>
{%
assign filtered_posts = site.java |
where_exp: "item", "item.path contains 'java/module/concept/'" |
sort: "sequence"
%}
<ol>
    {% for post in filtered_posts %}
    {% assign num = post.sequence | abs %}
    <li>
        <a href="{{ post.url }}">{{ post.title }}</a>
    </li>
    {% endfor %}
</ol>
        </td>
    </tr>
    </tbody>
</table>

## Reflection

<table>
    <thead>
    <tr>
        <th style="text-align: center;">Reflection</th>
        <th style="text-align: center;">Service</th>
        <th style="text-align: center;">Migration</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>
{%
assign filtered_posts = site.java |
where_exp: "item", "item.path contains 'java/module/reflection/'" |
sort: "sequence"
%}
<ol>
    {% for post in filtered_posts %}
    {% assign num = post.sequence | abs %}
    <li>
        <a href="{{ post.url }}">{{ post.title }}</a>
    </li>
    {% endfor %}
</ol>
        </td>
        <td>
{%
assign filtered_posts = site.java |
where_exp: "item", "item.path contains 'java/module/services/'" |
sort: "sequence"
%}
<ol>
    {% for post in filtered_posts %}
    {% assign num = post.sequence | abs %}
    <li>
        <a href="{{ post.url }}">{{ post.title }}</a>
    </li>
    {% endfor %}
</ol>
        </td>
        <td>
{%
assign filtered_posts = site.java |
where_exp: "item", "item.path contains 'java/module/migration/'" |
sort: "sequence"
%}
<ol>
    {% for post in filtered_posts %}
    {% assign num = post.sequence | abs %}
    <li>
        <a href="{{ post.url }}">{{ post.title }}</a>
    </li>
    {% endfor %}
</ol>
        </td>
    </tr>
    </tbody>
</table>





JMPS = Java Platform Module System

A **module** is a named, self-describing collection of **code** and **data**.
Its **code** is organized as a set of packages containing types, i.e., Java classes and interfaces;
its **data** includes resources and other kinds of static information.
-- Mark Reinhold

- readability: 是讲两个 module 之间的依赖（dependency），这是一个“粗粒度”
- accesibility：是讲两个 Type/Class 之间的调用，这是一个“细粒度”的概念

The **Java Platform Module System** (**JPMS**) introduced us to a new level of **access control** through **modules**.
Each package has to be explicitly **exported** to be accessed outside the module.

In a modular application, each module can be one of **named**, **unnamed**, or **automatic modules**.

For the **named** and **automatic modules**, the built-in system class loader will have **no classpath**.
The system class loader will search for classes and resources using the **application module path**.

For an **unnamed module**, it will set the **classpath** to **the current working directory**.

A JPMS module is described using the file `module-info.java` in the root source directory,
which is compiled to `module-info.class`.
In this file, you use the new keyword `module` to declare a module with a name.

```java
module lsieun.utils {
}
```



## Module Declaration

After the introduction of modules in Java 9, you should organize Java applications as modules.

All modules, except for the module `java.base` itself,
have implicit and mandatory dependency upon `java.base`.
you don't need to explicitly declare this dependency.

### requires

A module can declare its dependencies upon other modules using the keyword `requires`.
Requiring a module doesn't mean that you have access to its `public` and `protected` types automatically.

```java
module lsieun.utils {
    requires lsieun.core;
}
```

### exports

A module can declare which packages are accessible to other modules.
Only a module's exported packages are accessible to other modules, and **by default, no packages are exported**.
The keyword `exports` is used to export packages.
**Public and protected types** in exported packages and their public and protected members can be accessed by other modules.

```java
module lsieun.utils {
    requires lsieun.core;
    exports lsieun.utils;
}
```

Please note, when you export a package, you only export types in this package but not types in its subpackages.
For example, the declaration exports `com.mycompany.mymodule` only exports types
like `com.mycompany.mymodule.A` or `com.mycompany.mymodule.B`,
but not types like `com.mycompany.mymodule.impl.C` or `com.mycompany.mymodule.test.demo.D`.
To export those subpackages, you need to use `exports` to explicitly declare them in the module declaration.

If a type is not accessible across module boundaries,
this type is treated like a `private` method or field in the module.
Any attempt to use this type will cause an error in the compile time,
a `java.lang.IllegalAccessError` thrown by the JVM in the runtime,
or a `java.lang.IllegalAccessException` thrown
by the **Java reflection API** when you are using reflection to access this type.

### Transitive Dependencies

The `requires` declaration can be extended to add the modifier `transitive` to declare the dependency as transitive.
The transitive modules that a module depends on are readable by any module that depends upon this module.
This is called **implicit readability**.

```java
module lsieun.utils {
    requires transitive lsieun.core;
    exports lsieun.utils;
}
```

In general, if one module exports a package containing a type whose signature refers to another package in a second module,
then the first module should use `requires transitive` to declare the dependency upon the second module.

### Static Dependencies

You can use `requires static` to specify that a module dependency is required in the compile time,
but optional in the runtime:

```java

```

Static dependencies are useful for frameworks and libraries.
Suppose that you are building a library to work with different kinds of databases.
The library module can use static dependencies to require different kinds of JDBC drivers.
At compile time, the library's code can access types defined in those drivers.
At runtime, users of the library can add only the drivers they want to use.
If the dependencies are not static,
users of the library have to add all supported drivers to pass the module resolution checks.

## JDK Tools

JDK tools can be used in different phases:

- Compile time: Use `javac` to compile Java source code into class files.
- Link time: The new optional phase introduced in Java 9. Use `jlink` to assemble and optimize a set of modules and their transitive dependencies to create a custom runtime image.
- Runtime: Use `java` to launch the JVM and execute the byte code.

## Reference

- [lsieun/learn-java-module](https://github.com/lsieun/learn-java-module)

Ebook

- 《[The Java Module System](https://www.manning.com/books/the-java-module-system)》 Nicolai Parlog 2019 及代码[demo-jpms-monitor](https://github.com/nipafx/demo-jpms-monitor)

- [JSR 376: Java Platform Module System](https://jcp.org/en/jsr/detail?id=376)

Oracle

- [Understanding Java 9 Modules](https://www.oracle.com/corporate/features/understanding-java-9-modules.html)

OpenJDK

- [Project Jigsaw](https://openjdk.java.net/projects/jigsaw/)
- [The State of the Module System](https://openjdk.java.net/projects/jigsaw/spec/sotms/)

- [JEP 200: The Modular JDK](https://openjdk.java.net/jeps/200)
- [JEP 201: Modular Source Code](https://openjdk.java.net/jeps/201)
- [JEP 220: Modular Run-Time Images](https://openjdk.java.net/jeps/220)
- [JEP 260: Encapsulate Most Internal APIs](https://openjdk.java.net/jeps/260)
- [JEP 261: Module System](https://openjdk.java.net/jeps/261):
  - javac and java: `--add-modules`, `--limit-modules`, `--patch-module`, `--add-reads`, `--add-exports`, `--add-opens`
  - jar: `--main-class`, `--module-version`, `--hash-modules`, `--describe-module`
  - Jar Manifest: `Add-Exports`, `Add-Opens`
  - jmod
  - jlink
  - Relaxed strong encapsulation
- [JEP 275: Modular Java Application Packaging](https://openjdk.java.net/jeps/275)
- [JEP 282: Jlink: The Java Linker](https://openjdk.java.net/jeps/282)
- [JEP 396: Strongly Encapsulate JDK Internals by Default](https://openjdk.java.net/jeps/396)
- [JEP 403: Strongly Encapsulate JDK Internals](https://openjdk.java.net/jeps/403): 不支持 `--illegal-access`

JCP

- [JSR 232: Mobile Operational Management](https://www.jcp.org/en/jsr/detail?id=232)
- [JSR 277: Java Module System (withdrawn)](https://www.jcp.org/en/jsr/detail?id=277)
- [JSR 291: Dynamic Component Support for Java SE](https://www.jcp.org/en/jsr/detail?id=291)
- [JSR 294: Improved Modularity Support in the Java Programming Language (withdrawn)](https://www.jcp.org/en/jsr/detail?id=294)
- [JSR 376: Java Platform Module System](https://www.jcp.org/en/jsr/detail?id=376)
- [JSR 379: Java SE 9](https://www.jcp.org/en/jsr/detail?id=379)

IBM

- [Java 9+ modularity: The theory and motivations behind modularity](https://developer.ibm.com/tutorials/java-modularity-1/)
- [Java 9+ modularity: Module basics and rules](https://developer.ibm.com/tutorials/java-modularity-2/)
- [Java 9+ modularity: Modularity + encapsulation = security](https://developer.ibm.com/tutorials/java-modularity-3/)
- [Java 9+ modularity: How to design packages and create modules, Part 2](https://developer.ibm.com/tutorials/java-modularity-4/)
- [Java 9+ modularity: The difficulties and pitfalls of migrating from Java 8 to Java 9+](https://developer.ibm.com/tutorials/java-modularity-5/)

Baeldung

- [Introduction to Project Jigsaw](https://www.baeldung.com/project-jigsaw-java-modularity)
- [A Guide to Java 9 Modularity](https://www.baeldung.com/java-9-modularity)
  - [Java 9 java.lang.Module API](https://www.baeldung.com/java-9-module-api)
  - [Design Strategies for Decoupling Java Modules](https://www.baeldung.com/java-modules-decoupling-design-strategies)
  - [Multi-Module Maven Application with Java Modules](https://www.baeldung.com/maven-multi-module-project-java-jpms)
  - [Multi-Module Project with Maven](https://www.baeldung.com/maven-multi-module)
  - []()

Graphviz

- [Graphviz](https://www.graphviz.org/)
