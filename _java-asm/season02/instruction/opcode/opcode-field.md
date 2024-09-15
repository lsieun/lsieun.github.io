---
title: "opcode: field (4/135/205)"
sequence: "206"
---

[上级目录]({% link _posts/2021-06-01-java-asm-index.md %})

## 概览

从 Instruction 的角度来说，与 field 相关的 opcode 有 4 个，内容如下：

| opcode | mnemonic symbol | opcode | mnemonic symbol | opcode | mnemonic symbol | opcode | mnemonic symbol |
|--------|-----------------|--------|-----------------|--------|-----------------|--------|-----------------|
| 178    | getstatic       | 179    | putstatic       | 180    | getfield        | 181    | putfield        |

从 ASM 的角度来说，这些 opcode 与 `MethodVisitor.visitXxxInsn()` 方法对应关系如下：

- `MethodVisitor.visitFieldInsn()`: `getstatic`, `putstatic`, `getfield`, `putfield`.

## non-static field

### getfield

从 Java 语言的视角，有一个 `HelloWorld` 类，代码如下：

```java
public class HelloWorld {
    public int value;

    public void test() {
        int i = this.value;
    }
}
```

从 Instruction 的视角来看，方法体对应的内容如下：

```text
$ javap -c sample.HelloWorld
Compiled from "HelloWorld.java"
public class sample.HelloWorld {
  public int value;
...
  public void test();
    Code:
       0: aload_0
       1: getfield      #2                  // Field value:I
       4: istore_1
       5: return
}
```

从 ASM 的视角来看，方法体对应的内容如下：

```text
methodVisitor.visitCode();
methodVisitor.visitVarInsn(ALOAD, 0);
methodVisitor.visitFieldInsn(GETFIELD, "sample/HelloWorld", "value", "I");
methodVisitor.visitVarInsn(ISTORE, 1);
methodVisitor.visitInsn(RETURN);
methodVisitor.visitMaxs(1, 2);
methodVisitor.visitEnd();
```

从 Frame 的视角来看，local variable 和 operand stack 的变化：

```text
                               // {this} | {}
0000: aload_0                  // {this} | {this}
0001: getfield        #2       // {this} | {int}
0004: istore_1                 // {this, int} | {}
0005: return                   // {} | {}
```

从 JVM 规范的角度来看，`getfield` 指令对应的 Operand Stack 的变化如下：

```text
..., objectref →

..., value
```

The `objectref`, which must be of type `reference`, is popped from the operand stack. The value of the referenced field in `objectref` is fetched and pushed onto the operand stack.

### putfield

从 Java 语言的视角，有一个 `HelloWorld` 类，代码如下：

```java
public class HelloWorld {
    public int value;

    public void test() {
        this.value = 0;
    }
}
```

从 Instruction 的视角来看，方法体对应的内容如下：

```text
$ javap -c sample.HelloWorld
Compiled from "HelloWorld.java"
public class sample.HelloWorld {
  public int value;
...

  public void test();
    Code:
       0: aload_0
       1: iconst_0
       2: putfield      #2                  // Field value:I
       5: return
}
```

从 ASM 的视角来看，方法体对应的内容如下：

```text
methodVisitor.visitCode();
methodVisitor.visitVarInsn(ALOAD, 0);
methodVisitor.visitInsn(ICONST_0);
methodVisitor.visitFieldInsn(PUTFIELD, "sample/HelloWorld", "value", "I");
methodVisitor.visitInsn(RETURN);
methodVisitor.visitMaxs(2, 1);
methodVisitor.visitEnd();
```

从 Frame 的视角来看，local variable 和 operand stack 的变化：

```text
                               // {this} | {}
0000: aload_0                  // {this} | {this}
0001: iconst_0                 // {this} | {this, int}
0002: putfield        #2       // {this} | {}
0005: return                   // {} | {}
```

从 JVM 规范的角度来看，`putfield` 指令对应的 Operand Stack 的变化如下：

```text
..., objectref, value →

...
```

