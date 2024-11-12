---
title: "静态代码块：initializer()"
sequence: "105"
---

## API

### 在哪儿用

```java
public interface DynamicType extends ClassFileLocator {
    interface Builder<T> {
        Builder<T> initializer(ByteCodeAppender byteCodeAppender);

        Builder<T> initializer(LoadedTypeInitializer loadedTypeInitializer);
    }
}
```

预期目标：当 `HelloWorld` 类进行加载之后，打印一条语句。

第一种方式：

```java
public class HelloWorld {
    static {
        System.out.println("Hello Class Initializer");
    }
}
```

```java
public class HelloWorldRun {
    public static void main(String[] args) {
        ClassLoader classLoader = ClassLoader.getSystemClassLoader();
        Class.forName("sample.HelloWorld", true, classLoader);
    }
}
```

第二种方式：

```java
public class HelloWorld {
}
```

```java
public class HelloWorldRun {
    public static void main(String[] args) {
        ClassLoader classLoader = ClassLoader.getSystemClassLoader();
        Class.forName("sample.HelloWorld", true, classLoader);
        System.out.println("Hello Class Initializer");
    }
}
```





## clinit 示例

```text
clinit = cl + init = class + initializer
```

### 方式一：ByteCodeAppender

预期目标：

```java
public class HelloWorld {
    static {
        System.out.println("Hello Type Initializer");
    }
}
```

编码实现：

```java
import net.bytebuddy.ByteBuddy;
import net.bytebuddy.description.modifier.Visibility;
import net.bytebuddy.dynamic.DynamicType;

public class HelloWorldSubClass {
    public static void main(String[] args) {
        // 1. prepare
        String className = "sample.HelloWorld";


        // 2. weave
        ByteBuddy byteBuddy = new ByteBuddy();
        DynamicType.Builder<?> builder = byteBuddy.subclass(Object.class)
                .modifiers(Visibility.PUBLIC)
                .name(className);

        builder = builder.initializer(SysOutPrint.of("Hello Type Initializer"));


        // 3. output
        DynamicType.Unloaded<?> unloadedType = builder.make();
        OutputUtils.save(unloadedType);
    }
}
```

```java
import net.bytebuddy.description.field.FieldDescription;
import net.bytebuddy.description.method.MethodDescription;
import net.bytebuddy.implementation.Implementation;
import net.bytebuddy.implementation.bytecode.ByteCodeAppender;
import net.bytebuddy.implementation.bytecode.StackManipulation;
import net.bytebuddy.implementation.bytecode.constant.JavaConstantValue;
import net.bytebuddy.implementation.bytecode.member.FieldAccess;
import net.bytebuddy.implementation.bytecode.member.MethodInvocation;
import net.bytebuddy.utility.JavaConstant;
import org.objectweb.asm.MethodVisitor;

import java.io.PrintStream;
import java.lang.reflect.Field;
import java.lang.reflect.Method;

public class SysOutPrint implements ByteCodeAppender {

    private final Object paramValue;
    private final Field outField;
    private final Method printMethod;

    private SysOutPrint(Class<?> paramType, Object paramValue) throws NoSuchFieldException, NoSuchMethodException {
        this.paramValue = paramValue;

        this.outField = System.class.getField("out");
        this.printMethod = PrintStream.class.getMethod("println", paramType);
    }

    @Override
    public Size apply(MethodVisitor methodVisitor,
                      Implementation.Context implementationContext,
                      MethodDescription instrumentedMethod) {

        FieldDescription fieldDesc = new FieldDescription.ForLoadedField(outField);
        JavaConstant cst = JavaConstant.Simple.ofLoaded(paramValue);
        MethodDescription methodDesc = new MethodDescription.ForLoadedMethod(printMethod);

        StackManipulation stackManipulation = new StackManipulation.Compound(
                FieldAccess.forField(fieldDesc).read(),    // getstatic java/lang/System.out
                new JavaConstantValue(cst),                // ldc "Hello Type Initializer"
                MethodInvocation.invoke(methodDesc)        // invokevirtual java/io/PrintStream.println
        );
        StackManipulation.Size size = stackManipulation.apply(methodVisitor, implementationContext);

        return new Size(size.getMaximalSize(), instrumentedMethod.getStackSize());
    }

    public static SysOutPrint of(String str) {
        return of(String.class, str);
    }

    public static SysOutPrint of(Class<?> clazz, Object obj) {
        try {
            return new SysOutPrint(clazz, obj);
        } catch (NoSuchFieldException | NoSuchMethodException e) {
            throw new RuntimeException(e);
        }
    }
}
```

### 方式二：ElementMatcher

```java
import net.bytebuddy.ByteBuddy;
import net.bytebuddy.description.modifier.Visibility;
import net.bytebuddy.dynamic.DynamicType;
import net.bytebuddy.implementation.MethodCall;
import net.bytebuddy.matcher.ElementMatchers;

import java.io.PrintStream;
import java.lang.reflect.Field;
import java.lang.reflect.Method;

public class HelloWorldSubClass {
    public static void main(String[] args) {
        // 1. prepare
        String className = "sample.HelloWorld";


        // 2. weave
        ByteBuddy byteBuddy = new ByteBuddy();
        DynamicType.Builder<?> builder = byteBuddy.subclass(Object.class)
                .modifiers(Visibility.PUBLIC)
                .name(className);

        Method targetMethod = PrintStream.class.getDeclaredMethod("println", String.class);
        Field targetField = System.class.getDeclaredField("out");

        builder = builder.invokable(ElementMatchers.isTypeInitializer())
                .intercept(
                        MethodCall.invoke(targetMethod)
                                .onField(targetField)
                                .with("Hello World")
                );


        // 3. output
        DynamicType.Unloaded<?> unloadedType = builder.make();
        OutputUtils.save(unloadedType);
    }
}
```

