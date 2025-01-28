---
title: "Using @PropertySource"
sequence: "104"
---

## Using @PropertySource

In your Spring configuration classes, you can specify the `@PropertySource` annotation
with the location of the property file to load configurations.

File: `src/main/resources/dbConfig.properties`

```text
db.username=tomcat
db.password=123456
```

```java
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;
import org.springframework.core.env.Environment;

@Configuration
@PropertySource("classpath:dbConfig.properties")
public class DbConfiguration {
    @Autowired
    private Environment env;

    @Override
    public String toString() {
        String name = env.getProperty("db.username");
        String pass = env.getProperty("db.password");
        return String.format("Username: %s, Password: %s", name, pass);
    }
}
```

```java
import lsieun.springboot.config.DbConfiguration;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ConfigurableApplicationContext;

@SpringBootApplication
public class DemoApplication {
    public static void main(String[] args) {
        ConfigurableApplicationContext context = SpringApplication.run(DemoApplication.class);
        DbConfiguration bean = context.getBean(DbConfiguration.class);
        System.out.println(bean);
    }
}
```

### @PropertySource

- YML or YAML files are not supported with this annotation like properties files.
  You need to write additional code to support YML files.

```java

@Configuration
@PropertySource("classpath:dbConfig.yml")    // 注意：这里不支持 yml 文件
public class DbConfiguration {
    @Autowired
    private Environment env;

    @Override
    public String toString() {
        String name = env.getProperty("db.username");
        String pass = env.getProperty("db.password");
        return String.format("Username: %s, Password: %s", name, pass);
    }
}
```

- With Java 8 and above, you can repeat `@PropertySource` annotation with other configuration files.

The following code snippet shows `@PropertySource` Java 8 configuration
that loads properties from `dbConfig.properties` and `redisConfig.properties` files.

File: `redisConfig.properties`

```properties
redis.host=127.0.0.1
redis.port=6379
```

```java
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;
import org.springframework.core.env.Environment;

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
        return String.format("Username: %s, Password: %s, Host: %s, Port: %s", name, pass, host, port);
    }
}
```
