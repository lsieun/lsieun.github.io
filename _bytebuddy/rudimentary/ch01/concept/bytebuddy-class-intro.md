---
title: "ByteBuddy 介绍"
sequence: "102"
---

`ByteBuddy` 类是 ByteBuddy 框架的入手点。

![](/assets/images/bytebuddy/bytebuddy-overview.png)

## 创建 ByteBuddy 对象

`ByteBuddy` 类提供了两个 `public` 类型的构造方法：

```java
public class ByteBuddy {
    public ByteBuddy() {
        this(ClassFileVersion.ofThisVm(ClassFileVersion.JAVA_V5));
    }

    public ByteBuddy(ClassFileVersion classFileVersion) {
        // ...
    }
}
```

使用第一个构造方法：

```text
ByteBuddy byteBuddy = new ByteBuddy();
```

使用第二个构造方法：

```text
ByteBuddy byteBuddy = new ByteBuddy(ClassFileVersion.JAVA_V8);
```

## 使用 ByteBuddy 对象

在 `ByteBuddy` 中，生成类的方式有三种：

- subclass
- redefine
- rebase

这三种方式有什么区别呢？我们通过具体的示例来理解。

### 继承或复制

```java
public class Parent {
    public void publicMethod() {
        System.out.println("Hello public Method");
    }

    protected void protectedMethod() {
        System.out.println("Hello protected Method");
    }

    void packageMethod() {
        System.out.println("Hello package-private Method");
    }

    private void privateMethod() {
        System.out.println("Hello private Method");
    }
}
```

#### subclass

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
        DynamicType.Builder<?> builder = byteBuddy.subclass(Parent.class)
                .modifiers(Visibility.PUBLIC)
                .name(className);


        // 3. output
        DynamicType.Unloaded<?> unloadedType = builder.make();
        OutputUtils.save(unloadedType);
    }
}
```

从下面的输出结果中，我们可以看到 `HelloWorld` 类继承了 `Parent` 类：

```java
public class HelloWorld extends Parent {
}
```

#### redefine

```java
import net.bytebuddy.ByteBuddy;
import net.bytebuddy.dynamic.DynamicType;

public class HelloWorldRedefine {
    public static void main(String[] args) {
        // 1. prepare
        String className = "sample.HelloWorld";


        // 2. weave
        ByteBuddy byteBuddy = new ByteBuddy();
        DynamicType.Builder<?> builder = byteBuddy.redefine(Parent.class)
                .name(className);


        // 3. output
        DynamicType.Unloaded<?> unloadedType = builder.make();
        OutputUtils.save(unloadedType);
    }
}
```

从下面的输出结果中，我们可以看到 `HelloWorld` 类没有继承（`extends`）自 `Parent` 类，但是复制了 `Parent` 类的所有方法：

```java
public class HelloWorld {
    public void publicMethod() {
        System.out.println("Hello public Method");
    }

    protected void protectedMethod() {
        System.out.println("Hello protected Method");
    }

    void packageMethod() {
        System.out.println("Hello package-private Method");
    }

    private void privateMethod() {
        System.out.println("Hello private Method");
    }
}
```

#### rebase

```java
import net.bytebuddy.ByteBuddy;
import net.bytebuddy.dynamic.DynamicType;

public class HelloWorldRebase {
    public static void main(String[] args) {
        // 1. prepare
        String className = "sample.HelloWorld";


        // 2. weave
        ByteBuddy byteBuddy = new ByteBuddy();
        DynamicType.Builder<?> builder = byteBuddy.rebase(Parent.class)
                .name(className);


        // 3. output
        DynamicType.Unloaded<?> unloadedType = builder.make();
        OutputUtils.save(unloadedType);
    }
}
```

从下面的输出结果中，我们可以看到 `HelloWorld` 类也没有继承（`extends`）自 `Parent` 类，但是也复制了 `Parent` 类的所有方法：

```text
public class HelloWorld {
    public void publicMethod() {
        System.out.println("Hello public Method");
    }

    protected void protectedMethod() {
        System.out.println("Hello protected Method");
    }

    void packageMethod() {
        System.out.println("Hello package-private Method");
    }

    private void privateMethod() {
        System.out.println("Hello private Method");
    }
}
```

### 修改方法

我们通过修改 `publicMethod()` 方法来观察三者的区别：

```java
public class Parent {
    public void publicMethod() {
        System.out.println("Hello public Method");
    }

    protected void protectedMethod() {
        System.out.println("Hello protected Method");
    }

    void packageMethod() {
        System.out.println("Hello package-private Method");
    }

    private void privateMethod() {
        System.out.println("Hello private Method");
    }
}
```

#### subclass

```java
import net.bytebuddy.ByteBuddy;
import net.bytebuddy.description.modifier.Visibility;
import net.bytebuddy.dynamic.DynamicType;
import net.bytebuddy.implementation.StubMethod;
import net.bytebuddy.matcher.ElementMatchers;

