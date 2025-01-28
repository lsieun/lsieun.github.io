---
title: "Spring Boot 四大特性"
sequence: "105"
---

The essential key components of Spring Boot

- Spring Boot Starter projects
- Auto-configuration
- Spring Boot CLI
- Spring Boot Actuator

Spring Boot Starter reduces a build's dependencies and Spring Boot auto-configuration reduces the Spring configuration.

> starter 解决的是对于 jar 包的信赖；而 auto-configuration 解决的是繁琐的配置。
> 每个 Spring Boot 项目当中，可能都会配置一些 bean 对象；如果有多个 Spring Boot 项目，这些配置就是重复的，auto-configuration 就是解决这个问题的。

1、第一特性，EnableAutoConfiguration，译为自动装配。比如说，Spring Boot 启动时，Tomcat 默认使用 8080 端口；当然，也可以在配置里进行修改。

2、第二特性，Starter启动依赖，依赖于自动装配的请求。它解决了 Jar 包的信赖问题。

3、第三特性，Actuator监控，提供一些endpoint，这些endpoint可以基于http jmx 等形式去进行访问health信息，metrics信息。

4、第四特性，Spring Boot CLI，它是为springcloud提供的springboot命令行操作的功能，它通过groovy脚本快速构建springboot的应用，用得很少，一般还是基于idea应用构建springboot应用


```java
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class BootApplication {
    public static void main(String[] args) {
        SpringApplication.run(BootApplication.class, args);
    }
}
```

- `@SpringBootApplication`. This annotation is actually the  
  `@ComponentScan`, `@Configuration`, and `@EnableAutoConfiguration` annotations.
- `SpringApplication`. This class provides the bootstrap for the Spring
  Boot application that is executed in the `main` method. You need to
  pass the class that is executed.

## SpringApplication Class

You can have a more advance configuration using the `SpringApplication`,
because you can create an instance out of it and do a lot more.

```java
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class BootApplication {
    public static void main(String[] args) {
        SpringApplication app = new SpringApplication(BootApplication.class);
        // add more features here
        app.run(args);
    }
}
```

`SpringApplication` allows you to configure the way your app behaves,
and you have control over the main `ApplicationContext` where all your Spring beans are used.

## Custom Banner

Every time you run your application,
you see a banner displayed at the beginning of the application.
It can be customized in different ways.

### 第一种方式：编程实现

Implement the `org.springframework.boot.Banner` interface:

```java
import org.springframework.boot.Banner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.core.env.Environment;

import java.io.PrintStream;

@SpringBootApplication
public class BootApplication {
    public static void main(String[] args) {
        SpringApplication app = new SpringApplication(BootApplication.class);
        app.setBanner(new Banner() {
            @Override
            public void printBanner(Environment environment, Class<?> sourceClass, PrintStream out) {
                out.print("\n\n\tThis is my own banner!\n\n".toUpperCase());
            }
        });
        app.run(args);
    }
}
```

### 第二种方式：配置实现

create a file named `banner.txt` in the `src/main/resources/` directory

```text
 __          __
|  |   ________| ____  __ __  ____
|  |  /  ___/  |/ __ \|  |  \/    \
|  |__\___ \|  |  ___/_  |  /   |  \
|____/____  \__|\___  /____/|___|  /
          \/        \/           \/
```

### 修改banner.txt位置

By default, Spring Boot looks for the `banner.txt` file in the classpath.
But you can change its location.
Create another `banner.txt` file (or copy the one you have already)
in the `src/main/resources/META-INF/` directory.
Run the application by passing a `-D` parameter.

```text
$ ./mvnw spring-boot:run  -Dspring.banner.location=classpath:/META-INF/banner.txt
```

You can declare this property in the `src/main/resources/application.properties` file, as follows.

```text
spring.banner.location=classpath:/txt/banner.txt
```

### 禁用Banner

You can completely remove the banner.
You can define it in the `src/main/resources/application.properties` like this:

```text
spring.main.banner-mode=off
```

This command has precedence over the default `banner.txt` file located at the `classpath:banner.txt` location.

Also, you can do it programmatically (just remember to comment out the property)

```java
import org.springframework.boot.Banner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class BootApplication {
    public static void main(String[] args) {
        SpringApplication app = new SpringApplication(BootApplication.class);
        app.setBannerMode(Banner.Mode.OFF);
        app.run(args);
    }
}
```

### ASCII Art

