---
title: "@SuperMethod"
sequence: "102"
---

## @SuperMethod

@SuperMethod: This annotation can only be used on parameter types that are assignable from Method.

The assigned method is set to be a synthetic accessor method that allows for the invocation of the original code.

Note that using this annotation causes a public accessor to be created for the proxy class
that allows for the outside invocation of the super method without passing a security manager.

## 介绍

```java
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.PARAMETER)
public @interface SuperMethod {
    /**
     * Indicates if the instance assigned to this parameter should be stored in a static field for reuse.
     *
     * @return {@code true} if this method instance should be cached.
     */
    boolean cached() default true;

    /**
     * Indicates if the instance assigned to this parameter should be looked up using an {@code java.security.AccessController}.
     *
     * @return {@code true} if this method should be looked up using an {@code java.security.AccessController}.
     */
    boolean privileged() default false;

    /**
     * Indicates that the assigned method should attempt the invocation of an unambiguous default method if no super method is available.
     *
     * @return {@code true} if a default method should be invoked if it is not ambiguous and no super class method is available.
     */
    boolean fallbackToDefault() default true;

    /**
     * Indicates that {@code null} should be assigned to this parameter if no super method is invokable.
     *
     * @return {@code true} if {@code null} should be assigned if no valid method can be assigned.
     */
    boolean nullIfImpossible() default false;
}
```

## 示例

### 预期目标

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
import net.bytebuddy.implementation.bind.annotation.SuperMethod;

import java.lang.reflect.Method;

public class HardWorker {
    @RuntimeType
    public static Object doWork(@SuperMethod Method method) {
        return String.format(
                "@Origin: %s from %s",
                method.getName(),
                method.getDeclaringClass().getName()
        );
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

### 修改后的实现

```java
public class HelloWorld {
    private static final Method cachedValue$20fVqHad$l3hbpe0;

    static {
        cachedValue$20fVqHad$l3hbpe0 = HelloWorld.class.getDeclaredMethod(
                "test$original$ZGzr8Wjp$accessor$20fVqHad",
                String.class,
                Integer.TYPE,
                Date.class
        );
    }
    
    public HelloWorld() {
    }

    public String test(String var1, int var2, Date var3) {
        return (String)HardWorker.doWork(cachedValue$20fVqHad$l3hbpe0);
    }

    private String test$original$ZGzr8Wjp(String name, int age, Date date) {
        return String.format("Name: %s, Age: %s, Date: %s", name, age, date);
    }

    public final String test$original$ZGzr8Wjp$accessor$20fVqHad(String var1, int var2, Date var3) {
        return this.test$original$ZGzr8Wjp(var1, var2, var3);
    }
}
```

## 属性

### cached

```java
import net.bytebuddy.implementation.bind.annotation.RuntimeType;
import net.bytebuddy.implementation.bind.annotation.SuperMethod;

import java.lang.reflect.Method;

public class HardWorker {
    @RuntimeType
    public static Object doWork(@SuperMethod(cached = false) Method method) {
        return String.format(
                "@Origin: %s from %s",
                method.getName(),
                method.getDeclaringClass().getName()
        );
    }
}
```

```java
public class HelloWorld {
    public HelloWorld() {
    }

    public String test(String var1, int var2, Date var3) {
        return (String)HardWorker.doWork(HelloWorld.class.getDeclaredMethod(
                "test$original$ysOXfGtL$accessor$aa2CI3hz",
                String.class,
                Integer.TYPE,
                Date.class));
    }

    private String test$original$ysOXfGtL(String name, int age, Date date) {
        return String.format("Name: %s, Age: %s, Date: %s", name, age, date);
    }

    public final String test$original$ysOXfGtL$accessor$aa2CI3hz(String var1, int var2, Date var3) {
        return this.test$original$ysOXfGtL(var1, var2, var3);
    }
}
```

### privileged

```java
import net.bytebuddy.implementation.bind.annotation.RuntimeType;
import net.bytebuddy.implementation.bind.annotation.SuperMethod;

import java.lang.reflect.Method;

public class HardWorker {
    @RuntimeType
    public static Object doWork(@SuperMethod(privileged = true) Method method) {
        return String.format(
                "@Origin: %s from %s",
                method.getName(),
                method.getDeclaringClass().getName()
        );
    }
}
```

```java
public class HelloWorld {
    private static final Method cachedValue$sbGmWTm4$a366n40;

    static {
        cachedValue$sbGmWTm4$a366n40 = (Method)AccessController.doPrivileged(
                new auxiliary.QiNdFW0V(
                        HelloWorld.class,
                        "test$original$EwxOy3Yd$accessor$sbGmWTm4",
                        new Class[]{String.class, Integer.TYPE, Date.class}
                ));
    }
    
    public HelloWorld() {
    }

    public String test(String var1, int var2, Date var3) {
        return (String)HardWorker.doWork(cachedValue$sbGmWTm4$a366n40);
    }

    private String test$original$EwxOy3Yd(String name, int age, Date date) {
        return String.format("Name: %s, Age: %s, Date: %s", name, age, date);
    }

    public final String test$original$EwxOy3Yd$accessor$sbGmWTm4(String var1, int var2, Date var3) {
        return this.test$original$EwxOy3Yd(var1, var2, var3);
    }
}
```

```java
class HelloWorld$auxiliary$QiNdFW0V implements PrivilegedExceptionAction {
    private Class type;
    private String name;
    private Class[] parameters;

    public HelloWorld$auxiliary$QiNdFW0V(Class var1, String var2, Class[] var3) {
        this.type = var1;
        this.name = var2;
        this.parameters = var3;
    }
    
    public Object run() throws Exception {
        return this.type.getDeclaredMethod(this.name, this.parameters);
    }
}
```

### fallbackToDefault

```java

```

### nullIfImpossible

```java
import net.bytebuddy.implementation.bind.annotation.RuntimeType;
import net.bytebuddy.implementation.bind.annotation.SuperMethod;

import java.lang.reflect.Method;

public class HardWorker {
    @RuntimeType
    public static Object doWork(@SuperMethod(nullIfImpossible = true) Method method) {
        if (method == null) {
            return "method is null";
        }

        return String.format(
                "@Origin: %s from %s",
                method.getName(),
                method.getDeclaringClass().getName()
        );
    }
}
```

```java
import net.bytebuddy.ByteBuddy;
import net.bytebuddy.dynamic.DynamicType;
import net.bytebuddy.implementation.MethodDelegation;
import net.bytebuddy.matcher.ElementMatchers;

public class HelloWorldRedefine {
    public static void main(String[] args) throws Exception {
        // 第一步，准备参数
        String className = "sample.HelloWorld";
        Class<?> clazz = Class.forName(className);


        // 第二步，生成类
        ByteBuddy byteBuddy = new ByteBuddy();
        DynamicType.Builder<?> builder = byteBuddy.redefine(clazz);    // 注意：这里是 redefine

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

```java
import lsieun.buddy.delegation.HardWorker;

public class HelloWorld {
    public HelloWorld() {
    }

    public String test(String var1, int var2, Date var3) {
        return (String)HardWorker.doWork((Method)null);
    }
}
```
