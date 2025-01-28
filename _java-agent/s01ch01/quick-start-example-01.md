---
title: "手工打包（一）：Load-Time Agent 打印加载的类"
sequence: "103"
---

[UP]({% link _java-agent/java-agent-01.md %})

## 预期目标

我们的预期目标：打印正在加载的类。

开发环境：

- JDK 版本：Java 8
- 编辑器：记事本（Windows）或 `vi`（Linux）

我们尽量使用简单的工具，来理解 Agent Jar 的生成过程。

代码目录结构：[Code](/assets/zip/java-agent-manual-01.zip)

```text
java-agent-manual-01
└─── src
     ├─── lsieun
     │    ├─── agent
     │    │    └─── LoadTimeAgent.java
     │    └─── instrument
     │         └─── InfoTransformer.java
     ├─── manifest.txt
     └─── sample
          ├─── HelloWorld.java
          └─── Program.java
```

做一些准备工作（`prepare01.sh`）：

```text
DIR=java-agent-manual-01
mkdir ${DIR} && cd ${DIR}

mkdir -p src/sample
touch src/sample/{HelloWorld.java,Program.java}

mkdir -p src/lsieun/{agent,instrument}
touch src/lsieun/agent/LoadTimeAgent.java
touch src/lsieun/instrument/InfoTransformer.java
touch src/manifest.txt
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
$ mkdir out
$ javac src/sample/*.java -d out/

# 查看编译结果
$ find ./out/ -type f
./out/sample/HelloWorld.class
./out/sample/Program.class
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

## Agent Jar

### manifest.txt

修改 `manifest.txt` 文件内容：

```text
Premain-Class: lsieun.agent.LoadTimeAgent

```

注意：在 `manifest.txt` 文件的结尾处有**一个空行**。(make sure the last line in the file is **a blank line**)

### LoadTimeAgent.java

```java
package lsieun.agent;

import lsieun.instrument.InfoTransformer;

import java.lang.instrument.ClassFileTransformer;
import java.lang.instrument.Instrumentation;

public class LoadTimeAgent {
    public static void premain(String agentArgs, Instrumentation inst) {
        System.out.println("Premain-Class: " + LoadTimeAgent.class.getName());
        ClassFileTransformer transformer = new InfoTransformer();
        inst.addTransformer(transformer);
    }
}
```

### InfoTransformer.java

```java
package lsieun.instrument;

import java.lang.instrument.ClassFileTransformer;
import java.lang.instrument.IllegalClassFormatException;
import java.security.ProtectionDomain;
import java.util.Formatter;

public class InfoTransformer implements ClassFileTransformer {
    @Override
    public byte[] transform(ClassLoader loader,
                            String className,
                            Class<?> classBeingRedefined,
                            ProtectionDomain protectionDomain,
                            byte[] classfileBuffer) throws IllegalClassFormatException {
        StringBuilder sb = new StringBuilder();
        Formatter fm = new Formatter(sb);
        fm.format("ClassName: %s%n", className);
        fm.format("    ClassLoader: %s%n", loader);
        fm.format("    ClassBeingRedefined: %s%n", classBeingRedefined);
        fm.format("    ProtectionDomain: %s%n", protectionDomain);
        System.out.println(sb.toString());

        return null;
    }
}
```

### 生成 Jar 包

编译：

```text
# 切换目录
$ cd java-agent-manual-01/

# 找到所有 .java 文件
$ find ./src/lsieun/ -name "*.java" > sources.txt
$ cat sources.txt
./src/lsieun/agent/LoadTimeAgent.java
./src/lsieun/transformer/InfoTransformer.java

# 进行编译
$ javac -d out/ @sources.txt
```

生成 Jar 包：

```text
# 复制 manifest.txt 文件
$ cp src/manifest.txt out/

# 切换目录
$ cd out/
$ ls
lsieun/  manifest.txt  sample/

# 进行打包（第一种方式）
            ┌─── f: TheAgent.jar
         ┌──┴──┐
$ jar -cvfm TheAgent.jar manifest.txt lsieun/
          └─────────┬────────┘
                    └─── m: manifest.txt
# 进行打包（第二种方式）
                   ┌─── f: TheAgent.jar
          ┌────────┴────────┐
$ jar -cvmf manifest.txt TheAgent.jar lsieun/
         └───┬──┘
             └─── m: manifest.txt
```

输出信息：

```text
$ jar -cvfm TheAgent.jar manifest.txt lsieun/
已添加清单
正在添加: lsieun/(输入 = 0) (输出 = 0)(存储了 0%)
正在添加: lsieun/agent/(输入 = 0) (输出 = 0)(存储了 0%)
正在添加: lsieun/agent/LoadTimeAgent.class(输入 = 503) (输出 = 309)(压缩了 38%)
正在添加: lsieun/instrument/(输入 = 0) (输出 = 0)(存储了 0%)
正在添加: lsieun/instrument/InfoTransformer.class(输入 = 1214) (输出 = 639)(压缩了 47%)
```

## 运行

在使用 `java` 命令时，我们可以通过使用 `-javaagent` 选项来使用 Agent Jar：

```text
$ java -javaagent:TheAgent.jar sample.Program
```

部分输出结果：

```text
...
ClassName: sample/Program
    ClassLoader: sun.misc.Launcher$AppClassLoader@18b4aac2
    ClassBeingRedefined: null
    ProtectionDomain: ProtectionDomain  (file:/D:/tmp/myAgent/java-agent-manual-01/out/ <no signer certificates>)
 sun.misc.Launcher$AppClassLoader@18b4aac2
 <no principals>
 java.security.Permissions@4aa298b7 (
 ("java.io.FilePermission" "\D:\tmp\myAgent\java-agent-manual-01\out\-" "read")
 ("java.lang.RuntimePermission" "exitVM")
)
...
```

另外，在使用 `java` 命令时，可以添加 `-verbose:class` 选项，它可以显示每个已加载类的信息。

```text
$ java -verbose:class sample.Program
```

## 总结

本文内容总结如下：

- 第一点，本文的主要目的是对 Java Agent 有一个整体的印象，因此不需要理解技术细节。
- 第二点，Agent Jar 当中有三个重要组成部分：manifest、Agent Class 和 ClassFileTransformer。
- 第三点，使用 `java` 命令加载 Agent Jar 时，需要使用 `-javaagent` 选项。
