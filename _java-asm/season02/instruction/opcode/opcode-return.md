---
title: "opcode: return (6/6/205)"
sequence: "201"
---

[上级目录]({% link _posts/2021-06-01-java-asm-index.md %})

## 概览

从 Instruction 的角度来说，与 return 相关的 opcode 有 6 个，内容如下：

| opcode | mnemonic symbol | opcode | mnemonic symbol | opcode | mnemonic symbol |
|--------|-----------------|--------|-----------------|--------|-----------------|
| 172    | ireturn         | 174    | freturn         | 176    | areturn         |
| 173    | lreturn         | 175    | dreturn         | 177    | return          |

从 ASM 的角度来说，这些 opcode 是通过 `MethodVisitor.visitInsn(int opcode)` 方法来调用的。


## return void type

从 Java 语言的视角，有一个 `HelloWorld` 类，代码如下：

```java
public class HelloWorld {
    public void test() {
        // do nothing
    }
}
```

从 Instruction 的视角来看，方法体对应的内容如下：

```text
$ javap -c sample.HelloWorld
Compiled from "HelloWorld.java"
public class sample.HelloWorld {
...
  public void test();
    Code:
       0: return
}
```

从 ASM 的视角来看，方法体对应的内容如下：

```text
methodVisitor.visitCode();
methodVisitor.visitInsn(RETURN);
methodVisitor.visitMaxs(0, 1);
methodVisitor.visitEnd();
```

从 Frame 的视角来看，local variable 和 operand stack 的变化：

```text
                               // {this} | {}
0000: return                   // {} | {}
```

从 JVM 规范的角度来看，Operand Stack 的变化如下：

```text
... →

[empty]
```

The current method must have return type `void`.
- If no exception is thrown, **any values on the operand stack of the current frame are discarded.**
- The interpreter then returns control to the invoker of the method, reinstating the frame of the invoker.

## return primitive type

### ireturn

从 Java 语言的视角，有一个 `HelloWorld` 类，代码如下：

```java
public class HelloWorld {
    public int test() {
        return 0;
    }
}
```

从 Instruction 的视角来看，方法体对应的内容如下：

```text
$ javap -c sample.HelloWorld
Compiled from "HelloWorld.java"
public class sample.HelloWorld {
...
  public int test();
    Code:
       0: iconst_0
       1: ireturn
}
```

从 ASM 的视角来看，方法体对应的内容如下：

```text
methodVisitor.visitCode();
methodVisitor.visitInsn(ICONST_0);
methodVisitor.visitInsn(IRETURN);
methodVisitor.visitMaxs(1, 1);
methodVisitor.visitEnd();
```

从 Frame 的视角来看，local variable 和 operand stack 的变化：

```text
                               // {this} | {}
0000: iconst_0                 // {this} | {int}
0001: ireturn                  // {} | {}
```

从 JVM 规范的角度来看，Operand Stack 的变化如下：

```text
..., value →

[empty]
```

- The current method must have return type `boolean`, `byte`, `short`, `char`, or `int`. The `value` must be of type `int`.
- If no exception is thrown, `value` is popped from the operand stack of the current frame and pushed onto the operand stack of the frame of the invoker.
- Any other values on the operand stack of the current method are discarded.
- The interpreter then returns control to the invoker of the method, reinstating the frame of the invoker.


### freturn

从 Java 语言的视角，有一个 `HelloWorld` 类，代码如下：

```java
public class HelloWorld {
    public float test() {
        return 0;
    }
}
```

从 Instruction 的视角来看，方法体对应的内容如下：

```text
$ javap -c sample.HelloWorld
Compiled from "HelloWorld.java"
public class sample.HelloWorld {
...
  public float test();
    Code:
       0: fconst_0
       1: freturn
}
```

从 ASM 的视角来看，方法体对应的内容如下：

```text
methodVisitor.visitCode();
methodVisitor.visitInsn(FCONST_0);
methodVisitor.visitInsn(FRETURN);
methodVisitor.visitMaxs(1, 1);
methodVisitor.visitEnd();
```

从 Frame 的视角来看，local variable 和 operand stack 的变化：

```text
                               // {this} | {}
0000: fconst_0                 // {this} | {float}
0001: freturn                  // {} | {}
```

从 JVM 规范的角度来看，Operand Stack 的变化如下：

```text
..., value →

[empty]
```

