---
title: "@Super"
sequence: "117"
---

Sometimes, you might however want to call a **super method** with **different arguments** than
those that were assigned on the method's original invocation.

This is also possible in Byte Buddy by using the `@Super` annotation.
This annotation triggers the creation of another `AuxiliaryType`
which now extends a super class or an interface of the dynamic type in question.

Similar to before, the auxiliary type overrides all methods to call their super implementations on the dynamic type.



## 示例


### GrandParent

```java
public class HelloWorldGrandParent {
    public void sayHello() {
        System.out.println("Hello From HelloWorldGrandParent");
    }
}
```

### Parent

```java
public class HelloWorldParent extends HelloWorldGrandParent {

    @Override
    public void sayHello() {
        System.out.println("Hello From HelloWorldParent");
    }

    public void sayGoodbye() {
        System.out.println("Goodbye From HelloWorldParent");
    }
}
```

### ITest

```java
import java.util.Date;

public interface ITest {
    String test(String name, int age, Date date);
}
```

### HelloWorld

```java
import java.util.Date;

public class HelloWorld extends HelloWorldParent implements ITest {
    @Override
    public void sayHello() {
        System.out.println("Hello From HelloWorld");
    }

    @Override
    public void sayGoodbye() {
        System.out.println("Goodbye From HelloWorld");
    }

    @Override
    public String test(String name, int age, Date date) {
        return String.format("%s:%s:%s", name, age, date);
    }
}
```

### HelloWorldChild

```java
public class HelloWorldChild extends HelloWorld {
}
```

### HelloWorldRun

```java
import java.util.Date;

public class HelloWorldRun {
    public static void main(String[] args) {
        HelloWorld instance = new HelloWorldChild();
        instance.sayHello();
        instance.sayGoodbye();
        String message = instance.test("Tom", 10, new Date());
        System.out.println(message);
    }
}
```

```text
Hello From HelloWorld
Goodbye From HelloWorld
Tom:10:Tue Jul 11 17:07:41 CST 2023
```

## 编码实现

### Subclass

```java
import net.bytebuddy.ByteBuddy;
import net.bytebuddy.dynamic.DynamicType;
import net.bytebuddy.implementation.MethodDelegation;
import net.bytebuddy.matcher.ElementMatchers;

public class HelloWorldSubClass {
    public static void main(String[] args) throws Exception {
        // 第一步，准备参数
        String className = "sample.HelloWorld";
        Class<?> clazz = Class.forName(className);


        // 第二步，生成类
        ByteBuddy byteBuddy = new ByteBuddy();
        DynamicType.Builder<?> builder = byteBuddy.subclass(clazz).name("sample.HelloWorldChild");

        builder = builder.method(
                ElementMatchers.named("test")
        ).intercept(
                MethodDelegation.to(LazyWorker.class)
        );


        // 第三步，输出结果
        DynamicType.Unloaded<?> unloadedType = builder.make();
        OutputUtils.save(unloadedType, true);
    }
}
```

## HardWorker

### HelloWorld

```java
import net.bytebuddy.implementation.bind.annotation.Super;

public class LazyWorker {
    public static String test(@Super HelloWorld zuper) {
        System.out.println("@Super HelloWorld: " + zuper);
        zuper.sayHello();
        zuper.sayGoodbye();
        return "message from LazyWorker";
    }
}
```

```text
Hello From HelloWorld
Goodbye From HelloWorld
@Super HelloWorld: sample.HelloWorldChild@6f496d9f
Hello From HelloWorld
Goodbye From HelloWorld
message from LazyWorker
```

```java
public class HelloWorldChild extends HelloWorld {
    public String test(String name, int age, Date date) {
        HelloWorldChild$auxiliary$Super auxiliary$Super = new HelloWorldChild$auxiliary$Super();
        auxiliary$Super.target = this;
        return LazyWorker.test(auxiliary$Super);
    }

    final String test$accessor$QueRw6me(String name, int age, Date date) {
        return super.test(name, age, date);
    }

    final void sayHello$accessor$QueRw6me() {
        super.sayHello();
    }

    final void sayGoodbye$accessor$QueRw6me() {
        super.sayGoodbye();
    }
}
```

