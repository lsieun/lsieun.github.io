---
title: "Spring Boot + Logback Layout"
sequence: "111"
---

**Spring Boot uses the Logback library for logging by default.**

It's also worth mentioning that
**Spring Boot recommends using `logback-spring.xml` for Logback instead of the default `logback.xml`.**
We cannot use extensions in standard `logback.xml`
because the `logback.xml` configuration file is loaded too early.

## Maven Dependencies

To use Logback, we need to add the `logback-classic` dependency to our `pom.xml`.
However, the `logback-classic` dependency is already available in the Spring Boot Starter dependencies.

So, we need only to add the `spring-boot-starter-web` dependency to `pom.xml`:

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
</dependency>
```

## Basic Logging

First, we'll add some logs to the main Spring Boot class to use in our example:

```java
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class SpringBootLogbackExtensionsApplication {
    private static final Logger logger = LoggerFactory.getLogger(SpringBootLogbackExtensionsApplication.class);

    public static void main(String[] args) {
        SpringApplication.run(SpringBootLogbackExtensionsApplication.class, args);

        logger.trace("Trace log message");
        logger.debug("Debug log message");
        logger.info("Info log message");
        logger.warn("Warn log message");
        logger.error("Error log message");
    }
}
```

## Profile-Specific Settings

**Spring profiles** provide a mechanism for adjusting the application configuration based on the **active profile**.

```text
Spring profiles --> active profile
```

For example, we can define separated Logback configurations for various environments,
such as "development" and "production".
**If we want to have a single Logback configuration, we can use the `springProfile` element in `logback-spring.xml`.**

**Using the `springProfile` element,
we can optionally include or exclude sections of configuration based on the active Spring profiles.
We can use the `name` attribute to allow which profile accepts the configuration.**

By default, Spring Boot logs to the console only.
Now, suppose we want to log things to a file for "production" and a console for "development".
We can easily do it by using the `springProfile` element.

Let's create a `logback-spring.xml` file:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<configuration>

    <property name="LOGS" value="./logs"/>
    <springProperty scope="context" name="application.name" source="spring.application.name"/>

    <springProfile name="development">
        <appender name="Console" class="ch.qos.logback.core.ConsoleAppender">
            <layout class="ch.qos.logback.classic.PatternLayout">
                <Pattern>%d{HH:mm:ss.SSS} [%thread] %-5level %logger{36} - %msg%n</Pattern>
            </layout>
        </appender>
        <root level="info">
            <appender-ref ref="Console"/>
        </root>
    </springProfile>

    <springProfile name="production">
        <appender name="RollingFile" class="ch.qos.logback.core.rolling.RollingFileAppender">
            <file>${LOGS}/${application.name}.log</file>
            <encoder class="ch.qos.logback.classic.encoder.PatternLayoutEncoder">
                <Pattern>%d{HH:mm:ss.SSS} [%thread] %-5level %logger{36} - %msg%n</Pattern>
            </encoder>
            <rollingPolicy class="ch.qos.logback.core.rolling.TimeBasedRollingPolicy">
                <fileNamePattern>${LOGS}/archived/${application.name}-%d{yyyy-MM-dd}.log</fileNamePattern>
            </rollingPolicy>
        </appender>
        <root level="info">
            <appender-ref ref="RollingFile"/>
        </root>
    </springProfile>

</configuration>
```

Then, we can set the active profile using the JVM system parameter `-Dspring.profiles.active=development` or
`-Dspring.profiles.active=production`.

```text
-Dspring.profiles.active=development
-Dspring.profiles.active=production
```

Also, we might want to log things to a file for "staging" or "production".
To support this case, the `springProfile`'s `name` attribute accepts a profile expression.
A profile expression allows for more complicated profile logic:

```xml
<springProfile name="production | staging">
    <!-- configuration -->
</springProfile>
```

The above configuration is enabled when either the "production" or "staging" profile is active.

## Environment Properties

Sometimes, we need to access values from the `application.properties` file in the logging configuration.
In this situation, we use the `springProperty` element in the Logback configuration.

The `springProperty` element is similar to Logback's standard `property` element.
However, we can determine the source of the property from the environment rather than specifying a direct value.

The `springProperty` element has a `source` attribute, which takes the value of the application property.
If a property isn't set in the environment, it takes a default value from the `defaultValue` attribute.
Also, we need to set a value to the `name` attribute to reference the property in other elements in the configuration.

```text
<springProperty scope="context" name="application.name" source="spring.application.name"/>
```

Finally, we can set the `scope` attribute.
A property in `context` scope is part of the context, and it's available in all logging events.

Let's suppose we want to use the application name as the log file's name.
First, we define the application name in the `application.properties` file:

```text
spring.application.name=logback-extension
```

Then, we expose the application name for use within `logback-spring.xml`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<configuration>

    <property name="LOGS" value="./logs"/>
    <springProperty scope="context" name="application.name" source="spring.application.name"/>

    <!-- configuration -->
    
    <springProfile name="production">
        <appender name="RollingFile" class="ch.qos.logback.core.rolling.RollingFileAppender">
            <file>${LOGS}/${application.name}.log</file>
            <!-- configuration -->
        </appender>
    </springProfile>

</configuration>
```

In the above configuration, we set the `source` attribute of the `springProperty` element
to the property `spring.application.name`.
In addition, we refer to the property using `${application.name}`.


