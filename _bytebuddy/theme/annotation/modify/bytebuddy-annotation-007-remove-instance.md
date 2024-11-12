---
title: "Annotation: 移除 Instance"
sequence: "107"
---

- How to add annotation to the method parameter
- How to remove annotation from the method parameter

## 类

To remove the class level annotation,
develops a derived class that extends `net.bytebuddy.asm.AsmVisitorWrapper.AbstractBase`.

### 预期目标

预期目标：移除 `HelloWorld` 类的 `@MyTag` 注解。

修改前：

```java
@MyTag
public class HelloWorld {
}
```

修改后：

```java
public class HelloWorld {
}
```

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
import net.bytebuddy.asm.AsmVisitorWrapper;
import net.bytebuddy.dynamic.DynamicType;

public class HelloWorldTransform {
    public static void main(String[] args) {
        // 1. prepare
        String className = "sample.HelloWorld";
        Class<?> clazz = ClassUtils.loadClass(className);


        // 2. weave
        ByteBuddy byteBuddy = new ByteBuddy();
        DynamicType.Builder<?> builder = byteBuddy.redefine(clazz);

        AsmVisitorWrapper asmVisitorWrapper = new RemoveClassAnnotation(MyTag.class);
        builder = builder.visit(asmVisitorWrapper);


        // 3. output
        DynamicType.Unloaded<?> unloadedType = builder.make();
        OutputUtils.save(unloadedType);
    }
}
```

```java
import net.bytebuddy.description.field.FieldDescription;
import net.bytebuddy.description.field.FieldList;
import net.bytebuddy.description.method.MethodList;
import net.bytebuddy.description.type.TypeDescription;
import net.bytebuddy.implementation.Implementation;
import net.bytebuddy.jar.asm.AnnotationVisitor;
import net.bytebuddy.jar.asm.ClassVisitor;
import net.bytebuddy.jar.asm.Opcodes;
import net.bytebuddy.jar.asm.Type;
import net.bytebuddy.pool.TypePool;

import java.lang.annotation.Annotation;

public class RemoveClassAnnotation extends AsmVisitorWrapper.AbstractBase {
    private final String annotationDesc;

    public RemoveClassAnnotation(Class<? extends Annotation> targetAnnotationClass) {
        Type type = Type.getType(targetAnnotationClass);
        this.annotationDesc = type.getDescriptor();
    }

    public RemoveClassAnnotation(String className) {
        String internalName = className.replace(".", "/");
        Type type = Type.getObjectType(internalName);
        this.annotationDesc = type.getDescriptor();
    }

    @Override
    public ClassVisitor wrap(TypeDescription instrumentedType,
                             ClassVisitor classVisitor,
                             Implementation.Context implementationContext,
                             TypePool typePool,
                             FieldList<FieldDescription.InDefinedShape> fields,
                             MethodList<?> methods,
                             int writerFlags,
                             int readerFlags) {
        return new ClassAnnotationRemovalVisitor(Opcodes.ASM9, classVisitor);
    }

    private class ClassAnnotationRemovalVisitor extends ClassVisitor {
        public ClassAnnotationRemovalVisitor(int api, ClassVisitor classVisitor) {
            super(api, classVisitor);
        }

        @Override
        public AnnotationVisitor visitAnnotation(String descriptor, boolean visible) {
            if (descriptor.equals(annotationDesc)) {
                return null;
            }
            return super.visitAnnotation(descriptor, visible);
        }
    }
}
```

## 字段

### 预期目标

修改前：

```java
public class HelloWorld {
    @MyTag
    private String strValue;

    @MyTag
    private Object objValue;
}
```

修改后：

```java
public class HelloWorld {
    private String strValue;

    @MyTag
    private Object objValue;
}
```

### 编码实现

```java
import net.bytebuddy.ByteBuddy;
import net.bytebuddy.asm.AsmVisitorWrapper;
import net.bytebuddy.description.NamedElement;
import net.bytebuddy.dynamic.DynamicType;
import net.bytebuddy.matcher.ElementMatcher;
import net.bytebuddy.matcher.ElementMatchers;

