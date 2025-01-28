---
title: "Opcode"
sequence: "101"
---

## 简单指令

### 常量

#### 一条指令

```text
                                                             ┌─── MINUS_ONE ────┼─── Opcodes.ICONST_M1
                                                             │
                                                             ├─── ZERO ─────────┼─── Opcodes.ICONST_0
                                                             │
                                                             ├─── ONE ──────────┼─── Opcodes.ICONST_1
                                                             │
                                                             ├─── TWO ──────────┼─── Opcodes.ICONST_2
                                                             │
                                     ┌─── IntegerConstant ───┼─── THREE ────────┼─── Opcodes.ICONST_3
                                     │                       │
                                     │                       ├─── FOUR ─────────┼─── Opcodes.ICONST_4
                                     │                       │
                                     │                       ├─── FIVE ─────────┼─── Opcodes.ICONST_5
                                     │                       │
                                     │                       │                  ┌─── Opcodes.BIPUSH
                                     │                       │                  │
                                     │                       └─── forValue() ───┼─── Opcodes.SIPUSH
                                     │                                          │
                                     │                                          └─── Opcodes.LDC
                                     │
                                     │                       ┌─── ZERO ─────────┼─── Opcodes.LCONST_0
                                     │                       │
               ┌─── primitive ───────┼─── LongConstant ──────┼─── ONE ──────────┼─── Opcodes.LCONST_1
               │                     │                       │
               │                     │                       └─── forValue() ───┼─── Opcodes.LDC
               │                     │
               │                     │                       ┌─── ZERO ─────────┼─── Opcodes.FCONST_0
               │                     │                       │
               │                     │                       ├─── ONE ──────────┼─── Opcodes.FCONST_1
               │                     ├─── FloatConstant ─────┤
               │                     │                       ├─── TWO ──────────┼─── Opcodes.FCONST_2
               │                     │                       │
               │                     │                       └─── forValue() ───┼─── Opcodes.LDC
               │                     │
               │                     │                       ┌─── ZERO ─────────┼─── Opcodes.DCONST_0
               │                     │                       │
               │                     └─── DoubleConstant ────┼─── ONE ──────────┼─── Opcodes.DCONST_1
               │                                             │
               │                                             └─── forValue() ───┼─── Opcodes.LDC
               │
               │                     ┌─── NullConstant ────┼─── INSTANCE ───┼─── Opcodes.ACONST_NULL
               │                     │
               │                     ├─── TextConstant ────┼─── new ───┼─── Opcodes.LDC "Text"
               │                     │
               │                     │                     ┌─── VOID ────────┼─── Opcodes.GETSTATIC Void.TYPE
               │                     │                     │
Opcode::cst ───┼─── non-primitive ───┤                     ├─── BOOLEAN ─────┼─── Opcodes.GETSTATIC Boolean.TYPE
               │                     │                     │
               │                     │                     ├─── BYTE ────────┼─── Opcodes.GETSTATIC Byte.TYPE
               │                     │                     │
               │                     │                     ├─── SHORT ───────┼─── Opcodes.GETSTATIC Short.TYPE
               │                     │                     │
               │                     │                     ├─── CHARACTER ───┼─── Opcodes.GETSTATIC Character.TYPE
               │                     └─── ClassConstant ───┤
               │                                           ├─── INTEGER ─────┼─── Opcodes.GETSTATIC Integer.TYPE
               │                                           │
               │                                           ├─── LONG ────────┼─── Opcodes.GETSTATIC Long.TYPE
               │                                           │
               │                                           ├─── FLOAT ───────┼─── Opcodes.GETSTATIC Float.TYPE
               │                                           │
               │                                           ├─── DOUBLE ──────┼─── Opcodes.GETSTATIC Double.TYPE
               │                                           │
               │                                           │                 ┌─── Opcodes.LDC Xxx.class
               │                                           └─── of() ────────┤
               │                                                             └─── Opcodes.INVOKESTATIC Class.forName()
               │
               │                     ┌─── JavaConstantValue ───┼─── new ───┼─── Opcodes.LDC
               │                     │
               │                     │                         ┌─── INTEGER ─────┼─── IntegerConstant.ZERO
               │                     │                         │
               └─── synthetic ───────┤                         ├─── LONG ────────┼─── LongConstant.ZERO
                                     │                         │
                                     │                         ├─── FLOAT ───────┼─── FloatConstant.ZERO
                                     │                         │
                                     └─── DefaultValue ────────┼─── DOUBLE ──────┼─── DoubleConstant.ZERO
                                                               │
                                                               ├─── VOID ────────┼─── Trivial.INSTANCE
                                                               │
                                                               ├─── REFERENCE ───┼─── NullConstant.INSTANCE
                                                               │
                                                               └─── of()
```

