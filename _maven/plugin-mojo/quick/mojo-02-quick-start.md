---
title: "Mojo: Quick Start"
sequence: "102"
---

[UP](/maven-index.html)


## pom.xml

### packaging

注意：`packaging` 设置为 `maven-plugin`

```text
<groupId>lsieun</groupId>
<artifactId>hello-maven-plugin</artifactId>
<version>1.0-SNAPSHOT</version>
<packaging>maven-plugin</packaging>
```

The major difference between this and a JAR project is that the `<packaging>` is of type `maven-plugin`.

### prerequisites

```xml
<prerequisites>
    <maven>3.5</maven>
</prerequisites>
```

There must be a `<prerequisites>` element to set the minimal Maven version.

### properties

```xml
<properties>
    <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
    <project.reporting.outputEncoding>UTF-8</project.reporting.outputEncoding>
    <java.version>8</java.version>
    <maven.compiler.source>${java.version}</maven.compiler.source>
    <maven.compiler.target>${java.version}</maven.compiler.target>
    <maven.plugin.skipErrorNoDescriptorsFound>true</maven.plugin.skipErrorNoDescriptorsFound>
</properties>
```

There's also a required property, `maven.plugin.skipErrorNoDescriptorsFound`, that always needs to be set to `false`.

### dependencies

```xml
<dependencies>
    <dependency>
        <groupId>org.apache.maven</groupId>
        <artifactId>maven-plugin-api</artifactId>
        <version>3.8.5</version>
        <scope>provided</scope>
    </dependency>

    <!-- dependencies to annotations -->
    <dependency>
        <groupId>org.apache.maven.plugin-tools</groupId>
        <artifactId>maven-plugin-annotations</artifactId>
        <version>3.6.4</version>
        <scope>provided</scope>
    </dependency>
</dependencies>
```

I use two dependencies here: 

- `maven-plugin-annotations` delivers the `@Mojo` annotation
- `maven-plugin-api` provides the `Mojo` interface
  (and several related types such as exceptions, an abstract implementation, and the `Log` type),
  as well as **Sisu**, which in turn brings in the **JSR 330** (and **JSR 250**) annotations.

### 完整的 pom.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>lsieun</groupId>
    <artifactId>hello-maven-plugin</artifactId>
    <version>1.0-SNAPSHOT</version>
    <packaging>maven-plugin</packaging>
    <description>This my Hello Plugin</description>

    <properties>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
        <project.reporting.outputEncoding>UTF-8</project.reporting.outputEncoding>
        <java.version>8</java.version>
        <maven.compiler.source>${java.version}</maven.compiler.source>
        <maven.compiler.target>${java.version}</maven.compiler.target>
    </properties>

    <dependencies>
        <dependency>
            <groupId>org.apache.maven</groupId>
            <artifactId>maven-plugin-api</artifactId>
            <version>3.8.5</version>
            <scope>provided</scope>
        </dependency>

        <!-- dependencies to annotations -->
        <dependency>
            <groupId>org.apache.maven.plugin-tools</groupId>
            <artifactId>maven-plugin-annotations</artifactId>
            <version>3.6.4</version>
            <scope>provided</scope>
        </dependency>
    </dependencies>
</project>
```

## 代码

```java
package lsieun.mojo;

import org.apache.maven.plugin.AbstractMojo;
import org.apache.maven.plugin.MojoExecutionException;
import org.apache.maven.plugin.MojoFailureException;
import org.apache.maven.plugins.annotations.Mojo;

@Mojo(name = "sayhi")
public class GreetingMojo extends AbstractMojo {
    @Override
    public void execute() throws MojoExecutionException, MojoFailureException {
        getLog().info("精诚所至，金石为开");
    }
}
```

## Install

```text
mvn clean install
```

## 测试

### 单独测试

```xml
<build>
    <plugins>
        <plugin>
            <groupId>lsieun</groupId>
            <artifactId>hello-maven-plugin</artifactId>
            <version>1.0-SNAPSHOT</version>
        </plugin>
    </plugins>
</build>
```

```text
mvn groupId:artifactId:version:goal
```

```text
mvn lsieun:hello-maven-plugin:1.0-SNAPSHOT:sayhi
```

### 加入生命周期

```xml
<build>
    <plugins>
        <plugin>
            <groupId>lsieun</groupId>
            <artifactId>hello-maven-plugin</artifactId>
            <version>1.0-SNAPSHOT</version>
            <executions>
                <execution>
                    <id>message-from-hello-plugin</id>
                    <phase>compile</phase>
                    <goals>
                        <goal>
                            sayhi
                        </goal>
                    </goals>
                </execution>
            </executions>
        </plugin>
    </plugins>
</build>
```

```text
mvn clean compile
```

## 总结

本文的主要目的是演示一下如何编写一个简单的 Maven Plugin，让我们有一个直观的印象，并不需要记忆一些细节内容。
大家只要根据我们的步骤，能够进行操作就足够了，后续我们会详细介绍。

本文内容总结如下：

- 第一点，在开发 Maven 插件时，要注意 `packaging` 的值为 `maven-plugin`。

```xml
<packaging>maven-plugin</packaging>
```

- 第二点，项目依赖。其中，`AbstractMojo` 来自于 `maven-plugin-api` 类库，而 `@Mojo` 来自于 `maven-plugin-annotations` 类库。

```java
@Mojo(name = "sayhi")
public class GreetingMojo extends AbstractMojo {
    //...
}
```

- 第三点，编写代码。我们编写的 Mojo 类，要继承自 `AbstractMojo` 类，重点是实现其 `execute()` 方法。

```java
@Mojo(name = "sayhi")
public class GreetingMojo extends AbstractMojo {
    @Override
    public void execute() throws MojoExecutionException, MojoFailureException {
        getLog().info("精诚所至，金石为开");
    }
}
```
