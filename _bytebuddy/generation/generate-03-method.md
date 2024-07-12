---
title: "普通方法：defineMethod()"
sequence: "107"
---

## 方法信息

生成方法，我们需要使用 `DynamicType.Builder.defineMethod()` 方法。

```text
                                                          ┌─── name()
                                                          │
                                      ┌─── class ─────────┼─── modifiers()
                                      │                   │
                                      │                   └─── implement()
                                      │
                                      │                   ┌─── defineField()
                                      │                   │
                                      ├─── field ─────────┼─── define()
                                      │                   │
                                      │                   └─── serialVersionUid()
                       ┌─── input ────┤
                       │              │                   ┌─── defineConstructor()
                       │              ├─── constructor ───┤
                       │              │                   └─── define()
                       │              │
                       │              │                   ┌─── defineMethod()
                       │              │                   │
DynamicType.Builder ───┤              │                   ├─── define()
                       │              │                   │
                       │              └─── method ────────┼─── defineProperty()
                       │                                  │
                       │                                  ├─── withHashCodeEquals()
                       │                                  │
                       │                                  └─── withToString()
                       │
                       └─── output ───┼─── make(): DynamicType.Unloaded
```

但是，`defineMethod()` 只是一个**起点**，它还要经历多个部分的数据收集：

```text
                                                   ┌─── name/return/access ───┼─── defineMethod()
                                                   │
                                                   │                          ┌─── withParameter()
                               ┌─── method head ───┼─── parameters ───────────┤
                               │                   │                          └─── withParameters()
                               │                   │
                               │                   └─── throws ───────────────┼─── throwing()
                               │
DynamicType.Builder: method ───┤                   ┌─── withoutCode()
                               │                   │
                               │                   │
                               │                   │                     ┌─── StubMethod.INSTANCE
                               │                   │                     │
                               └─── method body ───┤                     │                           ┌─── value()
                                                   │                     │                           │
                                                   │                     ├─── FixedValue ────────────┼─── nullValue()
                                                   │                     │                           │
                                                   │                     │                           └─── argument()
                                                   └─── intercept() ─────┤
                                                                         ├─── FieldAccessor ─────────┼─── ofField()
                                                                         │
                                                                         ├─── MethodCall
                                                                         │
                                                                         ├─── MethodDelegation
                                                                         │
                                                                         └─── ExceptionMethod
```

```java
public class HelloWorld {
    public void test(String name, int age) throws Exception {
        System.out.println("Hello World");
    }
}
```

## Method Head

### 方法名 + 返回类型 + 访问标识

```text
MethodDefinition.ParameterDefinition.Initial<T> defineMethod(String name, Type returnType, ModifierContributor.ForMethod... modifierContributor);
```

- `name`: method name
- `returnType`: return data type
- `modifierContributor`: method visibility

预期目标：

```java
public class HelloWorld {
    public final void test() {
    }
}
```

编码实现：

```java
import net.bytebuddy.ByteBuddy;
import net.bytebuddy.description.modifier.MethodManifestation;
import net.bytebuddy.description.modifier.Visibility;
import net.bytebuddy.dynamic.DynamicType;
import net.bytebuddy.implementation.StubMethod;

public class HelloWorldSubClass {
    public static void main(String[] args) throws Exception {
        // 第一步，准备参数
        String className = "sample.HelloWorld";


        // 第二步，生成类
        ByteBuddy byteBuddy = new ByteBuddy();
        DynamicType.Builder<?> builder = byteBuddy.subclass(Object.class)
                .modifiers(Visibility.PUBLIC)
                .name(className);

        builder = builder.defineMethod("test", void.class, Visibility.PUBLIC, MethodManifestation.FINAL)
                .intercept(StubMethod.INSTANCE);


        // 第三步，输出结果
        DynamicType.Unloaded<?> unloadedType = builder.make();
        OutputUtils.save(unloadedType);
    }
}
```

对于方法来说，它可用的修饰符有：