The `value` and `objectref` are popped from the operand stack. The `objectref` must be of type `reference`. The `value` undergoes value set conversion, resulting in `value'`, and the referenced field in `objectref` is set to `value'`.

- If the field descriptor type is `boolean`, `byte`, `char`, `short`, or `int`, then the `value` must be an `int`.
- If the field descriptor type is `float`, `long`, or `double`, then the `value` must be a `float`, `long`, or `double`, respectively.
- If the field descriptor type is a `reference` type, then the `value` must be of a type that is assignment compatible with the field descriptor type.
- If the field is `final`, it must be declared in the current class, and the instruction must occur in an **instance initialization method** (`<init>`) of the current class.

## static field

### getstatic

从 Java 语言的视角，有一个 `HelloWorld` 类，代码如下：

```java
public class HelloWorld {
    public static int staticValue;

    public void test() {
        int i = HelloWorld.staticValue;
    }
}
```

从 Instruction 的视角来看，方法体对应的内容如下：

```text
$ javap -c sample.HelloWorld
Compiled from "HelloWorld.java"
public class sample.HelloWorld {
  public static int staticValue;
...

  public void test();
    Code:
       0: getstatic     #2                  // Field staticValue:I
       3: istore_1
       4: return
}
```

从 ASM 的视角来看，方法体对应的内容如下：

```text
methodVisitor.visitCode();
methodVisitor.visitFieldInsn(GETSTATIC, "sample/HelloWorld", "staticValue", "I");
methodVisitor.visitVarInsn(ISTORE, 1);
methodVisitor.visitInsn(RETURN);
methodVisitor.visitMaxs(1, 2);
methodVisitor.visitEnd();
```

从 Frame 的视角来看，local variable 和 operand stack 的变化：

```text
                               // {this} | {}
0000: getstatic       #2       // {this} | {int}
0003: istore_1                 // {this, int} | {}
0004: return                   // {} | {}
```

从 JVM 规范的角度来看，`getstatic` 指令对应的 Operand Stack 的变化如下：

```text
..., →

..., value
```

The `value` of the class or interface field is fetched and pushed onto the operand stack.

### putstatic

从 Java 语言的视角，有一个 `HelloWorld` 类，代码如下：

```java
public class HelloWorld {
    public static int staticValue;

    public void test() {
        HelloWorld.staticValue = 1;
    }
}
```

从 Instruction 的视角来看，方法体对应的内容如下：

```text
$ javap -c sample.HelloWorld
Compiled from "HelloWorld.java"
public class sample.HelloWorld {
  public static int staticValue;
...

  public void test();
    Code:
       0: iconst_1
       1: putstatic     #2                  // Field staticValue:I
       4: return
}
```

从 ASM 的视角来看，方法体对应的内容如下：

```text
methodVisitor.visitCode();
methodVisitor.visitInsn(ICONST_1);
methodVisitor.visitFieldInsn(PUTSTATIC, "sample/HelloWorld", "staticValue", "I");
methodVisitor.visitInsn(RETURN);
methodVisitor.visitMaxs(1, 1);
methodVisitor.visitEnd();
```

从 Frame 的视角来看，local variable 和 operand stack 的变化：

```text
                               // {this} | {}
0000: iconst_1                 // {this} | {int}
0001: putstatic       #2       // {this} | {}
0004: return                   // {} | {}
```

从 JVM 规范的角度来看，`putstatic` 指令对应的 Operand Stack 的变化如下：

```text
..., value →

...
```

The `value` is popped from the operand stack and undergoes value set conversion, resulting in `value'`. The class field is set to `value'`.

The type of a `value` stored by a `putstatic` instruction must be compatible with the descriptor of the referenced field.

- If the field descriptor type is `boolean`, `byte`, `char`, `short`, or `int`, then the `value` must be an `int`.
- If the field descriptor type is `float`, `long`, or `double`, then the `value` must be a `float`, `long`, or `double`, respectively.
- If the field descriptor type is a `reference` type, then the `value` must be of a type that is assignment compatible with the field descriptor type.
- If the field is `final`, it must be declared in the current class, and the instruction must occur in the `<clinit>` method of the current class.
