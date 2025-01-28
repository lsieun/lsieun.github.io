---
title: "Import Additional Configuration Files"
sequence: "103"
---

## spring.config.import

In your `application.properties` file, you can import additional configuration files
(e.g., properties or yml files containing other configurations)
using the Spring Boot's `spring.config.import` property.

For instance, you can configure `spring.config.import=classpath:additional-application.properties`
in your `application.properties` file,
so Spring Boot can load the configuration present in the `additional-application.properties` file.

However, if this file does not exist in the classpath,
Spring Boot throws a `ConfigDataResourceNotFoundException`.

```text
org.springframework.boot.context.config.ConfigDataResourceNotFoundException:
 Config data resource 'class path resource [dbConfig.properties]'
 via location 'classpath:dbConfig.properties' cannot be found
```

### application.properties

File: `application.properties`

```properties
spring.application.name=my-demo-app
spring.config.import=classpath:dbConfig.properties
```

### SpringApplication

```java
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.util.Properties;

@SpringBootApplication
public class DemoApplication {
    public static void main(String[] args) {
        Properties properties = new Properties();
        properties.setProperty("spring.config.import", "classpath:dbConfig.properties");

        SpringApplication application = new SpringApplication(DemoApplication.class);
        application.setDefaultProperties(properties);
        application.run(args);
    }
}
```

## optional prefix

Based on your application configuration,
you may choose to ignore some configuration files and continue with the application bootstrap.
You can use the `optional:` prefix to indicate the configuration file is optional.

```properties
spring.application.name=my-demo-app
spring.config.import=optional:classpath:dbConfig.properties
```

```java
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.util.Properties;

@SpringBootApplication
public class DemoApplication {
    public static void main(String[] args) {
        Properties properties = new Properties();
        properties.setProperty("spring.config.import", "optional:classpath:dbConfig.properties");

        SpringApplication application = new SpringApplication(DemoApplication.class);
        application.setDefaultProperties(properties);
        application.run(args);
    }
}
```
