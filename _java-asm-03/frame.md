---
title:  "Frame"
sequence: "403"
---

[上级目录]({% link _posts/2021-05-01-java-asm-season-03.md %})

## Frame

### class info

```java
public class Frame {
}
```

### fields

```java
public class Frame {
    private Value returnValue;
    private Value[] values;

    private int numLocals;
    private int numStack;
}
```

### constructors

```java
public class Frame {
    public Frame(int numLocals, int numStack) {
        this.values = new Value[numLocals + numStack];
        this.numLocals = numLocals;
        // 注意，这里并没有对numStack字段进行赋值。
    }
}
```

### methods

#### locals

```java
public class Frame {
    public int getLocals() {
        return numLocals;
    }

    public Value getLocal(final int index) {
        if (index >= numLocals) {
            throw new IndexOutOfBoundsException("Trying to get an inexistant local variable " + index);
        }
        return values[index];
    }

    public void setLocal(int index, Value value) {
        if (index >= numLocals) {
            throw new IndexOutOfBoundsException("Trying to set an inexistant local variable " + index);
        }
        values[index] = value;
    }
}
```

#### stack

```java
public class Frame {
    public int getMaxStackSize() {
        return values.length - numLocals;
    }

    public int getStackSize() {
        return numStack;
    }

    public void clearStack() {
        numStack = 0;
    }

    public Value getStack(int index) {
        return values[numLocals + index];
    }

    public void setStack(int index, Value value) {
        values[numLocals + index] = value;
    }

    public Value pop() {
        if (numStack == 0) {
            throw new IndexOutOfBoundsException("Cannot pop operand off an empty stack.");
        }
        return values[numLocals + (--numStack)];
    }

    public void push(final Value value) {
        if (numLocals + numStack >= values.length) {
            throw new IndexOutOfBoundsException("Insufficient maximum stack size.");
        }
        values[numLocals + (numStack++)] = value;
    }
}
```

#### execute

