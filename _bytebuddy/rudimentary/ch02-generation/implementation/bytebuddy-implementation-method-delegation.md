---
title: "MethodDelegation（方法委托）"
sequence: "method-delegation"
---

## MethodDelegation

预期目标：

```java
public class HelloWorld {
    public String test(String name, int age) {
        return HardWorker.doWork(name, age);
    }
}
```

其中，`HardWorker` 定义如下：

```java
import java.util.Base64;
import java.util.Date;

public class HelloWorld {
    public String test(String name, int age, Date date) {
        String str = String.format("%s:%s:%s", name, age, date);
        byte[] bytes = str.getBytes();
        return Base64.getEncoder().encodeToString(bytes);
    }
}
```

编码实现：

```java
import net.bytebuddy.ByteBuddy;
import net.bytebuddy.description.modifier.Visibility;
import net.bytebuddy.dynamic.DynamicType;
import net.bytebuddy.implementation.MethodDelegation;

public class HelloWorldSubClass {
    public static void main(String[] args) {
        // 1. prepare
        String className = "sample.HelloWorld";


        // 2. weave
        ByteBuddy byteBuddy = new ByteBuddy();
        DynamicType.Builder<?> builder = byteBuddy.subclass(Object.class)
                .modifiers(Visibility.PUBLIC)
                .name(className);

        builder = builder.defineMethod("test", String.class, Visibility.PUBLIC)
                .withParameter(String.class, "name")
                .withParameter(int.class, "age")
                .intercept(
                        MethodDelegation.to(HardWorker.class)
                );


        // 3. output
        DynamicType.Unloaded<?> unloadedType = builder.make();
        OutputUtils.save(unloadedType);
    }
}
```

进行测试：

```java
import lsieun.utils.InvokeUtils;

public class HelloWorldRun {
    public static void main(String[] args) {
        InvokeUtils.invokeAllMethods("sample.HelloWorld");
    }
}
```
