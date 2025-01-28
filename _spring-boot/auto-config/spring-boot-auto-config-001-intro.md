---
title: "Spring Boot Auto-Configuration Intro"
sequence: "101"
---

Spring Boot provides the `@EnableAutoConfiguration` annotation
that is responsible for enabling the auto-configuration feature.
This annotation is used in the main application file of the Spring Boot application.

The `@EnableAutoConfiguration` annotation on a Spring Java configuration class causes Spring Boot
to automatically create beans it thinks you need, usually based on classpath contents,
that it can easily override.

Let's see the following code that represents the main application launcher class in the Spring Boot application:

```java

@Configuration
@EnableAutoConfiguration
public class MyAppConfig {
    public static void main(String[] args) {
        SpringApplication.run(MyAppConfig.class, args);
    }
}
```

But, Spring Boot also provides a shortcut for this configuration file by using another annotation,
`@SpringBootApplication`.

It is very common to use `@EnableAutoConfiguration`, `@Configuration`, and `@ComponentScan` together.
Let's see the following updated code:

```java

@SpringBootApplication
public class MyAppConfig {
    public static void main(String[] args) {
        SpringApplication.run(MyAppConfig.class, args);
    }
}
```

In this code, `@ComponentScan`, with no arguments, scans the current package and its sub-packages.

`@SpringBootApplication` has been available since Spring Boot 1.2.

```java

@SpringBootConfiguration
@EnableAutoConfiguration
@ComponentScan(excludeFilters = {@Filter(type = FilterType.CUSTOM, classes = TypeExcludeFilter.class),
        @Filter(type = FilterType.CUSTOM, classes = AutoConfigurationExcludeFilter.class)})
public @interface SpringBootApplication {
    // ...
}
```
