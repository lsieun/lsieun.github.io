---
title: "绑定优先级"
sequence: "102"
---

## Method Binding

But before we proceed, we want to take a more detailed look on how Byte Buddy **selects a target method**.

We already described how Byte Buddy resolves a most specific method
by comparing parameter types but there is more to it.

After Byte Buddy identified candidate methods
that qualified for a binding to a given source method,
it delegates the resolution to a chain of `AmbiguityResolver`s.

> candidate methods --> a chain of AmbiguityResolvers

Again, you are free to implement your own ambiguity resolvers
that can complement or even replace Byte Buddy's defaults.

Without such alterations, the **ambiguity resolver chain** attempts to identify **a unique target method**
by applying the following rules in the same order as below:

### 绑定过程

```text
                             ┌─── HelloWorld ───┼─── test()
                             │
                             │                  ┌─── methodAbc() ───┼─── MethodDelegationBinder.Record ───┼─── MethodBinding
                             │                  │
                             ├─── HardWorker ───┼─── methodMid() ───┼─── MethodDelegationBinder.Record ───┼─── MethodBinding
                             │                  │
                             │                  └─── MethodXyz() ───┼─── MethodDelegationBinder.Record ───┼─── MethodBinding
                             │
                             │                                                                             ┌─── MethodDescription source
method.delegation.binding ───┤                                                                             │
                             │                                                              ┌─── params ───┼─── MethodBinding left
                             │                                                              │              │
                             │                                                              │              └─── MethodBinding right
                             │                  ┌─── AmbiguityResolver ───┼─── resolve() ───┤
                             │                  │                                           │                                 ┌─── UNKNOWN
                             │                  │                                           │                                 │
                             │                  │                                           │                                 ├─── LEFT
                             │                  │                                           └─── return ───┼─── Resolution ───┤
                             │                  │                                                                             ├─── RIGHT
                             └─── Weaver ───────┤                                                                             │
                                                │                                                                             └─── AMBIGUOUS
                                                │
                                                │                                                          ┌─── AmbiguityResolver
                                                │                                                          │
                                                │                                           ┌─── params ───┼─── MethodDescription source
                                                │                                           │              │
                                                └─── BindingResolver ─────┼─── resolve() ───┤              └─── List<MethodBinding> targets
                                                                                            │
                                                                                            └─── return ───┼─── MethodBinding
```

第一步，将 `HardWorker` 类中的每一个 candidate method 封装成 `MethodDelegationBinder.Record` 类型。

```java
public class MethodDelegation implements Implementation.Composable {
    protected interface ImplementationDelegate extends InstrumentedType.Prepareable {
        class ForStaticMethod implements ImplementationDelegate {
            protected static ImplementationDelegate of(MethodList<?> methods, MethodDelegationBinder methodDelegationBinder) {
                List<MethodDelegationBinder.Record> records = new ArrayList<>(methods.size());
                for (MethodDescription methodDescription : methods) {
                    // 第一步，将 candidate method 转换成 Record 对象
                    MethodDelegationBinder.Record record = methodDelegationBinder.compile(methodDescription);
                    records.add(record);
                }
                return new ForStaticMethod(records);
            }
        }
    }
}
```

第二步，将 `MethodDelegationBinder.Record` 转换为 `MethodBinding` 类型：

```java
public interface MethodDelegationBinder {
    class Processor implements MethodDelegationBinder.Record {
        public MethodBinding bind(Implementation.Target implementationTarget,
                                  MethodDescription source,
                                  TerminationHandler terminationHandler,
                                  MethodInvoker methodInvoker,
                                  Assigner assigner) {
            List<MethodBinding> targets = new ArrayList<>();
            for (Record record : records) {
                // 第二步，将 Record 转换成 MethodBinding
                MethodBinding methodBinding = record.bind(
                        implementationTarget, source, terminationHandler, methodInvoker, assigner
                );
                if (methodBinding.isValid()) {
                    targets.add(methodBinding);
                }
            }
            if (targets.isEmpty()) {
                throw new IllegalArgumentException("None of " + records + " allows for delegation from " + source);
            }
            
            // 第三步，多选一
            return bindingResolver.resolve(ambiguityResolver, source, targets);
        }
    }
}
```

