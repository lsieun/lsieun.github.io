---
title: "System Properties"
sequence: "102"
---

[UP]({% link _java/properties-index.md %})

## 作用

System properties take the place of environment variables in some programming environments.

## 设置

### setProperty

Your application can set system properties with the static method `System.setProperty()`.

### Command Line

You can also set your own system properties when you run the Java interpreter, using the `-D` option:

```text
java -Dfoo=bar -Dcat=Boojum MyApp
```

## 获取

### getProperties

The `java.lang.System` class provides access to basic system environment information
through the static `System.getProperties()` method.
This method returns a `Properties` table that contains system properties.

### convenience methods

Because it is common to use system properties to provide parameters such as numbers and colors,
Java provides some convenience routines for retrieving property values and parsing them into their appropriate types.

The classes `Boolean`, `Integer`, `Long`, and `Color` each come with a “get” method that looks up and parses a system property.
For example, `Integer.getInteger("foo")` looks for a system property called `foo` and then returns it as an `Integer`.

## Common System Property

The following table summarizes system properties that are guaranteed to be **defined in any Java environment**.

```text
┌──────────────────────────┬───────────────────────────────────────────┐
│     System property      │                  Meaning                  │
├──────────────────────────┼───────────────────────────────────────────┤
│       java.vendor        │          Vendor-specific string           │
├──────────────────────────┼───────────────────────────────────────────┤
│     java.vendor.url      │               URL of vendor               │
├──────────────────────────┼───────────────────────────────────────────┤
│       java.version       │               Java version                │
├──────────────────────────┼───────────────────────────────────────────┤
│        java.home         │        Java installation directory        │
├──────────────────────────┼───────────────────────────────────────────┤
│    java.class.version    │            Java class version             │
├──────────────────────────┼───────────────────────────────────────────┤
│     java.class.path      │               The classpath               │
├──────────────────────────┼───────────────────────────────────────────┤
│         os.name          │           Operating system name           │
├──────────────────────────┼───────────────────────────────────────────┤
│         os.arch          │       Operating system architecture       │
├──────────────────────────┼───────────────────────────────────────────┤
│        os.version        │         Operating system version          │
├──────────────────────────┼───────────────────────────────────────────┤
│      file.separator      │      File separator (such as / or \)      │
├──────────────────────────┼───────────────────────────────────────────┤
│      path.separator      │      Path separator (such as : or ;)      │
├──────────────────────────┼───────────────────────────────────────────┤
│      line.separator      │    Line separator (such as \n or \r\n)    │
├──────────────────────────┼───────────────────────────────────────────┤
│        user.name         │             User account name             │
├──────────────────────────┼───────────────────────────────────────────┤
│        user.home         │           User's home directory           │
└──────────────────────────┴───────────────────────────────────────────┘
```

## restrictions

Java applets and other Java applications that run with restrictions may be prevented from reading the following properties:
`java.home`, `java.class.path`, `user.name`, `user.home`, and `user.dir`.

These restrictions are implemented by a `SecurityManager` object.
