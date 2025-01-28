---
title: "方法参数：值可读可写和类型可转换"
sequence: "104"
---

## 介绍

### 两个属性

在 `@Advice.Xxx` 注解中，有 `readOnly()` 和 `typing()` 属性

```java
public class Advice implements AsmVisitorWrapper.ForDeclaredMethods.MethodVisitorWrapper, Implementation {
    public @interface FieldValue {
        String value() default OffsetMapping.ForField.Unresolved.BEAN_PROPERTY;
        Class<?> declaringType() default void.class;

        boolean readOnly() default true;                            // <-- readOnly
        Assigner.Typing typing() default Assigner.Typing.STATIC;    // <-- typing
    }

    public @interface Return {
        boolean readOnly() default true;                            // <-- readOnly
        Assigner.Typing typing() default Assigner.Typing.STATIC;    // <-- typing
    }
}
```

```text
                                                               ┌─── clazz ────┼─── @This
                                                               │
                                                               ├─── field ────┼─── @FieldValue
                                                               │
                                           ┌─── support ───────┤                            ┌─── @Argument
                                           │                   │              ┌─── arg ─────┤
                                           │                   │              │             └─── @AllArguments
                                           │                   │              │
                                           │                   │              │             ┌─── @Enter
                                           │                   └─── method ───┼─── local ───┤
                                           │                                  │             └─── @Exit
                                           │                                  │
                                           │                                  │             ┌─── @Return
advice::annotation::writable.and.typing ───┤                                  └─── exit ────┤
                                           │                                                └─── @Thrown
                                           │
                                           │                   ┌─── clazz ────┼─── @Origin
                                           │                   │
                                           │                   │              ┌─── @FieldGetterHandle
                                           │                   ├─── field ────┤
                                           │                   │              └─── @FieldSetterHandle
                                           │                   │
                                           └─── not-support ───┤              ┌─── local ────┼─── @Local
                                                               │              │
                                                               ├─── method ───┼─── invoke ───┼─── @SelfCallHandle
                                                               │              │
                                                               │              └─── return ───┼─── @StubValue
                                                               │
                                                               └─── unused ───┼─── @Unused
```

## 类型转换

```text
            ┌─── DEFAULT ──────────┼─── VoidAwareAssigner ───┼─── PrimitiveTypeAwareAssigner ───┼─── ReferenceTypeAwareAssigner.INSTANCE
Assigner ───┤
            └─── GENERICS_AWARE ───┼─── VoidAwareAssigner ───┼─── PrimitiveTypeAwareAssigner ───┼─── GenericTypeAwareAssigner.INSTANCE
```

```text
              ┌─── none ────┼─── void
              │
              │                               ┌─── int
java::type ───┤             ┌─── primitive ───┤
              │             │                 └─── long
              │             │
              └─── exist ───┤                                   ┌─── Integer
                            │                 ┌─── boxed ───────┤
                            │                 │                 └─── Long
                            └─── reference ───┤
                                              │                 ┌─── Object
                                              └─── non-boxed ───┤
                                                                └─── String
```
