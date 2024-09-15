---
title: "Opcodes 介绍"
sequence: "213"
---

[上级目录]({% link _posts/2021-06-01-java-asm-index.md %})

`Opcodes` 是一个接口，它定义了许多字段。这些字段主要是在 `ClassVisitor.visitXxx()` 和 `MethodVisitor.visitXxx()` 方法中使用。

## ClassVisitor

### ASM Version

字段含义：`Opcodes.ASM4`~`Opcodes.ASM9` 标识了 ASM 的版本信息。

应用场景：用于创建具体的 `ClassVisitor` 实例，例如 `ClassVisitor(int api, ClassVisitor classVisitor)` 中的 `api` 参数。

```java
public interface Opcodes {
    // ASM API versions.
    int ASM4 = 4 << 16 | 0 << 8;
    int ASM5 = 5 << 16 | 0 << 8;
    int ASM6 = 6 << 16 | 0 << 8;
    int ASM7 = 7 << 16 | 0 << 8;
    int ASM8 = 8 << 16 | 0 << 8;
    int ASM9 = 9 << 16 | 0 << 8;
}
```

### Java Version

字段含义：`Opcodes.V1_1`~`Opcodes.V16` 标识了 `.class` 文件的版本信息。

应用场景：用于 `ClassVisitor.visit(int version, int access, ...)` 的 `version` 参数。

```java
public interface Opcodes {
    // Java ClassFile versions
    // (the minor version is stored in the 16 most significant bits, and
    //  the major version in the 16 least significant bits).

    int V1_1 = 3 << 16 | 45;
    int V1_2 = 0 << 16 | 46;
    int V1_3 = 0 << 16 | 47;
    int V1_4 = 0 << 16 | 48;
    int V1_5 = 0 << 16 | 49;
    int V1_6 = 0 << 16 | 50;
    int V1_7 = 0 << 16 | 51;
    int V1_8 = 0 << 16 | 52;

    int V9  = 0 << 16 | 53;
    int V10 = 0 << 16 | 54;
    int V11 = 0 << 16 | 55;
    int V12 = 0 << 16 | 56;
    int V13 = 0 << 16 | 57;
    int V14 = 0 << 16 | 58;
    int V15 = 0 << 16 | 59;
    int V16 = 0 << 16 | 60;
}
```

### Access Flags

字段含义：`Opcodes.ACC_PUBLIC`~`Opcodes.ACC_MODULE` 标识了 Class、Field、Method 的访问标识（Access Flag）。

应用场景：

- `ClassVisitor.visit(int version, int access, ...)` 的 `access` 参数。
- `ClassVisitor.visitField(int access, String name, ...)` 的 `access` 参数。
- `ClassVisitor.visitMethod(int access, String name, ...)` 的 `access` 参数。

```java
public interface Opcodes {
    int ACC_PUBLIC = 0x0001;       // class, field, method
    int ACC_PRIVATE = 0x0002;      // class, field, method
    int ACC_PROTECTED = 0x0004;    // class, field, method
    int ACC_STATIC = 0x0008;       // field, method
    int ACC_FINAL = 0x0010;        // class, field, method, parameter
    int ACC_SUPER = 0x0020;        // class
    int ACC_SYNCHRONIZED = 0x0020; // method
    int ACC_OPEN = 0x0020;         // module
    int ACC_TRANSITIVE = 0x0020;   // module requires
    int ACC_VOLATILE = 0x0040;     // field
    int ACC_BRIDGE = 0x0040;       // method
    int ACC_STATIC_PHASE = 0x0040; // module requires
    int ACC_VARARGS = 0x0080;      // method
    int ACC_TRANSIENT = 0x0080;    // field
    int ACC_NATIVE = 0x0100;       // method
    int ACC_INTERFACE = 0x0200;    // class
    int ACC_ABSTRACT = 0x0400;     // class, method
    int ACC_STRICT = 0x0800;       // method
    int ACC_SYNTHETIC = 0x1000;    // class, field, method, parameter, module *
    int ACC_ANNOTATION = 0x2000;   // class
    int ACC_ENUM = 0x4000;         // class(?) field inner
    int ACC_MANDATED = 0x8000;     // field, method, parameter, module, module *
    int ACC_MODULE = 0x8000;       // class
}
```

## MethodVisitor

### frame

字段含义：`Opcodes.F_NEW`~`Opcodes.F_SAME1` 标识了 frame 的状态，`Opcodes.TOP`~`Opcodes.UNINITIALIZED_THIS` 标识了 frame 中某一个数据项的具体类型。

应用场景：

- `Opcodes.F_NEW`~`Opcodes.F_SAME1` 用在 `MethodVisitor.visitFrame(int type, int numLocal, Object[] local, int numStack, Object[] stack)` 方法中的 `type` 参数。
- `Opcodes.TOP`~`Opcodes.UNINITIALIZED_THIS` 用在 `MethodVisitor.visitFrame(int type, int numLocal, Object[] local, int numStack, Object[] stack)` 方法中的 `local` 参数和 `stack` 参数。

