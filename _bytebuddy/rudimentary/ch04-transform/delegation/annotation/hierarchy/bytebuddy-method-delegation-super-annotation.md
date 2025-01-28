---
title: "@Super"
sequence: "104"
---

## 介绍

Sometimes, you might however want to call a **super method** with **different arguments** than
those that were assigned on the method's original invocation.

This is also possible in Byte Buddy by using the `@Super` annotation.
This annotation triggers the creation of another `AuxiliaryType`
which now extends a super class or an interface of the dynamic type in question.

Similar to before, the auxiliary type overrides all methods to call their super implementations on the dynamic type.

## 示例

### 代码准备

![](/assets/images/bytebuddy/delegation/bytebuddy-method-delegation-annotation-super-class-hierarchy.svg)

ITest

```java
public interface ITest {
    String test(String name, int age);
}
```

GrandParent

```java
public class GrandParent implements ITest {
    public String sayGoodMorning() {
        return "Good Morning From GrandParent";
    }

    @Override
    public String test(String name, int age) {
        return String.format("GrandParent: %s - %d", name, age);
    }
}
```

Parent

```java
public class Parent extends GrandParent {
    public String sayGoodAfternoon() {
        return "Good Afternoon From Parent";
    }

    @Override
    public String test(String name, int age) {
        return String.format("Parent: %s - %d", name, age);
    }
}
```

DefaultTest

```java
public interface DefaultTest extends ITest {
    @Override
    default String test(String name, int age) {
        return String.format("DefaultTest: %s - %d", name, age);
    }
}
```

HelloWorld

```java
public class HelloWorld extends Parent implements DefaultTest {
    public String sayGoodNight() {
        return "Good Night From HelloWorld";
    }

    @Override
    public String test(String name, int age) {
        return String.format("HelloWorld: %s - %d", name, age);
    }
}
```

HelloWorldRun

```java
public class HelloWorldRun {
    public static void main(String[] args) {
        HelloWorld instance = new HelloWorld();
        String msg = instance.test("Tom", 10);
        System.out.println(msg);
    }
}
```

```text
HelloWorld: Tom - 10
```

Weaver

```java
import net.bytebuddy.ByteBuddy;
import net.bytebuddy.dynamic.DynamicType;
import net.bytebuddy.implementation.MethodDelegation;
import net.bytebuddy.matcher.ElementMatchers;

public class HelloWorldRebase {
    public static void main(String[] args) {
        // 1. prepare
        String className = "sample.HelloWorld";
        Class<?> clazz = ClassUtils.loadClass(className);


        // 2. weave
        ByteBuddy byteBuddy = new ByteBuddy();
        DynamicType.Builder<?> builder = byteBuddy.rebase(clazz);

        builder = builder.method(
                ElementMatchers.named("test")
        ).intercept(
                MethodDelegation.to(HardWorker.class)
        );


        // 3. output
        DynamicType.Unloaded<?> unloadedType = builder.make();
        OutputUtils.save(unloadedType, true);
    }
}
```

### HardWorker

#### Object


```java
import net.bytebuddy.implementation.bind.annotation.RuntimeType;
import net.bytebuddy.implementation.bind.annotation.Super;

public class HardWorker {
    @RuntimeType
    public static Object doWork(@Super Object zuper /* 注意：这里是 Object 类型 */) {
        return String.format("@Super Object: %s", zuper.getClass().getName());
    }
}
```

![](/assets/images/bytebuddy/delegation/bytebuddy-method-delegation-annotation-super-class-hierarchy-at-object.svg)

