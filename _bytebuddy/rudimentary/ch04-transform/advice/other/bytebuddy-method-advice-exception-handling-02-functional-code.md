---
title: "异常处理（二）：Functional Code"
sequence: "102"
---

## 介绍

```text
                                      ┌─── catch ─────┼─── @Advice.OnMethodExit(onThrowable = Exception.class)
                                      │
                                      ├─── mapping ───┼─── @Advice.Thrown(readOnly = false) Exception ex
advice::functional.code::exception ───┤
                                      │               ┌─── default ────┼─── throw ex
                                      │               │
                                      └─── process ───┼─── suppress ───┼─── ex = null
                                                      │
                                                      └─── replace ────┼─── throw new RuntimeException()
```

![](/assets/images/bytebuddy/advice/bytebuddy-method-advice-exception-handling-of-functional-code.png)

## 示例

### 预期目标

```java
public class HelloWorld {
    public void test(String str) {
        // 存在问题：不为数字时，抛出 NumberFormatException 异常
        int num = Integer.parseInt(str); // functional code
        System.out.println(num);         // functional code
    }
}
```

### 编码实现

```java
import net.bytebuddy.asm.Advice;

public class Expert {

    @Advice.OnMethodExit(onThrowable = IllegalArgumentException.class)
    static void methodXyz(
            @Advice.Thrown(readOnly = false) IllegalArgumentException ex
    ) {
        if (ex == null) {
            System.out.println("Method Exit Normally");
        }
        else {
            String msg = String.format("Method Exit Exceptionally: %s", ex.getMessage());
            System.out.println(msg);
        }

        // 吞食异常
        ex = null;
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

### 测试

```java
public class HelloWorldRun {
    public static void main(String[] args) {
        HelloWorld instance = new HelloWorld();
        instance.test("abc");
    }
}
```

```text
Method Exit Exceptionally: For input string: "abc"
```

