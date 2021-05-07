---
title:  "使用Maven搭建ASM开发环境"
sequence: "003"
---

[UP]({% link _posts/2021-04-22-java-asm-season-01.md %})

## Maven配置

新建一个maven项目，取名为`asm-maven`，修改`pom.xml`文件，添加如下内容：

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

## 示例代码

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

### HelloWorldDump.java

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

### MyClassLoader.java

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

### HelloWorldRun.java

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

