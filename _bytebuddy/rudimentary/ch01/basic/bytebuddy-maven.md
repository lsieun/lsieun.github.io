---
title: "搭建 ByteBuddy 开发环境（Maven）"
sequence: "102"
---

## 开发环境

开发环境：

- Java: 17
- ByteBuddy: 1.12.10
- IDE: IntelliJ IDEA Community Edition 2022.1

使用 Java 17 的原因：

- 使用 Java 8 版本进行开发，一般情况下，是不会遇到问题的。
- 在 Java 9 之后，引入了模块化系统（Modular System）；如果有些同学使用 Java 9 之后的版本，但对于模块化系统不太了解，可能会遇到一些问题。

因此，使用 Java 17 的目的：演示 Java 9 之后的版本下如何进行开发。

## 搭建 Maven 开发环境

项目的目录结构如下：

```text
learn-bytebuddy-maven
├─── pom.xml
└─── src
     └─── main
          └─── java
               ├─── com
               │    └─── example
               │         └─── HelloByteBuddy.java
               └─── module-info.java
```

### 添加新项目

添加一个 `learn-bytebuddy-maven` 项目：

![](/assets/images/bytebuddy/idea-maven-java17-bytebuddy.png)

### pom.xml: 添加依赖

```text
<properties>
    <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
    <java.version>17</java.version>
    <maven.compiler.source>${java.version}</maven.compiler.source>
    <maven.compiler.target>${java.version}</maven.compiler.target>
    <byte.buddy.version>1.12.10</byte.buddy.version>
</properties>

<dependencies>
    <dependency>
        <groupId>net.bytebuddy</groupId>
        <artifactId>byte-buddy</artifactId>
        <version>${byte.buddy.version}</version>
    </dependency>
</dependencies>
```

### module-info.java

在 `src/main/java` 目录下添加 `module-info.java` 文件：

```java
module learn.bytebuddy.maven {
    requires net.bytebuddy;    // 添加对于 ByteBuddy 的依赖
}
```

如果我们不知道 ByteBuddy 的 module 名字，可以查看：

![](/assets/images/bytebuddy/bytebuddy-module-name.png)

### 编写代码

预期目标：

```java
public class HelloWorld {
    private String name;
    private int age;

    public HelloWorld() {
    }

    public HelloWorld(String name, int age) {
        this.name = name;
        this.age = age;
    }

    public void test() {
        System.out.println("Hello World");
    }

    public String toString() {
        return "HelloWorld" + "{" + "name=" + this.name + ", " + "age=" + this.age + "}";
    }
}
```

```java
package sample;

public class HelloWorld {
    private String name;
    private int age;

    public HelloWorld() {
    }

    public HelloWorld(String name, int age) {
        this.name = name;
        this.age = age;
    }

    public void test() {
        System.out.println("This is a test method");
    }

    public String toString() {
        return "HelloWorld" + "{" + "name=" + this.name + ", " + "age=" + this.age + "}";
    }

    // TODO: 我能实现这个方法吗？
    public static void main(String[] args) {
        HelloWorld instance = new HelloWorld("Tom", 10);
        instance.test();
        System.out.println(instance);
    }
}
```

编码实现：

```java
package com.example;

import net.bytebuddy.ByteBuddy;
import net.bytebuddy.description.modifier.Visibility;
import net.bytebuddy.dynamic.DynamicType;
import net.bytebuddy.implementation.FieldAccessor;
import net.bytebuddy.implementation.MethodCall;
import net.bytebuddy.implementation.ToStringMethod;
import net.bytebuddy.matcher.ElementMatchers;

import java.io.File;
import java.io.PrintStream;
import java.lang.reflect.Constructor;
import java.lang.reflect.Method;

public class HelloByteBuddy {
    public static void main(String[] args) {
        // 1. prepare
        String className = "sample.HelloWorld";
        ClassLoader classLoader = ClassLoader.getSystemClassLoader();


        // 2. weave
        ByteBuddy byteBuddy = new ByteBuddy();
        DynamicType.Builder<?> builder = byteBuddy.subclass(Object.class)
                .modifiers(Visibility.PUBLIC)
                .name(className);


        builder = builder.defineField("name", String.class, Visibility.PRIVATE);
        builder = builder.defineField("age", int.class, Visibility.PRIVATE);

        builder = builder.defineConstructor(Visibility.PUBLIC)
                .withParameter(String.class, "name")
                .withParameter(int.class, "age")
                .intercept(
                        MethodCall.invoke(
                                Object.class.getDeclaredConstructor()
                        ).andThen(
                                FieldAccessor.ofField("name").setsArgumentAt(0)
                        ).andThen(
                                FieldAccessor.ofField("age").setsArgumentAt(1)
                        )
                );

        builder = builder.defineMethod("test", void.class, Visibility.PUBLIC)
                .intercept(
                        MethodCall.invoke(
                                        PrintStream.class.getDeclaredMethod("println", String.class)
                                )
                                .onField(
                                        System.class.getDeclaredField("out")
                                )
                                .with("Hello World")
                );

        builder = builder.method(ElementMatchers.named("toString"))
                .intercept(ToStringMethod.prefixedBySimpleClassName());


        // 第三步，加载
        DynamicType.Unloaded<?> unloadedType = builder.make();
        DynamicType.Loaded<?> loadType = unloadedType.load(classLoader);
        Class<?> clazz = loadType.getLoaded();


        // 第四步，创建对象并调用方法
        Constructor<?> constructor = clazz.getDeclaredConstructor(String.class, int.class);
        Object instance = constructor.newInstance("Tom", 10);
        Method testMethod = clazz.getDeclaredMethod("test");
        testMethod.invoke(instance);
        System.out.println(instance);


        // 第五步，保存生成的类
        String userDir = System.getProperty("user.dir");
        File folder = new File(userDir, "target");
        System.out.println(folder);
        unloadedType.saveIn(folder);
    }
}
```