- [Text Editor](https://texteditor.com/ascii-art/)
- [ASCII Art Archive](https://www.asciiart.eu/)

## SpringApplicationBuilder

The `SpringApplicationBuilder` class provides a fluent API and is a builder for the
`SpringApplication` and the `ApplicationContext` instances.
It also provides hierarchy support and everything (with the `SpringApplication`) can be set with this builder.

```java
import org.springframework.boot.Banner;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;

@SpringBootApplication
public class BootApplication {
    public static void main(String[] args) {
        new SpringApplicationBuilder()
                .bannerMode(Banner.Mode.OFF)
                .sources(BootApplication.class)
                .run(args);
    }
}
```

### hierarchy

You can have a hierarchy when creating a Spring app.
You can create it with `SpringApplicationBuilder`.

```java
import lsieun.springboot.config.OtherConfig;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;

@SpringBootApplication
public class BootApplication {
    public static void main(String[] args) {
        new SpringApplicationBuilder(BootApplication.class)
                .child(OtherConfig.class)
                .run(args);
    }
}
```

If you have a **web configuration**, make sure that it's being declared as a child.
Also, parent and children must share the same `org.springframework.core.env.Environment` interface
(this represents the environment in which the current application is running;
it is related to profiles and properties declarations).

### log

You can log the information at startup; by default it is set to `true`.

```java
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;

@SpringBootApplication
public class BootApplication {
    public static void main(String[] args) {
        new SpringApplicationBuilder(BootApplication.class)
                .logStartupInfo(false)
                .run(args);
    }
}
```

### profile

You can activate profiles.

```java
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;

@SpringBootApplication
public class BootApplication {
    public static void main(String[] args) {
        new SpringApplicationBuilder(BootApplication.class)
                .profiles("prod", "cloud")
                .run(args);
    }
}
```

### listener

You can attach listeners for some `ApplicationEvent` events.

```java
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.context.ApplicationEvent;
import org.springframework.context.ApplicationListener;

@SpringBootApplication
public class BootApplication {
    public static void main(String[] args) {
        Logger logger = LoggerFactory.getLogger(BootApplication.class);
        new SpringApplicationBuilder(BootApplication.class)
                .listeners(new ApplicationListener<ApplicationEvent>() {
                    @Override
                    public void onApplicationEvent(ApplicationEvent event) {
                        logger.info("####> " + event.getClass().getCanonicalName());
                    }
                })
                .run(args);
    }
}
```

输出：

```text
####> org.springframework.boot.context.event.ApplicationEnvironmentPreparedEvent









####> org.springframework.boot.context.event.ApplicationContextInitializedEvent
Starting BootApplication using Java 1.8.0_202 on DESKTOP-UMKJMRS with PID 7416
No active profile set, falling back to 1 default profile: "default"
####> org.springframework.boot.context.event.ApplicationPreparedEvent
####> org.springframework.context.event.ContextRefreshedEvent
Started BootApplication in 0.436 seconds (JVM running for 0.807)
####> org.springframework.boot.context.event.ApplicationStartedEvent
####> org.springframework.boot.availability.AvailabilityChangeEvent
####> org.springframework.boot.context.event.ApplicationReadyEvent
####> org.springframework.boot.availability.AvailabilityChangeEvent
####> org.springframework.context.event.ContextClosedEvent
```

Your application can add the necessary logic to handle those events.
You can also have these additional events: `ApplicationStartedEvent` (this is sent at the start),
`ApplicationEnvironmentPreparedEvent` (this is sent when the environment is known),
`ApplicationPreparedEvent` (this is sent after the bean definitions),
`ApplicationReadyEvent` (this is sent when the application is ready), and
`ApplicationFailedEvent` (this is sent in case of exception during the startup).

### remove auto-configuration

You can remove any web environment auto-configuration from happening.
Remember that Spring Boot guesses which kind of app you are running based on the classpath.
For a web app, the algorithm is very simple;
but imagine that you are using libraries that actually run without a web environment,
and your app is not a web app, but Spring Boot configures it as such.

```java
import org.springframework.boot.WebApplicationType;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;

@SpringBootApplication
public class BootApplication {
    public static void main(String[] args) {
        new SpringApplicationBuilder(BootApplication.class)
                .web(WebApplicationType.NONE)
                .run(args);
    }
}
```

You find that the `WebApplicationType` is an enum.
Your app can be configured as `WebApplicationType.NONE`, `WebApplicationType.SERVLET`,
and `WebApplicationType.REACTIVE`.
As you can see, its meaning is very straightforward.

## Application Arguments

Spring Boot allows you to get the arguments passed to the application.
When you have `SpringApplication.run(SpringBootSimpleApplication.class, args)`,
you have access to the `args` in you beans.

```java
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.stereotype.Component;

import java.util.List;

@SpringBootApplication
public class BootApplication {
    public static void main(String[] args) {
        SpringApplication.run(BootApplication.class, args);
    }
}

@Component
class MyComponent {
    private static final Logger logger = LoggerFactory.getLogger(MyComponent.class);

    @Autowired
    public MyComponent(ApplicationArguments args) {
        boolean enable = args.containsOption("enable");
        if (enable) {
            logger.info("## > You are enabled!");
        }

        List<String> nonOptionArgs = args.getNonOptionArgs();
        logger.info("## > extra args ...");

        if (!nonOptionArgs.isEmpty()) {
            nonOptionArgs.forEach(item -> logger.info(item));;
        }
    }
}
```

```text
java -jar spring-boot-simple-0.0.1-SNAPSHOT.jar --enable arg1 arg2
```

## ApplicationContext

```java
import lsieun.common.entity.User;
import lsieun.springboot.service.UserService;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ConfigurableApplicationContext;

@SpringBootApplication
public class BootApplication {
    public static void main(String[] args) {
        ConfigurableApplicationContext context = SpringApplication.run(BootApplication.class, args);
        UserService userService = context.getBean(UserService.class);
        User user = userService.findById("abc");
        System.out.println(user);
    }
}
```

