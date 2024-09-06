---
title: "@Super"
sequence: "101"
---

## 介绍

```java
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.PARAMETER)
public @interface Super {
    /**
     * Determines how the {@code super}call proxy type is instantiated.
     *
     * @return The instantiation strategy for this proxy.
     */
    Instantiation strategy() default Instantiation.CONSTRUCTOR;

    /**
     * If {@code true}, the proxy type will not implement {@code super} calls to {@link Object#finalize()} or any overridden methods.
     *
     * @return {@code false} if finalizer methods should be considered for {@code super}-call proxy type delegation.
     */
    boolean ignoreFinalizer() default true;

    /**
     * Determines if the generated proxy should be {@link java.io.Serializable}. If the annotated type
     * already is serializable, such an explicit specification is not required.
     *
     * @return {@code true} if the generated proxy should be {@link java.io.Serializable}.
     */
    boolean serializableProxy() default false;

    /**
     * Defines the parameter types of the constructor to be called for the created {@code super}-call proxy type.
     *
     * @return The parameter types of the constructor to be called.
     */
    Class<?>[] constructorParameters() default {};

    /**
     * Determines the type that is implemented by the proxy. When this value is set to its default value
     * {@code void}, the proxy is created as an instance of the parameter's type. When it is set to
     * {@link TargetType}, it is created as an instance of the generated class. Otherwise, the proxy type
     * is set to the given value.
     *
     * @return The type of the proxy or an indicator type, i.e. {@code void} or {@link TargetType}.
     */
    Class<?> proxyType() default void.class;
}
```

Sometimes, you might however want to call a **super method** with **different arguments** than
those that were assigned on the method's original invocation.

This is also possible in Byte Buddy by using the `@Super` annotation.
This annotation triggers the creation of another `AuxiliaryType`
which now extends a super class or an interface of the dynamic type in question.

Similar to before, the auxiliary type overrides all methods to call their super implementations on the dynamic type.



## 示例

{:refdef: style="text-align: center;"}
![](/assets/images/bytebuddy/delegation/uml-class-diagram-method-delegation-at-super.png)
{:refdef}

```text
@startuml
'https://plantuml.com/class-diagram

interface ITest {
    String test(String name, int age);
}
class GrandParent implements ITest {}
class Parent extends GrandParent {}

interface DefaultTest implements ITest {}

class HelloWorld extends Parent implements DefaultTest {}

@enduml
```

### ITest

```java
public interface ITest {
    String test(String name, int age);
}
```

### GrandParent

```java
public class GrandParent implements ITest {
    public String test(String name, int age) {
        return String.format("GrandParent: %s - %d", name, age);
    }
}
```

### Parent

```java
public class Parent extends GrandParent {
    @Override
    public String test(String name, int age) {
        return String.format("Parent: %s - %d", name, age);
    }
}
```

### DefaultTest

```java
public interface DefaultTest {
    default String test(String name, int age) {
        return String.format("DefaultTest: %s - %d", name, age);
    }
}
```

### HelloWorld

```java
public class HelloWorld extends Parent implements DefaultTest {
    @Override
    public String test(String name, int age) {
        return String.format("HelloWorld: %s - %d", name, age);
    }
}
```


### HelloWorldRun

```java
public class HelloWorldRun {
    public static void main(String[] args) {
        HelloWorld instance = new HelloWorld();
        String msg = instance.test("Tom", 10);
        System.out.println("msg = " + msg);
    }
}
```

```text
msg = HelloWorld: Tom - 10
```


### 修改

```java
import net.bytebuddy.ByteBuddy;
import net.bytebuddy.dynamic.DynamicType;
import net.bytebuddy.implementation.MethodDelegation;
import net.bytebuddy.matcher.ElementMatchers;

public class HelloWorldRebase {
    public static void main(String[] args) throws Exception {
        // 第一步，准备参数
        String className = "sample.HelloWorld";
        Class<?> clazz = Class.forName(className);


        // 第二步，生成类
        ByteBuddy byteBuddy = new ByteBuddy();
        DynamicType.Builder<?> builder = byteBuddy.rebase(clazz);

        builder = builder.method(
                ElementMatchers.named("test")
        ).intercept(
                MethodDelegation.to(HardWorker.class)
        );


        // 第三步，输出结果
        DynamicType.Unloaded<?> unloadedType = builder.make();
        OutputUtils.save(unloadedType, true);
    }
}
```