```java
public interface Opcodes {
    // ASM specific stack map frame types, used in {@link ClassVisitor#visitFrame}.
    int F_NEW = -1;
    int F_FULL = 0;
    int F_APPEND = 1;
    int F_CHOP = 2;
    int F_SAME = 3;
    int F_SAME1 = 4;


    // Standard stack map frame element types, used in {@link ClassVisitor#visitFrame}.
    Integer TOP = Frame.ITEM_TOP;
    Integer INTEGER = Frame.ITEM_INTEGER;
    Integer FLOAT = Frame.ITEM_FLOAT;
    Integer DOUBLE = Frame.ITEM_DOUBLE;
    Integer LONG = Frame.ITEM_LONG;
    Integer NULL = Frame.ITEM_NULL;
    Integer UNINITIALIZED_THIS = Frame.ITEM_UNINITIALIZED_THIS;
}
```

### opcodes

字段含义：`Opcodes.NOP`~`Opcodes.IFNONNULL` 表示 opcode 的值。

应用场景：在 `MethodVisitor.visitXxxInsn(opcode)` 方法中的 `opcode` 参数中使用。

```java
public interface Opcodes {
    int NOP = 0; // visitInsn
    int ACONST_NULL = 1; // -
    int ICONST_M1 = 2; // -
    int ICONST_0 = 3; // -
    int ICONST_1 = 4; // -
    int ICONST_2 = 5; // -
    int ICONST_3 = 6; // -
    int ICONST_4 = 7; // -
    int ICONST_5 = 8; // -
    int LCONST_0 = 9; // -
    int LCONST_1 = 10; // -
    int FCONST_0 = 11; // -
    int FCONST_1 = 12; // -
    int FCONST_2 = 13; // -
    int DCONST_0 = 14; // -
    int DCONST_1 = 15; // -
    int BIPUSH = 16; // visitIntInsn
    int SIPUSH = 17; // -
    int LDC = 18; // visitLdcInsn
    int ILOAD = 21; // visitVarInsn
    int LLOAD = 22; // -
    int FLOAD = 23; // -
    int DLOAD = 24; // -
    int ALOAD = 25; // -
    int IALOAD = 46; // visitInsn
    int LALOAD = 47; // -
    int FALOAD = 48; // -
    int DALOAD = 49; // -
    int AALOAD = 50; // -
    int BALOAD = 51; // -
    int CALOAD = 52; // -
    int SALOAD = 53; // -
    int ISTORE = 54; // visitVarInsn
    int LSTORE = 55; // -
    int FSTORE = 56; // -
    int DSTORE = 57; // -
    int ASTORE = 58; // -
    int IASTORE = 79; // visitInsn
    int LASTORE = 80; // -
    int FASTORE = 81; // -
    int DASTORE = 82; // -
    int AASTORE = 83; // -
    int BASTORE = 84; // -
    int CASTORE = 85; // -
    int SASTORE = 86; // -
    int POP = 87; // -
    int POP2 = 88; // -
    int DUP = 89; // -
    int DUP_X1 = 90; // -
    int DUP_X2 = 91; // -
    int DUP2 = 92; // -
    int DUP2_X1 = 93; // -
    int DUP2_X2 = 94; // -
    int SWAP = 95; // -
    int IADD = 96; // -
    int LADD = 97; // -
    int FADD = 98; // -
    int DADD = 99; // -
    int ISUB = 100; // -
    int LSUB = 101; // -
    int FSUB = 102; // -
    int DSUB = 103; // -
    int IMUL = 104; // -
    int LMUL = 105; // -
    int FMUL = 106; // -
    int DMUL = 107; // -
    int IDIV = 108; // -
    int LDIV = 109; // -
    int FDIV = 110; // -
    int DDIV = 111; // -
    int IREM = 112; // -
    int LREM = 113; // -
    int FREM = 114; // -
    int DREM = 115; // -
    int INEG = 116; // -
    int LNEG = 117; // -
    int FNEG = 118; // -
    int DNEG = 119; // -
    int ISHL = 120; // -
    int LSHL = 121; // -
    int ISHR = 122; // -
    int LSHR = 123; // -
    int IUSHR = 124; // -
    int LUSHR = 125; // -
    int IAND = 126; // -
    int LAND = 127; // -
    int IOR = 128; // -
    int LOR = 129; // -
    int IXOR = 130; // -
    int LXOR = 131; // -
    int IINC = 132; // visitIincInsn
    int I2L = 133; // visitInsn
    int I2F = 134; // -
    int I2D = 135; // -
    int L2I = 136; // -
    int L2F = 137; // -
    int L2D = 138; // -
    int F2I = 139; // -
    int F2L = 140; // -
    int F2D = 141; // -
    int D2I = 142; // -
    int D2L = 143; // -
    int D2F = 144; // -
    int I2B = 145; // -
    int I2C = 146; // -
    int I2S = 147; // -
    int LCMP = 148; // -
    int FCMPL = 149; // -
    int FCMPG = 150; // -
    int DCMPL = 151; // -
    int DCMPG = 152; // -
    int IFEQ = 153; // visitJumpInsn
    int IFNE = 154; // -
    int IFLT = 155; // -
    int IFGE = 156; // -
    int IFGT = 157; // -
    int IFLE = 158; // -
    int IF_ICMPEQ = 159; // -
    int IF_ICMPNE = 160; // -
    int IF_ICMPLT = 161; // -
    int IF_ICMPGE = 162; // -
    int IF_ICMPGT = 163; // -
    int IF_ICMPLE = 164; // -
    int IF_ACMPEQ = 165; // -
    int IF_ACMPNE = 166; // -
    int GOTO = 167; // -
    int JSR = 168; // -
    int RET = 169; // visitVarInsn
    int TABLESWITCH = 170; // visiTableSwitchInsn
    int LOOKUPSWITCH = 171; // visitLookupSwitch
    int IRETURN = 172; // visitInsn
    int LRETURN = 173; // -
    int FRETURN = 174; // -
    int DRETURN = 175; // -
    int ARETURN = 176; // -
    int RETURN = 177; // -
    int GETSTATIC = 178; // visitFieldInsn
    int PUTSTATIC = 179; // -
    int GETFIELD = 180; // -
    int PUTFIELD = 181; // -
    int INVOKEVIRTUAL = 182; // visitMethodInsn
    int INVOKESPECIAL = 183; // -
    int INVOKESTATIC = 184; // -
    int INVOKEINTERFACE = 185; // -
    int INVOKEDYNAMIC = 186; // visitInvokeDynamicInsn
    int NEW = 187; // visitTypeInsn
    int NEWARRAY = 188; // visitIntInsn
    int ANEWARRAY = 189; // visitTypeInsn
    int ARRAYLENGTH = 190; // visitInsn
    int ATHROW = 191; // -
    int CHECKCAST = 192; // visitTypeInsn
    int INSTANCEOF = 193; // -
    int MONITORENTER = 194; // visitInsn
    int MONITOREXIT = 195; // -
    int MULTIANEWARRAY = 197; // visitMultiANewArrayInsn
    int IFNULL = 198; // visitJumpInsn
    int IFNONNULL = 199; // -
}
```

