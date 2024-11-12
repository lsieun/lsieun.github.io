---
title: "Annotation: 添加 Instance"
sequence: "104"
---

## 类

如果想给类（Class）添加注解（Annotation），可以使用 `DynamicType.Builder.annotateType()` 方法：

```text
                                  ┌─── attribute ────┼─── attribute(TypeAttributeAppender typeAttributeAppender)
                                  │
                                  │
DynamicType.Builder: attribute ───┤                  ┌─── annotateType(Annotation... annotation)
                                  │                  │
                                  │                  ├─── annotateType(List<? extends Annotation> annotations)
                                  └─── annotation ───┤
                                                     ├─── annotateType(AnnotationDescription... annotation)
                                                     │
                                                     └─── annotateType(Collection<? extends AnnotationDescription> annotations)
```

The `DynamicType.Builder.annotateType()` method is the method
that adds annotation to the Java class.

```text
Builder<T> annotateType(AnnotationDescription... annotation);
```

The `net.bytebuddy.description.annotation.AnnotationDescription` is the fundamental Java class
used in annotation programming in ByteBuddy.

The `AnnotationDescription` is used to create the variable that represents the Java annotation.

```text
AnnotationDescription.Builder.ofType(MyTag.class).build();
```

### 预期目标

预期目标：给 `HelloWorld` 类添加 `@MyTag` 注解。

修改前：

```java
public class HelloWorld {
}
```

修改后：

```java
@MyTag
public class HelloWorld {
}
```

其中，`MyTag` 类定义如下：

```java
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;

@Retention(RetentionPolicy.RUNTIME)
public @interface MyTag {
}
```

### 编码实现

```java
import net.bytebuddy.ByteBuddy;
import net.bytebuddy.description.annotation.AnnotationDescription;
import net.bytebuddy.dynamic.DynamicType;

public class HelloWorldTransform {
    public static void main(String[] args) {
        // 1. prepare
        String className = "sample.HelloWorld";
        Class<?> clazz = ClassUtils.loadClass(className);


        // 2. weave
        ByteBuddy byteBuddy = new ByteBuddy();
        DynamicType.Builder<?> builder = byteBuddy.redefine(clazz);

        AnnotationDescription tag = AnnotationDescription.Builder.ofType(MyTag.class).build();
        builder = builder.annotateType(tag);


        // 3. output
        DynamicType.Unloaded<?> unloadedType = builder.make();
        OutputUtils.save(unloadedType);
    }
}
```


## 字段

```text
                                                                 ┌─── annotate(Annotation... annotation)
                                                                 │
                                                                 ├─── annotate(List<? extends Annotation> annotations)
                                                                 │
                                              ┌─── annotation ───┼─── annotate(AnnotationDescription... annotation)
                                              │                  │
                                              │                  ├─── annotate(Collection<? extends AnnotationDescription> annotations)
                            ┌─── ForField ────┤                  │
                            │                 │                  └─── attribute(FieldAttributeAppender.Factory attributeAppenderFactory)
                            │                 │
                            │                 └─── on ───────────┼─── on(ElementMatcher<? super FieldDescription.InDefinedShape> matcher)
                            │
                            │
                            │                                                      ┌─── annotateMethod(Annotation... annotation)
                            │                                                      │
                            │                                                      ├─── annotateMethod(List<? extends Annotation> annotations)
                            │                                    ┌─── method ──────┤
MemberAttributeExtension ───┤                                    │                 ├─── annotateMethod(AnnotationDescription... annotation)
                            │                                    │                 │
                            │                                    │                 └─── annotateMethod(Collection<? extends AnnotationDescription> annotations)
                            │                                    │
                            │                                    │                 ┌─── annotateParameter(int index, Annotation... annotation)
                            │                                    │                 │
                            │                 ┌─── annotation ───┤                 ├─── annotateParameter(int index, List<? extends Annotation> annotations)
                            │                 │                  ├─── parameter ───┤
                            │                 │                  │                 ├─── annotateParameter(int index, AnnotationDescription... annotation)
                            │                 │                  │                 │
                            └─── ForMethod ───┤                  │                 └─── annotateParameter(int index, Collection<? extends AnnotationDescription> annotations)
                                              │                  │
                                              │                  └─── common ──────┼─── attribute(MethodAttributeAppender.Factory attributeAppenderFactory)
                                              │
                                              └─── on ───────────┼─── on(ElementMatcher<? super MethodDescription> matcher)
```

### 预期目标

