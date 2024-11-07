---
title: "IntelliJ IDEA 插件"
sequence: "103"
---

[UP](/lombok.html)

## Lombok 插件

在 IntelliJ IDEA `2020.3` 版本之后，就内置了 Lombok 插件：

![](/assets/images/java/lombok/intellij-idea-plugin-lombok.png)

## 开启 Annotation Processing

Lombok uses annotation processing through [APT][link-apt].
So, when the compiler calls it, the library generates new source files based on annotations in the originals.

**Annotation processing isn't enabled by default, though.**

开启 Annotation Processing：

```text
Preferences | Build, Execution, Deployment | Compiler | Annotation Processors
```

选择下面两个选项：

- **Enable annotation processing**
- **Obtain processors from project classpath**

![](/assets/images/java/lombok/intellij-idea-enable-annotation-processing.png)

## 将 Lombok 添加到类路径

The last remaining part is to ensure that Lombok binaries are on the compiler classpath.
Using Maven, we can add the dependency to the `pom.xml`:

```xml
<dependencies>
    <dependency>
        <groupId>org.projectlombok</groupId>
        <artifactId>lombok</artifactId>
        <version>1.18.30</version>
        <scope>provided</scope>
    </dependency>
</dependencies>
```

[link-apt]: https://docs.oracle.com/javase/7/docs/technotes/guides/apt/GettingStarted.html
