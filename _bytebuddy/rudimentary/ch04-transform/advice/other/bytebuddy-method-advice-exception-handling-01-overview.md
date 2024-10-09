---
title: "异常处理（一）：概览"
sequence: "101"
---

## 介绍

### 三段代码

```text
                     ┌─── advice.code.enter
                     │
instrumented code ───┼─── functional.code
                     │
                     └─── advice.code.exit
```

### 三段异常捕获

```text
                     ┌─── advice.code.enter ───┼─── @Advice.OnMethodEnter(suppress = AbcException.class)
                     │
instrumented code ───┼─── functional.code ─────┼─── @Advice.OnMethodExit(onThrowable = MidException.class)
                     │
                     └─── advice.code.exit ────┼─── @Advice.OnMethodExit(suppress = XyzException.class)
```

{:refdef: style="text-align: center;"}
![](/assets/images/bytebuddy/advice/bytebuddy-method-advice-exception-three-parts.png)
{:refdef}

## 基础参照

### 预期目标

修改之前：

```java
public class HelloWorld {
    public void test() {
        System.out.println("You don't need wings to fly");
    }
}
```

修改之后：

```java
public class HelloWorld {
    public void test() {
        System.out.println("Method Enter");                // advice.code.enter
        
        System.out.println("You don't need wings to fly"); // functional.code

        System.out.println("Method Exit");                 // advice.code.exit
    }
}
```

### 编码实现

```java
import net.bytebuddy.asm.Advice;

public class Expert {
    @Advice.OnMethodEnter
    static void methodAbc() {
        System.out.println("Method Enter");
    }

    @Advice.OnMethodExit
    static void methodXyz() {
        System.out.println("Method Exit");
    }
}
```

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

## 三段 try...catch

### 预期目标

修改之前：

```java
public class HelloWorld {
    public void test() {
        System.out.println("You don't need wings to fly");
    }
}
```

修改之后：

```java
public class HelloWorld {
    public void test() {
        try {
            System.out.println("Method Enter");                // advice.code.enter
        } catch (AbcException ex) {
            // @Advice.OnMethodEnter(suppress = AbcException.class)
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
            // @Advice.OnMethodExit(suppress = XyzException.class)
        }
        
        if (functionalCodeException != null) {
            throw functionalCodeException;
        }
    }
}
```

### 编码实现

```java
import net.bytebuddy.asm.Advice;

public class Expert {
    @Advice.OnMethodEnter(suppress = AbcException.class)
    static void methodAbc() {
        System.out.println("Method Enter");
    }

    @Advice.OnMethodExit(
            onThrowable = MidException.class,
            suppress = XyzException.class
    )
    static void methodXyz() {
        System.out.println("Method Exit");
    }
}
```

```java
public class AbcException extends Exception {
}
```

```java
public class MidException extends Exception {
}
```

```java
public class XyzException extends Exception {
}
```

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
                        .on(ElementMatchers.isMethod())
        );


        // 第三步，输出结果
        DynamicType.Unloaded<?> unloadedType = builder.make();
        OutputUtils.save(unloadedType, true);
    }
}
```

