---
title: "Annotation: 创建 Instance"
sequence: "108"
---

```text
AnnotationDescription retentionPolicy = AnnotationDescription.Builder
        .ofType(Retention.class)
        .define("value", RetentionPolicy.RUNTIME)
        .build();
```

```text
                                                ┌─── ofType(Class<? extends Annotation> annotationType)
                                 ┌─── start ────┤
                                 │              └─── ofType(TypeDescription annotationType)
                                 │
                                 │              ┌─── common ───────┼─── define(String property, AnnotationValue<?, ?> value)
                                 │              │
                                 │              │                  ┌─── define(String property, boolean value)
                                 │              │                  │
                                 │              │                  ├─── define(String property, byte value)
                                 │              │                  │
                                 │              │                  ├─── define(String property, char value)
                                 │              │                  │
                                 │              │                  ├─── define(String property, short value)
                                 │              ├─── primitive ────┤
                                 │              │                  ├─── define(String property, int value)
                                 │              │                  │
                                 │              │                  ├─── define(String property, long value)
                                 │              │                  │
                                 │              │                  ├─── define(String property, float value)
                                 │              │                  │
                                 │              │                  └─── define(String property, double value)
                                 │              │
                                 │              ├─── string ───────┼─── define(String property, String value)
                                 │              │
                                 │              │                  ┌─── define(String property, Class<?> type)
                                 │              ├─── class ────────┤
                                 │              │                  └─── define(String property, TypeDescription typeDescription)
                                 │              │
                                 │              │                  ┌─── define(String property, Enum<?> value)
                                 │              │                  │
                                 ├─── define ───┼─── enum ─────────┼─── define(String property, TypeDescription enumerationType, String value)
                                 │              │                  │
                                 │              │                  └─── define(String property, EnumerationDescription value)
                                 │              │
                                 │              │                  ┌─── define(String property, Annotation annotation)
                                 │              ├─── annotation ───┤
AnnotationDescription.Builder ───┤              │                  └─── define(String property, AnnotationDescription annotationDescription)
                                 │              │
                                 │              │                                     ┌─── defineArray(String property, boolean... value)
                                 │              │                                     │
                                 │              │                                     ├─── defineArray(String property, byte... value)
                                 │              │                                     │
                                 │              │                                     ├─── defineArray(String property, char... value)
                                 │              │                                     │
                                 │              │                                     ├─── defineArray(String property, short... value)
                                 │              │                  ┌─── primitive ────┤
                                 │              │                  │                  ├─── defineArray(String property, int... value)
                                 │              │                  │                  │
                                 │              │                  │                  ├─── defineArray(String property, long... value)
                                 │              │                  │                  │
                                 │              │                  │                  ├─── defineArray(String property, float... value)
                                 │              │                  │                  │
                                 │              │                  │                  └─── defineArray(String property, double... value)
                                 │              │                  │
                                 │              │                  ├─── string ───────┼─── defineArray(String property, String... value)
                                 │              │                  │
                                 │              └─── array ────────┤                  ┌─── defineTypeArray(String property, Class<?>... type)
                                 │                                 ├─── class ────────┤
                                 │                                 │                  └─── defineTypeArray(String property, TypeDescription... typeDescription)
                                 │                                 │
                                 │                                 │                  ┌─── defineEnumerationArray(String property, Class<T> enumerationType, T... value)
                                 │                                 │                  │
                                 │                                 ├─── enum ─────────┼─── defineEnumerationArray(String property, TypeDescription enumerationType, String... value)
                                 │                                 │                  │
                                 │                                 │                  └─── defineEnumerationArray(String property, TypeDescription enumerationType, EnumerationDescription... value)
                                 │                                 │
                                 │                                 │                  ┌─── defineAnnotationArray(String property, Class<T> annotationType, T... annotation)
                                 │                                 └─── annotation ───┤
                                 │                                                    └─── defineAnnotationArray(String property, TypeDescription annotationType, AnnotationDescription... annotationDescription)
                                 │
                                 │
                                 └─── output ───┼─── build()
```





## Annotation Array

`AnnotationDescription.Builder.defineAnnotationArray()` 方法：

```text
public Builder defineAnnotationArray(String property, TypeDescription annotationType, AnnotationDescription... annotationDescription) {
    return define(property, AnnotationValue.ForDescriptionArray.of(annotationType, annotationDescription));
}
```

### 预期目标

修改前：

```java
public class HelloWorld {
}
```

修改后：

```java
@Author(firstname = "Tom", lastname = "Cat")
@Author(firstname = "Jerry", lastname = "Mouse")
public class HelloWorld {
}
```

或

```java
@AuthorList({
        @Author(firstname = "Tom", lastname = "Cat"),
        @Author(firstname = "Jerry", lastname = "Mouse")
})
public class HelloWorld {
}
```

其中，`Author` 定义如下：

```java
@Retention(RetentionPolicy.RUNTIME)
@Repeatable(AuthorList.class)
public @interface Author {
    String firstname();

    String lastname() default "";
}
```

其中，`AuthorList` 定义如下：

```java
@Retention(RetentionPolicy.RUNTIME)
public @interface AuthorList {
    Author[] value();
}
```

### 编码实现

```java
import net.bytebuddy.ByteBuddy;
import net.bytebuddy.description.annotation.AnnotationDescription;
import net.bytebuddy.description.type.TypeDescription;
import net.bytebuddy.dynamic.DynamicType;

public class HelloWorldTransform {
    public static void main(String[] args) {
        // 1. prepare
        String className = "sample.HelloWorld";
        Class<?> clazz = ClassUtils.loadClass(className);


        // 2. weave
        ByteBuddy byteBuddy = new ByteBuddy();
        DynamicType.Builder<?> builder = byteBuddy.redefine(clazz);

        AnnotationDescription authorAnnotation1 = AnnotationDescription.Builder.ofType(Author.class)
                .define("firstname", "Tom")
                .define("lastname", "Cat")
                .build();
        AnnotationDescription authorAnnotation2 = AnnotationDescription.Builder.ofType(Author.class)
                .define("firstname", "Jerry")
                .define("lastname", "Mouse")
                .build();
        TypeDescription authorType = TypeDescription.ForLoadedType.of(Author.class);
        AnnotationDescription authorListAnnotation = AnnotationDescription.Builder.ofType(AuthorList.class)
                .defineAnnotationArray(
                        "value",
                        authorType,
                        authorAnnotation1,
                        authorAnnotation2
                )
                .build();
        builder = builder.annotateType(authorListAnnotation);


        // 3. output
        DynamicType.Unloaded<?> unloadedType = builder.make();
        OutputUtils.save(unloadedType);
    }
}
```

