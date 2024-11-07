---
title: "Checkstyle QuickStart"
sequence: "101"
---

## 安装插件

![](/assets/images/intellij/plugin/checkstyle-idea-plugin.png)

## 选择配置文件

![](/assets/images/intellij/plugin/checkstyle-idea-setting-configuration-file.png)

- File: `checkstyle.xml`

```xml
<!DOCTYPE module PUBLIC
        "-//Checkstyle//DTD Checkstyle Configuration 1.3//EN"
        "https://checkstyle.org/dtds/configuration_1_3.dtd">
<module name="Checker">
    <module name="TreeWalker">
        <module name="AvoidStarImport">
            <property name="severity" value="warning"/>
        </module>
    </module>
</module>
```

## 进行检查

![](/assets/images/intellij/plugin/checkstyle-idea-tool.png)

### 整个项目检查

![](/assets/images/intellij/plugin/checkstyle-idea-tool-check-project.png)

### 单个文件检查

![](/assets/images/intellij/plugin/checkstyle-idea-tool-check-current-file.png)

### 重新读取规则

![](/assets/images/intellij/plugin/checkstyle-idea-tool-reload-rules-files.png)

## Apache Maven Checkstyle Plugin

```xml
<dependency>
    <groupId>org.apache.maven.plugins</groupId>
    <artifactId>maven-checkstyle-plugin</artifactId>
    <version>3.3.0</version>
</dependency>
```

```xml
<build>
    <plugins>
        <plugin>
            <groupId>org.apache.maven.plugins</groupId>
            <artifactId>maven-checkstyle-plugin</artifactId>
            <version>3.3.0</version>
            <dependencies>
                <dependency>
                    <groupId>com.puppycrawl.tools</groupId>
                    <artifactId>checkstyle</artifactId>
                    <version>10.12.0</version>
                </dependency>
            </dependencies>

            <configuration>
                <configLocation>checkstyle/checkstyle.xml</configLocation>
                <suppressionsLocation>checkstyle/suppression.xml</suppressionsLocation>
                <includeTestSourceDirectory>true</includeTestSourceDirectory>
                <logViolationsToConsole>true</logViolationsToConsole>
                <failOnViolation>true</failOnViolation>
            </configuration>

            <executions>
                <execution>
                    <id>validate</id>
                    <phase>validate</phase>
                    <goals>
                        <goal>check</goal>
                    </goals>
                </execution>
            </executions>

        </plugin>
    </plugins>
</build>
```

```text
mvn validate
```

```text
mvn checkstyle:check
```