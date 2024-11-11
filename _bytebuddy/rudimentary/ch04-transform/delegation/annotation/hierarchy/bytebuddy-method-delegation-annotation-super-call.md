---
title: "@SuperCall"
sequence: "106"
---

## 介绍

Using the `@SuperCall` annotation, an invocation of the super implementation of a method can be executed
even from outside the dynamic class.

```java
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.PARAMETER)
public @interface SuperCall {
    /**
     * Determines if the generated proxy should be {@link java.io.Serializable}.
     *
     * @return {@code true} if the generated proxy should be {@link java.io.Serializable}.
     */
    boolean serializableProxy() default false;

    /**
     * Determines if the injected proxy should invoke the default method to the intercepted method if a common
     * super method invocation is not applicable. For this to be possible, the default method must not be ambiguous.
     *
     * @return {@code true} if the invocation should fall back to invoking the default method.
     */
    boolean fallbackToDefault() default true;

    /**
     * Assigns {@code null} to the parameter if it is impossible to invoke the super method or a possible dominant default method, if permitted.
     *
     * @return {@code true} if a {@code null} constant should be assigned to this parameter in case that a legal binding is impossible.
     */
    boolean nullIfImpossible() default false;
}
```

## 示例：Callable

### 预期目标

预期目标：

- 第一步，打印 `Do Something Before` 语句
- 第二步，执行 `HelloWorld::test` 方法
- 第三步，打印 `Do Something After` 语句

```java
import java.util.Date;

public class HelloWorld {
    public String test(String name, int age, Date date) {
        return String.format("Name: %s, Age: %s, Date: %s", name, age, date);
    }
}
```

### 运行

```java
import java.util.Date;

public class HelloWorldRun {
    public static void main(String[] args) {
        HelloWorld instance = new HelloWorld();
        String message = instance.test("Tom", 10, new Date());
        System.out.println(message);
    }
}
```

### 代理类

```java
import net.bytebuddy.implementation.bind.annotation.RuntimeType;
import net.bytebuddy.implementation.bind.annotation.SuperCall;

import java.util.concurrent.Callable;

public class HardWorker {
    @RuntimeType
    public static Object doWork(@SuperCall Callable<String> executable) throws Exception {
        String result = executable.call();
        return "HardWorker: " + result;
    }
}
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

### 生成类

```java
public class HelloWorld {
    public HelloWorld() {
    }

    public String test(String var1, int var2, Date var3) {
        return (String)HardWorker.doWork(
                // 创建 Callable 对象
                new HelloWorld$auxiliary$4L8WZWpX(this, var1, var2, var3)
        );
    }

    private String test$original$g6rsGDDb(String name, int age, Date date) {
        return String.format("Name: %s, Age: %s, Date: %s", name, age, date);
    }

    final String test$original$g6rsGDDb$accessor$qtlIOq2J(String var1, int var2, Date var3) {
        return this.test$original$g6rsGDDb(var1, var2, var3);
    }
}
```

```java
class HelloWorld$auxiliary$4L8WZWpX implements Runnable, Callable {
    private HelloWorld argument0;
    private String argument1;
    private int argument2;
    private Date argument3;

    HelloWorld$auxiliary$4L8WZWpX(HelloWorld var1, String var2, int var3, Date var4) {
        this.argument0 = var1;
        this.argument1 = var2;
        this.argument2 = var3;
        this.argument3 = var4;
    }
    
    public Object call() throws Exception {
        return this.argument0.test$original$g6rsGDDb$accessor$qtlIOq2J(this.argument1, this.argument2, this.argument3);
    }

    public void run() {
        this.argument0.test$original$g6rsGDDb$accessor$qtlIOq2J(this.argument1, this.argument2, this.argument3);
    }
}
```

## 示例：Runnable

Finally, note that the `@SuperCall` annotation can also be used on the `Runnable` type
where the original method's return value is however dropped.

### HelloWorld

```java
import java.util.Date;

public class HelloWorld {
    public void test(String name, int age, Date date) {
        String msg = String.format("Name: %s, Age: %s, Date: %s", name, age, date);
        System.out.println(msg);
    }
}
```

### 运行

```java
import java.util.Date;

public class HelloWorldRun {
    public static void main(String[] args) {
        HelloWorld instance = new HelloWorld();
        instance.test("Tom", 10, new Date());
    }
}
```

### 代理类

```java
import net.bytebuddy.implementation.bind.annotation.RuntimeType;
import net.bytebuddy.implementation.bind.annotation.SuperCall;

public class HardWorker {
    @RuntimeType
    public static void doWork(@SuperCall Runnable executable) {
        System.out.println("Method Enter");
        executable.run();
        System.out.println("Method Exit");
    }
}
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

### 生成类

```java
public class HelloWorld {
    public HelloWorld() {
    }

    public void test(String var1, int var2, Date var3) {
        HardWorker.doWork(new HelloWorld$auxiliary$M3j6D49U(this, var1, var2, var3));
    }

    private void test$original$Jaq4DMLp(String name, int age, Date date) {
        String msg = String.format("Name: %s, Age: %s, Date: %s", name, age, date);
        System.out.println(msg);
    }

    final void test$original$Jaq4DMLp$accessor$pEb7Uwz7(String var1, int var2, Date var3) {
        this.test$original$Jaq4DMLp(var1, var2, var3);
    }
}
```

```java
class HelloWorld$auxiliary$M3j6D49U implements Runnable, Callable {
    private HelloWorld argument0;
    private String argument1;
    private int argument2;
    private Date argument3;

    HelloWorld$auxiliary$M3j6D49U(HelloWorld var1, String var2, int var3, Date var4) {
        this.argument0 = var1;
        this.argument1 = var2;
        this.argument2 = var3;
        this.argument3 = var4;
    }
    
    public Object call() throws Exception {
        this.argument0.test$original$Jaq4DMLp$accessor$pEb7Uwz7(this.argument1, this.argument2, this.argument3);
        return null;
    }

    public void run() {
        this.argument0.test$original$Jaq4DMLp$accessor$pEb7Uwz7(this.argument1, this.argument2, this.argument3);
    }
}
```

## 属性


