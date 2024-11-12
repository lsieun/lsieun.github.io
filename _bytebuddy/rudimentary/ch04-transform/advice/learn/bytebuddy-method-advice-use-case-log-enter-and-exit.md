---
title: "普通场景：日志-方法进入和退出"
sequence: "102"
---

## 预期目标

```java
public class HelloWorld {
    private final String name;
    private final int age;

    public HelloWorld(String name, int age) {
        this.name = name;
        this.age = age;
    }

    public void abc() {
        System.out.println("Abc");
    }

    public void test() {
        String msg = String.format("HelloWorld - %s - %d", name, age);
        System.out.println(msg);
    }

    public void xyz() {
        System.out.println("Xyz");
    }
}
```

## 编码实现

### Expert

```java
import net.bytebuddy.asm.Advice;

public class Expert {

    @Advice.OnMethodEnter
    static void methodAbc(@Advice.Origin Class<?> clazz,
                                   @Advice.Origin("#m") String methodName) {
        Logger logger = Logger.of(clazz);
        String msg = String.format("方法进入 %s >>>>>>>>>", methodName);
        logger.green(msg);
    }

    @Advice.OnMethodExit
    static void methodXyz(@Advice.Origin Class<?> clazz,
                                  @Advice.Origin("#m") String methodName) {
        Logger logger = Logger.of(clazz);
        String msg = String.format("方法退出 %s <<<<<<<<<", methodName);
        logger.green(msg);
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
        HelloWorld instance = new HelloWorld("Tom", 10);
        instance.abc();
        instance.test();
        instance.xyz();;
    }
}
```

```text
[INFO] [sample.HelloWorld] - 方法进入 abc >>>>>>>>>
Abc
[INFO] [sample.HelloWorld] - 方法退出 abc <<<<<<<<<
[INFO] [sample.HelloWorld] - 方法进入 test >>>>>>>>>
HelloWorld - Tom - 10
[INFO] [sample.HelloWorld] - 方法退出 test <<<<<<<<<
[INFO] [sample.HelloWorld] - 方法进入 xyz >>>>>>>>>
Xyz
[INFO] [sample.HelloWorld] - 方法退出 xyz <<<<<<<<<
```
