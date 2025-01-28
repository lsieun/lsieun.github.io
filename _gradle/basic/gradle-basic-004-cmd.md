---
title: "常用 Gradle 命令"
sequence: "104"
---

需要注意的是：`gradle` 命令需要在含有 `build.gradle` 的目录执行。

- `gradle clean`：清空 build 目录
- `gradle classes`：编译业务代码和配置文件
- `gradle test`：编译测试代码，生成测试报告
- `gradle build`：构建项目
- `gradle build -x test`：跳过测试，进行构建

![](/assets/images/gradle/gradle-vs-maven-directory.png)

