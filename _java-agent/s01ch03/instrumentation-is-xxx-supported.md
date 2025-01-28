---
title: "Instrumentation.isXxxSupported()"
sequence: "132"
---

[UP]({% link _java-agent/java-agent-01.md %})

## isXxxSupported()

```java
public interface Instrumentation {
    boolean isRedefineClassesSupported();
    boolean isRetransformClassesSupported();
    boolean isNativeMethodPrefixSupported();
}
```

- `boolean isRedefineClassesSupported()`: Returns whether or not the current JVM configuration supports **redefinition of classes**.
  - The ability to redefine an already loaded class is an optional capability of a JVM.
  - Redefinition will only be supported if the `Can-Redefine-Classes` manifest attribute is set to `true` in the agent JAR file and the JVM supports this capability.
  - During a single instantiation of a single JVM, multiple calls to this method will always return the same answer.
- `boolean isRetransformClassesSupported()`: Returns whether or not the current JVM configuration supports **retransformation of classes**.
  - The ability to retransform an already loaded class is an optional capability of a JVM.
  - Retransformation will only be supported if the `Can-Retransform-Classes` manifest attribute is set to `true` in the agent JAR file and the JVM supports this capability.
  - During a single instantiation of a single JVM, multiple calls to this method will always return the same answer.
- `boolean isNativeMethodPrefixSupported()`: Returns whether the current JVM configuration supports **setting a native method prefix**.
  - The ability to set a native method prefix is an optional capability of a JVM.
  - Setting a native method prefix will only be supported if the `Can-Set-Native-Method-Prefix` manifest attribute is set to `true` in the agent JAR file and the JVM supports this capability.
  - During a single instantiation of a single JVM, multiple calls to this method will always return the same answer.

小总结：

- 第一，判断 JVM 是否支持该功能。
- 第二，判断 Java Agent Jar 内的 `MANIFEST.MF` 文件里的属性是否为 `true`。
- 第三，在一个 JVM 实例当中，多次调用某个 `isXxxSupported()` 方法，该方法的返回值是不会改变的。

## 示例

### LoadTimeAgent.java

```text
package lsieun.agent;

import java.lang.instrument.Instrumentation;

public class LoadTimeAgent {
    public static void premain(String agentArgs, Instrumentation inst) {
        System.out.println("Premain-Class: " + LoadTimeAgent.class.getName());
        System.out.println("Can-Redefine-Classes: " + inst.isRedefineClassesSupported());
        System.out.println("Can-Retransform-Classes: " + inst.isRetransformClassesSupported());
        System.out.println("Can-Set-Native-Method-Prefix: " + inst.isNativeMethodPrefixSupported());
    }
}
```

### 运行

在 `pom.xml` 文件中，`maven-jar-plugin` 处可以设置 `Can-Redefine-Classes`、`Can-Retransform-Classes` 和 `Can-Set-Native-Method-Prefix` 属性。

第一次测试时，将三个属性设置为 `true`：

```text
<manifestEntries>
    <Premain-Class>lsieun.agent.LoadTimeAgent</Premain-Class>
    <Agent-Class>lsieun.agent.DynamicAgent</Agent-Class>
    <Can-Redefine-Classes>true</Can-Redefine-Classes>
    <Can-Retransform-Classes>true</Can-Retransform-Classes>
    <Can-Set-Native-Method-Prefix>true</Can-Set-Native-Method-Prefix>
</manifestEntries>
```

第二次测试时，将三个属性设置为 `false`：

```text
<manifestEntries>
    <Premain-Class>lsieun.agent.LoadTimeAgent</Premain-Class>
    <Agent-Class>lsieun.agent.DynamicAgent</Agent-Class>
    <Can-Redefine-Classes>false</Can-Redefine-Classes>
    <Can-Retransform-Classes>false</Can-Retransform-Classes>
    <Can-Set-Native-Method-Prefix>false</Can-Set-Native-Method-Prefix>
</manifestEntries>
```

每次测试之前，都需要重新生成 `.jar` 文件：

```text
mvn clean package
```

第一次运行，将三个属性设置成 `true`，示例输出：

```text
$ java -cp ./target/classes/ -javaagent:./target/TheAgent.jar sample.Program
Premain-Class: lsieun.agent.LoadTimeAgent
Can-Redefine-Classes: true
Can-Retransform-Classes: true
Can-Set-Native-Method-Prefix: true
```

第二次运行，将三个属性设置成 `false`，示例输出：

```text
$ java -cp ./target/classes/ -javaagent:./target/TheAgent.jar sample.Program
Premain-Class: lsieun.agent.LoadTimeAgent
Can-Redefine-Classes: false
Can-Retransform-Classes: false
Can-Set-Native-Method-Prefix: false
```

## 总结

本文内容总结如下：

- 第一点，判断某一个 `isXxxSupported()` 方法是否为 `true`，需要考虑两个因素：
  - 判断 JVM 是否支持该功能。
  - 判断 Agent.jar 内的 `MANIFEST.MF` 文件里的属性是否为 `true`。
- 第二点，在一个 JVM 实例当中，多次调用某个 `isXxxSupported()` 方法，该方法的返回值是不会改变的。
