---
title: "StackManipulation"
sequence: "103"
---

## 概览

- 知识要求：使用 `StackManipulation` 需要 Java 字节码的知识

### 是什么

在 Stack Frame 当中，有 operand stack 和 local variable 两个部分组成。

`ByteCodeAppender` 考虑 operand stack 和 local variable 两个部分的变化；
而 `StackManipulation` 进一步缩小的范围，只考虑 operand stack 的变化。

### ByteBuddy 视野

更大范围，形成整体

![](/assets/images/bytebuddy/implementation/bytebuddy-implementation-overview.png)

Within Byte Buddy, any stack instruction is contained by an implementation of the `StackManipulation` interface.

### ByteCodeAppender 对比

```text
                                                               ┌─── MethodVisitor
                                                               │
                                                ┌─── param ────┼─── Implementation.Context
                                                │              │
      ┌─── ByteCodeAppender ────┼─── apply() ───┤              └─── MethodDescription (多一个参数)
      │                                         │
      │                                         │                                            ┌─── operandStackSize  (operand stack)
      │                                         └─── return ───┼─── ByteCodeAppender.Size ───┤
      │                                                                                      └─── localVariableSize (local variable)
VS ───┤
      │                                                          ┌─── MethodVisitor
      │                                           ┌─── param ────┤
      │                                           │              └─── Implementation.Context
      │                         ┌─── apply() ─────┤
      │                         │                 │                                             ┌─── sizeImpact   (operand stack)
      └─── StackManipulation ───┤                 └─── return ───┼─── StackManipulation.Size ───┤
                                │                                                               └─── maximalSize  (operand stack)
                                │
                                └─── isValid() ───┼─── return ───┼─── boolean (多一个方法)
```

## API 设计

### 两个组成部分

#### StackManipulation

The `StackManipulation` describes **a manipulation of a method's operand stack**
that does not affect **the frame's variable array**.

```text
StackManipulation 只影响 operand stack，不影响 local variable
```

```java
package net.bytebuddy.implementation.bytecode;

public interface StackManipulation {
    boolean isValid();

    Size apply(MethodVisitor methodVisitor, Implementation.Context implementationContext);
}
```

#### Size

```java
public interface StackManipulation {
    class Size {
        private final int sizeImpact;
        private final int maximalSize;

        public Size(int sizeImpact, int maximalSize) {
            this.sizeImpact = sizeImpact;
            this.maximalSize = maximalSize;
        }

        public int getSizeImpact() {
            return sizeImpact;
        }

        public int getMaximalSize() {
            return maximalSize;
        }

        public Size aggregate(Size other) {
            return aggregate(other.sizeImpact, other.maximalSize);
        }

        private Size aggregate(int sizeChange, int interimMaximalSize) {
            return new Size(sizeImpact + sizeChange, Math.max(maximalSize, sizeImpact + interimMaximalSize));
        }
    }
}
```

### 具体实现

```text
                     ┌─── AbstractBase ───┼─── Simple
StackManipulation ───┤
                     └─── Compound
```

#### AbstractBase

```java
public interface StackManipulation {
    abstract class AbstractBase implements StackManipulation {
        public boolean isValid() {
            return true;
        }
    }
}
```

#### Simple

```java
public interface StackManipulation {
    class Simple extends StackManipulation.AbstractBase {
        private final Dispatcher dispatcher;

        public Simple(Dispatcher dispatcher) {
            this.dispatcher = dispatcher;
        }

        public Size apply(MethodVisitor methodVisitor, Implementation.Context implementationContext) {
            return dispatcher.apply(methodVisitor, implementationContext);
        }

        public interface Dispatcher {
            Size apply(MethodVisitor methodVisitor, Implementation.Context implementationContext);
        }
    }
}
```

#### Compound

```java
public interface StackManipulation {
    class Compound implements StackManipulation {
        private final List<StackManipulation> stackManipulations;

        public Compound(StackManipulation... stackManipulation) {
            this(Arrays.asList(stackManipulation));
        }

        public Compound(List<? extends StackManipulation> stackManipulations) {
            this.stackManipulations = new ArrayList<StackManipulation>();
            for (StackManipulation stackManipulation : stackManipulations) {
                if (stackManipulation instanceof Compound) {
                    this.stackManipulations.addAll(((Compound) stackManipulation).stackManipulations);
                } else if (!(stackManipulation instanceof Trivial)) {
                    this.stackManipulations.add(stackManipulation);
                }
            }
        }

        public boolean isValid() {
            for (StackManipulation stackManipulation : stackManipulations) {
                // 如果任意一个无效，那么就返回 false
                if (!stackManipulation.isValid()) {
                    return false;
                }
            }
            return true;
        }

        public Size apply(MethodVisitor methodVisitor, Implementation.Context implementationContext) {
            Size size = Size.ZERO;
            // 遍历，将结果记录到 size 中
            for (StackManipulation stackManipulation : stackManipulations) {
                size = size.aggregate(
                        stackManipulation.apply(methodVisitor, implementationContext)
                );
            }
            return size;
        }
    }
}
```

### 特殊实现

#### Illegal

```java
public interface StackManipulation {
    enum Illegal implements StackManipulation {
        INSTANCE;

        public boolean isValid() {
            return false;
        }

        public Size apply(MethodVisitor methodVisitor, Implementation.Context implementationContext) {
            throw new IllegalStateException("An illegal stack manipulation must not be applied");
        }
    }
}
```

#### Trivial

```java
public interface StackManipulation {
    enum Trivial implements StackManipulation {

        INSTANCE;

        public boolean isValid() {
            return true;
        }

        public Size apply(MethodVisitor methodVisitor, Implementation.Context implementationContext) {
            return StackSize.ZERO.toIncreasingSize();
        }
    }
}
```
