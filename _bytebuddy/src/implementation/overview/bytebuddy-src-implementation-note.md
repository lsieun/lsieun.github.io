---
title: "Implementation 注意事项"
sequence: "111"
---

Note that Byte Buddy only invokes each `Implementation`'s `prepare` and `appender` methods a single time
during the creation process of any class.
This is guaranteed no matter how many times an implementation is registered for use in a class's creation.
This way, an `Implementation` can avoid to verify if a field or method is already defined.

> Implementation 的 prepare 和 appender 方法只会调用一次

In the process, Byte Buddy compares `Implementation`s instances by their `hashCode` and `equals` methods.
In general, any class that is used by Byte Buddy should provide meaningful implementations of these methods.

> ByteBuddy 会根据 hashCode 和 equals 方法进行判断，因此这两个方法要提供一个“合理”的实现。

The fact that enumerations come with such implementations per definition is another good reason for their use.

> 我猜测，这里应该是讲，使用 enum 是代替 hashCode 和 equals 的一个好方法

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

        MethodDelegation methodDelegation = MethodDelegation.to(HardWorker.class);

        builder = builder.defineMethod("test1", String.class, Visibility.PUBLIC)
                .withParameters(String.class, int.class)
                .intercept(methodDelegation); // 第一次使用

        // TODO: 可以生成两次，不知道是哪里出了错误
        builder = builder.defineMethod("test2", String.class, Visibility.PUBLIC)
                .withParameters(String.class, int.class)
                .intercept(methodDelegation); // 第二次使用


        // 3. output
        DynamicType.Unloaded<?> unloadedType = builder.make();
        OutputUtils.save(unloadedType);
    }
}
```


