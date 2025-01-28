---
title: "spring-boot-maven-plugin"
sequence: "102"
---

- Jar （生成的Jar包）
    - 外部
    - 内部
        - BOOT-INF
            - classes
            - lib
        - META-INF
            - MANIFEST.MF
        - org.springframework.boot.loader
            - JarLauncher
- spring-boot-maven-plugin （插件本身）
    - goal
        - repackage
        - run
    - configuration

```text
maven-jar-plugin (package) ---> jar ---> spring-boot-maven-plugin (repackage) ---> jar 
```

## Jar包外表

### 差异

如果不使用`spring-boot-maven-plugin`插件，打包SpringBoot的Web项目生成的jar包是无法直接运行的。
因为直接打包的jar包仅仅是一个普通的jar包，没有打包依赖也没有指定`main-class`，所以无法直接运行。

所以需要在`pom.xml`中引入`spring-boot-maven-plugin`插件。
该插件的作用是对普通的jar包做repackage，从而生成一个可执行的jar文件。



- 如果**使用**`spring-boot-maven-plugin`插件，生成的Jar包中**包含**依赖的Jar包。

![](/assets/images/spring-boot/package-with-spring-boot-maven-plugin.png)

- 如果**不使用**`spring-boot-maven-plugin`插件，生成的Jar包中**不包含**依赖的Jar包。

![](/assets/images/spring-boot/package-without-spring-boot-maven-plugin.png)

## Jar包内部

### BOOT-INF

- BOOT-INF
    - classes：项目代码
    - lib：依赖的Jar包

![](/assets/images/spring-boot/spring-boot-package-boot-inf-source-lib.png)

### JarLauncher

![](/assets/images/spring-boot/package-spring-boot-loader-jar-launcher.png)

## 插件本身

`META-INF/maven/plugin.xml`

### goal

该插件的主要goal有：`repackage`和`run`。
`repackage`目标用于打包生成可执行的jar文件，`run`用于启动SpringBoot应用程序。

```text
mvn clean package spring-boot:repackage
```

这里先执行了`clean`生命周期，再执行`default`生命周期的`package`阶段，最后是`spring-boot`插件的`repackage`目标。
需要注意的是，在执行`repackage`目标时，必须先执行`default`生命周期的至少是`package`的阶段，生成一个默认的jar文件，
然后`spring-boot`插件的`repackage`目标才能执行成功，如果直接执行`repackage`，会报错：

```text
Execution default-cli of goal org.springframework.boot:spring-boot-maven-plugin:2.0.1.RELEASE:repackage failed:
 Source file must be provided -> [Help 1]
```



```text
mvn spring-boot:run
```

### SpringBoot配置

在当前项目的`pom.xml`中，配置如下内容：

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

在`spring-boot-starter-parent`的`pom.xml`文件中，有如下配置：

```xml
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
```

![](/assets/images/spring-boot/spring-boot-maven-plugin-xml-01.png)

![](/assets/images/spring-boot/spring-boot-maven-plugin-xml-02.png)

![](/assets/images/spring-boot/spring-boot-maven-plugin-repackage-mojo.png)

## 为什么 Spring Boot 的 Jar 可以直接运行

- Spring Boot 提供了一个插件 `spring-boot-maven-plugin` 用于把程序打包成一个可执行的 Jar 包
- Spring Boot 应用打包之后，生成一个 Fat Jar（Jar包里包含多个 `.jar` 文件），包含了应用依赖的 Jar 包和 Spring Boot Loader 相关的类。
- `java -jar` 会去找 jar 中的 manifest 文件，在那里面找到真正的启动类。
- Fat Jar 的启动 `main` 函数是 `JarLauncher`。它负责创建一个 `LaunchedURLClassLoader` 来加载 `boot-lib` 下面的 jar，
  并以一个新线程启动应用的 `main` 函数（找到 manifest 中的 `Start-Class`）。

```text
Manifest-Version: 1.0
Implementation-Title: spring-boot-mytest
Implementation-Version: 0.0.1-SNAPSHOT
Start-Class: lsieun.mytest.DemoApplication    # 这里是 Start-Class
Spring-Boot-Classes: BOOT-INF/classes/
Spring-Boot-Lib: BOOT-INF/lib/
Build-Jdk-Spec: 1.8
Spring-Boot-Version: 2.2.9.RELEASE
Created-By: Maven Archiver 3.4.0
Main-Class: org.springframework.boot.loader.JarLauncher
```
