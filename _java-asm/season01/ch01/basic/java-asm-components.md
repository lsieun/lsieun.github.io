---
title: "ASM 的组成部分"
sequence: "102"
---

[上级目录]({% link _posts/2021-06-01-java-asm-index.md %})

本文的整体逻辑：**ASM 由两个组成部分（Core API 和 Tree API），每个组成部分由多个 `.jar` 文件组成，每个 `.jar` 文件里包含多个具体的类（`.class`）文件。**

## ASM 的两个组成部分

从组成结构上来说，ASM 分成两部分，一部分为 Core API，另一部分为 Tree API。

- 其中，Core API 包括 `asm.jar`、`asm-util.jar` 和 `asm-commons.jar`；
- 其中，Tree API 包括 `asm-tree.jar` 和 `asm-analysis.jar`。

![ASM Components](/assets/images/java/asm/asm-components.png)

从两者的关系来说，Core API 是基础，而 Tree API 是在 Core API 的这个基础上构建起来的。

从 ASM API 演进的历史来讲，先有 Core API，后有 Tree API。最初，在 2002 年，Eric Bruneton 等发表了一篇文章，即《[ASM: a code manipulation tool to implement adaptable systems](/assets/pdf/asm-eng.pdf)》。在这篇文章当中，最早提出了 ASM 的设计思路。当时，ASM 只包含 13 个类文件，Jar 包的大小只有 21KB。这 13 个类文件，就是现在所说的 Core API 的雏形，但当时并没有提出 Core API 这样的概念。随着时代的变化，人们对于修改 Java 字节码提出更多的需求。为了满足人们的需求，ASM 就需要添加新的类。类的数量变多了，代码的管理也就变得困难起来。为了更好的管理 ASM 的代码，就将这些类（按照功能的不同）分配到不同的 Jar 包当中，这样就逐渐衍生出 Core API 和 Tree API 的概念。

这里的主要目的是**希望大家有逻辑的把握 ASM 的知识体系**：

```text
                                                          ┌─── ClassReader
                                                          │
                                  ┌─── asm.jar ───────────┼─── ClassVisitor
                                  │                       │
                                  │                       └─── ClassWriter
                 ┌─── Core API ───┤
                 │                ├─── asm-util.jar
                 │                │
ObjectWeb ASM ───┤                └─── asm-commons.jar
                 │
                 │                ┌─── asm-tree.jar
                 └─── Tree API ───┤
                                  └─── asm-analysis.jar
```

## Core API 概览

ASM Core API 概览，就是对 `asm.jar`、`asm-util.jar` 和 `asm-commons.jar` 文件里包含的主要类（`.class`）成员进行介绍。

### asm.jar

在 `asm.jar` 文件中，一共包含了 30 多个类，我们会介绍其中 10 个类。那么，剩下的 20 多个类，为什么不介绍呢？因为剩下的 20 多个主要起到“辅助”的作用，它们更多的倾向于是“幕后工作者”；而“登上舞台表演的”则是属于那 10 个类。

在“第二章”当中，我们会主要介绍从“无”到“有”生成一个新的类，其中会涉及到 `ClassVisitor`、`ClassWriter`、`FieldVisitor`、`FieldWriter`、`MethodVisitor`、`MethodWriter`、`Label` 和 `Opcodes` 类。

在“第三章”当中，我们会主要介绍修改“已经存在的类”，使之内容发生改变，其中会涉及到 `ClassReader` 和 `Type` 类。

在这 10 个类当中，最重要的是三个类，即 `ClassReader`、`ClassVisitor` 和 `ClassWriter` 类。这三个类的关系，可以描述成下图：

![ASM 里的核心类 ](/assets/images/java/asm/asm-core-classes.png)

这三个类的作用，可以简单理解成这样：

- `ClassReader` 类，负责读取 `.class` 文件里的内容，然后拆分成各个不同的部分。
- `ClassVisitor` 类，负责对 `.class` 文件中某一部分里的信息进行修改。
- `ClassWriter` 类，负责将各个不同的部分重新组合成一个完整的 `.class` 文件。

