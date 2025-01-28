---
title: "Instrumentation.redefineModule()"
sequence: "141"
---

## redefineModule

```java
public interface Instrumentation {
    boolean isModifiableModule(Module module);
    void redefineModule (Module module,
                         Set<Module> extraReads,
                         Map<String, Set<Module>> extraExports,
                         Map<String, Set<Module>> extraOpens,
                         Set<Class<?>> extraUses,
                         Map<Class<?>, List<Class<?>>> extraProvides);
}
```

- `isModifiableModule`: Tests whether a module can be modified with `redefineModule`.
- `redefineModule`: Redefine a module to expand the set of modules that it reads, the set of packages that it exports or opens, or the services that it uses or provides.

## 示例

### Application

```java
package sample;

import java.lang.instrument.Instrumentation;

public class Program {
    public static void main(String[] args) {
        Module baseModule = Object.class.getModule();
        Module instrumentModule = Instrumentation.class.getModule();

        boolean canRead = baseModule.canRead(instrumentModule);
        String message = String.format("%s can read %s: %s", baseModule.getName(), instrumentModule.getName(), canRead);
        System.out.println(message);
    }
}
```

### Agent Jar

```java
package lsieun.agent;

import java.lang.instrument.Instrumentation;
import java.util.Map;
import java.util.Set;

public class LoadTimeAgent {
    public static void premain(String agentArgs, Instrumentation inst) {
        // 第一步，打印信息
        System.out.println("Premain-Class: " + LoadTimeAgent.class.getName());
        System.out.println("Can-Redefine-Classes: " + inst.isRedefineClassesSupported());
        System.out.println("Can-Retransform-Classes: " + inst.isRetransformClassesSupported());
        System.out.println("Can-Set-Native-Method-Prefix: " + inst.isNativeMethodPrefixSupported());
        System.out.println("========= ========= =========");

        // 第二步，判断一个 module 是否可以读取另一个 module
        Module baseModule = Object.class.getModule();
        Module instrumentModule = Instrumentation.class.getModule();
        boolean canRead = baseModule.canRead(instrumentModule);

        // 第三步，使用 inst：修改 module 权限
        if (!canRead && inst.isModifiableModule(baseModule)) {
            Set<Module> extraReads = Set.of(instrumentModule);
            inst.redefineModule(baseModule, extraReads, Map.of(), Map.of(), Set.of(), Map.of());
        }
    }
}
```

### Run

#### None

```text
$ java -cp ./target/classes/ sample.Program
java.base can read java.instrument: false
```

#### Load-Time

```text
$ java -cp ./target/classes/ -javaagent:./target/TheAgent.jar sample.Program
Premain-Class: lsieun.agent.LoadTimeAgent
Can-Redefine-Classes: true
Can-Retransform-Classes: true
Can-Set-Native-Method-Prefix: true
========= ========= =========
java.base can read java.instrument: true
```

## 总结

本文内容总结如下：

- 第一点， `redefineModule` 方法的作用是对 module 的访问权限进行修改，该方法是在 Java 9 引入的。
