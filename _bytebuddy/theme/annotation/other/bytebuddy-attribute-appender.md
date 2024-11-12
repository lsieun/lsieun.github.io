---
title: "Annotation: AttributeAppender"
sequence: "110"
---

A Java class file can include any custom information as a so-called **attribute**.
Such attributes can be included using Byte Buddy by using an `*AttributeAppender` for a **type**, **field** or **method**.

Attribute appenders can however also be used for defining methods based on information
that is provided by the intercepted type, field or method.

For example, it is possible to copy all annotations of an intercepted method when overriding a method in a subclass:

```java
public class Parent {
    @MyTag
    public void test() {
        System.out.println("Hello Parent");
    }
}
```

```java
import net.bytebuddy.ByteBuddy;
import net.bytebuddy.description.modifier.Visibility;
import net.bytebuddy.dynamic.DynamicType;
import net.bytebuddy.implementation.StubMethod;
import net.bytebuddy.implementation.attribute.MethodAttributeAppender;
import net.bytebuddy.matcher.ElementMatchers;

public class HelloWorldSubClass {
    public static void main(String[] args) {
        // 1. prepare
        String className = "sample.HelloWorld";


        // 2. weave
        ByteBuddy byteBuddy = new ByteBuddy();
        DynamicType.Builder<?> builder = byteBuddy.subclass(Parent.class)
                .modifiers(Visibility.PUBLIC)
                .name(className);

        builder = builder.method(ElementMatchers.named("test"))
                .intercept(StubMethod.INSTANCE)
                .attribute(MethodAttributeAppender.ForInstrumentedMethod.EXCLUDING_RECEIVER);


        // 3. output
        DynamicType.Unloaded<?> unloadedType = builder.make();
        OutputUtils.save(unloadedType, true);
    }
}
```

## redefine 和 rebase

When a class is redefined or rebased, the same rule might not apply.

By default, ByteBuddy is configured to preserve any annotations of a rebased or redefined method,
even if the method is intercepted as above.
This behavior can however be changed such that
Byte Buddy discards any preexisting annotations
by setting the `AnnotationRetention` strategy to `DISABLED`.

### redefine

```java
@MyTag
public class Parent {
    @MyTag
    public void test() {
        System.out.println("Hello Parent");
    }
}
```

```java
import net.bytebuddy.ByteBuddy;
import net.bytebuddy.dynamic.DynamicType;
import net.bytebuddy.implementation.StubMethod;
import net.bytebuddy.matcher.ElementMatchers;

public class HelloWorldRedefine {
    public static void main(String[] args) {
        // 1. prepare
        String className = "sample.HelloWorld";


        // 2. weave
        ByteBuddy byteBuddy = new ByteBuddy();
        DynamicType.Builder<?> builder = byteBuddy.redefine(Parent.class).name(className);

        builder = builder.method(ElementMatchers.named("test"))
                .intercept(StubMethod.INSTANCE);

        // 3. output
        DynamicType.Unloaded<?> unloadedType = builder.make();
        OutputUtils.save(unloadedType);
    }
}
```

输出结果：

```java
@MyTag
public class HelloWorld {
    @MyTag
    public void test() {
    }
}
```

修改代码：

```text
ByteBuddy byteBuddy = new ByteBuddy().with(AnnotationRetention.DISABLED);
```

输出结果：

```text
@MyTag
public class HelloWorld {
    public void test() {    // 无注解
    }
}
```

```java
import net.bytebuddy.ByteBuddy;
import net.bytebuddy.dynamic.DynamicType;
import net.bytebuddy.implementation.StubMethod;
import net.bytebuddy.implementation.attribute.AnnotationRetention;
import net.bytebuddy.implementation.attribute.MethodAttributeAppender;
import net.bytebuddy.matcher.ElementMatchers;

public class HelloWorldRedefine {
    public static void main(String[] args) {
        // 1. prepare
        String className = "sample.HelloWorld";


        // 2. weave
        ByteBuddy byteBuddy = new ByteBuddy().with(AnnotationRetention.DISABLED);
        DynamicType.Builder<?> builder = byteBuddy.redefine(Parent.class).name(className);

        builder = builder.method(ElementMatchers.named("test"))
                .intercept(StubMethod.INSTANCE)
                .attribute(MethodAttributeAppender.ForInstrumentedMethod.INCLUDING_RECEIVER);

        // 3. output
        DynamicType.Unloaded<?> unloadedType = builder.make();
        OutputUtils.save(unloadedType);
    }
}
```

```java
@MyTag
public class HelloWorld {
    public HelloWorld() {
    }

    @MyTag    // 有注解
    public void test() {
    }
}
```

