---
title: "Maven Install"
sequence: "102"
---

[UP](/maven/index.html)

## Windows

第 1 步，安装 JDK。之后，两者方式，选择一个即可

- 设置 `JAVA_HOME` 环境变量
- 将 `java.exe` 放到 `PATH` 环境变量中

第 2 步，解压 `apache-maven-3.9.14-bin.zip`

第 3 步，将 `bin` 目录添加到 `PATH` 环境变量

第 4 步，运行 `mvn -v` 命令

```text
> mvn -v
Apache Maven 3.9.14 (996c630dbc656c76214ce58821dcc58be960875b)
Maven home: D:\Software\apache-maven-3.9.14
Java version: 25.0.2, vendor: Oracle Corporation, runtime: C:\Program Files\Java\jdk-25.0.2
Default locale: zh_CN, platform encoding: UTF-8
OS name: "windows 10", version: "10.0", arch: "amd64", family: "windows"
```

## Linux


## Reference

- [Maven Installation](https://maven.apache.org/install.html)
