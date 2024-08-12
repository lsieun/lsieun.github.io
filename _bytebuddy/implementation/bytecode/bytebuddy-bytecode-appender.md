---
title: "ByteCodeAppender"
sequence: "101"
---

```text
                    ┌─── Simple
ByteCodeAppender ───┤
                    └─── Compound
```

## ByteCodeAppender

The `ByteCodeAppender` generates the byte code for a given method.
This is done by writing the byte code instructions to the given ASM MethodVisitor.

The `ByteCodeAppender` is **not allowed** to write annotations to the method or
call the `MethodVisitor.visitCode()`, `MethodVisitor.visitMaxs(int, int)` or `MethodVisitor.visitEnd()` methods
which is both done by the entity delegating the call to the `ByteCodeAppender`.
This is done in order to allow for the concatenation of several byte code appenders and
therefore a more modular description of method implementations.

```java
public interface ByteCodeAppender {
    Size apply(MethodVisitor methodVisitor,
               Implementation.Context implementationContext,
               MethodDescription instrumentedMethod);
}
```

## ByteCodeAppender.Size

```java
public interface ByteCodeAppender {
    class Size {
        private final int operandStackSize;
        private final int localVariableSize;

        public Size(int operandStackSize, int localVariableSize) {
            this.operandStackSize = operandStackSize;
            this.localVariableSize = localVariableSize;
        }

        public int getOperandStackSize() {
            return operandStackSize;
        }

        public int getLocalVariableSize() {
            return localVariableSize;
        }

        public Size merge(Size other) {
            return new Size(Math.max(operandStackSize, other.operandStackSize), Math.max(localVariableSize, other.localVariableSize));
        }
    }
}
```

## ByteCodeAppender.Simple

```java
public interface ByteCodeAppender {
    class Simple implements ByteCodeAppender {
        private final StackManipulation stackManipulation;

        public Simple(StackManipulation... stackManipulation) {
            this(Arrays.asList(stackManipulation));
        }

        public Simple(List<? extends StackManipulation> stackManipulations) {
            this.stackManipulation = new StackManipulation.Compound(stackManipulations);
        }

        public Size apply(MethodVisitor methodVisitor,
                          Implementation.Context implementationContext,
                          MethodDescription instrumentedMethod) {
            return new Size(stackManipulation.apply(methodVisitor, implementationContext).getMaximalSize(), instrumentedMethod.getStackSize());
        }
    }
}
```

## ByteCodeAppender.Compound

```java
public interface ByteCodeAppender {
    class Compound implements ByteCodeAppender {
        private final List<ByteCodeAppender> byteCodeAppenders;

        public Compound(ByteCodeAppender... byteCodeAppender) {
            this(Arrays.asList(byteCodeAppender));
        }

        public Compound(List<? extends ByteCodeAppender> byteCodeAppenders) {
            this.byteCodeAppenders = new ArrayList<ByteCodeAppender>();
            for (ByteCodeAppender byteCodeAppender : byteCodeAppenders) {
                if (byteCodeAppender instanceof Compound) {
                    this.byteCodeAppenders.addAll(((Compound) byteCodeAppender).byteCodeAppenders);
                } else {
                    this.byteCodeAppenders.add(byteCodeAppender);
                }
            }
        }

        public Size apply(MethodVisitor methodVisitor,
                          Implementation.Context implementationContext,
                          MethodDescription instrumentedMethod) {
            Size size = new Size(0, instrumentedMethod.getStackSize());
            for (ByteCodeAppender byteCodeAppender : byteCodeAppenders) {
                size = size.merge(byteCodeAppender.apply(methodVisitor, implementationContext, instrumentedMethod));
            }
            return size;
        }
    }
}
```

