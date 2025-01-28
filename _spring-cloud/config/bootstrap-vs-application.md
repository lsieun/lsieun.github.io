---
title: "Bootstrap VS Application Properties"
sequence: "101"
---

## Overview

**Spring Boot** is an opinionated framework.
Despite this, we usually end up overriding autoconfigured properties in an application configuration file
such as `application.properties`.

However, in a **Spring Cloud** application, we often use another configuration file called `bootstrap.properties`.

In this quick tutorial, we'll explain the differences between `bootstrap.properties` and `application.properties`.

## When Is the Application Configuration File Used?

We use `application.yml` or `application.properties` for configuring the **application context**.

When a **Spring Boot application** starts,
it creates an **application context** that doesn't need to be explicitly configured – it's already autoconfigured.
However, Spring Boot offers different ways to override these properties.

```text
- application context
    - autoconfigured
    - override
        - code
        - command-line arguments
        - `ServletConfig` init parameters
        - `ServletContext` init parameters
        - Java system properties
        - operating system variables
        - application properties file
```



We can override these in code, command-line arguments,
`ServletConfig` init parameters, `ServletContext` init parameters,
Java system properties, operating system variables, and application properties file.

```text
注意：配置application context的几种方式
```

An important thing to keep in mind is that
these application properties files have the lowest precedence compared to
other forms of overriding application context properties.

```text
注意：application properties files的优先级最低
```

We tend to group properties that we can override in the application context:

- **Core properties** (logging properties, thread properties)
- **Integration properties** (RabbitMQ properties, ActiveMQ properties)
- **Web properties** (HTTP properties, MVC properties)
- **Security properties** (LDAP properties, OAuth2 properties)

## When Is the Bootstrap Configuration File Used?

We use `bootstrap.yml` or `bootstrap.properties` for configuring the **bootstrap context**.
This way we keep the external configuration for bootstrap and main context nicely separated.

```text
bootstrap context
```

The **bootstrap context** is responsible for loading configuration properties
from the external sources and for decrypting properties in the local external configuration files.

When the **Spring Cloud application** starts, it creates a **bootstrap context**.
The first thing to remember is that the **bootstrap context** is the **parent context** for the **main application**.

```text
bootstrap context是application context的parent。
```

Another key point to remember is that these two contexts share the **Environment**,
which is the source of external properties for any Spring application.
In contrast with the **application context**,
the **bootstrap context** uses a different convention for locating the external configuration.

```text
小总结：

1、bootstrap context和application context共享同一个Environment。
2、
```

The source of configuration files can be a filesystem or even a git repository, for example.
The services use their `spring-cloud-config-client` dependency to access the configuration server.

To put it in simple words, the configuration server is the point
through which we access the application context configuration files.

## Conclusion

In contrast to a **Spring Boot application**, a **Spring Cloud application** features a **bootstrap context**
that is the parent of the **application context**.

```text
父子关系
```

Although both of them share **the same Environment**,
they have different conventions for locating the external configuration files.

```text
共享同一个Environment
```

The **bootstrap context** is searching for a `bootstrap.properties` or a `bootstrap.yaml` file,
whereas the **application context** is searching for an `application.properties` or an `application.yaml` file.

```text
配置文件不同
```

And, of course, the configuration properties of the **bootstrap context** load before
the configuration properties of the **application context**.

```text
加载顺序
```

## Reference

- [Spring Configuration Bootstrap vs Application Properties](https://www.baeldung.com/spring-cloud-bootstrap-properties)