```java
public class HelloWorld extends Parent implements DefaultTest {

    // --------------------------- HelloWorld ---------------------------

    public String sayGoodNight() {
        return "Good Night From HelloWorld";
    }

    public String test(String name, int age) {
        HelloWorld$auxiliary$Proxy proxyObj = new HelloWorld$auxiliary$Proxy();
        proxyObj.target = this;
        return (String) HardWorker.doWork(proxyObj);
    }

    private String test$original$Abc(String name, int age) {
        return String.format("HelloWorld: %s - %d", name, age);
    }

    // --------------------------- Object ---------------------------
    final boolean equals$accessor$Xyz(Object obj) {
        return super.equals(obj);
    }

    final int hashCode$accessor$Xyz() {
        return super.hashCode();
    }

    final String toString$accessor$Xyz() {
        return super.toString();
    }

    final Object clone$accessor$Xyz() throws CloneNotSupportedException {
        return super.clone();
    }
}
```

```java
class HelloWorld$auxiliary$Proxy {
    public volatile HelloWorld target;

    public HelloWorld$auxiliary$Proxy() {
    }

    static HelloWorld$auxiliary$Proxy make() {
        return (HelloWorld$auxiliary$Proxy) ReflectionFactory.getReflectionFactory().newConstructorForSerialization(
                HelloWorld$auxiliary$Proxy.class,
                Object.class.getDeclaredConstructor()
        ).newInstance();
    }

    // --------------------------- Object ---------------------------
    public boolean equals(Object obj) {
        return this.target.equals$accessor$Xyz(obj);
    }

    public String toString() {
        return this.target.toString$accessor$Xyz();
    }

    public int hashCode() {
        return this.target.hashCode$accessor$Xyz();
    }

    protected Object clone() throws CloneNotSupportedException {
        return this.target.clone$accessor$Xyz();
    }
}
```

#### GrandParent

```java
import net.bytebuddy.implementation.bind.annotation.RuntimeType;
import net.bytebuddy.implementation.bind.annotation.Super;

public class HardWorker {
    @RuntimeType
    public static Object doWork(@Super GrandParent zuper /* 注意：这里是 GrandParent 类型 */) {
        return String.format("@Super GrandParent: %s", zuper.getClass().getName());
    }
}
```

![](/assets/images/bytebuddy/delegation/bytebuddy-method-delegation-annotation-super-class-hierarchy-at-grand-parent.svg)

```java
public class HelloWorld extends Parent implements DefaultTest {

    // --------------------------- HelloWorld ---------------------------
    public String sayGoodNight() {
        return "Good Night From HelloWorld";
    }

    public String test(String name, int age) {
        HelloWorld$auxiliary$Proxy proxyObj = new HelloWorld$auxiliary$Proxy();
        proxyObj.target = this;
        return (String) HardWorker.doWork(proxyObj);
    }

    private String test$original$Abc(String name, int age) {
        return String.format("name: %s, age: %s", name, age);
    }

    final String test$original$Abc$accessor$Xyz(String name, int age) {
        return this.test$original$Abc(name, age);
    }

    // --------------------------- GrandParent ---------------------------
    final String sayGoodMorning$accessor$Xyz() {
        return super.sayGoodMorning();
    }

    // --------------------------- Object ---------------------------
    // ...
}
```

```java
class HelloWorld$auxiliary$Proxy extends GrandParent {
    public volatile HelloWorld target;

    static HelloWorld$auxiliary$Proxy make() {
        return (HelloWorld$auxiliary$Proxy) ReflectionFactory.getReflectionFactory().newConstructorForSerialization(
                HelloWorld$auxiliary$Proxy.class,
                Object.class.getDeclaredConstructor()
        ).newInstance();
    }

    public String test(String name, int age) {
        return this.target.test$original$Abc$accessor$Xyz(name, age);
    }

    // --------------------------- GrandParent ---------------------------
    public String sayGoodMorning() {
        return this.target.sayGoodMorning$accessor$Xyz();
    }

    // --------------------------- Object ---------------------------
    // ...
}
```

#### Parent

```java
import net.bytebuddy.implementation.bind.annotation.RuntimeType;
import net.bytebuddy.implementation.bind.annotation.Super;

public class HardWorker {
    @RuntimeType
    public static Object doWork(@Super Parent zuper /* 注意：这里是 Parent 类型 */) {
        return String.format("@Super Parent: %s", zuper.getClass().getName());
    }
}
```