#### 多条指令

```text
                                                      ┌─── Opcodes.LDC Xxx.class
                                                      │
               ┌─── FieldConstant ────────┼─── new ───┼─── Opcodes.LDC fieldName
               │                                      │
               │                                      └─── Opcodes.INVOKEVIRTUAL Class.getDeclaredField(String name)
               │
               │                                       ┌─── Opcodes.LDC Xxx.class
               │                                       │
               │                                       ├─── Opcodes.LDC methodName
               ├─── MethodConstant ───────┼─── of() ───┤
               │                                       ├─── Opcodes.NEWARRAY Class<?>[] {parameterTypes}
               │                                       │
Opcode::cst ───┤                                       └─── Opcodes.INVOKEVIRTUAL Class.getMethod(name, Class<?>... parameterTypes)
               │
               │                                       ┌─── Opcodes.NEW ObjectInputStream.class
               │                                       │
               │                                       ├─── Opcodes.DUP
               │                                       │
               │                                       ├─── Opcodes.NEW ByteArrayInputStream.class
               │                                       │
               │                                       ├─── Opcodes.DUP
               │                                       │
               │                                       ├─── Opcodes.LDC "serialization text"
               └─── SerializedConstant ───┼─── of() ───┤
                                                       ├─── Opcodes.LDC "ISO-8859-1"
                                                       │
                                                       ├─── Opcodes.INVOKEVIRTUAL String.getBytes(charsetName)
                                                       │
                                                       ├─── Opcodes.INVOKESPECIAL ByteArrayInputStream(byte[])
                                                       │
                                                       ├─── Opcodes.INVOKESPECIAL ObjectInputStream(InputStream)
                                                       │
                                                       └─── Opcodes.INVOKEVIRTUAL ObjectInputStream.readObject()
```

### 数学

```text
                                       ┌─── INTEGER ───┼─── Opcodes.IADD
                                       │
                                       ├─── LONG ──────┼─── Opcodes.LADD
                ┌─── Addition ─────────┤
                │                      ├─── FLOAT ─────┼─── Opcodes.FADD
                │                      │
                │                      └─── DOUBLE ────┼─── Opcodes.DADD
                │
                │                      ┌─── INTEGER ───┼─── Opcodes.ISUB
                │                      │
                │                      ├─── LONG ──────┼─── Opcodes.LSUB
                ├─── Subtraction ──────┤
                │                      ├─── FLOAT ─────┼─── Opcodes.FSUB
                │                      │
                │                      └─── DOUBLE ────┼─── Opcodes.DSUB
                │
                │                      ┌─── INTEGER ───┼─── Opcodes.IMUL
                │                      │
                │                      ├─── LONG ──────┼─── Opcodes.LMUL
                ├─── Multiplication ───┤
                │                      ├─── FLOAT ─────┼─── Opcodes.FMUL
                │                      │
                │                      └─── DOUBLE ────┼─── Opcodes.DMUL
                │
Opcode::math ───┤                      ┌─── INTEGER ───┼─── Opcodes.IDIV
                │                      │
                │                      ├─── LONG ──────┼─── Opcodes.LDIV
                ├─── Division ─────────┤
                │                      ├─── FLOAT ─────┼─── Opcodes.FDIV
                │                      │
                │                      └─── DOUBLE ────┼─── Opcodes.DDIV
                │
                │                      ┌─── INTEGER ───┼─── Opcodes.IREM
                │                      │
                │                      ├─── LONG ──────┼─── Opcodes.LREM
                ├─── Remainder ────────┤
                │                      ├─── FLOAT ─────┼─── Opcodes.FREM
                │                      │
                │                      └─── DOUBLE ────┼─── Opcodes.DREM
                │
                │                      ┌─── INTEGER ───┼─── Opcodes.ISHL
                ├─── ShiftLeft ────────┤
                │                      └─── LONG ──────┼─── Opcodes.LSHL
                │
                │                      ┌─── INTEGER ────────┼─── Opcodes.ISHR
                │                      │
                └─── ShiftRight ───────┼─── LONG ───────────┼─── Opcodes.LSHR
                                       │
                                       │                                     ┌─── INTEGER ───┼─── Opcodes.IUSHR
                                       └─── toUnsigned() ───┼─── Unsigned ───┤
                                                                             └─── LONG ──────┼─── Opcodes.LUSHR

```