## HardWorker

### Object

```java
import net.bytebuddy.implementation.bind.annotation.RuntimeType;
import net.bytebuddy.implementation.bind.annotation.Super;

public class HardWorker {
    @RuntimeType
    public static Object doWork(@Super Object zuper) {
        return String.format("@Super Object: %s", zuper.getClass().getName());
    }
}
```

```java
public class HelloWorld extends Parent implements ITest {
    public HelloWorld() {
    }

    // --------------------------- HelloWorld ---------------------------
    public String test(String var1, int var2) {
        HelloWorld$auxiliary$K5aYXFxa var10000 = new HelloWorld$auxiliary$K5aYXFxa();
        var10000.target = this;
        return (String)HardWorker.doWork(var10000);
    }

    private String test$original$R0HSWdwk(String name, int age) {
        return String.format("HelloWorld: %s - %d", name, age);
    }

    // --------------------------- Object ---------------------------
    final boolean equals$accessor$g76wYswk(Object var1) {
        return super.equals(var1);
    }

    final int hashCode$accessor$g76wYswk() {
        return super.hashCode();
    }

    final String toString$accessor$g76wYswk() {
        return super.toString();
    }

    final Object clone$accessor$g76wYswk() throws CloneNotSupportedException {
        return super.clone();
    }
}
```

```java
class HelloWorld$auxiliary$K5aYXFxa {
    public volatile HelloWorld target;

    public HelloWorld$auxiliary$K5aYXFxa() {
    }

    static HelloWorld$auxiliary$K5aYXFxa make() {
        return (HelloWorld$auxiliary$K5aYXFxa)ReflectionFactory.getReflectionFactory().newConstructorForSerialization(
                HelloWorld$auxiliary$K5aYXFxa.class,
                Object.class.getDeclaredConstructor()
        ).newInstance();
    }

    // --------------------------- Object ---------------------------
    public boolean equals(Object var1) {
        return this.target.equals$accessor$g76wYswk(var1);
    }

    public String toString() {
        return this.target.toString$accessor$g76wYswk();
    }

    public int hashCode() {
        return this.target.hashCode$accessor$g76wYswk();
    }

    protected Object clone() throws CloneNotSupportedException {
        return this.target.clone$accessor$g76wYswk();
    }
}
```

### GrandParent

```java
import net.bytebuddy.implementation.bind.annotation.RuntimeType;
import net.bytebuddy.implementation.bind.annotation.Super;

public class HardWorker {
    @RuntimeType
    public static Object doWork(@Super GrandParent obj) {
        return String.format("@Super GrandParent: %s", obj.getClass().getName());
    }
}
```

```java
public class HelloWorld extends Parent implements ITest {
    public HelloWorld() {
    }

    // --------------------------- HelloWorld ---------------------------
    public String test(String var1, int var2) {
        HelloWorld$auxiliary$8ySJhZkM var10000 = new HelloWorld$auxiliary$8ySJhZkM();
        var10000.target = this;
        return (String)HardWorker.doWork(var10000);
    }

    private String test$original$c6wSCTCO(String name, int age) {
        return String.format("name: %s, age: %s", name, age);
    }

    // --------------------------- GrandParent ---------------------------
    final String sayGoodMorning$accessor$zxr4Ohfd() {
        return super.sayGoodMorning();
    }

    // --------------------------- Object ---------------------------
    final boolean equals$accessor$zxr4Ohfd(Object var1) {
        return super.equals(var1);
    }

    final int hashCode$accessor$zxr4Ohfd() {
        return super.hashCode();
    }

    final String toString$accessor$zxr4Ohfd() {
        return super.toString();
    }

    final Object clone$accessor$zxr4Ohfd() throws CloneNotSupportedException {
        return super.clone();
    }
}
```