![](/assets/images/bytebuddy/delegation/bytebuddy-method-delegation-annotation-super-class-hierarchy-at-parent.svg)

```java
public class HelloWorld extends Parent implements DefaultTest {

    // --------------------------- HelloWorld ---------------------------
    public String sayGoodNight() {
        return "Good Night From HelloWorld";
    }

    public String test(String name, int age) {
        HelloWorld$auxiliary$Proxy proxyObj = new HelloWorld$auxiliary$Proxy();
        proxyObj.target = this;
        return (String) HardWorker.doWork(proxyObj);
    }

    private String test$original$Abc(String name, int age) {
        return String.format("name: %s, age: %s", name, age);
    }

    final String test$original$Abc$accessor$Xyz(String name, int age) {
        return this.test$original$SUZrp15p(name, age);
    }

    // --------------------------- Parent ---------------------------
    final String sayGoodAfternoon$accessor$Xyz() {
        return super.sayGoodAfternoon();
    }

    // --------------------------- GrandParent ---------------------------
    final String sayGoodMorning$accessor$Xyz() {
        return super.sayGoodMorning();
    }

    // --------------------------- Object ---------------------------
    // ...
}
```

```java
class HelloWorld$auxiliary$Proxy extends Parent {
    public volatile HelloWorld target;

    static HelloWorld$auxiliary$Proxy make() {
        return (HelloWorld$auxiliary$Proxy) ReflectionFactory.getReflectionFactory().newConstructorForSerialization(
                HelloWorld$auxiliary$Proxy.class,
                Object.class.getDeclaredConstructor()
        ).newInstance();
    }

    public String test(String name, int age) {
        return this.target.test$original$Abc$accessor$Xyz(name, age);
    }

    // --------------------------- Parent ---------------------------
    public String sayGoodAfternoon() {
        return this.target.sayGoodAfternoon$accessor$Xyz();
    }

    // --------------------------- GrandParent ---------------------------
    public String sayGoodMorning() {
        return this.target.sayGoodMorning$accessor$Xyz();
    }

    // --------------------------- Object ---------------------------
    // ...
}
```

#### ITest

```java
import net.bytebuddy.implementation.bind.annotation.RuntimeType;
import net.bytebuddy.implementation.bind.annotation.Super;

public class HardWorker {
    @RuntimeType
    public static Object doWork(@Super ITest zuper /* 注意：这里是 ITest 类型 */) {
        return String.format("@Super ITest: %s", zuper.getClass().getName());
    }
}
```

![](/assets/images/bytebuddy/delegation/bytebuddy-method-delegation-annotation-super-class-hierarchy-at-itest.svg)

```java
public class HelloWorld extends Parent implements DefaultTest {
    // --------------------------- HelloWorld ---------------------------
    public String sayGoodNight() {
        return "Good Night From HelloWorld";
    }

    public String test(String name, int age) {
        HelloWorld$auxiliary$Proxy proxyObj = new HelloWorld$auxiliary$Proxy();
        proxyObj.target = this;
        return (String) HardWorker.doWork(proxyObj);
    }

    private String test$original$Abc(String name, int age) {
        return String.format("name: %s, age: %s", name, age);
    }

    final String test$original$Abc$accessor$Xyz(String name, int age) {
        return this.test$original$Abc(name, age);
    }

    // --------------------------- Object ---------------------------
    // ...
}
```

```java
class HelloWorld$auxiliary$Proxy implements ITest {
    public volatile HelloWorld target;

    static HelloWorld$auxiliary$Proxy make() {
        return (HelloWorld$auxiliary$Proxy) ReflectionFactory.getReflectionFactory().newConstructorForSerialization(
                HelloWorld$auxiliary$Proxy.class,
                Object.class.getDeclaredConstructor()
        ).newInstance();
    }

    // --------------------------- ITest ---------------------------
    public String test(String name, int age) {
        return this.target.test$original$Abc$accessor$Xyz(name, age);
    }

    // --------------------------- Object ---------------------------
    // ...
}
```

