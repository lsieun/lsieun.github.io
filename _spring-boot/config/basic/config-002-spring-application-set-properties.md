---
title: "Using the SpringApplication class"
sequence: "102"
---

## SpringApplication

You can use Spring Boot's `SpringApplication` class to define configurations
in your Spring Boot application.
This class provides a method named `setDefaultProperties()`
that accepts a `java.util.Properties` or a `java.util.Map<String, Object>` instance
to let you set the configurations.
You can configure all your application properties in the `Properties` or `Map` instance.
This approach is useful for configurations that are one-time configurations, and you need not change them.

```java
package org.springframework.boot;

public class SpringApplication {
    private Map<String, Object> defaultProperties;

    public void setDefaultProperties(Map<String, Object> defaultProperties) {
        this.defaultProperties = defaultProperties;
    }

    public void setDefaultProperties(Properties defaultProperties) {
        this.defaultProperties = new HashMap<>();
        for (Object key : Collections.list(defaultProperties.propertyNames())) {
            this.defaultProperties.put((String) key, defaultProperties.get(key));
        }
    }
}
```

## 示例

### 修改前

File: `application.properties`

```text
spring.application.name=lsieun-config-app
```

```java
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.core.env.Environment;

@SpringBootApplication
public class DemoApplication {
    public static void main(String[] args) {
        ConfigurableApplicationContext context = SpringApplication.run(DemoApplication.class);
        Environment bean = context.getBean(Environment.class);
        String property = bean.getProperty("spring.application.name");
        System.out.println(property);
    }
}
```

输出结果：

```text
lsieun-config-app
```

### 修改后

使用 `SpringApplication.setDefaultProperties()` 方法：

```java
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.core.env.Environment;

import java.util.Properties;

@SpringBootApplication
public class DemoApplication {
    public static void main(String[] args) {
        Properties properties = new Properties();
        properties.setProperty("spring.application.name", "hello-world");

        SpringApplication application = new SpringApplication(DemoApplication.class);
        application.setDefaultProperties(properties);
        ConfigurableApplicationContext context = application.run(args);

        Environment bean = context.getBean(Environment.class);
        String property = bean.getProperty("spring.application.name");
        System.out.println(property);
    }
}
```

输出结果：

```text
hello-world
```
