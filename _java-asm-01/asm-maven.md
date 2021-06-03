---
title:  "搭建ASM开发环境"
sequence: "103"
---

[UP]({% link _posts/2021-04-22-java-asm-season-01.md %})

## 开发环境

- 操作系统：Windows 7 Service Pack 1（64位）
- JDK版本：1.8.0_261
- Maven版本：3.8.1
- IDEA：2021.1.1 （Community Edition）

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

## 创建Maven项目

新建一个maven项目，取名为`asm-maven`。

### 修改pom.xml

我们需要添加对ASM相关的Jar依赖，因此需要修改`pom.xml`文件。打开`pom.xml`文件，并添加如下内容：

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

#### 预期目标

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

本文的主要目的是，希望通过一个简单的示例，能够快速搭建起ASM的开发环境。

这里面涉及到的代码，并不需要大家记忆和理解，主要是为了让大家对ASM的使用有一个初步的认识，验证ASM的开发环境能够正常使用；这些代码的含义，我们后续会讲解。
