---
title: "普通场景：捕获业务代码的异常"
sequence: "106"
---

## 预期目标

预期目标：捕获业务代码的异常，使 Advice Code 正常执行。

```java
public class HelloWorld {
    public void test(String str) {
        // 存在问题：不为数字时，抛出 NumberFormatException 异常
        System.out.println("str = " + str); // functional code
        int length = str.length();          // functional code
        int num = Integer.parseInt(str);    // functional code
        int result = length * num;          // functional code
        System.out.println(result);         // functional code
    }
}
```

## 编码实现

### Expert

```java
import net.bytebuddy.asm.Advice;

public class Expert {
    @Advice.OnMethodEnter()
    static void methodAbc() {
        System.out.println("Method Enter");
    }

    @Advice.OnMethodExit(onThrowable = Exception.class)
    static void methodXyz(@Advice.Thrown(readOnly = false) Exception ex) {
        // 判断异常是否发生
        if (ex == null) {
            System.out.println("Method Exit Normally");
        }
        else {
            String msg = String.format("Method Exit Exceptionally: %s", ex.getMessage());
            System.out.println(msg);
        }

        // 吞食异常
        // ex = null;
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

## 测试

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