### 装箱和拆箱

```text
                                                  ┌─── BOOLEAN ──────────┼─── Opcodes.INVOKESTATIC Boolean.valueOf()
                                                  │
                                                  ├─── BYTE ─────────────┼─── Opcodes.INVOKESTATIC Byte.valueOf()
                                                  │
                                                  ├─── SHORT ────────────┼─── Opcodes.INVOKESTATIC Short.valueOf()
                                                  │
                                                  ├─── CHARACTER ────────┼─── Opcodes.INVOKESTATIC Character.valueOf()
                                                  │
                ┌─── PrimitiveBoxingDelegate ─────┼─── INTEGER ──────────┼─── Opcodes.INVOKESTATIC Integer.valueOf()
                │                                 │
                │                                 ├─── LONG ─────────────┼─── Opcodes.INVOKESTATIC Long.valueOf()
                │                                 │
                │                                 ├─── FLOAT ────────────┼─── Opcodes.INVOKESTATIC Float.valueOf()
                │                                 │
                │                                 ├─── DOUBLE ───────────┼─── Opcodes.INVOKESTATIC Double.valueOf()
                │                                 │
                │                                 └─── forPrimitive()
                │
                │                                 ┌─── BOOLEAN ──────────────┼─── Opcodes.INVOKEVIRTUAL Boolean.booleanValue()
                │                                 │
                │                                 ├─── BYTE ─────────────────┼─── Opcodes.INVOKEVIRTUAL Byte.byteValue()
                │                                 │
                │                                 ├─── SHORT ────────────────┼─── Opcodes.INVOKEVIRTUAL Short.shortValue()
                │                                 │
                │                                 ├─── CHARACTER ────────────┼─── Opcodes.INVOKEVIRTUAL Character.charValue()
                │                                 │
                │                                 ├─── INTEGER ──────────────┼─── Opcodes.INVOKEVIRTUAL Integer.intValue()
                ├─── PrimitiveUnboxingDelegate ───┤
                │                                 ├─── LONG ─────────────────┼─── Opcodes.INVOKEVIRTUAL Long.longValue()
                │                                 │
Opcode::type ───┤                                 ├─── FLOAT ────────────────┼─── Opcodes.INVOKEVIRTUAL Float.floatValue()
                │                                 │
                │                                 ├─── DOUBLE ───────────────┼─── Opcodes.INVOKEVIRTUAL Double.doubleValue()
                │                                 │
                │                                 ├─── forPrimitive()
                │                                 │
                │                                 └─── forReferenceType()
                │
                │                                                   ┌─── Opcodes.I2L
                │                                                   │
                │                                 ┌─── BYTE ────────┼─── Opcodes.I2F
                │                                 │                 │
                │                                 │                 └─── Opcodes.I2L
                │                                 │
                │                                 │                 ┌─── Opcodes.I2L
                │                                 │                 │
                │                                 ├─── SHORT ───────┼─── Opcodes.I2F
                │                                 │                 │
                │                                 │                 └─── Opcodes.I2D
                │                                 │
                │                                 │                 ┌─── Opcodes.I2L
                │                                 │                 │
                │                                 ├─── CHARACTER ───┼─── Opcodes.I2F
                └─── PrimitiveWideningDelegate ───┤                 │
                                                  │                 └─── Opcodes.I2D
                                                  │
                                                  │                 ┌─── Opcodes.I2L
                                                  │                 │
                                                  ├─── INTEGER ─────┼─── Opcodes.I2F
                                                  │                 │
                                                  │                 └─── Opcodes.I2D
                                                  │
                                                  │                 ┌─── Opcodes.L2F
                                                  ├─── LONG ────────┤
                                                  │                 └─── Opcodes.L2D
                                                  │
                                                  └─── FLOAT ───────┼─── Opcodes.F2D
```

## 面向对象指令

### 类型

