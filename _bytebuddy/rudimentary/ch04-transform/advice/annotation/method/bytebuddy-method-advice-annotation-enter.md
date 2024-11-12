---
title: "@Advice.Enter"
sequence: "104"
---

## 介绍

### 作用

`@Advice.Enter` 作用：定义一个局部变量，负责将 `@Advice.OnMethodEnter` 方法的『返回值』 传递给 `@Advice.OnMethodExit` 方法。

![](/assets/images/bytebuddy/advice/bytebuddy-method-advice-annotation-enter-illustration.png)

### 注意事项

- 使用要求：`@Advice.Enter` 只能出现在 `@Advice.OnMethodExit` 方法的参数中，但也需要 `@Advice.OnMethodEnter` 方法有返回值。

## 示例

### 传递参数

预期目标：

修改之前：

```java
public class HelloWorld {
    public void test() {
        System.out.println("Hello World");
    }
}
```

修改之后：

```java
package sample;

public class HelloWorld {
    public void test() {
        String sharedSecrets = "Today is a gift";
        System.out.println("=== Method Enter ===");

        System.out.println("Hello World");

        System.out.println("=== Method Exit ===");
        System.out.println(sharedSecrets);
    }
}
```

编码实现：

```java
import net.bytebuddy.asm.Advice;

public class Expert {
    @Advice.OnMethodEnter
    static String methodAbc() {
        String sharedSecrets = "Today is a gift";
        System.out.println("=== Method Enter ===");
        return sharedSecrets;
    }

    @Advice.OnMethodExit
    static void methodXyz(@Advice.Enter String sharedSecrets) {
        System.out.println("=== Method Exit ===");
        System.out.println(sharedSecrets);
    }
}
```

![](/assets/images/cartoon/today-is-a-gift.jpg)


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

测试：

```java
public class HelloWorldRun {
    public static void main(String[] args) {
        HelloWorld instance = new HelloWorld();
        instance.test();
    }
}
```

## 注意事项

### 缺少 @OnMethodEnter

在 `@Advice.Enter` 文档描述中，提示我们需要注意：

> Note: This annotation must only be used within **an exit advice** and is only meaningful in combination with **an enter advice**.


错误示例：

```java
import net.bytebuddy.asm.Advice;

public class Expert {
    @Advice.OnMethodExit
    static void methodXyz(@Advice.Enter String sharedSecrets) {
        System.out.println("=== Method Exit ===");
        System.out.println(sharedSecrets);
    }
}
```

遇到错误：

```text
Exception in thread "main" java.lang.IllegalStateException:
 Usage of interface net.bytebuddy.asm.Advice$Enter is not allowed on java.lang.String arg0
```


