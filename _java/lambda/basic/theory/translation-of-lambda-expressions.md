---
title: "Translation of Lambda Expressions"
---

This document deals with **how we arrive at the bytecode that the compiler must generate when it encounters lambda expressions**,
and **how the language runtime participates in evaluating lambda expressions**.
The majority of this document deals with **the mechanics of functional interface conversion**.

> 要处理两个问题：遇到 lambda expression 后，compiler 应该生成什么样的 bytecode，runtime 如何解析这些 bytecode。
> 
> 这两个问题汇聚到一点：functional interface conversion

```text
                      ┌─── compile-time: how we arrive at the bytecode that the compiler must generate when it encounters lambda expressions
Lambda Expressions ───┤
                      └─── runtime: how the language runtime participates in evaluating lambda expressions
```

Functional interfaces are a central aspect of lambda expressions in Java.
A functional interface is an interface that has **one non-Object method**, such as `Runnable`, `Comparator`, etc.
(Java libraries have used such interfaces to represent callbacks for years.)

> Functional interfaces 是 Lambda 表达式一个核心的部分

Lambda expressions can only appear in places where they will be assigned to a variable whose type is a functional interface.

> Lambda expressions 可以出现在哪里

For example:

```text
Runnable r = () -> { System.out.println("hello"); };
```

or

```text
Collections.sort(strings, (String a, String b) -> -(a.compareTo(b)));
```

The code that the compiler generates to capture these lambda expressions is dependent both on **the lambda expression itself**,
and **the functional interface type** to which it is being assigned.

```text
                                                          ┌─── lambda expression itself
                                     ┌─── compile-time ───┤
Translation of Lambda Expressions ───┤                    └─── functional interface type
                                     │
                                     └─── runtime
```

## Translation strategy

There are a number of ways we might represent a lambda expression in bytecode, such as

> 有不同的实现方式

- inner classes,
- method handles,
- dynamic proxies,
- and others.

Each of these approaches has pros and cons.

In selecting a strategy, there are two competing goals:

> 两个目标：flexibility 和 stability

- maximizing **flexibility** for future optimization by not committing to a specific strategy, vs
- providing **stability** in the classfile representation.

We can achieve both of these goals by using the `invokedynamic` feature from JSR 292
to separate **the binary representation of lambda creation in the bytecode** from **the mechanics of evaluating the lambda expression at runtime**.

```text
                 ┌─── the binary representation of lambda creation in the bytecode
invokedynamic ───┤
                 └─── the mechanics of evaluating the lambda expression at runtime
```

Instead of generating bytecode to create the object that implements the lambda expression (such as calling a constructor for an inner class),
we describe a recipe for constructing the lambda, and delegate the actual construction to the language runtime.
That recipe is encoded in the static and dynamic argument lists of an `invokedynamic` instruction.

```text
recipe = invokedynamic instruction
```

**The use of `invokedynamic` lets us defer the selection of a translation strategy until run time.**
The runtime implementation is free to select a strategy dynamically to evaluate the lambda expression.
The runtime implementation choice is hidden behind a standardized (i.e., part of the platform specification) API for lambda construction,
so that the static compiler can emit calls to this API, and JRE implementations can choose their preferred implementation strategy.
The `invokedynamic` mechanics allow this to be done without the performance costs that this late binding approach might otherwise impose.

> invokedynamic 推迟了选择 translation strategy 的时机，到了 run time 才会决定使用哪一个。具体的 JVM runtime implementation 可以自由选择自己的 translation strategy 实现。
> 
> 具体的 JVM runtime implementation 对于 lambda 表达式的实现，隐藏在 standardized API 的后面。

When the compiler encounters a lambda expression,
it first lowers **(desugars) the lambda body into a method** whose argument list and return type match that of the lambda expression,
possibly with some additional arguments (for values captured from the lexical scope, if any.)
At the point at which the lambda expression would be captured,
it generates an `invokedynamic` call site, which, when invoked, returns an instance of the functional interface to which the lambda is being converted.
This call site is called the **lambda factory** for a given lambda.
The dynamic arguments to the lambda factory are the values captured from the lexical scope.
The bootstrap method of the lambda factory is a standardized method in the Java language runtime library, called the **lambda metafactory**.
The static bootstrap arguments capture information known about the lambda at compile time
(the functional interface to which it will be converted, a method handle for the desugared lambda body, information about whether the SAM type is serializable, etc.)

> compiler: desugars the lambda body into a method
> 
> call site = lambda metafactory

**Method references** are treated the same way as **lambda expressions**,
except that most method references do not need to be desugared into a new method;
we can simply load a constant method handle for the referenced method and pass that to the metafactory.

