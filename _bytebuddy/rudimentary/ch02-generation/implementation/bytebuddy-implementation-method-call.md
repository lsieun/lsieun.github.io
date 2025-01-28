---
title: "MethodCall（调用方法）"
sequence: "method-call"
---

## 介绍

### 如何使用 MethodCall 类

对于 static 方法，不需要对象实例（instance）：

```text
MethodCall.invokeXxx(targetMethod)
          .withXxx(parameters)
```

对于 non-static 方法，需要对象实例（instance）：

```text
MethodCall.invokeXxx(targetMethod)
          .onXxx(instance)
          .withXxx(parameters)
```

创建对象实例（instance）：

```text
MethodCall.construct(targetConstructor)
```

## 调用方法

### 调用静态方法

预期目标：调用 `GoodChild::study` 静态方法

```java
public class HelloWorld {
    public void test() {
        GoodChild.study();
    }
}
```

其中 `GoodChild` 定义如下：

```java
public class GoodChild {
    public static void study() {
        System.out.println("千里之行始于足下");
    }
}
```

编码实现：

```java
import net.bytebuddy.ByteBuddy;
import net.bytebuddy.description.modifier.Visibility;
import net.bytebuddy.dynamic.DynamicType;
import net.bytebuddy.implementation.MethodCall;

public class HelloWorldSubClass {
    public static void main(String[] args) {
        // 1. prepare
        String className = "sample.HelloWorld";


        // 2. weave
        ByteBuddy byteBuddy = new ByteBuddy();
        DynamicType.Builder<?> builder = byteBuddy.subclass(Object.class)
                .modifiers(Visibility.PUBLIC)
                .name(className);

        builder = builder.defineMethod("test", void.class, Visibility.PUBLIC)
                .intercept(
                        MethodCall.invoke(
                                GoodChild.class.getDeclaredMethod("study")
                        )
                );


        // 3. output
        DynamicType.Unloaded<?> unloadedType = builder.make();
        OutputUtils.save(unloadedType);
    }
}
```

### 调用非静态方法 - 创建对象

预期目标：调用 `GoodChild::study` 非静态方法

```java
public class HelloWorld {
    public void test() {
        (new GoodChild()).study();
    }
}
```

其中 `GoodChild` 定义如下：

```java
public class GoodChild {
    public void study() {
        System.out.println("千里之行始于足下");
    }
}
```

编码实现：

```java
import net.bytebuddy.ByteBuddy;
import net.bytebuddy.description.modifier.Visibility;
import net.bytebuddy.dynamic.DynamicType;
import net.bytebuddy.implementation.MethodCall;

public class HelloWorldSubClass {
    public static void main(String[] args) {
        // 1. prepare
        String className = "sample.HelloWorld";


        // 2. weave
        ByteBuddy byteBuddy = new ByteBuddy();
        DynamicType.Builder<?> builder = byteBuddy.subclass(Object.class)
                .modifiers(Visibility.PUBLIC)
                .name(className);

        builder = builder.defineMethod("test", void.class, Visibility.PUBLIC)
                .intercept(
                        MethodCall.invoke(
                                GoodChild.class.getDeclaredMethod("study")
                        ).onMethodCall(
                                MethodCall.construct(GoodChild.class.getConstructor())
                        )
                );


        // 3. output
        DynamicType.Unloaded<?> unloadedType = builder.make();
        OutputUtils.save(unloadedType);
    }
}
```

### 调用父类的构造方法：invoke 和 construct

预期目标：生成接收两个参数的构造方法

```java
public class HelloWorld {
    public HelloWorld(String name, int age) {
        super();
    }
}
```

正确的方式：调用父类的构造方法

```text
MethodCall.invoke(Object.class.getDeclaredConstructor())
```

错误的方式：创建一个父类的对象

```text
MethodCall.construct(Object.class.getDeclaredConstructor())
```

完整代码：

```java
import net.bytebuddy.ByteBuddy;
import net.bytebuddy.description.modifier.Visibility;
import net.bytebuddy.dynamic.DynamicType;
import net.bytebuddy.implementation.MethodCall;

public class HelloWorldSubClass {
    public static void main(String[] args) {
        // 1. prepare
        String className = "sample.HelloWorld";


        // 2. weave
        ByteBuddy byteBuddy = new ByteBuddy();
        DynamicType.Builder<?> builder = byteBuddy.subclass(Object.class)
                .modifiers(Visibility.PUBLIC)
                .name(className);

        builder = builder.defineConstructor(Visibility.PUBLIC)
                .withParameter(String.class, "name")
                .withParameter(int.class, "age")
                .intercept(
                        MethodCall.invoke(Object.class.getDeclaredConstructor())
                );


        // 3. output
        DynamicType.Unloaded<?> unloadedType = builder.make();
        OutputUtils.save(unloadedType);
    }
}
```

