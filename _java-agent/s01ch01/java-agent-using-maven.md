---
title: "Maven：Load-Time Agent 和 Dynamic Agent"
sequence: "106"
---

[UP]({% link _java-agent/java-agent-01.md %})

## 预期目标

我们的预期目标：打印方法接收的参数值和返回值，借助于 Maven 管理依赖和进行编译，避免手工打 Jar 包的麻烦。

本文内容虽然很多，但是我们静下心来想一想，它有一个简单的目标：生成一个 Agent Jar。因此，在过程当中的内容细节，都是为 `TheAgent.jar` 做一定的铺垫。

新建一个 Maven 项目，取名为 `java-agent-maven`，代码目录结构：[Code](/assets/zip/java-agent-maven.zip)

```text
java-agent-maven
├─── pom.xml
└─── src
     └─── main
          └─── java
               ├─── lsieun
               │    ├─── agent
               │    │    ├─── DynamicAgent.java
               │    │    └─── LoadTimeAgent.java
               │    ├─── asm
               │    │    ├─── adapter
               │    │    │    └─── PrintMethodInfoStdAdapter.java
               │    │    ├─── cst
               │    │    │    └─── Const.java
               │    │    └─── visitor
               │    │         ├─── MethodInfo.java
               │    │         └─── PrintMethodInfoVisitor.java
               │    ├─── instrument
               │    │    └─── ASMTransformer.java
               │    └─── Main.java
               ├─── run
               │    ├─── DynamicInstrumentation.java
               │    ├─── LoadTimeInstrumentation.java
               │    └─── PathManager.java
               └─── sample
                    ├─── HelloWorld.java
                    └─── Program.java
```

问题：为什么没有 `manifest.txt` 文件呢？

回答：因为 `META-INF/MANIFEST.MF` 的信息由 `pom.xml` 文件中 `maven-jar-plugin` 提供。

生成 Jar 文件，我们有三种选择：

- 第一种，`maven-jar-plugin` + `maven-dependency-plugin`
- 第二种，`maven-assembly-plugin`
- 第三种，`maven-shade-plugin`

## pom.xml

在 Maven 项目当中，一个非常重要的配置就是 `pom.xml` 文件。

### properties

```text
<properties>
    <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
    <java.version>1.8</java.version>
    <maven.compiler.source>${java.version}</maven.compiler.source>
    <maven.compiler.target>${java.version}</maven.compiler.target>
    <asm.version>9.0</asm.version>
</properties>
```

### dependencies

```text
<dependencies>
</dependencies>
```

#### ASM

在这里不再使用 JDK 内置的 ASM 类库，因为内置的版本比较低。

我们想使用更高的 ASM 版本，也就能够支持更高版本 `.class` 文件操作。

```text
<dependency>
    <groupId>org.ow2.asm</groupId>
    <artifactId>asm</artifactId>
    <version>${asm.version}</version>
</dependency>
<dependency>
    <groupId>org.ow2.asm</groupId>
    <artifactId>asm-util</artifactId>
    <version>${asm.version}</version>
</dependency>
<dependency>
    <groupId>org.ow2.asm</groupId>
    <artifactId>asm-commons</artifactId>
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
```

#### tools.jar

在 `tools.jar` 文件当中，包含了 `com.sun.tools.attach.VirtualMachine` 类，会在 `DynamicInstrumentation` 类当中用到。

在 Java 9 之后的版本，引入了模块化系统，`com.sun.tools.attach` 包位于 `jdk.attach` 模块。

```text
<dependency>
    <groupId>com.sun</groupId>
    <artifactId>tools</artifactId>
    <version>8</version>
    <scope>system</scope>
    <systemPath>${env.JAVA_HOME}/lib/tools.jar</systemPath>
</dependency>
```

### plugins

```text
<build>
    <finalName>TheAgent</finalName>
    <plugins>
    </plugins>
</build>
```

#### compiler-plugin

下面的 `maven-compiler-plugin` 插件主要关注 `compilerArgs` 下的三个参数：

- `-g`: 生成所有调试信息
- `-parameters`: 生成  属性
- `-XDignore.symbol.file`: 在编译过程中，进行 link 时，不使用 `lib/ct.sym`，而是直接使用 `rt.jar` 文件。

```text
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
            <arg>-XDignore.symbol.file</arg>
        </compilerArgs>
    </configuration>
</plugin>
```

#### jar-plugin

