---
title:  "Interpreter"
sequence: "404"
---

## Interpreter

### class info

```java
public abstract class Interpreter<V extends Value> {
}
```

### fields

```java
public abstract class Interpreter<V extends Value> {
    protected final int api;
}
```

### constructors

```java
public abstract class Interpreter<V extends Value> {
    protected Interpreter(final int api) {
        this.api = api;
    }
}
```

### methods

#### newValue

```java
public abstract class Interpreter<V extends Value> {
    public abstract V newValue(Type type);

    public V newParameterValue(boolean isInstanceMethod, int local, Type type) {
        return newValue(type);
    }

    public V newReturnTypeValue(final Type type) {
        return newValue(type);
    }

    public V newEmptyValue(final int local) {
        return newValue(null);
    }

    public V newExceptionValue(
            final TryCatchBlockNode tryCatchBlockNode,
            final Frame<V> handlerFrame,
            final Type exceptionType) {
        return newValue(exceptionType);
    }
}
```

#### opcode

```java
public abstract class Interpreter<V extends Value> {
    public abstract V newOperation(AbstractInsnNode insn) throws AnalyzerException;

    public abstract V copyOperation(AbstractInsnNode insn, V value) throws AnalyzerException;

    public abstract V unaryOperation(AbstractInsnNode insn, V value) throws AnalyzerException;

    public abstract V binaryOperation(AbstractInsnNode insn, V value1, V value2) throws AnalyzerException;

    public abstract V ternaryOperation(AbstractInsnNode insn, V value1, V value2, V value3) throws AnalyzerException;

    public abstract V naryOperation(AbstractInsnNode insn, List<? extends V> values) throws AnalyzerException;

    public abstract void returnOperation(AbstractInsnNode insn, V value, V expected) throws AnalyzerException;
}
```

#### merge

```java
public abstract class Interpreter<V extends Value> {
    public abstract V merge(V value1, V value2);
}
```

