---
title: "Annotation: 创建 Type"
sequence: "102"
---

## 定义 Annotation 类

### 预期目标

```java
@Retention(RetentionPolicy.RUNTIME)
@Target({ElementType.TYPE, ElementType.CONSTRUCTOR, ElementType.METHOD})
public @interface HelloWorld {
    String name();

    int age();
}
```

### 编码实现

```java
import net.bytebuddy.ByteBuddy;
import net.bytebuddy.description.annotation.AnnotationDescription;
import net.bytebuddy.description.modifier.Visibility;
import net.bytebuddy.dynamic.DynamicType;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

public class HelloWorldGenerate {
    public static void main(String[] args) {
        // 1. prepare
        String className = "sample.HelloWorld";


        // 2. weave
        ByteBuddy byteBuddy = new ByteBuddy();
        DynamicType.Builder<?> builder = byteBuddy.makeAnnotation()
                .name(className);

        // @Retention(RetentionPolicy.RUNTIME)
        AnnotationDescription retentionMetaAnnotation = AnnotationDescription.Builder
                .ofType(Retention.class)
                .define("value", RetentionPolicy.RUNTIME)
                .build();
        builder = builder.annotateType(retentionMetaAnnotation);

        // @Target({ElementType.TYPE, ElementType.CONSTRUCTOR, ElementType.METHOD})
        AnnotationDescription targetMetaAnnotation = AnnotationDescription.Builder
                .ofType(Target.class)
                .defineEnumerationArray(
                        "value",
                        ElementType.class,
                        ElementType.TYPE, ElementType.CONSTRUCTOR, ElementType.METHOD
                )
                .build();
        builder = builder.annotateType(targetMetaAnnotation);

        builder = builder.defineMethod("name", String.class, Visibility.PUBLIC)
                .withoutCode();

        builder = builder.defineMethod("age", int.class, Visibility.PUBLIC)
                .withoutCode();


        // 3. output
        DynamicType.Unloaded<?> unloadedType = builder.make();
        OutputUtils.save(unloadedType);
    }
}
```

## 默认的修饰符

在生成注解（Annotation）的过程中，ByteBuddy 会给提供相应的修饰符（modifier）信息：
`ACC_PUBLIC`、`ACC_ABSTRACT`、`ACC_INTERFACE` 和 `ACC_ANNOTATION`。

其效果，与下面的代码是一致的：

```text
DynamicType.Builder<?> builder = byteBuddy.makeAnnotation()
        .modifiers(
                Visibility.PUBLIC,
                TypeManifestation.ABSTRACT,
                TypeManifestation.INTERFACE,
                TypeManifestation.ANNOTATION
        )
        .name(className);
```

但是，如果我们提供错误的修饰符（modifier）信息，例如：

```text
DynamicType.Builder<?> builder = byteBuddy.makeAnnotation()
        .modifiers(
                Visibility.PUBLIC
        )
        .name(className);
```

就会遇到如下错误：

```text
java.lang.IllegalStateException: Cannot add @java.lang.annotation.Retention(value=RUNTIME) on class sample.HelloWorld
```

## default 值

### 预期目标

```java
@Retention(RetentionPolicy.RUNTIME)
@Target({ElementType.TYPE, ElementType.CONSTRUCTOR, ElementType.METHOD})
public @interface HelloWorld {
    String name() default "Tom";

    int age() default 10;
}
```

### 编码实现

```java
import net.bytebuddy.ByteBuddy;
import net.bytebuddy.description.annotation.AnnotationDescription;
import net.bytebuddy.description.annotation.AnnotationValue;
import net.bytebuddy.description.modifier.Visibility;
import net.bytebuddy.dynamic.DynamicType;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

public class HelloWorldGenerate {
    public static void main(String[] args) {
        // 1. prepare
        String className = "sample.HelloWorld";


        // 2. weave
        ByteBuddy byteBuddy = new ByteBuddy();
        DynamicType.Builder<?> builder = byteBuddy.makeAnnotation()
                .name(className);

        // @Retention(RetentionPolicy.RUNTIME)
        AnnotationDescription retentionMetaAnnotation = AnnotationDescription.Builder
                .ofType(Retention.class)
                .define("value", RetentionPolicy.RUNTIME)
                .build();
        builder = builder.annotateType(retentionMetaAnnotation);

        // @Target({ElementType.TYPE, ElementType.CONSTRUCTOR, ElementType.METHOD})
        AnnotationDescription targetMetaAnnotation = AnnotationDescription.Builder
                .ofType(Target.class)
                .defineEnumerationArray(
                        "value",
                        ElementType.class,
                        ElementType.TYPE, ElementType.CONSTRUCTOR, ElementType.METHOD
                )
                .build();
        builder = builder.annotateType(targetMetaAnnotation);

        builder = builder.defineMethod("name", String.class, Visibility.PUBLIC)
                .defaultValue(
                        AnnotationValue.ForConstant.of("Tom")
                );

        builder = builder.defineMethod("age", int.class, Visibility.PUBLIC)
                .defaultValue(
                        AnnotationValue.ForConstant.of(10)
                );


        // 3. output
        DynamicType.Unloaded<?> unloadedType = builder.make();
        OutputUtils.save(unloadedType);
    }
}
```

```java
import java.lang.reflect.Method;

public class Program {
    public static void main(String[] args) {
        Class<?> clazz = HelloWorld.class;
        boolean isAnnotation = clazz.isAnnotation();
        System.out.println("isAnnotation = " + isAnnotation);

        Method[] methods = clazz.getDeclaredMethods();
        for (Method m : methods) {
            String name = m.getName();
            Object defaultValue = m.getDefaultValue();
            String message = String.format("    %s: %s", name, defaultValue);
            System.out.println(message);
        }
    }
}
```