> method reference 与 lambda expression 存在差异

## Lambda body desugaring

**The first step of translating lambdas into bytecode is desugaring the lambda body into a method.**

There are several choices that must be made surrounding desugaring:

> 这里探讨 lambda body 转换成 method 过程需要考虑的问题

- Do we desugar to a **static method** or **instance method**?
- In **what class** should the desugared method go?
- What should be **the accessibility of the desugared method**?
- What should be **the name of the desugared method**?
- If adaptations are required to **bridge differences** between the lambda body signature and the functional interface method signature
  (such as boxing, unboxing, primitive widening or narrowing conversions, varargs conversions, etc),
  should the desugared method follow the signature of the lambda body, the functional interface method, or something in between? Who is responsible for the needed adaptations?
- If the lambda **captures arguments** from the enclosing scope, how should those be represented in the desugared method signature?
  (They could be individual arguments added to the beginning or end of the argument list, or the compiler could collect them into a single "frame" argument.)

Related to the issue of desugaring lambda bodies is that of whether **method references** require the generation of an adapter or "bridge" method.

> 这里探讨 method reference

The compiler will infer a **method signature** for the lambda expression, including **argument types**, **return type**, and **thrown exceptions**;
we will call this the natural signature.
Lambda expressions also have a **target type**, which will be a functional interface;
we will call the lambda descriptor **the method signature** for the descriptor of the erasure of the target type.
The value returned from the **lambda factory**, which implements the functional interface and captures the behavior of the lambda, is called the **lambda object**.

> 这里讲了几个概念，我还不能很好的对应起来

All things being equal, **private methods** are preferable to **nonprivate**, **static methods** preferable to **instance methods**,
it is best if lambda bodies are desugared into in **the innermost class** in which the lambda expression appears,
**signatures** should match the body signature of the lambda,
**extra arguments** should be prepended on the front of the argument list for captured values,
and **would not desugar method references at all**.
However, there are exception cases where we may have to deviate from this baseline strategy.

> 这里讲了几种优先选择的方式

### stateless lambdas

The simplest form of lambda expression to translate is one that captures no state from its enclosing scope (a stateless lambda):

```java
package sample;

import java.util.ArrayList;
import java.util.List;

public class HelloWorld {
    public void test() {
        List<String> list = new ArrayList<>();
        list.forEach(s -> {
            System.out.println(s);
        });
    }
}
```

The natural signature of the lambda is `(String)V`; the `forEach` method takes a `Block<String>` whose lambda descriptor is `(Object)V`.
The compiler desugars the lambda body into a static method whose signature is the natural signature, and generates a name for the desugared body.

### lambdas capturing immutable values

The other form of lambda expression involves capture of **enclosing `final` (or effectively final) local variables**,
and/or **fields from enclosing instances** (which we can treat as capture of the final enclosing `this` reference).

```java
package sample;

import java.util.ArrayList;
import java.util.List;

public class HelloWorld {
    public void test() {
        List<Person> list = new ArrayList<>();
        final int bottom = 10, top = 20;
        list.removeIf(p -> (p.age >= bottom && p.age <= top));
    }
}
```

```java
package sample;

import java.util.ArrayList;
import java.util.List;

public class HelloWorld {
    public HelloWorld() {
    }

    public void test() {
        List<Person> list = new ArrayList();
        int bottom = true;
        int top = true;
        list.removeIf(HelloWorld::lambda$test$0);
    }

    private static boolean lambda$test$0(Person p) {
        return p.age >= 10 && p.age <= 20;
    }
}
```

Here, our lambda captures the final local variables `bottom` and `top` from the enclosing scope.

The signature of the desugared method will be the natural signature `(Person)Z` with some **extra arguments** prepended at the front of the argument list.
The compiler has some latitude(做事方式的自由) as to how these **extra arguments** are represented;
they could be prepended individually, boxed into a frame class, boxed into an array, etc.
The simplest approach is to prepend them individually:

```java
package sample;

import java.util.ArrayList;
import java.util.List;

public class HelloWorld {
    public void test(int bottom, int top) {
        List<Person> list = new ArrayList<>();
        list.removeIf(p -> (p.age >= bottom && p.age <= top));
    }
}
```

```java
package sample;

import java.util.ArrayList;
import java.util.List;

public class HelloWorld {
    public HelloWorld() {
    }

    public void test(int bottom, int top) {
        List<Person> list = new ArrayList();
        list.removeIf(HelloWorld::lambda$test$0);
    }

    private static boolean lambda$test$0(final int bottom, final int top, Person p) {
        return p.age >= bottom && p.age <= top;
    }
}
```

