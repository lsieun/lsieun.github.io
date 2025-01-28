---
title: "@StubValue"
sequence: "105"
---

## @StubValue

`@StubValue`: With this annotation, the annotated parameter is injected a stub value of the intercepted method.

For reference-return-types and `void` methods, the value `null` is injected.
For methods that return a primitive value, the equivalent boxing type of 0 is injected.

This can be helpful in combination when defining a generic interceptor that returns a `Object` type
while using a `@RuntimeType` annotation.

By returning the injected value, the method behaves as a stub while correctly considering primitive return types.

## 示例

```java
public class HelloWorld {

    public int testInt(String name, int age) {
        return 10;
    }

    public String testStr(String name, int age) {
        return "HelloWorld";
    }
}
```

```java
public class HelloWorldRun {
    public static void main(String[] args) {
        HelloWorld instance = new HelloWorld();
        int result1 = instance.testInt("Tom", 10);
        System.out.println("result1 = " + result1);

        String result2 = instance.testStr("Tom", 10);
        System.out.println("result2 = " + result2);
    }
}
```

```java
import net.bytebuddy.implementation.bind.annotation.RuntimeType;
import net.bytebuddy.implementation.bind.annotation.StubValue;

public class HardWorker {
    @RuntimeType
    public static Object doWork(@StubValue Object returnVal) {
        return returnVal;
    }
}
```

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
                // 注意：这里使用了 nameStartsWith
                ElementMatchers.nameStartsWith("test")
        ).intercept(
                MethodDelegation.to(HardWorker.class)
        );


        // 3. output
        DynamicType.Unloaded<?> unloadedType = builder.make();
        OutputUtils.save(unloadedType, true);
    }
}
```



```java
public class HelloWorld {
    public HelloWorld() {
    }

    public int testInt(String var1, int var2) {
        return (Integer)HardWorker.doWork(0);
    }

    private int testInt$original$TWCZm6V6(String name, int age) {
        return 10;
    }

    public String testStr(String var1, int var2) {
        return (String)HardWorker.doWork((Object)null);
    }

    private String testStr$original$TWCZm6V6(String name, int age) {
        return "HelloWorld";
    }
}
```

