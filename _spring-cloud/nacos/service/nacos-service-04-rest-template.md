---
title: "服务注册与发现：Spring Cloud"
sequence: "104"
---

- lsieun-spring-cloud-nacos-service-consumer
- lsieun-spring-cloud-nacos-service-provider

## Service Provider

### pom.xml

```xml
<dependencies>
    <!-- boot -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter</artifactId>
    </dependency>

    <!-- web -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>

    <!-- cloud -->
    <dependency>
        <groupId>org.springframework.cloud</groupId>
        <artifactId>spring-cloud-starter-bootstrap</artifactId>
    </dependency>

    <!-- nacos -->
    <dependency>
        <groupId>com.alibaba.cloud</groupId>
        <artifactId>spring-cloud-starter-alibaba-nacos-discovery</artifactId>
    </dependency>
</dependencies>
```

### application.properties

```text
server.port=1916
spring.application.name=service-provider

spring.cloud.nacos.discovery.server-addr=127.0.0.1:8848
```

### Application

```java
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@SpringBootApplication
@EnableDiscoveryClient
public class NacosServiceProviderApplication {
    public static void main(String[] args) {
        SpringApplication.run(NacosServiceProviderApplication.class, args);
    }
}
```

### Controller

```java
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.text.MessageFormat;

@RestController
@RequestMapping("/world")
public class WorldController {

    @GetMapping(value = "/echo/{str}")
    public String echo(@PathVariable String str) {
        return MessageFormat.format("World --- {0} --- World", str);
    }

}
```

### 访问

访问地址：

```text
http://127.0.0.1:1916/world/echo/good
```

输出结果：

```text
World --- good --- World
```

## Service Consumer

### pom.xml

```xml
<dependencies>
    <!-- boot -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter</artifactId>
    </dependency>

    <!-- web -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>

    <!-- cloud -->
    <dependency>
        <groupId>org.springframework.cloud</groupId>
        <artifactId>spring-cloud-starter-bootstrap</artifactId>
    </dependency>

    <!-- nacos -->
    <dependency>
        <groupId>com.alibaba.cloud</groupId>
        <artifactId>spring-cloud-starter-alibaba-nacos-discovery</artifactId>
    </dependency>

    <!-- loadbalancer -->
    <dependency>
        <groupId>org.springframework.cloud</groupId>
        <artifactId>spring-cloud-starter-loadbalancer</artifactId>
    </dependency>
</dependencies>
```

注意：要引入 `spring-cloud-starter-loadbalancer`，否则会出错，找不到 `service-provider`：

```text
java.net.UnknownHostException: service-provider
```

这是 Nacos 自从 2020 版本之后不再整合的是 Netflix，也就没有 Ribbon 了，
它之所以报错是因为其中使用了负载均衡算法，但是没有 Ribbon 了，它不知道该使用哪个服务。
所以这里只需要导入 `spring-cloud-starter-loadbalancer` 依赖即可。

### application.properties

```text
server.port=1903
spring.application.name=service-consumer

spring.cloud.nacos.discovery.server-addr=127.0.0.1:8848
```

### Application

```java
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@SpringBootApplication
@EnableDiscoveryClient
public class NacosServiceConsumerApplication {
    public static void main(String[] args) {
        SpringApplication.run(NacosServiceConsumerApplication.class, args);
    }
}
```

### Config

```java
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.cloud.client.loadbalancer.LoadBalanced;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;

@Configuration
public class RestConfig {
    @LoadBalanced
    @Bean
    public RestTemplate restTemplate(RestTemplateBuilder builder) {
        return builder.build();
    }
}
```

### Controller

```java
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import java.text.MessageFormat;

@RestController
@RequestMapping("/hello")
public class HelloController {
    private final RestTemplate restTemplate;

    @Autowired
    public HelloController(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    @RequestMapping(value = "/echo/{str}", method = RequestMethod.GET)
    public String echo(@PathVariable String str) {
        String msg = restTemplate.getForObject("http://service-provider/world/echo/" + str, String.class);
        return MessageFormat.format("Hello +++ {0} +++ Hello", msg);
    }
}
```

### 访问

访问地址：

```text
http://127.0.0.1:1903/hello/echo/good
```

输出结果：

```text
Hello +++ World --- good --- World +++ Hello
```

## Reference

- [Quick Start for Nacos Spring Cloud Projects](https://nacos.io/en-us/docs/quick-start-spring-cloud.html)
