---
title: "Java Agent：通灵之术"
sequence: "101"
---

## 通灵之术

在《火影忍者》中，通灵之术，属于时空间忍术的一种。

![](/assets/images/manga/naruto/tsunade-summoning-jutsu.webp)

那么，“通灵之术”，在Java领域，代表什么意思呢？就是将正在运行的JVM当中的class进行导出。

![](/assets/images/java/agent/java-agent-dump-class.png)

本文的主要目的：借助于Java Agent将class文件从JVM当中导出。

场景应用：

- 第一个场景，两个不同版本的类。在开发环境（development），在类里面添加一个功能，测试之后，能够正常运行。到了生产环境（production），这个功能就是不正常。
  可能的一种情况，在线上的服务器上有两个版本的类文件，每次都会加载旧版本的类文件。这个时候，把JVM当中的类导出来看一看，到底是不是最新的版本。
- 第二个场景，破解软件。将某个类从JVM当中导出，然后修改，再提交给JVM进行redefine。

## 准备工作

开发环境：

- JDK版本：Java 8
- 开发工具：记事本或`vi`

创建文件目录结构：准备一个`prepare.sh`文件

```text
#!/bin/bash

mkdir -p application/{src,out}/sample/
touch application/src/sample/{HelloWorld.java,Program.java}

mkdir -p java-agent/{src,out}/
touch java-agent/src/{ClassDumpAgent.java,ClassDumpTransformer.java,ClassDumpUtils.java,manifest.txt}

mkdir -p tools-attach/{src,out}/
touch tools-attach/src/Attach.java
```

目录结构：（编译之前）

```text
java-agent-summoning-jutsu
├─── application
│    └─── src
│         └─── sample
│              ├─── HelloWorld.java
│              └─── Program.java
├─── java-agent
│    └─── src
│         ├─── ClassDumpAgent.java
│         ├─── ClassDumpTransformer.java
│         ├─── ClassDumpUtils.java
│         └─── manifest.txt
└─── tools-attach
     └─── src
          └─── Attach.java
```

目录结构：（编译之后）

```text
java-agent-summoning-jutsu
├─── application
│    ├─── out
│    │    └─── sample
│    │         ├─── HelloWorld.class
│    │         └─── Program.class
│    └─── src
│         └─── sample
│              ├─── HelloWorld.java
│              └─── Program.java
├─── java-agent
│    ├─── out
│    │    ├─── ClassDumpAgent.class
│    │    ├─── classdumper.jar
│    │    ├─── ClassDumpTransformer.class
│    │    ├─── ClassDumpUtils.class
│    │    └─── manifest.txt
│    └─── src
│         ├─── ClassDumpAgent.java
│         ├─── ClassDumpTransformer.java
│         ├─── ClassDumpUtils.java
│         └─── manifest.txt
└─── tools-attach
     ├─── out
     │    └─── Attach.class
     └─── src
          └─── Attach.java
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

### 编译和运行

进行编译：

```text
# 进行编译
$ cd application/
$ javac src/sample/*.java -d out/
```

运行结果：

```text
$ cd out/
$ java sample.Program
5556@LenovoWin7
|000| 5556@LenovoWin7 remains 600 seconds
a - b = 6
|001| 5556@LenovoWin7 remains 599 seconds
a - b = -4
...
```

## Java Agent

曾经有一篇文章《Retrieving .class files from a running app》，最初是发表在Sun公司的网站，后来转移到了Oracle的网站，再后来就从Oracle网站消失了。

Sometimes it is better to dump `.class` files of generated/modified classes for off-line debugging -
for example, we may want to view such classes using tools like [jclasslib](https://github.com/ingokegel/jclasslib).

![](/assets/images/manga/naruto/sasuke-summoning-jutsu-hawk.gif)

### 类

#### ClassDumpAgent

```java
import java.lang.instrument.Instrumentation;
import java.lang.instrument.UnmodifiableClassException;
import java.util.ArrayList;
import java.util.List;

/**
 * This is a java.lang.instrument agent to dump .class files
 * from a running Java application.
 */
public class ClassDumpAgent {
    public static void premain(String agentArgs, Instrumentation inst) {
        agentmain(agentArgs, inst);
    }