#### DefaultTest

```java
import net.bytebuddy.implementation.bind.annotation.RuntimeType;
import net.bytebuddy.implementation.bind.annotation.Super;

public class HardWorker {
    @RuntimeType
    public static Object doWork(@Super DefaultTest zuper /* 注意：这里是 DefaultTest 类型 */) {
        return String.format("@Super DefaultTest: %s", zuper.getClass().getName());
    }
}
```

![](/assets/images/bytebuddy/delegation/bytebuddy-method-delegation-annotation-super-class-hierarchy-at-default-test.svg)

```java
public class HelloWorld extends Parent implements DefaultTest {

    // --------------------------- HelloWorld ---------------------------
    public String sayGoodNight() {
        return "Good Night From HelloWorld";
    }

    public String test(String name, int age) {
        HelloWorld$auxiliary$Proxy proxyObj = new HelloWorld$auxiliary$Proxy();
        proxyObj.target = this;
        return (String) HardWorker.doWork(proxyObj);
    }

    private String test$original$Abc(String name, int age) {
        return String.format("HelloWorld: %s - %d", name, age);
    }

    final String test$original$Abc$accessor$Xyz(String name, int age) {
        return this.test$original$Abc(name, age);
    }

    // --------------------------- Object ---------------------------
    // ...
}
```

```java
class HelloWorld$auxiliary$Proxy implements DefaultTest {
    public volatile HelloWorld target;

    static HelloWorld$auxiliary$Proxy make() {
        return (HelloWorld$auxiliary$Proxy) ReflectionFactory.getReflectionFactory().newConstructorForSerialization(
                HelloWorld$auxiliary$Proxy.class, Object.class.getDeclaredConstructor()
        ).newInstance();
    }

    // --------------------------- DefaultTest ---------------------------
    public String test(String name, int age) {
        return this.target.test$original$Abc$accessor$Xyz(name, age);
    }

    // --------------------------- Object ---------------------------
    // ...
}
```

#### HelloWorld

```java
import net.bytebuddy.implementation.bind.annotation.RuntimeType;
import net.bytebuddy.implementation.bind.annotation.Super;

public class HardWorker {
    @RuntimeType
    public static Object doWork(@Super HelloWorld zuper /* 注意：这里是 HelloWorld 类型 */) {
        return String.format("@Super HelloWorld: %s", zuper.getClass().getName());
    }
}
```

![](/assets/images/bytebuddy/delegation/bytebuddy-method-delegation-annotation-super-class-hierarchy-at-helloworld.svg)

```java
public class HelloWorld extends Parent implements DefaultTest {

    // --------------------------- HelloWorld ---------------------------
    public String sayGoodNight() {
        return "Good Night From HelloWorld";
    }

    public String test(String name, int age) {
        HelloWorld$auxiliary$Proxy proxyObj = new HelloWorld$auxiliary$Proxy();
        proxyObj.target = this;
        return (String) HardWorker.doWork(proxyObj);
    }

    private String test$original$Abc(String name, int age) {
        return String.format("name: %s, age: %s", name, age);
    }

    final String test$original$Abc$accessor$Xyz(String name, int age) {
        return this.test$original$Abc(name, age);
    }

    // --------------------------- Parent ---------------------------
    final String sayGoodAfternoon$accessor$Xyz() {
        return super.sayGoodAfternoon();
    }

    // --------------------------- GrandParent ---------------------------
    final String sayGoodMorning$accessor$Xyz() {
        return super.sayGoodMorning();
    }

    // --------------------------- Object ---------------------------
    // ...
}
```

