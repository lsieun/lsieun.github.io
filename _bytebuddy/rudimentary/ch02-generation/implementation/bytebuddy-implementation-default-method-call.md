---
title: "DefaultMethodCall（调用接口默认方法）"
sequence: "default-method-call"
---

With its version 8 release, the Java programming language introduced **default methods for interfaces**.

In Java, **a default method invocation** is expressed by a similar syntax to **the invocation of a super method**.

As an only disparity, **a default method invocation** names the interface that defines the method.

This is necessary because a default method invocation can be ambiguous
if two interfaces define a method with identical signature.

Accordingly, Byte Buddy's `DefaultMethodCall` implementation takes a list of prioritized interfaces.
When intercepting a method, the `DefaultMethodCall` invokes a default method on the first-mentioned interface.

## 示例

```java
public interface Dog {
    default void test() {
        System.out.println("Dog Dog Dog");
    }
}
```

```java
public interface Cat {
    default void test() {
        System.out.println("Cat Cat Cat");
    }
}
```

```java
public class HelloWorld implements Dog, Cat {
    @Override
    public void test() {
        Dog.super.test();
    }
}
```

```java
import lsieun.utils.InvokeUtils;

public class HelloWorldRun {
    public static void main(String[] args) {
        InvokeUtils.invokeAllMethods("sample.HelloWorld");
    }
}
```

```java
import net.bytebuddy.ByteBuddy;
import net.bytebuddy.description.modifier.Visibility;
import net.bytebuddy.dynamic.DynamicType;
import net.bytebuddy.implementation.DefaultMethodCall;

public class HelloWorldGenerate {
    public static void main(String[] args) {
        // 1. prepare
        String className = "sample.HelloWorld";


        // 2. weave
        ByteBuddy byteBuddy = new ByteBuddy();
        DynamicType.Builder<?> builder = byteBuddy.subclass(Object.class)
                .implement(Dog.class, Cat.class)
                .modifiers(Visibility.PUBLIC)
                .name(className);

        builder = builder.defineMethod("test", void.class, Visibility.PUBLIC)
                .intercept(
                        DefaultMethodCall.prioritize(Dog.class)
                );


        // 3. output
        DynamicType.Unloaded<?> unloadedType = builder.make();
        OutputUtils.save(unloadedType);
    }
}
```

如果使用 `SuperMethodCall`：

```text
builder = builder.defineMethod("test", void.class, Visibility.PUBLIC)
        .intercept(SuperMethodCall.INSTANCE);
```

会出现错误：

```text
java.lang.IllegalStateException: Cannot call super (or default) method for public void sample.HelloWorld.test()
```

## 注意事项

### Java 版本要求

Note that any Java class that is defined in a class file version before Java 8 does not support default methods.

```java
import net.bytebuddy.ByteBuddy;
import net.bytebuddy.ClassFileVersion;
import net.bytebuddy.description.modifier.Visibility;
import net.bytebuddy.dynamic.DynamicType;
import net.bytebuddy.implementation.DefaultMethodCall;

public class HelloWorldGenerate {
    public static void main(String[] args) {
        // 1. prepare
        String className = "sample.HelloWorld";


        // 2. weave
        ByteBuddy byteBuddy = new ByteBuddy(ClassFileVersion.JAVA_V7);    // 使用 Java 7 版本
        DynamicType.Builder<?> builder = byteBuddy.subclass(Object.class)
                .implement(Dog.class, Cat.class)
                .modifiers(Visibility.PUBLIC)
                .name(className);

        builder = builder.defineMethod("test", void.class, Visibility.PUBLIC)
                .intercept(
                        DefaultMethodCall.prioritize(Dog.class)
                );


        // 3. output
        DynamicType.Unloaded<?> unloadedType = builder.make();
        OutputUtils.save(unloadedType);
    }
}
```

会出现如下错误：

```text
java.lang.IllegalStateException: Cannot invoke default method on public void sample.HelloWorld.test()
```

解决方法：将 `ClassFileVersion.JAVA_V7` 替换成 `ClassFileVersion.JAVA_V8`。

### weaker requirements

Furthermore, you should be aware that Byte Buddy imposes weaker requirements
on the invokability of a default method compared to the Java programming language.

Byte Buddy only requires a default method's interface to be implemented by the most-specific class in a type's hierarchy.
Other than the Java programming language, it does not require this interface to be the most specific interface
that is implemented by any super class.

### unambiguousOnly

Finally, if you do not expect a ambiguous default method definitions,
you can always use `DefaultMethodCall.unambiguousOnly()` for receiving an implementation
which throws an exception on the discovery of an ambiguous default method invocation.

```java
import net.bytebuddy.ByteBuddy;
import net.bytebuddy.description.modifier.Visibility;
import net.bytebuddy.dynamic.DynamicType;
import net.bytebuddy.implementation.DefaultMethodCall;

public class HelloWorldGenerate {
    public static void main(String[] args) {
        // 1. prepare
        String className = "sample.HelloWorld";


        // 2. weave
        ByteBuddy byteBuddy = new ByteBuddy();
        DynamicType.Builder<?> builder = byteBuddy.subclass(Object.class)
                .implement(Dog.class)    // 注意一：这里只有 Dog 接口
                .modifiers(Visibility.PUBLIC)
                .name(className);

        builder = builder.defineMethod("test", void.class, Visibility.PUBLIC)
                .intercept(
                        DefaultMethodCall.unambiguousOnly()    // 注意二：这里调用 unambiguousOnly 方法
                );


        // 3. output
        DynamicType.Unloaded<?> unloadedType = builder.make();
        OutputUtils.save(unloadedType);
    }
}
```

如果我们同时使用 `Dog` 和 `Cat` 两个接口：

```text
DynamicType.Builder<?> builder = byteBuddy.subclass(Object.class)
        .implement(Dog.class, Cat.class)
        .modifiers(Visibility.PUBLIC)
        .name(className);
```

就会报错：

```text
java.lang.IllegalStateException: 
public void sample.HelloWorld.test() has an ambiguous default method with 
public void sample.Dog.test() and public void sample.Cat.test()
```

This same behavior is displayed by a prioritizing `DefaultMethodCall`
where a default method call is ambiguous between non-prioritized interfaces and
no prioritized interface was found to define a method with a compatible signature.