```text
                ┌─── TypeCreation ────┼─── of() ───┼─── Opcodes.NEW
                │
Opcode::type ───┼─── InstanceCheck ───┼─── of() ───┼─── Opcodes.INSTANCEOF
                │
                └─── TypeCasting ─────┼─── to() ───┼─── Opcodes.CHECKCAST
```

### 字段

```text
                                                        ┌─── Opcodes.PUTSTATIC
                                     ┌─── STATIC ───────┤
                                     │                  └─── Opcodes.GETSTATIC
                                     │
Opcode::field ───┼─── FieldAccess ───┤                  ┌─── Opcodes.PUTFIELD
                                     ├─── INSTANCE ─────┤
                                     │                  └─── Opcodes.GETFIELD
                                     │
                                     └─── forField()
```

### 方法

```text
                                                                                                      ┌─── Opcodes.ILOAD
                                                                                    ┌─── INTEGER ─────┤
                                                                                    │                 └─── Opcodes.ISTORE
                                                                                    │
                                                                                    │                 ┌─── Opcodes.LLOAD
                                                                                    ├─── LONG ────────┤
                                                                                    │                 └─── Opcodes.LSTORE
                                                                                    │
                                                                                    │                 ┌─── Opcodes.FLOAD
                                                                                    ├─── FLOAT ───────┤
                                                                                    │                 └─── Opcodes.FSTORE
                                                                                    │
                                                                ┌─── opcode ────────┤                 ┌─── Opcodes.DLOAD
                                                                │                   ├─── DOUBLE ──────┤
                                                                │                   │                 └─── Opcodes.DSTORE
                                                                │                   │
                                                                │                   │                 ┌─── Opcodes.ALOAD
                                                                │                   ├─── REFERENCE ───┤
                                                                │                   │                 └─── Opcodes.ASTORE
                                                                │                   │
                                                                │                   │                 ┌─── MethodVariableAccess.INTEGER
                                                                │                   │                 │
                                                                │                   │                 ├─── MethodVariableAccess.LONG
                                                                │                   │                 │
                                                                │                   └─── of() ────────┼─── MethodVariableAccess.FLOAT
                                                                │                                     │
                                                                │                                     ├─── MethodVariableAccess.DOUBLE
                  ┌─── variable ───┼─── MethodVariableAccess ───┤                                     │
                  │                                             │                                     └─── MethodVariableAccess.REFERENCE
                  │                                             │
                  │                                             │                                 ┌─── load()
                  │                                             │                                 │
                  │                                             │                                 ├─── loadThis() --> loadFrom(0)
                  │                                             │                   ┌─── load ────┤
                  │                                             │                   │             ├─── loadFrom(offset)
                  │                                             │                   │             │
                  │                                             ├─── offset ────────┤             └─── allArgumentsOf()
                  │                                             │                   │
                  │                                             │                   │             ┌─── store()
                  │                                             │                   └─── store ───┤
                  │                                             │                                 └─── storeAt(offset)
                  │                                             │
                  │                                             └─── increment() ───┼─── Opcodes.IINC
                  │
                  │                                         ┌─── VIRTUAL ───────────────┼─── Opcodes.INVOKEVIRTUAL
                  │                                         │
                  │                                         ├─── INTERFACE ─────────────┼─── Opcodes.INVOKEINTERFACE
                  │                                         │
                  │                                         ├─── STATIC ────────────────┼─── Opcodes.INVOKESTATIC
                  │                                         │
                  │                                         ├─── SPECIAL ───────────────┼─── Opcodes.INVOKESPECIAL
Opcode::method ───┤                                         │
                  │                                         ├─── SPECIAL_CONSTRUCTOR ───┼─── Opcodes.INVOKESPECIAL
                  │                ┌─── MethodInvocation ───┤
                  │                │                        ├─── VIRTUAL_PRIVATE ───────┼─── Opcodes.INVOKEVIRTUAL
                  │                │                        │
                  │                │                        ├─── INTERFACE_PRIVATE ─────┼─── Opcodes.INVOKEINTERFACE
                  │                │                        │
                  ├─── invoke ─────┤                        ├─── invoke()
                  │                │                        │
                  │                │                        ├─── lookup()
                  │                │                        │
                  │                │                        └─── DynamicInvocation
                  │                │
                  │                └─── HandleInvocation ───┼─── new ───┼─── Opcodes.INVOKEVIRTUAL MethodHandle.invokeExact()
                  │
                  │                                     ┌─── INTEGER ─────┼─── Opcodes.IRETURN
                  │                                     │
                  │                                     ├─── DOUBLE ──────┼─── Opcodes.DRETURN
                  │                                     │
                  │                                     ├─── FLOAT ───────┼─── Opcodes.FRETURN
                  │                                     │
                  │                ┌─── MethodReturn ───┼─── LONG ────────┼─── Opcodes.LRETURN
                  │                │                    │
                  │                │                    ├─── VOID ────────┼─── Opcodes.RETURN
                  │                │                    │
                  └─── exit ───────┤                    ├─── REFERENCE ───┼─── Opcodes.ARETURN
                                   │                    │
                                   │                    └─── of()
                                   │
                                   └─── Throw ──────────┼─── INSTANCE ───┼─── Opcodes.ATHROW
```

