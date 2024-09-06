---
title: "DynamicType"
sequence: "102"
---

## DynamicType 是什么

A **dynamic type** is created at runtime,
usually as the result of applying a `DynamicType.Builder` or as the result of an `AuxiliaryType`.

> DynamicType 表示一个动态生成的类。

## 处理流程

```java
public interface DynamicType extends ClassFileLocator {
    interface Builder<T> {}

    interface Unloaded<T> extends DynamicType {}

    interface Loaded<T> extends DynamicType {}
}
```

`DynamicType` 是一个接口，它有三个子接口：

- `Builder` 接口，组织类、字段、方法相关的相关信息。如果调用 `Builder.make()` 方法，它就可以转换成 `Unloaded` 类型。
- `Unloaded` 接口，代表着未被 ClassLoader 加载的类。如果调用 `Unloaded.load()` 方法，它就可以转换成 `Loaded` 类型。
- `Loaded` 接口，代表着已经被 ClassLoader 加载的类。如果调用 `Loaded.getLoaded()` 方法，它就可以转换成 `Class` 类型。

处理流程：将三个子接口串连起来。

```text
               ┌--- Builder
               │
DynamicType ───┼─── Unloaded
               │
               └─── Loaded
```

注意，四个类型属于 Java 或 ByteBuddy 的情况：

| Java              | ByteBuddy              |
|-------------------|------------------------|
|                   | `DynamicType.Builder`  |
|                   | `DynamicType.Unloaded` |
|                   | `DynamicType.Loaded`   |
| `java.lang.Class` |                        |

接着，我们可以再进一步延伸到三个子接口的方法（method）层面：

```text
                                                                   ┌─── name()
                                                                   │
                                               ┌─── class ─────────┼─── modifiers()
                                               │                   │
                                               │                   └─── implement()
                                               │
                                               │                   ┌─── defineField()
                                               │                   │
                                               ├─── field ─────────┼─── define()
                                               │                   │
                                               │                   └─── simplify ────────┼─── serialVersionUid()
                                               │
                                               │                   ┌─── defineConstructor()
                                               ├─── constructor ───┤
                                ┌─── input ────┤                   └─── define()
                                │              │
                                │              │                   ┌─── defineMethod()
                                │              │                   │
                                │              │                   ├─── define()
                                │              ├─── method ────────┤
                                │              │                   │                      ┌─── defineProperty()
               ┌─── Builder ────┤              │                   │                      │
               │                │              │                   └─── simplify ─────────┼─── withHashCodeEquals()
               │                │              │                                          │
               │                │              │                                          └─── withToString()
               │                │              │
               │                │              └─── clinit ────────┼─── initializer()
               │                │
DynamicType ───┤                └─── output ───┼─── make(): DynamicType.Unloaded
               │
               │                ┌─── input ────┼─── include()
               ├─── Unloaded ───┤
               │                └─── output ───┼─── load(): DynamicType.Loaded
               │
               │                               ┌─── getLoaded(): Class
               │                               │
               └─── Loaded ─────┼─── output ───┼─── getLoadedAuxiliaryTypes(): Map
                                               │
                                               └─── getAllLoaded(): Map
```

## DynamicType.Builder

### method

```text
                                                   ┌─── name/return/access ───┼─── defineMethod()
                                                   │
                                                   │                          ┌─── withParameter()
                               ┌─── method head ───┼─── parameters ───────────┤
                               │                   │                          └─── withParameters()
                               │                   │
                               │                   └─── throws ───────────────┼─── throwing()
                               │
DynamicType.Builder: method ───┤                   ┌─── withoutCode()
                               │                   │
                               │                   │
                               │                   │                     ┌─── StubMethod.INSTANCE
                               │                   │                     │
                               └─── method body ───┤                     │                           ┌─── value()
                                                   │                     │                           │
                                                   │                     ├─── FixedValue ────────────┼─── nullValue()
                                                   │                     │                           │
                                                   │                     │                           └─── argument()
                                                   └─── intercept() ─────┤
                                                                         ├─── FieldAccessor ─────────┼─── ofField()
                                                                         │
                                                                         ├─── MethodCall
                                                                         │
                                                                         ├─── MethodDelegation
                                                                         │
                                                                         └─── Advice
```

### Generic

```text
                                                              ┌─── typeVariable(String symbol)
                                                              │
                                       ┌─── typeVariable() ───┼─── typeVariable(String symbol, Type... bound)
                                       │                      │
DynamicType.Builder ───┼─── generic ───┤                      └─── typeVariable(String symbol, TypeDefinition... bound)
                                       │
                                       └─── transform() ──────┼─── transform(ElementMatcher, Transformer)
```
