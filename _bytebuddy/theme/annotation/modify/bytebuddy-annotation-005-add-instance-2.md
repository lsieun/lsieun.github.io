---
title: "Annotation: 添加 Instance (2)"
sequence: "105"
---

## 类：创建注解实例

As insinuated by Java's `@interface` keyword,
**annotations** are internally represented as **interface types**.

> annotation 本质上是一个 interface

```java
public @interface Marker {
}
```

As a consequence, **annotations can be implemented by a Java class just like an ordinary interface.**

> annotation 可以被具体实现

```java
import java.lang.annotation.Annotation;

public class HelloWorld implements Marker {

    @Override
    public Class<? extends Annotation> annotationType() {
        return Marker.class;
    }
}
```

The only difference to implementing an interface is **an annotation's implicit `annotationType` method**
which determines the annotation type a class represents.
The latter method usually returns the implemented **annotation type's class literal**.

> 与 interface 不同的地方在于：annotation 需要实现 annotationType() 方法

Other than that, any **annotation property** is implemented as if it was an interface method.

> 相同之处：annotation property 需要具体实现

```java
@Retention(RetentionPolicy.RUNTIME)
public @interface Version {
    int major();

    int minor();
}
```

```java
public class HelloWorld implements Version {

    @Override
    public Class<? extends Annotation> annotationType() {
        return Version.class;
    }

    @Override
    public int major() {
        return 1;
    }

    @Override
    public int minor() {
        return 2;
    }
}
```

However, note that an **annotation's default values** need to be repeated by an annotation method's implementation.

> 注意事项：annotation's default values 需要具体实现

```java
public @interface Author {
    String firstname();

    String lastname() default "";
}
```

```java
public class HelloWorld implements Author {

    @Override
    public Class<? extends Annotation> annotationType() {
        return Author.class;
    }

    @Override
    public String firstname() {
        return "Tom";
    }

    @Override
    public String lastname() {
        return "Cat";
    }
}
```

### 示例一: Marker

```java
public @interface Marker {
}
```

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

        Marker tag = new Marker() {
            @Override
            public Class<? extends Annotation> annotationType() {
                return Marker.class;
            }
        };
        builder = builder.annotateType(tag);


        // 3. output
        DynamicType.Unloaded<?> unloadedType = builder.make();
        OutputUtils.save(unloadedType);
    }
}
```

### 示例二: property

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

        Version tag = new Version() {
            @Override
            public Class<? extends Annotation> annotationType() {
                return Version.class;
            }

            @Override
            public int major() {
                return 1;
            }

            @Override
            public int minor() {
                return 2;
            }
        };
        builder = builder.annotateType(tag);


        // 3. output
        DynamicType.Unloaded<?> unloadedType = builder.make();
        OutputUtils.save(unloadedType);
    }
}
```

### 示例三: default

```java
@Retention(RetentionPolicy.RUNTIME)
public @interface Author {
    String firstname();

    String lastname() default "";
}
```

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

        Author tag = new Author(){
            @Override
            public Class<? extends Annotation> annotationType() {
                return Author.class;
            }

            @Override
            public String firstname() {
                return "Tom";
            }

            @Override
            public String lastname() {
                return "Cat";
            }
        };
        builder = builder.annotateType(tag);


        // 3. output
        DynamicType.Unloaded<?> unloadedType = builder.make();
        OutputUtils.save(unloadedType);
    }
}
```

## 字段和方法

```java
@Marker
public class HelloWorld {
    @Marker
    private String strValue;

    @Marker
    public void test(String name, @Marker int age) {
    }
}
```

```java
import net.bytebuddy.ByteBuddy;
import net.bytebuddy.description.modifier.Visibility;
import net.bytebuddy.dynamic.DynamicType;
import net.bytebuddy.implementation.StubMethod;

import java.lang.annotation.Annotation;

public class HelloWorldGenerate {
    public static void main(String[] args) {
        // 1. prepare
        String className = "sample.HelloWorld";


        // 2. weave
        ByteBuddy byteBuddy = new ByteBuddy();
        DynamicType.Builder<?> builder = byteBuddy.subclass(Object.class)
                .modifiers(Visibility.PUBLIC)
                .name(className);

        Marker tag = new Marker() {
            @Override
            public Class<? extends Annotation> annotationType() {
                return Marker.class;
            }
        };

        builder = builder.annotateType(tag);

        builder = builder.defineField("strValue", String.class, Visibility.PRIVATE)
                .annotateField(tag);

        builder = builder.defineMethod("test", void.class, Visibility.PUBLIC)
                .withParameter(String.class, "name")
                .withParameter(int.class, "age")
                .intercept(StubMethod.INSTANCE)
                .annotateMethod(tag)
                .annotateParameter(1, tag);


        // 3. output
        DynamicType.Unloaded<?> unloadedType = builder.make();
        OutputUtils.save(unloadedType);
    }
}
```

By default, a ByteBuddy configuration does not predefine any annotations for a dynamically created type or type member.
However, this behavior can be altered by providing a default `TypeAttributeAppender`, `MethodAttributeAppender` or `FieldAttributeAppender`.
Note that such default appenders are not additive but replace their former values.

Sometimes, **it is desirable to not load an annotation type** or the types of any of its properties when defining a class.
For this purpose, it is possible to use the `AnnotationDescription.Builder`
which offers a fluent interface for defining an annotation
without triggering class loading but at the costs of type safety.
All annotation properties are however evaluated at runtime.

By default, Byte Buddy includes any property of an annotation into a class file,
including default properties that are specified implicitly by a `default` value.
This behavior can however be customized by providing an `AnnotationFilter` to a `ByteBuddy` instance.