public class HelloWorldTransform {
    public static void main(String[] args) {
        // 1. prepare
        String className = "sample.HelloWorld";
        Class<?> clazz = ClassUtils.loadClass(className);


        // 2. weave
        ByteBuddy byteBuddy = new ByteBuddy();
        DynamicType.Builder<?> builder = byteBuddy.redefine(clazz);

        AsmVisitorWrapper.ForDeclaredFields.FieldVisitorWrapper fieldVisitorWrapper = new RemoveFieldAnnotation(MyTag.class);
        ElementMatcher<NamedElement> matcher = ElementMatchers.named("strValue");
        AsmVisitorWrapper asmVisitorWrapper = new AsmVisitorWrapper.ForDeclaredFields().field(matcher, fieldVisitorWrapper);
        builder = builder.visit(asmVisitorWrapper);


        // 3. output
        DynamicType.Unloaded<?> unloadedType = builder.make();
        OutputUtils.save(unloadedType);
    }
}
```

```java
import net.bytebuddy.asm.AsmVisitorWrapper;
import net.bytebuddy.description.field.FieldDescription;
import net.bytebuddy.description.type.TypeDescription;
import net.bytebuddy.jar.asm.AnnotationVisitor;
import net.bytebuddy.jar.asm.FieldVisitor;
import net.bytebuddy.jar.asm.Opcodes;
import net.bytebuddy.jar.asm.Type;

import java.lang.annotation.Annotation;

public class RemoveFieldAnnotation implements AsmVisitorWrapper.ForDeclaredFields.FieldVisitorWrapper {
    private final String annotationDesc;

    public RemoveFieldAnnotation(Class<? extends Annotation> annotationClass) {
        Type type = Type.getType(annotationClass);
        this.annotationDesc = type.getDescriptor();
    }

    public RemoveFieldAnnotation(String className) {
        String internalName = className.replace(".", "/");
        Type type = Type.getObjectType(internalName);
        this.annotationDesc = type.getDescriptor();
    }

    @Override
    public FieldVisitor wrap(TypeDescription instrumentedType,
                             FieldDescription.InDefinedShape fieldDescription,
                             FieldVisitor fieldVisitor) {
        return new FieldAnnotationRemovalAdapter(Opcodes.ASM9, fieldVisitor);
    }

    private class FieldAnnotationRemovalAdapter extends FieldVisitor {
        public FieldAnnotationRemovalAdapter(int api, FieldVisitor fieldVisitor) {
            super(api, fieldVisitor);
        }

        @Override
        public AnnotationVisitor visitAnnotation(String descriptor, boolean visible) {
            if (descriptor.equals(annotationDesc)) {
                return null;
            }
            return super.visitAnnotation(descriptor, visible);
        }
    }
}
```

## 方法

### 预期目标

预期目标：移除 `HelloWorld` 类中 `test()` 方法的 `MyTag` 注解。

修改前：

```java
public class HelloWorld {
    @MyTag
    public void test() {
    }

    @MyTag
    public void anotherMethod() {
    }
}
```

修改后：

```java
public class HelloWorld {
    public void test() {
    }

    @MyTag
    public void anotherMethod() {
    }
}
```

### 编码实现

```java
import net.bytebuddy.ByteBuddy;
import net.bytebuddy.asm.AsmVisitorWrapper;
import net.bytebuddy.description.NamedElement;
import net.bytebuddy.dynamic.DynamicType;
import net.bytebuddy.matcher.ElementMatcher;
import net.bytebuddy.matcher.ElementMatchers;

public class HelloWorldTransform {
    public static void main(String[] args) {
        // 1. prepare
        String className = "sample.HelloWorld";
        Class<?> clazz = ClassUtils.loadClass(className);


        // 2. weave
        ByteBuddy byteBuddy = new ByteBuddy();
        DynamicType.Builder<?> builder = byteBuddy.redefine(clazz);

        AsmVisitorWrapper.ForDeclaredMethods.MethodVisitorWrapper methodVisitorWrapper = new RemoveMethodAnnotation(MyTag.class);
        ElementMatcher<NamedElement> matcher = ElementMatchers.named("test");
        AsmVisitorWrapper asmVisitorWrapper = new AsmVisitorWrapper.ForDeclaredMethods().method(matcher, methodVisitorWrapper);
        builder = builder.visit(asmVisitorWrapper);


        // 3. output
        DynamicType.Unloaded<?> unloadedType = builder.make();
        OutputUtils.save(unloadedType);
    }
}
```

```java
import net.bytebuddy.asm.AsmVisitorWrapper;
import net.bytebuddy.description.method.MethodDescription;
import net.bytebuddy.description.type.TypeDescription;
import net.bytebuddy.implementation.Implementation;
import net.bytebuddy.jar.asm.AnnotationVisitor;
import net.bytebuddy.jar.asm.MethodVisitor;
import net.bytebuddy.jar.asm.Opcodes;
import net.bytebuddy.jar.asm.Type;
import net.bytebuddy.pool.TypePool;

