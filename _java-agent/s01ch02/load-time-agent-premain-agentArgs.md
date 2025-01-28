---
title: "Load-Time: agentArgs 参数"
sequence: "111"
---

[UP]({% link _java-agent/java-agent-01.md %})

首先，我们需要注意：并不是所有的虚拟机，都支持从 command line 启动 Java Agent。

An implementation is not required to provide a way to start agents from the command-line interface.
[Link](https://docs.oracle.com/javase/8/docs/api/java/lang/instrument/package-summary.html)

> 问题：当前的 JVM implementation 是否支持从 command line 启动 Java Agent？ 回答：一般都支持

其次，如何在 command-line 为 Agent Jar 添加参数信息呢？

## 命令行启动

### Command-Line

从命令行启动 Java Agent 需要使用 `-javagent` 选项：

```text
-javaagent:jarpath[=options]
```

- `jarpath` is the path to the agent JAR file.
- `options` is the agent options.

```text
                                                  ┌─── -javaagent:jarpath
                             ┌─── Command-Line ───┤
                             │                    └─── -javaagent:jarpath=options
Load-Time Instrumentation ───┤
                             │                    ┌─── MANIFEST.MF - Premain-Class: lsieun.agent.LoadTimeAgent
                             └─── Agent Jar ──────┤
                                                  └─── Agent Class - premain(String agentArgs, Instrumentation inst)
```

示例：

```text
java -cp ./target/classes/ -javaagent:./target/TheAgent.jar=this-is-a-long-message sample.Program
```

### Agent Jar

在 `TheAgent.jar` 中，依据 `META-INF/MANIFEST.MF` 里定义 `Premain-Class` 属性找到 Agent Class:

```text
Premain-Class: lsieun.agent.LoadTimeAgent

```

The agent is passed its agent `options` via the `agentArgs` parameter.

```java
public class LoadTimeAgent {
    public static void premain(String agentArgs, Instrumentation inst) {
        // ...
    }
}
```

The agent `options` are passed as a single string, any additional parsing should be performed by the agent itself.

![](/assets/images/java/agent/java-agent-command-line-options.png)

## 示例一：读取 agentArgs

### LoadTimeAgent.java

```java
package lsieun.agent;

import java.lang.instrument.Instrumentation;

public class LoadTimeAgent {
    public static void premain(String agentArgs, Instrumentation inst) {
        System.out.println("Premain-Class: " + LoadTimeAgent.class.getName());
        System.out.println("agentArgs: " + agentArgs);
        System.out.println("Instrumentation Class: " + inst.getClass().getName());
    }
}
```

### 运行

每次修改代码之后，都需要重新生成 `.jar` 文件：

```text
mvn clean package
```

获取示例命令：

```text
$ cd learn-java-agent

$ java -jar ./target/TheAgent.jar
Load-Time Usage:
    java -javaagent:/path/to/TheAgent.jar sample.Program
Example:
    java -cp ./target/classes/ sample.Program
    java -cp ./target/classes/ -javaagent:./target/TheAgent.jar sample.Program
```

第一次运行，在使用 `-javagent` 选项时不添加 `options` 信息：

```text
$ java -cp ./target/classes/ -javaagent:./target/TheAgent.jar sample.Program
Premain-Class: lsieun.agent.LoadTimeAgent
agentArgs: null
Instrumentation Class: sun.instrument.InstrumentationImpl
```

从上面的输出结果中，我们可以看到：

- 第一点，`agentArgs` 的值为 `null`。
- 第二点，`Instrumentation` 是一个接口，它的具体实现是 `sun.instrument.InstrumentationImpl` 类。

第二次运行，在使用 `-javagent` 选项时添加 `options` 信息：

```text
$ java -cp ./target/classes/ -javaagent:./target/TheAgent.jar=this-is-a-long-message sample.Program
Premain-Class: lsieun.agent.LoadTimeAgent
agentArgs: this-is-a-long-message
Instrumentation Class: sun.instrument.InstrumentationImpl
```

## 示例二：解析 agentArgs

我们传入的信息，一般情况下是 `key-value` 的形式，有人喜欢用 `:` 分隔，有人喜欢用 `=` 分隔：

```text
username:tomcat,password:123456
username=tomcat,password=123456
```

### LoadTimeAgent.java

```text
package lsieun.agent;

import java.lang.instrument.Instrumentation;

public class LoadTimeAgent {
    public static void premain(String agentArgs, Instrumentation inst) {
        System.out.println("Premain-Class: " + LoadTimeAgent.class.getName());
        System.out.println("agentArgs: " + agentArgs);
        System.out.println("Instrumentation Class: " + inst.getClass().getName());

        if (agentArgs != null) {
            String[] array = agentArgs.split(",");
            int length = array.length;
            for (int i = 0; i < length; i++) {
                String item = array[i];
                String[] key_value_pair = getKeyValuePair(item);

                String key = key_value_pair[0];
                String value = key_value_pair[1];

                String line = String.format("|%03d| %s: %s", i, key, value);
                System.out.println(line);
            }
        }
    }

    private static String[] getKeyValuePair(String str) {
        {
            int index = str.indexOf("=");
            if (index != -1) {
                return str.split("=", 2);
            }
        }

        {
            int index = str.indexOf(":");
            if (index != -1) {
                return str.split(":", 2);
            }
        }
        return new String[]{str, ""};
    }
}
```

### 运行

第一次运行，使用 `:` 分隔：

```text
$ java -cp ./target/classes/ -javaagent:./target/TheAgent.jar=username:tomcat,password:123456 sample.Program
Premain-Class: lsieun.agent.LoadTimeAgent
agentArgs: username:tomcat,password:123456
Instrumentation Class: sun.instrument.InstrumentationImpl
|000| username: tomcat
|001| password: 123456
```

第二次运行，使用 `=` 分隔：

```text
$ java -cp ./target/classes/ -javaagent:./target/TheAgent.jar=username=jerry,password=12345 sample.Program
Premain-Class: lsieun.agent.LoadTimeAgent
agentArgs: username=jerry,password=12345
Instrumentation Class: sun.instrument.InstrumentationImpl
|000| username: jerry
|001| password: 12345
```

## 总结

本文内容总结如下：

- 第一点，在命令行启动 Java Agent，需要使用 `-javaagent:jarpath[=options]` 选项，其中的 `options` 信息会转换成为 `premain` 方法的 `agentArgs` 参数。
- 第二点，对于 `agentArgs` 参数的进一步解析，需要由我们自己来完成。