    public static void agentmain(String agentArgs, Instrumentation inst) {
        System.out.println("agentArgs: " + agentArgs);
        ClassDumpUtils.parseArgs(agentArgs);
        inst.addTransformer(new ClassDumpTransformer(), true);
        // by the time we are attached, the classes to be
        // dumped may have been loaded already.
        // So, check for candidates in the loaded classes.
        Class[] classes = inst.getAllLoadedClasses();
        List<Class> candidates = new ArrayList<>();
        for (Class c : classes) {
            String className = c.getName();

            // 第一步，排除法：不考虑JDK自带的类
            if (className.startsWith("java")) continue;
            if (className.startsWith("javax")) continue;
            if (className.startsWith("jdk")) continue;
            if (className.startsWith("sun")) continue;
            if (className.startsWith("com.sun")) continue;

            // 第二步，筛选法：只留下感兴趣的类（正则表达式匹配）
            boolean isModifiable = inst.isModifiableClass(c);
            boolean isCandidate = ClassDumpUtils.isCandidate(className);
            if (isModifiable && isCandidate) {
                candidates.add(c);
            }

            // 不重要：打印调试信息
            String message = String.format("[DEBUG] Loaded Class: %s ---> Modifiable: %s, Candidate: %s", className, isModifiable, isCandidate);
            System.out.println(message);
        }
        try {
            // 第三步，将具体的class进行dump操作
            // if we have matching candidates, then retransform those classes
            // so that we will get callback to transform.
            if (!candidates.isEmpty()) {
                inst.retransformClasses(candidates.toArray(new Class[0]));

                // 不重要：打印调试信息
                String message = String.format("[DEBUG] candidates size: %d", candidates.size());
                System.out.println(message);
            }
        }
        catch (UnmodifiableClassException ignored) {
        }
    }
}
```

#### ClassDumpTransformer

```java
import java.lang.instrument.ClassFileTransformer;
import java.security.ProtectionDomain;

public class ClassDumpTransformer implements ClassFileTransformer {

    public byte[] transform(ClassLoader loader,
                            String className,
                            Class redefinedClass,
                            ProtectionDomain protDomain,
                            byte[] classBytes) {
        // check and dump .class file
        if (ClassDumpUtils.isCandidate(className)) {
            ClassDumpUtils.dumpClass(className, classBytes);
        }

        // we don't mess with .class file, just return null
        return null;
    }

}
```

#### ClassDumpUtils

```java
import java.io.File;
import java.io.FileOutputStream;
import java.util.regex.Pattern;

public class ClassDumpUtils {
    // directory where we would write .class files
    private static String dumpDir;
    // classes with name matching this pattern will be dumped
    private static Pattern classes;

    // parse agent args of the form arg1=value1,arg2=value2
    public static void parseArgs(String agentArgs) {
        if (agentArgs != null) {
            String[] args = agentArgs.split(",");
            for (String arg : args) {
                String[] tmp = arg.split("=");
                if (tmp.length == 2) {
                    String name = tmp[0];
                    String value = tmp[1];
                    if (name.equals("dumpDir")) {
                        dumpDir = value;
                    }
                    else if (name.equals("classes")) {
                        classes = Pattern.compile(value);
                    }
                }
            }
        }
        if (dumpDir == null) {
            dumpDir = ".";
        }
        if (classes == null) {
            classes = Pattern.compile(".*");
        }
        System.out.println("[DEBUG] dumpDir: " + dumpDir);
        System.out.println("[DEBUG] classes: " + classes);
    }

    public static boolean isCandidate(String className) {
        // ignore array classes
        if (className.charAt(0) == '[') {
            return false;
        }
        // convert the class name to external name
        className = className.replace('/', '.');
        // check for name pattern match
        return classes.matcher(className).matches();
    }