大致流程：

```text
ByteBuddy(ByteBuddy) --> DynamicType.Builder --> DynamicType.Unloaded --> DynamicType.Loaded(ByteBuddy) --> Class(Java)
```

我觉得，下面这个例子比较简洁：

```java
import net.bytebuddy.ByteBuddy;
import net.bytebuddy.dynamic.DynamicType;

public class HelloWorldGenerate {
    public static void main(String[] args) {
        // 1. prepare
        String className = "sample.MyClass";
        ClassLoader classLoader = ClassLoader.getSystemClassLoader();


        // 2. weave
        ByteBuddy byteBuddy = new ByteBuddy();
        DynamicType.Builder<?> builder = byteBuddy.subclass(Object.class)
                .name(className);


        // 3. output
        DynamicType.Unloaded<?> unloadedType = builder.make();
        DynamicType.Loaded<?> loadedType = unloadedType.load(classLoader);
        Class<?> clazz = loadedType.getLoaded();
        System.out.println(clazz.getName());
    }
}
```

## 问题和解决

### 找不到找不到模块

当我们使用 `mvn clean compile` 命令时，会出现如下错误：

```text
找不到模块: net.bytebuddy
```

解决方法：在 `pom.xml` 文件中设置 `maven-compiler-plugin` 为 `3.9.0` 版本

```text
<build>
    <plugins>
        <plugin>
            <groupId>org.apache.maven.plugins</groupId>
            <artifactId>maven-compiler-plugin</artifactId>
            <version>3.9.0</version>
        </plugin>
    </plugins>
</build>
```

### exports 和 opens

在 ByteBuddy 当中，反射（Reflection）用的非常多。

在有些情况下，ByteBuddy 会使用反射（Reflection）访问我们自己写的代码，这个时候可能就出现了错误：

```text
java.lang.IllegalAccessError: cannot access class because module does not export xxx to net.bytebuddy
```

因为 Java 9 之后的模块化系统（Modular System）对封装（Encapsulation）有了更严格的要求。
这个时候，需要我们在 `module-info.java` 文件中添加相应的 `exports` 和 `opens` 指令：

```java
module learn.bytebuddy.maven {
    requires net.bytebuddy;

    exports com.example;
    opens com.example;
}
```

## 两个依赖对比

ByteBuddy 有两个不同的版本：`byte-buddy` 和 `byte-buddy-dep`。

- `byte-buddy`: `net.bytebuddy.jar.asm.ClassVisitor`
- `byte-buddy-dep`: `org.objectweb.asm.ClassVisitor`

如果使用 `byte-buddy` 版本，会在 `net.bytebuddy.jar.asm` 来包含相应的 ASM 代码：（**推荐使用**）

```text
<dependency>
  <groupId>net.bytebuddy</groupId>
  <artifactId>byte-buddy</artifactId>
  <version>${byte.buddy.version}</version>
</dependency>
```

如果使用 `byte-buddy-dep` 会依赖 `org.ow2.asm:asm` 和 `org.ow2.asm:asm-commons`：

```text
<dependency>
    <groupId>net.bytebuddy</groupId>
    <artifactId>byte-buddy-dep</artifactId>
    <version>${byte.buddy.version}</version>
</dependency>
```

## 总结

本文内容总结如下：

- 第一点，本文的主要目的是搭建 ByteBuddy 的开发环境。
- 第二点，在 Java 9 之后的版本可能遇到的问题。
