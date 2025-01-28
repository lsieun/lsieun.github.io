---
title: "Mojo: JavaDoc Annotation"
sequence: "110"
---

[UP](/maven-index.html)


## pom.xml

### packaging

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>lsieun</groupId>
    <artifactId>hello-maven-plugin</artifactId>
    <packaging>maven-plugin</packaging>
    <version>1.0-SNAPSHOT</version>
</project>
```

### properties

```xml
<properties>
    <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
    <maven.compiler.source>8</maven.compiler.source>
    <maven.compiler.target>8</maven.compiler.target>
</properties>
```

### dependencies

```xml
<dependencies>
    <dependency>
        <groupId>org.apache.maven</groupId>
        <artifactId>maven-plugin-api</artifactId>
        <version>3.8.5</version>
        <scope>provided</scope>
    </dependency>
</dependencies>
```

### 完整的 pom.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>lsieun</groupId>
    <artifactId>hello-maven-plugin</artifactId>
    <packaging>maven-plugin</packaging>
    <version>1.0-SNAPSHOT</version>

    <properties>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
        <maven.compiler.source>8</maven.compiler.source>
        <maven.compiler.target>8</maven.compiler.target>
    </properties>

    <dependencies>
        <dependency>
            <groupId>org.apache.maven</groupId>
            <artifactId>maven-plugin-api</artifactId>
            <version>3.8.5</version>
            <scope>provided</scope>
        </dependency>
    </dependencies>
</project>
```

## Code

```java
package lsieun.mojo;

import org.apache.maven.plugin.AbstractMojo;
import org.apache.maven.plugin.MojoExecutionException;
import org.apache.maven.plugin.MojoFailureException;

/**
 * Say Hi to Plugin User
 *
 * @goal sayhi
 * @requiresProject false
 */
public class GreetingMojo extends AbstractMojo {
    /**
     * this is a message
     * @parameter property="my.message" default-value="精诚所至，金石为开"
     */
    private String message;

    @Override
    public void execute() throws MojoExecutionException, MojoFailureException {
        getLog().info(message);
    }
}
```

## 测试

在 `hello-world` 项目的 `pom.xml` 文件中引入：

### 默认值

```xml
<build>
    <plugins>
        <plugin>
            <groupId>lsieun</groupId>
            <artifactId>hello-maven-plugin</artifactId>
            <version>1.0-SNAPSHOT</version>
        </plugin>
    </plugins>
</build>
```

```text
mvn lsieun:hello-maven-plugin:1.0-SNAPSHOT:sayhi
```

### 命令行

```text
mvn lsieun:hello-maven-plugin:1.0-SNAPSHOT:sayhi -Dmy.message="Hello Maven"
```

### POM

```xml
<build>
    <plugins>
        <plugin>
            <groupId>lsieun</groupId>
            <artifactId>hello-maven-plugin</artifactId>
            <version>1.0-SNAPSHOT</version>
            <configuration>
                <message>Hello World! 你好，世界</message>
            </configuration>
        </plugin>
    </plugins>
</build>
```

```text
mvn lsieun:hello-maven-plugin:1.0-SNAPSHOT:sayhi
```
