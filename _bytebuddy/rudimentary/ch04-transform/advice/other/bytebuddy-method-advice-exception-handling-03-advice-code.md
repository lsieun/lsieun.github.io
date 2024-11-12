---
title: "异常处理（三）：Advice Code"
sequence: "103"
---

## 介绍

## 示例

### 打印

#### 预期目标

修改之后：

```java
public class HelloWorld {
    public void test() {
        try {
            System.out.println("Method Enter");                // advice.code.enter
        } catch (AbcException ex1) {
            ex1.printStackTrace();                             // 添加打印语句
        }

        MidException functionalCodeException = null;
        try {
            System.out.println("You don't need wings to fly"); // functional.code
        }
        catch (MidException ex2) {
            // @Advice.OnMethodExit(onThrowable = MidException.class)
            functionalCodeException = ex2;
        }

        try {
            System.out.println("Method Exit");                 // advice.code.exit
        }
        catch (XyzException ex3) {
            ex3.printStackTrace();                             // 添加打印语句
        }
        
        if (functionalCodeException != null) {
            throw functionalCodeException;
        }
    }
}
```

#### 编码实现

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
                        .withExceptionPrinting()          // 添加打印语句
                        .on(ElementMatchers.isMethod())
        );


        // 3. output
        DynamicType.Unloaded<?> unloadedType = builder.make();
        OutputUtils.save(unloadedType, true);
    }
}
```

### 自定义

```text
StackManipulation exceptionHandler = new StackManipulation.Compound(
        MethodInvocation.invoke(new MethodDescription.ForLoadedMethod(Throwable.class.getMethod("getMessage"))), // (1)
        FieldAccess.forField(new FieldDescription.ForLoadedField(System.class.getField("out"))).read(), // (2)
        Duplication.SINGLE.flipOver(TypeDescription.ForLoadedType.of(PrintStream.class)), // (3)
        Removal.SINGLE, // (4)
        MethodInvocation.invoke(new MethodDescription.ForLoadedMethod(PrintStream.class.getMethod("println", String.class))) // (5)
);

builder = builder.visit(
        Advice.to(Expert.class)
                .withExceptionHandler(exceptionHandler)
                .on(ElementMatchers.isMethod())
);
```

![](/assets/images/bytebuddy/advice/bytebuddy-method-advice-with-exception-handler-example-operand-stack.png)