```text
                                                                           ┌─── PUBLIC
                                                                           │
                                              ┌─── Visibility ─────────────┼─── PROTECTED
                                              │                            │
                                              │                            └─── PRIVATE
                                              │
                                              ├─── Ownership ──────────────┼─── STATIC
                                              │
                                              ├─── MethodArguments ────────┼─── VARARGS
                                              │
                                              │                            ┌─── NATIVE
                                              │                            │
                                              │                            ├─── ABSTRACT
net.bytebuddy.description.modifier: method ───┼─── MethodManifestation ────┤
                                              │                            ├─── FINAL
                                              │                            │
                                              │                            └─── BRIDGE
                                              │
                                              ├─── Mandate ────────────────┼─── MANDATED
                                              │
                                              ├─── MethodStrictness ───────┼─── STRICT
                                              │
                                              ├─── SynchronizationState ───┼─── SYNCHRONIZED
                                              │
                                              └─── SyntheticState ─────────┼─── SYNTHETIC
```

另外，`net.bytebuddy.jar.asm.Opcodes` 也可以用来给方法提供访问标识（access flags），
多个 `Opcodes` 之间用 `|` 分隔。

```text
builder = builder.defineMethod("test", void.class, Opcodes.ACC_PUBLIC | Opcodes.ACC_FINAL)
        .intercept(StubMethod.INSTANCE);
```

### 方法参数

为方法提供参数，需要用到 `withParameter()` 方法，其中常用的两种形式：

#### withParameter()

- `withParameter(Type type, String name, ModifierContributor.ForParameter... modifierContributor);`
- `withParameter(Type type, String name, int modifiers)`

预期目标：

```java
public class HelloWorld {
    public void test(final String name, int age) {
    }
}
```

编码实现：

```java
import net.bytebuddy.ByteBuddy;
import net.bytebuddy.description.modifier.ParameterManifestation;
import net.bytebuddy.description.modifier.Visibility;
import net.bytebuddy.dynamic.DynamicType;
import net.bytebuddy.implementation.StubMethod;

public class HelloWorldSubClass {
    public static void main(String[] args) throws Exception {
        // 第一步，准备参数
        String className = "sample.HelloWorld";


        // 第二步，生成类
        ByteBuddy byteBuddy = new ByteBuddy();
        DynamicType.Builder<?> builder = byteBuddy.subclass(Object.class)
                .modifiers(Visibility.PUBLIC)
                .name(className);

        builder = builder.defineMethod("test", void.class, Visibility.PUBLIC)
                .withParameter(String.class, "name", ParameterManifestation.FINAL)
                .withParameter(int.class, "age", ParameterManifestation.PLAIN)
                .intercept(StubMethod.INSTANCE);


        // 第三步，输出结果
        DynamicType.Unloaded<?> unloadedType = builder.make();
        OutputUtils.save(unloadedType);
    }
}
```

#### withParameters()

- `withParameters(Type... type)`
- `withParameters(List<? extends Type> types)`
- `withParameters(TypeDefinition... type)`
- `withParameters(Collection<? extends TypeDefinition> types)`

```text
builder = builder.defineMethod("test", void.class, Visibility.PUBLIC)
        .withParameters(String.class, int.class)
        .intercept(StubMethod.INSTANCE);
```

#### 可变参数

预期目标：生成可变长参数 `int...`

```java
public class HelloWorld {
    public void test(String var1, int... var2) {
    }
}
```

编码实现：

```java
import net.bytebuddy.ByteBuddy;
import net.bytebuddy.description.modifier.MethodArguments;
import net.bytebuddy.description.modifier.Visibility;
import net.bytebuddy.dynamic.DynamicType;
import net.bytebuddy.implementation.StubMethod;

public class HelloWorldSubClass {
    public static void main(String[] args) throws Exception {
        // 第一步，准备参数
        String className = "sample.HelloWorld";


        // 第二步，生成类
        ByteBuddy byteBuddy = new ByteBuddy();
        DynamicType.Builder<?> builder = byteBuddy.subclass(Object.class)
                .modifiers(Visibility.PUBLIC)
                .name(className);

        builder = builder.defineMethod(
                        "test",
                        void.class,
                        Visibility.PUBLIC,
                        MethodArguments.VARARGS               // 注意一，带有 ACC_VARARGS 标识
                )
                .withParameters(String.class, int[].class)    // 注意二，第二个参数是数组类型
                .intercept(StubMethod.INSTANCE);


        // 第三步，输出结果
        DynamicType.Unloaded<?> unloadedType = builder.make();
        OutputUtils.save(unloadedType);
    }
}
```

