---
title: "GitLab 项目"
sequence: "105"
---

## 新建 GitLab 项目

第 1 步，打开浏览器

```text
http://192.168.80.251/
```

第 2 步，新建项目 `myproject-ci`

![](/assets/images/devops/gitlab/gitlab-005-create-blank-project.png)

第 3 步，拉取代码

```text
$ git clone http://192.168.80.251/root/myproject-ci
```

## 项目代码

### Spring Initializer

第 1 步，选择 Spring Initializr：

![](/assets/images/devops/gitlab/gitlab-006-idea-spring-initializer.png)

第 2 步，选择 Spring Web：

- 2.7.15 版本

![](/assets/images/devops/gitlab/gitlab-007-spring-web.png)



### 编写代码

#### pom.xml

设置 `build.finalName`，这样就会生成 `myproject.jar` 文件。

```xml
<build>
    <finalName>myproject</finalName>
    <plugins>
        <plugin>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-maven-plugin</artifactId>
        </plugin>
    </plugins>
</build>
```

或者使用

```text
java -jar myproject*.jar
```

#### application.properties

```text
server.port=8888
```

#### Application

```java
package lsieun.web;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class MyApplication {

    public static void main(String[] args) {
        SpringApplication.run(MyApplication.class, args);
    }

}
```

#### HelloController

```java
package lsieun.web.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;

@RestController
@RequestMapping("/hello")
public class HelloController {
    @GetMapping("/world")
    public String world() {
        DateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        Date now = new Date();
        String timestamp = df.format(now);

        return String.format("Hello World @ %s", timestamp);
    }
}
```

### 浏览器访问

```text
http://localhost:8888/hello/world
```

### 代码提交

第 1 步，提交代码

![](/assets/images/devops/gitlab/gitlab-008-initial-commit.png)

第 2 步，网页上验证

![](/assets/images/devops/gitlab/gitlab-009-web-page-initial-commit.png)
