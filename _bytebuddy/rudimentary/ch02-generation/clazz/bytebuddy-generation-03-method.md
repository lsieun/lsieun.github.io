---
title: "普通方法：defineMethod()"
sequence: "103"
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
                       ┌─── input ────┤                   └─── simplify ────────┼─── serialVersionUid()
                       │              │
                       │              │                   ┌─── defineConstructor()
                       │              ├─── constructor ───┤
                       │              │                   └─── define()
                       │              │
                       │              │                   ┌─── defineMethod()
                       │              │                   │
DynamicType.Builder ───┤              │                   ├─── define()
                       │              └─── method ────────┤
                       │                                  │                      ┌─── defineProperty()
                       │                                  │                      │
                       │                                  └─── simplify ─────────┼─── withHashCodeEquals()
                       │                                                         │
                       │                                                         └─── withToString()
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

## 方法头

### 方法名 + 返回类型 + 访问标识

```text
MethodDefinition.ParameterDefinition.Initial<T> defineMethod(
    String name,
    Type returnType,
    ModifierContributor.ForMethod... modifierContributor
);
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
    public static void main(String[] args) {
        // 1. prepare
        String className = "sample.HelloWorld";


        // 2. weave
        ByteBuddy byteBuddy = new ByteBuddy();
        DynamicType.Builder<?> builder = byteBuddy.subclass(Object.class)
                .modifiers(Visibility.PUBLIC)
                .name(className);

        builder = builder.defineMethod("test", void.class, Visibility.PUBLIC, MethodManifestation.FINAL)
                .intercept(StubMethod.INSTANCE);


        // 3. output
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
    public static void main(String[] args) {
        // 1. prepare
        String className = "sample.HelloWorld";


        // 2. weave
        ByteBuddy byteBuddy = new ByteBuddy();
        DynamicType.Builder<?> builder = byteBuddy.subclass(Object.class)
                .modifiers(Visibility.PUBLIC)
                .name(className);

        builder = builder.defineMethod("test", void.class, Visibility.PUBLIC)
                .withParameter(String.class, "name", ParameterManifestation.FINAL)
                .withParameter(int.class, "age", ParameterManifestation.PLAIN)
                .intercept(StubMethod.INSTANCE);


        // 3. output
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
    public static void main(String[] args) {
        // 1. prepare
        String className = "sample.HelloWorld";


        // 2. weave
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


        // 3. output
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
    public static void main(String[] args) {
        // 1. prepare
        String className = "sample.HelloWorld";


        // 2. weave
        ByteBuddy byteBuddy = new ByteBuddy();
        DynamicType.Builder<?> builder = byteBuddy.subclass(Object.class)
                .modifiers(Visibility.PUBLIC)
                .name(className);

        builder = builder.defineMethod("test", void.class, Visibility.PUBLIC)
                .withParameter(String.class, "name")
                .withParameter(int.class, "age")
                .throwing(FileNotFoundException.class, IOException.class)
                .intercept(StubMethod.INSTANCE);


        // 3. output
        DynamicType.Unloaded<?> unloadedType = builder.make();
        OutputUtils.save(unloadedType);
    }
}
```

## 方法体

对于方法体（method body）来说，有两种情况：

- 第一种情况，没有方法体，需要使用 `withoutCode()` 方法。
- 第二种情况，有方法体，需要使用 `intercept()` 方法。