    public static void dumpClass(String className, byte[] classBuf) {
        try {
            // create package directories if needed
            className = className.replace("/", File.separator);
            StringBuilder buf = new StringBuilder();
            buf.append(dumpDir);
            buf.append(File.separatorChar);
            int index = className.lastIndexOf(File.separatorChar);
            if (index != -1) {
                String pkgPath = className.substring(0, index);
                buf.append(pkgPath);
            }
            String dir = buf.toString();
            new File(dir).mkdirs();
            // write .class file
            String fileName = dumpDir + File.separator + className + ".class";
            FileOutputStream fos = new FileOutputStream(fileName);
            fos.write(classBuf);
            fos.close();
            System.out.println("[DEBUG] FileName: " + fileName);
        }
        catch (Exception ex) {
            ex.printStackTrace();
        }
    }

}
```

### manifest.txt

```text
Premain-Class: ClassDumpAgent
Agent-Class: ClassDumpAgent
Can-Redefine-Classes: true
Can-Retransform-Classes: true

```

注意：在结尾处添加一个空行。

### 编译和打包

第一步，进行编译：

```text
$ javac src/ClassDump*.java -d ./out
```

在Windows操作系统，如果遇到如下错误：

```text
错误: 编码GBK的不可映射字符
```

可以添加`-encoding`选项：

```text
javac -encoding UTF-8 src/ClassDump*.java -d ./out
```

第二步，生成Jar文件：

```text
$ cp src/manifest.txt out/
$ cd out/
$ jar -cvfm classdumper.jar manifest.txt ClassDump*.class
```

## Tools Attach

将一个Agent Jar与一个正在运行的Application建立联系，需要用到Attach机制：

```text
Agent Jar ---> Tools Attach ---> Application(JVM)
```

与Attach机制相关的类，定义在`tools.jar`文件：

```text
JDK_HOME/lib/tools.jar
```

### Attach

```java
import com.sun.tools.attach.VirtualMachine;

/**
 * Simple attach-on-demand client tool
 * that loads the given agent into the given Java process.
 */
public class Attach {
    public static void main(String[] args) throws Exception {
        if (args.length < 2) {
            System.out.println("usage: java Attach <pid> <agent-jar-full-path> [<agent-args>]");
            System.exit(1);
        }
        // JVM is identified by process id (pid).
        VirtualMachine vm = VirtualMachine.attach(args[0]);
        String agentArgs = (args.length > 2) ? args[2] : null;
        // load a specified agent onto the JVM
        vm.loadAgent(args[1], agentArgs);
        vm.detach();
    }
}
```

### 编译

```text
# 编译（Linux)
$ javac -cp "${JAVA_HOME}/lib/tools.jar":. src/Attach.java -d out/

# 编译（MINGW64)
$ javac -cp "${JAVA_HOME}/lib/tools.jar"\;. src/Attach.java -d out/

# 编译（Windows)
$ javac -cp "%JAVA_HOME%/lib/tools.jar";. src/Attach.java -d out/
```

### 运行

```text
# 运行（Linux)
java -cp "${JAVA_HOME}/lib/tools.jar":. Attach <pid> <full-path-of-classdumper.jar> dumpDir=<dir>,classes=<name-pattern>

# 运行（MINGW64)
java -cp "${JAVA_HOME}/lib/tools.jar"\;. Attach <pid> <full-path-of-classdumper.jar> dumpDir=<dir>,classes=<name-pattern>

# 运行（Windows)
java -cp "%JAVA_HOME%/lib/tools.jar";. Attach <pid> <full-path-of-classdumper.jar> dumpDir=<dir>,classes=<name-pattern>
```

示例：

```text
java -cp "${JAVA_HOME}/lib/tools.jar"\;. Attach <pid> \
D:/tmp/java-agent-summoning-jutsu/java-agent/out/classdumper.jar \
dumpDir=D:/tmp/java-agent-summoning-jutsu/dump,classes=sample\.HelloWorld
```

## 总结

本文内容总结如下：

- 第一点，主要功能。从功能的角度来讲，是如何从一个正在运行的JVM当中将某一个class文件导出的磁盘上。
- 第二点，实现方式。从实现方式上来说，是借助于Java Agent和正则表达式（区配类名）来实现功能。
- 第三点，注意事项。在Java 8的环境下，想要将Agent Jar加载到一个正在运行的JVM当中，需要用到`tools.jar`。

当然，将class文件从运行的JVM当中导出，只是Java Agent功能当中的一个小部分，想要更多的了解Java Agent的内容，可以学习《[Java Agent基础篇](https://ke.qq.com/course/4335150)》。

