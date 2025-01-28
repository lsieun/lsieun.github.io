---
title: "@Advice.Local"
sequence: "103"
---

## 介绍

`@Advice.Local` 作用：定义一个局部变量，负责从 `@Advice.OnMethodEnter` 向 `@Advice.OnMethodExit` 传递数据。

![](/assets/images/bytebuddy/advice/bytebuddy-method-advice-annotation-local-illustration.png)


## 示例

### 方法运行时间

预期目标：方法的运行时间

修改之前：

```java
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.concurrent.TimeUnit;

public class HelloWorld {
    public String test(String name, int age, Object obj) throws InterruptedException {
        String msg = String.format("HelloWorld - %s - %d - %s", name, age, obj);
        int timeout = (int) (Math.random() * 1000);
        TimeUnit.MILLISECONDS.sleep(timeout);
        byte[] bytes = msg.getBytes(StandardCharsets.UTF_8);
        return Base64.getEncoder().encodeToString(bytes);
    }
}
```

修改之后：

```java
import java.util.Base64;
import java.util.concurrent.TimeUnit;

public class HelloWorld {
    public String test(String name, int age, Object obj) throws InterruptedException {
        long startTime = System.currentTimeMillis();      // <--- advice.code.enter

        // functional code --->
        String msg = String.format("HelloWorld - %s - %d - %s", name, age, obj);
        int timeout = (int) (Math.random() * 1000);
        TimeUnit.MILLISECONDS.sleep(timeout);
        byte[] bytes = msg.getBytes(StandardCharsets.UTF_8);
        String result = Base64.getEncoder().encodeToString(bytes);
        // functional code <---

        long stopTime = System.currentTimeMillis();       // <--- advice.code.exit
        long diff = stopTime - startTime;                 // <--- advice.code.exit
        System.out.println("Execution Time: " + diff);    // <--- advice.code.exit

        return result;
    }
}
```

编码实现：


```java
import net.bytebuddy.asm.Advice;

public class Expert {
    @Advice.OnMethodEnter
    static void methodAbc(@Advice.Local("timestamp") long startTime) {
        startTime = System.currentTimeMillis();
    }

    @Advice.OnMethodExit
    static void methodXyz(@Advice.Local("timestamp") long startTime) {
        long endTime = System.currentTimeMillis();
        long diff = endTime - startTime;
        System.out.println("Execution Time: " + diff);
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
        DynamicType.Builder<?> builder = byteBuddy.redefine(clazz)
                .name(className);

        builder = builder.visit(
                Advice.to(Expert.class).on(ElementMatchers.isMethod())
        );


        // 3. output
        DynamicType.Unloaded<?> unloadedType = builder.make();
        OutputUtils.save(unloadedType, true);
    }
}
```

测试

```java
import java.time.LocalDate;

public class HelloWorldRun {
    public static void main(String[] args) {
        HelloWorld instance = new HelloWorld();
        String result = instance.test("Tom", 10, LocalDate.now());
        System.out.println(result);
    }
}
```
