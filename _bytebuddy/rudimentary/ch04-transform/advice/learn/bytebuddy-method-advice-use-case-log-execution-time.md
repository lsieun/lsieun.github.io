---
title: "普通场景：日志-方法运行时间"
sequence: "104"
---

## 预期目标

预期目标：打印方法的运行时间

修改之前：

```java
import java.util.Base64;
import java.util.concurrent.TimeUnit;

public class HelloWorld {
    public String test(String name, int age) throws InterruptedException {
        String msg = String.format("HelloWorld - %s - %d - %s", name, age, obj);
        int timeout = (int) (Math.random() * 1000);
        TimeUnit.MILLISECONDS.sleep(timeout);
        byte[] bytes = str.getBytes();
        return Base64.getEncoder().encodeToString(bytes);
    }
}
```

修改之后：

```java
import java.util.Base64;
import java.util.concurrent.TimeUnit;

public class HelloWorld {
    public String test(String name, int age) throws InterruptedException {
        long startTime = System.currentTimeMillis();      // <--- advice code

        // functional code --->
        String str = String.format("HelloWorld - %s - %d - %s", name, age, obj);
        int timeout = (int) (Math.random() * 1000);
        TimeUnit.MILLISECONDS.sleep(timeout);
        byte[] bytes = str.getBytes();
        String result = Base64.getEncoder().encodeToString(bytes);
        // functional code <---

        long stopTime = System.currentTimeMillis();       // <--- advice code
        long diff = stopTime - startTime;                 // <--- advice code
        System.out.println("Execution Time: " + diff);    // <--- advice code

        return result;
    }
}
```

## 编码实现

### Expert

```java
import net.bytebuddy.asm.Advice;

public class Expert {
    @Advice.OnMethodEnter
    static void methodAbc(
            @Advice.Local("timestamp") long startTime
    ) {
        startTime = System.currentTimeMillis();
    }

    @Advice.OnMethodExit
    static void methodXyz(
            @Advice.Local("timestamp") long startTime
    ) {
        long endTime = System.currentTimeMillis();
        long diff = endTime - startTime;
        System.out.println("Execution Time: " + diff);
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
        String className = "sample.HelloWorld";

        Object instance = ClassUtils.createInstance(className);
        System.out.println(instance);

        MethodInvokeUtils.invokeAllMethods(className);
    }
}
```

```text
[Method] public String test(String, int) --> [Tom, 24]
Execution Time: 721
[Result] VG9tOjI0
```
