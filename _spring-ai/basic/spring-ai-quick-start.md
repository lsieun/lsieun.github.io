---
title: "快速开始"
sequence: "102"
---

## 开发环境

- Java 版本: 17 或更高版本
- Spring Boot 版本: 3.x



## 代码实践

### pom.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>lsieun</groupId>
    <artifactId>learn-spring-ai-001-quick-start-dashscope</artifactId>
    <version>1.0-SNAPSHOT</version>

    <properties>
        <!-- Resource -->
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>

        <!-- JDK -->
        <java.version>17</java.version>
        <maven.compiler.source>${java.version}</maven.compiler.source>
        <maven.compiler.target>${java.version}</maven.compiler.target>

        <!-- Spring Boot -->
        <spring-boot.version>3.5.11</spring-boot.version>
        <spring-ai-alibaba.version>1.1.2.1</spring-ai-alibaba.version>
    </properties>

    <dependencyManagement>
        <dependencies>
            <!-- Spring Boot Dependencies-->
            <dependency>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-dependencies</artifactId>
                <version>${spring-boot.version}</version>
                <type>pom</type>
                <scope>import</scope>
            </dependency>
        </dependencies>
    </dependencyManagement>

    <dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>

        <!-- 引入 DashScope 依赖 -->
        <dependency>
            <groupId>com.alibaba.cloud.ai</groupId>
            <artifactId>spring-ai-alibaba-starter-dashscope</artifactId>
            <version>${spring-ai-alibaba.version}</version>
        </dependency>
    </dependencies>

</project>
```

### application.yml

```yaml
spring:
  ai:
    dashscope:
      api-key: ${DASHSCOPE_API_KEY}
      chat:
        options:
          model: qwen-plus
```

### Java

#### SpringAiApplication.java

```java
package lsieun.ai;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.web.context.WebServerApplicationContext;
import org.springframework.context.ConfigurableApplicationContext;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

@SpringBootApplication
public class SpringAiApplication {

    public static void main(String[] args) {
        ConfigurableApplicationContext context = SpringApplication.run(SpringAiApplication.class, args);


        WebServerApplicationContext webServerContext = (WebServerApplicationContext) context;
        int port = webServerContext.getWebServer().getPort();


        // http://localhost:8080/chat/ask?question=写一首人生哲理的小诗
        String url = String.format("http://localhost:%d/chat/ask?question=%s",
                port,
                URLEncoder.encode("写一首人生哲理的小诗", StandardCharsets.UTF_8)
        );
        System.out.println(url);
    }
}
```

#### ChatController.java

```java
package lsieun.ai.controller;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping("/chat")
public class ChatController {
    private final ChatClient chatClient;

    // 构造函数注入 ChatClient.Builder
    public ChatController(ChatClient.Builder chatClientBuilder) {
        this.chatClient = chatClientBuilder.build();
    }

    // 原始基础调用保留
    @GetMapping("/ask")
    public String ask(@RequestParam(name = "question", required = false) String question) {
        // 第 1 步，处理参数
        if (!StringUtils.hasText(question)) {
            question = "你好";
        }

        // 第 2 步，prompt() 方法用于创建一个新的聊天请求规范
        ChatClient.ChatClientRequestSpec prompt = this.chatClient.prompt();

        // 第 3 步，返回结果
        // user() 方法用于设置用户输入的问题
        // call() 方法用于执行聊天请求并返回响应
        // content() 方法用于提取响应体中的文本内容
        return prompt.user(question).call().content();
    }
}
```

## 浏览器测试

- [http://localhost:8080/chat/ask](http://localhost:8080/chat/ask)
- [http://localhost:8080/chat/ask?question=写一首人生哲理的小诗](http://localhost:8080/chat/ask?question=%E5%86%99%E4%B8%80%E9%A6%96%E4%BA%BA%E7%94%9F%E5%93%B2%E7%90%86%E7%9A%84%E5%B0%8F%E8%AF%97)

## 集成测试

### pom.xml

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-test</artifactId>
    <scope>test</scope>
</dependency>
```

```xml
<dependency>
    <groupId>org.junit.platform</groupId>
    <artifactId>junit-platform-launcher</artifactId>
    <scope>test</scope>
</dependency>
```

### ChatControllerTest.java

```java
package lsieun.ai.controller;

import jakarta.annotation.Resource;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.http.ResponseEntity;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

import static org.junit.jupiter.api.Assertions.assertTrue;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class ChatControllerTest {
    @LocalServerPort
    private int port;

    @Resource
    private TestRestTemplate restTemplate;


    @Test
    void testAsk() {
        String question = URLEncoder.encode("人工智能的本质是什么", StandardCharsets.UTF_8);
        String url = String.format("http://localhost:%d/chat/ask?question=%s", port, question);
        ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);

        assertTrue(response.getStatusCode().is2xxSuccessful(), "HTTP Status 应为 2xx");

        String body = response.getBody();
        System.out.println(body);
    }
}
```