```java
class HelloWorld$auxiliary$Proxy extends HelloWorld {
    public volatile HelloWorld target;

    static HelloWorld$auxiliary$Proxy make() {
        return (HelloWorld$auxiliary$Proxy) ReflectionFactory.getReflectionFactory().newConstructorForSerialization(
                HelloWorld$auxiliary$Proxy.class,
                Object.class.getDeclaredConstructor()
        ).newInstance();
    }

    public String test(String name, int age) {
        return this.target.test$original$Abc$accessor$Xyz(name, age);
    }

    // --------------------------- HelloWorld ---------------------------
    public String sayGoodNight() {
        throw new AbstractMethodError();    // 为什么这里抛出异常呢？
    }

    // --------------------------- Parent ---------------------------
    public String sayGoodAfternoon() {
        return this.target.sayGoodAfternoon$accessor$Xyz();
    }

    // --------------------------- GrandParent ---------------------------
    public String sayGoodMorning() {
        return this.target.sayGoodMorning$accessor$Xyz();
    }

    // --------------------------- Object ---------------------------
    // ...
}
```

#### 错误的类型：Number

```java
import net.bytebuddy.implementation.bind.annotation.RuntimeType;
import net.bytebuddy.implementation.bind.annotation.Super;

public class HardWorker {
    @RuntimeType
    public static Object doWork(@Super Number obj) {
        return String.format("@Super Number: %s", obj.getClass().getName());
    }
}
```

得到错误信息：

```text
Exception in thread "main" java.lang.IllegalArgumentException:
None of [
    public static Object HardWorker.doWork(Number)
] allows for delegation from
 public String HelloWorld.test(String,int)
```

## Proxy Class

```text
                                                                                                           ┌─── void.class: Parameter Type
                                                                                                           │
                                                              ┌─── super ───────┼─── @Super.proxyType() ───┼─── TargetType.class: Generated Class
                                                              │                                            │
                                      ┌─── class hierarchy ───┤                                            └─── Xxx.class: Class Hierarchy Type
                                      │                       │
                                      │                       └─── interface ───┼─── @Super.serializableProxy(): Serializable
                     ┌─── clazz ──────┤
                     │                ├─── field ─────────────┼─── target: Generated Class
                     │                │
                     │                │                       ┌─── make()
                     │                └─── method ────────────┤
@Super::ProxyType ───┤                                        └─── @Super.ignoreFinalizer()
                     │
                     │                                                   ┌─── strategy(): Instantiation.CONSTRUCTOR
                     │                ┌─── constructor ───┼─── @Super ───┤
                     │                │                                  └─── constructorResolver()
                     └─── instance ───┤
                                      │                                  ┌─── strategy(): Instantiation.UNSAFE
                                      └─── unsafe ────────┼─── @Super ───┤
                                                                         └─── constructorParameters()
```

### 类

#### 父类：proxyType

```java
import net.bytebuddy.implementation.bind.annotation.RuntimeType;
import net.bytebuddy.implementation.bind.annotation.Super;


public class HardWorker {
    @RuntimeType
    public static Object doWork(@Super(proxyType = Parent.class) GrandParent obj) {    // 注意：这里使用了 proxyType 属性
        return String.format("@Super GrandParent: %s", obj.getClass().getName());
    }
}
```

生成的 Proxy 类：

```java
class HelloWorld$auxiliary$Proxy extends Parent {    // 注意：这里是继承自 Parent 类
    // ...
}
```

#### 接口：serializableProxy

```java
import net.bytebuddy.implementation.bind.annotation.RuntimeType;
import net.bytebuddy.implementation.bind.annotation.Super;

public class HardWorker {
    @RuntimeType
    public static Object doWork(@Super(serializableProxy = true) Object obj) {    // 注意：这里使用了 serializableProxy 属性
        return String.format("@Super Object: %s", obj.getClass().getName());
    }
}
```

```java
class HelloWorld$auxiliary$Proxy implements Serializable {    // 注意：这里实现了 Serializable 接口
    // ...
}
```

#### 方法：ignoreFinalizer

