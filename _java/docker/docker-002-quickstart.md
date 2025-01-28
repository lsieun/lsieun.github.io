---
title: "Quick Start"
sequence: "102"
---

```xml
<properties>
    <!-- resource -->
    <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
    <project.reporting.outputEncoding>UTF-8</project.reporting.outputEncoding>

    <!-- JDK -->
    <java.version>17</java.version>
    <maven.compiler.source>${java.version}</maven.compiler.source>
    <maven.compiler.target>${java.version}</maven.compiler.target>

    <!-- docker -->
    <docker.java.version>3.3.1</docker.java.version>

    <!-- sl4j -->
    <sl4j.version>1.7.36</sl4j.version>
</properties>
```

```xml
<dependencies>
    <dependency>
        <groupId>com.github.docker-java</groupId>
        <artifactId>docker-java</artifactId>
        <version>${docker.java.version}</version>
    </dependency>

    <dependency>
        <groupId>org.slf4j</groupId>
        <artifactId>slf4j-api</artifactId>
        <version>${sl4j.version}</version>
    </dependency>

    <dependency>
        <groupId>org.slf4j</groupId>
        <artifactId>slf4j-simple</artifactId>
        <version>${sl4j.version}</version>
    </dependency>
</dependencies>
```

```java
import com.github.dockerjava.api.DockerClient;
import com.github.dockerjava.core.DefaultDockerClientConfig;
import com.github.dockerjava.core.DockerClientBuilder;

import java.io.IOException;

public class DockerBasic {
    public static void main(String[] args) throws IOException {
        DefaultDockerClientConfig config = DefaultDockerClientConfig
                .createDefaultConfigBuilder()
                .withDockerHost("tcp://localhost:2375")
                .build();
        try (
                DockerClient dockerClient = DockerClientBuilder.getInstance(config).build();
        ) {
            System.out.println(dockerClient);
        }
    }
}
```
