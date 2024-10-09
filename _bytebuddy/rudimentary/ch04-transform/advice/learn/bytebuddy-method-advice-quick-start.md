---
title: "快速开始"
sequence: "101"
---

## 预期目标

预期目标：在『方法刚进入』时，打印“Method Enter”；在『方法要退出』时，打印“Method Exit”

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
public class HelloWorld {
    public void test() {
        System.out.println(">>> Method Enter"); // <-- 方法进入
        System.out.println("Hello World");
        System.out.println("<<< Method Exit");  // <-- 方法退出
    }
}
```

## 编码实现

### Expert

```java
import net.bytebuddy.asm.Advice;

public class Expert {
    @Advice.OnMethodEnter
    static void methodAbc() {
        System.out.println(">>> Method Enter");
    }

    @Advice.OnMethodExit
    static void methodXyz() {
        System.out.println("<<< Method Exit");
    }
}
```

### Redefine

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
                Advice.to(Expert.class)
                        .on(ElementMatchers.named("test"))
        );


        // 第三步，输出结果
        DynamicType.Unloaded<?> unloadedType = builder.make();
        OutputUtils.save(unloadedType, true);
    }
}
```

## 测试

```java
public class HelloWorldRun {
    public static void main(String[] args) throws Exception {
        HelloWorld instance = new HelloWorld();
        instance.test();
    }
}
```
