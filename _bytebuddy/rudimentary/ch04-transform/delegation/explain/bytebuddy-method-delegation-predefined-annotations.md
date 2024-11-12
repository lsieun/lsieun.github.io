---
title: "预定义注解"
sequence: "103"
---

In reality, the `MethodDelegation` implementation works with **annotations**
where a parameter's annotation decides what value should be assigned to it.

![](/assets/images/bytebuddy/delegation/bytebuddy-method-delegation-annotation.svg)


However, if no annotation is found, Byte Buddy treats a parameter as if it was annotated with `@Argument`.

This `@Argument` annotation causes Byte Buddy
to assign the `n`-th argument of the source method to the annotated target.
When the annotation is not added explicitly, the value of `n` is set to the **annotated parameter's index**.


If the intercepted method does not declare at least two parameters or
if the annotated parameter types are not assignable from the instrumented method's parameter types,
the interceptor method in question is discarded.

> 从数量和类型，两方面考虑

```text
Annotation: source method --> 传递信息 --> target method
```

- @RuntimeType
- class
    - @Origin
- instance
    - @Default
    - @This
    - @Super
- method
    - @Origin
    - @Argument
    - @AllArguments
    - @SuperMethod
- field
- invoke
    - @SuperCall
    - @DefaultCall

```text
                                                       ┌─── class ──────┼─── @Origin
                                                       │
                               ┌─── current class ─────┼─── instance ───┼─── @This
                               │                       │
                               │                       │                ┌─── @Argument
MethodDelegation Annotation ───┤                       └─── method ─────┤
                               │                                        └─── @AllArguments
                               │
                               └─── class hierarchy ───┼─── @Super
```

对于这些注解（`@Origin`、`@SuperCall` 等），要学什么呢？要理解这样的思路：

```text
问题（应用场景） --> 注解 --> 参数类型
```

- 注解，它是用来获取一定的资源的（this、字段、父类的方法），解决某一个问题
- 注解，是用来修饰方法的参数的，它到底是什么样的类型？

两个类：

- `LazyWorker` 类：不带有 `@RuntimeType` 注解
- `HardWorker` 类：带有 `@RuntimeType` 注解

概念

- instrumented type/intercepted type
- instrumented object
- source method/instrumented method/intercepted method
- the list of possible binding candidates
  - If a source method has less parameters than specified by value(), the method carrying this parameter annotation is excluded from the list of possible binding candidates to this particular source method.
  - The same happens, if the source method parameter at the specified index is not assignable to the annotated parameter.
- target method
  - annotation
  - annotated parameter


Besides using the **predefined annotations**,
Byte Buddy allows you to define your own annotations by registering one or several `ParameterBinder`s.

There are several more predefined annotations that can be used with a `MethodDelegation` that we only want to name briefly.
If you want to read more about these annotations, you can find further information in the in-code documentation.
These annotations are:


```text
                                                     ┌─── @This
                                                     │
                               ┌─── obj ─────────────┼─── @Super
                               │                     │
                               │                     └─── @Default
                               │
                               │                     ┌─── @FieldValue
                               │                     │
                               │                     ├─── @FieldProxy
                               ├─── field ───────────┤
                               │                     ├─── @FieldGetterHandle
                               │                     │
                               │                     └─── @FieldSetterHandle
                               │
                               │                                            ┌─── cached()
                               │                                            │
                               │                     ┌─── common ───────────┼─── privileged()
                               │                     │                      │
                               │                     │                      └─── nullIfImpossible()
                               ├─── method ──────────┤
                               │                     ├─── @DefaultMethod ───┼─── targetType()    // 父类只有一个，而接口可以有多个
MethodDelegation::hierarchy ───┤                     │
                               │                     └─── @SuperMethod ─────┼─── fallbackToDefault()
                               │
                               │                     ┌─── common ───────────────┼─── nullIfImpossible()
                               │                     │
                               ├─── method.handle ───┼─── @DefaultCallHandle ───┼─── targetType()
                               │                     │
                               │                     └─── @SuperCallHandle ─────┼─── fallbackToDefault()
                               │
                               │                                          ┌─── serializableProxy()
                               │                     ┌─── common ─────────┤
                               │                     │                    └─── nullIfImpossible()
                               ├─── call ────────────┤
                               │                     ├─── @DefaultCall ───┼─── targetType()
                               │                     │
                               │                     └─── @SuperCall ─────┼─── fallbackToDefault()
                               │
                               │                     ┌─── common ───────────────┼─── nullIfImpossible()
                               │                     │
                               └─── call.handle ─────┼─── @DefaultCallHandle ───┼─── targetType()
                                                     │
                                                     └─── @SuperCallHandle ─────┼─── fallbackToDefault()
```
