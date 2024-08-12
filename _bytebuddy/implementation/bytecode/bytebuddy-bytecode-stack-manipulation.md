---
title: "StackManipulation"
sequence: "102"
---

```text
                                          ┌─── Simple
StackManipulation ───┼─── AbstractBase ───┤
                                          └─── Compound
```

## StackManipulation

The `StackManipulation` describes a manipulation of a method's operand stack
that does not affect the frame's variable array.

```java
public interface StackManipulation {
    boolean isValid();

    Size apply(MethodVisitor methodVisitor, Implementation.Context implementationContext);
}
```

## StackManipulation.Size

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

## StackManipulation.AbstractBase

```java
public interface StackManipulation {
    abstract class AbstractBase implements StackManipulation {
        public boolean isValid() {
            return true;
        }
    }
}
```

## StackManipulation.Simple

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

## StackManipulation.Compound

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
                if (!stackManipulation.isValid()) {
                    return false;
                }
            }
            return true;
        }

        public Size apply(MethodVisitor methodVisitor, Implementation.Context implementationContext) {
            Size size = Size.ZERO;
            for (StackManipulation stackManipulation : stackManipulations) {
                size = size.aggregate(stackManipulation.apply(methodVisitor, implementationContext));
            }
            return size;
        }
    }
}
```

## 具体类

<table>
    <thead>
    <tr>
        <th style="text-align: center;">Basic</th>
        <th style="text-align: center;">二次包装</th>
        <th style="text-align: center;">Opcode</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td></td>
        <td>
            <code>DefaultValue</code>
        </td>
        <td>
            <code>MethodReturn</code>
            <code>NullConstant</code>
        </td>
    </tr>
    </tbody>
</table>