```java
import net.bytebuddy.implementation.bind.annotation.RuntimeType;
import net.bytebuddy.implementation.bind.annotation.Super;

public class HardWorker {
    @RuntimeType
    public static Object doWork(@Super(ignoreFinalizer = false) Object obj) {    // 注意：这里使用了 ignoreFinalizer 属性
        return String.format("@Super Object: %s", obj.getClass().getName());
    }
}
```

```java
public class HelloWorld extends Parent implements DefaultTest {
    // ...
    
    // 注意：这里多添加一个 finalize 方法
    final void finalize$accessor$Xyz() throws Throwable {
        super.finalize();
    }
    
    // ...
}
```

```java
class HelloWorld$auxiliary$Proxy {
    // ..

    protected void finalize() throws Throwable {
        this.target.finalize$accessor$Xyz();
    }

    // ...
}
```

### 对象

#### unsafe

```java
import net.bytebuddy.implementation.bind.annotation.RuntimeType;
import net.bytebuddy.implementation.bind.annotation.Super;

public class HardWorker {
    @RuntimeType
    public static Object doWork(@Super(strategy = Super.Instantiation.UNSAFE) Object obj) {    // 注意：这里使用了 strategy 属性
        return String.format("@Super Object: %s", obj.getClass().getName());
    }
}
```

```java
public class HelloWorld extends Parent implements DefaultTest {
    // ...

    public String test(String name, int age) {
        HelloWorld$auxiliary$Proxy proxyObj = HelloWorld$auxiliary$Proxy.make();    // 注意：这里使用 make() 方法
        proxyObj.target = this;
        return (String) HardWorker.doWork(proxyObj);
    }

    // ...
}
```

```java
class HelloWorld$auxiliary$Proxy {
    public volatile HelloWorld target;

    static HelloWorld$auxiliary$Proxy make() {
        return (HelloWorld$auxiliary$Proxy) ReflectionFactory.getReflectionFactory().newConstructorForSerialization(
                HelloWorld$auxiliary$Proxy.class,
                Object.class.getDeclaredConstructor()
        ).newInstance();
    }

    // ...
}
```

#### constructor

```java
public class Parent extends GrandParent {
    public Parent() {
    }

    // 添加一个带参数的构造方法
    public Parent(String name, int age) {
    }

    public String sayGoodAfternoon() {
        return "Good Afternoon";
    }
}
```

```java
import net.bytebuddy.implementation.bind.annotation.RuntimeType;
import net.bytebuddy.implementation.bind.annotation.Super;

public class HardWorker {
    @RuntimeType
    public static Object doWork(@Super(constructorParameters = {String.class, int.class}) Parent obj) {    // 注意：这里使用了 constructorParameters 属性
        return String.format("@Super Parent: %s", obj.getClass().getName());
    }
}
```

```java
public class HelloWorld extends Parent implements DefaultTest {
    // ...
    public String test(String name, int age) {
        // 注意：这里传递了 String 和 int 类型的参数
        HelloWorld$auxiliary$Proxy proxyObj = new HelloWorld$auxiliary$Proxy((String) null, 0);
        proxyObj.target = this;
        return (String) HardWorker.doWork(proxyObj);
    }
    
    // ...
}
```

```java
class HelloWorld$auxiliary$Proxy extends Parent {
    public volatile HelloWorld target;

    public HelloWorld$auxiliary$Proxy() {
    }

    // 注意：这个构造方法接收 String 和 int 类型的参数
    public HelloWorld$auxiliary$Proxy(String name, int age) {
        super(name, age);
    }

    static HelloWorld$auxiliary$Proxy make() {
        return (HelloWorld$auxiliary$Proxy) ReflectionFactory.getReflectionFactory().newConstructorForSerialization(
                HelloWorld$auxiliary$Proxy.class,
                Object.class.getDeclaredConstructor()
        ).newInstance();
    }

    // --------------------------- Parent ---------------------------
    public String sayGoodAfternoon() {
        return this.target.sayGoodAfternoon$accessor$Xyz();
    }

    // --------------------------- GrandParent ---------------------------
    public String sayGoodMorning() {
        return this.target.sayGoodMorning$accessor$Xyz();
    }

    // --------------------------- Object ---------------------------
    // ...
}
```


