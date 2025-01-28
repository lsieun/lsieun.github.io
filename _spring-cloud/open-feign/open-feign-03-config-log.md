---
title: "OpenFeign：日志配置"
sequence: "103"
---

## Feign日志级别

在`feign.Logger.Level`类中，提供了四种日志级别：

- NONE
- BASIC
- HEADERS
- FULL

```java
package feign;

public abstract class Logger {
    public enum Level {
        /**
         * No logging.
         */
        NONE,
        /**
         * Log only the request method and URL and the response status code and execution time.
         */
        BASIC,
        /**
         * Log the basic information along with request and response headers.
         */
        HEADERS,
        /**
         * Log the headers, body, and metadata for both requests and responses.
         */
        FULL
    }
}
```

## 配置类：全局

### FeignConfig

```java
import feign.Logger;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class FeignConfig {
    @Bean
    public Logger.Level feignLoggerLevel() {
        return Logger.Level.FULL;
    }
}
```

但是，没有生效；原因是Feign的日志级别是`DEBUG`，而Spring Boot的默认日志级别是`INFO`，因此无法输出。

### application.properties

在`application.properties`文件中，添加如下配置：

```text
logging.level.lsieun.feign.service=debug
```



## 配置类-局部

### application.properties

在`application.properties`文件中，添加如下配置：

```text
logging.level.lsieun.feign.service=debug
```

### FeignConfig

```java
import feign.Logger;
import org.springframework.context.annotation.Bean;

// 注意：这里没有@Configuration注解
public class FeignConfig {
    @Bean
    public Logger.Level feignLoggerLevel() {
        return Logger.Level.FULL;
    }
}
```

### @FeignClient

在`@FeignClient`注解中，让`configuration`属性赋值为`FeignConfig.class`：

```java
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

@FeignClient(value = "service-provider", path = "/echo", configuration = FeignConfig.class)
public interface EchoFeignService {
    @RequestMapping(value = "/{str}", method = RequestMethod.GET)
    String say(@PathVariable(value = "str") String str);
}
```

## 配置文件

```text
# Spring Boot日志级别
logging.level.lsieun.feign.service=debug

# Feign日志级别
# feign.client.config.服务名.logger-level=full
feign.client.config.service-provider.logger-level=full
```
