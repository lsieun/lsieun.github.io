---
title: "FixedValue（常量值、引用）"
sequence: "fixed-value"
---

## 介绍

The `FixedValue` provides many convenience methods to create **one line method body** for the generated Java method.
For example, `FixedValue.nullValue()` method creates a method body that returns `null` value.

```text
                                      ┌─── value(JavaConstant fixedValue)
              ┌─── constant ──────────┤
              │                       └─── value(TypeDescription fixedValue)
              │
              ├─── method argument ───┼─── argument(int index)
              │
              │                       ┌─── nullValue()
              │                       │
FixedValue ───┤                       ├─── self()
              │                       │
              ├─── reference ─────────┼─── originType()
              │                       │
              │                       ├─── reference(Object value)
              │                       │
              │                       └─── reference(Object value, String name)
              │
              └─── mix ───────────────┼─── value(Object fixedValue)
```

## 常量

### int

预期目标：

```java
public class HelloWorld {
    public int test() {
        return -1;
    }
}
```

编码实现：

```java
import net.bytebuddy.ByteBuddy;
import net.bytebuddy.description.modifier.Visibility;
import net.bytebuddy.dynamic.DynamicType;
import net.bytebuddy.implementation.FixedValue;

public class HelloWorldSubClass {
    public static void main(String[] args) {
        // 1. prepare
        String className = "sample.HelloWorld";


        // 2. weave
        ByteBuddy byteBuddy = new ByteBuddy();
        DynamicType.Builder<?> builder = byteBuddy.subclass(Object.class)
                .modifiers(Visibility.PUBLIC)
                .name(className);

        builder = builder.defineMethod("test", int.class, Visibility.PUBLIC)
                .intercept(FixedValue.value(-1));


        // 3. output
        DynamicType.Unloaded<?> unloadedType = builder.make();
        OutputUtils.save(unloadedType);
    }
}
```

## 方法参数

### int

预期目标：

```java
public class HelloWorld {
    public int test(String name, int age) {
        return age;
    }
}
```

编码实现：

```java
import net.bytebuddy.ByteBuddy;
import net.bytebuddy.description.modifier.Visibility;
import net.bytebuddy.dynamic.DynamicType;
import net.bytebuddy.implementation.FixedValue;

public class HelloWorldSubClass {
    public static void main(String[] args) {
        // 1. prepare
        String className = "sample.HelloWorld";


        // 2. weave
        ByteBuddy byteBuddy = new ByteBuddy();
        DynamicType.Builder<?> builder = byteBuddy.subclass(Object.class)
                .modifiers(Visibility.PUBLIC)
                .name(className);

        builder = builder.defineMethod("test", int.class, Visibility.PUBLIC)
                .withParameter(String.class, "name")
                .withParameter(int.class, "age")
                .intercept(FixedValue.argument(1));


        // 3. output
        DynamicType.Unloaded<?> unloadedType = builder.make();
        OutputUtils.save(unloadedType);
    }
}
```

### String

预期目标：

```java
public class HelloWorld {
    public String test(String name, int age) {
        return name;
    }
}
```

编码实现：

```java
import net.bytebuddy.ByteBuddy;
import net.bytebuddy.description.modifier.Visibility;
import net.bytebuddy.dynamic.DynamicType;
import net.bytebuddy.implementation.FixedValue;

public class HelloWorldSubClass {
    public static void main(String[] args) {
        // 1. prepare
        String className = "sample.HelloWorld";


        // 2. weave
        ByteBuddy byteBuddy = new ByteBuddy();
        DynamicType.Builder<?> builder = byteBuddy.subclass(Object.class)
                .modifiers(Visibility.PUBLIC)
                .name(className);

        builder = builder.defineMethod("test", String.class, Visibility.PUBLIC)
                .withParameter(String.class, "name")
                .withParameter(int.class, "age")
                .intercept(FixedValue.argument(0));


        // 3. output
        DynamicType.Unloaded<?> unloadedType = builder.make();
        OutputUtils.save(unloadedType);
    }
}
```