### 声明异常

预期目标：

```java
public class HelloWorld {
    public void test(String name, int age) throws FileNotFoundException, IOException {
    }
}
```

编码实现：

```java
import net.bytebuddy.ByteBuddy;
import net.bytebuddy.description.modifier.Visibility;
import net.bytebuddy.dynamic.DynamicType;
import net.bytebuddy.implementation.StubMethod;

import java.io.FileNotFoundException;
import java.io.IOException;

public class HelloWorldSubClass {
    public static void main(String[] args) throws Exception {
        // 第一步，准备参数
        String className = "sample.HelloWorld";


        // 第二步，生成类
        ByteBuddy byteBuddy = new ByteBuddy();
        DynamicType.Builder<?> builder = byteBuddy.subclass(Object.class)
                .modifiers(Visibility.PUBLIC)
                .name(className);

        builder = builder.defineMethod("test", void.class, Visibility.PUBLIC)
                .withParameter(String.class, "name")
                .withParameter(int.class, "age")
                .throwing(FileNotFoundException.class, IOException.class)
                .intercept(StubMethod.INSTANCE);


        // 第三步，输出结果
        DynamicType.Unloaded<?> unloadedType = builder.make();
        OutputUtils.save(unloadedType);
    }
}
```

## Method Body

对于方法体（method body）来说，有两种情况：

- 第一种情况，没有方法体，需要使用 `withoutCode()` 方法。
- 第二种情况，有方法体，需要使用 `intercept()` 方法。

### 抽象方法

抽象方法，要带有 `abstract` 标识，没有方法体（method body）；同时，要注意类本身也是抽象的（`TypeManifestation.ABSTRACT`）。

The `withoutCode` method is used to generate the abstract method.

预期目标：

```java
public abstract class HelloWorld {
    public abstract void test();
}
```

编码实现：

```java
import net.bytebuddy.ByteBuddy;
import net.bytebuddy.description.modifier.MethodManifestation;
import net.bytebuddy.description.modifier.TypeManifestation;
import net.bytebuddy.description.modifier.Visibility;
import net.bytebuddy.dynamic.DynamicType;

public class HelloWorldSubClass {
    public static void main(String[] args) throws Exception {
        // 第一步，准备参数
        String className = "sample.HelloWorld";


        // 第二步，生成类
        ByteBuddy byteBuddy = new ByteBuddy();
        DynamicType.Builder<?> builder = byteBuddy.subclass(Object.class)
                .modifiers(Visibility.PUBLIC, TypeManifestation.ABSTRACT)    // 注意，这里是抽象类
                .name(className);

        builder = builder.defineMethod("test", void.class, Visibility.PUBLIC, MethodManifestation.ABSTRACT)
                .withoutCode();


        // 第三步，输出结果
        DynamicType.Unloaded<?> unloadedType = builder.make();
        OutputUtils.save(unloadedType);
    }
}
```

### 默认实现 -StubMethod

The `StubMethod.INSTANCE` creates a **method stub**
which returns **the default value** of **the return type** of the method.

```text
method stub = a piece of code
```

默认值:

- 如果返回值类型是 `void`，则直接返回 `return`。
- 如果返回值类型是 `boolean`，则返回 `return false`。
- 如果返回值类型是 `char`，则返回 `return null`。
- 如果返回值类型是数值类型（numeric type），例如 `int` 和 `long`，则返回 `return 0`。
- 如果返回值类型是引用类型（reference type），包括 `Integer`、`Long` 等，则返回 `return null`。

