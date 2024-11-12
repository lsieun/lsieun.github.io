---
title: "注解 Annotation"
sequence: "103"
---

预期目标：

```java
@Retention(RetentionPolicy.RUNTIME)
@Target({ElementType.TYPE, ElementType.CONSTRUCTOR, ElementType.METHOD})
public @interface HelloWorld {
    String name();

    int age();
}
```

编码实现：

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
