---
title: "@SuperMethod"
sequence: "105"
---

## 介绍

@SuperMethod: This annotation can only be used on parameter types that are assignable from Method.

The assigned method is set to be a synthetic accessor method that allows for the invocation of the original code.

Note that using this annotation causes a public accessor to be created for the proxy class
that allows for the outside invocation of the super method without passing a security manager.


## 示例

### HelloWorld

```java
public class HelloWorld {
    public String test(String name, int age) {
        return String.format("HelloWorld: %s - %d", name, age);
    }
}
```

### HelloWorldRun

```java
public class HelloWorldRun {
    public static void main(String[] args) {
        HelloWorld instance = new HelloWorld();
        String msg = instance.test("Tom", 10);
        System.out.println(msg);
    }
}
```

### HardWorker

```java
import net.bytebuddy.implementation.bind.annotation.RuntimeType;
import net.bytebuddy.implementation.bind.annotation.SuperMethod;

import java.lang.reflect.Method;

public class HardWorker {
    @RuntimeType
    public static Object doWork(@SuperMethod Method method) {
        return String.format(
                "@SuperMethod: %s from %s",
                method.getName(),
                method.getDeclaringClass().getName()
        );
    }
}
```

### HelloWorldRebase

```java
import net.bytebuddy.ByteBuddy;
import net.bytebuddy.dynamic.DynamicType;
import net.bytebuddy.implementation.MethodDelegation;
import net.bytebuddy.matcher.ElementMatchers;

public class HelloWorldRebase {
    public static void main(String[] args) {
        // 1. prepare
        String className = "sample.HelloWorld";
        Class<?> clazz = ClassUtils.loadClass(className);


        // 2. weave
        ByteBuddy byteBuddy = new ByteBuddy();
        DynamicType.Builder<?> builder = byteBuddy.rebase(clazz);

        builder = builder.method(
                ElementMatchers.named("test")
        ).intercept(
                MethodDelegation.to(HardWorker.class)
        );


        // 3. output
        DynamicType.Unloaded<?> unloadedType = builder.make();
        OutputUtils.save(unloadedType, true);
    }
}
```

### Generated Class

```java
public class HelloWorld {
    private static final Method cachedValue$Xyz$ForTestMethod;

    static {
        cachedValue$Xyz$ForTestMethod = HelloWorld.class.getDeclaredMethod(
                "test$original$Abc$accessor$Xyz",
                String.class,
                Integer.TYPE
        );
    }
    
    public HelloWorld() {
    }

    public String test(String name, int age) {
        return (String)HardWorker.doWork(cachedValue$Xyz$ForTestMethod);
    }

    private String test$original$Abc(String name, int age) {
        return String.format("HelloWorld: %s - %d", name, age);
    }

    public final String test$original$Abc$accessor$Xyz(String name, int age) {
        return this.test$original$Abc(name, age);
    }
}
```

## 属性

### cached

```java
import net.bytebuddy.implementation.bind.annotation.RuntimeType;
import net.bytebuddy.implementation.bind.annotation.SuperMethod;

import java.lang.reflect.Method;

public class HardWorker {
    @RuntimeType
    public static Object doWork(@SuperMethod(cached = false) Method method) {
        return String.format(
                "@SuperMethod: %s from %s",
                method.getName(),
                method.getDeclaringClass().getName()
        );
    }
}
```

```java
public class HelloWorld {
    public String test(String name, int age) {
        return (String)HardWorker.doWork(
                HelloWorld.class.getDeclaredMethod(
                        "test$original$Abc$accessor$Xyz",
                        String.class,
                        Integer.TYPE
                )
        );
    }

    private String test$original$Abc(String name, int age) {
        return String.format("HelloWorld: %s - %d", name, age);
    }

    public final String test$original$Abc$accessor$Xyz(String name, int age) {
        return this.test$original$Abc(name, age);
    }
}
```

### privileged

```java
import net.bytebuddy.implementation.bind.annotation.RuntimeType;
import net.bytebuddy.implementation.bind.annotation.SuperMethod;

import java.lang.reflect.Method;

public class HardWorker {
    @RuntimeType
    public static Object doWork(@SuperMethod(privileged = true) Method method) {
        return String.format(
                "@SuperMethod: %s from %s",
                method.getName(),
                method.getDeclaringClass().getName()
        );
    }
}
```