## 引用类型

### null

预期目标：

```java
public class HelloWorld {
    public Object test() {
        return null;
    }
}
```

编码实现：

```java
import net.bytebuddy.ByteBuddy;
import net.bytebuddy.description.modifier.Visibility;
import net.bytebuddy.dynamic.DynamicType;
import net.bytebuddy.implementation.FixedValue;

public class HelloWorldSubClass {
    public static void main(String[] args) {
        // 1. prepare
        String className = "sample.HelloWorld";


        // 2. weave
        ByteBuddy byteBuddy = new ByteBuddy();
        DynamicType.Builder<?> builder = byteBuddy.subclass(Object.class)
                .modifiers(Visibility.PUBLIC)
                .name(className);

        builder = builder.defineMethod("test", Object.class, Visibility.PUBLIC)
                .intercept(FixedValue.nullValue());


        // 3. output
        DynamicType.Unloaded<?> unloadedType = builder.make();
        OutputUtils.save(unloadedType);
    }
}
```

### this

预期目标：

```java
public class HelloWorld {
    public Object test() {
        return this;
    }
}
```

编码实现：

```java
import net.bytebuddy.ByteBuddy;
import net.bytebuddy.description.modifier.Visibility;
import net.bytebuddy.dynamic.DynamicType;
import net.bytebuddy.implementation.FixedValue;

public class HelloWorldSubClass {
    public static void main(String[] args) {
        // 1. prepare
        String className = "sample.HelloWorld";


        // 2. weave
        ByteBuddy byteBuddy = new ByteBuddy();
        DynamicType.Builder<?> builder = byteBuddy.subclass(Object.class)
                .modifiers(Visibility.PUBLIC)
                .name(className);

        builder = builder.defineMethod("test", Object.class, Visibility.PUBLIC)
                .intercept(FixedValue.self());


        // 3. output
        DynamicType.Unloaded<?> unloadedType = builder.make();
        OutputUtils.save(unloadedType);
    }
}
```

## origin type

预期目标：

```java
public class HelloWorld extends Parent {
    public Object test() {
        return Parent.class;
    }
}
```

其中，`Parent` 类如下：

```java
public class Parent {
}
```

编码实现：

```java
import net.bytebuddy.ByteBuddy;
import net.bytebuddy.description.modifier.Visibility;
import net.bytebuddy.dynamic.DynamicType;
import net.bytebuddy.implementation.FixedValue;

public class HelloWorldSubClass {
    public static void main(String[] args) {
        // 1. prepare
        String className = "sample.HelloWorld";


        // 2. weave
        ByteBuddy byteBuddy = new ByteBuddy();
        DynamicType.Builder<?> builder = byteBuddy.subclass(Parent.class)
                .modifiers(Visibility.PUBLIC)
                .name(className);

        builder = builder.defineMethod("test", Object.class, Visibility.PUBLIC)
                .intercept(FixedValue.originType());


        // 3. output
        DynamicType.Unloaded<?> unloadedType = builder.make();
        OutputUtils.save(unloadedType);
    }
}
```

### reference

```java
public class GoodChild {
    private final String name;
    private final int age;

    public GoodChild(String name, int age) {
        this.name = name;
        this.age = age;
    }

    @Override
    public String toString() {
        return String.format("GoodChild {name='%s', age=%d}", name, age);
    }
}
```

```java
import net.bytebuddy.ByteBuddy;
import net.bytebuddy.description.modifier.Visibility;
import net.bytebuddy.dynamic.DynamicType;
import net.bytebuddy.dynamic.loading.ClassLoadingStrategy;
import net.bytebuddy.implementation.FixedValue;

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

        GoodChild child = new GoodChild("Tom", 10);
        builder = builder.defineMethod("test", Object.class, Visibility.PUBLIC)
                .intercept(FixedValue.reference(child));


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
        Object obj = method.invoke(instance);
        System.out.println(obj);
    }
}
```