```java
class HelloWorld$auxiliary$8ySJhZkM extends GrandParent {
    public volatile HelloWorld target;

    static HelloWorld$auxiliary$8ySJhZkM make() {
        return (HelloWorld$auxiliary$8ySJhZkM)ReflectionFactory.getReflectionFactory().newConstructorForSerialization(
                HelloWorld$auxiliary$8ySJhZkM.class,
                Object.class.getDeclaredConstructor()
        ).newInstance();
    }

    // --------------------------- GrandParent ---------------------------
    public String sayGoodMorning() {
        return this.target.sayGoodMorning$accessor$zxr4Ohfd();
    }
    
    // --------------------------- Object ---------------------------
    public boolean equals(Object var1) {
        return this.target.equals$accessor$zxr4Ohfd(var1);
    }

    public String toString() {
        return this.target.toString$accessor$zxr4Ohfd();
    }

    public int hashCode() {
        return this.target.hashCode$accessor$zxr4Ohfd();
    }

    protected Object clone() throws CloneNotSupportedException {
        return this.target.clone$accessor$zxr4Ohfd();
    }
}
```

### Parent

```java
import net.bytebuddy.implementation.bind.annotation.RuntimeType;
import net.bytebuddy.implementation.bind.annotation.Super;

public class HardWorker {
    @RuntimeType
    public static Object doWork(@Super Parent obj) {
        return String.format("@Super Parent: %s", obj.getClass().getName());
    }
}
```

```java
public class HelloWorld extends Parent implements ITest {

    // --------------------------- HelloWorld ---------------------------
    public String test(String var1, int var2) {
        HelloWorld$auxiliary$n7NISikR var10000 = new HelloWorld$auxiliary$n7NISikR();
        var10000.target = this;
        return (String)HardWorker.doWork(var10000);
    }

    private String test$original$UHj1Cn6j(String name, int age) {
        return String.format("name: %s, age: %s", name, age);
    }

    // --------------------------- Parent ---------------------------
    final String sayGoodAfternoon$accessor$F7bUTHBV() {
        return super.sayGoodAfternoon();
    }

    // --------------------------- GrandParent ---------------------------
    final String sayGoodMorning$accessor$F7bUTHBV() {
        return super.sayGoodMorning();
    }

    // --------------------------- Object ---------------------------
    final boolean equals$accessor$F7bUTHBV(Object var1) {
        return super.equals(var1);
    }

    final int hashCode$accessor$F7bUTHBV() {
        return super.hashCode();
    }

    final String toString$accessor$F7bUTHBV() {
        return super.toString();
    }

    final Object clone$accessor$F7bUTHBV() throws CloneNotSupportedException {
        return super.clone();
    }
}
```

```java
class HelloWorld$auxiliary$n7NISikR extends Parent {
    public volatile HelloWorld target;

    static HelloWorld$auxiliary$n7NISikR make() {
        return (HelloWorld$auxiliary$n7NISikR)ReflectionFactory.getReflectionFactory().newConstructorForSerialization(
                HelloWorld$auxiliary$n7NISikR.class,
                Object.class.getDeclaredConstructor()
        ).newInstance();
    }

    // --------------------------- Parent ---------------------------
    public String sayGoodAfternoon() {
        return this.target.sayGoodAfternoon$accessor$F7bUTHBV();
    }

    // --------------------------- GrandParent ---------------------------
    public String sayGoodMorning() {
        return this.target.sayGoodMorning$accessor$F7bUTHBV();
    }

    
    // --------------------------- Object ---------------------------
    public boolean equals(Object var1) {
        return this.target.equals$accessor$F7bUTHBV(var1);
    }

    public String toString() {
        return this.target.toString$accessor$F7bUTHBV();
    }

    public int hashCode() {
        return this.target.hashCode$accessor$F7bUTHBV();
    }

    protected Object clone() throws CloneNotSupportedException {
        return this.target.clone$accessor$F7bUTHBV();
    }
}
```

### ITest

```java
import net.bytebuddy.implementation.bind.annotation.RuntimeType;
import net.bytebuddy.implementation.bind.annotation.Super;

public class HardWorker {
    @RuntimeType
    public static Object doWork(@Super ITest obj) {
        return String.format("@Super ITest: %s", obj.getClass().getName());
    }
}
```

