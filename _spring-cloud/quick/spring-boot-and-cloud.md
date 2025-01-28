---
title: "Spring Boot + Spring Cloud"
sequence: "101"
---

## 版本兼容性

```text
https://start.spring.io/actuator/info
```

```text
"spring-cloud": {
    "2021.0.8": "Spring Boot >=2.6.0 and <3.0.0",
    "2022.0.4": "Spring Boot >=3.0.0 and <3.2.0-M1",
    "2023.0.0-M2": "Spring Boot >=3.2.0-M1 and <3.2.0-SNAPSHOT",
    "2023.0.0-SNAPSHOT": "Spring Boot >=3.2.0-SNAPSHOT"
}
```

## Pom.xml

### properties

```xml

<properties>
    <!-- resource -->
    <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
    <project.reporting.outputEncoding>UTF-8</project.reporting.outputEncoding>

    <!-- JDK -->
    <java.version>17</java.version>
    <maven.compiler.source>${java.version}</maven.compiler.source>
    <maven.compiler.target>${java.version}</maven.compiler.target>

    <!-- Spring Boot/Cloud -->
    <spring-boot.version>2.7.17</spring-boot.version>
    <spring-cloud.version>2021.0.8</spring-cloud.version>
    <spring-cloud-alibaba.version>2021.0.5.0</spring-cloud-alibaba.version>
</properties>
```

### dependencyManagement

```xml

<dependencyManagement>
    <dependencies>
        <!-- Spring Boot Dependencies -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-dependencies</artifactId>
            <version>${spring-boot.version}</version>
            <type>pom</type>
            <scope>import</scope>
        </dependency>

        <!-- Spring Cloud Dependencies -->
        <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-dependencies</artifactId>
            <version>${spring-cloud.version}</version>
            <type>pom</type>
            <scope>import</scope>
        </dependency>

        <!-- Spring Cloud Alibaba Dependencies -->
        <dependency>
            <groupId>com.alibaba.cloud</groupId>
            <artifactId>spring-cloud-alibaba-dependencies</artifactId>
            <version>${spring-cloud-alibaba.version}</version>
            <type>pom</type>
            <scope>import</scope>
        </dependency>
    </dependencies>
</dependencyManagement>
```

### dependencies

```xml

<dependencies>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>

    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-test</artifactId>
        <scope>test</scope>
    </dependency>
</dependencies>
```

### build

```xml

<build>
    <plugins>
        <plugin>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-maven-plugin</artifactId>
        </plugin>
    </plugins>
</build>
```

## Reference

- [查看Spring Cloud与Spring Boot的版本兼容性JSON格式](https://start.spring.io/actuator/info)
- [Mvn Repo: Spring Cloud Alibaba Dependencies](https://mvnrepository.com/artifact/com.alibaba.cloud/spring-cloud-alibaba-dependencies)
- [Mvn Repo: Spring Cloud Dependencies](https://mvnrepository.com/artifact/org.springframework.cloud/spring-cloud-dependencies)
- [Mvn Repo: Spring Boot Dependencies](https://mvnrepository.com/artifact/org.springframework.boot/spring-boot-dependencies)