```java
import net.bytebuddy.ByteBuddy;
import net.bytebuddy.description.modifier.Visibility;
import net.bytebuddy.dynamic.DynamicType;
import net.bytebuddy.implementation.StubMethod;

public class HelloWorldSubClass {
    public static void main(String[] args) throws Exception {
        // 第一步，准备参数
        String className = "sample.HelloWorld";


        // 第二步，生成类
        ByteBuddy byteBuddy = new ByteBuddy();
        DynamicType.Builder<?> builder = byteBuddy.subclass(Object.class)
                .modifiers(Visibility.PUBLIC)
                .name(className);

        builder = builder.defineMethod("test", void.class, Visibility.PUBLIC)    // 可尝试替换成 int.class、String.class
                .intercept(StubMethod.INSTANCE);


        // 第三步，输出结果
        DynamicType.Unloaded<?> unloadedType = builder.make();
        OutputUtils.save(unloadedType);
    }
}
```

### 固定值 -FixedValue

#### 常量值

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
    public static void main(String[] args) throws Exception {
        // 第一步，准备参数
        String className = "sample.HelloWorld";


        // 第二步，生成类
        ByteBuddy byteBuddy = new ByteBuddy();
        DynamicType.Builder<?> builder = byteBuddy.subclass(Object.class)
                .modifiers(Visibility.PUBLIC)
                .name(className);

        builder = builder.defineMethod("test", int.class, Visibility.PUBLIC)
                .intercept(FixedValue.value(-1));


        // 第三步，输出结果
        DynamicType.Unloaded<?> unloadedType = builder.make();
        OutputUtils.save(unloadedType);
    }
}
```

#### null 值

预期目标：

```java
public class HelloWorld {
    public String test() {
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

        builder = builder.defineMethod("test", String.class, Visibility.PUBLIC)
                .intercept(FixedValue.nullValue());


        // 第三步，输出结果
        DynamicType.Unloaded<?> unloadedType = builder.make();
        OutputUtils.save(unloadedType);
    }
}
```

#### 参数值

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
    public static void main(String[] args) throws Exception {
        // 第一步，准备参数
        String className = "sample.HelloWorld";


        // 第二步，生成类
        ByteBuddy byteBuddy = new ByteBuddy();
        DynamicType.Builder<?> builder = byteBuddy.subclass(Object.class)
                .modifiers(Visibility.PUBLIC)
                .name(className);

        builder = builder.defineMethod("test", int.class, Visibility.PUBLIC)
                .withParameter(String.class, "name")
                .withParameter(int.class, "age")
                .intercept(FixedValue.argument(1));


        // 第三步，输出结果
        DynamicType.Unloaded<?> unloadedType = builder.make();
        OutputUtils.save(unloadedType);
    }
}
```

### 字段值 -FieldAccessor

To create the **method body** of the getter method, the `FieldAccessor` is used.

预期目标：

```java
public class HelloWorld {
    private String name;

    protected String getName() {
        return this.name;
    }

    protected void setName(String str) {
        this.name = str;
    }
}
```

编码实现：

```java
import net.bytebuddy.ByteBuddy;
import net.bytebuddy.description.modifier.Visibility;
import net.bytebuddy.dynamic.DynamicType;
import net.bytebuddy.implementation.FieldAccessor;

public class HelloWorldSubClass {
    public static void main(String[] args) throws Exception {
        // 第一步，准备参数
        String className = "sample.HelloWorld";


        // 第二步，生成类
        ByteBuddy byteBuddy = new ByteBuddy();
        DynamicType.Builder<?> builder = byteBuddy.subclass(Object.class)
                .modifiers(Visibility.PUBLIC)
                .name(className);

        builder = builder.defineField("name", String.class, Visibility.PRIVATE);

        builder = builder.defineMethod("getName", String.class, Visibility.PROTECTED)
                .intercept(
                        FieldAccessor.ofField("name")
                )
                .defineMethod("setName", void.class, Visibility.PROTECTED)
                .withParameter(String.class, "str")
                .intercept(
                        FieldAccessor.ofField("name")
                );


        // 第三步，输出结果
        DynamicType.Unloaded<?> unloadedType = builder.make();
        OutputUtils.save(unloadedType);
    }
}
```

