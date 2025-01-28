---
title: "打包与运行"
sequence: "101"
---

- 程序打包
- 程序运行（Windows版）
- 程序运行（Linux版）
- 程序运行（Docker版）
  - Dockerfile

## 准备工作

生成的Jar包支持命令行启动需要依赖SpringBoot对应的Maven插件：

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


## 程序打包

```text
mvn package -Dmaven.test.skip=true
```

运行项目：

```text
java -jar springboot.jar
```

## 程序运行（Windows版）

### Windows端口被占用

查询端口：

```text
netstat -ano
```

查询指定端口：

```text
netstat -ano | findstr "端口号"
```

根据进程PID查询进程名称：

```text
tasklist | findstr "进程PID号"
```

根据PID结束进程：

```text
taskkill /F /PID "进程PID号"
taskkill -f -pid "进程PID号"
```

根据进程名称结束进程：

```text
taskkill -f -t -im "进程名称"
```

## 程序运行（Linux版）

查询端口：

```text
netstat -nltp
```

查询指定端口：

```text
netstat -nltp | grep "端口号"
```

```text
nohub java -jar springboot.jar > server.log 2>&1 &
```

```text
ps -ef | grep "java -jar"
```

根据PID结束进程：

```text
kill -9 <pid>
```

## 程序运行（Docker版）

File: `Dockerfile`

```text
FROM openjdk:11.0.13-jre
ADD ./target/jm_pipeline_system.jar /opt/aq_smaple/jar/jm_pipeline_system.jar
ENTRYPOINT ["java", "-jar","/opt/aq_smaple/jar/jm_pipeline_system.jar"]
EXPOSE 8080
```

## 程序运行（JavaFX版）