```java
class HelloWorldChild$auxiliary$Super extends HelloWorld {
    public volatile HelloWorldChild target;

    public String test(String name, int age, Date date) {
        return this.target.test$accessor$QueRw6me(name, age, date);
    }

    public void sayGoodbye() {
        this.target.sayGoodbye$accessor$QueRw6me();
    }

    public void sayHello() {
        this.target.sayHello$accessor$QueRw6me();
    }
}
```

### Parent

使用 `Parent` 类型：

```java
import net.bytebuddy.implementation.bind.annotation.Super;

public class LazyWorker {
    public static String test(@Super HelloWorldParent zuper) {
        System.out.println("@Super HelloWorld: " + zuper);
        zuper.sayHello();
        zuper.sayGoodbye();
        return "message from LazyWorker";
    }
}
```

```java
public class HelloWorldChild extends HelloWorld {
    public String test(String var1, int var2, Date var3) {
        HelloWorldChild$auxiliary$7Jf0VhXD var10000 = new HelloWorldChild$auxiliary$7Jf0VhXD();
        var10000.target = this;
        return LazyWorker.test(var10000);
    }

    final void sayHello$accessor$m9TNqVul() {
        super.sayHello();
    }

    final void sayGoodbye$accessor$m9TNqVul() {
        super.sayGoodbye();
    }
}
```

```java
class HelloWorldChild$auxiliary$7Jf0VhXD extends HelloWorldParent {
    public volatile HelloWorldChild target;

    public void sayHello() {
        this.target.sayHello$accessor$m9TNqVul();
    }

    public void sayGoodbye() {
        this.target.sayGoodbye$accessor$m9TNqVul();
    }
}
```

### GrandParent

使用 `GrandParent` 类型：

```java
import net.bytebuddy.implementation.bind.annotation.Super;

public class LazyWorker {
    public static String test(@Super HelloWorldGrandParent zuper) {
        System.out.println("@Super HelloWorld: " + zuper);
        zuper.sayHello();
        return "message from LazyWorker";
    }
}
```

```java
public class HelloWorldChild extends HelloWorld {
    public String test(String var1, int var2, Date var3) {
        HelloWorldChild$auxiliary$Super auxiliary$Super = new HelloWorldChild$auxiliary$Super();
        auxiliary$Super.target = this;
        return LazyWorker.test(auxiliary$Super);
    }

    final void sayHello$accessor$QISPSxjf() {
        super.sayHello();
    }
}
```

```java
class HelloWorldChild$auxiliary$Super extends HelloWorldGrandParent {
    public volatile HelloWorldChild target;

    public void sayHello() {
        this.target.sayHello$accessor$QISPSxjf();
    }
}
```

### ITest

使用 `ITest` 接口：

```java
import net.bytebuddy.implementation.bind.annotation.Super;
import sample.ITest;

public class LazyWorker {
    public static String test(@Super ITest zuper) {
        System.out.println("@Super ITest: " + zuper);
        return "message from LazyWorker";
    }
}
```

```java
public class HelloWorldChild extends HelloWorld {
    public String test(String var1, int var2, Date var3) {
        HelloWorldChild$auxiliary$Super auxiliary$Super = new HelloWorldChild$auxiliary$Super();
        auxiliary$Super.target = this;
        return LazyWorker.test(auxiliary$Super);
    }

    final String test$accessor$184nXP0b(String var1, int var2, Date var3) {
        return super.test(var1, var2, var3);
    }
}
```

```java
class HelloWorldChild$auxiliary$Super implements ITest {
    public volatile HelloWorldChild target;

    public String test(String var1, int var2, Date var3) {
        return this.target.test$accessor$184nXP0b(var1, var2, var3);
    }
}
```

### 错误的父类型

```java
import net.bytebuddy.implementation.bind.annotation.Super;

public class HardWorker {
    public static void doWork(@Super Number zuper) {
        System.out.println("This is doWork Method");
    }
}
```

得到错误信息：

```text
java.lang.IllegalArgumentException: 
None of [public static void lsieun.buddy.delegation.HardWorker.doWork(java.lang.Number)] allows for delegation from 
public void sample.HelloWorld.test(java.lang.String,int,java.util.Date)
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
import sample.HelloWorld;

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
import sample.Parent;

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
import sample.HelloWorld;

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
import sample.Parent;

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
