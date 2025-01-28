---
title: "opcode: object (3/131/205)"
sequence: "205"
---

[上级目录]({% link _posts/2021-06-01-java-asm-index.md %})

## 概览

从 Instruction 的角度来说，与 type 相关的 opcode 有 3 个，内容如下：

| opcode | mnemonic symbol | opcode | mnemonic symbol | opcode | mnemonic symbol |
|--------|-----------------|--------|-----------------|--------|-----------------|
| 187    | new             | 192    | checkcast       | 193    | instanceof      |

从 ASM 的角度来说，这些 opcode 与 `MethodVisitor.visitXxxInsn()` 方法对应关系如下：

- `MethodVisitor.visitTypeInsn()`: `new`, `checkcast`, `instanceof`

## Create Object

### create instance with no args

从 Java 语言的视角，有一个 `HelloWorld` 类，代码如下：

```java
public class HelloWorld {
    public void test() {
        Object obj = new Object();
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
       0: new           #2                  // class java/lang/Object
       3: dup
       4: invokespecial #1                  // Method java/lang/Object."<init>":()V
       7: astore_1
       8: return
}
```

从 ASM 的视角来看，方法体对应的内容如下：

```text
methodVisitor.visitCode();
methodVisitor.visitTypeInsn(NEW, "java/lang/Object");
methodVisitor.visitInsn(DUP);
methodVisitor.visitMethodInsn(INVOKESPECIAL, "java/lang/Object", "<init>", "()V", false);
methodVisitor.visitVarInsn(ASTORE, 1);
methodVisitor.visitInsn(RETURN);
methodVisitor.visitMaxs(2, 2);
methodVisitor.visitEnd();
```

从 Frame 的视角来看，local variable 和 operand stack 的变化：

```text
                               // {this} | {}
0000: new             #2       // {this} | {uninitialized_Object}
0003: dup                      // {this} | {uninitialized_Object, uninitialized_Object}
0004: invokespecial   #1       // {this} | {Object}
0007: astore_1                 // {this, Object} | {}
0008: return                   // {} | {}
```

从 JVM 规范的角度来看，`new` 指令对应的 Operand Stack 的变化如下：

```text
... →

..., objectref
```

Memory for a new instance of that class is allocated from the garbage-collected heap, and the instance variables of the new object are initialized to their default initial values. The `objectref`, a reference to the instance, is pushed onto the operand stack.

从 JVM 规范的角度来看，`dup` 指令对应的 Operand Stack 的变化如下：

```text
..., value →

..., value, value
```

Duplicate the top `value` on the operand stack and push the duplicated value onto the operand stack.

The `dup` instruction must not be used unless `value` is a value of a **category 1 computational type**.

从 JVM 规范的角度来看，`invokespecial` 指令对应的 Operand Stack 的变化如下：

```text
..., objectref, [arg1, [arg2 ...]] →

...
```

The `objectref` must be of type reference and must be followed on the operand stack by `nargs` argument values, where the number, type, and order of the values must be consistent with the descriptor of the selected instance method.

### create instance with args

从 Java 语言的视角，有一个 `HelloWorld` 类，代码如下：

```java
public class HelloWorld {
    private String name;
    private int age;

    public HelloWorld(String name, int age) {
        this.name = name;
        this.age = age;
    }

    public void test() {
        HelloWorld instance = new HelloWorld("tomcat", 10);
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
       0: new           #4                  // class sample/HelloWorld
       3: dup
       4: ldc           #5                  // String tomcat
       6: bipush        10
       8: invokespecial #6                  // Method "<init>":(Ljava/lang/String;I)V
      11: astore_1
      12: return
}
```

从 ASM 的视角来看，方法体对应的内容如下：

```text
methodVisitor.visitCode();
methodVisitor.visitTypeInsn(NEW, "sample/HelloWorld");
methodVisitor.visitInsn(DUP);
methodVisitor.visitLdcInsn("tomcat");
methodVisitor.visitIntInsn(BIPUSH, 10);
methodVisitor.visitMethodInsn(INVOKESPECIAL, "sample/HelloWorld", "<init>", "(Ljava/lang/String;I)V", false);
methodVisitor.visitVarInsn(ASTORE, 1);
methodVisitor.visitInsn(RETURN);
methodVisitor.visitMaxs(4, 2);
methodVisitor.visitEnd();
```

从 Frame 的视角来看，local variable 和 operand stack 的变化：

```text
                               // {this} | {}
0000: new             #4       // {this} | {uninitialized_HelloWorld}
0003: dup                      // {this} | {uninitialized_HelloWorld, uninitialized_HelloWorld}
0004: ldc             #5       // {this} | {uninitialized_HelloWorld, uninitialized_HelloWorld, String}
0006: bipush          10       // {this} | {uninitialized_HelloWorld, uninitialized_HelloWorld, String, int}
0008: invokespecial   #6       // {this} | {HelloWorld}
0011: astore_1                 // {this, HelloWorld} | {}
0012: return                   // {} | {}
```

从 JVM 规范的角度来看，`invokespecial` 指令对应的 Operand Stack 的变化如下：

```text
..., objectref, [arg1, [arg2 ...]] →

...
```

