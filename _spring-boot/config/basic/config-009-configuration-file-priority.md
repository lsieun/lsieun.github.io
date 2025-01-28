---
title: "配置文件优先级"
sequence: "109"
---

## 不同方式的属性设置方式

Following is the order in which properties get precedence. The higher
sequence number overrides the properties of the lower sequence number:

- (1) SpringApplication
- (2) @PropertySource
- (3) Config data file
- (4) OS environment variable
- (5) Command line arguments

Thus, a property specified in the **command line arguments** has the highest precedence
over a property specified in the config data file.
You can refer to Spring Boot documentation available at http://mng.bz/wnWq for an in-depth understanding of
various features on configuration management in your Spring Boot application.

## 不同位置的 application

SpringBoot中4级配置文件：

- 1级：file: config/application.yml 最高
- 2级：file: application.yml
- 3级：classpath: config/application.yml
- 4级：classpath: application.yml 最低

## 自定义配置文件

如果不想使用 `application.properties` 文件名，而是想使用 `ebank.properties` 作为配置：

```text
java -jar springboot.jar --spring.config.name=ebank
```

注意：上面的 `ebank` 没有后缀

使用路径：

```text
--spring-boot.config.location=classpath:/ebank.yml
```

当有多个配置文件时，最后一个生效：

```text
--spring-boot.config.location=classpath:/ebank.yml,classpath:/ebank-server.yml
```
