---
title: "依赖管理"
sequence: "103"
---

- 问题一：为什么导入 dependency 时不需要指定版本？
- 问题二：spring-boot-starter-parent 父依赖启动器的主要作用是进行版本统一管理，那么项目依赖的 JAR 包是从何而来的？

在 Spring Boot 入门程序中，项目 `pom.xml` 文件有两个核心依赖：
`spring-boot-starter-parent` 和 `spring-boot-starter-web`。

当前项目的父 pom 是 `spring-boot-starter-parent`：

```xml
<parent>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-parent</artifactId>
    <version>2.2.9.RELEASE</version>
    <relativePath/>
</parent>
```

## spring-boot-starter-parent

### parent

`spring-boot-starter-parent` 的父 POM 是 `spring-boot-dependencies`。

```xml
<parent>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-dependencies</artifactId>
    <version>${revision}</version>
    <relativePath>../../spring-boot-dependencies</relativePath>
</parent>
```

### properties

```xml
<properties>
    <main.basedir>${basedir}/../../..</main.basedir>
    <java.version>1.8</java.version>
    <resource.delimiter>@</resource.delimiter> <!-- delimiter that doesn't clash with Spring ${} placeholders -->
    <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
    <project.reporting.outputEncoding>UTF-8</project.reporting.outputEncoding>
    <maven.compiler.source>${java.version}</maven.compiler.source>
    <maven.compiler.target>${java.version}</maven.compiler.target>
</properties>
```

### build-resources

```xml
<build>
    <!-- Turn on filtering by default for application properties -->
    <resources>
        <resource>
            <directory>${basedir}/src/main/resources</directory>
            <filtering>true</filtering>
            <includes>
                <include>**/application*.yml</include>
                <include>**/application*.yaml</include>
                <include>**/application*.properties</include>
            </includes>
        </resource>
        <resource>
            <directory>${basedir}/src/main/resources</directory>
            <excludes>
                <exclude>**/application*.yml</exclude>
                <exclude>**/application*.yaml</exclude>
                <exclude>**/application*.properties</exclude>
            </excludes>
        </resource>
    </resources>
</build>
```

### build-plugins

在 `spring-boot-starter-parent` 中配置了 `spring-boot-maven-plugin` 插件：

```xml
<build>
    <pluginManagement>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
                <executions>
                    <execution>
                        <id>repackage</id>
                        <goals>
                            <goal>repackage</goal>
                        </goals>
                    </execution>
                </executions>
                <configuration>
                    <mainClass>${start-class}</mainClass>
                </configuration>
            </plugin>
        </plugins>
    </pluginManagement>
</build>
```

在我们自己编写的 Spring Boot 项目中，只需要引用 `spring-boot-maven-plugin` 插件，不需要进行更多的参数配置：

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

## spring-boot-dependencies

```xml
<properties>
    <main.basedir>${basedir}/../..</main.basedir>

    <!-- Dependency versions -->
    <activemq.version>5.15.13</activemq.version>
</properties>
```

```xml
<dependencyManagement>
    <dependencies>
        <dependency>
            <groupId>org.apache.activemq</groupId>
            <artifactId>activemq-amqp</artifactId>
            <version>${activemq.version}</version>
        </dependency>
    </dependencies>
</dependencyManagement>
```

## spring-boot-starter-web


