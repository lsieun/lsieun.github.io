---
title:  "ASM的组成部分"
sequence: "102"

---

[UP]({% link _posts/2021-04-22-java-asm-season-01.md %})

## ASM的两个组成部分

从组成结构上来说，ASM分成两部分，一部分为Core API，另一部分为Tree API。

- 其中，Core API包括`asm.jar`、`asm-util.jar`和`asm-commons.jar`；
- 其中，Tree API包括`asm-tree.jar`和`asm-analysis.jar`。

{:refdef: style="text-align: center;"}
![ASM Components](/assets/images/java/asm/asm-components.png)
{: refdef}

从两者的关系来说，Core API是基础，而Tree API是在Core API的这个基础上构建起来的。

从ASM API演进的历史来讲，先有Core API，后有Tree API。最初，在2002年，Eric Bruneton等发表了一篇文章，即《[ASM: a code manipulation tool to implement adaptable systems](/assets/pdf/asm-eng.pdf)》。在这篇文章当中，最早提出了ASM的设计思路。当时，ASM只包含13个类文件，Jar包的大小只有21KB。这13个类文件，就是现在所说的Core API的雏形，但当时并没有提出Core API这样的概念。随着时代的变化，人们对于修改Java字节码提出更多的需求。为了满足人们的需求，ASM就需要添加新的类。类的数量变多了，代码的管理也就变得困难起来。为了更好的管理ASM的代码，就将这些类（按照功能的不同）分配到不同的Jar包当中，这样就逐渐衍生出Core API和Tree API的概念。

## Core API概览

ASM Core API概览，就是对`asm.jar`、`asm-util.jar`和`asm-commons.jar`文件里包含的主要类成员进行介绍。

### asm.jar

在`asm.jar`文件中，一共包含了30多个类，我们会介绍其中10个类。那么，剩下的20多个类，为什么不介绍呢？因为剩下的20多个主要起到“辅助”的作用，它们更多的倾向于是“幕后工作者”；而“登上舞台表演的”则是属于那10个类。

在“第二章”当中，我们会主要介绍从“无”到“有”生成一个新的类，其中会涉及到`ClassVisitor`、`ClassWriter`、`FieldVisitor`、`FieldWriter`、`MethodVisitor`、`MethodWriter`、`Label`和`Opcodes`类。

在“第三章”当中，我们会主要介绍修改“已经存在的类”，使之内容发生改变，其中会涉及到`ClassReader`和`Type`类。

在这10个类当中，最重要的是三个类，即`ClassReader`、`ClassVisitor`和`ClassWriter`类。这三个类的关系，可以描述成下图：

{:refdef: style="text-align: center;"}
![ASM里的核心类](/assets/images/java/asm/asm-core-classes.png)
{: refdef}

这三个类的作用，可以简单理解成这样：

- `ClassReader`类，负责读取`.class`文件里的内容，然后拆分成各个不同的部分。
- `ClassVisitor`类，负责对`.class`文件中某一部分里的信息进行修改。
- `ClassWriter`类，负责将各个不同的部分重新组合成一个完整的`.class`文件。

在“第二章”当中，主要围绕着`ClassVisitor`和`ClassWriter`这两个类展开，因为在这个部分，我们是从“无”到“有”生成一个新的类，不需要`ClassReader`类的参与。

在“第三章”当中，就需要`ClassReader`、`ClassVisitor`和`ClassWriter`这三个类的共同参与。

### asm-util.jar

`asm-util.jar`主要包含的是一些**工具类**。

在下图当中，可以看到`asm-util.jar`里面包含的具体类文件。这些类主要分成两种类型：`Check`开头和`Trace`开头。

- 以`Check`开头的类，主要负责检查（Check）生成的`.class`文件内容是否正确。
- 以`Trace`开头的类，主要负责将`.class`文件的内容打印成文字输出。根据输出的文字信息，可以探索或追踪（Trace）`.class`文件的内部信息。

{:refdef: style="text-align: center;"}
![asm-util.jar里的类](/assets/images/java/asm/asm-util-jar-classes.png)
{: refdef}

在`asm-util.jar`当中，主要介绍`CheckClassAdapter`类和`TraceClassVisitor`类，也会简略的说明一下`Printer`、`ASMifier`和`Textifier`类。

在“第四章”当中，会介绍`asm-util.jar`里的内容。

### asm-commons.jar

`asm-commons.jar`主要包含的是一些**常用功能类**。

在下图当中，可以看到`asm-commons.jar`里面包含的具体类文件。

{:refdef: style="text-align: center;"}
![asm-commons.jar里的类](/assets/images/java/asm/asm-commons-jar-classes.png)
{: refdef}

我们会介绍到其中的`AdviceAdapter`、`AnalyzerAdapter`、`ClassRemapper`、`GeneratorAdapter`、`InstructionAdapter`、`LocalVariableSorter`、`SerialVersionUIDAdapter`和`StaticInitMerger`类。

在“第四章”当中，介绍`asm-commons.jar`里的内容。

另外，一个非常容易混淆的问题就是，**asm-util.jar**与**asm-commons.jar**有什么区别呢？在`asm-util.jar`里，它提供的是通用性的功能，没有特别明确的应用场景；而在`asm-commons.jar`里，它提供的功能，都是为解决某一种特定场景中出现的问题而提出的解决思路。

## 搭建ASM开发环境

- JDK版本：1.8.0_261
- Maven版本：3.8.1
- IDEA：2021.1.2 （Community Edition）

{% highlight text %}
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
{% endhighlight %}

### 修改pom.xml

新建一个maven项目，取名为`asm-maven`，修改其中的`pom.xml`文件，添加ASM的Jar包依赖。打开`pom.xml`文件，并添加如下内容：

{% highlight xml %}
{% raw %}
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
{% endraw %}
{% endhighlight %}

### 使用ASM

这个部分涉及的代码，并不需要记忆和理解，主要是为了让大家对ASM的使用有一个初步的认识，为了验证ASM的开发环境是能够正常使用的。

#### 预期目标

我们的预期目标是，生成一个`HelloWorld`类，它对应的Java代码如下：

{% highlight java %}
{% raw %}
package sample;

public class HelloWorld {
    @Override
    public String toString() {
        return "This is a HelloWorld object.";
    }
}
{% endraw %}
{% endhighlight %}

注意，我们不需要去写这样一个`sample/HelloWorld.java`文件，只是生成的`HelloWorld`类和这里的Java代码是一样的效果。

#### 编码实现

{% highlight java %}
{% raw %}
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
{% endraw %}
{% endhighlight %}

#### 验证结果

{% highlight java %}
{% raw %}
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
{% endraw %}
{% endhighlight %}

{% highlight java %}
{% raw %}
package com.example;

public class HelloWorldRun {
    public static void main(String[] args) throws Exception {
        MyClassLoader classLoader = new MyClassLoader();
        Class<?> clazz = classLoader.loadClass("sample.HelloWorld");
        Object instance = clazz.newInstance();
        System.out.println(instance);
    }
}
{% endraw %}
{% endhighlight %}

运行之后的输出结果：

```text
This is a HelloWorld object.
```

## 总结

本文主要是对ASM的组成部分进行了介绍，内容总结如下：

- 第一点，ASM由Core API和Tree API两个部分组成。
- 第二点，Core API概览，就是对`asm.jar`、`asm-commons.jar`和`asm-util.jar`文件里包含的主要类成员进行介绍。
- 第三点，通过一个简单的示例，能够快速搭建起ASM的开发环境。



