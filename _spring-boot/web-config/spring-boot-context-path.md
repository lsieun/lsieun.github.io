---
title: "Spring Boot: Context Path"
sequence: "102"
---

## Overview

Spring Boot, by default, serves content on the root context path (`/`).

## Setting the Property

Just like many other configuration options,
the context path in Spring Boot can be changed by setting a property, `server.servlet.context-path`.

Note that this works for Spring Boot 2.x. For Boot 1.x, the property is `server.context-path`.

There are multiple ways of setting this property, so let's look at them one by one.

### Using application.properties / yml

The most straightforward way of changing the context path is to set the property in the `application.properties`/`yml` file:

```text
server.servlet.context-path=/lsieun
```

Instead of putting the properties file in `src/main/resources`,
we can also keep it in the current working directory (outside of the classpath).

### Java System Property

We can also set the context path as a Java system property before the context is even initialized:

```text
public static void main(String[] args) {
    System.setProperty("server.servlet.context-path", "/lsieun");
    SpringApplication.run(Application.class, args);
}
```

### OS Environment Variable

Spring Boot can also rely on OS environment variables.

On Unix based systems we can write:

```text
$ export SERVER_SERVLET_CONTEXT_PATH=/baeldung
```

On Windows, the command to set an environment variable is:

```text
> set SERVER_SERVLET_CONTEXT_PATH=/baeldung
```

The above environment variable is for Spring Boot 2.x.x.  If we have 1.x.x, the variable is `SERVER_CONTEXT_PATH`.

### Command Line Arguments

We can set the properties dynamically via command line arguments as well:

```text
$ java -jar app.jar --server.servlet.context-path=/baeldung
```

## Using Java Config

Now let's set the context path by populating the bean factory with a configuration bean.

With Spring Boot 2, we can use `WebServerFactoryCustomizer`:

```text
@Bean
public WebServerFactoryCustomizer<ConfigurableServletWebServerFactory>
  webServerFactoryCustomizer() {
    return factory -> factory.setContextPath("/baeldung");
}
```

With Spring Boot 1, we can create an instance of `EmbeddedServletContainerCustomizer`:

```text
@Bean
public EmbeddedServletContainerCustomizer
  embeddedServletContainerCustomizer() {
    return container -> container.setContextPath("/baeldung");
}
```

## Priority Order of Configurations

With this many options, we may end up having more than one configuration for the same property.

Here's the priority order in descending order, which Spring Boot uses to select the effective configuration:

- Java Config
- Command Line Arguments
- Java System Properties
- OS Environment Variables
- `application.properties` in Current Directory
- `application.properties` in the classpath (`src/main/resources` or the packaged jar file)

## Reference

- [Spring Boot Change Context Path](https://www.baeldung.com/spring-boot-context-path)
- [Externalized Configuration](https://docs.spring.io/spring-boot/docs/current/reference/html/features.html#features.external-config)
