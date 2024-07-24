---
title: "Mojo 与 IOC 容器"
sequence: "106"
---

[UP](/maven-index.html)


## A Managed Object

**A Mojo in Maven is a managed object.**

```text
mojo = a managed object.
```

Specifically, it's managed by [dependency injection (DI) for Java (JSR 330)](https://jcp.org/en/jsr/detail?id=330)
and its compatible modular container called [Eclipse Sisu](https://eclipse.org/sisu), which started life in March 2012.

Eclipse Sisu 是一个 IOC 容器，用来管理 Maven 插件的 Mojo。

```text
mojo <--- Eclipse Sisu
```

To dig deeper, Sisu itself builds on the well-known lightweight implementation of JSR 330 called [Guice](https://github.com/google/guice),
a DI container by [Bob Lee](https://twitter.com/crazybob), who was among the initial DI pioneers in Java.

Eclipse Sisu 建立在 Google Guice 的基础上。

```text
mojo <--- Eclipse Sisu <--- Google Guice
```

**Sisu** adds **classpath scanning**, **autobinding**, and **autowiring** to Guice,
making it a little bit more similar to context and dependency injection (CDI),
where those things also happen **automatically**.

从功能的角度来说，Eclipse Sisu 与 Google Guice 有什么区别呢？

```text
Sisu = Guice + classpath scanning + autobinding + autowiring
```

Contrast Sisu's CDI (context and dependency injection) to plain Guice,
where binding (that is, matching the preferred implementation for injection to an interface)
must be done **programmatically**.

从使用的角度来说，Eclipse Sisu 与 Google Guice 有什么区别呢？

```text
Sicu = automatically
Guice = programmatically
```

Looking at it from a metaperspective,
Sisu, which makes plugins for Maven possible,
is itself essentially a plugin for Guice.

```text
Maven ---> Plugin ---> Mojo
---------------------------
Guice ---> Plugin ---> Sisu
```

## Sisu Vs Plexus

The observant reader might realize that Sisu is from 2012,
but Maven goes back to [July 2004](https://www.theserverside.com/news/1364572/Maven-Magic).
Well, initially Maven used an inversion-of-control (IoC) container called [Plexus](https://blog.sonatype.com/2009/05/plexus-container-five-minute-tutorial/).
While Plexus was essentially a standalone IoC container in its own right,
not necessarily tied to Maven, it was created by the same people who were also behind Maven.
In all its years, Plexus found little adoption outside Maven.
Therefore, it practically became Maven's private IoC container.

Having to maintain such a private container
when comparable alternatives exist in open source rarely makes sense,
so in 2010 with Maven 3 emerging, the team decided to switch to **Guice** with a few extensions of their own.
Maven 3.0 (October 2010) initially used Guice only under the covers with a compatibility layer in place
such that all existing Plexus-based plugins continued to run.
It wasn't until Maven 3.1 in July 2013 that Guice and the Maven-contributed extensions
(by then called Sisu and moved to Eclipse) were finally opened for public consumption by plugins.

Because of the long history of Plexus and the seamless compatibility layer put in place,
Plexus is still often encountered in Maven plugins.

## Reference

- [How to write your own Maven plugins](https://blogs.oracle.com/javamagazine/post/how-to-write-your-own-maven-plugins)
