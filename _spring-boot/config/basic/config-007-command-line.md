---
title: "Command Line Properties"
sequence: "107"
---

By default, `SpringApplication` converts any command line option arguments
(that is, arguments starting with `--`, such as `--server.port=9000`)
to a property and adds them to the Spring `Environment`.
As mentioned previously, **command line properties** always take precedence over **file-based property sources**.

If you do not want command line properties to be added to the `Environment`,
you can disable them by using `SpringApplication.setAddCommandLineProperties(false)`.

## 示例

File: `application.properties`

```text
server.port=8080
```

```java
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.core.env.Environment;

import java.util.Arrays;

@SpringBootApplication
public class DemoApplication {
    public static void main(String[] args) {
        System.out.println("args = " + Arrays.toString(args));

        ConfigurableApplicationContext context = SpringApplication.run(DemoApplication.class, args);

        Environment bean = context.getBean(Environment.class);
        String property = bean.getProperty("server.port");
        System.out.println("server.port = " + property);
    }
}
```

```text
args = []
server.port = 8080
```

## IDEA

![](/assets/images/spring-boot/properties/command-line-args.png)

输出：

```text
args = [--server.port=9090]
server.port = 9090
```

## Jar

```text
> java -jar lsieun-spring-boot-config-1.0-SNAPSHOT.jar --server.port=9999
args = [--server.port=9999]
server.port = 9999
```

## 禁用命令行参数

使用 `SpringApplication.setAddCommandLineProperties(false)`：

```java
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.core.env.Environment;

import java.util.Arrays;

@SpringBootApplication
public class DemoApplication {
    public static void main(String[] args) {
        System.out.println("args = " + Arrays.toString(args));

        SpringApplication application = new SpringApplication(DemoApplication.class);
        application.setAddCommandLineProperties(false);
        ConfigurableApplicationContext context = application.run(args);

        Environment bean = context.getBean(Environment.class);
        String property = bean.getProperty("server.port");
        System.out.println("server.port = " + property);
    }
}
```

```text
args = [--server.port=9090]
server.port = 8080
```