---
title: "Spring Boot 环境搭建"
sequence: "102"
---


## 下载源码

第 1 步，打开地址：

```text
https://github.com/spring-projects/spring-boot/releases
```

第 2 步，将 `tags` 切换到 `2.2.1.RELEASE` 版本：

```text
https://github.com/spring-projects/spring-boot/tree/v2.2.1.RELEASE
```

第 3 步，下载 ZIP 压缩包。

## 环境准备

- JDK 1.8+
- Maven 3.5+

## 编译源码

![](/assets/images/spring-boot/src/spring-boot-2.2.9-release-directories.png)


在根目录下，执行 Maven 命令：

```text
mvn clean package -Dmaven.test.skip=true -Pfast
```

```text
mvn clean install -DskipTests -Pfast
```

在执行上面命令时，`-P` 参数指定了快速编译；如果需要全量编译，则 `-P` 参数值为 `full`。

问题二

[ERROR] Failed to execute goal org.apache.maven.plugins:maven-checkstyle-plugin:3.1.0:check (nohttp-checkstyle-validation) on project spring-boot-build: You have 1 Checkstyle violation. -> [Help 1]

代码检测插件问题

解决：在根目录下的 `pom.xml` 文件中，缺少一个属性，添加一个 `disable.checks` 属性，如下：

```xml
<properties>
	<revision>2.2.9.RELEASE</revision>
	<main.basedir>${basedir}</main.basedir>
    <!-- 添加属性 -->
	<disable.checks>true</disable.checks>
</properties>
```

问题：Failed to execute goal com.googlecode.maven-download-plugin:download-maven-plugin:1.4.2:wget
(unpack-doc-resources) on project spring-boot-gradle-plugin: IO Error: Could not get content -> [Help 1]

解决： 根据提示，继续输入

```text
mvn clean -rf :spring-boot-gradle-plugin
为避免等待，可以通过下面的方式进行构建
 
mvn clean -rf :spring-boot-gradle-plugin
mvn clean install -DskipTests -Pfast
```

Finally, I deleted the spring boot gradle plugin project,
modified the `pom.xml` in the spring boot tools project, removed this module,
and re executed the `mvn clean install -DSkipTests -Pfast`. The problem was resolved.

## 导入IDEA

导入 IDEA。


打开 `pom.xml` 关闭 Maven 代码检查：

```xml

```

## 新建一个 Module

![](/assets/images/spring-boot/src/spring-boot-2.2.9-new-module.png)

![](/assets/images/spring-boot/src/spring-initializr-spring-boot-mytest.png)

![](/assets/images/spring-boot/src/spring-boot-mytest-spring-web.png)


```xml
<parent>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-parent</artifactId>
    <version>2.2.9.RELEASE</version> <!-- 修改这里的版本号 -->
    <relativePath/>
</parent>
```

```java
package lsieun.mytest;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class DemoApplication {

	public static void main(String[] args) {
		SpringApplication.run(DemoApplication.class, args);
	}

}
```

```java
package lsieun.mytest.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/hello")
public class HelloController {
	@GetMapping("/world")
	public String world() {
		return "Hello World";
	}
}
```

## Reference

- [springboot源码编译问题](https://blog.csdn.net/qq_30024063/article/details/132504311)
