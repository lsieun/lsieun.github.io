---
title: "JDK Modules"
sequence: "105"
---

下图来自[JEP 200: The Modular JDK](http://openjdk.java.net/jeps/200)

![](/assets/images/java/module/jdk-modules.png)

- **Standard modules**, whose specifications are governed by the JCP, have names starting with the string `java.`.
- **All other modules** are merely part of the JDK, and have names starting with the string `jdk.`.

## java.base

At the very bottom is the `java.base` module,
which contains essential classes such as `java.lang.Object` and `java.lang.String`.
The `java.base` module depends upon no module, and every other module depends upon the `java.base` module.
Edges to the base module are lighter than other edges.

The most fundamental module is `java.base`,
because it contains `java.lang.Object`,
a class without which no Java program could function.
It's the dependency to end all dependencies:
all other modules require it, but it requires nothing else.

The dependency on `java.base` is so fundamental that
modules don't even have to declare it as the module system fills it in automatically.

查看classfile生成的module的结构

## java.se

The `java.se` aggregator module gathers together those parts of the Java SE Platform that do not overlap with Java EE.

```java
module java.se {
    requires transitive java.compiler;
    requires transitive java.datatransfer;
    requires transitive java.desktop;
    requires transitive java.instrument;
    requires transitive java.logging;
    requires transitive java.management;
    requires transitive java.management.rmi;
    requires transitive java.naming;
    requires transitive java.net.http;
    requires transitive java.prefs;
    requires transitive java.rmi;
    requires transitive java.scripting;
    requires transitive java.security.jgss;
    requires transitive java.security.sasl;
    requires transitive java.sql;
    requires transitive java.sql.rowset;
    requires transitive java.transaction.xa;
    requires transitive java.xml;
    requires transitive java.xml.crypto;
}
```

## jdk.unsupported

Some internal classes from the JDK have proven to be harder to encapsulate.
Chances are that you have never used `sun.misc.Unsafe` and the like.
These have always been unsupported classes, meant to be used only in the JDK internally.

Some of these classes are widely used by libraries for performance reasons.
Although it's easy to argue that this should never be done, in some cases it's the only option.
A well-known example is the `sun.misc.Unsafe` class,
which can perform low-level operations bypassing Java's memory model and other safety nets.
The same functionality cannot be implemented by libraries outside the JDK.

If such classes would simply be encapsulated,
libraries depending on them would no longer work with JDK 9, at least, not without warnings.
Theoretically, this is not a backward-compatibility issue.
Those libraries abuse nonsupported implementation classes, after all.
For some of these highly used internal APIs, the real-world implications would be too severe to ignore, however—
especially because there are no supported alternatives to the functionality they provide.

With that in mind, a compromise was reached.
The JDK team researched which JDK platform internals are used by libraries the most,
and which of those can be implemented only inside the JDK.
Those classes are not encapsulated in Java 9.

Here's the resulting list of specific classes and methods that are kept accessible:

- `sun.misc.{Signal,SignalHandler}`
- `sun.misc.Unsafe`
- `sun.reflect.Reflection::getCallerClass(int)`
- `sun.reflect.ReflectionFactory::newConstructorForSerialization`

Remember, if these names don't mean anything to you, that's a good thing.
Popular libraries such as Netty, Mockito, and Akka use these classes, though.
Not breaking these libraries is a good thing as well.

Because these methods and classes were not primarily designed to be used outside the JDK,
they are moved to a platform module called `jdk.unsupported`.
This indicates that it is expected the classes in this module will be replaced by other APIs in a future Java version.
The `jdk.unsupported` module exports and/or opens the internal packages containing the classes discussed.
Many existing uses involve deep reflection.

**Using these classes through reflection does not lead to warnings at runtime.**
That's because `jdk.unsupported` opens the necessary packages in its module descriptor,
so there is no illegal access from that point of view.

```java
module jdk.unsupported {
    exports com.sun.nio.file;
    exports sun.misc;
    exports sun.reflect;

    opens sun.misc;
    opens sun.reflect;
}
```

WARNING: Although these types can be used without breaking encapsulation, they are still unsupported;
their use is still discouraged.
The plan is to provide supported alternatives in the future.
For example, some of the functionality in `Unsafe` is superseded by **variable handles** as proposed in [JEP 193: Variable Handles](https://openjdk.java.net/jeps/193).
Until then, the status quo is maintained.

## java.sql

```java
module java.sql {
    requires transitive java.logging;
    requires transitive java.transaction.xa;
    requires transitive java.xml;

    exports java.sql;
    exports javax.sql;

    uses java.sql.Driver;
}
```

`java.sql` defines a `java.sql.Driver` service interface, and has a `uses` constraint for this service type as well.

The JDBC driver to use often depends on the deployment environment of the application,
where the exact driver name is configured in a configuration file.
Application code should not be coupled to a specific database driver in that case.


## Other Changes

Some of the changes include the following:

### JDK layout

Because of the platform modularization, the big `rt.jar` containing all platform classes doesn't exist anymore.
The layout of the JDK itself has changed considerably as well, as is documented in [JEP 220: Modular Run-Time Images](https://openjdk.java.net/jeps/220).

### Version string

Gone are the days that all Java platform versions start with the `1.x` prefix.
Java 9 is shipped with version `9.0.0`.
The syntax and semantics of the version string have changed considerably.
If an application does any kind of parsing on the Java version, read [JEP 223: New Version-String Scheme](https://openjdk.java.net/jeps/223) for all the details.

### Extension mechanisms

Features such as the **Endorsed Standard Override Mechanism** and
the extension mechanism through the `java.ext.dirs` property are removed.
They are replaced by **upgradeable modules**.
More information can be found in [JEP 220: Modular Run-Time Images](https://openjdk.java.net/jeps/220).