import java.lang.annotation.Annotation;

public class RemoveMethodAnnotation implements AsmVisitorWrapper.ForDeclaredMethods.MethodVisitorWrapper {
    private final String annotationDesc;

    public RemoveMethodAnnotation(Class<? extends Annotation> annotationClass) {
        Type type = Type.getType(annotationClass);
        this.annotationDesc = type.getDescriptor();
    }

    public RemoveMethodAnnotation(String className) {
        String internalName = className.replace(".", "/");
        Type type = Type.getObjectType(internalName);
        this.annotationDesc = type.getDescriptor();
    }

    @Override
    public MethodVisitor wrap(TypeDescription instrumentedType,
                              MethodDescription instrumentedMethod,
                              MethodVisitor methodVisitor,
                              Implementation.Context implementationContext,
                              TypePool typePool,
                              int writerFlags,
                              int readerFlags) {
        return new MethodAnnotationRemovalAdapter(Opcodes.ASM9, methodVisitor);
    }

    private class MethodAnnotationRemovalAdapter extends MethodVisitor {
        public MethodAnnotationRemovalAdapter(int api, MethodVisitor methodVisitor) {
            super(api, methodVisitor);
        }

        @Override
        public AnnotationVisitor visitAnnotation(String descriptor, boolean visible) {
            if (descriptor.equals(annotationDesc)) {
                return null;
            }
            return super.visitAnnotation(descriptor, visible);
        }
    }
}
```

## 构造方法

### 预期目标

修改前：

```java
public class HelloWorld {
    @MyTag
    public HelloWorld() {
    }

    @MyTag
    public HelloWorld(String name, int age) {
    }
}
```

修改后：

```java
public class HelloWorld {
    @MyTag
    public HelloWorld() {
    }

    public HelloWorld(String name, int age) {
    }
}
```

### 编码实现

```java
import net.bytebuddy.ByteBuddy;
import net.bytebuddy.asm.AsmVisitorWrapper;
import net.bytebuddy.description.method.MethodDescription;
import net.bytebuddy.dynamic.DynamicType;
import net.bytebuddy.matcher.ElementMatcher;
import net.bytebuddy.matcher.ElementMatchers;

public class HelloWorldTransform {
    public static void main(String[] args) {
        // 1. prepare
        String className = "sample.HelloWorld";
        Class<?> clazz = ClassUtils.loadClass(className);


        // 2. weave
        ByteBuddy byteBuddy = new ByteBuddy();
        DynamicType.Builder<?> builder = byteBuddy.redefine(clazz);

        AsmVisitorWrapper.ForDeclaredMethods.MethodVisitorWrapper methodVisitorWrapper = new RemoveMethodAnnotation(MyTag.class);
        ElementMatcher<MethodDescription> matcher = ElementMatchers.isConstructor().and(
                ElementMatchers.takesArgument(0, String.class)
        ).and(
                ElementMatchers.takesArgument(1, int.class)
        );
        AsmVisitorWrapper asmVisitorWrapper = new AsmVisitorWrapper.ForDeclaredMethods().constructor(matcher, methodVisitorWrapper);
        builder = builder.visit(asmVisitorWrapper);


        // 3. output
        DynamicType.Unloaded<?> unloadedType = builder.make();
        OutputUtils.save(unloadedType);
    }
}
```

注意，对构造方法进行修改，需要使用：

```text
AsmVisitorWrapper.ForDeclaredMethods().constructor()
```

而不是使用：

```text
AsmVisitorWrapper.ForDeclaredMethods().method()
```

一次错误经历：我想移除构造方法（Constructor）上的注解（Annotation）总是不成功；
但是，替换成移除普通方法（Method）上的注解（Annotation）就能成功；
后来发现，原来是方法用错了，正确的方法应该是使用 `constructor()` 方法。

## 方法参数

### 预期目标

预期目标：移除 `HelloWorld.test()` 方法中的第 2 个参数的 `@NonZero` 注解。

修改前：

```java
public class HelloWorld {
    public void test(@NonNull String name, @NonZero int age) {
    }
}
```

修改后：

```java
public class HelloWorld {
    public void test(@NonNull String name, int age) {
    }
}
```

### 编码实现

```java
import net.bytebuddy.ByteBuddy;
import net.bytebuddy.asm.AsmVisitorWrapper;
import net.bytebuddy.description.NamedElement;
import net.bytebuddy.dynamic.DynamicType;
import net.bytebuddy.matcher.ElementMatcher;
import net.bytebuddy.matcher.ElementMatchers;