```java
public class HelloWorld extends Parent implements ITest {
    // --------------------------- HelloWorld ---------------------------
    public String test(String var1, int var2) {
        HelloWorld$auxiliary$1fUneYsP var10000 = new HelloWorld$auxiliary$1fUneYsP();
        var10000.target = this;
        return (String)HardWorker.doWork(var10000);
    }

    private String test$original$ThV3YMzU(String name, int age) {
        return String.format("name: %s, age: %s", name, age);
    }

    final String test$original$ThV3YMzU$accessor$ABTPpNe8(String var1, int var2) {
        return this.test$original$ThV3YMzU(var1, var2);
    }

    // --------------------------- Object ---------------------------
    final boolean equals$accessor$ABTPpNe8(Object var1) {
        return super.equals(var1);
    }

    final int hashCode$accessor$ABTPpNe8() {
        return super.hashCode();
    }

    final String toString$accessor$ABTPpNe8() {
        return super.toString();
    }

    final Object clone$accessor$ABTPpNe8() throws CloneNotSupportedException {
        return super.clone();
    }
}
```

```java
class HelloWorld$auxiliary$1fUneYsP implements ITest {
    public volatile HelloWorld target;

    static HelloWorld$auxiliary$1fUneYsP make() {
        return (HelloWorld$auxiliary$1fUneYsP)ReflectionFactory.getReflectionFactory().newConstructorForSerialization(
                HelloWorld$auxiliary$1fUneYsP.class,
                Object.class.getDeclaredConstructor()
        ).newInstance();
    }

    // --------------------------- HelloWorld ---------------------------
    public String test(String var1, int var2) {
        return this.target.test$original$ThV3YMzU$accessor$ABTPpNe8(var1, var2);
    }
    
    // --------------------------- Object ---------------------------
    public boolean equals(Object var1) {
        return this.target.equals$accessor$ABTPpNe8(var1);
    }

    public String toString() {
        return this.target.toString$accessor$ABTPpNe8();
    }

    public int hashCode() {
        return this.target.hashCode$accessor$ABTPpNe8();
    }

    protected Object clone() throws CloneNotSupportedException {
        return this.target.clone$accessor$ABTPpNe8();
    }
}
```

### HelloWorld

```java
import net.bytebuddy.implementation.bind.annotation.RuntimeType;
import net.bytebuddy.implementation.bind.annotation.Super;

public class HardWorker {
    @RuntimeType
    public static Object doWork(@Super HelloWorld obj) {
        return String.format("@Super HelloWorld: %s", obj.getClass().getName());
    }
}
```


```java
public class HelloWorld extends Parent implements ITest {

    // --------------------------- HelloWorld ---------------------------
    public String test(String var1, int var2) {
        HelloWorld$auxiliary$goM76H6f var10000 = new HelloWorld$auxiliary$goM76H6f();
        var10000.target = this;
        return (String)HardWorker.doWork(var10000);
    }

    private String test$original$MfmDZ3BR(String name, int age) {
        return String.format("name: %s, age: %s", name, age);
    }

    final String test$original$MfmDZ3BR$accessor$lt2zkoKW(String var1, int var2) {
        return this.test$original$MfmDZ3BR(var1, var2);
    }

    // --------------------------- Parent ---------------------------
    final String sayGoodAfternoon$accessor$lt2zkoKW() {
        return super.sayGoodAfternoon();
    }
    
    // --------------------------- GrandParent ---------------------------
    final String sayGoodMorning$accessor$lt2zkoKW() {
        return super.sayGoodMorning();
    }

    // --------------------------- Object ---------------------------
    final boolean equals$accessor$lt2zkoKW(Object var1) {
        return super.equals(var1);
    }

    final int hashCode$accessor$lt2zkoKW() {
        return super.hashCode();
    }

    final String toString$accessor$lt2zkoKW() {
        return super.toString();
    }

    final Object clone$accessor$lt2zkoKW() throws CloneNotSupportedException {
        return super.clone();
    }
}
```

