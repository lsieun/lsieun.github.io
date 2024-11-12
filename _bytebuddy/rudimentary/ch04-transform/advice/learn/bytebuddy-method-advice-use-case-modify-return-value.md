---
title: "普通场景：修改方法返回值"
sequence: "105"
---

## 预期目标

预期目标：将方法的返回值修改为 `AbxXyz`

```java
import java.util.Base64;

public class HelloWorld {
    public String test(String name, int age, Object obj) {
        String msg = String.format("HelloWorld - %s - %d - %s", name, age, obj);
        byte[] bytes = msg.getBytes();
        return Base64.getEncoder().encodeToString(bytes);
    }
}
```

## 编码实现

### Expert

```java
import net.bytebuddy.asm.Advice;
import net.bytebuddy.implementation.bytecode.assign.Assigner;

public class Expert {

    @Advice.OnMethodExit
    static void methodXyz(
            @Advice.Return(
                    readOnly = false,
                    typing = Assigner.Typing.DYNAMIC
            ) Object returnValue) {
        returnValue = "AbcXyz";
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

## 测试

```java
import java.time.LocalDate;

public class HelloWorldRun {
    public static void main(String[] args) {
        HelloWorld instance = new HelloWorld();
        String msg = instance.test("Tom", 10, LocalDate.now());
        System.out.println(msg);
    }
}
```

