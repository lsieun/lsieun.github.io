---
title: "MapStruct + Lombok"
sequence: "102"
---

To enable **Lombok** support, we need to add the dependency in the **annotation processor path**.
Since Lombok version `1.18.16`, we also have to add the dependency on lombok-mapstruct-binding.
Now we have the **mapstruct-processor** as well as **Lombok** in the Maven compiler plugin:

```xml
<plugin>
    <groupId>org.apache.maven.plugins</groupId>
    <artifactId>maven-compiler-plugin</artifactId>
    <version>3.5.1</version>
    <configuration>
        <source>1.8</source>
        <target>1.8</target>
        <annotationProcessorPaths>
            <path>
                <groupId>org.mapstruct</groupId>
                <artifactId>mapstruct-processor</artifactId>
                <version>1.5.3.Final</version>
            </path>
            <path>
                <groupId>org.projectlombok</groupId>
                <artifactId>lombok</artifactId>
	            <version>1.18.4</version>
            </path>
            <path>
                <groupId>org.projectlombok</groupId>
                <artifactId>lombok-mapstruct-binding</artifactId>
	            <version>0.2.0</version>
            </path>
        </annotationProcessorPaths>
    </configuration>
</plugin>
```

![](/assets/images/java/mapstruct/intellij-idea-settings-annotation-processors-processor-path.png)

在 Processor Path 中，包含了 4 个 Jar 文件：

- mapstruct-processor-1.5.5.Final.jar;
- mapstruct-1.5.5.Final.jar;
- lombok-1.18.28.jar;
- lombok-mapstruct-binding-0.2.0.jar

## Reference

- [Baeldung: Support for Lombok](https://www.baeldung.com/mapstruct#Conclusion)
