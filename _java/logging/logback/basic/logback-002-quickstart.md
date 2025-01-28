---
title: "Quick Start"
sequence: "102"
---

[UP](/java/java-logging-index.html)


## Basic Setup

To start using the Logback, you first need to
add the [`logback-classic`][mvn-repo-logback-classic-url] dependency to the classpath.
Let's do that with Maven:

```xml
<dependency>
    <groupId>ch.qos.logback</groupId>
    <artifactId>logback-classic</artifactId>
    <version>1.4.7</version>
</dependency>
```

This single dependency is enough, as it will transitively pull in the `logback-core` and `slf4j-api` dependencies.

**If no custom configuration is defined, Logback provides a simple, automatic configuration on its own.**
By default, this ensures that log statements are printed to the console at `DEBUG` level.

Consequently, you can now obtain a `Logger` instance and start writing log messages using the default, basic config.

First, you can create a Logger by using the slf4j `LoggerFactory` class:

```text
private static final Logger logger = LoggerFactory.getLogger(UserServiceTest.class);
```

Next, you can use simply use the typical logging APIs corresponding to the log level you're looking for:

```text
logger.debug("UserService Test");
```

[mvn-repo-logback-classic-url]: https://mvnrepository.com/artifact/ch.qos.logback/logback-classic
