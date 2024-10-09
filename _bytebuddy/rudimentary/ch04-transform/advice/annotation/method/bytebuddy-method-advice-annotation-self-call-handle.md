---
title: "@Advice.SelfCallHandle"
sequence: "106"
---

## 介绍

## 示例

### 预期目标

修改之前：

```java
public class HelloWorld {
    public void test(int num) {
        System.out.println(num);
    }
}
```

修改之后：

```java
public class HelloWorld {
    public void test(int num) {
        System.out.println(num);

        if (num > 0) {             // 新增代码
            this.test(num - 1);    // 新增代码
        }                          // 新增代码
    }
}
```

### 编码实现

#### Expert

```java
import net.bytebuddy.asm.Advice;

import java.lang.invoke.MethodHandle;

public class Expert {

    @Advice.OnMethodExit
    static void methodXyz(
            @Advice.This HelloWorld instance,
            @Advice.Argument(0) int num,
            @Advice.SelfCallHandle(bound = false) MethodHandle methodHandle) throws Throwable {
        if (num > 0) {
            methodHandle.invoke(instance, num - 1);
        }
    }
}
```

#### Redefine

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

### 测试

```java
public class HelloWorldRun {
    public static void main(String[] args) throws Exception {
        HelloWorld instance = new HelloWorld();
        instance.test(5);
    }
}
```

输出结果：

```text
5
4
3
2
1
0
```