Alternately, the captured values (`bottom` and `top`) could be boxed into a frame or an array;
the key is agreement between the **types of the extra arguments** as they appear in the signature of **the desugared lambda method**,
and the types as they appear as (dynamic) arguments to **the lambda factory**.
Since the compiler is in control of both of these, and they are generated at the same time, the compiler has some flexibility in how captured arguments are packaged.

> compiler 掌握着 extra arguments 的类型

## The Lambda Metafactory

Lambda capture will be implemented by an `invokedynamic` call site,
whose **static parameters** describe the characteristics of the **lambda body** and **lambda descriptor**,
and whose **dynamic parameters** (if any) are the **captured values**.
When invoked, this call site returns a **lambda object** for the corresponding lambda body and descriptor, bound to the captured values.

```text
                                                      ┌─── lambda body
                           ┌─── static parameters ────┤
invokedynamic call site ───┤                          └─── lambda descriptor
                           │
                           └─── dynamic parameters ───┼─── captured values
```

**The bootstrap method** for this callsite is a specified platform method called the **lambda metafactory**.
(We can have a single metafactory for all lambda forms, or have specialized versions for common situations.)
The VM will call the metafactory only once per capture site;
thereafter it will link the call site and get out of the way.
Call sites are linked lazily, so factory sites that are never invoked are never linked.
The static argument list for the basic metafactory looks like:

```text
metaFactory(MethodHandles.Lookup caller, // provided by VM
            String invokedName,          // provided by VM
            MethodType invokedType,      // provided by VM
            MethodHandle descriptor,     // lambda descriptor
            MethodHandle impl)           // lambda body
```

The first three arguments (`caller`, `invokedName`, `invokedType`) are automatically stacked by the VM at callsite linkage.

The `descriptor` argument identifies **the functional interface method** to which the lambda is being converted.
(Through a reflection API for method handles, the metafactory can obtain **the name of the functional interface class** and **the name and method signature of its primary method**.)

The `impl` argument identifies **the lambda method**, either **a desugared lambda body** or **the method named in a method reference**.

There may be **some differences between the method signatures** for the **functional interface method** and **the implementation method**.
The implementation method may have **extra arguments** corresponding to **captured arguments**.
The remaining arguments also may not match exactly; **certain adaptations** (subtyping, boxing) are permitted as described in Adaptations.

## Lambda capture

We are now ready to describe the translation of **functional interface conversion** for **lambda expressions** and **method references**.

We can translate example A as:

## Static vs instance methods

Lambdas like those in the above section can be translated to **static methods**,
since they do not use the **enclosing object instance** in any way (do not refer to `this`, `super`, or **members of the enclosing instance**.)
Collectively, we will refer to lambdas that use `this`, `super`, or **capture members of the enclosing instance** as **instance-capturing lambdas**.

> 引入概念：instance-capturing lambdas

**Non-instance-capturing lambdas** are translated to `private`, `static` methods.
**Instance-capturing lambdas** are translated to **private instance methods**.
This simplifies the desugaring of instance-capturing lambdas,
as names in the lambda body will mean the same as names in the desugared method, and meshes well with available implementation techniques (bound method handles.)
When capturing an instance-capturing lambda, the receiver (`this`) is specified as the first dynamic argument.

As an example, consider a lambda that captures a field `minSize`:

```java
package sample;

import java.util.ArrayList;
import java.util.List;

public class HelloWorld {
    private int minAge;

    public void test() {
        List<Person> list = new ArrayList<>();
        list.removeIf(e -> e.age < minAge);
    }
}
```

```java
package sample;

import java.util.ArrayList;
import java.util.List;

public class HelloWorld {
    private int minAge;

    public HelloWorld() {
    }

    public void test() {
        List<Person> list = new ArrayList();
        list.removeIf(this::lambda$test$0);
    }

    private boolean lambda$test$0(Person e) {
        return e.age < this.minAge;
    }
}
```

Because lambda bodies are translated to `private` methods, when passing the behavior method handle to the metafactory,
the capture site should load a constant method handle whose reference kind is `REF_invokeSpecial` for instance methods and `REF_invokeStatic` for static methods.

We can desugar to private methods because the private method is accessible to the capturing class,
and therefore can obtain a method handle to the private method which is then invokable by the metafactory.
(If the metafactory is generating bytecode to implement the target functional interface,
rather than invoking the method handle directly, it will load these classes through Unsafe.defineClass which is immune to accessibility checks.)

## Reference

- [Translation of Lambda Expressions](http://cr.openjdk.java.net/~briangoetz/lambda/lambda-translation.html)