public class HelloWorldTransform {
    public static void main(String[] args) {
        // 1. prepare
        String className = "sample.HelloWorld";
        Class<?> clazz = ClassUtils.loadClass(className);


        // 2. weave
        ByteBuddy byteBuddy = new ByteBuddy();
        DynamicType.Builder<?> builder = byteBuddy.redefine(clazz);

        AsmVisitorWrapper.ForDeclaredMethods.MethodVisitorWrapper methodVisitorWrapper =
                new RemoveMethodParameterAnnotation(1, NonZero.class);
        ElementMatcher<NamedElement> matcher = ElementMatchers.named("test");
        AsmVisitorWrapper asmVisitorWrapper = new AsmVisitorWrapper.ForDeclaredMethods().method(matcher, methodVisitorWrapper);
        builder = builder.visit(asmVisitorWrapper);


        // 3. output
        DynamicType.Unloaded<?> unloadedType = builder.make();
        OutputUtils.save(unloadedType);
    }
}
```

```java
import net.bytebuddy.asm.AsmVisitorWrapper;
import net.bytebuddy.description.method.MethodDescription;
import net.bytebuddy.description.type.TypeDescription;
import net.bytebuddy.implementation.Implementation;
import net.bytebuddy.jar.asm.AnnotationVisitor;
import net.bytebuddy.jar.asm.MethodVisitor;
import net.bytebuddy.jar.asm.Opcodes;
import net.bytebuddy.jar.asm.Type;
import net.bytebuddy.pool.TypePool;

import java.lang.annotation.Annotation;

public class RemoveMethodParameterAnnotation implements AsmVisitorWrapper.ForDeclaredMethods.MethodVisitorWrapper {
    private final int paramIndex;
    private final String annotationDesc;


    public RemoveMethodParameterAnnotation(int paramIndex, Class<? extends Annotation> annotationClass) {
        this.paramIndex = paramIndex;
        Type type = Type.getType(annotationClass);
        this.annotationDesc = type.getDescriptor();
    }

    public RemoveMethodParameterAnnotation(int paramIndex, String className) {
        this.paramIndex = paramIndex;
        String internalName = className.replace(".", "/");
        Type type = Type.getObjectType(internalName);
        this.annotationDesc = type.getDescriptor();
    }

    @Override
    public MethodVisitor wrap(TypeDescription instrumentedType,
                              MethodDescription instrumentedMethod,
                              MethodVisitor methodVisitor,
                              Implementation.Context implementationContext,
                              TypePool typePool,
                              int writerFlags,
                              int readerFlags) {
        return new MethodParameterAnnotationRemovalAdapter(Opcodes.ASM9, methodVisitor);
    }

    private class MethodParameterAnnotationRemovalAdapter extends MethodVisitor {
        public MethodParameterAnnotationRemovalAdapter(int api, MethodVisitor methodVisitor) {
            super(api, methodVisitor);
        }

        @Override
        public AnnotationVisitor visitParameterAnnotation(int parameter, String descriptor, boolean visible) {
            if (paramIndex == parameter && descriptor.equals(annotationDesc)) {
                return null;
            }
            return super.visitParameterAnnotation(parameter, descriptor, visible);
        }
    }
}
```