```java
class HelloWorld$auxiliary$goM76H6f extends HelloWorld {
    public volatile HelloWorld target;

    static HelloWorld$auxiliary$goM76H6f make() {
        return (HelloWorld$auxiliary$goM76H6f)ReflectionFactory.getReflectionFactory().newConstructorForSerialization(
                HelloWorld$auxiliary$goM76H6f.class,
                Object.class.getDeclaredConstructor()
        ).newInstance();
    }

    // --------------------------- HelloWorld ---------------------------
    public String test(String var1, int var2) {
        return this.target.test$original$MfmDZ3BR$accessor$lt2zkoKW(var1, var2);
    }

    // --------------------------- Parent ---------------------------
    public String sayGoodAfternoon() {
        return this.target.sayGoodAfternoon$accessor$lt2zkoKW();
    }

    // --------------------------- GrandParent ---------------------------
    public String sayGoodMorning() {
        return this.target.sayGoodMorning$accessor$lt2zkoKW();
    }

    // --------------------------- Object ---------------------------
    public boolean equals(Object var1) {
        return this.target.equals$accessor$lt2zkoKW(var1);
    }

    public String toString() {
        return this.target.toString$accessor$lt2zkoKW();
    }

    public int hashCode() {
        return this.target.hashCode$accessor$lt2zkoKW();
    }

    protected Object clone() throws CloneNotSupportedException {
        return this.target.clone$accessor$lt2zkoKW();
    }





}
```


### 错误的父类型

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

## 注意事项

### 字段

Note that the instance that is assigned to the parameter annotated with `@Super` is of a different identity
to the actual instance of the dynamic type!
Therefore, **no instance field** that is accessible by means of the `@Super` parameter reflects the **actual instance's field**.

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
class HelloWorld$auxiliary$L26hPHEt extends HelloWorld {
    public void sayHello() {
        this.target.sayHello$accessor$vn0eXPKB();
    }

    public void sayWorld() {
        this.target.sayWorld$accessor$vn0eXPKB();
    }

    public void test(String var1, int var2, Date var3) {
        this.target.test$original$HL2qAVs0$accessor$vn0eXPKB(var1, var2, var3);
    }
}
```

### 父类型不对

Finally, in case that a parameter that is annotated with `@Super` does not represent a super type of the relevant dynamic type,
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
might not longer be available in future JVM releases.

As of today, the internal classes that are used by this unsafe instantiation strategy
are however found in almost any JVM implementation.

## @Super

```java
public class Parent {
    public void hello() {
        System.out.println("Hello");
    }
}
```

```java
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.Date;

public class HelloWorld extends Parent {
    public void test(String name, int age, Date date) {
        String str = name + age + date;
        byte[] bytes = str.getBytes(StandardCharsets.UTF_8);
        byte[] encodedBytes = Base64.getEncoder().encode(bytes);
        String base64Str = new String(encodedBytes, StandardCharsets.UTF_8);
        System.out.println(base64Str);
    }
}
```

```java
import net.bytebuddy.implementation.bind.annotation.RuntimeType;
import net.bytebuddy.implementation.bind.annotation.Super;
import net.bytebuddy.implementation.bind.annotation.SuperCall;

import java.util.concurrent.Callable;

public class HardWorker {
    @RuntimeType
    public static Object doWork(@SuperCall Callable<?> targetCode, @Super Parent zuper) throws Exception {
        // 1. 记录开始时间
        long startTime = System.currentTimeMillis();
        System.out.println(">>> >>> >>> >>> >>> >>> >>> >>> >>> Method Enter");
        System.out.println("@Super: " + zuper);

        // 2. 执行原来的方法
        Object result = targetCode.call();
        System.out.println("Result: " + result);

        // 3. 记录结束时间
        System.out.println("<<< <<< <<< <<< <<< <<< <<< <<< <<< Method Exit");
        long endTime = System.currentTimeMillis();

        // 4. 输出运行时间
        long diff = endTime - startTime;
        String message = String.format("Execution Time: %s", diff);
        System.out.println(message);

        // 5. 返回结果
        return result;
    }
}
```

注意：`@Super Parent` 和 `@Super Object` 会影响 AuxiliaryType 生成的实现方法细节。

```java
import net.bytebuddy.ByteBuddy;
import net.bytebuddy.dynamic.DynamicType;
import net.bytebuddy.implementation.MethodDelegation;
import net.bytebuddy.matcher.ElementMatchers;

