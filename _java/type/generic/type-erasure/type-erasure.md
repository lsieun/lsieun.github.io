---
title: "Type Erasure"
sequence: "152"
---

## What is type erasure?

**A process that maps a parameterized type (or method) to its unique byte code representation by eliding type parameters and arguments**.

The compiler generates only one byte code representation of a generic type or method<sub>注：这是对 class 或 method 的 definition 转换成 bytecode</sub> and maps all the instantiations of the generic type or method to the unique representation<sub>注：这是对 class 或 method 的 invokation 转换成 bytecode</sub>. This mapping is performed by **type erasure**. **The essence of type erasure** is the removal of all information that is related to **type parameters** and **type arguments**. In addition, the compiler adds **type checks** and **type conversions** where needed and inserts synthetic **bridge methods** if necessary. It is important to understand type erasure because certain effects related to Java generics are difficult to understand without a proper understanding of the translation process.

The **type erasure process** can be imagined as a translation from **generic Java source code** back into **regular Java code**.
In reality the compiler is more efficient and translates directly to Java byte code.
But the byte code created is equivalent to the non-generic Java code you will be seeing in the subsequent examples.

The steps performed during type erasure include:

- **Eliding type parameters**. 
- **Eliding type arguments**.

[示例在这里，因为它有颜色标识，这里没有办法体现出来](http://www.angelikalanger.com/GenericsFAQ/FAQSections/TechnicalDetails.html#FAQ101)

### Eliding type parameters

When the compiler finds the definition of a generic type or method,
it removes all occurrences of the **type parameters** and replaces them by their leftmost bound,
or type `Object` if no bound had been specified.

> 这里讲的是 compiler 对 type parameter 的处理，暂时不用关心

### Eliding type arguments

When the compiler finds a **paramterized type**, i.e. **an instantiation of a generic type**, then it removes the **type arguments**.
For instance, the types `List<String>`, `Set<Long>`, and `Map<String,?>` are translated to `List`, `Set` and `Map` respectively.

> 这里讲的是 compiler 对 type arguments 的处理，暂时不用关心

## Why does the compiler add casts when it translates generics?

**Because the return type of methods of a parameterized type might change as a side effect of type erasure**.

During **type erasure** the compiler replaces **type parameters** by the leftmost bound, or type `Object` if no bound was specified.
This means that methods whose return type is the **type parameter** would return a reference that is either the leftmost bound or `Object`,
instead of the more specific type that was specified in the parameterized type and that the caller expects.
A cast is need from the leftmost bound or `Object` down to the more specific type.

[示例在这里，因为它有颜色标识，这里没有办法体现出来](http://www.angelikalanger.com/GenericsFAQ/FAQSections/TechnicalDetails.html#FAQ104)

让我联想到了《Lost And Found》，曾经遗失的东西，在某个时间段又再次被发现。

## How does type erasure work when a type parameter has several bounds?

**The compiler adds casts as needed**.

In the process of type erasure the compiler replaces type parameters by their leftmost bound, or type `Object` if no bound was specified. How does that work if a type parameter has several bounds?

Example (before type erasure):

```text
interface Runnable {
  void run();
}
interface Callable<V> {
  V call();
}
class X<T extends Callable<Long> & Runnable> {
  private T task1, task2;
  ...
  public void doAction() {
    task1.run();
    Long result = task2.call();
  }
}
```

Example (after type erasure):

```text
interface Runnable {
  void run();
}
interface Callable {
  Object call();
}
class X {
  private Callable task1, task2;
  ...
  public void doAction() {
    ( (Runnable) task1).run();
    Long result = (Long) task2.call();
  }
}
```

The type parameter `T` is replaced by the bound `Callable`, which means that both fields are held as references of type `Callable`.
Methods of the leftmost bound (which is `Callable` in our example) can be called directly.
For invocation of methods of the other bounds (`Runnable` in our example) the compiler adds a cast to the respective bound type,
so that the methods are accessible.
The inserted cast cannot fail at runtime with a `ClassCastException`
because the compiler already made sure at compile-time that both fields are references to objects of a type that is within both bounds.

In general, casts silently added by the compiler are guaranteed not to raise a `ClassCastException`
if the program was compiled without warnings.
This is the type-safety guarantee.
