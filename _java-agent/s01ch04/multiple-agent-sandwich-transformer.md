---
title: "Multiple Agents: Sandwich"
sequence: "154"
---

## 三明治

在数学的概念当中，有一个迫敛定理或三明治定理（英文：Squeeze Theorem、Sandwich Theorem），可以帮助我们确定某一点的函数值到底是多少：

![](/assets/images/java/agent/sandwich-theorem.png)

这种“三明治”思路可以应用到 Multiple Agents 当中，这样我们就可以检测某一个 Agent Jar 修改了什么内容。

但是，需要注意的一点是：属于同一组的 transformer 才能进行这种“三明治”操作

- 同属于 retransformation incapable transformer，
- 同属于 retransformation capable transformer。

## 示例

### Agent Jar 1

#### LoadTimeAgent

```java
package lsieun.agent;

import lsieun.instrument.*;
import lsieun.utils.*;

import java.lang.instrument.ClassFileTransformer;
import java.lang.instrument.Instrumentation;

public class LoadTimeAgent {
    public static void premain(String agentArgs, Instrumentation inst) {
        // 第一步，打印信息：agentArgs, inst, classloader, thread
        PrintUtils.printAgentInfo(LoadTimeAgent.class, "Premain-Class", agentArgs, inst);

        // 第二步，解析参数：agentArgs
        boolean flag = Boolean.parseBoolean(agentArgs);

        // 第三步，使用 inst：添加 transformer
        ClassFileTransformer transformer = new SandwichTransformer(flag);
        inst.addTransformer(transformer, false);
    }
}
```

#### SandwichTransformer

```java
package lsieun.instrument;

import lsieun.utils.DateUtils;
import lsieun.utils.DumpUtils;

import java.lang.instrument.ClassFileTransformer;
import java.lang.instrument.IllegalClassFormatException;
import java.security.ProtectionDomain;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;

public class SandwichTransformer implements ClassFileTransformer {
    private final boolean compare;

    public SandwichTransformer(boolean compare) {
        this.compare = compare;
    }

    @Override
    public byte[] transform(ClassLoader loader,
                            String className,
                            Class<?> classBeingRedefined,
                            ProtectionDomain protectionDomain,
                            byte[] classfileBuffer) throws IllegalClassFormatException {
        if (!compare) {
            addClass(className, classfileBuffer);
        }
        else {
            compareClass(className, classfileBuffer);
        }
        return null;
    }


    private static final Map<String, byte[]> map = new HashMap<>();

    private static void addClass(String className, byte[] bytes) {
        map.put(className, bytes);
    }

    private static void compareClass(String className, byte[] bytes) {
        byte[] origin_bytes = map.get(className);
        if (origin_bytes == null) return;
        boolean isEqual = Arrays.equals(origin_bytes, bytes);
        if (isEqual) {
            map.remove(className);
            return;
        }

        String newName = className.replace('/', '.');
        String dateStr = DateUtils.getTimeStamp();
        String filenameA = String.format("%s.%s.%s.class", newName, dateStr, "A");
        String filenameB = String.format("%s.%s.%s.class", newName, dateStr, "B");
        DumpUtils.dump(filenameA, origin_bytes);
        DumpUtils.dump(filenameB, bytes);
        System.out.println("Diff: " + filenameA);
        System.out.println("Diff: " + filenameB);
    }
}
```

### Agent Jar 2

#### TemplateAgent

```java
package lsieun.agent;

import lsieun.utils.PrintUtils;
import lsieun.utils.TransformerUtils;

import java.lang.instrument.ClassFileTransformer;
import java.lang.instrument.Instrumentation;

public class TemplateAgent {
    public static void premain(String agentArgs, Instrumentation inst) throws InterruptedException {
        // 第一步，打印信息：agentArgs, inst, classloader, thread
        PrintUtils.printAgentInfo(TemplateAgent.class, "Premain-Class", agentArgs, inst);

        // 第二步，指明要处理的类
        TransformerUtils.internalName = "sample/HelloWorld";

        // 第三步，使用 inst：添加 transformer
        ClassFileTransformer transformer = TransformerUtils::enterMethod;
        inst.addTransformer(transformer, false);
    }

    public static void agentmain(String agentArgs, Instrumentation inst) throws InterruptedException {
        // 第一步，打印信息：agentArgs, inst, classloader, thread
        PrintUtils.printAgentInfo(TemplateAgent.class, "Agent-Class", agentArgs, inst);
    }
}
```

### Run

```text
$ java -cp ./target/classes/ \
  -javaagent:./target/TheAgent.jar=false \
  -javaagent:./target/TemplateAgent001.jar \
  -javaagent:./target/TheAgent.jar=true \
  sample.Program
  
========= ========= ========= SEPARATOR ========= ========= =========
Agent Class Info:
    (1) Premain-Class: lsieun.agent.LoadTimeAgent
    (2) agentArgs: false
    (3) Instrumentation: sun.instrument.InstrumentationImpl@1704856573
    (4) Can-Redefine-Classes: true
    (5) Can-Retransform-Classes: true
    (6) Can-Set-Native-Method-Prefix: true
    (7) Thread Id: main@1(false)
    (8) ClassLoader: sun.misc.Launcher$AppClassLoader@18b4aac2
========= ========= ========= SEPARATOR ========= ========= =========

========= ========= ========= SEPARATOR ========= ========= =========
Agent Class Info:
    (1) Premain-Class: lsieun.agent.TemplateAgent001
    (2) agentArgs: null
    (3) Instrumentation: sun.instrument.InstrumentationImpl@21685669
    (4) Can-Redefine-Classes: true
    (5) Can-Retransform-Classes: true
    (6) Can-Set-Native-Method-Prefix: true
    (7) Thread Id: main@1(false)
    (8) ClassLoader: sun.misc.Launcher$AppClassLoader@18b4aac2
========= ========= ========= SEPARATOR ========= ========= =========

========= ========= ========= SEPARATOR ========= ========= =========
Agent Class Info:
    (1) Premain-Class: lsieun.agent.LoadTimeAgent
    (2) agentArgs: true
    (3) Instrumentation: sun.instrument.InstrumentationImpl@764977973
    (4) Can-Redefine-Classes: true
    (5) Can-Retransform-Classes: true
    (6) Can-Set-Native-Method-Prefix: true
    (7) Thread Id: main@1(false)
    (8) ClassLoader: sun.misc.Launcher$AppClassLoader@18b4aac2
========= ========= ========= SEPARATOR ========= ========= =========

10012@LenovoWin7
|000| 10012@LenovoWin7 remains 600 seconds
transform class: sample/HelloWorld
file:///D:\git-repo\learn-java-agent\dump\sample.HelloWorld.2022.02.03.04.14.09.089.A.class
file:///D:\git-repo\learn-java-agent\dump\sample.HelloWorld.2022.02.03.04.14.09.089.B.class
```

## 总结

本文内容总结如下：

- 第一点，通过“三明治”的方式，我们可以检测某一个 Agent Jar 做了哪些修改。
- 第二点，使用“三明治”的方式，要注意 transformer 属于同一组当中。