验证结果：

```java
import lsieun.utils.ClassUtils;

public class HelloWorldRun {
    public static void main(String[] args) {
        Object instance = ClassUtils.createInstance(
                HelloWorld.class,
                new Class[]{String.class, int.class},
                "Tom", 10);
        System.out.println(instance);
    }
}
```

### 调用方法

#### invokeSelf

预期目标：生成方法，递归调用自己

```java
public class HelloWorld {
    public void test() {
        this.test();
    }
}
```

编码实现：

```java
import net.bytebuddy.ByteBuddy;
import net.bytebuddy.description.modifier.Visibility;
import net.bytebuddy.dynamic.DynamicType;
import net.bytebuddy.implementation.MethodCall;

public class HelloWorldSubClass {
    public static void main(String[] args) {
        // 1. prepare
        String className = "sample.HelloWorld";


        // 2. weave
        ByteBuddy byteBuddy = new ByteBuddy();
        DynamicType.Builder<?> builder = byteBuddy.subclass(Object.class)
                .modifiers(Visibility.PUBLIC)
                .name(className);

        builder = builder.defineMethod("test", void.class, Visibility.PUBLIC)
                .intercept(
                        MethodCall.invokeSelf()
                );


        // 3. output
        DynamicType.Unloaded<?> unloadedType = builder.make();
        OutputUtils.save(unloadedType);
    }
}
```

#### invokeSuper

预期目标：

```java
public class HelloWorld {
    public String toString() {
        return super.toString();
    }
}
```

错误实现：

```java
import net.bytebuddy.ByteBuddy;
import net.bytebuddy.description.modifier.Visibility;
import net.bytebuddy.dynamic.DynamicType;
import net.bytebuddy.implementation.MethodCall;

public class HelloWorldGenerate {
    public static void main(String[] args) {
        // 1. prepare
        String className = "sample.HelloWorld";


        // 2. weave
        ByteBuddy byteBuddy = new ByteBuddy();
        DynamicType.Builder<?> builder = byteBuddy.subclass(Object.class)
                .modifiers(Visibility.PUBLIC)
                .name(className);

        builder = builder.defineMethod("toString", String.class, Visibility.PUBLIC)
                .intercept(
                        MethodCall.invokeSuper()
                );


        // 3. output
        DynamicType.Unloaded<?> unloadedType = builder.make();
        OutputUtils.save(unloadedType);
    }
}
```

出现错误信息：

```text
java.lang.IllegalStateException: Cannot invoke public java.lang.String sample.HelloWorld.toString() as super method of class sample.HelloWorld
```

正确实现：

```java
import net.bytebuddy.ByteBuddy;
import net.bytebuddy.description.modifier.Visibility;
import net.bytebuddy.dynamic.DynamicType;
import net.bytebuddy.implementation.MethodCall;
import net.bytebuddy.matcher.ElementMatchers;

public class HelloWorldSubClass {
    public static void main(String[] args) {
        // 1. prepare
        String className = "sample.HelloWorld";


        // 2. weave
        ByteBuddy byteBuddy = new ByteBuddy();
        DynamicType.Builder<?> builder = byteBuddy.subclass(Object.class)
                .modifiers(Visibility.PUBLIC)
                .name(className);

        builder = builder.method(ElementMatchers.named("toString"))
                .intercept(
                        MethodCall.invokeSuper()
                );


        // 3. output
        DynamicType.Unloaded<?> unloadedType = builder.make();
        OutputUtils.save(unloadedType);
    }
}
```


## 方法参数

### argument

#### withAllArguments

`withAllArguments`

```java
public class GoodChild {
    public static void study(String subject, int minutes) {
        String message = String.format("I'm studying %s for %d minutes.", subject, minutes);
        System.out.println(message);
    }
}
```

```java
public class HelloWorld {
    public void test(String var1, int var2) {
        GoodChild.study(var1, var2);
    }
}
```

