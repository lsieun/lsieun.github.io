---
title: "Swagger和Knife4j"
sequence: "102"
---

## Swagger

SpringFox是Spring社区维护的一个项目（非官方），用于帮助开发者生成文档。

### pom.xml

```xml
<dependencies>
    <!-- web -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
        <version>${spring-boot.version}</version>
    </dependency>

    <!-- springfox-boot-starter -->
    <dependency>
        <groupId>io.springfox</groupId>
        <artifactId>springfox-boot-starter</artifactId>
        <version>3.0.0</version>
    </dependency>
</dependencies>
```

### application.yml

```yaml
spring:
  mvc:
    pathmatch:
      matching-strategy: ant_path_matcher
```

## 第一版

### Application

在Spring Boot主类上标注`@EnableOpenApi`，浏览器访问 `http://localhost:8080/swagger-ui/` 即可访问到初始页面：

```java
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import springfox.documentation.oas.annotations.EnableOpenApi;


@SpringBootApplication
@EnableOpenApi
public class SwaggerApplication {
    public static void main(String[] args) {
        SpringApplication.run(SwaggerApplication.class, args);
    }
}
```

### 查看效果

在浏览器中访问：

```text
http://localhost:8080/swagger-ui/index.html
```

出现如下界面：

![](/assets/images/spring-boot/spring-boot-swagger-ui-default.png)

## 第二版

### Application

将 `@EnableOpenApi` 注解移到 `SwaggerConfig` 类上。

```java
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class SwaggerApplication {
    public static void main(String[] args) {
        SpringApplication.run(SwaggerApplication.class, args);
    }
}
```

### SwaggerConfig

```java
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import springfox.documentation.builders.ApiInfoBuilder;
import springfox.documentation.builders.PathSelectors;
import springfox.documentation.builders.RequestHandlerSelectors;
import springfox.documentation.oas.annotations.EnableOpenApi;
import springfox.documentation.service.ApiInfo;
import springfox.documentation.service.Contact;
import springfox.documentation.spi.DocumentationType;
import springfox.documentation.spring.web.plugins.Docket;

@Configuration
@EnableOpenApi
public class SwaggerConfig {
    @Bean
    public Docket lsieunApi(){
        return new Docket(DocumentationType.OAS_30)
                .apiInfo(apiInfo())
                .select()
                .apis(RequestHandlerSelectors.basePackage("lsieun.swagger.controller"))
                .paths(PathSelectors.any())
                .build()
                .groupName("SomeGroup")
                .enable(true);
    }

    private ApiInfo apiInfo(){
        return new ApiInfoBuilder()
                .title("这里是Swagger3测试文档")
                .description("这里是文档描述信息")
                .contact(new Contact("liusen", "https://lsieun.github.io", "515882294@qq.com"))
                .version("1.0")
                .build();
    }
}
```

### 查看效果

在浏览器中访问：

```text
http://localhost:8080/swagger-ui/index.html
```

出现如下界面：

![](/assets/images/spring-boot/spring-boot-swagger-ui-with-config.png)

### Controller

```java
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lsieun.swagger.entity.User;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/user")
@Tag(name = "用户管理")
public class UserController {
    @GetMapping("/{id}")
    @Operation(summary = "获取用户信息")
    public User getById(@PathVariable Integer id) {
        return new User(id, "新用户" + id);
    }

    @PostMapping("")
    @Operation(summary = "保存用户信息")
    public String save(User user) {
        System.out.println(user);
        return "OK";
    }
}
```

## 常用注解

swagger3的注解与swagger2相差很多，也兼容了swagger2的注解，区别如下：

| Swagger2           | OpenAPI 3                                                 | 注解位置              |
|--------------------|-----------------------------------------------------------|-------------------|
| @Api               | @Tag                                                      | Controller类上      |
| @ApiOperation      | @Operation                                                | Controller方法上     |
| @ApiImplicitParams | @Parameters                                               | Controller方法上     |
| @ApiImplicitParam  | @Parameter                                                | @Parameters里      |
| @ApiParam          | @Parameter                                                | @Controller方法的参数上 |
| @ApiIgnore         | @Parameter(hidden=true) 或 @Operation(hidden=true)或@Hidden |                   |
| @ApiModel          | @Schema                                                   | DTO类上             |
| @ApiModelProperty  | @Schema                                                   | DTO属性上            |

```java
@Data
@ApiModel(value = "用户类",description = "用户")
public class User {
    @Schema(description = "用户名")
    private String username;
    @Schema(description = "密码")
    private String password;
}
```

```java
@RestController
@Api(tags = "用户信息处理")
public class HelloController {
    @GetMapping("/user")
    @Operation(summary = "获取用户信息")
    @ApiImplicitParams({@ApiImplicitParam(name = "username", value = "用户名"),
            @ApiImplicitParam(name = "password", value = "密码")})
    public User getUser(@RequestParam("username")String username, @RequestParam("password")String password){
        User user = new User();
        user.setUsername(username);
        user.setPassword(password);
        return user;
    }
}
```

这里的@Paramters和@Parameter注解竟然不生效，具体原因找了挺久也没有结果，有知道的朋友欢迎补充！

## Knife4j

使用knife4j优化体验

### pom.xml

引入依赖

```xml
<dependency>
    <groupId>com.github.xiaoymin</groupId>
    <artifactId>knife4j-spring-boot-starter</artifactId>
    <version>3.0.3</version>
</dependency>
```

### 查看效果

在浏览器中访问：

```text
http://localhost:8080/doc.html
```

出现如下界面：

![](/assets/images/spring-boot/spring-boot-swagger-knife4j-doc.png)

## Reference

- [Spring boot集成Swagger3](https://blog.csdn.net/weixin_45834777/article/details/115630399)
- [What's the Difference Between Swagger and OpenAPI?](https://nordicapis.com/whats-the-difference-between-swagger-and-openapi/)
- [What Is the Difference Between Swagger and OpenAPI?](https://swagger.io/blog/api-strategy/difference-between-swagger-and-openapi/)
- []()
