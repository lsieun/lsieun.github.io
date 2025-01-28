---
title: "Config Data File"
sequence: "105"
---

## Config Data File

Spring Boot lets you specify the application configuration properties
in the `application.properties` or `application.yml` file.
This is the most widely used approach to provide a configuration in a Spring Boot application.

By default, the Spring Initializr-generated Spring Boot project includes an empty `application.properties` file.
In case you are comfortable with the YAML or YML files instead of the properties file,
you can provide an `application.yml` file in your application.

Configurations specified in the properties or the YML file are loaded into Spring Environment,
and you can access the `Environment` instance in your application classes.
Besides, you can also use them with the `@Value` annotation.

If you need to change the file name from `application.properties` (or `.yml`) to other custom names,
you can do so easily.
You can customize the file name from `application.properties` with the `spring.config.name` property.
In your Spring Boot application, let's create a file named `sbip.yml` file in the `src\main\resources` folder and
place the `server.port` configuration with value `8081`.

```text
sbip = Spring Boot In Practice
```

```text
java -jar config-data-file-0.0.1-SNAPSHOT.jar --spring.config.name=sbip
```

By default, Spring Boot reads the `application.properties` or `application.yml` file
from the following locations:

- The classpath root
- The classpath `/config` package
- The current directory
- The `/config` subdirectory in the current directory
- Immediate child directories of the `/config` subdirectory

We leave it as an exercise to try out these configurations in your Spring Boot project.

Apart from the above locations, you can also specify a custom location using the
`spring.config.location` property.
For instance, the `java` command in the following listing reads the configuration file from the path
`C:\sbip\repo\ch02\config-data-file\data\sbip.yml` of my Windows machine.

```text
java -jar target\config-data-file-0.0.1-SNAPSHOT.jar
--spring.config.location=C:\sbip\repo\ch02\config-data-file\data\sbip.yml
```

From version 2.4.0 onward, Spring Boot throws an error if it could not find any property file you specified.
You can use the `optional` prefix to indicate the configuration file is optional.
For instance, the command in the following listing continues
to start the Spring Boot application even though the property file `sbip1.yml` is not available in
`C:\sbip\repo\ch02\config-data-file\data\`.

```text
java -jar target\config-data-file-0.0.1-SNAPSHOT.jar
     --spring.config.location=optional:C:\sbip\repo\ch02\config-data-file\data\sbip1.yml 
```

### Note on spring.config.name and spring.config.location properties

Spring Boot loads `spring.config.name` and `spring.config.location` in the early phases of application startup.
Thus, you can't provide these configurations in the `application.properties` or `applicatiom.yml` file.
You can use the `SpringApplication.setDefaultProperties()` method,
**OS environment variable**, or **command-line arguments** to configure these properties.
In the above examples, we've used the commandline arguments options.

```java
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;
import org.springframework.core.env.Environment;

import java.util.Formatter;

@Configuration
@PropertySource("classpath:dbConfig.properties")
@PropertySource("classpath:redisConfig.properties")
public class DbConfiguration {
    @Autowired
    private Environment env;

    @Override
    public String toString() {
        String name = env.getProperty("db.username");
        String pass = env.getProperty("db.password");
        String host = env.getProperty("redis.host");
        String port = env.getProperty("redis.port");
        String serverPort = env.getProperty("server.port");

        StringBuilder sb = new StringBuilder();
        Formatter fm = new Formatter(sb);
        fm.format("Username: %s%n", name);
        fm.format("Password: %s%n", pass);
        fm.format("Host    : %s%n", host);
        fm.format("Port    : %s%n", port);
        fm.format("Server  : %s%n", serverPort);
        return sb.toString();
    }
}
```

```java
import lsieun.springboot.config.DbConfiguration;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ConfigurableApplicationContext;

import java.util.Properties;

@SpringBootApplication
public class DemoApplication {
    public static void main(String[] args) {
        Properties properties = new Properties();
        properties.setProperty("spring.config.name", "sbip");

        SpringApplication application = new SpringApplication(DemoApplication.class);
        application.setDefaultProperties(properties);
        ConfigurableApplicationContext context = application.run(args);

        DbConfiguration bean = context.getBean(DbConfiguration.class);
        System.out.println(bean);
    }
}
```

### Command line arguments

Spring Boot lets you specify the configuration as command-line arguments as well.
You can create a JAR file of the application and specify the properties as command-line arguments
while executing the JAR file.
For instance, in this section, you have specified the `spring.config.name` and `spring.config.location` properties as
the command line arguments.
