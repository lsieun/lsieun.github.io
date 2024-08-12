---
title: "Implementation概览"
sequence: "101"
---

## 介绍

- `Implementation` 代表整个方法体（method body）
- `ByteCodeAppender` 代表多条指令（Instruction）
- `StackManipulation` 代表一条指令（Instruction）

### 做什么

`Implementation` 是对『方法体』（method body）的实现。

```text
Implementation --> ByteCodeAppender
```

### 怎么做

两个阶段：

- The implementation is able to prepare an instrumented type by adding fields and/or helper methods
  that are required for the methods implemented by this implementation.
  Furthermore, `LoadedTypeInitializers` and byte code for the type initializer
  can be registered for the instrumented type.
- Any implementation is required to supply a byte code appender
  that is responsible for providing the byte code to the instrumented methods
  that were delegated to this implementation.
  This byte code appender is also be responsible for providing implementations for the methods added in step 1.



## 在哪里使用

```java
public interface DynamicType extends ClassFileLocator {
    interface Builder<T> {
        MethodDefinition.ImplementationDefinition<T> method(ElementMatcher<? super MethodDescription> matcher);

        interface MethodDefinition<S> extends Builder<S> {
            interface ImplementationDefinition<U> {
                MethodDefinition.ReceiverTypeDefinition<U> intercept(Implementation implementation);

                MethodDefinition.ReceiverTypeDefinition<U> withoutCode();
            }
        }
    }
}
```

## Implementation

```java
public interface Implementation extends InstrumentedType.Prepareable {
    ByteCodeAppender appender(Target implementationTarget);
}
```

```java
public interface InstrumentedType extends TypeDescription {
    interface Prepareable {
        InstrumentedType prepare(InstrumentedType instrumentedType);
    }
}
```

## Implementation.Composable

```java
public interface Implementation extends InstrumentedType.Prepareable {
    interface Composable extends Implementation {
        Implementation andThen(Implementation implementation);

        Composable andThen(Composable implementation);
    }
}
```

## Implementation.Target

```java
public interface Implementation extends InstrumentedType.Prepareable {
    interface Target {
        TypeDescription getInstrumentedType();
        TypeDefinition getOriginType();

        SpecialMethodInvocation invokeSuper(MethodDescription.SignatureToken token);
        SpecialMethodInvocation invokeDefault(MethodDescription.SignatureToken token);
        SpecialMethodInvocation invokeDefault(MethodDescription.SignatureToken token, TypeDescription targetType);
        SpecialMethodInvocation invokeDominant(MethodDescription.SignatureToken token);
    }
}
```

## Implementation.Simple

```java
public interface Implementation extends InstrumentedType.Prepareable {
    class Simple implements Implementation {
        private final ByteCodeAppender byteCodeAppender;

        public Simple(ByteCodeAppender... byteCodeAppender) {
            this.byteCodeAppender = new ByteCodeAppender.Compound(byteCodeAppender);
        }

        public Simple(StackManipulation... stackManipulation) {
            byteCodeAppender = new ByteCodeAppender.Simple(stackManipulation);
        }

        public InstrumentedType prepare(InstrumentedType instrumentedType) {
            return instrumentedType;
        }

        public ByteCodeAppender appender(Target implementationTarget) {
            return byteCodeAppender;
        }
    }
}
```