预期目标：为 `HelloWorld` 类的 `strValue` 字段添加 `@MyTag` 注解。

修改前：

```java
public class HelloWorld {
    private String strValue;
}
```

修改后：

```java
public class HelloWorld {
    @MyTag
    private String strValue;
}
```

### 编码实现

```java
import net.bytebuddy.ByteBuddy;
import net.bytebuddy.asm.AsmVisitorWrapper;
import net.bytebuddy.asm.MemberAttributeExtension;
import net.bytebuddy.description.annotation.AnnotationDescription;
import net.bytebuddy.dynamic.DynamicType;
import net.bytebuddy.matcher.ElementMatchers;

public class HelloWorldTransform {
    public static void main(String[] args) {
        // 1. prepare
        String className = "sample.HelloWorld";
        Class<?> clazz = ClassUtils.loadClass(className);


        // 2. weave
        ByteBuddy byteBuddy = new ByteBuddy();
        DynamicType.Builder<?> builder = byteBuddy.redefine(clazz);

        AnnotationDescription myAnnotation = AnnotationDescription.Builder
                .ofType(MyTag.class)
                .build();
        AsmVisitorWrapper asmVisitorWrapper = new MemberAttributeExtension.ForField()
                .annotate(myAnnotation)
                .on(ElementMatchers.named("strValue"));
        builder = builder.visit(asmVisitorWrapper);


        // 3. output
        DynamicType.Unloaded<?> unloadedType = builder.make();
        OutputUtils.save(unloadedType);
    }
}
```

## 方法

```text
                                                                 ┌─── annotate(Annotation... annotation)
                                                                 │
                                                                 ├─── annotate(List<? extends Annotation> annotations)
                                                                 │
                                              ┌─── annotation ───┼─── annotate(AnnotationDescription... annotation)
                                              │                  │
                                              │                  ├─── annotate(Collection<? extends AnnotationDescription> annotations)
                            ┌─── ForField ────┤                  │
                            │                 │                  └─── attribute(FieldAttributeAppender.Factory attributeAppenderFactory)
                            │                 │
                            │                 └─── on ───────────┼─── on(ElementMatcher<? super FieldDescription.InDefinedShape> matcher)
                            │
                            │
                            │                                                      ┌─── annotateMethod(Annotation... annotation)
                            │                                                      │
                            │                                                      ├─── annotateMethod(List<? extends Annotation> annotations)
                            │                                    ┌─── method ──────┤
MemberAttributeExtension ───┤                                    │                 ├─── annotateMethod(AnnotationDescription... annotation)
                            │                                    │                 │
                            │                                    │                 └─── annotateMethod(Collection<? extends AnnotationDescription> annotations)
                            │                                    │
                            │                                    │                 ┌─── annotateParameter(int index, Annotation... annotation)
                            │                                    │                 │
                            │                 ┌─── annotation ───┤                 ├─── annotateParameter(int index, List<? extends Annotation> annotations)
                            │                 │                  ├─── parameter ───┤
                            │                 │                  │                 ├─── annotateParameter(int index, AnnotationDescription... annotation)
                            │                 │                  │                 │
                            └─── ForMethod ───┤                  │                 └─── annotateParameter(int index, Collection<? extends AnnotationDescription> annotations)
                                              │                  │
                                              │                  └─── common ──────┼─── attribute(MethodAttributeAppender.Factory attributeAppenderFactory)
                                              │
                                              └─── on ───────────┼─── on(ElementMatcher<? super MethodDescription> matcher)
```

The instrumentation requires an instance of `net.bytebuddy.asm.MemberAttributeExtension.ForMethod`:

- `annotateMethod`: add annotation at method level
- `annotateParameter`: add annotation at method parameter level

### 预期目标

预期目标：为 `HelloWorld` 类的 `test()` 方法添加 `@MyTag` 注解。

修改前：

```java
public class HelloWorld {
    public void test() {
    }
}
```

修改后：

```java
public class HelloWorld {
    @MyTag
    public void test() {
    }
}
```

### 编码实现