```text
import net.bytebuddy.ByteBuddy;
import net.bytebuddy.description.modifier.Visibility;
import net.bytebuddy.dynamic.DynamicType;
import net.bytebuddy.implementation.MethodCall;

public class HelloWorldGenerate {
    public static void main(String[] args) {
        // 1. prepare
        String className = "sample.HelloWorld";


        // 2. weave
        ByteBuddy byteBuddy = new ByteBuddy();
        DynamicType.Builder<?> builder = byteBuddy.subclass(Object.class)
                .modifiers(Visibility.PUBLIC)
                .name(className);

        builder = builder.defineMethod("test", void.class, Visibility.PUBLIC)
                .withParameters(String.class, int.class)
                .intercept(
                        MethodCall.invoke(GoodChild.class.getDeclaredMethod("study", String.class, int.class))
                                .withAllArguments()
                );


        // 3. output
        DynamicType.Unloaded<?> unloadedType = builder.make();
        OutputUtils.save(unloadedType);
    }
}
```

如果参数数量不匹配（多或少），都会有相应的错误。

如果我们多添加一个 `Object` 参数：

```text
builder = builder.defineMethod("test", void.class, Visibility.PUBLIC)
        .withParameters(String.class, int.class, Object.class)
```

会出现错误：

```text
java.lang.IllegalStateException: public static void sample.GoodChild.study(java.lang.String,int) does not accept 3 arguments
```

如果我们多减少一个 `int` 参数：

```text
builder = builder.defineMethod("test", void.class, Visibility.PUBLIC)
    .withParameters(String.class)
```

会出现错误：

```text
java.lang.IllegalStateException: public static void sample.GoodChild.study(java.lang.String,int) does not accept 1 arguments
```

#### withArgument

```java
public class HelloWorld {
    public void test(int var1, String var2) {
        GoodChild.study(var2, var1);
    }
}
```

```java
import net.bytebuddy.ByteBuddy;
import net.bytebuddy.description.modifier.Visibility;
import net.bytebuddy.dynamic.DynamicType;
import net.bytebuddy.implementation.MethodCall;

public class HelloWorldGenerate {
    public static void main(String[] args) {
        // 1. prepare
        String className = "sample.HelloWorld";


        // 2. weave
        ByteBuddy byteBuddy = new ByteBuddy();
        DynamicType.Builder<?> builder = byteBuddy.subclass(Object.class)
                .modifiers(Visibility.PUBLIC)
                .name(className);

        builder = builder.defineMethod("test", void.class, Visibility.PUBLIC)
                .withParameters(int.class, String.class)
                .intercept(
                        MethodCall.invoke(GoodChild.class.getDeclaredMethod("study", String.class, int.class))
                                .withArgument(1, 0)
                );


        // 3. output
        DynamicType.Unloaded<?> unloadedType = builder.make();
        OutputUtils.save(unloadedType);
    }
}
```

### withField

```java
public class HelloWorld {
    private String name;
    private int age;

    public void test() {
        GoodChild.study(this.name, this.age);
    }
}
```

```java
public class GoodChild {
    public static void study(String name, int age) {
        String message = String.format("Hello %s, you are %d", name, age);
        System.out.println(message);
    }
}
```

```java
import net.bytebuddy.ByteBuddy;
import net.bytebuddy.description.modifier.Visibility;
import net.bytebuddy.dynamic.DynamicType;
import net.bytebuddy.implementation.MethodCall;

public class HelloWorldGenerate {
    public static void main(String[] args) {
        // 1. prepare
        String className = "sample.HelloWorld";


        // 2. weave
        ByteBuddy byteBuddy = new ByteBuddy();
        DynamicType.Builder<?> builder = byteBuddy.subclass(Object.class)
                .modifiers(Visibility.PUBLIC)
                .name(className);

        builder = builder.defineField("name", String.class, Visibility.PRIVATE)
                .defineField("age", int.class, Visibility.PRIVATE);

        builder = builder.defineMethod("test", void.class, Visibility.PUBLIC)
                .intercept(
                        MethodCall.invoke(GoodChild.class.getDeclaredMethod("study", String.class, int.class))
                                .withField("name", "age")
                );


        // 3. output
        DynamicType.Unloaded<?> unloadedType = builder.make();
        OutputUtils.save(unloadedType);
    }
}
```

### withThis

```java
public class GoodChild {
    public static void study(Object obj) {
        System.out.println(obj);
    }
}
```

```java
public class HelloWorld {
    public void test(String var1, int var2) {
        GoodChild.study(this);
    }
}
```

