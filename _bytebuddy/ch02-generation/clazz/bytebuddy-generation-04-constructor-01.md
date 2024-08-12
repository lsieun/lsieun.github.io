---
title: "构造方法 - 父类继承"
sequence: "108"
---


## 自动生成的构造器

### 继承自 Object 类

如果当前 `HelloWorld` 类继承自 `Object` 类，则会自动生成默认构造方法。

```java
import net.bytebuddy.ByteBuddy;
import net.bytebuddy.description.modifier.Visibility;
import net.bytebuddy.dynamic.DynamicType;

public class HelloWorldSubClass {
    public static void main(String[] args) throws Exception {
        // 第一步，准备参数
        String className = "sample.HelloWorld";


        // 第二步，生成类
        ByteBuddy byteBuddy = new ByteBuddy();
        DynamicType.Builder<?> builder = byteBuddy.subclass(Object.class)
                .modifiers(Visibility.PUBLIC)
                .name(className);


        // 第三步，输出结果
        DynamicType.Unloaded<?> unloadedType = builder.make();
        OutputUtils.save(unloadedType);
    }
}
```

生成结果：

```java
public class HelloWorld {
    public HelloWorld() {
    }
}
```

### 继承自 Parent 类

假如有一个 `Parent` 类，它提供了四个构造方法：

```java
import java.util.Date;

public class Parent {
    private String name;
    private int age;
    private Date date;
    private Object obj;

    public Parent() {
        this(null, 0);
    }

    protected Parent(String name, int age) {
        this(name, age, null);
    }

    Parent(String name, int age, Date date) {
        this(name, age, date, null);
    }

    private Parent(String name, int age, Date date, Object obj) {
        this.name = name;
        this.age = age;
        this.date = date;
        this.obj = obj;
    }
}
```

当 `HelloWorld` 类继承 `Parent` 类时，会相应的生成三个构造方法：

```java
import net.bytebuddy.ByteBuddy;
import net.bytebuddy.description.modifier.Visibility;
import net.bytebuddy.dynamic.DynamicType;
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


        // 第三步，输出结果
        DynamicType.Unloaded<?> unloadedType = builder.make();
        OutputUtils.save(unloadedType);
    }
}
```

生成结果：

```text
public class HelloWorld extends Parent {
    public HelloWorld() {
    }

    public HelloWorld(String var1, int var2) {
        super(var1, var2);
    }
    
    public HelloWorld(String var1, int var2, Date var3) {
        super(var1, var2, var3);
    }
}
```

此时，如果我们自己定义一个接收 `String.class` 和 `int.class` 参数的构造方法：

```text
builder = builder.defineConstructor(Visibility.PUBLIC)
        .withParameters(String.class, int.class)
        .intercept(StubMethod.INSTANCE);
```

就会出现“Duplicate method signature”错误：

```text
java.lang.IllegalStateException: Duplicate method signature
```

## ConstructorStrategy

```text
subclass(Class<T> superType, ConstructorStrategy constructorStrategy)
```

`net.bytebuddy.dynamic.scaffold.subclass.ConstructorStrategy`

```java
import java.util.Date;

public class Parent {
    private String name;
    private int age;
    private Date date;
    private Object obj;

    public Parent() {
        this(null, 0);
    }

    public Parent(String name, int age) {
        this(name, age, null);
    }

    protected Parent(String name, int age, Date date) {
        this(name, age, date, null);
    }

    private Parent(String name, int age, Date date, Object obj) {
        this.name = name;
        this.age = age;
        this.date = date;
        this.obj = obj;
    }
}
```

### NO_CONSTRUCTORS

```java
import net.bytebuddy.ByteBuddy;
import net.bytebuddy.description.modifier.Visibility;
import net.bytebuddy.dynamic.DynamicType;
import net.bytebuddy.dynamic.scaffold.subclass.ConstructorStrategy;
import sample.Parent;

public class HelloWorldSubClass {
    public static void main(String[] args) throws Exception {
        // 第一步，准备参数
        String className = "sample.HelloWorld";


        // 第二步，生成类
        ByteBuddy byteBuddy = new ByteBuddy();
        DynamicType.Builder<?> builder = byteBuddy.subclass(Parent.class, ConstructorStrategy.Default.NO_CONSTRUCTORS)
                .modifiers(Visibility.PUBLIC)
                .name(className);


        // 第三步，输出结果
        DynamicType.Unloaded<?> unloadedType = builder.make();
        OutputUtils.save(unloadedType);
    }
}
```

使用 `ConstructorStrategy.Default.NO_CONSTRUCTORS` 生成：

```java
public class HelloWorld extends Parent {
    // 无默认构造方法
}
```

### DEFAULT_CONSTRUCTOR

This strategy is adding a default constructor that calls it's super types default constructor.
If no such constructor is defined by the super class, an `IllegalArgumentException` is thrown.

使用 `ConstructorStrategy.Default.DEFAULT_CONSTRUCTOR` 生成：

```java
public class HelloWorld extends Parent {
    public HelloWorld() {
    }
}
```

如果注释掉 `Parent` 类的默认构造方法，或者修改成 `private` 修饰，就会出现错误：

```text
java.lang.IllegalArgumentException: class sample.Parent declares no constructor that is visible to class sample.HelloWorld
```

### IMITATE_SUPER_CLASS

使用 `ConstructorStrategy.Default.IMITATE_SUPER_CLASS` 生成：

```java
public class HelloWorld extends Parent {
    public HelloWorld() {
    }

    protected HelloWorld(String var1, int var2) { // 注意：这里是 protected
        super(var1, var2);
    }

    HelloWorld(String var1, int var2, Date var3) {
        super(var1, var2, var3);
    }
}
```

### IMITATE_SUPER_CLASS_PUBLIC

使用 `ConstructorStrategy.Default.IMITATE_SUPER_CLASS_PUBLIC` 生成：

```java
public class HelloWorld extends Parent {
    public HelloWorld() {
    }
}
```

### IMITATE_SUPER_CLASS_OPENING

使用 `ConstructorStrategy.Default.IMITATE_SUPER_CLASS_OPENING` 生成：

```java
public class HelloWorld extends Parent {
    public HelloWorld() {
    }

    public HelloWorld(String var1, int var2) {
        super(var1, var2);
    }

    public HelloWorld(String var1, int var2, Date var3) { // 注意：这里是 public
        super(var1, var2, var3);
    }
}
```

## 总结

本文内容总结如下：

- 第一点，构造方法有两种来源：一种是继承自父类，另一种是手动添加。本文是关注从父类继承的构造方法。
- 第二点，`ConstructorStrategy` 提供了五种不同的继承方式。
