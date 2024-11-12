---
title: "@Advice.AllArguments"
sequence: "102"
---

## 介绍

### 作用

`@Advice.AllArguments` 作用：将方法的『所有参数』映射成一个『数组』。

### 注意事项

- 参数类型：必须是『数组类型』（array type）

## 示例

### includeSelf

```java
import java.nio.charset.StandardCharsets;
import java.util.Base64;

public class HelloWorld {
    public void test(String name, int age, Object obj) {
        String msg = String.format("HelloWorld - %s - %d - %s", name, age, obj);
        byte[] bytes = msg.getBytes(StandardCharsets.UTF_8);
        String base64Str = Base64.getEncoder().encodeToString(bytes);
        System.out.println(base64Str);
    }
}
```

```java
import net.bytebuddy.asm.Advice;

public class Expert {

    @Advice.OnMethodEnter
    static void methodAbc(@Advice.AllArguments(includeSelf = true) Object[] allArgs) {
        System.out.println("方法进入");

        // args length
        int length = allArgs.length;
        String argsLength = String.format("    allArgs.length: %s", length);
        System.out.println(argsLength);

        // args[i]
        for (int i = 0; i < length; i++) {
            Object val = allArgs[i];
            String argInfo = String.format("    allArgs[%d]: %s", i, val);
            System.out.println(argInfo);
        }
    }

    @Advice.OnMethodExit
    static void methodXyz() {
        System.out.println("方法退出");
    }
}
```

```java
import net.bytebuddy.ByteBuddy;
import net.bytebuddy.asm.Advice;
import net.bytebuddy.dynamic.DynamicType;
import net.bytebuddy.matcher.ElementMatchers;

public class HelloWorldRedefine {
    public static void main(String[] args) {
        // 1. prepare
        String className = "sample.HelloWorld";
        Class<?> clazz = ClassUtils.loadClass(className);


        // 2. weave
        ByteBuddy byteBuddy = new ByteBuddy();
        DynamicType.Builder<?> builder = byteBuddy.redefine(clazz);

        builder = builder.visit(
                Advice.to(Expert.class).on(ElementMatchers.isMethod())
        );


        // 3. output
        DynamicType.Unloaded<?> unloadedType = builder.make();
        OutputUtils.save(unloadedType, true);
    }
}
```

```java
import java.time.LocalDate;

public class HelloWorldRun {
    public static void main(String[] args) {
        HelloWorld instance = new HelloWorld();
        instance.test("Tom", 10, LocalDate.now());
    }
}
```

```text
方法进入
    allArgs.length: 4
    allArgs[0]: sample.HelloWorld@15aeb7ab
    allArgs[1]: Tom
    allArgs[2]: 10
    allArgs[3]: 2024-09-30
SGVsbG9Xb3JsZCAtIFRvbSAtIDEwIC0gMjAyNC0wOS0zMA==
方法退出
```

### nullIfEmpty

```java
public class HelloWorld {
    public void test() {
        System.out.println("Test");
    }
}
```

```java
import net.bytebuddy.asm.Advice;

import java.util.Arrays;

public class Expert {

    @Advice.OnMethodEnter
    static void methodAbc(@Advice.AllArguments(nullIfEmpty = false) Object[] allArgs) { // nullIfEmpty = false
        System.out.println("方法进入");

        // allArgs
        String msg = String.format("    allArgs: %s", Arrays.toString(allArgs));
        System.out.println(msg);
    }

    @Advice.OnMethodExit
    static void methodXyz(@Advice.AllArguments(nullIfEmpty = true) Object[] allArgs) { // nullIfEmpty = true
        System.out.println("方法退出");

        // allArgs
        String msg = String.format("    allArgs: %s", Arrays.toString(allArgs));
        System.out.println(msg);
    }
}
```

```java
import net.bytebuddy.ByteBuddy;
import net.bytebuddy.asm.Advice;
import net.bytebuddy.dynamic.DynamicType;
import net.bytebuddy.matcher.ElementMatchers;

public class HelloWorldRedefine {
    public static void main(String[] args) {
        // 1. prepare
        String className = "sample.HelloWorld";
        Class<?> clazz = ClassUtils.loadClass(className);


        // 2. weave
        ByteBuddy byteBuddy = new ByteBuddy();
        DynamicType.Builder<?> builder = byteBuddy.redefine(clazz);

        builder = builder.visit(
                Advice.to(Expert.class).on(ElementMatchers.isMethod())
        );


        // 3. output
        DynamicType.Unloaded<?> unloadedType = builder.make();
        OutputUtils.save(unloadedType, true);
    }
}
```

```java
public class HelloWorldRun {
    public static void main(String[] args) {
        HelloWorld instance = new HelloWorld();
        instance.test();
    }
}
```

```text
方法进入
    allArgs: []

方法退出
    allArgs: null
```
