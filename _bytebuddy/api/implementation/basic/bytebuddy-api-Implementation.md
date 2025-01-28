---
title: "Implementation概览"
sequence: "101"
---

## 概览

```text
Implementation --> ByteCodeAppender --> StackManipulation
```

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

## API 设计

### 三个组成部分

- `Implementation`：对某一个方法的进行实现（方法定义）
- `Implementation.Target`：提供类层面的信息（类层面）
- `Implementation.SpecialMethodInvocation`：a type-specific method invocation on the current instrumented type
  例如，调用 super method 或 default method（方法调用）

#### Implementation

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

#### Target

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

#### SpecialMethodInvocation

```java
public interface Implementation extends InstrumentedType.Prepareable {
    interface SpecialMethodInvocation extends StackManipulation {
        TypeDescription getTypeDescription();

        MethodDescription getMethodDescription();
        
        SpecialMethodInvocation withCheckedCompatibilityTo(MethodDescription.TypeToken token);
        
        JavaConstant.MethodHandle toMethodHandle();
    }
}
```

### 具体实现

#### Simple

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

#### Compound

```java
public interface Implementation extends InstrumentedType.Prepareable {
    class Compound implements Implementation {
        private final List<Implementation> implementations;
        
        public Compound(List<? extends Implementation> implementations) {
            this.implementations = new ArrayList<Implementation>();
            for (Implementation implementation : implementations) {
                if (implementation instanceof Compound.Composable) {
                    this.implementations.addAll(((Compound.Composable) implementation).implementations);
                    this.implementations.add(((Compound.Composable) implementation).composable);
                } else if (implementation instanceof Compound) {
                    this.implementations.addAll(((Compound) implementation).implementations);
                } else {
                    this.implementations.add(implementation);
                }
            }
        }
        
        public InstrumentedType prepare(InstrumentedType instrumentedType) {
            for (Implementation implementation : implementations) {
                instrumentedType = implementation.prepare(instrumentedType);
            }
            return instrumentedType;
        }
        
        public ByteCodeAppender appender(Target implementationTarget) {
            ByteCodeAppender[] byteCodeAppender = new ByteCodeAppender[implementations.size()];
            int index = 0;
            for (Implementation implementation : implementations) {
                byteCodeAppender[index++] = implementation.appender(implementationTarget);
            }
            return new ByteCodeAppender.Compound(byteCodeAppender);
        }
    }
}
```

### Composable

```java
public interface Implementation extends InstrumentedType.Prepareable {
    interface Composable extends Implementation {
        Implementation andThen(Implementation implementation);

        Composable andThen(Composable implementation);
    }
}
```

```text
                  ┌─── DefaultMethodCall
                  │
                  ├─── ExceptionMethod
                  │
                  ├─── FieldAccessor
                  │
                  ├─── FixedValue
                  │
                  │                         ┌─── EqualsMethod
Implementation ───┤                         │
                  ├─── obj ─────────────────┼─── HashCodeMethod
                  │                         │
                  │                         └─── ToStringMethod
                  │
                  │                         ┌─── InvokeDynamic
                  │                         │
                  │                         ├─── MethodCall ─────────┼─── FieldSetting
                  │                         │
                  └─── Composable ──────────┼─── MethodDelegation
                                            │
                                            ├─── StubMethod
                                            │
                                            └─── SuperMethodCall
```

```text
                                 ┌─── HashCodeMethod
                                 │
                  ┌─── obj ──────┼─── EqualsMethod
                  │              │
                  │              └─── ToStringMethod
                  │
                  ├─── fixed ────┼─── FixedValue
                  │
                  ├─── field ────┼─── FieldAccessor
                  │
                  │              ┌─── MethodCall        (composable)
Implementation ───┤              │
                  │              ├─── SuperMethodCall   (composable)
                  │              │
                  ├─── method ───┼─── DefaultMethodCall
                  │              │
                  │              ├─── MethodDelegation  (composable)
                  │              │
                  │              └─── InvokeDynamic     (composable)
                  │
                  │              ┌─── StubMethod        (composable)
                  └─── exit ─────┤
                                 └─── ExceptionMethod
```

## 示例

### 打印

预期目标：

```java
public class HelloWorld {
    public void test() {
        System.out.println("Hello Test");
    }
}
```

编码实现：

```java
import net.bytebuddy.ByteBuddy;
import net.bytebuddy.description.modifier.Visibility;
import net.bytebuddy.dynamic.DynamicType;
import sample.MyImplementation;

public class HelloWorldSubClass {
    public static void main(String[] args) {
        // 1. prepare
        String className = "sample.HelloWorld";


        // 2. weave
        ByteBuddy byteBuddy = new ByteBuddy();
        DynamicType.Builder<?> builder = byteBuddy.subclass(Object.class)
                .modifiers(Visibility.PUBLIC)
                .name(className);

        builder = builder.defineMethod("test", void.class, Visibility.PUBLIC)
                .intercept(MyImplementation.of("Hello Test"));

        // 3. output
        DynamicType.Unloaded<?> unloadedType = builder.make();
        OutputUtils.save(unloadedType, true);
    }
}
```

```java
import net.bytebuddy.dynamic.scaffold.InstrumentedType;
import net.bytebuddy.implementation.Implementation;
import net.bytebuddy.implementation.StubMethod;
import net.bytebuddy.implementation.bytecode.ByteCodeAppender;

public class MyImplementation implements Implementation {

    private final String str;

    private MyImplementation(String str) {
        this.str = str;
    }

    @Override
    public InstrumentedType prepare(InstrumentedType instrumentedType) {
        return instrumentedType;
    }

    @Override
    public ByteCodeAppender appender(Target implementationTarget) {
        return new ByteCodeAppender.Compound(
                MyByteCodeAppender.of(str),
                StubMethod.INSTANCE
        );
    }

    public static MyImplementation of(String str) {
        return new MyImplementation(str);
    }
}
```

```java
import net.bytebuddy.description.method.MethodDescription;
import net.bytebuddy.implementation.Implementation;
import net.bytebuddy.implementation.bytecode.ByteCodeAppender;
import org.objectweb.asm.MethodVisitor;
import org.objectweb.asm.Opcodes;

public class MyByteCodeAppender implements ByteCodeAppender {
    private final String str;

    private MyByteCodeAppender(String str) {
        this.str = str;
    }

    @Override
    public Size apply(MethodVisitor methodVisitor,
                      Implementation.Context implementationContext,
                      MethodDescription instrumentedMethod) {
        methodVisitor.visitFieldInsn(Opcodes.GETSTATIC, "java/lang/System", "out", "Ljava/io/PrintStream;");
        methodVisitor.visitLdcInsn(str);
        methodVisitor.visitMethodInsn(Opcodes.INVOKEVIRTUAL, "java/io/PrintStream", "println", "(Ljava/lang/String;)V", false);
        return new Size(2, instrumentedMethod.getStackSize());
    }

    public static MyByteCodeAppender of(String str) {
        return new MyByteCodeAppender(str);
    }
}
```