### MethodCall

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
    public static void main(String[] args) throws Exception {
        // 第一步，准备参数
        String className = "sample.HelloWorld";


        // 第二步，生成类
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


        // 第三步，输出结果
        DynamicType.Unloaded<?> unloadedType = builder.make();
        OutputUtils.save(unloadedType);
    }
}
```

### MethodDelegation

预期目标：

```java
public class HelloWorld {
    public String test(String name, int age) {
        return HardWorker.doWork(name, age);
    }
}
```

其中，`HardWorker` 定义如下：

```java
import java.util.Base64;
import java.util.Date;

public class HelloWorld {
    public String test(String name, int age, Date date) {
        String str = String.format("%s:%s:%s", name, age, date);
        byte[] bytes = str.getBytes();
        return Base64.getEncoder().encodeToString(bytes);
    }
}
```

编码实现：

```java
import net.bytebuddy.ByteBuddy;
import net.bytebuddy.description.modifier.Visibility;
import net.bytebuddy.dynamic.DynamicType;
import net.bytebuddy.implementation.MethodDelegation;

public class HelloWorldSubClass {
    public static void main(String[] args) throws Exception {
        // 第一步，准备参数
        String className = "sample.HelloWorld";


        // 第二步，生成类
        ByteBuddy byteBuddy = new ByteBuddy();
        DynamicType.Builder<?> builder = byteBuddy.subclass(Object.class)
                .modifiers(Visibility.PUBLIC)
                .name(className);

        builder = builder.defineMethod("test", String.class, Visibility.PUBLIC)
                .withParameter(String.class, "name")
                .withParameter(int.class, "age")
                .intercept(
                        MethodDelegation.to(HardWorker.class)
                );


        // 第三步，输出结果
        DynamicType.Unloaded<?> unloadedType = builder.make();
        OutputUtils.save(unloadedType);
    }
}
```

进行测试：

```java
import lsieun.utils.InvokeUtils;

public class HelloWorldRun {
    public static void main(String[] args) throws Exception {
        InvokeUtils.invokeAllMethods("sample.HelloWorld");
    }
}
```

### ExceptionMethod

预期目标：

```java
import java.io.FileNotFoundException;

public class HelloWorld {
    public Object test() {
        throw new FileNotFoundException();
    }
}
```

编码实现：

```java
import net.bytebuddy.ByteBuddy;
import net.bytebuddy.description.modifier.Visibility;
import net.bytebuddy.dynamic.DynamicType;
import net.bytebuddy.implementation.ExceptionMethod;

import java.io.FileNotFoundException;

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
                .intercept(
                        ExceptionMethod.throwing(FileNotFoundException.class)
                );


        // 第三步，输出结果
        DynamicType.Unloaded<?> unloadedType = builder.make();
        OutputUtils.save(unloadedType);
    }
}
```

## Property

在之前，我们都是通过 `defineField()` 来添加字段，通过 `defineMethod()` 来添加方法。
相对之下，`defineProperty()` 方法会自动创建相应的字段和方法，将 `defineField()` 和 `defineMethod()` 合二为一。

The `defineProperty` method is used to create public setter and getter method.

`defineProperty()` 方法添加的 setter 和 getter 都是 public 的。

```java
public class HelloWorld {
    private String name;

    public void setName(String name) {
        this.name = name;
    }

    public String getName() {
        return this.name;
    }
}
```

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

        builder = builder.defineProperty("name", String.class);


        // 第三步，输出结果
        DynamicType.Unloaded<?> unloadedType = builder.make();
        OutputUtils.save(unloadedType);
    }
}
```

However, `defineProperty` can only declare setter and getter method that have public visibility.
To declare setter and getter method that have other visibility than public, uses `defineMethod` for this purpose.

## 总结

本文内容总结如下：

- 第一点，