public class HelloWorldTransform {
    public static void main(String[] args) throws Exception {
        // 第一步，准备参数
        String className = "sample.HelloWorld";
        Class<?> clazz = Class.forName(className);


        // 第二步，生成类
        ByteBuddy byteBuddy = new ByteBuddy();
        DynamicType.Builder<?> builder = byteBuddy.rebase(clazz);

        builder = builder.method(
                ElementMatchers.named("test")
        ).intercept(
                MethodDelegation.to(HardWorker.class)
        );


        // 第三步，输出结果
        DynamicType.Unloaded<?> unloadedType = builder.make();
        OutputUtils.save(unloadedType);
    }
}
```

## 属性

### strategy

```java
import net.bytebuddy.implementation.bind.annotation.RuntimeType;
import net.bytebuddy.implementation.bind.annotation.Super;

public class HardWorker {
    @RuntimeType
    public static Object doWork(@Super(strategy = Super.Instantiation.UNSAFE) Object obj) {
        return String.format("@Super Object: %s", obj.getClass().getName());
    }
}
```

```java
public class HelloWorld extends Parent implements ITest {

    // --------------------------- HelloWorld ---------------------------
    public String test(String var1, int var2) {
        HelloWorld$auxiliary$tquh75uk var10000 = HelloWorld$auxiliary$tquh75uk.make();
        var10000.target = this;
        return (String)HardWorker.doWork(var10000);
    }

    private String test$original$ogh0MX72(String name, int age) {
        return String.format("name: %s, age: %s", name, age);
    }

    // --------------------------- Object ---------------------------
    final boolean equals$accessor$1T4dP5Lv(Object var1) {
        return super.equals(var1);
    }

    final int hashCode$accessor$1T4dP5Lv() {
        return super.hashCode();
    }

    final String toString$accessor$1T4dP5Lv() {
        return super.toString();
    }

    final Object clone$accessor$1T4dP5Lv() throws CloneNotSupportedException {
        return super.clone();
    }
}
```

```java
class HelloWorld$auxiliary$tquh75uk {
    public volatile HelloWorld target;

    static HelloWorld$auxiliary$tquh75uk make() {
        return (HelloWorld$auxiliary$tquh75uk)ReflectionFactory.getReflectionFactory().newConstructorForSerialization(
                HelloWorld$auxiliary$tquh75uk.class,
                Object.class.getDeclaredConstructor()
        ).newInstance();
    }

    // --------------------------- Object ---------------------------
    public boolean equals(Object var1) {
        return this.target.equals$accessor$1T4dP5Lv(var1);
    }

    public String toString() {
        return this.target.toString$accessor$1T4dP5Lv();
    }

    public int hashCode() {
        return this.target.hashCode$accessor$1T4dP5Lv();
    }

    protected Object clone() throws CloneNotSupportedException {
        return this.target.clone$accessor$1T4dP5Lv();
    }
}
```

### ignoreFinalizer

```java
import net.bytebuddy.implementation.bind.annotation.RuntimeType;
import net.bytebuddy.implementation.bind.annotation.Super;

public class HardWorker {
    @RuntimeType
    public static Object doWork(@Super(ignoreFinalizer = false) Object obj) {
        return String.format("@Super Object: %s", obj.getClass().getName());
    }
}
```

```java
public class HelloWorld extends Parent implements ITest {

    // --------------------------- HelloWorld ---------------------------
    public String test(String var1, int var2) {
        auxiliary.K1flET4j var10000 = new auxiliary.K1flET4j();
        var10000.target = this;
        return (String)HardWorker.doWork(var10000);
    }

    private String test$original$5iLtOfjx(String name, int age) {
        return String.format("name: %s, age: %s", name, age);
    }

    // --------------------------- Object ---------------------------
    // 注意：这里多个 finalize 方法
    final void finalize$accessor$VfDAimHk() throws Throwable {
        super.finalize();
    }

    final boolean equals$accessor$VfDAimHk(Object var1) {
        return super.equals(var1);
    }

    final int hashCode$accessor$VfDAimHk() {
        return super.hashCode();
    }

    final String toString$accessor$VfDAimHk() {
        return super.toString();
    }

