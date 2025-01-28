---
title: "OpenAPI：快速开始"
sequence: "302"
---

## 基础环境搭建

### pom.xml

For the integration between **spring-boot** and **swagger-ui**,
add the library to the list of your project dependencies
(No additional configuration is needed)

```xml
<dependency>
    <groupId>org.springdoc</groupId>
    <artifactId>springdoc-openapi-ui</artifactId>
    <version>1.6.12</version>
</dependency>
```

This will automatically deploy swagger-ui to a spring-boot application:

- Documentation will be available in HTML format, using the official [swagger-ui jars][swagger-ui-git]
- The Swagger UI page will then be available at `http://server:port/context-path/swagger-ui/index.html`
  and the OpenAPI description will be available at the following url for json format: 
  `http://server:port/context-path/v3/api-docs`
  - `server`: The server name or IP
  - `port`: The server port
  - `context-path`: The context path of the application
- Documentation can be available in yaml format as well, on the following path : `/v3/api-docs.yaml`

```xml
<dependencies>
    <!-- starter -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter</artifactId>
    </dependency>

    <!-- web -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>

    <!-- openapi-ui -->
    <dependency>
        <groupId>org.springdoc</groupId>
        <artifactId>springdoc-openapi-ui</artifactId>
        <version>1.6.12</version>
    </dependency>
</dependencies>
```

引入`springdoc-openapi-ui`之后，

### Application

```java
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class OpenAPIApplication {
    public static void main(String[] args) {
        SpringApplication.run(OpenAPIApplication.class, args);
    }
}
```

### 浏览器

我们不需要写任何的Controller类，就可以进行浏览。

在默认情况下，访问路径为`/v3/api-docs`：

```text
http://localhost:8080/v3/api-docs/
```

输出内容如下：

```text
{
    "openapi":"3.0.1",
    "info":{
        "title":"OpenAPI definition",
        "version":"v0"
    },
    "servers":[
        {
            "url":"http://localhost:8080/",
            "description":"Generated server url"
        }
    ],
    "paths":{
        
    },
    "components":{
        
    }
}
```

To use a custom path, we can indicate in the `application.properties` file:

```text
springdoc.api-docs.path=/api-docs
```

```text
http://localhost:8080/api-docs/
```

## Swagger UI

```text
http://localhost:8080/swagger-ui/index.html
```

## Reference

- [Spring REST Docs vs OpenAPI](https://www.baeldung.com/spring-rest-docs-vs-openapi)
- [Documenting a Spring REST API Using OpenAPI 3.0](https://www.baeldung.com/spring-rest-openapi-documentation)

[swagger-ui-git]: https://github.com/swagger-api/swagger-ui.git
