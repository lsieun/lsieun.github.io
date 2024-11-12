---
title: "@Advice.Return"
sequence: "107"
---

## 介绍

### 作用

`@Advice.Return` 作用：对方法的『返回值』进行映射。

### 注意事项

- 外部搭配：`@Advice.Return` 只能与 `Advice.OnMethodExit` 搭配使用，不能与 `Advice.OnMethodEnter` 一起使用。
- 内部使用
    - 可读可写：`@Advice.Return(readOnly = false)`
    - 类型转换：`@Advice.Return(typing = Assigner.Typing.DYNAMIC)`

## 示例

### 读取方法的返回值

```java
public class HelloWorld {
    private final String name;
    private final int age;

    public HelloWorld() {
        this.name = "Tom";
        this.age = 10;
    }

    // return String
    public String getName() {
        return name;
    }

    // return int
    public int getAge() {
        return age;
    }

    // return void
    public void test() {
        System.out.println("Hello World");
    }
}
```

```java
import net.bytebuddy.asm.Advice;
import net.bytebuddy.implementation.bytecode.assign.Assigner;

public class Expert {
    @Advice.OnMethodExit
    static void methodXyz(
            @Advice.Return(typing = Assigner.Typing.DYNAMIC) Object returnValue
    ) {
        System.out.println(returnValue);
    }
}
```

The `@Advice.Return` annotation must specify value for `typing` attribute for `void` return,
and its value must be `Assigner.Typing.DYNAMIC`.
The `Assigner.Typing.DYNAMIC` is required for `void` return.

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
                Advice.to(Expert.class)
                        .on(ElementMatchers.isMethod())
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
        String className = "sample.HelloWorld";
        InvokeUtils.invokeAllMethods(className);
    }
}
```

### 修改方法返回值

```java
public class HelloWorld {
    public int test(int a, int b) {
        return a + b;
    }
}
```

```java
import net.bytebuddy.asm.Advice;

public class Expert {
    @Advice.OnMethodExit
    static void methodXyz(
            @Advice.Return(readOnly = false) int returnValue
    ) {
        returnValue = -1;
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
        int result = instance.test(10, 20);
        System.out.println(result);
    }
}
```


