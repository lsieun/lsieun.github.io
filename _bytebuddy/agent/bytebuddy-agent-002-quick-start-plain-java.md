---
title: "ByteBuddy Agent: Quick Start"
sequence: "102"
---

## Client

### HelloWorld

```java
public class HelloWorld {
    public void test() {
        System.out.println("Mirror mirror on the wall.");
        System.out.println("Who is the most beautiful woman in the world?");
    }
}
```

### Program

```java
public class Program {
    public static void main(String[] args) {
        HelloWorld instance = new HelloWorld();
        instance.test();
    }
}
```

```text
Mirror mirror on the wall.
Who is the most beautiful woman in the world?
```

## Agent

### pom.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>lsieun</groupId>
    <artifactId>learn-byte-buddy-agent</artifactId>
    <version>1.0-SNAPSHOT</version>

    <properties>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
        <java.version>1.8</java.version>
        <maven.compiler.source>${java.version}</maven.compiler.source>
        <maven.compiler.target>${java.version}</maven.compiler.target>
        <byte.buddy.version>1.14.18</byte.buddy.version>
    </properties>

    <dependencies>
        <dependency>
            <groupId>net.bytebuddy</groupId>
            <artifactId>byte-buddy</artifactId>
            <version>${byte.buddy.version}</version>
        </dependency>
        <dependency>
            <groupId>net.bytebuddy</groupId>
            <artifactId>byte-buddy-agent</artifactId>
            <version>${byte.buddy.version}</version>
        </dependency>
    </dependencies>

    <build>
        <plugins>
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-assembly-plugin</artifactId>
                <version>3.3.0</version>
                <configuration>
                    <archive>
                        <manifest>
                            <mainClass>lsieun.buddy.Main</mainClass>
                            <addDefaultEntries>false</addDefaultEntries>
                        </manifest>
                        <manifestEntries>
                            <Premain-Class>lsieun.buddy.agent.LoadTimeAgent</Premain-Class>
                            <Agent-Class>lsieun.buddy.agent.DynamicAgent</Agent-Class>
                            <Launcher-Agent-Class>lsieun.buddy.agent.LauncherAgent</Launcher-Agent-Class>
                            <Can-Redefine-Classes>true</Can-Redefine-Classes>
                            <Can-Retransform-Classes>true</Can-Retransform-Classes>
                            <Can-Set-Native-Method-Prefix>true</Can-Set-Native-Method-Prefix>
                        </manifestEntries>
                    </archive>
                    <descriptorRefs>
                        <descriptorRef>jar-with-dependencies</descriptorRef>
                    </descriptorRefs>
                </configuration>
                <executions>
                    <execution>
                        <id>make-assembly</id>
                        <phase>package</phase>
                        <goals>
                            <goal>single</goal>
                        </goals>
                    </execution>
                </executions>
            </plugin>
        </plugins>
    </build>
</project>
```

### LoadTimeAgent

```java
import net.bytebuddy.agent.builder.AgentBuilder;

import java.lang.instrument.Instrumentation;

import static net.bytebuddy.matcher.ElementMatchers.nameContains;
import static net.bytebuddy.matcher.ElementMatchers.named;

public class LoadTimeAgent {
    public static void premain(String agentArgs, Instrumentation inst) throws Exception {
        new AgentBuilder.Default()
                .ignore(nameContains("bytebuddy"))
                .type(named("sample.HelloWorld"))
                .transform(new MyTransformer())
                .installOn(inst);
    }

}
```

```java
import net.bytebuddy.agent.builder.AgentBuilder;
import net.bytebuddy.description.type.TypeDescription;
import net.bytebuddy.dynamic.DynamicType;
import net.bytebuddy.implementation.MethodDelegation;
import net.bytebuddy.matcher.ElementMatchers;
import net.bytebuddy.utility.JavaModule;

import java.security.ProtectionDomain;

public class MyTransformer implements AgentBuilder.Transformer {
    @Override
    public DynamicType.Builder<?> transform(DynamicType.Builder<?> builder,
                                            TypeDescription typeDescription,
                                            ClassLoader classLoader,
                                            JavaModule module,
                                            ProtectionDomain protectionDomain) {
        String actualName = typeDescription.getActualName();
        System.out.println("processing Class " + actualName);

        builder = builder.method(
                        ElementMatchers.named("test")
                )
                .intercept(
                        MethodDelegation.to(LazyWorker.class)
                );

        return builder;
    }
}
```

```java
import net.bytebuddy.implementation.bind.annotation.AllArguments;
import net.bytebuddy.implementation.bind.annotation.Origin;
import net.bytebuddy.implementation.bind.annotation.SuperCall;
import net.bytebuddy.implementation.bind.annotation.This;

import java.lang.reflect.Method;

public class LazyWorker {
    public static void doWork(
            @This Object thisObj,
            @Origin Method method,
            @AllArguments Object[] allArgs,
            @SuperCall Runnable executable
    ) {
        System.out.println("=== before ===");
        executable.run();
        System.out.println("===  after ===");
    }
}
```

## 运行

### 打包

```text
mvn clean package
```

### 运行

来到 `target` 目录：

```text
> java sample.Program
Mirror mirror on the wall.
Who is the most beautiful woman in the world?

> java -javaagent:../learn-byte-buddy-agent-1.0-SNAPSHOT-jar-with-dependencies.jar sample.Program
processing Class sample.HelloWorld
=== before ===
Mirror mirror on the wall.
Who is the most beautiful woman in the world?
===  after ===
```