```java
import net.bytebuddy.ByteBuddy;
import net.bytebuddy.description.modifier.Visibility;
import net.bytebuddy.dynamic.DynamicType;
import net.bytebuddy.implementation.MethodCall;

public class HelloWorldGenerate {
    public static void main(String[] args) {
        // 1. prepare
        String className = "sample.HelloWorld";


        // 2. weave
        ByteBuddy byteBuddy = new ByteBuddy();
        DynamicType.Builder<?> builder = byteBuddy.subclass(Object.class)
                .modifiers(Visibility.PUBLIC)
                .name(className);

        builder = builder.defineMethod("test", void.class, Visibility.PUBLIC)
                .withParameters(String.class, int.class)
                .intercept(
                        MethodCall.invoke(GoodChild.class.getDeclaredMethod("study", Object.class))
                                .withThis()
                );


        // 3. output
        DynamicType.Unloaded<?> unloadedType = builder.make();
        OutputUtils.save(unloadedType);
    }
}
```

### withOwnType

```java
public class HelloWorld {
    public void test(String var1, int var2) {
        GoodChild.study(HelloWorld.class);
    }
}
```

```java
import net.bytebuddy.ByteBuddy;
import net.bytebuddy.description.modifier.Visibility;
import net.bytebuddy.dynamic.DynamicType;
import net.bytebuddy.implementation.MethodCall;

public class HelloWorldGenerate {
    public static void main(String[] args) {
        // 1. prepare
        String className = "sample.HelloWorld";


        // 2. weave
        ByteBuddy byteBuddy = new ByteBuddy();
        DynamicType.Builder<?> builder = byteBuddy.subclass(Object.class)
                .modifiers(Visibility.PUBLIC)
                .name(className);

        builder = builder.defineMethod("test", void.class, Visibility.PUBLIC)
                .withParameters(String.class, int.class)
                .intercept(
                        MethodCall.invoke(GoodChild.class.getDeclaredMethod("study", Object.class))
                                .withOwnType()
                );


        // 3. output
        DynamicType.Unloaded<?> unloadedType = builder.make();
        OutputUtils.save(unloadedType);
    }
}
```



### withMethodCall

```java
public class GoodChild {
    public static void study(Object obj) {
        System.out.println(obj);
    }
}
```

```java
public class HelloWorld {
    public void test() {
        GoodChild.study(new Object());
    }
}
```

```java
import net.bytebuddy.ByteBuddy;
import net.bytebuddy.description.modifier.Visibility;
import net.bytebuddy.dynamic.DynamicType;
import net.bytebuddy.implementation.MethodCall;

public class HelloWorldGenerate {
    public static void main(String[] args) {
        // 1. prepare
        String className = "sample.HelloWorld";


        // 2. weave
        ByteBuddy byteBuddy = new ByteBuddy();
        DynamicType.Builder<?> builder = byteBuddy.subclass(Object.class)
                .modifiers(Visibility.PUBLIC)
                .name(className);

        builder = builder.defineMethod("test", void.class, Visibility.PUBLIC)
                .intercept(
                        MethodCall.invoke(GoodChild.class.getDeclaredMethod("study", Object.class))
                                .withMethodCall(
                                        MethodCall.construct(Object.class.getConstructor())
                                )
                );


        // 3. output
        DynamicType.Unloaded<?> unloadedType = builder.make();
        OutputUtils.save(unloadedType);
    }
}
```

## 方法返回值

### 返回创建的对象

```java
public class HelloWorld {
    public Object test() {
        return new Object();
    }
}
```

```java
import net.bytebuddy.ByteBuddy;
import net.bytebuddy.description.modifier.Visibility;
import net.bytebuddy.dynamic.DynamicType;
import net.bytebuddy.implementation.MethodCall;

public class HelloWorldGenerate {
    public static void main(String[] args) {
        // 1. prepare
        String className = "sample.HelloWorld";


        // 2. weave
        ByteBuddy byteBuddy = new ByteBuddy();
        DynamicType.Builder<?> builder = byteBuddy.subclass(Object.class)
                .modifiers(Visibility.PUBLIC)
                .name(className);

        builder = builder.defineMethod("test", Object.class, Visibility.PUBLIC)
                .intercept(
                        MethodCall.construct(Object.class.getConstructor())
                );


        // 3. output
        DynamicType.Unloaded<?> unloadedType = builder.make();
        OutputUtils.save(unloadedType);
    }
}
```

### setsField

```java
public class GoodChild {
    public static String study() {
        return "1 + 1 = 2";
    }
}
```

```java
public class HelloWorld {
    public void test() {
        Teacher.obj = GoodChild.study();
    }
}
```

```java
public class Teacher {
    public static Object obj = null;
}
```

