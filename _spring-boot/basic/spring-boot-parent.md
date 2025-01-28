---
title: "Spring Boot: Parent"
sequence: "103"
---

- parent：定义了若干坐标版本，减少依赖冲突（**仅定义，未使用**）
- starter：引入Jar依赖（**进行使用**）
- 引导类：初始化Spring容器，扫描引导类所在包，加载Bean（**未启动Web服务器**）
- 内嵌tomcat

parent和starter解决的Jar包的配置问题，

## parent

### 我的pom.xml

```text
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>2.7.3</version>
        <relativePath/> <!-- lookup parent from repository -->
    </parent>
    <groupId>lsieun</groupId>
    <artifactId>lsieun-tmp-spring-boot</artifactId>
    <version>0.0.1-SNAPSHOT</version>
    <name>lsieun-tmp-spring-boot</name>
    <description>lsieun-tmp-spring-boot</description>
    <properties>
        <java.version>11</java.version>
        <snakeyaml.version>1.32</snakeyaml.version>
    </properties>
    <dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter</artifactId>
        </dependency>

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

    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
            </plugin>
        </plugins>
    </build>

</project>

```

### spring-boot-starter-parent

在`spring-boot-starter-parent`的`pom.xml`文件中：

- 第一，继承自`spring-boot-dependencies`
- 第二，定义了一些properties

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
    <modelVersion>4.0.0</modelVersion>
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-dependencies</artifactId>
        <version>2.7.3</version>
    </parent>
    <artifactId>spring-boot-starter-parent</artifactId>
    <packaging>pom</packaging>
    <name>spring-boot-starter-parent</name>
    <description>Parent pom providing dependency and plugin management for applications built with Maven</description>
    <properties>
        <java.version>1.8</java.version>
        <resource.delimiter>@</resource.delimiter>
        <maven.compiler.source>${java.version}</maven.compiler.source>
        <maven.compiler.target>${java.version}</maven.compiler.target>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
        <project.reporting.outputEncoding>UTF-8</project.reporting.outputEncoding>
    </properties>
    <url>https://spring.io/projects/spring-boot</url>

    <build>
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
        <pluginManagement>
            <!-- ... -->
        </pluginManagement>
    </build>
</project>
```

### spring-boot-dependencies

正是`spring-boot-dependencies`定义的`pom.xml`文件解决了Jar包依赖，避免不同的Jar包版本冲突。

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
    <modelVersion>4.0.0</modelVersion>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-dependencies</artifactId>
    <version>2.7.3</version>
    <packaging>pom</packaging>
    <name>spring-boot-dependencies</name>
    <description>Spring Boot Dependencies</description>
    <url>https://spring.io/projects/spring-boot</url>
    
    <properties>
        <byte-buddy.version>1.12.13</byte-buddy.version>
        <graphql-java.version>18.3</graphql-java.version>
        <gson.version>2.9.1</gson.version>
        <jedis.version>3.8.0</jedis.version>
        <junit.version>4.13.2</junit.version>
        <junit-jupiter.version>5.8.2</junit-jupiter.version>
        <log4j2.version>2.17.2</log4j2.version>
        <logback.version>1.2.11</logback.version>
        <lombok.version>1.18.24</lombok.version>
        <maven-assembly-plugin.version>3.3.0</maven-assembly-plugin.version>
        <maven-clean-plugin.version>3.2.0</maven-clean-plugin.version>
        <maven-compiler-plugin.version>3.10.1</maven-compiler-plugin.version>
        <maven-dependency-plugin.version>3.3.0</maven-dependency-plugin.version>
        <maven-deploy-plugin.version>2.8.2</maven-deploy-plugin.version>
        <maven-install-plugin.version>2.5.2</maven-install-plugin.version>
        <maven-jar-plugin.version>3.2.2</maven-jar-plugin.version>
        <maven-resources-plugin.version>3.2.0</maven-resources-plugin.version>
        <mssql-jdbc.version>10.2.1.jre8</mssql-jdbc.version>
        <mysql.version>8.0.30</mysql.version>
        <postgresql.version>42.3.6</postgresql.version>
        <selenium.version>4.1.4</selenium.version>
        <servlet-api.version>4.0.1</servlet-api.version>
        <slf4j.version>1.7.36</slf4j.version>
        <solr.version>8.11.2</solr.version>
        <spring-graphql.version>1.0.1</spring-graphql.version>
        <thymeleaf.version>3.0.15.RELEASE</thymeleaf.version>
        <tomcat.version>9.0.65</tomcat.version>
    </properties>
    <dependencyManagement>
        <dependencies>
            <dependency>
                <groupId>net.bytebuddy</groupId>
                <artifactId>byte-buddy</artifactId>
                <version>${byte-buddy.version}</version>
            </dependency>
            <dependency>
                <groupId>net.bytebuddy</groupId>
                <artifactId>byte-buddy-agent</artifactId>
                <version>${byte-buddy.version}</version>
            </dependency>
            <dependency>
                <groupId>org.projectlombok</groupId>
                <artifactId>lombok</artifactId>
                <version>${lombok.version}</version>
            </dependency>
            <dependency>
                <groupId>mysql</groupId>
                <artifactId>mysql-connector-java</artifactId>
                <version>${mysql.version}</version>
                <exclusions>
                    <exclusion>
                        <groupId>com.google.protobuf</groupId>
                        <artifactId>protobuf-java</artifactId>
                    </exclusion>
                </exclusions>
            </dependency>
            <dependency>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot</artifactId>
                <version>2.7.3</version>
            </dependency>
            <dependency>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-test</artifactId>
                <version>2.7.3</version>
            </dependency>
            <dependency>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-test-autoconfigure</artifactId>
                <version>2.7.3</version>
            </dependency>
            <dependency>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-autoconfigure</artifactId>
                <version>2.7.3</version>
            </dependency>
            <dependency>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-devtools</artifactId>
                <version>2.7.3</version>
            </dependency>
            <dependency>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-starter</artifactId>
                <version>2.7.3</version>
            </dependency>
            <dependency>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-starter-aop</artifactId>
                <version>2.7.3</version>
            </dependency>
            <dependency>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-starter-jdbc</artifactId>
                <version>2.7.3</version>
            </dependency>
            <dependency>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-starter-logging</artifactId>
                <version>2.7.3</version>
            </dependency>
            <dependency>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-starter-test</artifactId>
                <version>2.7.3</version>
            </dependency>
            <dependency>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-starter-thymeleaf</artifactId>
                <version>2.7.3</version>
            </dependency>
            <dependency>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-starter-tomcat</artifactId>
                <version>2.7.3</version>
            </dependency>
            <dependency>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-starter-web</artifactId>
                <version>2.7.3</version>
            </dependency>
            <dependency>
                <groupId>org.apache.tomcat.embed</groupId>
                <artifactId>tomcat-embed-core</artifactId>
                <version>${tomcat.version}</version>
            </dependency>
            <dependency>
                <groupId>org.apache.tomcat.embed</groupId>
                <artifactId>tomcat-embed-el</artifactId>
                <version>${tomcat.version}</version>
            </dependency>
        </dependencies>
    </dependencyManagement>
    <build>
        <pluginManagement>
            <plugins>
                <plugin>
                    <groupId>org.apache.maven.plugins</groupId>
                    <artifactId>maven-clean-plugin</artifactId>
                    <version>${maven-clean-plugin.version}</version>
                </plugin>
                <plugin>
                    <groupId>org.apache.maven.plugins</groupId>
                    <artifactId>maven-compiler-plugin</artifactId>
                    <version>${maven-compiler-plugin.version}</version>
                </plugin>
            </plugins>
        </pluginManagement>
    </build>
</project>
```

