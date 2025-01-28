---
title: "LambdaMetafactory 示例"
sequence: "101"
---

## Runnable

```java
import java.lang.invoke.*;

public class MyRunnable {
    public static void main(String[] args) throws Throwable {
        // 第一步，FunctionalInterface 的信息
        MethodType factoryType = MethodType.methodType(Runnable.class);
        String interfaceMethodName = "run";
        MethodType interfaceMethodType = MethodType.methodType(void.class);

        // 第二步，寻找一个具体的实现方法
        MethodHandles.Lookup caller = MethodHandles.lookup();
        System.out.println("caller: " + caller);
        MethodType targetMethodType = MethodType.methodType(void.class);
        MethodHandle implementation = caller.findStatic(MyRunnable.class, "print", targetMethodType);
        System.out.println("target method handle: " + implementation);

        // 第三步，生成 CallSite 对象（形象的来说，我们组装了一件武器）
        MethodType dynamicMethodType = MethodType.methodType(void.class);
        CallSite callSite = LambdaMetafactory.metafactory(
                caller,
                interfaceMethodName,
                factoryType,
                interfaceMethodType,
                implementation,
                dynamicMethodType);

        // 第四步，以 FunctionalInterface 的视角，来调用具体的实现方法
        MethodHandle factory = callSite.getTarget();
        System.out.println("factory method handle: " + factory);
        Runnable r = (Runnable) factory.invoke();
        r.run();
    }

    private static void print() {
        System.out.println("hello world");
    }
}
```

## Supplier

```java
import java.lang.invoke.*;
import java.util.function.Supplier;

public class MySupplier {
    public static void main(String[] args) throws Throwable {
        // 第一步，FunctionalInterface 的信息
        MethodType invoked_class_type = MethodType.methodType(Supplier.class);
        String invoked_method_name = "get";
        MethodType invoked_method_type = MethodType.methodType(Object.class);

        // 第二步，寻找一个具体的实现方法
        MethodHandles.Lookup caller = MethodHandles.lookup();
        System.out.println("caller: " + caller);
        MethodType target_method_type = MethodType.methodType(String.class);
        MethodHandle target_method_handle = caller.findStatic(MySupplier.class, "info", target_method_type);
        System.out.println("target method handle: " + target_method_handle);

        // 第三步，生成 CallSite 对象（形象的来说，我们组装了一件武器）
        MethodType instantiated_method_type = MethodType.methodType(String.class);
        CallSite site = LambdaMetafactory.metafactory(
                caller,
                invoked_method_name,
                invoked_class_type,
                invoked_method_type,
                target_method_handle,
                instantiated_method_type);

        // 第四步，以 FunctionalInterface 的视角，来调用具体的实现方法
        MethodHandle factory = site.getTarget();
        System.out.println("factory method handle: " + factory);
        Supplier<?> s = (Supplier<?>) factory.invoke();
        Object result = s.get();
        System.out.println(result);
    }

    public static String info() {
        return "Hello Java";
    }
}
```

## Consumer

- [Stackoverflow](https://stackoverflow.com/a/46874622)

```java
import java.lang.invoke.*;
import java.util.function.Consumer;

public class MyConsumer {
    public static void main(String[] args) throws Throwable {
        Consumer<String> consumer = s -> System.out.println("CONSUMED: " + s + ".");
        consumer.accept("foo");

        // 第一步，FunctionalInterface 的信息
        // we must return consumer, no closure -> no additional parameters
        MethodType call_site_type = MethodType.methodType(Consumer.class);
        String functional_interface_method_name = "accept";
        // Because of the type erasure we must use Object here
        // instead of String (Consumer<String> -> Consumer).
        MethodType functional_interface_method_type = MethodType.methodType(void.class, Object.class);

        // 第二步，寻找一个具体的实现方法
        MethodHandles.Lookup caller = MethodHandles.lookup();
        System.out.println("caller: " + caller);
        MethodType lambda_body_method_type = MethodType.methodType(void.class, String.class);
        MethodHandle lambda_body_method_handle = caller.findStatic(MyConsumer.class, "lambda$main$0", lambda_body_method_type);
        System.out.println("lambda body method handle: " + lambda_body_method_handle);

        // 第三步，生成 CallSite 对象（形象的来说，我们组装了一件武器）
        MethodType actual_method_type = MethodType.methodType(void.class, String.class);
        CallSite site = LambdaMetafactory.metafactory(
                // provided by invokedynamic:
                caller, functional_interface_method_name, call_site_type,
                // additional bootstrap method arguments:
                functional_interface_method_type,
                lambda_body_method_handle,
                actual_method_type);

        // 第四步，以 FunctionalInterface 的视角，来调用具体的实现方法
        MethodHandle factory = site.getTarget();
        System.out.println("factory method handle: " + factory);
        Consumer<String> c = (Consumer<String>) factory.invoke();

        c.accept("foo");
        c.accept("bar");
    }
}
```

## BiFunction

- [Stackoverflow](https://stackoverflow.com/a/57244388)

```java
import java.lang.invoke.*;
import java.util.function.BiFunction;

public class MyBiFunction {
    public static void testFunctionWithParameter() throws Throwable {
        // 第一步，FunctionalInterface 的信息
        Class<?> interfaceType = BiFunction.class;
        String interfaceMethodName = "apply";
        MethodType interfaceMethodType = MethodType.methodType(Object.class, Object.class, Object.class);

        // FactoryType
        MethodType factoryType = MethodType.methodType(interfaceType);

        // 第二步，寻找一个具体的实现方法
        MethodHandles.Lookup caller = MethodHandles.lookup();
        MethodType implMethodType = MethodType.methodType(String.class, String.class);
        MethodHandle implMethodHandle = caller.findVirtual(SimpleBean.class, "simpleFunction", implMethodType);

        // 第三步，生成 CallSite 对象（形象的来说，我们组装了一件武器）
        MethodType dynamicMethodType = MethodType.methodType(String.class, SimpleBean.class, String.class);
        CallSite site = LambdaMetafactory.metafactory(
                caller, interfaceMethodName, factoryType,
                interfaceMethodType,
                implMethodHandle,
                dynamicMethodType
        );

        // 第四步，以 FunctionalInterface 的视角，来调用具体的实现方法
        MethodHandle factory = site.getTarget();
        BiFunction<SimpleBean, String, String> func = (BiFunction<SimpleBean, String, String>) factory.invokeExact();
        SimpleBean simpleBean = new SimpleBean();
        System.out.println(func.apply(simpleBean, "FOO"));
    }

    public static void main(String[] args) throws Throwable {
        testFunctionWithParameter();
    }
}

class SimpleBean {
    public String simpleFunction(String str) {
        return "The parameter was " + str;
    }
}
```

## 生成两个 bootstrap 方法

在下面的代码中，我们使用了两个 lambda 表达式，因此在 BootstrapMethods 属性中会有两个 bootstrap method。

```java

```

## Reference