在“第二章”当中，主要围绕着 `ClassVisitor` 和 `ClassWriter` 这两个类展开，因为在这个部分，我们是从“无”到“有”生成一个新的类，不需要 `ClassReader` 类的参与。

在“第三章”当中，就需要 `ClassReader`、`ClassVisitor` 和 `ClassWriter` 这三个类的共同参与。

### asm-util.jar

`asm-util.jar` 主要包含的是一些**工具类**。

在下图当中，可以看到 `asm-util.jar` 里面包含的具体类文件。这些类主要分成两种类型：`Check` 开头和 `Trace` 开头。

- 以 `Check` 开头的类，主要负责检查（Check），也就是检查生成的 `.class` 文件内容是否正确。
- 以 `Trace` 开头的类，主要负责追踪（Trace），也就是将 `.class` 文件的内容打印成文字输出，根据输出的文字信息，可以探索或追踪（Trace）`.class` 文件的内部信息。

![asm-util.jar 里的类 ](/assets/images/java/asm/asm-util-jar-classes.png)

在 `asm-util.jar` 当中，主要介绍 `CheckClassAdapter` 类和 `TraceClassVisitor` 类，也会简略的说明一下 `Printer`、`ASMifier` 和 `Textifier` 类。

在“第四章”当中，会介绍 `asm-util.jar` 里的内容。

### asm-commons.jar

`asm-commons.jar` 主要包含的是一些**常用功能类**。

在下图当中，可以看到 `asm-commons.jar` 里面包含的具体类文件。

![asm-commons.jar 里的类 ](/assets/images/java/asm/asm-commons-jar-classes.png)

我们会介绍到其中的 `AdviceAdapter`、`AnalyzerAdapter`、`ClassRemapper`、`GeneratorAdapter`、`InstructionAdapter`、`LocalVariableSorter`、`SerialVersionUIDAdapter` 和 `StaticInitMerger` 类。

在“第四章”当中，介绍 `asm-commons.jar` 里的内容。

另外，一个非常容易混淆的问题就是，**asm-util.jar**与**asm-commons.jar**有什么区别呢？

- 在 `asm-util.jar` 里，它提供的是通用性的功能，没有特别明确的应用场景。
- 在 `asm-commons.jar` 里，它提供的功能，都是为解决某一种特定场景中出现的问题而提出的解决思路。

## 搭建 ASM 开发环境

- JDK 版本：1.8.0_261
- Maven 版本：3.8.1
- IDEA：2021.3 （Community Edition）

```text
$ java -version
java version "1.8.0_261"
Java(TM) SE Runtime Environment (build 1.8.0_261-b12)
Java HotSpot(TM) 64-Bit Server VM (build 25.261-b12, mixed mode)

$ mvn -version
Apache Maven 3.8.1 (05c21c65bdfed0f71a2f2ada8b84da59348c4c5d)
Maven home: D:\Software\apache-maven
Java version: 1.8.0_261, vendor: Oracle Corporation, runtime: C:\Program Files\Java\jdk1.8.0_261\jre
Default locale: zh_CN, platform encoding: GBK
OS name: "windows 7", version: "6.1", arch: "amd64", family: "windows"
```

### 修改 pom.xml

新建一个 maven 项目，取名为 `asm-maven`，修改其中的 `pom.xml` 文件，添加 ASM 的 Jar 包依赖。打开 `pom.xml` 文件，并添加如下内容：