```java
public class HelloWorld {
    private static final Method cachedValue$Xyz$ForTestMethod;

    static {
        cachedValue$Xyz$ForTestMethod = (Method)AccessController.doPrivileged(
                new HelloWorld$auxiliary$Proxy(
                        HelloWorld.class,
                        "test$original$Abc$accessor$Xyz",
                        new Class[]{String.class, Integer.TYPE}
                )
        );
    }

    public String test(String name, int age) {
        return (String)HardWorker.doWork(cachedValue$Xyz$ForTestMethod);
    }

    private String test$original$Abc(String name, int age) {
        return String.format("HelloWorld: %s - %d", name, age);
    }

    public final String test$original$Abc$accessor$Xyz(String name, int age) {
        return this.test$original$Abc(name, age);
    }
}
```

```java
class HelloWorld$auxiliary$Proxy implements PrivilegedExceptionAction {
    private Class type;
    private String name;
    private Class[] parameters;

    public HelloWorld$auxiliary$Proxy(Class type, String name, Class[] parameters) {
        this.type = type;
        this.name = name;
        this.parameters = parameters;
    }
    
    public Object run() throws Exception {
        return this.type.getDeclaredMethod(this.name, this.parameters);
    }
}
```

### fallbackToDefault

![](/assets/images/bytebuddy/delegation/bytebuddy-method-delegation-super-method-annotation-fallback-to-default.svg)


```java
public class Parent {
}
```

```java
public interface ITest {
    default String test(String name, int age) {
        return String.format("ITest: %s - %d", name, age);
    }
}
```

```java
public class HelloWorld extends Parent implements ITest {

    public String test(String name, int age) {
        return String.format("HelloWorld: %s - %d", name, age);
    }
}
```

```java
import net.bytebuddy.implementation.bind.annotation.RuntimeType;
import net.bytebuddy.implementation.bind.annotation.SuperMethod;

import java.lang.reflect.Method;

public class HardWorker {
    @RuntimeType
    public static Object doWork(@SuperMethod(fallbackToDefault = true) Method method) {
        return String.format(
                "@SuperMethod: %s from %s",
                method.getName(),
                method.getDeclaringClass().getName()
        );
    }
}
```

```java
import net.bytebuddy.ByteBuddy;
import net.bytebuddy.dynamic.DynamicType;
import net.bytebuddy.implementation.MethodDelegation;
import net.bytebuddy.matcher.ElementMatchers;

public class HelloWorldRedefine {
    public static void main(String[] args) {
        // 1. prepare
        String className = "sample.HelloWorld";
        Class<?> clazz = ClassUtils.loadClass(className);


        // 2. weave
        ByteBuddy byteBuddy = new ByteBuddy();
        DynamicType.Builder<?> builder = byteBuddy.redefine(clazz)
                .name(className);

        builder = builder.method(
                        ElementMatchers.named("test")
                )
                .intercept(
                        MethodDelegation.to(HardWorker.class)
                );


        // 3. output
        DynamicType.Unloaded<?> unloadedType = builder.make();
        OutputUtils.save(unloadedType, true);
    }
}
```

### nullIfImpossible

```java
public class HelloWorld {
    public String test(String name, int age) {
        return String.format("HelloWorld: %s - %d", name, age);
    }
}
```

```java
import net.bytebuddy.implementation.bind.annotation.RuntimeType;
import net.bytebuddy.implementation.bind.annotation.SuperMethod;

import java.lang.reflect.Method;

public class HardWorker {
    @RuntimeType
    public static Object doWork(@SuperMethod(nullIfImpossible = true) Method method) {
        if (method == null) {
            return "method is null";
        }

        return String.format(
                "@SuperMethod: %s from %s",
                method.getName(),
                method.getDeclaringClass().getName()
        );
    }
}
```

```java
import net.bytebuddy.ByteBuddy;
import net.bytebuddy.dynamic.DynamicType;
import net.bytebuddy.implementation.MethodDelegation;
import net.bytebuddy.matcher.ElementMatchers;

public class HelloWorldRedefine {
    public static void main(String[] args) {
        // 1. prepare
        String className = "sample.HelloWorld";
        Class<?> clazz = ClassUtils.loadClass(className);


        // 2. weave
        ByteBuddy byteBuddy = new ByteBuddy();
        DynamicType.Builder<?> builder = byteBuddy.redefine(clazz);    // 注意：这里是 redefine

        builder = builder.method(
                ElementMatchers.named("test")
        ).intercept(
                MethodDelegation.to(HardWorker.class)
        );


        // 3. output
        DynamicType.Unloaded<?> unloadedType = builder.make();
        OutputUtils.save(unloadedType, true);
    }
}
```

生成的 `HelloWorld.class`：

```java
public class HelloWorld {
    public String test(String name, int age) {
        return (String)HardWorker.doWork((Method)null);
    }
}
```