### 方式三：defineMethod

预期目标：

```java
public class HelloWorld {
    static {
        System.out.println("Hello Class Initializer");
    }
}
```

编码实现：

```java
import net.bytebuddy.ByteBuddy;
import net.bytebuddy.description.method.MethodDescription;
import net.bytebuddy.description.modifier.Ownership;
import net.bytebuddy.description.modifier.Visibility;
import net.bytebuddy.dynamic.DynamicType;
import net.bytebuddy.dynamic.scaffold.TypeValidation;
import net.bytebuddy.implementation.MethodCall;

import java.io.PrintStream;
import java.lang.reflect.Field;
import java.lang.reflect.Method;

public class HelloWorldSubClass {
    public static void main(String[] args) {
        // 1. prepare
        String className = "sample.HelloWorld";


        // 2. weave
        ByteBuddy byteBuddy = new ByteBuddy().with(TypeValidation.DISABLED); // 注意，这里使用了 TypeValidation.DISABLED
        DynamicType.Builder<?> builder = byteBuddy.subclass(Object.class)
                .modifiers(Visibility.PUBLIC)
                .name(className);

        Method targetMethod = PrintStream.class.getDeclaredMethod("println", String.class);
        Field targetField = System.class.getDeclaredField("out");

        builder = builder.defineMethod(MethodDescription.TYPE_INITIALIZER_INTERNAL_NAME, void.class, Visibility.PUBLIC, Ownership.STATIC)
                .intercept(
                        MethodCall.invoke(targetMethod)
                                .onField(targetField)
                                .with("Hello Class Initializer")
                );


        // 3. output
        DynamicType.Unloaded<?> unloadedType = builder.make();
        OutputUtils.save(unloadedType);
    }
}
```

## LoadedTypeInitializer

### 示例一

```java
import net.bytebuddy.implementation.LoadedTypeInitializer;

import java.io.Serializable;

public class MyLoadedTypeInitializer implements LoadedTypeInitializer, Serializable {
    @Override
    public void onLoad(Class<?> type) {
        System.out.println("Hello LoadedTypeInitializer");
    }

    @Override
    public boolean isAlive() {
        return true;
    }
}
```

```java
import net.bytebuddy.ByteBuddy;
import net.bytebuddy.description.modifier.Visibility;
import net.bytebuddy.dynamic.DynamicType;
import net.bytebuddy.dynamic.loading.ClassLoadingStrategy;

public class HelloWorldSubClass {
    public static void main(String[] args) {
        // 1. prepare
        String className = "sample.HelloWorld";


        // 2. weave
        ByteBuddy byteBuddy = new ByteBuddy();
        DynamicType.Builder<?> builder = byteBuddy.subclass(Object.class)
                .modifiers(Visibility.PUBLIC)
                .name(className);


        builder = builder.initializer(new MyLoadedTypeInitializer());


        // 3. output
        DynamicType.Unloaded<?> unloadedType = builder.make();
        OutputUtils.save(unloadedType);


        // 第四步，加载
        System.out.println("Before Load");
        DynamicType.Loaded<?> loadedType = unloadedType.load(
                ClassLoader.getPlatformClassLoader(),
                ClassLoadingStrategy.Default.CHILD_FIRST
        );
        Class<?> clazz = loadedType.getLoaded();
        System.out.println("After Load: " + clazz.getName());
    }
}
```

### 示例二

```java
import net.bytebuddy.ByteBuddy;
import net.bytebuddy.description.modifier.Ownership;
import net.bytebuddy.description.modifier.Visibility;
import net.bytebuddy.dynamic.DynamicType;
import net.bytebuddy.dynamic.loading.ClassLoadingStrategy;
import net.bytebuddy.implementation.LoadedTypeInitializer;

import java.lang.reflect.Field;

public class HelloWorldSubClass {
    public static void main(String[] args) {
        // 1. prepare
        String className = "sample.HelloWorld";


        // 2. weave
        ByteBuddy byteBuddy = new ByteBuddy();
        DynamicType.Builder<?> builder = byteBuddy.subclass(Object.class)
                .modifiers(Visibility.PUBLIC)
                .name(className);


        builder = builder.defineField("obj", Object.class, Visibility.PUBLIC, Ownership.STATIC);

        GoodChild child = new GoodChild();
        builder = builder.initializer(new LoadedTypeInitializer.ForStaticField("obj", child));


        // 3. output
        DynamicType.Unloaded<?> unloadedType = builder.make();
        OutputUtils.save(unloadedType);


        // 第四步，加载
        DynamicType.Loaded<?> loadedType = unloadedType.load(ClassLoader.getPlatformClassLoader(), ClassLoadingStrategy.Default.CHILD_FIRST);
        Class<?> clazz = loadedType.getLoaded();
        Object obj = clazz.newInstance();
        Field field = clazz.getField("obj");
        Object fieldValue = field.get(obj);
        System.out.println(fieldValue);
    }
}
```