    final Object clone$accessor$VfDAimHk() throws CloneNotSupportedException {
        return super.clone();
    }
}
```

```java
class HelloWorld$auxiliary$K1flET4j {
    public volatile HelloWorld target;

    static HelloWorld$auxiliary$K1flET4j make() {
        return (HelloWorld$auxiliary$K1flET4j)ReflectionFactory.getReflectionFactory().newConstructorForSerialization(
                HelloWorld$auxiliary$K1flET4j.class,
                Object.class.getDeclaredConstructor()
        ).newInstance();
    }

    // --------------------------- Object ---------------------------
    protected void finalize() throws Throwable {
        this.target.finalize$accessor$VfDAimHk();
    }

    public boolean equals(Object var1) {
        return this.target.equals$accessor$VfDAimHk(var1);
    }

    public String toString() {
        return this.target.toString$accessor$VfDAimHk();
    }

    public int hashCode() {
        return this.target.hashCode$accessor$VfDAimHk();
    }

    protected Object clone() throws CloneNotSupportedException {
        return this.target.clone$accessor$VfDAimHk();
    }
}
```

### serializableProxy

```java
import net.bytebuddy.implementation.bind.annotation.RuntimeType;
import net.bytebuddy.implementation.bind.annotation.Super;

public class HardWorker {
    @RuntimeType
    public static Object doWork(@Super(serializableProxy = true) Object obj) {
        return String.format("@Super Object: %s", obj.getClass().getName());
    }
}
```


```java
class HelloWorld$auxiliary$afVVjOb9 implements Serializable {
    public volatile HelloWorld target;

    static HelloWorld$auxiliary$afVVjOb9 make() {
        return (HelloWorld$auxiliary$afVVjOb9)ReflectionFactory.getReflectionFactory().newConstructorForSerialization(
                HelloWorld$auxiliary$afVVjOb9.class,
                Object.class.getDeclaredConstructor()
        ).newInstance();
    }

    // --------------------------- Object ---------------------------
    public boolean equals(Object var1) {
        return this.target.equals$accessor$3rsBUPut(var1);
    }

    public String toString() {
        return this.target.toString$accessor$3rsBUPut();
    }

    public int hashCode() {
        return this.target.hashCode$accessor$3rsBUPut();
    }

    protected Object clone() throws CloneNotSupportedException {
        return this.target.clone$accessor$3rsBUPut();
    }
}
```

### proxyType

```java
import net.bytebuddy.implementation.bind.annotation.RuntimeType;
import net.bytebuddy.implementation.bind.annotation.Super;


public class HardWorker {
    @RuntimeType
    public static Object doWork(@Super(proxyType = Parent.class) GrandParent obj) {
        return String.format("@Super GrandParent: %s", obj.getClass().getName());
    }
}
```

```java
public class HelloWorld extends Parent implements ITest {
    public HelloWorld() {
    }

    // --------------------------- HelloWorld ---------------------------
    public String test(String var1, int var2) {
        auxiliary.RMzFBXI1 var10000 = new auxiliary.RMzFBXI1();
        var10000.target = this;
        return (String)HardWorker.doWork(var10000);
    }

    private String test$original$VcSTUrKv(String name, int age) {
        return String.format("name: %s, age: %s", name, age);
    }

    // --------------------------- Parent ---------------------------
    final String sayGoodAfternoon$accessor$5o7DYJ2V() {
        return super.sayGoodAfternoon();
    }

    // --------------------------- GrandParent ---------------------------
    final String sayGoodMorning$accessor$5o7DYJ2V() {
        return super.sayGoodMorning();
    }

    // --------------------------- Object ---------------------------
    final boolean equals$accessor$5o7DYJ2V(Object var1) {
        return super.equals(var1);
    }

    final int hashCode$accessor$5o7DYJ2V() {
        return super.hashCode();
    }

    final String toString$accessor$5o7DYJ2V() {
        return super.toString();
    }


    final Object clone$accessor$5o7DYJ2V() throws CloneNotSupportedException {
        return super.clone();
    }
}
```

```java
class HelloWorld$auxiliary$RMzFBXI1 extends Parent {
    public volatile HelloWorld target;