第三步，结合 `BindingResolver` 和 `AmbiguityResolver` 两个类，对多个 `MethodBinding` 对象进行『多选一』：

- `AmbiguityResolver` 是对 `MethodBinding` 进行 『二选一』
- `BindingResolver` 是将多个 `MethodBinding` 中拿出两个来，交给 `AmbiguityResolver` 处理。

### 绑定优先级

```text
                             ┌─── Weaver ───────┼─── MethodDelegation.withDefaultConfiguration().filter(...).to(...)
                             │
method.delegation.binding ───┤                  ┌─── ignore ───┼─── @IgnoreForBinding
                             │                  │
                             └─── HardWorker ───┤              ┌─── explicit ───┼─── @BindingPriority
                                                │              │
                                                └─── bind ─────┤                ┌─── DeclaringTypeResolver
                                                               │                │
                                                               │                ├─── ArgumentTypeResolver
                                                               └─── implicit ───┤
                                                                                ├─── MethodNameEqualityResolver
                                                                                │
                                                                                └─── ParameterLengthResolver
```

## 问题与解决

### 问题：Ambiguous Delegation

```java
public class HelloWorld {
    public int test(int a, int b) {
        return 0;
    }
}
```

```java
public class HardWorker {
    public static int add(int a, int b) {
        return a + b;
    }

    public static int sub(int a, int b) {
        return a - b;
    }

    public static int mul(int a, int b) {
        return a * b;
    }

    public static int div(int a, int b) {
        return a / b;
    }
}
```

```java
import net.bytebuddy.ByteBuddy;
import net.bytebuddy.dynamic.DynamicType;
import net.bytebuddy.implementation.MethodDelegation;
import net.bytebuddy.matcher.ElementMatchers;

public class HelloWorldRedefine {
    public static void main(String[] args) {
        // 1. prepare
        String className = "sample.HelloWorld";
        Class<?> clazz = ClassUtils.loadClass(className);


        // 2. weave
        ByteBuddy byteBuddy = new ByteBuddy();
        DynamicType.Builder<?> builder = byteBuddy.redefine(clazz)
                .name(className);

        builder = builder.method(ElementMatchers.named("test"))
                .intercept(MethodDelegation.to(HardWorker.class));


        // 3. output
        DynamicType.Unloaded<?> unloadedType = builder.make();
        OutputUtils.save(unloadedType, true);
    }
}
```

运行时，遇到错误信息：

```text
Cannot resolve ambiguous delegation of ...
```

### 解决方式一：明确指定

```text
MethodDelegation.withDefaultConfiguration()
    .filter(ElementMatchers.named("add"))    // 明确指定某个方法
    .to(HardWorker.class)
```

```java
import net.bytebuddy.ByteBuddy;
import net.bytebuddy.dynamic.DynamicType;
import net.bytebuddy.implementation.MethodDelegation;
import net.bytebuddy.matcher.ElementMatchers;

public class HelloWorldRedefine {
    public static void main(String[] args) {
        // 1. prepare
        String className = "sample.HelloWorld";
        Class<?> clazz = ClassUtils.loadClass(className);


        // 2. weave
        ByteBuddy byteBuddy = new ByteBuddy();
        DynamicType.Builder<?> builder = byteBuddy.redefine(clazz)
                .name(className);

        builder = builder.method(ElementMatchers.named("test"))
                .intercept(
                        MethodDelegation.withDefaultConfiguration()
                                .filter(ElementMatchers.named("add"))
                                .to(HardWorker.class)
                );


        // 3. output
        DynamicType.Unloaded<?> unloadedType = builder.make();
        OutputUtils.save(unloadedType, true);
    }
}
```

### 解决方式二：`@IgnoreForBinding`

In ByteBuddy, a method that is annotated by `@IgnoreForBinding` is never considered as a target method.

使用 `@IgnoreForBinding` 注解，排除不想使用的方法：

