---
title: "@Advice.Exit"
sequence: "102"
---

## 示例

### 预期目标

```java
package sample;

public class HelloWorld {
    public String test() {
        return "test";
    }
}
```

### 建议

```java
import net.bytebuddy.asm.Advice;
import net.bytebuddy.implementation.bytecode.assign.Assigner;
import sample.HelloWorld;

public class Expert {
    @Advice.OnMethodExit(repeatOn = HelloWorld.class)
    public static Object methodExit(
            @Advice.Return(readOnly = false, typing = Assigner.Typing.DYNAMIC) String returnValue,
            @Advice.Exit(readOnly = false) Object exitValue
    ) {
        System.out.println("=== Method Exit ===" + exitValue);
        returnValue = (exitValue == null ? "NULL" : "NON_NULL");
        return exitValue == null ? new HelloWorld() : "Good";
    }
}
```

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
                Advice.to(Expert.class)
                        .on(ElementMatchers.named("test"))
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
        Object val = instance.test();
        System.out.println("val = " + val);
    }
}
```
