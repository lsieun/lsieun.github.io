---
title: "Maven Plugin Plugin"
sequence: "110"
---

[UP](/maven-index.html)


## 问题与解决

```xml
<dependency>
    <groupId>org.apache.commons</groupId>
    <artifactId>commons-lang3</artifactId>
    <version>3.12.0</version>
</dependency>
```

遇到问题：

```text
[ERROR] Failed to execute goal org.apache.maven.plugins:maven-plugin-plugin:3.2:descriptor (default-descriptor) on project hello-maven-plugin:
 Execution default-descriptor of goal org.apache.maven.plugins:maven-plugin-plugin:3.2:descriptor failed: 52264
 ...
Caused by: java.lang.ArrayIndexOutOfBoundsException: 52264
    at org.objectweb.asm.ClassReader.readClass (Unknown Source)    // 深层次的原因：可能是 ASM 当中的 ClassReader 导致的
```

可能是 Java 8 Lambdas 导致的失败：

- [Cant write lambdas in maven plugin development](https://issues.apache.org/jira/browse/MPLUGIN-276)

更进一步来说，可能是 ASM 当中的 ClassReader 导致的。

### 解决办法

在 `pom.xml` 文件中，使用新版本的 `maven-plugin-plugin` 插件：

```xml
<build>
    <plugins>
        <plugin>
            <groupId>org.apache.maven.plugins</groupId>
            <artifactId>maven-plugin-plugin</artifactId>
            <version>3.6.4</version>
        </plugin>
    </plugins>
</build>
```

```xml
<build>
    <pluginManagement>
        <plugins>
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-plugin-plugin</artifactId>
                <version>3.6.4</version>
            </plugin>
        </plugins>
    </pluginManagement>
</build>
```

## skipErrorNoDescriptorsFound

- [plugin:descriptor](https://maven.apache.org/plugin-tools/maven-plugin-plugin/descriptor-mojo.html)

`<skipErrorNoDescriptorsFound>`:
By default an exception is throw if no mojo descriptor is found.
As the `maven-plugin` is defined in core, the `descriptor` generator mojo
is bound to `process-classes`(`generate-resources` 旧版本) phase.
But for annotations, the compiled classes are needed, so skip error.

- Default value is: `false`.
- User property is: `maven.plugin.skipErrorNoDescriptorsFound`.