```java
public class Frame {
    public void execute(final AbstractInsnNode insn, final Interpreter<V> interpreter) throws AnalyzerException {
        V value1;
        V value2;
        V value3;
        V value4;
        int var;

        switch (insn.getOpcode()) {
            case Opcodes.NOP:
                break;
            case Opcodes.ACONST_NULL:
            case Opcodes.ICONST_M1:
            case Opcodes.ICONST_0:
            case Opcodes.ICONST_1:
            case Opcodes.ICONST_2:
            case Opcodes.ICONST_3:
            case Opcodes.ICONST_4:
            case Opcodes.ICONST_5:
            case Opcodes.LCONST_0:
            case Opcodes.LCONST_1:
            case Opcodes.FCONST_0:
            case Opcodes.FCONST_1:
            case Opcodes.FCONST_2:
            case Opcodes.DCONST_0:
            case Opcodes.DCONST_1:
            case Opcodes.BIPUSH:
            case Opcodes.SIPUSH:
            case Opcodes.LDC:
                push(interpreter.newOperation(insn));
                break;
            case Opcodes.ILOAD:
            case Opcodes.LLOAD:
            case Opcodes.FLOAD:
            case Opcodes.DLOAD:
            case Opcodes.ALOAD:
                push(interpreter.copyOperation(insn, getLocal(((VarInsnNode) insn).var)));
                break;
            case Opcodes.ISTORE:
            case Opcodes.LSTORE:
            case Opcodes.FSTORE:
            case Opcodes.DSTORE:
            case Opcodes.ASTORE:
                value1 = interpreter.copyOperation(insn, pop());
                var = ((VarInsnNode) insn).var;
                setLocal(var, value1);
                if (value1.getSize() == 2) {
                    setLocal(var + 1, interpreter.newEmptyValue(var + 1));
                }
                if (var > 0) {
                    Value local = getLocal(var - 1);
                    if (local != null && local.getSize() == 2) {
                        setLocal(var - 1, interpreter.newEmptyValue(var - 1));
                    }
                }
                break;
            case Opcodes.IASTORE:
            case Opcodes.LASTORE:
            case Opcodes.FASTORE:
            case Opcodes.DASTORE:
            case Opcodes.AASTORE:
            case Opcodes.BASTORE:
            case Opcodes.CASTORE:
            case Opcodes.SASTORE:
                value3 = pop();
                value2 = pop();
                value1 = pop();
                interpreter.ternaryOperation(insn, value1, value2, value3);
                break;
            case Opcodes.POP:
                if (pop().getSize() == 2) {
                    throw new AnalyzerException(insn, "Illegal use of POP");
                }
                break;
            case Opcodes.POP2:
                if (pop().getSize() == 1 && pop().getSize() != 1) {
                    throw new AnalyzerException(insn, "Illegal use of POP2");
                }
                break;
            case Opcodes.DUP:
                value1 = pop();
                if (value1.getSize() != 1) {
                    throw new AnalyzerException(insn, "Illegal use of DUP");
                }
                push(value1);
                push(interpreter.copyOperation(insn, value1));
                break;
            case Opcodes.DUP_X1:
                value1 = pop();
                value2 = pop();
                if (value1.getSize() != 1 || value2.getSize() != 1) {
                    throw new AnalyzerException(insn, "Illegal use of DUP_X1");
                }
                push(interpreter.copyOperation(insn, value1));
                push(value2);
                push(value1);
                break;
            case Opcodes.DUP_X2:
                value1 = pop();
                if (value1.getSize() == 1 && executeDupX2(insn, value1, interpreter)) {
                    break;
                }
                throw new AnalyzerException(insn, "Illegal use of DUP_X2");
            case Opcodes.DUP2:
                value1 = pop();
                if (value1.getSize() == 1) {
                    value2 = pop();
                    if (value2.getSize() == 1) {
                        push(value2);
                        push(value1);
                        push(interpreter.copyOperation(insn, value2));
                        push(interpreter.copyOperation(insn, value1));
                        break;
                    }
                } else {
                    push(value1);
                    push(interpreter.copyOperation(insn, value1));
                    break;
                }
                throw new AnalyzerException(insn, "Illegal use of DUP2");
            case Opcodes.DUP2_X1:
                value1 = pop();
                if (value1.getSize() == 1) {
                    value2 = pop();
                    if (value2.getSize() == 1) {
                        value3 = pop();
                        if (value3.getSize() == 1) {
                            push(interpreter.copyOperation(insn, value2));
                            push(interpreter.copyOperation(insn, value1));
                            push(value3);
                            push(value2);
                            push(value1);
                            break;
                        }
                    }
                } else {
                    value2 = pop();
                    if (value2.getSize() == 1) {
                        push(interpreter.copyOperation(insn, value1));
                        push(value2);
                        push(value1);
                        break;
                    }
                }
                throw new AnalyzerException(insn, "Illegal use of DUP2_X1");
            case Opcodes.DUP2_X2:
                value1 = pop();
                if (value1.getSize() == 1) {
                    value2 = pop();
                    if (value2.getSize() == 1) {
                        value3 = pop();
                        if (value3.getSize() == 1) {
                            value4 = pop();
                            if (value4.getSize() == 1) {
                                push(interpreter.copyOperation(insn, value2));
                                push(interpreter.copyOperation(insn, value1));
                                push(value4);
                                push(value3);
                                push(value2);
                                push(value1);
                                break;
                            }
                        } else {
                            push(interpreter.copyOperation(insn, value2));
                            push(interpreter.copyOperation(insn, value1));
                            push(value3);
                            push(value2);
                            push(value1);
                            break;
                        }
                    }
                } else if (executeDupX2(insn, value1, interpreter)) {
                    break;
                }
                throw new AnalyzerException(insn, "Illegal use of DUP2_X2");
            case Opcodes.SWAP:
                value2 = pop();
                value1 = pop();
                if (value1.getSize() != 1 || value2.getSize() != 1) {
                    throw new AnalyzerException(insn, "Illegal use of SWAP");
                }
                push(interpreter.copyOperation(insn, value2));
                push(interpreter.copyOperation(insn, value1));
                break;
            case Opcodes.IALOAD:
            case Opcodes.LALOAD:
            case Opcodes.FALOAD:
            case Opcodes.DALOAD:
            case Opcodes.AALOAD:
            case Opcodes.BALOAD:
            case Opcodes.CALOAD:
            case Opcodes.SALOAD:
            case Opcodes.IADD:
            case Opcodes.LADD:
            case Opcodes.FADD:
            case Opcodes.DADD:
            case Opcodes.ISUB:
            case Opcodes.LSUB:
            case Opcodes.FSUB:
            case Opcodes.DSUB:
            case Opcodes.IMUL:
            case Opcodes.LMUL:
            case Opcodes.FMUL:
            case Opcodes.DMUL:
            case Opcodes.IDIV:
            case Opcodes.LDIV:
            case Opcodes.FDIV:
            case Opcodes.DDIV:
            case Opcodes.IREM:
            case Opcodes.LREM:
            case Opcodes.FREM:
            case Opcodes.DREM:
            case Opcodes.ISHL:
            case Opcodes.LSHL:
            case Opcodes.ISHR:
            case Opcodes.LSHR:
            case Opcodes.IUSHR:
            case Opcodes.LUSHR:
            case Opcodes.IAND:
            case Opcodes.LAND:
            case Opcodes.IOR:
            case Opcodes.LOR:
            case Opcodes.IXOR:
            case Opcodes.LXOR:
            case Opcodes.LCMP:
            case Opcodes.FCMPL:
            case Opcodes.FCMPG:
            case Opcodes.DCMPL:
            case Opcodes.DCMPG:
                value2 = pop();
                value1 = pop();
                push(interpreter.binaryOperation(insn, value1, value2));
                break;
            case Opcodes.INEG:
            case Opcodes.LNEG:
            case Opcodes.FNEG:
            case Opcodes.DNEG:
                push(interpreter.unaryOperation(insn, pop()));
                break;
            case Opcodes.IINC:
                var = ((IincInsnNode) insn).var;
                setLocal(var, interpreter.unaryOperation(insn, getLocal(var)));
                break;
            case Opcodes.I2L:
            case Opcodes.I2F:
            case Opcodes.I2D:
            case Opcodes.L2I:
            case Opcodes.L2F:
            case Opcodes.L2D:
            case Opcodes.F2I:
            case Opcodes.F2L:
            case Opcodes.F2D:
            case Opcodes.D2I:
            case Opcodes.D2L:
            case Opcodes.D2F:
            case Opcodes.I2B:
            case Opcodes.I2C:
            case Opcodes.I2S:
                push(interpreter.unaryOperation(insn, pop()));
                break;
            case Opcodes.IFEQ:
            case Opcodes.IFNE:
            case Opcodes.IFLT:
            case Opcodes.IFGE:
            case Opcodes.IFGT:
            case Opcodes.IFLE:
                interpreter.unaryOperation(insn, pop());
                break;
            case Opcodes.IF_ICMPEQ:
            case Opcodes.IF_ICMPNE:
            case Opcodes.IF_ICMPLT:
            case Opcodes.IF_ICMPGE:
            case Opcodes.IF_ICMPGT:
            case Opcodes.IF_ICMPLE:
            case Opcodes.IF_ACMPEQ:
            case Opcodes.IF_ACMPNE:
            case Opcodes.PUTFIELD:
                value2 = pop();
                value1 = pop();
                interpreter.binaryOperation(insn, value1, value2);
                break;
            case Opcodes.GOTO:
                break;
            case Opcodes.JSR:
                push(interpreter.newOperation(insn));
                break;
            case Opcodes.RET:
                break;
            case Opcodes.TABLESWITCH:
            case Opcodes.LOOKUPSWITCH:
                interpreter.unaryOperation(insn, pop());
                break;
            case Opcodes.IRETURN:
            case Opcodes.LRETURN:
            case Opcodes.FRETURN:
            case Opcodes.DRETURN:
            case Opcodes.ARETURN:
                value1 = pop();
                interpreter.unaryOperation(insn, value1);
                interpreter.returnOperation(insn, value1, returnValue);
                break;
            case Opcodes.RETURN:
                if (returnValue != null) {
                    throw new AnalyzerException(insn, "Incompatible return type");
                }
                break;
            case Opcodes.GETSTATIC:
                push(interpreter.newOperation(insn));
                break;
            case Opcodes.PUTSTATIC:
                interpreter.unaryOperation(insn, pop());
                break;
            case Opcodes.GETFIELD:
                push(interpreter.unaryOperation(insn, pop()));
                break;
            case Opcodes.INVOKEVIRTUAL:
            case Opcodes.INVOKESPECIAL:
            case Opcodes.INVOKESTATIC:
            case Opcodes.INVOKEINTERFACE:
                executeInvokeInsn(insn, ((MethodInsnNode) insn).desc, interpreter);
                break;
            case Opcodes.INVOKEDYNAMIC:
                executeInvokeInsn(insn, ((InvokeDynamicInsnNode) insn).desc, interpreter);
                break;
            case Opcodes.NEW:
                push(interpreter.newOperation(insn));
                break;
            case Opcodes.NEWARRAY:
            case Opcodes.ANEWARRAY:
            case Opcodes.ARRAYLENGTH:
                push(interpreter.unaryOperation(insn, pop()));
                break;
            case Opcodes.ATHROW:
                interpreter.unaryOperation(insn, pop());
                break;
            case Opcodes.CHECKCAST:
            case Opcodes.INSTANCEOF:
                push(interpreter.unaryOperation(insn, pop()));
                break;
            case Opcodes.MONITORENTER:
            case Opcodes.MONITOREXIT:
                interpreter.unaryOperation(insn, pop());
                break;
            case Opcodes.MULTIANEWARRAY:
                List<V> valueList = new ArrayList<>();
                for (int i = ((MultiANewArrayInsnNode) insn).dims; i > 0; --i) {
                    valueList.add(0, pop());
                }
                push(interpreter.naryOperation(insn, valueList));
                break;
            case Opcodes.IFNULL:
            case Opcodes.IFNONNULL:
                interpreter.unaryOperation(insn, pop());
                break;
            default:
                throw new AnalyzerException(insn, "Illegal opcode " + insn.getOpcode());
        }
    }
}
```
