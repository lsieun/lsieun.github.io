---
title: "FixedValue"
sequence: "101"
---

`net.bytebuddy.implementation.FixedValue`

Fixed Value is a utility class provided by ByteBuddy.
The `FixedValue` provides many convenience methods to create one line method body for the generated Java method.
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

## 方法参数

预期目标：

```java
public class HelloWorld {
    public Object test(String name, int age) {
        return name;
    }
}
```

```java
public class HelloWorld {
    public Object test(String name, int age) {
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
    public static void main(String[] args) throws Exception {
        // 第一步，准备参数
        String className = "sample.HelloWorld";


        // 第二步，生成类
        ByteBuddy byteBuddy = new ByteBuddy();
        DynamicType.Builder<?> builder = byteBuddy.subclass(Object.class)
                .modifiers(Visibility.PUBLIC)
                .name(className);

        builder = builder.defineMethod("test", Object.class, Visibility.PUBLIC)
                .withParameter(String.class, "name")
                .withParameter(int.class, "age")
                .intercept(FixedValue.argument(0));


        // 第三步，输出结果
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
    public static void main(String[] args) throws Exception {
        // 第一步，准备参数
        String className = "sample.HelloWorld";


        // 第二步，生成类
        ByteBuddy byteBuddy = new ByteBuddy();
        DynamicType.Builder<?> builder = byteBuddy.subclass(Object.class)
                .modifiers(Visibility.PUBLIC)
                .name(className);

        builder = builder.defineMethod("test", Object.class, Visibility.PUBLIC)
                .intercept(FixedValue.nullValue());


        // 第三步，输出结果
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
    public static void main(String[] args) throws Exception {
        // 第一步，准备参数
        String className = "sample.HelloWorld";


        // 第二步，生成类
        ByteBuddy byteBuddy = new ByteBuddy();
        DynamicType.Builder<?> builder = byteBuddy.subclass(Object.class)
                .modifiers(Visibility.PUBLIC)
                .name(className);

        builder = builder.defineMethod("test", Object.class, Visibility.PUBLIC)
                .intercept(FixedValue.self());


        // 第三步，输出结果
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
import sample.Parent;

public class HelloWorldSubClass {
    public static void main(String[] args) throws Exception {
        // 第一步，准备参数
        String className = "sample.HelloWorld";


        // 第二步，生成类
        ByteBuddy byteBuddy = new ByteBuddy();
        DynamicType.Builder<?> builder = byteBuddy.subclass(Parent.class)
                .modifiers(Visibility.PUBLIC)
                .name(className);

        builder = builder.defineMethod("test", Object.class, Visibility.PUBLIC)
                .intercept(FixedValue.originType());


        // 第三步，输出结果
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
    public static void main(String[] args) throws Exception {
        // 第一步，准备参数
        String className = "sample.HelloWorld";


        // 第二步，生成类
        ByteBuddy byteBuddy = new ByteBuddy();
        DynamicType.Builder<?> builder = byteBuddy.subclass(Object.class)
                .name(className);

        GoodChild child = new GoodChild("Tom", 10);
        builder = builder.defineMethod("test", Object.class, Visibility.PUBLIC)
                .intercept(FixedValue.reference(child));


        // 第三步，输出结果
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
