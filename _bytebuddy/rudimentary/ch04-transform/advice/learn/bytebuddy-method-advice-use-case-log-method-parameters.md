---
title: "普通场景：日志-打印方法参数"
sequence: "103"
---

## 预期目标

```java
import java.nio.charset.StandardCharsets;
import java.util.Base64;

public class HelloWorld {
    public void test(String name, int age, Object obj) {
        String msg = String.format("HelloWorld - %s - %d - %s", name, age, obj);
        byte[] bytes = msg.getBytes(StandardCharsets.UTF_8);
        String base64Str = Base64.getEncoder().encodeToString(bytes);
        System.out.println(base64Str);
    }
}
```

## 编码实现

### Expert

```java
import net.bytebuddy.asm.Advice;

public class Expert {

    @Advice.OnMethodEnter
    static void methodAbc(@Advice.Origin("#t") String type,
                                   @Advice.Origin("#m") String methodName,
                                   @Advice.AllArguments Object[] allArgs) {
        String msg = String.format("方法进入 %s.%s() >>>>>>>>>", type, methodName);
        System.out.println(msg);
        int length = allArgs.length;
        {
            String argsLength = String.format("    allArgs.length: %s", length);
            System.out.println(argsLength);
        }
        for (int i = 0; i < length; i++) {
            Object val = allArgs[i];
            String argInfo = String.format("    allArgs[%d]: %s", i, val);
            System.out.println(argInfo);
        }
    }

    @Advice.OnMethodExit
    static void methodXyz(@Advice.Origin("#t") String type,
                                  @Advice.Origin("#m") String methodName) {
        String msg = String.format("方法退出 %s.%s() <<<<<<<<<", type, methodName);
        System.out.println(msg);
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
import java.time.LocalDate;

public class HelloWorldRun {
    public static void main(String[] args) {
        HelloWorld instance = new HelloWorld();
        instance.test("Tom", 10, LocalDate.now());
    }
}
```

```text
方法进入 sample.HelloWorld.test() >>>>>>>>>
    allArgs.length: 3
    allArgs[0]: Tom
    allArgs[1]: 10
    allArgs[2]: 2024-10-02
SGVsbG9Xb3JsZCAtIFRvbSAtIDEwIC0gMjAyNC0xMC0wMg==
方法退出 sample.HelloWorld.test() <<<<<<<<<
```
