---
title: "None Instrumentation"
sequence: "152"
---

## 设置 Property

有的时候，需要在命令行设置一些属性信息；当属性信息比较多的时候，命令行的内容就特别长。我们可以使用一个 Agent Jar 来设置这些属性信息。

### Application

```text
package sample;

public class Program {
    public static void main(String[] args) {
        String username = System.getProperty("lsieun.agent.username");
        String password = System.getProperty("lsieun.agent.password");
        System.out.println(username);
        System.out.println(password);
    }
}
```

### Agent Jar

```java
package lsieun.agent;

public class LoadTimeAgent {
    public static void premain(String agentArgs) {
        System.setProperty("lsieun.agent.username", "tomcat");
        System.setProperty("lsieun.agent.password", "123456");
    }
}
```

### Run

第一次运行：

```text
$ java -cp ./target/classes/ sample.Program

null
null
```

第二次运行：

```text
$ java -cp ./target/classes/ -Dlsieun.agent.username=jerry -Dlsieun.agent.password=12345 sample.Program

jerry
12345
```

第三次运行：

```text
$ java -cp ./target/classes/ -javaagent:./target/TheAgent.jar sample.Program

tomcat
123456
```

## 不打印信息

有的时候，程序当中有许多打印语句，但是我们并不想让它们输出。

### Application

```java
package sample;

import java.lang.management.ManagementFactory;
import java.util.concurrent.TimeUnit;

public class Program {
    public static void main(String[] args) throws Exception {
        // 第一步，打印进程 ID
        String nameOfRunningVM = ManagementFactory.getRuntimeMXBean().getName();
        System.out.println(nameOfRunningVM);

        // 第二步，倒计时退出
        int count = 600;
        for (int i = 0; i < count; i++) {
            String info = String.format("|%03d| %s remains %03d seconds", i, nameOfRunningVM, (count - i));
            System.out.println(info);

            TimeUnit.SECONDS.sleep(1);
        }
    }
}
```

### Agent Jar

```java
package lsieun.agent;

import java.io.PrintStream;

public class LoadTimeAgent {
    public static void premain(String agentArgs) {
        System.setOut(new PrintStream(System.out) {
            @Override
            public void println(String x) {
                // super.println("What are you doing: " + x);
            }
        });
    }
}
```

### Run

第一次运行：

```text
$ java -cp ./target/classes/ sample.Program

8472@LenovoWin7
|000| 8472@LenovoWin7 remains 600 seconds
|001| 8472@LenovoWin7 remains 599 seconds
```

第二次运行：（没有输出内容）

```text
$ java -cp ./target/classes/ -javaagent:./target/TheAgent.jar sample.Program

```

第三次运行：（取消注释）

```text
$ java -cp ./target/classes/ -javaagent:./target/TheAgent.jar sample.Program

What are you doing: 9072@LenovoWin7
What are you doing: |000| 9072@LenovoWin7 remains 600 seconds
What are you doing: |001| 9072@LenovoWin7 remains 599 seconds
```
