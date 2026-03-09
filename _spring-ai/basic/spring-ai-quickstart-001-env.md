---
title: "Spring AI 开发环境"
sequence: "101"
---

[UP](/spring-ai/index.html)

## 开发环境

- Java 版本: 21（17 或更高版本）
- Spring Boot 版本: `3.5.11`
- Spring AI 版本：`1.1.2`
- Spring AI Alibaba 版本：`1.1.2.0`

## pom.xml

```xml
<properties>
    <!-- Resource -->
    <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>

    <!-- JDK -->
    <java.version>21</java.version>
    <maven.compiler.source>${java.version}</maven.compiler.source>
    <maven.compiler.target>${java.version}</maven.compiler.target>

    <!-- Spring Boot -->
    <spring-boot.version>3.5.11</spring-boot.version>
    <!-- Spring AI -->
    <spring-ai.version>1.1.2</spring-ai.version>
    <!-- Spring Ai Alibaba -->
    <spring-ai-alibaba.version>1.1.2.0</spring-ai-alibaba.version>
</properties>
```

```xml
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

        <!-- Spring AI Dependencies-->
        <dependency>
            <groupId>org.springframework.ai</groupId>
            <artifactId>spring-ai-bom</artifactId>
            <version>${spring-ai.version}</version>
            <type>pom</type>
            <scope>import</scope>
        </dependency>

        <!-- Spring AI Alibaba Dependencies-->
        <dependency>
            <groupId>com.alibaba.cloud.ai</groupId>
            <artifactId>spring-ai-alibaba-bom</artifactId>
            <version>${spring-ai-alibaba.version}</version>
            <type>pom</type>
            <scope>import</scope>
        </dependency>
    </dependencies>
</dependencyManagement>
```