```java
import net.bytebuddy.implementation.bind.annotation.IgnoreForBinding;

public class HardWorker {
    public static int add(int a, int b) {
        return a + b;
    }

    @IgnoreForBinding // 使用注解
    public static int sub(int a, int b) {
        return a - b;
    }

    @IgnoreForBinding // 使用注解
    public static int mul(int a, int b) {
        return a * b;
    }

    @IgnoreForBinding // 使用注解
    public static int div(int a, int b) {
        return a / b;
    }
}
```

### 解决方式三：`@BindingPriority`

Methods can be assigned **an explicit priority** by annotating them with `@BindingPriority`.
If a method is of a higher priority than another method,
the high priority method is always preferred over that with lower priority.

使用 `@BindingPriority` 注解，提升方法的优先级：`@BindingPriority` 的默认优先级是 `1`；值越大，优先级越高。

```java
import net.bytebuddy.implementation.bind.annotation.BindingPriority;

public class HardWorker {
    @BindingPriority(2)
    public static int add(int a, int b) {
        return a + b;
    }

    public static int sub(int a, int b) {
        return a - b;
    }

    public static int mul(int a, int b) {
        return a * b;
    }

    public static int div(int a, int b) {
        return a / b;
    }
}
```

## 隐式规则

### DeclaringType

### ArgumentType

If two methods bind the same parameters of a source method by using `@Argument`,
the method with **the most specific parameter types** is considered.
In this context, it does not matter if an annotation is provided explicitly or implicitly by not annotating a parameter.
The resolution algorithm works similar to the Java compiler's algorithm for resolving calls to overloaded methods.

If two types are equally specific, **the method that binds more arguments** is considered as a target.

> 相同的参数数量越多，优先级越高

If a parameter should be assigned an argument **without considering the parameter type** at this resolution stage,
this is possible by setting the annotation's `bindingMechanic` attribute to `BindingMechanic.ANONYMOUS`.

Furthermore, note that **non-anonymous parameters** need to be unique per index value on each target method for the
resolution algorithm to work.

```java
public class HardWorker {

    public static int add(int a, int b) {      // int, int --> 类型最匹配
        return a + b;
    }

    public static int sub(long a, int b) {     // long, int
        return (int) (a - b);
    }

    public static int mul(int a, long b) {     // int, long
        return (int) (a * b);
    }

    public static int div(long a, long b) {    // long, long
        return (int) (a / b);
    }
}
```

### MethodNameEquality

If a **source method** and a **target method** have **an identical name**,
this target method is preferred over other target methods that have a different name.

> 名字匹配，也有一定的优先级


在 `HelloWorld` 类中，该方法是 `test(int, int)`；
如果在 `HardWorker` 类中添加一个 `test(int, int)` 方法，
该 `test` 方法会比 `add`、`sub`、`mul` 和 `div` 方法的优先级更高：

```java
public class HardWorker {

    public static int add(int a, int b) {
        return a + b;
    }

    public static int sub(int a, int b) {
        return a - b;
    }

    public static int mul(int a, int b) {
        return a * b;
    }

    public static int div(int a, int b) {
        return a / b;
    }

    public static int test(int a, int b) {
        return a | b;
    }
}
```

### ParameterLength

If a target method has more parameters than another target method, the former method is preferred over the latter.

```java
public class HardWorker {

    public static int zeroArg() {
        return 0;
    }

    public static int oneArg(int num) {
        return num;
    }

    public static int twoArg(int a, int b) {
        return a + b;
    }
}
```

## 示例

注意事项：

- 第一点，要保证方法参数的顺序和类型兼容。

示例一（错误）：在开始位置，添加一个 `Object` 类型的参数，导致参数顺序变化，发生错误

```java
public class HardWorker {
    public static String doWork(Object obj, String name, int age) throws NoSuchAlgorithmException {
        // ...
    }
}
```

示例二（错误）：在结束位置，添加一个 `Object` 类型的参数，发生错误

```java
public class HardWorker {
    public static String doWork(String name, int age, Object obj) {
        // ...
    }
}
```

示例三（正确）：减去 `int` 类型的参数，正确

