---
title: "Java JVM 类加载"
sequence: "jvm-classloader"
---

## 加载器的类型

- 引导类加载器(Bootstrap ClassLoader)：用 C++ 编写，是 JVM 自带的类加载器，负责 java 平台核心库，用来装载核心类库，该加载器无法直接获取。
- 拓展类加载器(Extension ClassLoader)：负责 jre/lib/ext 目录下的 jar 包或 -D java.ext.dirs 指定下的 jar 包装入工作库。
- 系统类加载器(Application ClassLoader)：负责 java-classpath 或者 -D java.class.path 所指的目录下的类与 jar 包装入工作，是最常用的加载器。
- 自定义类加载器(Custom ClassLoader)：由开发人员自己定义。