    static HelloWorld$auxiliary$RMzFBXI1 make() {
        return (HelloWorld$auxiliary$RMzFBXI1)ReflectionFactory.getReflectionFactory().newConstructorForSerialization(
                HelloWorld$auxiliary$RMzFBXI1.class,
                Object.class.getDeclaredConstructor()
        ).newInstance();
    }

    // --------------------------- Parent ---------------------------
    public String sayGoodAfternoon() {
        return this.target.sayGoodAfternoon$accessor$5o7DYJ2V();
    }

    // --------------------------- GrandParent ---------------------------
    public String sayGoodMorning() {
        return this.target.sayGoodMorning$accessor$5o7DYJ2V();
    }

    // --------------------------- Object ---------------------------
    public boolean equals(Object var1) {
        return this.target.equals$accessor$5o7DYJ2V(var1);
    }

    public String toString() {
        return this.target.toString$accessor$5o7DYJ2V();
    }

    public int hashCode() {
        return this.target.hashCode$accessor$5o7DYJ2V();
    }

    protected Object clone() throws CloneNotSupportedException {
        return this.target.clone$accessor$5o7DYJ2V();
    }
}
```

### constructorParameters

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
    public static Object doWork(@Super(constructorParameters = {String.class, int.class}) Parent obj) {
        return String.format("@Super Parent: %s", obj.getClass().getName());
    }
}
```

```java
public class HelloWorld extends Parent implements ITest {

    // --------------------------- HelloWorld ---------------------------
    public String test(String var1, int var2) {
        // 注意：这里传递了 String 和 int 类型的参数
        HelloWorld$auxiliary$Z5tCOeuu var10000 = new HelloWorld$auxiliary$Z5tCOeuu((String)null, 0);
        var10000.target = this;
        return (String)HardWorker.doWork(var10000);
    }

    private String test$original$ycWtKH8A(String name, int age) {
        return String.format("name: %s, age: %s", name, age);
    }

    // --------------------------- Parent ---------------------------
    final String sayGoodAfternoon$accessor$LxI8wyty() {
        return super.sayGoodAfternoon();
    }

    // --------------------------- GrandParent ---------------------------
    final String sayGoodMorning$accessor$LxI8wyty() {
        return super.sayGoodMorning();
    }

    // --------------------------- Object ---------------------------
    final boolean equals$accessor$LxI8wyty(Object var1) {
        return super.equals(var1);
    }

    final int hashCode$accessor$LxI8wyty() {
        return super.hashCode();
    }

    final String toString$accessor$LxI8wyty() {
        return super.toString();
    }

    final Object clone$accessor$LxI8wyty() throws CloneNotSupportedException {
        return super.clone();
    }
}
```

```java
class HelloWorld$auxiliary$Z5tCOeuu extends Parent {
    public volatile HelloWorld target;

    public HelloWorld$auxiliary$Z5tCOeuu() {
    }

    // 注意：这个构造方法接收 String 和 int 类型的参数
    public HelloWorld$auxiliary$Z5tCOeuu(String var1, int var2) {
        super(var1, var2);
    }

    static HelloWorld$auxiliary$Z5tCOeuu make() {
        return (HelloWorld$auxiliary$Z5tCOeuu)ReflectionFactory.getReflectionFactory().newConstructorForSerialization(
                HelloWorld$auxiliary$Z5tCOeuu.class,
                Object.class.getDeclaredConstructor()
        ).newInstance();
    }

    // --------------------------- Parent ---------------------------
    public String sayGoodAfternoon() {
        return this.target.sayGoodAfternoon$accessor$LxI8wyty();
    }

    // --------------------------- GrandParent ---------------------------
    public String sayGoodMorning() {
        return this.target.sayGoodMorning$accessor$LxI8wyty();
    }
    
    // --------------------------- Object ---------------------------
    public boolean equals(Object var1) {
        return this.target.equals$accessor$LxI8wyty(var1);
    }

    public String toString() {
        return this.target.toString$accessor$LxI8wyty();
    }

    public int hashCode() {
        return this.target.hashCode$accessor$LxI8wyty();
    }

    protected Object clone() throws CloneNotSupportedException {
        return this.target.clone$accessor$LxI8wyty();
    }
}
```