```java
public class HardWorker {
    public static String doWork(String name) {
        // ...
    }
}
```

示例四（正确）：将 `int` 类型变成 `long` 类型，正确

```java
public class HardWorker {
    public static String doWork(String name, long age) {
        // ...
    }
}
```

```java
public class HardWorker {
    public static void doWorkAbc(String name, int age) {
        System.out.println("This is doWorkAbc Method");
    }

    public static void doWorkXyz(String name, long age) {
        System.out.println("This is doWorkXyz Method");
    }
}
```

示例五（正确）：将 `String` 类型变成 `Object` 类型，正确

```java
public class HardWorker {
    public static String doWork(Object name, long age) {
        // ...
    }
}
```

- 第二点，尽量保证抛出异常（throws）是一致的。

```java
import java.security.NoSuchAlgorithmException;

public class HelloWorld {
    public String test(String name, int age) throws NoSuchAlgorithmException {
        return HardWorker.doWork(name, age);
    }
}
```

```java
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.UUID;

public class HardWorker {
    public static String doWork(String name, int age) throws NoSuchAlgorithmException {
        String str = UUID.randomUUID().toString();
        byte[] bytes = str.getBytes(StandardCharsets.UTF_8);
        MessageDigest md = MessageDigest.getInstance("MD5");
        md.update(bytes);
        byte[] digest = md.digest();
        return HexUtils.toHex(digest);
    }
}
```

```java
import net.bytebuddy.ByteBuddy;
import net.bytebuddy.description.modifier.Visibility;
import net.bytebuddy.dynamic.DynamicType;
import net.bytebuddy.implementation.MethodDelegation;

import java.security.NoSuchAlgorithmException;

public class HelloWorldGenerate {
    public static void main(String[] args) {
        // 1. prepare
        String className = "sample.HelloWorld";


        // 2. weave
        ByteBuddy byteBuddy = new ByteBuddy();
        DynamicType.Builder<?> builder = byteBuddy.subclass(Object.class)
                .modifiers(Visibility.PUBLIC)
                .name(className);

        builder = builder.defineMethod("test", String.class, Visibility.PUBLIC)
                .withParameter(String.class, "name")
                .withParameter(int.class, "age")
                .throwing(NoSuchAlgorithmException.class)
                .intercept(
                        MethodDelegation.to(HardWorker.class)
                );


        // 3. output
        DynamicType.Unloaded<?> unloadedType = builder.make();
        OutputUtils.save(unloadedType);
    }
}
```

```java
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

public class HardWorker {
    public static String doWork(String name, long age) throws NoSuchAlgorithmException {
        String str = name + age;
        byte[] bytes = str.getBytes(StandardCharsets.UTF_8);

        MessageDigest md = MessageDigest.getInstance("MD5");
        md.update(bytes);
        byte[] digest = md.digest();

        return HexUtils.toHex(digest);
    }
}
```

- 第三点，避免出现参数完全一样的两个方法

```java
public class HardWorker {
    public static String doWork(String name, int age) {
        String str = UUID.randomUUID().toString();
        byte[] bytes = str.getBytes(StandardCharsets.UTF_8);
        byte[] encodedBytes = Base64.getEncoder().encode(bytes);
        return new String(encodedBytes, StandardCharsets.UTF_8);
    }

    public static String anotherWork(String abc, int val) {
        return abc + val;
    }
}
```

这个时候，ByteBuddy 就不知道要选择哪一个方法了，就会提示错误：

```text
java.lang.IllegalArgumentException: Cannot resolve ambiguous delegation of xxx
```

## 总结

- 第一，在进行 Method Delegation 时，有一个 Method Binding 的过程，该过程的本质是『多中选一』。
- 第二，在实际使用过程中，推荐『主动选择』，而非『被动』
    - 主动选择或排除方法：
        - `MethodDelegation.withDefaultConfiguration().filter(...).to(...)`
        - `@IgnoreForBinding`
        - `@BindingPriority`
    - 被动选择：
        - `DeclaringTypeResolver`
        - `ArgumentTypeResolver`
        - `MethodNameEqualityResolver`
        - `ParameterLengthResolver`