- The current method must have return type `float`. The `value` must be of type `float`.
- If no exception is thrown, `value` is popped from the operand stack of the current frame. The value is pushed onto the operand stack of the frame of the invoker.
- Any other values on the operand stack of the current method are discarded.
- The interpreter then returns control to the invoker of the method, reinstating the frame of the invoker.

### lreturn

这里需要注意的就是 `long` 类型在 local variable 和 operand stack 当中占用 2 个 slot 的位置。

从 Java 语言的视角，有一个 `HelloWorld` 类，代码如下：

```java
public class HelloWorld {
    public long test() {
        return 0;
    }
}
```

从 Instruction 的视角来看，方法体对应的内容如下：

```text
$ javap -c sample.HelloWorld
Compiled from "HelloWorld.java"
public class sample.HelloWorld {
...
  public long test();
    Code:
       0: lconst_0
       1: lreturn
}
```

从 ASM 的视角来看，方法体对应的内容如下：

```text
methodVisitor.visitCode();
methodVisitor.visitInsn(LCONST_0);
methodVisitor.visitInsn(LRETURN);
methodVisitor.visitMaxs(2, 1);
methodVisitor.visitEnd();
```

从 Frame 的视角来看，local variable 和 operand stack 的变化：

```text
                               // {this} | {}
0000: lconst_0                 // {this} | {long, top}
0001: lreturn                  // {} | {}
```

从 JVM 规范的角度来看，Operand Stack 的变化如下：

```text
..., value →

[empty]
```

- The current method must have return type `long`. The `value` must be of type `long`. 
- If no exception is thrown, `value` is popped from the operand stack of the current frame and pushed onto the operand stack of the frame of the invoker.
- Any other values on the operand stack of the current method are discarded.
- The interpreter then returns control to the invoker of the method, reinstating the frame of the invoker.

### dreturn

从 Java 语言的视角，有一个 `HelloWorld` 类，代码如下：

```java
public class HelloWorld {
    public double test() {
        return 0;
    }
}
```

从 Instruction 的视角来看，方法体对应的内容如下：

```text
$ javap -c sample.HelloWorld
Compiled from "HelloWorld.java"
public class sample.HelloWorld {
...
  public double test();
    Code:
       0: dconst_0
       1: dreturn
}
```

从 ASM 的视角来看，方法体对应的内容如下：

```text
methodVisitor.visitCode();
methodVisitor.visitInsn(DCONST_0);
methodVisitor.visitInsn(DRETURN);
methodVisitor.visitMaxs(2, 1);
methodVisitor.visitEnd();
```

从 Frame 的视角来看，local variable 和 operand stack 的变化：

```text
                               // {this} | {}
0000: dconst_0                 // {this} | {double, top}
0001: dreturn                  // {} | {}
```

从 JVM 规范的角度来看，Operand Stack 的变化如下：

```text
..., value →

[empty]
```

- The current method must have return type `double`. The `value` must be of type `double`.
- If no exception is thrown, `value` is popped from the operand stack of the current frame. The `value` is pushed onto the operand stack of the frame of the invoker.
- Any other values on the operand stack of the current method are discarded.
- The interpreter then returns control to the invoker of the method, reinstating the frame of the invoker.

## return reference type

从 Java 语言的视角，有一个 `HelloWorld` 类，代码如下：

```java
public class HelloWorld {
    public Object test() {
        return null;
    }
}
```

从 Instruction 的视角来看，方法体对应的内容如下：

```text
$ javap -c sample.HelloWorld
Compiled from "HelloWorld.java"
public class sample.HelloWorld {
...
  public java.lang.Object test();
    Code:
       0: aconst_null
       1: areturn
}
```

从 ASM 的视角来看，方法体对应的内容如下：

```text
methodVisitor.visitCode();
methodVisitor.visitInsn(ACONST_NULL);
methodVisitor.visitInsn(ARETURN);
methodVisitor.visitMaxs(1, 1);
methodVisitor.visitEnd();
```

从 Frame 的视角来看，local variable 和 operand stack 的变化：

```text
                               // {this} | {}
0000: aconst_null              // {this} | {null}
0001: areturn                  // {} | {}
```

从 JVM 规范的角度来看，Operand Stack 的变化如下：

```text
..., objectref →

[empty]
```

- The `objectref` must be of type `reference` and must refer to an object of a type that is assignment compatible with the type represented by the return descriptor of the current method.
- If no exception is thrown, `objectref` is popped from the operand stack of the current frame and pushed onto the operand stack of the frame of the invoker.
- Any other values on the operand stack of the current method are discarded.
- The interpreter then reinstates the frame of the invoker and returns control to the invoker.
