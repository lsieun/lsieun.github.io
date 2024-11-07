---
title: "泛型概览"
sequence: "101"
---

The `net.bytebuddy.description.type.TypeDescription.Generic` is the fundamental Java class
for declaring generic method and instance variable in ByteBuddy.

Generic programming in Java requires the program to create
**parameterized type**, **type argument**, and **type variable**.

- 泛型的定义
- 泛型的使用

![](/assets/images/java/generic/generic-type-and-parameterized-type-concepts.png)

- generic type: 对泛型的定义
- paramterized type: 对泛型的使用
- type parameter: formal type parameter
- type argument: actual type parameter

```text
                  ┌─── TypeDescription
TypeDefinition ───┤
                  └─── TypeDescription.Generic
```



## Type Variable

- Generic
    - type
        - Generic Type
            - Type Variable
                - `HelloWorld<A>`: `builder.typeVariable("A")`
                - `HelloWorld<A extends Number>`: `builder.typeVariable("A", Number.class)`
        - Parameterized Type
    - executable
        - Generic Method
            - Type Variable
                - `<B> void test()`: `builder.defineMethod(xxx).typeVariable("B")`
                - `<B extends Number> void test()`: `builder.defineMethod(xxx).typeVariable("B", Number.class)`

### TypeDescription.Generic.Builder

```text
                                                   ┌─── type variable ────────┼─── typeVariable(String symbol)
                                                   │
                                                   │                          ┌─── of(java.lang.reflect.Type type)
                                                   ├─── of ───────────────────┤
                                                   │                          └─── of(TypeDescription.Generic typeDescription)
                                                   │
                                                   │                          ┌─── rawType(Class<?> type)
                                                   │                          │
                                                   │                          ├─── rawType(TypeDescription type)
                                                   ├─── raw type ─────────────┤
                                                   │                          ├─── rawType(Class<?> type, Generic ownerType)
                                   ┌─── builder ───┤                          │
                                   │               │                          └─── rawType(TypeDescription type, Generic ownerType)
                                   │               │
                                   │               ├─── parameterized type ───┼─── parameterizedType(Class<?> rawType, java.lang.reflect.Type... parameter)
                                   │               │
                                   │               │                          ┌─── asArray()
                                   │               ├─── array ────────────────┤
                                   │               │                          └─── asArray(int arity)
                                   │               │
                                   │               │
TypeDescription.Generic.Builder ───┤               │                          ┌─── annotate(Annotation... annotation)
                                   │               └─── annotation ───────────┤
                                   │                                          └─── annotate(List<? extends Annotation> annotations)
                                   │
                                   │                                ┌─── build()
                                   │               ┌─── build ──────┤
                                   │               │                └─── build(Annotation... annotation)
                                   │               │
                                   │               │
                                   │               │                                ┌─── unboundWildcard()
                                   └─── generic ───┤                                │
                                                   │                ┌─── unbound ───┼─── unboundWildcard(Annotation... annotation)
                                                   │                │               │
                                                   │                │               └─── unboundWildcard(List<? extends Annotation> annotations)
                                                   │                │
                                                   └─── wildcard ───┤
                                                                    │               ┌─── asWildcardUpperBound()
                                                                    │               │
                                                                    │               ├─── asWildcardUpperBound(Annotation... annotation)
                                                                    └─── bounded ───┤
                                                                                    ├─── asWildcardLowerBound()
                                                                                    │
                                                                                    └─── asWildcardLowerBound(Annotation... annotation)
```

在上图当中，有 `builder` 和 `generic` 两个分支：

- `builder`：表示方法的返回值为 `TypeDescription.Generic.Builder` 类型
- `generic`：表示方法的返回值为 `TypeDescription.Generic` 类型

## 总结

```text
TypeDescription.Generic A_type = TypeDescription.Generic.Builder.typeVariable("A").build();

TypeDescription listType = TypeDescription.ForLoadedType.of(List.class);
TypeDescription.Generic wildcard = TypeDescription.Generic.Builder.unboundWildcard();
TypeDescription.Generic listOfWildcard = TypeDescription.Generic.Builder.parameterizedType(listType, wildcard).build();
```