## starter

在`spring-boot-starter-*`的`pom.xml`文件中，定义它所有的Jar依赖，方便我们使用。

正是通过引入`spring-boot-starter-*`，来达到**减少依赖配置**的目的。

```text
                                                                              ┌─── spring-core
                                            ┌─── spring-boot ─────────────────┤
           ┌─── spring-boot-starter ────────┤                                 └─── spring-context
           │                                │
           │                                └─── spring-boot-autoconfigure
           │
           │                                ┌─── spring-boot-starter
           │                                │
           │                                ├─── spring-boot-starter-json
           │                                │
           │                                ├─── spring-boot-starter-tomcat
           │                                │
           ├─── spring-boot-starter-web ────┤                                  ┌─── spring-core
           │                                ├─── spring-web ───────────────────┤
pom.xml ───┤                                │                                  └─── spring-beans
           │                                │
           │                                │                                  ┌─── spring-context
           │                                │                                  │
           │                                └─── spring-webmvc ────────────────┼─── spring-expression
           │                                                                   │
           │                                                                   └─── spring-web
           │
           │                                ┌─── spring-boot-test ─────────────────┼─── spring-boot
           │                                │
           │                                ├─── spring-boot-test-autoconfigure
           │                                │
           └─── spring-boot-starter-test ───┼─── spring-test
                                            │
                                            ├─── junit-jupiter
                                            │
                                            └─── mockito-core
```

## 引导类

SpringBoot的引导类是Boot工程的执行入口，运行main方法就可以启动项目。

SpringBoot工程运行后，初始化Spring容器，扫描引导类所在包，并加载Bean。

```java
import lsieun.boot.controller.FileController;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ConfigurableApplicationContext;

@SpringBootApplication
public class MySpringBootApplication {

    public static void main(String[] args) {
        // 这个ctx就是Spring的容器对象
        ConfigurableApplicationContext ctx = SpringApplication.run(MySpringBootApplication.class, args);
        FileController bean = ctx.getBean(FileController.class);
        System.out.println("bean ==> " + bean);
    }

}
```

注意点：

- 第一点，`SpringApplication.run()`方法，返回的其实就是一个Spring的容器。
- 第二点，`@SpringBootApplication`是发挥作用的关键因素。

```java
@SpringBootConfiguration
@EnableAutoConfiguration
@ComponentScan(excludeFilters = { @Filter(type = FilterType.CUSTOM, classes = TypeExcludeFilter.class),
		@Filter(type = FilterType.CUSTOM, classes = AutoConfigurationExcludeFilter.class) })
public @interface SpringBootApplication {
    //
}
```

第一个注意点，`@SpringBootConfiguration`带有`@Configuration`注解，也意味着`@SpringBootApplication`是一个配置类。

```java
@Configuration
@Indexed
public @interface SpringBootConfiguration {
    //
}
```

第二个注意点，`@ComponentScan`注解，在默认情况下，扫描当前包及其子包下的类。

第三个注意点，`@EnableAutoConfiguration`注解

```java
@AutoConfigurationPackage
@Import(AutoConfigurationImportSelector.class)
public @interface EnableAutoConfiguration {
    //
}
```

## 内嵌tomcat

在`spring-boot-starter-web`中，会引用`spring-boot-starter-tomcat`依赖

```text
                              ┌─── tomcat-embed-core ────────┼─── tomcat-annotations-api
                              │
spring-boot-starter-tomcat ───┼─── tomcat-embed-el
                              │
                              └─── tomcat-embed-websocket ───┼─── tomcat-embed-core
```

排除内嵌tomcat

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
    <exclusions>
        <exclusion>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-tomcat</artifactId>
        </exclusion>
    </exclusions>
</dependency>
```

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-jetty</artifactId>
</dependency>
```

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-undertow</artifactId>
</dependency>
```