### 数组

```text
                 ┌─── ArrayFactory ───┼─── forType() ───┼─── Opcodes.NEWARRAY
                 │
                 ├─── ArrayLength ────┼─── INSTANCE ───┼─── Opcodes.ARRAYLENGTH
                 │
                 │                                      ┌─── Opcodes.BALOAD
                 │                    ┌─── BYTE ────────┤
                 │                    │                 └─── Opcodes.BASTORE
                 │                    │
                 │                    │                 ┌─── Opcodes.SALOAD
                 │                    ├─── SHORT ───────┤
Opcode::array ───┤                    │                 └─── Opcodes.SASTORE
                 │                    │
                 │                    │                 ┌─── Opcodes.CALOAD
                 │                    ├─── CHARACTER ───┤
                 │                    │                 └─── Opcodes.CASTORE
                 │                    │
                 │                    │                 ┌─── Opcodes.IALOAD
                 │                    ├─── INTEGER ─────┤
                 │                    │                 └─── Opcodes.IASTORE
                 │                    │
                 └─── ArrayAccess ────┤                 ┌─── Opcodes.LALOAD
                                      ├─── LONG ────────┤
                                      │                 └─── Opcodes.LASTORE
                                      │
                                      │                 ┌─── Opcodes.FALOAD
                                      ├─── FLOAT ───────┤
                                      │                 └─── Opcodes.FASTORE
                                      │
                                      │                 ┌─── Opcodes.DALOAD
                                      ├─── DOUBLE ──────┤
                                      │                 └─── Opcodes.DASTORE
                                      │
                                      │                 ┌─── Opcodes.AALOAD
                                      ├─── REFERENCE ───┤
                                      │                 └─── Opcodes.AASTORE
                                      │
                                      └─── of()
```

## 栈桢

### 操作数栈

```text
                                     ┌─── ZERO ─────────┼─── Opcodes.NOP
                                     │
                                     ├─── SINGLE ───────┼─── Opcodes.DUP
                                     │
                                     ├─── DOUBLE ───────┼─── Opcodes.DUP2
                                     │
                 ┌─── Duplication ───┤                  ┌─── param ────┼─── TypeDefinition
                 │                   ├─── of() ─────────┤
                 │                   │                  └─── return ───┼─── Duplication
                 │                   │
                 │                   │                  ┌─── param ────┼─── TypeDefinition
                 │                   │                  │
                 │                   └─── flipOver() ───┤                               ┌─── SINGLE_SINGLE: Opcodes.DUP_X1
                 │                                      │                               │
Opcode::stack ───┤                                      │                               ├─── SINGLE_DOUBLE: Opcodes.DUP_X2
                 │                                      └─── return ───┼─── WithFlip ───┤
                 │                                                                      ├─── DOUBLE_SINGLE: Opcodes.DUP2_X1
                 │                                                                      │
                 │                                                                      └─── DOUBLE_DOUBLE: Opcodes.DUP2_X2
                 │
                 │                   ┌─── ZERO ─────┼─── Opcodes.NOP
                 │                   │
                 │                   ├─── SINGLE ───┼─── Opcodes.POP
                 └─── Removal ───────┤
                                     ├─── DOUBLE ───┼─── Opcodes.POP2
                                     │
                                     │              ┌─── param ────┼─── TypeDefinition
                                     └─── of() ─────┤
                                                    └─── return ───┼─── Removal
```
