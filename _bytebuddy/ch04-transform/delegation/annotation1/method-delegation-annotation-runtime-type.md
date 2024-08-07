---
title: "@RuntimeType"
sequence: "106"
---

While **static typing** is great for implementing methods, **strict types** can limit the reuse of code.

To overcome this limitation,
Byte Buddy allows to annotate **methods** and **method parameters** with `@RuntimeType`
which instructs Byte Buddy to suspend the **strict type check** in favor of a **runtime type casting**.

```java

@Documented
@Retention(RetentionPolicy.RUNTIME)
@Target({ElementType.PARAMETER, ElementType.METHOD})
public @interface RuntimeType {
}
```

## 示例

### 预期目标

```java
public class HelloWorld {
    public int test(int val) {
        return val;
    }

    public String test(String str) {
        return str;
    }
}
```

### 运行

```java
public class HelloWorldRun {
    public static void main(String[] args) {
        HelloWorld instance = new HelloWorld();
        int result1 = instance.test(10);
        System.out.println("result1 = " + result1);

        String result2 = instance.test("Tom");
        System.out.println("result2 = " + result2);
    }
}
```

### 代理类

```java
import net.bytebuddy.implementation.bind.annotation.RuntimeType;

public class HardWorker {
    @RuntimeType
    public static Object doWork(@RuntimeType Object obj) {
        if (obj instanceof Integer) {
            return (Integer) obj * 2;
        } else if (obj instanceof String) {
            return String.format("Hello, %s", obj);
        } else {
            return obj;
        }
    }
}
```

### 修改

```java
import net.bytebuddy.ByteBuddy;
import net.bytebuddy.dynamic.DynamicType;
import net.bytebuddy.implementation.MethodDelegation;
import net.bytebuddy.matcher.ElementMatchers;

public class HelloWorldRebase {
    public static void main(String[] args) throws Exception {
        // 第一步，准备参数
        String className = "sample.HelloWorld";
        Class<?> clazz = Class.forName(className);


        // 第二步，生成类
        ByteBuddy byteBuddy = new ByteBuddy();
        DynamicType.Builder<?> builder = byteBuddy.rebase(clazz);

        builder = builder.method(
                ElementMatchers.named("test")
        ).intercept(
                MethodDelegation.to(HardWorker.class)
        );


        // 第三步，输出结果
        DynamicType.Unloaded<?> unloadedType = builder.make();
        OutputUtils.save(unloadedType, true);
    }
}
```

```java
public class HelloWorld {
    public int test(int var1) {
        return (Integer)HardWorker.doWork(var1);
    }

    private int test$original$n4pQbQS7(int val) {
        return val;
    }

    public String test(String var1) {
        return (String)HardWorker.doWork(var1);
    }

    private String test$original$n4pQbQS7(String str) {
        return str;
    }
}
```

## 注意事项

Note that Byte Buddy is also able to **box and to unbox primitive values**.

However, be aware that the use of `@RuntimeType` comes at the cost of abandoning type safety and
you might end up with a `ClassCastException` if you got incompatible types mixed up.

