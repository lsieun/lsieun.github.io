---
title: "@Advice.This"
sequence: "102"
---

## 示例

```java
import java.util.Date;

public class HelloWorld {
    public String test(String name, int age, Date date) {
        return String.format("Name: %s, Age: %s, Date: %s", name, age, date);
    }
}
```

```java
import net.bytebuddy.asm.Advice;

public class Expert {
    @Advice.OnMethodEnter
    static void methodAbc(
            @Advice.This Object thisObj
    ) {
        System.out.println("@Advice.This: " + thisObj);
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
                Advice.to(Expert.class)
                        .on(ElementMatchers.named("test"))
        );


        // 3. output
        DynamicType.Unloaded<?> unloadedType = builder.make();
        OutputUtils.save(unloadedType, true);
    }
}
```

```java
public class HelloWorldRun {
    public static void main(String[] args) {
        String className = "sample.HelloWorld";
        InvokeUtils.invokeAllMethods(className);
    }
}
```

## 注意事项

|               | @Advice.OnMethodEnter | @Advice.OnMethodExit |
|---------------|-----------------------|----------------------|
| static method |                       |                      |
| constructor   |                       | YES                  |

在默认情况下，使用 `@This` 从 `static` 方法或构造方法（constructor）中取值，会报错：

```text
java.lang.IllegalStateException: Cannot map this reference for static method or constructor start
```

这个时候，可以设置 `@Advice.This` 的 `optional` 值为 `true`：

```java
import net.bytebuddy.asm.Advice;

public class Expert {
    @Advice.OnMethodEnter
    static void methodAbc(
            // 注意：optional 设置为 true
            @Advice.This(optional = true) Object thisObj
    ) {
        System.out.println("@Advice.This: " + thisObj);
    }
}
```

第 1 个例子：静态方法

```java
import java.util.Date;

public class HelloWorld {
    // 注意：下面的方法有 static 修饰符
    public static String test(String name, int age, Date date) {
        return String.format("Name: %s, Age: %s, Date: %s", name, age, date);
    }
}
```

第 2 个例子：构造方法

```java
public class HelloWorld {
    public HelloWorld() {
        System.out.println("Hello Constructor");
    }
}
```