下面的[`maven-jar-plugin`](https://maven.apache.org/shared/maven-archiver/index.html)插件主要做以下两件事情：

- 第一，设置 `META-INF/MANIFEST.MF` 中的信息。
- 第二，确定在 jar 包当中包含哪些文件。

关于 `<archive>` 的配置，可以参考 [Apache Maven Archiver](https://maven.apache.org/shared/maven-archiver/index.html)。

```text
<plugin>
    <groupId>org.apache.maven.plugins</groupId>
    <artifactId>maven-jar-plugin</artifactId>
    <version>3.2.0</version>
    <configuration>
        <archive>
            <manifest>
                <mainClass>lsieun.Main</mainClass>
                <addClasspath>true</addClasspath>
                <classpathPrefix>lib/</classpathPrefix>
                <addDefaultImplementationEntries>false</addDefaultImplementationEntries>
                <addDefaultSpecificationEntries>false</addDefaultSpecificationEntries>
            </manifest>
            <manifestEntries>
                <Premain-Class>lsieun.agent.LoadTimeAgent</Premain-Class>
                <Agent-Class>lsieun.agent.DynamicAgent</Agent-Class>
                <Launcher-Agent-Class>lsieun.agent.LauncherAgent</Launcher-Agent-Class>
                <Can-Redefine-Classes>true</Can-Redefine-Classes>
                <Can-Retransform-Classes>true</Can-Retransform-Classes>
                <Can-Set-Native-Method-Prefix>true</Can-Set-Native-Method-Prefix>
            </manifestEntries>
            <addMavenDescriptor>false</addMavenDescriptor>
        </archive>
        <includes>
            <include>lsieun/**</include>
        </includes>
    </configuration>
</plugin>
```

如果我们想使用的配置文件，可以使用 `manifestFile` ：

```text
<configuration>
    <archive>
        <manifestFile>src/main/resources/manifest.mf</manifestFile>
    </archive>
</configuration>
```

#### dependency-plugin

下面的 `maven-dependency-plugin` 插件主要目的：将依赖的 jar 包复制到 `lib` 目录下。

```text
<plugin>
    <groupId>org.apache.maven.plugins</groupId>
    <artifactId>maven-dependency-plugin</artifactId>
    <version>3.2.0</version>
    <executions>
        <execution>
            <id>lib-copy-dependencies</id>
            <phase>package</phase>
            <goals>
                <goal>copy-dependencies</goal>
            </goals>
            <configuration>
                <excludeArtifactIds>tools</excludeArtifactIds>
                <outputDirectory>${project.build.directory}/lib</outputDirectory>
                <overWriteReleases>false</overWriteReleases>
                <overWriteSnapshots>false</overWriteSnapshots>
                <overWriteIfNewer>true</overWriteIfNewer>
            </configuration>
        </execution>
    </executions>
</plugin>
```

#### assembly-plugin

下面的 [`maven-assembly-plugin`](https://maven.apache.org/plugins/maven-assembly-plugin/index.html) 插件主要目的：生成一个 jar 文件，它包含了依赖的 jar 包。

```text
<plugin>
    <groupId>org.apache.maven.plugins</groupId>
    <artifactId>maven-assembly-plugin</artifactId>
    <version>3.3.0</version>
    <configuration>
        <archive>
            <manifest>
                <mainClass>lsieun.Main</mainClass>
                <addDefaultEntries>false</addDefaultEntries>
            </manifest>
            <manifestEntries>
                <Premain-Class>lsieun.agent.LoadTimeAgent</Premain-Class>
                <Agent-Class>lsieun.agent.DynamicAgent</Agent-Class>
                <Launcher-Agent-Class>lsieun.agent.LauncherAgent</Launcher-Agent-Class>
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
```

#### shade-plugin

下面的 [`maven-shade-plugin`](https://maven.apache.org/plugins/maven-shade-plugin/index.html) 插件主要目的：生成一个 jar 文件，它包含了依赖的 jar 包，可以进行精简。

```text
<plugin>
    <groupId>org.apache.maven.plugins</groupId>
    <artifactId>maven-shade-plugin</artifactId>
    <version>3.2.4</version>
    <configuration>
        <minimizeJar>true</minimizeJar>
        <filters>
            <filter>
                <artifact>*:*</artifact>
                <excludes>
                    <exclude>run/*</exclude>
                    <exclude>sample/*</exclude>
                </excludes>
            </filter>
        </filters>
    </configuration>
    <executions>
        <execution>
            <phase>package</phase>
            <goals>
                <goal>shade</goal>
            </goals>
            <configuration>
                <transformers>
                    <transformer implementation="org.apache.maven.plugins.shade.resource.ManifestResourceTransformer">
                        <manifestEntries>
                            <Main-Class>lsieun.Main</Main-Class>
                            <Premain-Class>lsieun.agent.LoadTimeAgent</Premain-Class>
                            <Agent-Class>lsieun.agent.DynamicAgent</Agent-Class>
                            <Launcher-Agent-Class>lsieun.agent.LauncherAgent</Launcher-Agent-Class>
                            <Can-Redefine-Classes>true</Can-Redefine-Classes>
                            <Can-Retransform-Classes>true</Can-Retransform-Classes>
                            <Can-Set-Native-Method-Prefix>true</Can-Set-Native-Method-Prefix>
                        </manifestEntries>
                    </transformer>
                </transformers>
            </configuration>
        </execution>
    </executions>
</plugin>
```

## Application

### HelloWorld.java

```java
package sample;

public class HelloWorld {
    public static int add(int a, int b) {
        return a + b;
    }

    public static int sub(int a, int b) {
        return a - b;
    }
}
```

### Program.java

```java
package sample;

import java.lang.management.ManagementFactory;
import java.util.Random;
import java.util.concurrent.TimeUnit;

public class Program {
    public static void main(String[] args) throws Exception {
        // (1) print process id
        String nameOfRunningVM = ManagementFactory.getRuntimeMXBean().getName();
        System.out.println(nameOfRunningVM);

        // (2) count down
        int count = 600;
        for (int i = 0; i < count; i++) {
            String info = String.format("|%03d| %s remains %03d seconds", i, nameOfRunningVM, (count - i));
            System.out.println(info);

            Random rand = new Random(System.currentTimeMillis());
            int a = rand.nextInt(10);
            int b = rand.nextInt(10);
            boolean flag = rand.nextBoolean();
            String message;
            if (flag) {
                message = String.format("a + b = %d", HelloWorld.add(a, b));
            }
            else {
                message = String.format("a - b = %d", HelloWorld.sub(a, b));
            }
            System.out.println(message);

            TimeUnit.SECONDS.sleep(1);
        }
    }
}
```

## ASM 相关

### Const.java

```java
package lsieun.asm.cst;

import org.objectweb.asm.Opcodes;

public class Const {
    public static final int ASM_VERSION = Opcodes.ASM9;
}
```

### PrintMethodInfoStdAdapter.java

```java
package lsieun.asm.adapter;

import lsieun.asm.cst.Const;
import lsieun.asm.visitor.MethodInfo;
import org.objectweb.asm.MethodVisitor;
import org.objectweb.asm.Opcodes;
import org.objectweb.asm.Type;

import java.util.Objects;
import java.util.Set;

public class PrintMethodInfoStdAdapter extends MethodVisitor implements Opcodes {
    private final String owner;
    private final int methodAccess;
    private final String methodName;
    private final String methodDesc;
    private final Set<MethodInfo> flags;

    public PrintMethodInfoStdAdapter(MethodVisitor methodVisitor,
                                     String owner, int methodAccess, String methodName, String methodDesc,
                                     Set<MethodInfo> flags) {
        super(Const.ASM_VERSION, methodVisitor);

        Objects.requireNonNull(flags);

        this.owner = owner;
        this.methodAccess = methodAccess;
        this.methodName = methodName;
        this.methodDesc = methodDesc;
        this.flags = flags;

    }

    @Override
    public void visitCode() {
        if (mv != null) {
            if (flags.contains(MethodInfo.NAME_AND_DESC)) {
                String line = String.format("Method Enter: %s.%s:%s", owner, methodName, methodDesc);
                printMessage(line);
            }

            if (flags.contains(MethodInfo.PARAMETER_VALUES)) {
                int slotIndex = (methodAccess & Opcodes.ACC_STATIC) != 0 ? 0 : 1;
                Type methodType = Type.getMethodType(methodDesc);
                Type[] argumentTypes = methodType.getArgumentTypes();
                for (Type t : argumentTypes) {
                    printParameter(slotIndex, t);

                    int size = t.getSize();
                    slotIndex += size;
                }
            }

            if (flags.contains(MethodInfo.CLASSLOADER)) {
                printClassLoader();
            }

            if (flags.contains(MethodInfo.THREAD_INFO)) {
                printThreadInfo();
            }

            if (flags.contains(MethodInfo.STACK_TRACE)) {
                printStackTrace();
            }
        }

        super.visitCode();
    }

    @Override
    public void visitInsn(int opcode) {
        if (flags.contains(MethodInfo.RETURN_VALUE)) {
            Type t = Type.getMethodType(methodDesc);
            Type returnType = t.getReturnType();

            if (opcode == Opcodes.ATHROW) {
                String line = String.format("Method throws Exception: %s.%s:%s", owner, methodName, methodDesc);
                printMessage(line);
                String message = "    abnormal return";
                printMessage(message);
                printMessage("=================================================================================");
            }
            else if (opcode == Opcodes.RETURN) {
                String line = String.format("Method Return: %s.%s:%s", owner, methodName, methodDesc);
                printMessage(line);
                String message = "    return void";
                printMessage(message);
                printMessage("=================================================================================");
            }
            else if (opcode >= Opcodes.IRETURN && opcode <= Opcodes.ARETURN) {
                String line = String.format("Method Return: %s.%s:%s", owner, methodName, methodDesc);
                printMessage(line);

                printReturnValue(returnType);
                printMessage("=================================================================================");
            }
            else {
                assert false : "should not be here";
            }
        }


        super.visitInsn(opcode);
    }

    private void printMessage(String message) {
        super.visitFieldInsn(GETSTATIC, "java/lang/System", "out", "Ljava/io/PrintStream;");
        super.visitLdcInsn(message);
        super.visitMethodInsn(INVOKEVIRTUAL, "java/io/PrintStream", "println", "(Ljava/lang/String;)V", false);
    }

    private void printParameter(int slotIndex, Type t) {
        super.visitFieldInsn(GETSTATIC, "java/lang/System", "out", "Ljava/io/PrintStream;");
        super.visitTypeInsn(NEW, "java/lang/StringBuilder");
        super.visitInsn(DUP);
        super.visitMethodInsn(INVOKESPECIAL, "java/lang/StringBuilder", "<init>", "()V", false);
        super.visitLdcInsn("    ");
        super.visitMethodInsn(INVOKEVIRTUAL, "java/lang/StringBuilder", "append", "(Ljava/lang/String;)Ljava/lang/StringBuilder;", false);
        if (slotIndex >= 0 && slotIndex <= 5) {
            super.visitInsn(ICONST_0 + slotIndex);
        }
        else {
            super.visitIntInsn(BIPUSH, slotIndex);
        }

        super.visitMethodInsn(INVOKEVIRTUAL, "java/lang/StringBuilder", "append", "(I)Ljava/lang/StringBuilder;", false);
        super.visitLdcInsn(": ");
        super.visitMethodInsn(INVOKEVIRTUAL, "java/lang/StringBuilder", "append", "(Ljava/lang/String;)Ljava/lang/StringBuilder;", false);

        int opcode = t.getOpcode(Opcodes.ILOAD);
        super.visitVarInsn(opcode, slotIndex);

        int sort = t.getSort();
        String descriptor;
        if (sort == Type.SHORT) {
            descriptor = "(I)Ljava/lang/StringBuilder;";
        }
        else if (sort >= Type.BOOLEAN && sort <= Type.DOUBLE) {
            descriptor = "(" + t.getDescriptor() + ")Ljava/lang/StringBuilder;";
        }
        else {
            descriptor = "(Ljava/lang/Object;)Ljava/lang/StringBuilder;";
        }

        super.visitMethodInsn(INVOKEVIRTUAL, "java/lang/StringBuilder", "append", descriptor, false);
        super.visitMethodInsn(INVOKEVIRTUAL, "java/lang/StringBuilder", "toString", "()Ljava/lang/String;", false);
        super.visitMethodInsn(INVOKEVIRTUAL, "java/io/PrintStream", "println", "(Ljava/lang/String;)V", false);
    }

    private void printThreadInfo() {
        super.visitFieldInsn(GETSTATIC, "java/lang/System", "out", "Ljava/io/PrintStream;");
        super.visitTypeInsn(NEW, "java/lang/StringBuilder");
        super.visitInsn(DUP);
        super.visitMethodInsn(INVOKESPECIAL, "java/lang/StringBuilder", "<init>", "()V", false);
        super.visitLdcInsn("Thread Id: ");
        super.visitMethodInsn(INVOKEVIRTUAL, "java/lang/StringBuilder", "append", "(Ljava/lang/String;)Ljava/lang/StringBuilder;", false);
        super.visitMethodInsn(INVOKESTATIC, "java/lang/Thread", "currentThread", "()Ljava/lang/Thread;", false);
        super.visitMethodInsn(INVOKEVIRTUAL, "java/lang/Thread", "getName", "()Ljava/lang/String;", false);
        super.visitMethodInsn(INVOKEVIRTUAL, "java/lang/StringBuilder", "append", "(Ljava/lang/String;)Ljava/lang/StringBuilder;", false);
        super.visitLdcInsn("@");
        super.visitMethodInsn(INVOKEVIRTUAL, "java/lang/StringBuilder", "append", "(Ljava/lang/String;)Ljava/lang/StringBuilder;", false);
        super.visitMethodInsn(INVOKESTATIC, "java/lang/Thread", "currentThread", "()Ljava/lang/Thread;", false);
        super.visitMethodInsn(INVOKEVIRTUAL, "java/lang/Thread", "getId", "()J", false);
        super.visitMethodInsn(INVOKEVIRTUAL, "java/lang/StringBuilder", "append", "(J)Ljava/lang/StringBuilder;", false);
        super.visitLdcInsn("(");
        super.visitMethodInsn(INVOKEVIRTUAL, "java/lang/StringBuilder", "append", "(Ljava/lang/String;)Ljava/lang/StringBuilder;", false);
        super.visitMethodInsn(INVOKESTATIC, "java/lang/Thread", "currentThread", "()Ljava/lang/Thread;", false);
        super.visitMethodInsn(INVOKEVIRTUAL, "java/lang/Thread", "isDaemon", "()Z", false);
        super.visitMethodInsn(INVOKEVIRTUAL, "java/lang/StringBuilder", "append", "(Z)Ljava/lang/StringBuilder;", false);
        super.visitLdcInsn(")");
        super.visitMethodInsn(INVOKEVIRTUAL, "java/lang/StringBuilder", "append", "(Ljava/lang/String;)Ljava/lang/StringBuilder;", false);
        super.visitMethodInsn(INVOKEVIRTUAL, "java/lang/StringBuilder", "toString", "()Ljava/lang/String;", false);
        super.visitMethodInsn(INVOKEVIRTUAL, "java/io/PrintStream", "println", "(Ljava/lang/String;)V", false);
    }

    private void printClassLoader() {
        super.visitFieldInsn(GETSTATIC, "java/lang/System", "out", "Ljava/io/PrintStream;");
        super.visitTypeInsn(NEW, "java/lang/StringBuilder");
        super.visitInsn(DUP);
        super.visitMethodInsn(INVOKESPECIAL, "java/lang/StringBuilder", "<init>", "()V", false);
        super.visitLdcInsn("ClassLoader: ");
        super.visitMethodInsn(INVOKEVIRTUAL, "java/lang/StringBuilder", "append", "(Ljava/lang/String;)Ljava/lang/StringBuilder;", false);
        super.visitLdcInsn(Type.getObjectType(owner));
        super.visitMethodInsn(INVOKEVIRTUAL, "java/lang/Class", "getClassLoader", "()Ljava/lang/ClassLoader;", false);
        super.visitMethodInsn(INVOKEVIRTUAL, "java/lang/StringBuilder", "append", "(Ljava/lang/Object;)Ljava/lang/StringBuilder;", false);
        super.visitMethodInsn(INVOKEVIRTUAL, "java/lang/StringBuilder", "toString", "()Ljava/lang/String;", false);
        super.visitMethodInsn(INVOKEVIRTUAL, "java/io/PrintStream", "println", "(Ljava/lang/String;)V", false);
    }

    private void printStackTrace() {
        super.visitTypeInsn(NEW, "java/lang/Exception");
        super.visitInsn(DUP);
        super.visitTypeInsn(NEW, "java/lang/StringBuilder");
        super.visitInsn(DUP);
        super.visitMethodInsn(INVOKESPECIAL, "java/lang/StringBuilder", "<init>", "()V", false);
        super.visitLdcInsn("Exception from ");
        super.visitMethodInsn(INVOKEVIRTUAL, "java/lang/StringBuilder", "append", "(Ljava/lang/String;)Ljava/lang/StringBuilder;", false);
        super.visitLdcInsn(Type.getObjectType(owner));
        super.visitMethodInsn(INVOKEVIRTUAL, "java/lang/Class", "getName", "()Ljava/lang/String;", false);
        super.visitMethodInsn(INVOKEVIRTUAL, "java/lang/StringBuilder", "append", "(Ljava/lang/String;)Ljava/lang/StringBuilder;", false);
        super.visitMethodInsn(INVOKEVIRTUAL, "java/lang/StringBuilder", "toString", "()Ljava/lang/String;", false);
        super.visitMethodInsn(INVOKESPECIAL, "java/lang/Exception", "<init>", "(Ljava/lang/String;)V", false);
        super.visitFieldInsn(GETSTATIC, "java/lang/System", "out", "Ljava/io/PrintStream;");
        super.visitMethodInsn(INVOKEVIRTUAL, "java/lang/Exception", "printStackTrace", "(Ljava/io/PrintStream;)V", false);
    }

    private void printReturnValue(Type returnType) {
        int size = returnType.getSize();
        if (size == 1) {
            super.visitInsn(DUP);
        }
        else if (size == 2) {
            super.visitInsn(DUP2);
        }
        else {
            assert false : "should not be here";
        }

        printValueOnStack(returnType);
    }

    private void printValueOnStack(Type t) {
        super.visitFieldInsn(GETSTATIC, "java/lang/System", "out", "Ljava/io/PrintStream;");
        int size = t.getSize();
        if (size == 1) {
            super.visitInsn(SWAP);
        }
        else if (size == 2) {
            super.visitInsn(DUP_X2);
            super.visitInsn(POP);
        }
        else {
            assert false : "should not be here";
        }

        super.visitTypeInsn(NEW, "java/lang/StringBuilder");
        super.visitInsn(DUP);
        super.visitMethodInsn(INVOKESPECIAL, "java/lang/StringBuilder", "<init>", "()V", false);
        super.visitLdcInsn("    ");
        super.visitMethodInsn(INVOKEVIRTUAL, "java/lang/StringBuilder", "append", "(Ljava/lang/String;)Ljava/lang/StringBuilder;", false);

        if (size == 1) {
            super.visitInsn(SWAP);
        }
        else {
            super.visitInsn(DUP_X2);
            super.visitInsn(POP);
        }

        int sort = t.getSort();
        String descriptor;
        if (sort == Type.SHORT) {
            descriptor = "(I)Ljava/lang/StringBuilder;";
        }
        else if (sort >= Type.BOOLEAN && sort <= Type.DOUBLE) {
            descriptor = "(" + t.getDescriptor() + ")Ljava/lang/StringBuilder;";
        }
        else {
            descriptor = "(Ljava/lang/Object;)Ljava/lang/StringBuilder;";
        }

        super.visitMethodInsn(INVOKEVIRTUAL, "java/lang/StringBuilder", "append", descriptor, false);
        super.visitMethodInsn(INVOKEVIRTUAL, "java/lang/StringBuilder", "toString", "()Ljava/lang/String;", false);
        super.visitMethodInsn(INVOKEVIRTUAL, "java/io/PrintStream", "println", "(Ljava/lang/String;)V", false);
    }
}
```

### MethodInfo.java

```java
package lsieun.asm.visitor;

import java.util.EnumSet;

public enum MethodInfo {
    NAME_AND_DESC,
    PARAMETER_VALUES,
    RETURN_VALUE,
    CLASSLOADER,
    STACK_TRACE,
    THREAD_INFO;

    public static final EnumSet<MethodInfo> ALL = EnumSet.allOf(MethodInfo.class);
}
```

### PrintMethodInfoVisitor.java

```java
package lsieun.asm.visitor;

import lsieun.asm.adapter.PrintMethodInfoStdAdapter;
import lsieun.asm.cst.Const;
import org.objectweb.asm.ClassVisitor;
import org.objectweb.asm.MethodVisitor;
import org.objectweb.asm.Opcodes;

import java.util.Set;

public class PrintMethodInfoVisitor extends ClassVisitor {
    private static final String ALL = "*";

    private String owner;
    private final String methodName;
    private final String methodDesc;
    private final Set<MethodInfo> flags;

    public PrintMethodInfoVisitor(ClassVisitor classVisitor, Set<MethodInfo> flags) {
        this(classVisitor, ALL, ALL, flags);
    }

    public PrintMethodInfoVisitor(ClassVisitor classVisitor, String methodName, String methodDesc, Set<MethodInfo> flags) {
        super(Const.ASM_VERSION, classVisitor);
        this.methodName = methodName;
        this.methodDesc = methodDesc;
        this.flags = flags;
    }

    @Override
    public void visit(int version, int access, String name, String signature, String superName, String[] interfaces) {
        super.visit(version, access, name, signature, superName, interfaces);
        this.owner = name;
    }

    @Override
    public MethodVisitor visitMethod(int access, String name, String descriptor, String signature, String[] exceptions) {
        MethodVisitor mv = super.visitMethod(access, name, descriptor, signature, exceptions);

        if (mv == null) return mv;

        boolean isAbstract = (access & Opcodes.ACC_ABSTRACT) != 0;
        boolean isNative = (access & Opcodes.ACC_NATIVE) != 0;
        if (isAbstract || isNative) return mv;

        if (name.equals("<init>") || name.equals("<clinit>")) return mv;

        boolean process = false;
        if (ALL.equals(methodName) && ALL.equals(methodDesc)) {
            process = true;
        }
        else if (name.equals(methodName) && ALL.equals(methodDesc)) {
            process = true;
        }
        else if (name.equals(methodName) && descriptor.equals(methodDesc)) {
            process = true;
        }

        if (process) {
            String line = String.format("---> %s.%s:%s", owner, name, descriptor);
            System.out.println(line);
            mv = new PrintMethodInfoStdAdapter(mv, owner, access, name, descriptor, flags);
        }

        return mv;
    }
}
```

## Agent Jar

### LoadTimeAgent.java

```java
package lsieun.agent;

import lsieun.instrument.ASMTransformer;

import java.lang.instrument.ClassFileTransformer;
import java.lang.instrument.Instrumentation;

public class LoadTimeAgent {
    public static void premain(String agentArgs, Instrumentation inst) {
        System.out.println("Premain-Class: " + LoadTimeAgent.class.getName());
        System.out.println("Can-Redefine-Classes: " + inst.isRedefineClassesSupported());
        System.out.println("Can-Retransform-Classes: " + inst.isRetransformClassesSupported());
        System.out.println("Can-Set-Native-Method-Prefix: " + inst.isNativeMethodPrefixSupported());
        System.out.println("========= ========= =========");

        ClassFileTransformer transformer = new ASMTransformer("sample/HelloWorld");
        inst.addTransformer(transformer, false);
    }
}
```

### DynamicAgent.java

```java
package lsieun.agent;

import lsieun.instrument.ASMTransformer;

import java.lang.instrument.ClassFileTransformer;
import java.lang.instrument.Instrumentation;

public class DynamicAgent {
    public static void agentmain(String agentArgs, Instrumentation inst) {
        System.out.println("Agent-Class: " + DynamicAgent.class.getName());
        System.out.println("Can-Redefine-Classes: " + inst.isRedefineClassesSupported());
        System.out.println("Can-Retransform-Classes: " + inst.isRetransformClassesSupported());
        System.out.println("Can-Set-Native-Method-Prefix: " + inst.isNativeMethodPrefixSupported());
        System.out.println("========= ========= =========");

        ClassFileTransformer transformer = new ASMTransformer("sample/HelloWorld");
        inst.addTransformer(transformer, true);

        try {
            Class<?> targetClass = Class.forName("sample.HelloWorld");
            inst.retransformClasses(targetClass);
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        finally {
            inst.removeTransformer(transformer);
        }
    }
}
```

### LauncherAgent.java

```java
package lsieun.agent;

import java.lang.instrument.Instrumentation;

public class LauncherAgent {
    public static void agentmain(String agentArgs, Instrumentation inst) {
        System.out.println("Launcher-Agent-Class: " + LauncherAgent.class.getName());
        System.out.println("Can-Redefine-Classes: " + inst.isRedefineClassesSupported());
        System.out.println("Can-Retransform-Classes: " + inst.isRetransformClassesSupported());
        System.out.println("Can-Set-Native-Method-Prefix: " + inst.isNativeMethodPrefixSupported());
        System.out.println("========= ========= =========");
    }
}
```

### ASMTransformer.java

```java
package lsieun.instrument;

import lsieun.asm.visitor.*;
import org.objectweb.asm.*;

import java.lang.instrument.ClassFileTransformer;
import java.lang.instrument.IllegalClassFormatException;
import java.security.ProtectionDomain;
import java.util.*;

public class ASMTransformer implements ClassFileTransformer {
    public static final List<String> ignoredPackages = Arrays.asList("com/", "com/sun/", "java/", "javax/", "jdk/", "lsieun/", "org/", "sun/");

    private final String internalName;

    public ASMTransformer(String internalName) {
        Objects.requireNonNull(internalName);
        this.internalName = internalName.replace(".", "/");
    }

    @Override
    public byte[] transform(ClassLoader loader,
                            String className,
                            Class<?> classBeingRedefined,
                            ProtectionDomain protectionDomain,
                            byte[] classfileBuffer) throws IllegalClassFormatException {
        if (className == null) return null;

        for (String name : ignoredPackages) {
            if (className.startsWith(name)) {
                return null;
            }
        }
        System.out.println("candidate class: " + className);

        if (className.equals(internalName)) {
            System.out.println("transform class: " + className);
            ClassReader cr = new ClassReader(classfileBuffer);
            ClassWriter cw = new ClassWriter(ClassWriter.COMPUTE_FRAMES);
            Set<MethodInfo> flags = EnumSet.of(
                    MethodInfo.NAME_AND_DESC,
                    MethodInfo.PARAMETER_VALUES,
                    MethodInfo.RETURN_VALUE);
            ClassVisitor cv = new PrintMethodInfoVisitor(cw, flags);

            int parsingOptions = ClassReader.SKIP_DEBUG | ClassReader.SKIP_FRAMES;
            cr.accept(cv, parsingOptions);

            return cw.toByteArray();
        }

        return null;
    }
}
```

### Main.java

```java
package lsieun;

public class Main {
    public static void main(String[] args) {
        System.out.println("This is a Java Agent Jar");
    }
}
```

## Run

### LoadTimeInstrumentation.java

```java
package run;

import java.util.Formatter;

public class LoadTimeInstrumentation {
    public static void main(String[] args) {
        usage();
    }

    public static void usage() {
        String jarPath = PathManager.getJarPath();
        StringBuilder sb = new StringBuilder();
        Formatter fm = new Formatter(sb);
        fm.format("Usage:%n");
        fm.format("    java -javaagent:/path/to/TheAgent.jar sample.Program%n");
        fm.format("Example:%n");
        fm.format("    java -cp ./target/classes/ -javaagent:./target/TheAgent.jar sample.Program%n");
        fm.format("    java -cp ./target/classes/ -javaagent:%s sample.Program", jarPath);
        String result = sb.toString();
        System.out.println(result);
    }
}
```

### DynamicInstrumentation.java

```text
package run;

import com.sun.tools.attach.VirtualMachine;
import com.sun.tools.attach.VirtualMachineDescriptor;

import java.util.List;

public class DynamicInstrumentation {
    public static void main(String[] args) throws Exception {
        String agent = PathManager.getJarPath();
        System.out.println("Agent Path: " + agent);
        List<VirtualMachineDescriptor> vmds = VirtualMachine.list();
        for (VirtualMachineDescriptor vmd : vmds) {
            if (vmd.displayName().equals("sample.Program")) {
                VirtualMachine vm = VirtualMachine.attach(vmd.id());
                vm.getSystemProperties();
                System.out.println("Load Agent");
                vm.loadAgent(agent);
                System.out.println("Detach");
                vm.detach();
            }
        }
    }
}
```

### PathManager.java

```text
package run;

import java.io.File;
import java.net.URISyntaxException;

public class PathManager {
    public static String getJarPath() {
        String filepath = null;

        try {
            filepath = new File(PathManager.class.getProtectionDomain().getCodeSource().getLocation().toURI()).getPath();
        } catch (URISyntaxException ex) {
            ex.printStackTrace();
        }

        if (filepath == null || !filepath.endsWith(".jar")) {
            filepath = System.getProperty("user.dir") + File.separator + "target/TheAgent.jar";
        }

        return filepath.replace(File.separator, "/");
    }
}
```

### 生成 Jar 包和运行

生成 Jar 包：

```text
mvn clean package
```

上述命令执行完成之后，会在 `target` 文件夹下生成 `TheAgent.jar`，其内容如下：

```text
TheAgent.jar
├─── META-INF/MANIFEST.MF
├─── lsieun/agent/DynamicAgent.class
├─── lsieun/agent/LoadTimeAgent.class
├─── lsieun/asm/adapter/PrintMethodInfoStdAdapter.class
├─── lsieun/asm/cst/Const.class
├─── lsieun/asm/visitor/MethodInfo.class
├─── lsieun/asm/visitor/PrintMethodInfoVisitor.class
├─── lsieun/instrument/ASMTransformer.class
└─── lsieun/Main.class
```

运行 Load-Time Instrumentation：

```text
# 相对路径
$ java -cp ./target/classes/ -javaagent:./target/TheAgent.jar sample.Program

# 绝对路径（\\）
$ java -cp ./target/classes/ -javaagent:D:\\git-repo\\java-agent-maven\\target\\TheAgent.jar sample.Program

# 绝对路径（/）
$ java -cp ./target/classes/ -javaagent:D:/git-repo/java-agent-maven/target/TheAgent.jar sample.Program
```

运行 Dynamic Instrumentation：

```text
# Windows
$ java -cp "%JAVA_HOME%/lib/tools.jar";./target/classes/ run.DynamicInstrumentation

# Linux
$ java -cp "${JAVA_HOME}/lib/tools.jar":./target/classes/ run.DynamicInstrumentation

# MINGW64
$ java -cp "${JAVA_HOME}/lib/tools.jar"\;./target/classes/ run.DynamicInstrumentation
```

如果是 Java 9 及以上的版本，不需要引用 `tools.jar` 文件，可以直接运行：

```text
$ java -cp ./target/classes/ run.DynamicInstrumentation
```

## 总结

本文内容总结如下：

- 第一点，使用 Maven 会提供很大的方便，但是 Agent Jar 的核心三要素没有发生变化，包括 manifest、Agent Class 和 ClassFileTransformer，三者缺一不可。
- 第二点，使用 ASM 修改字节码（bytecode）的内容是属于 Java Agent 的“辅助部分”。如果我们熟悉其它的字节码操作类库（例如，Javassist、ByteBuddy），可以将 ASM 替换掉。
- 第三点，细节之处的把握。
  - 在 `pom.xml` 文件中，对 `${env.JAVA_HOME}/lib/tools.jar` 进行了依赖，是因为我们用到 `com.sun.tools.attach.VirtualMachine` 类。
  - 在 `pom.xml` 文件中，`maven-jar-plugin` 部分提供的与 manifest 相关的信息，会转换到 `META-INF/MANIFEST.MF` 文件中去。