public class HelloWorldSubClass {
    public static void main(String[] args) {
        // 1. prepare
        String className = "sample.HelloWorld";


        // 2. weave
        ByteBuddy byteBuddy = new ByteBuddy();
        DynamicType.Builder<?> builder = byteBuddy.subclass(Parent.class)
                .modifiers(Visibility.PUBLIC)
                .name(className);

        builder = builder.method(ElementMatchers.named("publicMethod"))
                .intercept(StubMethod.INSTANCE);


        // 3. output
        DynamicType.Unloaded<?> unloadedType = builder.make();
        OutputUtils.save(unloadedType);
    }
}
```

在这里，我们看到了 `HelloWorld` 类重写了 `publicMethod()` 方法：

```java
public class HelloWorld extends Parent {
    public void publicMethod() {
    }
}
```

#### redefine

```java
import net.bytebuddy.ByteBuddy;
import net.bytebuddy.dynamic.DynamicType;
import net.bytebuddy.implementation.StubMethod;
import net.bytebuddy.matcher.ElementMatchers;

public class HelloWorldRedefine {
    public static void main(String[] args) {
        // 1. prepare
        String className = "sample.HelloWorld";


        // 2. weave
        ByteBuddy byteBuddy = new ByteBuddy();
        DynamicType.Builder<?> builder = byteBuddy.redefine(Parent.class)
                .name(className);

        builder = builder.method(ElementMatchers.named("test"))
                .intercept(StubMethod.INSTANCE);


        // 3. output
        DynamicType.Unloaded<?> unloadedType = builder.make();
        OutputUtils.save(unloadedType);
    }
}
```

在 `HelloWorld.publicMethod()` 方法体中成为了空的内容：

```java
public class HelloWorld {
    public void publicMethod() {
    }

    protected void protectedMethod() {
        System.out.println("Hello protected Method");
    }

    void packageMethod() {
        System.out.println("Hello package-private Method");
    }

    private void privateMethod() {
        System.out.println("Hello private Method");
    }
}
```

#### rebase

```java
import net.bytebuddy.ByteBuddy;
import net.bytebuddy.dynamic.DynamicType;
import net.bytebuddy.implementation.StubMethod;
import net.bytebuddy.matcher.ElementMatchers;

public class HelloWorldRebase {
    public static void main(String[] args) {
        // 1. prepare
        String className = "sample.HelloWorld";


        // 2. weave
        ByteBuddy byteBuddy = new ByteBuddy();
        DynamicType.Builder<?> builder = byteBuddy.rebase(Parent.class)
                .name(className);

        builder = builder.method(ElementMatchers.named("publicMethod"))
                .intercept(StubMethod.INSTANCE);


        // 3. output
        DynamicType.Unloaded<?> unloadedType = builder.make();
        OutputUtils.save(unloadedType);
    }
}
```

从生成的 `HelloWorld.class` 来看，似乎与 redefine 的情况一致，但是存在差异：

```java
public class HelloWorld {
    public void publicMethod() {
    }

    protected void protectedMethod() {
        System.out.println("Hello protected Method");
    }

    void packageMethod() {
        System.out.println("Hello package-private Method");
    }

    private void privateMethod() {
        System.out.println("Hello private Method");
    }
}
```

使用 `javap` 命令，查看其中的差异：

```text
$ javap -v -p sample.HelloWorld
...
  private void publicMethod$original$5rw3b8V0();
    descriptor: ()V
    flags: ACC_PRIVATE, ACC_SYNTHETIC
    Code:
      stack=2, locals=1, args_size=1
         0: getstatic     #7                  // Field java/lang/System.out:Ljava/io/PrintStream;
         3: ldc           #13                 // String Hello public Method
         5: invokevirtual #15                 // Method java/io/PrintStream.println:(Ljava/lang/String;)V
         8: return
      LineNumberTable:
        line 5: 0
        line 6: 8
      LocalVariableTable:
        Start  Length  Slot  Name   Signature
            0       9     0  this   Lsample/HelloWorld;
...
```

## immutable 特性

**Byte Buddy's API** is expressed by fully **immutable components** and is therefore **thread-safe**.

Byte Buddy's API 不只是说 `ByteBuddy` 类，而是指 ByteBuddy 类库的所有类。

错误的写法：

```java
import net.bytebuddy.ByteBuddy;
import net.bytebuddy.ClassFileVersion;
import net.bytebuddy.description.modifier.Visibility;
import net.bytebuddy.dynamic.DynamicType;

public class HelloWorldSubClass {
    public static void main(String[] args) {
        // 1. prepare
        String className = "sample.HelloWorld";


        // 2. weave
        ByteBuddy byteBuddy = new ByteBuddy();
        byteBuddy.with(ClassFileVersion.JAVA_V8);    // 错误之处，它会返回一个新的 ByteBuddy 对象
        DynamicType.Builder<?> builder = byteBuddy.subclass(Object.class)
                .modifiers(Visibility.PUBLIC)
                .name(className);


        // 3. output
        DynamicType.Unloaded<?> unloadedType = builder.make();
        OutputUtils.save(unloadedType);
    }
}
```

正确的写法：

```text
byteBuddy = byteBuddy.with(ClassFileVersion.JAVA_V8);
```

## 总结

本文内容总结如下：

- 第一点，`ByteBuddy` 类是 ByteBuddy 类库的起始点。换句话说，先创建 `ByteBuddy` 类的实例，才能进行后续的工作。
- 第二点，`ByteBuddy` 类的方法分成两种类型：第一种，是对 ByteBuddy 进行配置；第二种，是生成 `.class`。
- 第三点，`ByteBuddy` 类生成类的三种方式：subclass、redefine 和 rebase。同时，注意三者的区别。
- 第四点，ByteBuddy API 的 immutable 特性，所有的实例都是不可变化的。这也是经常犯错误的地方：明明代码思路写的对，就是没有效果。

