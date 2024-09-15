---
title: "TypeDescription.Generic"
sequence: "104"
---

## 概览

## API 设计

### Generic

A non-generic `TypeDescription` is considered to be a specialization of a `TypeDescription.Generic` type.

```text
                                                                ┌─── unbounded ───┼─── <T>
               ┌─── Generic Type ─────────┼─── Type Variable ───┤
               │                                                │                 ┌─── upper ───┼─── <T extends TypeName>
               │                                                └─── bounded ─────┤
Generic ───────┤                                                                  └─── lower ───┼─── <T super Class> (not supported)
               │
               │                                                ┌─── concrete ───┼─── <String>
               └─── Parameterized Type ───┼─── Type Argument ───┤
                                                                │                ┌─── unbounded ───┼─── <?>
                                                                └─── wildcard ───┤
                                                                                 │                 ┌─── upper ───┼─── <? extends TypeName>
                                                                                 └─── bounded ─────┤
                                                                                                   └─── lower ───┼─── <? super Class>
```

```java
public interface TypeDescription extends TypeDefinition, ByteCodeElement, TypeVariableSource {
    interface Generic extends TypeDefinition, AnnotationSource {
        @AlwaysNull
        Generic UNDEFINED = null;
    }
}
```

```text
                                             ┌─── field ────┼─── getDeclaredFields()
                           ┌─── classfile ───┤
                           │                 └─── method ───┼─── getDeclaredMethods()
                           │
                           │                                 ┌─── raw ──────────────────┼─── asRawType()
                           │                                 │
                           │                                 │                                                ┌─── container ───┼─── getTypeVariableSource()
                           │                                 │                                                │
                           │                                 ├─── generic.type ─────────┼─── type.variable ───┼─── text ────────┼─── getSymbol()
                           │                 ┌─── generic ───┤                                                │
                           │                 │               │                                                └─── bound ───────┼─── getUpperBounds()
                           │                 │               │
                           │                 │               │                                                ┌─── all ──────────────┼─── getTypeArguments()
TypeDescription.Generic ───┤                 │               │                                                │
                           │                 │               └─── parameterized.type ───┼─── type.argument ───┼─── binding ──────────┼─── findBindingOf()
                           │                 │                                                                │
                           ├─── type ────────┤                                                                │                      ┌─── getUpperBounds()
                           │                 │                                                                └─── wildcard.bound ───┤
                           │                 │                                                                                       └─── getLowerBounds()
                           │                 │
                           │                 ├─── array ─────┼─── getComponentType()
                           │                 │
                           │                 ├─── record ────┼─── getRecordComponents()
                           │                 │
                           │                 └─── nested ────┼─── getOwnerType()
                           │
                           └─── visitor ─────┼─── accept()
```



### Builder

```text
                                                                                                      ┌─── rawType(Class<?> type)
                                                                                                      │
                                                                                                      ├─── rawType(TypeDescription type)
                                                                           ┌─── raw.type ─────────────┤
                                                                           │                          ├─── rawType(Class<?> type, Generic ownerType)
                                                                           │                          │
                                                                           │                          └─── rawType(TypeDescription type, Generic ownerType)
                                                                           │
                                                                           │                          ┌─── of(java.lang.reflect.Type type)
                                                           ┌─── builder ───┼─── generic.type ─────────┤
                                                           │               │                          └─── of(TypeDescription.Generic typeDescription)
                                                           │               │
                                                           │               │                          ┌─── parameterizedType(Class<?> rawType, Type... parameter)
                                                           │               ├─── parameterized.type ───┤
                                   ┌─── getting.started ───┤               │                          └─── parameterizedType(TypeDescription rawType, TypeDefinition... parameter)
                                   │                       │               │
                                   │                       │               └─── type.variable ────────┼─── typeVariable(String symbol)
                                   │                       │
                                   │                       │                                     ┌─── unboundWildcard()
                                   │                       │                                     │
                                   │                       └─── generic ───┼─── type.argument ───┼─── unboundWildcard(Annotation... annotation)
                                   │                                                             │
                                   │                                                             └─── unboundWildcard(AnnotationDescription... annotation)
                                   │
                                   │                                          ┌─── asArray()
                                   │                       ┌─── array ────────┤
                                   │                       │                  └─── asArray(int arity)
TypeDescription.Generic.Builder ───┼─── builder ───────────┤
                                   │                       │                  ┌─── annotate(Annotation... annotation)
                                   │                       └─── annotation ───┤
                                   │                                          └─── annotate(AnnotationDescription... annotation)
                                   │
                                   │                                                      ┌─── asWildcardUpperBound()
                                   │                                                      │
                                   │                                        ┌─── upper ───┼─── asWildcardUpperBound(Annotation... annotation)
                                   │                                        │             │
                                   │                                        │             └─── asWildcardUpperBound(AnnotationDescription... annotation)
                                   │                       ┌─── wildcard ───┤
                                   │                       │                │             ┌─── asWildcardLowerBound()
                                   │                       │                │             │
                                   │                       │                └─── lower ───┼─── asWildcardLowerBound(Annotation... annotation)
                                   └─── generic ───────────┤                              │
                                                           │                              └─── asWildcardLowerBound(AnnotationDescription... annotation)
                                                           │
                                                           │                ┌─── build()
                                                           │                │
                                                           └─── build ──────┼─── build(Annotation... annotation)
                                                                            │
                                                                            └─── build(AnnotationDescription... annotation)
```

## 获取对象

```text
TypeDescription.Generic.OfNonGenericType.ForLoadedType.of(Object.class)
```