### 无方法体（抽象方法）

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
    public static void main(String[] args) {
        // 1. prepare
        String className = "sample.HelloWorld";


        // 2. weave
        ByteBuddy byteBuddy = new ByteBuddy();
        DynamicType.Builder<?> builder = byteBuddy.subclass(Object.class)
                .modifiers(Visibility.PUBLIC, TypeManifestation.ABSTRACT)    // 注意一，类是抽象的
                .name(className);

        builder = builder.defineMethod("test", void.class, Visibility.PUBLIC, MethodManifestation.ABSTRACT)    // 注意二，方法是是抽象的
                .withoutCode();    // 注意三，这里不需要提供代码实现


        // 3. output
        DynamicType.Unloaded<?> unloadedType = builder.make();
        OutputUtils.save(unloadedType);
    }
}
```

### 有方法体（非抽象方法）

预期目标：

```java
public class HelloWorld {
    public void test() {
        return;
    }
}
```

编码实现：

```java
import net.bytebuddy.ByteBuddy;
import net.bytebuddy.description.modifier.Visibility;
import net.bytebuddy.dynamic.DynamicType;
import net.bytebuddy.implementation.StubMethod;

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
                .intercept(StubMethod.INSTANCE);


        // 3. output
        DynamicType.Unloaded<?> unloadedType = builder.make();
        OutputUtils.save(unloadedType);
    }
}
```

## 扩展（代码简化）

### Property

在之前，我们都是通过 `defineField()` 来添加字段，通过 `defineMethod()` 来添加方法。
相对之下，`defineProperty()` 方法会自动创建相应的字段和方法，将 `defineField()` 和 `defineMethod()` 合二为一。

The `defineProperty` method is used to create public setter and getter method.

`defineProperty()` 方法添加的 setter 和 getter 都是 public 的。

预期目标：

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

#### 方式一

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

        builder = builder.defineProperty("name", String.class);


        // 3. output
        DynamicType.Unloaded<?> unloadedType = builder.make();
        OutputUtils.save(unloadedType);
    }
}
```

However, `defineProperty` can only declare setter and getter method that have public visibility.
To declare setter and getter method that have other visibility than public, uses `defineMethod` for this purpose.

#### 方式二

编码实现：

```java
import net.bytebuddy.ByteBuddy;
import net.bytebuddy.description.modifier.Visibility;
import net.bytebuddy.dynamic.DynamicType;
import net.bytebuddy.implementation.FieldAccessor;

public class HelloWorldSubClass {
    public static void main(String[] args) {
        // 1. prepare
        String className = "sample.HelloWorld";


        // 2. weave
        ByteBuddy byteBuddy = new ByteBuddy();
        DynamicType.Builder<?> builder = byteBuddy.subclass(Object.class)
                .modifiers(Visibility.PUBLIC)
                .name(className);

        // 字段：name
        builder = builder.defineField("name", String.class, Visibility.PRIVATE);

        // 方法：getName
        builder = builder.defineMethod("getName", String.class, Visibility.PUBLIC)
                .intercept(FieldAccessor.ofField("name"));

        // 方法：setName
        builder = builder.defineMethod("setName", void.class, Visibility.PUBLIC)
                .withParameter(String.class, "str")
                .intercept(FieldAccessor.ofField("name").setsArgumentAt(0));


        // 3. output
        DynamicType.Unloaded<?> unloadedType = builder.make();
        OutputUtils.save(unloadedType);
    }
}
```

### Hash + Equals

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

        builder = builder.defineProperty("name", String.class)
                .defineProperty("age", int.class);

        builder = builder.withHashCodeEquals();


        // 3. output
        DynamicType.Unloaded<?> unloadedType = builder.make();
        OutputUtils.save(unloadedType);
    }
}
```

### ToString

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

        builder = builder.defineProperty("name", String.class)
                .defineProperty("age", int.class);

        builder = builder.withToString();


        // 3. output
        DynamicType.Unloaded<?> unloadedType = builder.make();
        OutputUtils.save(unloadedType);
    }
}
```

## 总结

本文内容总结如下：

- 第一点，方法由方法头和方法体两部分组成：
    - 方法头
        - `defineMethod`： 方法名、返回值类型、访问标识
        - `withParameter`：方法参数
        - `throwing`：抛出异常
    - 方法体
        - `withoutCode`：无方法体
        - `intercept`：有方法体
- 第二点，`defineProperty()`、`withHashCodeEquals()` 和 `withToString()` 都是为了简化方法实现，减少我们书写的代码量。

