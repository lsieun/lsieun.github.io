---
title: "Java Agent + Java Module System"
sequence: "107"
---

## 从 Java 8 到 Java 9

在 Java 8 和 Java 9 版本之间有一个比较大的跨越：模块化系统（Module System）。

如果使用 Java 8 以后的版本，那么推荐使用 Java 11 或 Java 17，因为它们是 LTS（long-term support，长期提供技术支持的）版本。

在 Java 9 之后的版本当中，为了使用

## tools.jar

在 Java 8 版本中，`com.sun.tools.attach` 包位于 `tools.jar` 文件，来进行 Dynamic Attach。在 `pom.xml` 文件中，有相应的依赖：

```text
<dependency>
    <groupId>com.sun</groupId>
    <artifactId>tools</artifactId>
    <version>8</version>
    <scope>system</scope>
    <systemPath>${env.JAVA_HOME}/lib/tools.jar</systemPath>
</dependency>
```

相应的，Java 9 之后版本，引入了模块化系统（Module System），这样 `tools.jar` 文件也不存在了。
那么，`com.sun.tools.attach` 包位于 `jdk.attach` 模块当中，
此时需要我们在 `module-info.java` 文件添加对 `jdk.attach` 的依赖：

```java
module lsieun.java.agent {
    requires java.instrument;
    requires java.management;
    requires jdk.attach;
    requires org.objectweb.asm;
}
```