The `objectref` must be of type reference and must be followed on the operand stack by `nargs` argument values, where the number, type, and order of the values must be consistent with the descriptor of the selected instance method.

## Type Check

### checkcast

从 Java 语言的视角，有一个 `HelloWorld` 类，代码如下：

```java
public class HelloWorld {
    public void test() {
        Object obj = new Object();
        String str = (String) obj;
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
       0: new           #2                  // class java/lang/Object
       3: dup
       4: invokespecial #1                  // Method java/lang/Object."<init>":()V
       7: astore_1
       8: aload_1
       9: checkcast     #3                  // class java/lang/String
      12: astore_2
      13: return
}
```

从 ASM 的视角来看，方法体对应的内容如下：

```text
methodVisitor.visitCode();
methodVisitor.visitTypeInsn(NEW, "java/lang/Object");
methodVisitor.visitInsn(DUP);
methodVisitor.visitMethodInsn(INVOKESPECIAL, "java/lang/Object", "<init>", "()V", false);
methodVisitor.visitVarInsn(ASTORE, 1);
methodVisitor.visitVarInsn(ALOAD, 1);
methodVisitor.visitTypeInsn(CHECKCAST, "java/lang/String");
methodVisitor.visitVarInsn(ASTORE, 2);
methodVisitor.visitInsn(RETURN);
methodVisitor.visitMaxs(2, 3);
methodVisitor.visitEnd();
```

从 Frame 的视角来看，local variable 和 operand stack 的变化：

```text
                               // {this} | {}
0000: new             #2       // {this} | {uninitialized_Object}
0003: dup                      // {this} | {uninitialized_Object, uninitialized_Object}
0004: invokespecial   #1       // {this} | {Object}
0007: astore_1                 // {this, Object} | {}
0008: aload_1                  // {this, Object} | {Object}
0009: checkcast       #3       // {this, Object} | {String}
0012: astore_2                 // {this, Object, String} | {}
0013: return                   // {} | {}
```

从 JVM 规范的角度来看，`checkcast` 指令对应的 Operand Stack 的变化如下：

```text
..., objectref →

..., objectref
```

The `objectref` must be of type `reference`.

- If `objectref` is `null`, then the operand stack is unchanged.
- If `objectref` can be cast to the resolved class, array, or interface type, the operand stack is unchanged; otherwise, the `checkcast` instruction throws a `ClassCastException`.

The `checkcast` instruction is very similar to the `instanceof` instruction. It differs in its treatment of `null`, its behavior when its test fails (`checkcast` throws an exception, `instanceof` pushes a `result` code), and its effect on the operand stack.

### instanceof

从 Java 语言的视角，有一个 `HelloWorld` 类，代码如下：

```java
public class HelloWorld {
    public void test() {
        Object obj = new Object();
        boolean flag = obj instanceof String;
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
       0: new           #2                  // class java/lang/Object
       3: dup
       4: invokespecial #1                  // Method java/lang/Object."<init>":()V
       7: astore_1
       8: aload_1
       9: instanceof    #3                  // class java/lang/String
      12: istore_2
      13: return
}
```

从 ASM 的视角来看，方法体对应的内容如下：

```text
methodVisitor.visitCode();
methodVisitor.visitTypeInsn(NEW, "java/lang/Object");
methodVisitor.visitInsn(DUP);
methodVisitor.visitMethodInsn(INVOKESPECIAL, "java/lang/Object", "<init>", "()V", false);
methodVisitor.visitVarInsn(ASTORE, 1);
methodVisitor.visitVarInsn(ALOAD, 1);
methodVisitor.visitTypeInsn(INSTANCEOF, "java/lang/String");
methodVisitor.visitVarInsn(ISTORE, 2);
methodVisitor.visitInsn(RETURN);
methodVisitor.visitMaxs(2, 3);
methodVisitor.visitEnd();
```

从 Frame 的视角来看，local variable 和 operand stack 的变化：

```text
                               // {this} | {}
0000: new             #2       // {this} | {uninitialized_Object}
0003: dup                      // {this} | {uninitialized_Object, uninitialized_Object}
0004: invokespecial   #1       // {this} | {Object}
0007: astore_1                 // {this, Object} | {}
0008: aload_1                  // {this, Object} | {Object}
0009: instanceof      #3       // {this, Object} | {int}
0012: istore_2                 // {this, Object, int} | {}
0013: return                   // {} | {}
```

从 JVM 规范的角度来看，`instanceof` 指令对应的 Operand Stack 的变化如下：

```text
..., objectref →

..., result
```

The `objectref`, which must be of type `reference`, is popped from the operand stack.

- If `objectref` is `null`, the `instanceof` instruction pushes an int `result` of `0` as an `int` on the operand stack.
- If `objectref` is an instance of the resolved class or array or implements the resolved interface, the `instanceof` instruction pushes an int `result` of `1` as an `int` on the operand stack; otherwise, it pushes an int `result` of `0`.

The `instanceof` instruction is very similar to the `checkcast` instruction. It differs in its treatment of `null`, its behavior when its test fails (`checkcast` throws an exception, `instanceof` pushes a `result` code), and its effect on the operand stack.