## 注意事项

### 字段

Note that the instance that is assigned to the parameter annotated with `@Super` is of a different identity
to the actual instance of the dynamic type!
Therefore, **no instance field** that is accessible by means of the `@Super` parameter
reflects the **actual instance's field**.

使用 `@Super` 注解，无法获取到字段值。

如果想获取字段值，使用 `@This` 注解。

### 方法

Furthermore, **non-overridable methods** of the auxiliary instance do not delegate their invocations
but retain the original implementation which can result in absurd behavior when they are invoked.

下面的 `HelloWorld::finalMethod` 被 `final` 修饰：

```java
import java.util.Date;

public class HelloWorld extends Parent {
    public void test(String name, int age, Date date) {
        String str = String.format("%s:%s:%s", name, age, date);
        byte[] bytes = str.getBytes();
        return Base64.getEncoder().encodeToString(bytes);
        System.out.println(message);
    }

    public final void finalMethod() {
        System.out.println("Final Method");
    }
}
```

```java
import net.bytebuddy.implementation.bind.annotation.Super;

public class HardWorker {
    public static void doWork(@Super HelloWorld zuper) {
        System.out.println("This is doWork Method");
    }
}
```

```java
class HelloWorld$auxiliary$Proxy extends HelloWorld {
    public void sayHello() {
        this.target.sayHello$accessor$vn0eXPKB();
    }

    public void sayWorld() {
        this.target.sayWorld$accessor$vn0eXPKB();
    }

    public void test(String name, int age) {
        this.target.test$original$HL2qAVs0$accessor$vn0eXPKB(name, age);
    }
}
```

### 父类型不对

Finally, in case that a parameter that is annotated with `@Super`
does not represent a super type of the relevant dynamic type,
the method is not considered as a binding target for any of its methods.

### 构造方法

Because the `@Super` annotation allows for the use of any type,
we might be required to provide information on how this type can be constructed.

By default, Byte Buddy attempts to use a class's default constructor.
This always works for **interfaces** which implicitly extend the `Object` type.

However, when extending a super class of the dynamic type,
this class might not even provide a **default constructor**.

#### 第一种方法

If this is the case or if a specific constructor should be used for creating such an auxiliary type,
the `@Super` annotation allows to identify a different constructor
by setting its parameter types as the annotation's `constructorParameters` property.
This constructor will then be called by assigning the corresponding **default value** to each parameter.

```java
public class Parent extends GrandParent {
    public Parent() {
    }

    public Parent(String name, int age) {
    }

    public void sayWorld() {
        System.out.println("World");
    }
}
```

```java
import net.bytebuddy.implementation.bind.annotation.Super;

public class HardWorker {
    public static void doWork(@Super(constructorParameters = {String.class, int.class}) Parent zuper) {
        System.out.println("This is doWork Method");
    }
}
```

#### 第二种方法

Alternatively, it is also possible to use the `Super.Instantiation.UNSAFE` strategy for creating classes
which makes use of Java internal classes for creating the auxiliary type without invoking any constructor.

```java
import java.util.Date;

public class HelloWorld extends Parent {
    public HelloWorld(String name, int age) {
    }

    public void test(String name, int age, Date date) {
        String str = String.format("%s:%s:%s", name, age, date);
        byte[] bytes = str.getBytes();
        return Base64.getEncoder().encodeToString(bytes);
        System.out.println(message);
    }
}
```

```java
import net.bytebuddy.implementation.bind.annotation.Super;

public class HardWorker {
    public static void doWork(@Super(strategy = Super.Instantiation.UNSAFE) HelloWorld zuper) {
        System.out.println("This is doWork Method");
    }
}
```

However, note that this strategy is not necessarily portable to non-Oracle JVMs and
might no longer be available in future JVM releases.

As of today, the internal classes that are used by this unsafe instantiation strategy
are however found in almost any JVM implementation.

