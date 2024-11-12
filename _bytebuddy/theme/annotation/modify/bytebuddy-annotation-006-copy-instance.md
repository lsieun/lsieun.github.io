---
title: "Annotation: 复制 Instance"
sequence: "106"
---

## 类：复制注解

### 预期目标

预期目标：将 `GoodChild` 类的注解复制给 `HelloWorld` 类。

```java
@Version(major = 1, minor = 2)
@Author(firstname = "Tom", lastname = "Cat")
public class GoodChild {
}
```

```java
public class HelloWorld {
}
```

### 编码实现

```java
import net.bytebuddy.ByteBuddy;
import net.bytebuddy.dynamic.DynamicType;

import java.lang.annotation.Annotation;

public class HelloWorldTransform {
    public static void main(String[] args) {
        // 1. prepare
        String className = "sample.HelloWorld";
        Class<?> clazz = ClassUtils.loadClass(className);


        // 2. weave
        ByteBuddy byteBuddy = new ByteBuddy();
        DynamicType.Builder<?> builder = byteBuddy.redefine(clazz);

        Annotation[] declaredAnnotations = GoodChild.class.getDeclaredAnnotations();
        for (Annotation annotation : declaredAnnotations) {
            builder = builder.annotateType(annotation);
        }


        // 3. output
        DynamicType.Unloaded<?> unloadedType = builder.make();
        OutputUtils.save(unloadedType);
    }
}
```

## 继承父类的注解

However, annotations on a class are not retained for its subclasses
as long as this behavior is explicitly required by defining an annotation to be `@Inherited`.

> 注解（Annotation）默认情况下，是不会被继承的；除非有 @Inherited

```java
@Inherited
@Retention(RetentionPolicy.RUNTIME)
public @interface Money {
}
```

```java
@Marker
@Money
public class Parent {
}
```

```java
public class HelloWorld extends Parent {
}
```

```java
import java.lang.annotation.Annotation;

public class HelloWorldRun {
    public static void main(String[] args) {
        Class<?> clazz = HelloWorld.class;
        Annotation[] annotations = clazz.getAnnotations();
        for (Annotation ann : annotations) {
            System.out.println(ann);
        }
    }
}
```

输出结果：

```text
@lsieun.annotation.Money()
```

Using Byte Buddy, creating subclass proxies
that retain their base class's annotations is easy by invoking the `attribute` method of Byte Buddy's domain specific language.
This methods expects a `TypeAttributeAppender` as its argument.

```java
public interface DynamicType {
    interface Builder<T> {
        Builder<T> attribute(TypeAttributeAppender typeAttributeAppender);
    }
}
```

A type attribute appender offers a flexible way for **defining the annotations of a dynamically created class**, based on its base class.
For example, by passing a `TypeAttributeAppender.ForSuperType`,
a class's annotations are copied to its dynamically created subclasses.


```java
import net.bytebuddy.ByteBuddy;
import net.bytebuddy.dynamic.DynamicType;
import net.bytebuddy.implementation.StubMethod;
import net.bytebuddy.implementation.attribute.AnnotationRetention;
import net.bytebuddy.matcher.ElementMatchers;

public class HelloWorldRedefine {
    public static void main(String[] args) {
        // 1. prepare
        String className = "sample.HelloWorld";


        // 2. weave
        ByteBuddy byteBuddy = new ByteBuddy().with(AnnotationRetention.ENABLED);
        DynamicType.Builder<?> builder = byteBuddy.redefine(Parent.class).name(className);

        builder = builder.method(ElementMatchers.named("speak"))
                .intercept(StubMethod.INSTANCE);

        // 3. output
        DynamicType.Unloaded<?> unloadedType = builder.make();
        OutputUtils.save(unloadedType);
    }
}
```

Note that annotations and type attribute appenders are additive and
no annotation type must be defined more than once for any class.
