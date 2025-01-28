---
title: "Load-Time: inst 参数"
sequence: "112"
---

[UP]({% link _java-agent/java-agent-01.md %})

在 `LoadTimeAgent` 类当中，有一个 `premain` 方法，我们关注两个问题：

- 第一个问题，`Instrumentation` 是一个接口，它的具体实现是哪个类？
- 第二个问题，是“谁”调用了 `LoadTimeAgent.premain()` 方法的呢？

```text
public static void premain(String agentArgs, Instrumentation inst)
```

## 查看 StackTrace

### LoadTimeAgent

```java
package lsieun.agent;

import java.lang.instrument.Instrumentation;

public class LoadTimeAgent {
    public static void premain(String agentArgs, Instrumentation inst) {
        System.out.println("Premain-Class: " + LoadTimeAgent.class.getName());
        System.out.println("agentArgs: " + agentArgs);
        System.out.println("Instrumentation Class: " + inst.getClass().getName());

        Exception ex = new Exception("Exception from LoadTimeAgent");
        ex.printStackTrace(System.out);
    }
}
```

### 运行

```text
$ java -cp ./target/classes/ -javaagent:./target/TheAgent.jar sample.Program
Premain-Class: lsieun.agent.LoadTimeAgent
agentArgs: null
Instrumentation Class: sun.instrument.InstrumentationImpl
java.lang.Exception: Exception from LoadTimeAgent
        at lsieun.agent.LoadTimeAgent.premain(LoadTimeAgent.java:11)
        at sun.reflect.NativeMethodAccessorImpl.invoke0(Native Method)
        at sun.reflect.NativeMethodAccessorImpl.invoke(NativeMethodAccessorImpl.java:62)
        at sun.reflect.DelegatingMethodAccessorImpl.invoke(DelegatingMethodAccessorImpl.java:43)
        at java.lang.reflect.Method.invoke(Method.java:498)
        at sun.instrument.InstrumentationImpl.loadClassAndStartAgent(InstrumentationImpl.java:386)
        at sun.instrument.InstrumentationImpl.loadClassAndCallPremain(InstrumentationImpl.java:401)

```

从上面的输出结果中，可以看到 `InstrumentationImpl.loadClassAndCallPremain` 方法。

## InstrumentationImpl

`sun.instrument.InstrumentationImpl` 实现了 `java.lang.instrument.Instrumentation` 接口：

```java
public class InstrumentationImpl implements Instrumentation {
}
```

### loadClassAndCallPremain

在 `sun.instrument.InstrumentationImpl` 类当中，`loadClassAndCallPremain` 方法的实现非常简单，它直接调用了 `loadClassAndStartAgent` 方法：

```java
public class InstrumentationImpl implements Instrumentation {
    private void loadClassAndCallPremain(String classname, String optionsString) throws Throwable {
        loadClassAndStartAgent(classname, "premain", optionsString);
    }
}
```

### loadClassAndCallAgentmain

```java
public class InstrumentationImpl implements Instrumentation {
    private void loadClassAndCallAgentmain(String classname, String optionsString) throws Throwable {
        loadClassAndStartAgent(classname, "agentmain", optionsString);
    }
}
```

### loadClassAndStartAgent

在 `sun.instrument.InstrumentationImpl` 类当中，`loadClassAndStartAgent` 方法的作用就是通过 Java 反射的机制来对 `premain` 或 `agentmain` 方法进行调用。

在 `loadClassAndStartAgent` 源码中，我们能够看到更多的细节信息：

- 第一步，从自身的方法定义中，去寻找目标方法：先找带有两个参数的方法；如果没有找到，则找带有一个参数的方法。如果第一步没有找到，则进行第二步。
- 第二步，从父类的方法定义中，去寻找目标方法：先找带有两个参数的方法；如果没有找到，则找带有一个参数的方法。

```java
public class InstrumentationImpl implements Instrumentation {
    // Attempt to load and start an agent
    private void loadClassAndStartAgent(String classname, String methodname, String optionsString) throws Throwable {

        ClassLoader mainAppLoader = ClassLoader.getSystemClassLoader();
        Class<?> javaAgentClass = mainAppLoader.loadClass(classname);

        Method m = null;
        NoSuchMethodException firstExc = null;
        boolean twoArgAgent = false;

        // The agent class must have a premain or agentmain method that
        // has 1 or 2 arguments. We check in the following order:
        //
        // 1) declared with a signature of (String, Instrumentation)
        // 2) declared with a signature of (String)
        // 3) inherited with a signature of (String, Instrumentation)
        // 4) inherited with a signature of (String)
        //
        // So the declared version of either 1-arg or 2-arg always takes
        // primary precedence over an inherited version. After that, the
        // 2-arg version takes precedence over the 1-arg version.
        //
        // If no method is found then we throw the NoSuchMethodException
        // from the first attempt so that the exception text indicates
        // the lookup failed for the 2-arg method (same as JDK5.0).

        try {
            m = javaAgentClass.getDeclaredMethod(methodname,
                    new Class<?>[]{
                            String.class,
                            java.lang.instrument.Instrumentation.class
                    }
            );
            twoArgAgent = true;
        } catch (NoSuchMethodException x) {
            // remember the NoSuchMethodException
            firstExc = x;
        }

        if (m == null) {
            // now try the declared 1-arg method
            try {
                m = javaAgentClass.getDeclaredMethod(methodname, new Class<?>[]{String.class});
            } catch (NoSuchMethodException x) {
                // ignore this exception because we'll try
                // two arg inheritance next
            }
        }

        if (m == null) {
            // now try the inherited 2-arg method
            try {
                m = javaAgentClass.getMethod(methodname,
                        new Class<?>[]{
                                String.class,
                                java.lang.instrument.Instrumentation.class
                        }
                );
                twoArgAgent = true;
            } catch (NoSuchMethodException x) {
                // ignore this exception because we'll try
                // one arg inheritance next
            }
        }

        if (m == null) {
            // finally try the inherited 1-arg method
            try {
                m = javaAgentClass.getMethod(methodname, new Class<?>[]{String.class});
            } catch (NoSuchMethodException x) {
                // none of the methods exists so we throw the
                // first NoSuchMethodException as per 5.0
                throw firstExc;
            }
        }

        // the premain method should not be required to be public,
        // make it accessible so we can call it
        // Note: The spec says the following:
        //     The agent class must implement a public static premain method...
        setAccessible(m, true);

        // invoke the 1 or 2-arg method
        if (twoArgAgent) {
            m.invoke(null, new Object[]{optionsString, this});
        }
        else {
            m.invoke(null, new Object[]{optionsString});
        }

        // don't let others access a non-public premain method
        setAccessible(m, false);
    }
}
```

## 总结

本文内容总结如下：

- 第一点，在 `premain` 方法中，`Instrumentation` 接口的具体实现是 `sun.instrument.InstrumentationImpl` 类。
- 第二点，查看 Stack Trace，可以看到 `sun.instrument.InstrumentationImpl.loadClassAndCallPremain` 方法对 `LoadTimeAgent.premain` 方法进行了调用。