```java
import net.bytebuddy.ByteBuddy;
import net.bytebuddy.asm.AsmVisitorWrapper;
import net.bytebuddy.asm.MemberAttributeExtension;
import net.bytebuddy.description.annotation.AnnotationDescription;
import net.bytebuddy.dynamic.DynamicType;
import net.bytebuddy.matcher.ElementMatchers;

public class HelloWorldTransform {
    public static void main(String[] args) {
        // 1. prepare
        String className = "sample.HelloWorld";
        Class<?> clazz = ClassUtils.loadClass(className);


        // 2. weave
        ByteBuddy byteBuddy = new ByteBuddy();
        DynamicType.Builder<?> builder = byteBuddy.redefine(clazz);

        AnnotationDescription myAnnotation = AnnotationDescription.Builder
                .ofType(MyTag.class)
                .build();
        AsmVisitorWrapper asmVisitorWrapper = new MemberAttributeExtension.ForMethod()
                .annotateMethod(myAnnotation)
                .on(ElementMatchers.named("test"));
        builder = builder.visit(asmVisitorWrapper);


        // 3. output
        DynamicType.Unloaded<?> unloadedType = builder.make();
        OutputUtils.save(unloadedType);
    }
}
```

## 构造方法

### 预期目标

预期目标：为 `HelloWorld` 类的构造方法添加 `@MyTag` 注解。

修改前：

```java
public class HelloWorld {
    public HelloWorld(String name, int age) {
    }
}
```

修改后：

```java
public class HelloWorld {
    @MyTag
    public HelloWorld(String name, int age) {
    }
}
```

### 编码实现

```java
import net.bytebuddy.ByteBuddy;
import net.bytebuddy.asm.AsmVisitorWrapper;
import net.bytebuddy.asm.MemberAttributeExtension;
import net.bytebuddy.description.annotation.AnnotationDescription;
import net.bytebuddy.dynamic.DynamicType;
import net.bytebuddy.matcher.ElementMatchers;

public class HelloWorldTransform {
    public static void main(String[] args) {
        // 1. prepare
        String className = "sample.HelloWorld";
        Class<?> clazz = ClassUtils.loadClass(className);


        // 2. weave
        ByteBuddy byteBuddy = new ByteBuddy();
        DynamicType.Builder<?> builder = byteBuddy.redefine(clazz);

        AnnotationDescription myAnnotation = AnnotationDescription.Builder
                .ofType(MyTag.class)
                .build();
        AsmVisitorWrapper asmVisitorWrapper = new MemberAttributeExtension.ForMethod()
                .annotateMethod(myAnnotation)
                .on(
                        ElementMatchers.isConstructor().and(
                                ElementMatchers.takesArgument(0, String.class)
                        ).and(
                                ElementMatchers.takesArgument(1, int.class)
                        )
                );
        builder = builder.visit(asmVisitorWrapper);


        // 3. output
        DynamicType.Unloaded<?> unloadedType = builder.make();
        OutputUtils.save(unloadedType);
    }
}
```

## 方法参数

### 预期目标

预期目标：为 `HelloWorld` 类的 `test` 方法的两个参数添加 `@NonNull` 和 `@NonZero` 注解。

修改前：

```java
public class HelloWorld {
    public void test(String name, int age) {
    }
}
```

修改后：

```java
public class HelloWorld {
    public void test(@NonNull String name, @NonZero int age) {
    }
}
```

### 编码实现

```java
import net.bytebuddy.ByteBuddy;
import net.bytebuddy.asm.AsmVisitorWrapper;
import net.bytebuddy.asm.MemberAttributeExtension;
import net.bytebuddy.description.annotation.AnnotationDescription;
import net.bytebuddy.dynamic.DynamicType;
import net.bytebuddy.matcher.ElementMatchers;

public class HelloWorldTransform {
    public static void main(String[] args) {
        // 1. prepare
        String className = "sample.HelloWorld";
        Class<?> clazz = ClassUtils.loadClass(className);


        // 2. weave
        ByteBuddy byteBuddy = new ByteBuddy();
        DynamicType.Builder<?> builder = byteBuddy.redefine(clazz);

        AnnotationDescription nonNullAnnotation = AnnotationDescription.Builder
                .ofType(NonNull.class)
                .build();
        AnnotationDescription nonZeroAnnotation = AnnotationDescription.Builder
                .ofType(NonZero.class)
                .build();
        AsmVisitorWrapper asmVisitorWrapper = new MemberAttributeExtension.ForMethod()
                .annotateParameter(0, nonNullAnnotation)
                .annotateParameter(1, nonZeroAnnotation)
                .on(
                        ElementMatchers.named("test")
                );
        builder = builder.visit(asmVisitorWrapper);


        // 3. output
        DynamicType.Unloaded<?> unloadedType = builder.make();
        OutputUtils.save(unloadedType);
    }
}
```



