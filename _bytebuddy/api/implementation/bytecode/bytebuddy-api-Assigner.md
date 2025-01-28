---
title: "Assigner"
sequence: "assign-Assigner"
---

## 概览

### 作用

`Assigner` 作用：将一个类型（`source`）转换成另外一个类型（`target`）。

```java
public interface Assigner {
    StackManipulation assign(TypeDescription.Generic source, TypeDescription.Generic target, Typing typing);
}
```

### 子类

```text
                            ┌─── VoidAwareAssigner
                            │
                            ├─── PrimitiveTypeAwareAssigner
            ┌─── common ────┤
            │               ├─── ReferenceTypeAwareAssigner
            │               │
            │               └─── GenericTypeAwareAssigner
Assigner ───┤
            │               ┌─── Assigner.Refusing ─────────┼─── INSTANCE
            │               │
            │               │                               ┌─── GENERIC
            └─── special ───┼─── Assigner.EqualTypesOnly ───┤
                            │                               └─── ERASURE
                            │
                            └─── ToStringAssigner ──────────┼─── INSTANCE
```

### 统驭

```text
            ┌─── DEFAULT ──────────┼─── VoidAwareAssigner ───┼─── PrimitiveTypeAwareAssigner ───┼─── ReferenceTypeAwareAssigner.INSTANCE
Assigner ───┤
            └─── GENERICS_AWARE ───┼─── VoidAwareAssigner ───┼─── PrimitiveTypeAwareAssigner ───┼─── GenericTypeAwareAssigner.INSTANCE
```

## 具体实现

### VoidAwareAssigner

```text
┌───────────────────┬──────────┬──────────┬────────────────────────────────────┐
│                   │   from   │    to    │         StackManipulation          │
├───────────────────┼──────────┼──────────┼────────────────────────────────────┤
│ VoidAwareAssigner │   void   │   void   │ StackManipulation.Trivial.INSTANCE │
├───────────────────┼──────────┼──────────┼────────────────────────────────────┤
│ VoidAwareAssigner │   void   │ non-void │      DefaultValue.of(target)       │
├───────────────────┼──────────┼──────────┼────────────────────────────────────┤
│ VoidAwareAssigner │ non-void │   void   │         Removal.of(source)         │
├───────────────────┼──────────┼──────────┼────────────────────────────────────┤
│ VoidAwareAssigner │ non-void │ non-void │          chained.assign()          │
└───────────────────┴──────────┴──────────┴────────────────────────────────────┘
```

### PrimitiveTypeAwareAssigner

```text
┌────────────────────────────┬───────────┬───────────┬───────────────────────────────────────┐
│                            │   from    │    to     │           StackManipulation           │
├────────────────────────────┼───────────┼───────────┼───────────────────────────────────────┤
│ PrimitiveTypeAwareAssigner │ primitive │ primitive │      source -> widenTo -> target      │
├────────────────────────────┼───────────┼───────────┼───────────────────────────────────────┤
│ PrimitiveTypeAwareAssigner │ primitive │ reference │  boxed -> referenceTypeAwareAssigner  │
├────────────────────────────┼───────────┼───────────┼───────────────────────────────────────┤
│ PrimitiveTypeAwareAssigner │ reference │ primitive │ unboxed -> referenceTypeAwareAssigner │
├────────────────────────────┼───────────┼───────────┼───────────────────────────────────────┤
│ PrimitiveTypeAwareAssigner │ reference │ reference │      referenceTypeAwareAssigner       │
└────────────────────────────┴───────────┴───────────┴───────────────────────────────────────┘
```

### ReferenceTypeAwareAssigner

```text
┌────────────────────────────┬──────────┬────────────┬────────────────────────────────────┐
│                            │   from   │     to     │         StackManipulation          │
├────────────────────────────┼──────────┼────────────┼────────────────────────────────────┤
│ ReferenceTypeAwareAssigner │ sub-type │ super-type │ StackManipulation.Trivial.INSTANCE │
├────────────────────────────┼──────────┼────────────┼────────────────────────────────────┤
│ ReferenceTypeAwareAssigner │  source  │   target   │       TypeCasting.to(target)       │
└────────────────────────────┴──────────┴────────────┴────────────────────────────────────┘
```

### GenericTypeAwareAssigner

```text
┌──────────────────────────┬──────────┬────────────┬────────────────────────────────────┐
│                          │   from   │     to     │         StackManipulation          │
├──────────────────────────┼──────────┼────────────┼────────────────────────────────────┤
│ GenericTypeAwareAssigner │ sub-type │ super-type │ StackManipulation.Trivial.INSTANCE │
├──────────────────────────┼──────────┼────────────┼────────────────────────────────────┤
│ GenericTypeAwareAssigner │  source  │   target   │       TypeCasting.to(target)       │
└──────────────────────────┴──────────┴────────────┴────────────────────────────────────┘
```

## Typing

```java
public interface Assigner {
    enum Typing {
        STATIC(false),
        DYNAMIC(true);

        private final boolean dynamic;

        Typing(boolean dynamic) {
            this.dynamic = dynamic;
        }

        public boolean isDynamic() {
            return dynamic;
        }
        
        public static Typing of(boolean dynamic) {
            return dynamic
                    ? DYNAMIC
                    : STATIC;
        }
    }
}
```