```xml
<project>
    <properties>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
        <java.version>1.8</java.version>
        <maven.compiler.source>${java.version}</maven.compiler.source>
        <maven.compiler.target>${java.version}</maven.compiler.target>
        <asm.version>9.0</asm.version>
    </properties>

    <dependencies>
        <dependency>
            <groupId>org.ow2.asm</groupId>
            <artifactId>asm</artifactId>
            <version>${asm.version}</version>
        </dependency>
        <dependency>
            <groupId>org.ow2.asm</groupId>
            <artifactId>asm-commons</artifactId>
            <version>${asm.version}</version>
        </dependency>
        <dependency>
            <groupId>org.ow2.asm</groupId>
            <artifactId>asm-util</artifactId>
            <version>${asm.version}</version>
        </dependency>
        <dependency>
            <groupId>org.ow2.asm</groupId>
            <artifactId>asm-tree</artifactId>
            <version>${asm.version}</version>
        </dependency>
        <dependency>
            <groupId>org.ow2.asm</groupId>
            <artifactId>asm-analysis</artifactId>
            <version>${asm.version}</version>
        </dependency>
    </dependencies>

    <build>
        <plugins>
            <!-- Java Compiler -->
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-compiler-plugin</artifactId>
                <version>3.8.1</version>
                <configuration>
                    <source>${java.version}</source>
                    <target>${java.version}</target>
                    <fork>true</fork>
                    <compilerArgs>
                        <arg>-g</arg>
                        <arg>-parameters</arg>
                    </compilerArgs>
                </configuration>
            </plugin>
        </plugins>
    </build>
</project>
```

### 使用 ASM

这个部分涉及的代码，并不需要记忆和理解，主要是为了让大家对 ASM 的使用有一个初步的认识，为了验证 ASM 的开发环境是能够正常使用的。

#### 预期目标

我们的预期目标：生成一个 `HelloWorld` 类。

```java
package sample;

public class HelloWorld {
    @Override
    public String toString() {
        return "This is a HelloWorld object.";
    }
}
```

注意，我们不需要去写这样一个 `sample/HelloWorld.java` 文件，只是生成的 `HelloWorld` 类和这里的 Java 代码是一样的效果。

#### 编码实现

```java
package com.example;

import org.objectweb.asm.*;

public class HelloWorldDump implements Opcodes {

    public static byte[] dump() {
        ClassWriter cw = new ClassWriter(ClassWriter.COMPUTE_FRAMES);

        cw.visit(V1_8, ACC_PUBLIC | ACC_SUPER, "sample/HelloWorld", null, "java/lang/Object", null);

        {
            MethodVisitor mv1 = cw.visitMethod(ACC_PUBLIC, "<init>", "()V", null, null);
            mv1.visitCode();
            mv1.visitVarInsn(ALOAD, 0);
            mv1.visitMethodInsn(INVOKESPECIAL, "java/lang/Object", "<init>", "()V", false);
            mv1.visitInsn(RETURN);
            mv1.visitMaxs(1, 1);
            mv1.visitEnd();
        }
        {
            MethodVisitor mv2 = cw.visitMethod(ACC_PUBLIC, "toString", "()Ljava/lang/String;", null, null);
            mv2.visitCode();
            mv2.visitLdcInsn("This is a HelloWorld object.");
            mv2.visitInsn(ARETURN);
            mv2.visitMaxs(1, 1);
            mv2.visitEnd();
        }
        cw.visitEnd();

        return cw.toByteArray();
    }
}
```

#### 验证结果

```java
package com.example;

public class MyClassLoader extends ClassLoader {
    @Override
    protected Class<?> findClass(String name) throws ClassNotFoundException {
        if ("sample.HelloWorld".equals(name)) {
            byte[] bytes = HelloWorldDump.dump();
            Class<?> clazz = defineClass(name, bytes, 0, bytes.length);
            return clazz;
        }

        throw new ClassNotFoundException("Class Not Found: " + name);
    }
}
```

```java
package com.example;

public class HelloWorldRun {
    public static void main(String[] args) throws Exception {
        MyClassLoader classLoader = new MyClassLoader();
        Class<?> clazz = classLoader.loadClass("sample.HelloWorld");
        Object instance = clazz.newInstance();
        System.out.println(instance);
    }
}
```

运行之后的输出结果：

```text
This is a HelloWorld object.
```

## 总结

本文内容总结如下：

- 第一点，ASM 由 Core API 和 Tree API 两个部分组成。
- 第二点，Core API 概览，就是对 `asm.jar`、`asm-commons.jar` 和 `asm-util.jar` 文件里包含的主要类成员进行介绍。
- 第三点，如何利用 Maven 快速搭建 ASM 的开发环境。



