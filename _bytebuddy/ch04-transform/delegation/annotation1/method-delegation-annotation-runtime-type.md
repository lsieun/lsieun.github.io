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

```java
import sample.HelloWorld;

public class HelloWorldRun {
    public static void main(String[] args) {
        HelloWorld instance = new HelloWorld();
        instance.test(10);
        instance.test("Tom");
    }
}
```

### 编码实现

#### HardWorker

```java
import net.bytebuddy.implementation.bind.annotation.RuntimeType;

public class HardWorker {
    @RuntimeType
    public static Object doWork(@RuntimeType Object obj) {
        System.out.println("This is doWork Method: " + obj);
        return obj;
    }
}
```

#### Rebase

```java
import net.bytebuddy.ByteBuddy;
import net.bytebuddy.dynamic.DynamicType;
import net.bytebuddy.implementation.MethodDelegation;
import net.bytebuddy.matcher.ElementMatchers;
import sample.HelloWorld;

public class HelloWorldRebase {
    public static void main(String[] args) throws Exception {
        // 第一步，准备参数
        String className = "sample.HelloWorld";
        Class<?> clazz = Class.forName(className);


        // 第二步，生成类
        ByteBuddy byteBuddy = new ByteBuddy();
        DynamicType.Builder<?> builder = byteBuddy.rebase(clazz);

        builder = builder.method(
                ElementMatchers.isDeclaredBy(HelloWorld.class)
        ).intercept(
                MethodDelegation.to(HardWorker.class)
        );


        // 第三步，输出结果
        DynamicType.Unloaded<?> unloadedType = builder.make();
        OutputUtils.save(unloadedType);
    }
}
```

## 注意事项

Note that Byte Buddy is also able to **box and to unbox primitive values**.

However, be aware that the use of `@RuntimeType` comes at the cost of abandoning type safety and
you might end up with a `ClassCastException` if you got incompatible types mixed up.