### opcode: newarray

字段含义：`Opcodes.T_BOOLEAN`~`Opcodes.T_LONG` 表示数组的类型。

应用场景：对于 `MethodVisitor.visitIntInsn(opcode, operand)` 方法，当 `opcode` 为 `NEWARRAY` 时，`operand` 参数中使用。

```java
public interface Opcodes {
    // Possible values for the type operand of the NEWARRAY instruction.
    int T_BOOLEAN = 4;
    int T_CHAR = 5;
    int T_FLOAT = 6;
    int T_DOUBLE = 7;
    int T_BYTE = 8;
    int T_SHORT = 9;
    int T_INT = 10;
    int T_LONG = 11;
}
```

```java
public class HelloWorld {
    public void test() {
        byte[] bytes = new byte[10];
    }
}
```

### opcode: invokedynamic

字段含义：`Opcodes.H_GETFIELD`~`Opcodes.H_INVOKEINTERFACE` 表示 MethodHandle 的类型。

应用场景：在创建 `Handle(int tag, String owner, String name, String descriptor, boolean isInterface)` 时，`tag` 参数中使用；而该 `Handle` 实例会在 `MethodVisitor.visitInvokeDynamicInsn()` 方法使用到。

```java
public interface Opcodes {
    // Possible values for the reference_kind field of CONSTANT_MethodHandle_info structures.
    int H_GETFIELD = 1;
    int H_GETSTATIC = 2;
    int H_PUTFIELD = 3;
    int H_PUTSTATIC = 4;
    int H_INVOKEVIRTUAL = 5;
    int H_INVOKESTATIC = 6;
    int H_INVOKESPECIAL = 7;
    int H_NEWINVOKESPECIAL = 8;
    int H_INVOKEINTERFACE = 9;
}
```

```java
import java.util.function.BiFunction;

public class HelloWorld {
    public void test() {
        BiFunction<Integer, Integer, Integer> func = Math::max;
    }
}
```

## 总结

本文主要对 `Opcodes` 接口里定义的字段进行介绍，内容总结如下：

- 第一点，在 `Opcodes` 类定义的字段，主要应用于 `ClassVisitor` 和 `MethodVisitor` 类的 `visitXxx()` 方法。
- 第二点，记忆方法。由于 `Opcodes` 类定义的字段很多，我们可以分成不同的批次和类别来进行理解，慢慢去掌握。
