---
title: "Maven 构建"
sequence: "101"
---

## 引入依赖

在 `pom.xml` 文件中，添加如下内容：

```xml
<properties>
    <byte.buddy.version>1.15.7</byte.buddy.version>
</properties>
```

```xml
<dependencies>
    <dependency>
        <groupId>net.bytebuddy</groupId>
        <artifactId>byte-buddy</artifactId>
        <version>${byte.buddy.version}</version>
    </dependency>
</dependencies>
```

## 编写代码

### MyByteBuddyConfig

```java
package lsieun.buddy.plugin;

import net.bytebuddy.ByteBuddy;
import net.bytebuddy.ClassFileVersion;
import net.bytebuddy.build.EntryPoint;
import net.bytebuddy.description.type.TypeDescription;
import net.bytebuddy.dynamic.ClassFileLocator;
import net.bytebuddy.dynamic.DynamicType;
import net.bytebuddy.dynamic.scaffold.inline.MethodNameTransformer;

public class MyByteBuddyEntryPoint implements EntryPoint {
    @Override
    public ByteBuddy byteBuddy(ClassFileVersion classFileVersion) {
        return new ByteBuddy().with(ClassFileVersion.JAVA_V11);
    }

    @Override
    public DynamicType.Builder<?> transform(
            TypeDescription typeDescription,
            ByteBuddy byteBuddy,
            ClassFileLocator classFileLocator,
            MethodNameTransformer methodNameTransformer) {
        return byteBuddy.rebase(typeDescription, classFileLocator, methodNameTransformer);
    }
}
```

### MyByteBuddyPlugin

```java
package lsieun.buddy.plugin;

import lsieun.buddy.advice.Expert;
import net.bytebuddy.asm.Advice;
import net.bytebuddy.build.Plugin;
import net.bytebuddy.description.type.TypeDescription;
import net.bytebuddy.dynamic.ClassFileLocator;
import net.bytebuddy.dynamic.DynamicType;
import net.bytebuddy.matcher.ElementMatchers;

import java.io.IOException;

public class MyByteBuddyPlugin implements Plugin {
    @Override
    public boolean matches(TypeDescription target) {
        boolean matches = ElementMatchers.nameStartsWith("sample.")
                .matches(target);
        String msg = String.format("[MATCHES] %s: [%s]", target.getName(), matches ? "OK" : "NO");
        System.out.println(msg);
        return matches;
    }

    @Override
    public DynamicType.Builder<?> apply(DynamicType.Builder<?> builder,
                                        TypeDescription typeDescription,
                                        ClassFileLocator classFileLocator) {
        return builder.visit(
                Advice.to(Expert.class).on(ElementMatchers.named("test"))
        );
    }

    @Override
    public void close() throws IOException {
        String msg = String.format("[CLOSE] %s", MyByteBuddyPlugin.class.getName());
        System.out.println(msg);
    }
}
```

### Expert

```java
package lsieun.buddy.advice;

import net.bytebuddy.asm.Advice;

public class Expert {
    @Advice.OnMethodEnter
    static void methodAbc() {
        System.out.println("Hello Method Enter");
    }
}
```

### HelloWorld

```java
package sample;

public class HelloWorld {
    public void test() {
        System.out.println("Hello Test Method");
    }
}
```

## 配置插件

在 `pom.xml` 文件中，`<project>` 标签下添加如下内容：

```xml
<build>
    <plugins>
        <plugin>
            <groupId>net.bytebuddy</groupId>
            <artifactId>byte-buddy-maven-plugin</artifactId>
            <version>${byte.buddy.version}</version>
            <executions>
                <execution>
                    <goals>
                        <goal>transform</goal>
                    </goals>
                </execution>
            </executions>
            <configuration>
                <initialization>
                    <entryPoint>lsieun.buddy.plugin.MyByteBuddyEntryPoint</entryPoint>
                </initialization>
                <transformations>
                    <transformation>
                        <plugin>
                            lsieun.buddy.plugin.MyByteBuddyPlugin
                        </plugin>
                    </transformation>
                </transformations>
            </configuration>
        </plugin>
    </plugins>
</build>
```

## 运行

```text
$ mvn clean compile process-classes
$ mvn clean package
```

```text
$ mvn clean package

[MATCHES] sample.HelloWorld: [OK]
[MATCHES] lsieun.buddy.plugin.MyByteBuddyPlugin: [NO]
[MATCHES] lsieun.buddy.plugin.MyByteBuddyEntryPoint: [NO]
[MATCHES] lsieun.buddy.advice.Expert: [NO]
[CLOSE] lsieun.buddy.plugin.MyByteBuddyPlugin
```

## Maven Build Process

The maven build process consists of these processes:

- step.1 Maven cleans the project `target` folder.
- step.2 Maven compiles all the java source codes available in the project,
  and stores the Java class file in project `target` folder.
- step.3 Maven executes the ByteBuddy instrumentation process by invoking the `MyByteBuddyPlugin.java`.
- step.4 The plugin program scans all the Java class file one by one in the project `target` folder.
- step.5 For each Java class file, the plugin program invokes `matches` method to find the functional code for interception.
- step.6 If found, then the `matches` method return `true`, and the plugin program continue to the `apply` method.
  If not found, then plugin program repeats the process starts from step5.
- step.7 In `apply` method, `MyByteBuddyPlugin.java` applys the advice code to the functional code.
- step.8 `MyByteBuddyPlugin.java` creates the instrumented code in bytecode (Java classfile) format and stores the code in the project `target` folder.
- step.9 Maven repeats step4 to step8 until `MyByteBuddyPlugin.java` checks all the classfiles in the project.
- step.10 Maven creates a jar file that package all the Java classfile, including the instrumented code.
