---
title: "@Advice.Enter"
sequence: "101"
---

从 MethodEnter 向 MethodExit 传递数据

The annotated parameter should be mapped to the value
that is returned by the advice method
that is annotated by `Advice.OnMethodEnter`.



## @Advice.Enter



## 示例

### 预期目标

假如有一个 `HelloWorld` 类：

```java
package sample;

public class HelloWorld {
    public void test() {
        System.out.println("Hello World");
    }
}
```

预期目标：

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

### 建议

```java
import net.bytebuddy.asm.Advice;

public class Expert {
    @Advice.OnMethodEnter
    public static String methodEnter() {
        String sharedSecrets = "Today is a gift";
        System.out.println("=== Method Enter ===");
        return sharedSecrets;
    }

    @Advice.OnMethodExit
    public static void methodExit(
            @Advice.Enter String sharedSecrets
    ) {
        System.out.println("=== Method Exit ===");
        System.out.println(sharedSecrets);
    }
}
```

{:refdef: style="text-align: center;"}
![](/assets/images/cartoon/today-is-a-gift.jpg)
{:refdef}


### 修改

```java
import net.bytebuddy.ByteBuddy;
import net.bytebuddy.asm.Advice;
import net.bytebuddy.dynamic.DynamicType;
import net.bytebuddy.matcher.ElementMatchers;

public class HelloWorldRedefine {
    public static void main(String[] args) throws Exception {
        // 第一步，准备参数
        String className = "sample.HelloWorld";
        Class<?> clazz = Class.forName(className);


        // 第二步，生成类
        ByteBuddy byteBuddy = new ByteBuddy();
        DynamicType.Builder<?> builder = byteBuddy.redefine(clazz);

        builder = builder.visit(
                Advice.to(Expert.class).on(ElementMatchers.isMethod())
        );


        // 第三步，输出结果
        DynamicType.Unloaded<?> unloadedType = builder.make();
        OutputUtils.save(unloadedType, true);
    }
}
```

### 运行

```java
import sample.HelloWorld;

public class HelloWorldRun {
    public static void main(String[] args) throws Exception {
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
    public static void methodExit(
            @Advice.Enter String sharedSecrets
    ) {
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

### 动态类型

在 `@Advice.Enter` 中，有一个 `typing` 属性，它可以用来进行**类型转换**：

```java
@Retention(RetentionPolicy.RUNTIME)
@java.lang.annotation.Target(ElementType.PARAMETER)
public @interface Enter {
    boolean readOnly() default true;
    Assigner.Typing typing() default Assigner.Typing.STATIC;
}
```

错误示例：

```java
import net.bytebuddy.asm.Advice;

public class Expert {
    // 注意一：返回值类型是 Object
    @Advice.OnMethodEnter
    public static Object methodEnter() {
        String sharedSecrets = "Today is a gift";
        System.out.println("=== Method Enter ===");
        return sharedSecrets;
    }

    @Advice.OnMethodExit
    public static void methodExit(
            // 注意二：参数类型是 String
            @Advice.Enter String sharedSecrets
    ) {
        System.out.println("=== Method Exit ===");
        System.out.println(sharedSecrets);
    }
}
```

正确示例：

```java
import net.bytebuddy.asm.Advice;
import net.bytebuddy.implementation.bytecode.assign.Assigner;

public class Expert {
    @Advice.OnMethodEnter
    public static Object methodEnter() {
        String sharedSecrets = "Today is a gift";
        System.out.println("=== Method Enter ===");
        return sharedSecrets;
    }

    @Advice.OnMethodExit
    public static void methodExit(
            // 注意：typing 属性值为 Assigner.Typing.DYNAMIC
            @Advice.Enter(typing = Assigner.Typing.DYNAMIC) String sharedSecrets
    ) {
        System.out.println("=== Method Exit ===");
        System.out.println(sharedSecrets);
    }
}
```