```java
import net.bytebuddy.ByteBuddy;
import net.bytebuddy.description.modifier.Visibility;
import net.bytebuddy.dynamic.DynamicType;
import net.bytebuddy.dynamic.loading.ClassLoadingStrategy;
import net.bytebuddy.implementation.MethodCall;

import java.lang.reflect.Constructor;
import java.lang.reflect.Method;

public class HelloWorldLoad {
    public static void main(String[] args) {
        // 1. prepare
        String className = "sample.HelloWorld";


        // 2. weave
        ByteBuddy byteBuddy = new ByteBuddy();
        DynamicType.Builder<?> builder = byteBuddy.subclass(Object.class)
                .name(className);

        builder = builder.defineMethod("test", void.class, Visibility.PUBLIC)
                .intercept(
                        MethodCall.invoke(
                                        GoodChild.class.getDeclaredMethod("study")
                                )
                                .setsField(Teacher.class.getDeclaredField("obj"))
                );


        // 3. output
        DynamicType.Unloaded<?> unloadedType = builder.make();
        OutputUtils.save(unloadedType);


        // 第四步，进行加载
        ClassLoader classLoader = ClassLoader.getSystemClassLoader();
        DynamicType.Loaded<?> loadedType = unloadedType.load(classLoader, ClassLoadingStrategy.Default.CHILD_FIRST);
        Class<?> clazz = loadedType.getLoaded();


        // 第五步，创建对象
        Constructor<?> constructor = clazz.getDeclaredConstructor();
        Object instance = constructor.newInstance();
        Method method = clazz.getDeclaredMethod("test");
        method.invoke(instance);
        System.out.println(Teacher.obj);

    }
}
```



## 修改自动生成的构造方法

有的时候，ByteBuddy 默认生成的构造方法，并不符合我们的预期：

```java
public class HelloWorld {
    private String name;
    private int age;

    public HelloWorld() {
    }
}
```

```java
import net.bytebuddy.ByteBuddy;
import net.bytebuddy.description.modifier.Visibility;
import net.bytebuddy.dynamic.DynamicType;

public class HelloWorldGenerate {
    public static void main(String[] args) {
        // 1. prepare
        String className = "sample.HelloWorld";

        // 2. weave
        ByteBuddy byteBuddy = new ByteBuddy();
        DynamicType.Builder<?> builder = byteBuddy.subclass(Object.class)
                .modifiers(Visibility.PUBLIC)
                .name(className);

        builder = builder.defineField("name", String.class, Visibility.PRIVATE)
                .defineField("age", int.class, Visibility.PRIVATE);

        // 3. output
        DynamicType.Unloaded<?> unloadedType = builder.make();
        FileUtils.save(unloadedType);
    }
}
```

```java
import net.bytebuddy.ByteBuddy;
import net.bytebuddy.description.modifier.Visibility;
import net.bytebuddy.dynamic.DynamicType;
import net.bytebuddy.implementation.FieldAccessor;
import net.bytebuddy.implementation.MethodCall;
import net.bytebuddy.implementation.ToStringMethod;
import net.bytebuddy.matcher.ElementMatchers;

public class HelloWorldGenerate {
    public static void main(String[] args) {
        // 1. prepare
        String className = "sample.HelloWorld";

        // 2. weave
        ByteBuddy byteBuddy = new ByteBuddy();
        DynamicType.Builder<?> builder = byteBuddy.subclass(Object.class)
                .modifiers(Visibility.PUBLIC)
                .name(className);

        builder = builder.defineField("name", String.class, Visibility.PRIVATE)
                .defineField("age", int.class, Visibility.PRIVATE);

        builder = builder.constructor(
                ElementMatchers.isDefaultConstructor()
        ).intercept(
                MethodCall.invoke(
                        Object.class.getDeclaredConstructor()
                ).andThen(
                        FieldAccessor.ofField("name").setsValue("Tom")
                ).andThen(
                        FieldAccessor.ofField("age").setsValue(10)
                )
        );

        builder = builder.defineMethod("toString", String.class, Visibility.PUBLIC).intercept(
                ToStringMethod.prefixedBySimpleClassName()
        );

        // 3. output
        DynamicType.Unloaded<?> unloadedType = builder.make();
        FileUtils.save(unloadedType);
    }
}
```

## 示例

### 打印语句

预期目标：

```java
public class HelloWorld {
    public void test() {
        System.out.println("Hello World");
    }
}
```

编码实现：

```java
import net.bytebuddy.ByteBuddy;
import net.bytebuddy.description.modifier.Visibility;
import net.bytebuddy.dynamic.DynamicType;
import net.bytebuddy.implementation.MethodCall;

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

        builder = builder.defineMethod("test", void.class, Visibility.PUBLIC)
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

