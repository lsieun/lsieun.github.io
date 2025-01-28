---
title: "decorate: Annotation + Attribute"
sequence: "112"
---

Decorates a type with `net.bytebuddy.asm.AsmVisitorWrapper` and allows adding **attributes** and **annotations**.

> 可以做：attribute + annotation

A decoration does not allow for any standard transformations.

> 不能做：transformation

But a decoration can be used as a **performance optimization** compared to a **redefinition**,
especially when implementing a **Java agent** that only applies ASM-based code changes.

> 可以做：Java Agent 场景下的 performance optimization

```java
import net.bytebuddy.ByteBuddy;
import net.bytebuddy.description.annotation.AnnotationDescription;
import net.bytebuddy.dynamic.DynamicType;

public class HelloWorldGenerate {
    public static void main(String[] args) {
        // 1. prepare
        String className = "sample.HelloWorld";
        Class<?> clazz = ClassUtils.loadClass(className);


        // 2. weave
        ByteBuddy byteBuddy = new ByteBuddy();
        DynamicType.Builder<?> builder = byteBuddy.decorate(clazz);

        AnnotationDescription tag = AnnotationDescription.Builder.ofType(MyTag.class).build();
        builder = builder.annotateType(tag);

        // 不能修改名字 Cannot change name of decorated type
        // builder = builder.name(className);

        // 不能添加字段 Cannot define field for decorated type
        // builder = builder.defineField("name", String.class, Visibility.PRIVATE);

        // 不能添加方法 Cannot define method for decorated type
        // builder = builder.defineMethod("test", void.class, Visibility.PUBLIC).intercept(StubMethod.INSTANCE);


        // 3. output
        DynamicType.Unloaded<?> unloadedType = builder.make();
        OutputUtils.save(unloadedType);
    }
}
```
