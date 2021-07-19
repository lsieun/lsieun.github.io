---
title:  "opcode: method (5/140/205)"
sequence: "207"
---

## 概览

从Instruction的角度来说，与method相关的opcode有5个，内容如下：

| opcode | mnemonic symbol | opcode | mnemonic symbol | opcode | mnemonic symbol |
|--------|-----------------|--------|-----------------|--------|-----------------|
| 182    | invokevirtual   | 184    | invokestatic    | 186    | invokedynamic   |
| 183    | invokespecial   | 185    | invokeinterface | 187    |                 |

从ASM的角度来说，这些opcode与`MethodVisitor.visitXxxInsn()`方法对应关系如下：

- `MethodVisitor.visitMethodInsn()`: `invokevirtual`, `invokespecial`, `invokestatic`, `invokeinterface`
- `MethodVisitor.visitInvokeDynamicInsn()`: `invokedynamic`

static方法，在local variables索引为`0`的位置，存储的可能是方法的第一个参数或方法体内定义的局部变量。

方法调用，是先把方法所需要的参数加载到operand stack上，最后再进行方法的调用。

## invokevirtual

从Java语言的视角，有一个`HelloWorld`类，代码如下：

```java
public class HelloWorld {
    public void publicMethod(String name, int age) {
        // do nothing
    }

    protected void protectedMethod() {
        // do nothing
    }

    void packageMethod() {
        // do nothing
    }

    public void test() {
        publicMethod("tomcat", 10);
        protectedMethod();
        packageMethod();
        String str = toString();
    }
}
```

从Instruction的视角来看，方法体对应的内容如下：

```text
$ javap -c sample.HelloWorld
Compiled from "HelloWorld.java"
public class sample.HelloWorld {
...
  public void test();
    Code:
       0: aload_0
       1: ldc           #2                  // String tomcat
       3: bipush        10
       5: invokevirtual #3                  // Method publicMethod:(Ljava/lang/String;I)V
       8: aload_0
       9: invokevirtual #4                  // Method protectedMethod:()V
      12: aload_0
      13: invokevirtual #5                  // Method packageMethod:()V
      16: aload_0
      17: invokevirtual #6                  // Method java/lang/Object.toString:()Ljava/lang/String;
      20: astore_1
      21: return
}
```

从ASM的视角来看，方法体对应的内容如下：

```text
methodVisitor.visitCode();
methodVisitor.visitVarInsn(ALOAD, 0);
methodVisitor.visitLdcInsn("tomcat");
methodVisitor.visitIntInsn(BIPUSH, 10);
methodVisitor.visitMethodInsn(INVOKEVIRTUAL, "sample/HelloWorld", "publicMethod", "(Ljava/lang/String;I)V", false);
methodVisitor.visitVarInsn(ALOAD, 0);
methodVisitor.visitMethodInsn(INVOKEVIRTUAL, "sample/HelloWorld", "protectedMethod", "()V", false);
methodVisitor.visitVarInsn(ALOAD, 0);
methodVisitor.visitMethodInsn(INVOKEVIRTUAL, "sample/HelloWorld", "packageMethod", "()V", false);
methodVisitor.visitVarInsn(ALOAD, 0);
methodVisitor.visitMethodInsn(INVOKEVIRTUAL, "java/lang/Object", "toString", "()Ljava/lang/String;", false);
methodVisitor.visitVarInsn(ASTORE, 1);
methodVisitor.visitInsn(RETURN);
methodVisitor.visitMaxs(3, 2);
methodVisitor.visitEnd();
```

从Frame的视角来看，local variable和operand stack的变化：

```text
[sample/HelloWorld] []
[sample/HelloWorld] [sample/HelloWorld]
[sample/HelloWorld] [sample/HelloWorld, java/lang/String]
[sample/HelloWorld] [sample/HelloWorld, java/lang/String, int]
[sample/HelloWorld] []
[sample/HelloWorld] [sample/HelloWorld]
[sample/HelloWorld] []
[sample/HelloWorld] [sample/HelloWorld]
[sample/HelloWorld] []
[sample/HelloWorld] [sample/HelloWorld]
[sample/HelloWorld] [java/lang/String]
[sample/HelloWorld, java/lang/String] []
[] []
```

从JVM规范的角度来看，`invokevirtual`指令对应的Operand Stack的变化如下：

```text
..., objectref, [arg1, [arg2 ...]] →

...
```

The `objectref` must be followed on the operand stack by `nargs` argument values, where the number, type, and order of the values must be consistent with the descriptor of the selected instance method.

## invokespecial

从JVM规范的角度来看，`invokespecial`指令对应的Operand Stack的变化如下：

```text
..., objectref, [arg1, [arg2 ...]] →

...
```

The `objectref` must be of type reference and must be followed on the operand stack by `nargs` argument values, where the number, type, and order of the values must be consistent with the descriptor of the selected instance method.

### invoke constructor

从Java语言的视角，有一个`HelloWorld`类，代码如下：

```java
public class HelloWorld {
    public void test() {
        HelloWorld instance = new HelloWorld();
    }
}
```

从Instruction的视角来看，方法体对应的内容如下：

```text
$ javap -c sample.HelloWorld
Compiled from "HelloWorld.java"
public class sample.HelloWorld {
...
  public void test();
    Code:
       0: new           #2                  // class sample/HelloWorld
       3: dup
       4: invokespecial #3                  // Method "<init>":()V
       7: astore_1
       8: return
}
```

从ASM的视角来看，方法体对应的内容如下：

```text
methodVisitor.visitCode();
methodVisitor.visitTypeInsn(NEW, "sample/HelloWorld");
methodVisitor.visitInsn(DUP);
methodVisitor.visitMethodInsn(INVOKESPECIAL, "sample/HelloWorld", "<init>", "()V", false);
methodVisitor.visitVarInsn(ASTORE, 1);
methodVisitor.visitInsn(RETURN);
methodVisitor.visitMaxs(2, 2);
methodVisitor.visitEnd();
```

从Frame的视角来看，local variable和operand stack的变化：

```text
[sample/HelloWorld] []
[sample/HelloWorld] [uninitialized_sample/HelloWorld]
[sample/HelloWorld] [uninitialized_sample/HelloWorld, uninitialized_sample/HelloWorld]
[sample/HelloWorld] [sample/HelloWorld]
[sample/HelloWorld, sample/HelloWorld] []
[] []
```

### invoke private method

从Java语言的视角，有一个`HelloWorld`类，代码如下：

```java
public class HelloWorld {
    private void privateMethod() {
        // do nothing
    }

    public void test() {
        privateMethod();
    }
}
```

从Instruction的视角来看，方法体对应的内容如下：

```text
$ javap -c sample.HelloWorld
Compiled from "HelloWorld.java"
public class sample.HelloWorld {
...
  public void test();
    Code:
       0: aload_0
       1: invokespecial #2                  // Method privateMethod:()V
       4: return
}
```

从ASM的视角来看，方法体对应的内容如下：

```text
methodVisitor.visitCode();
methodVisitor.visitVarInsn(ALOAD, 0);
methodVisitor.visitMethodInsn(INVOKESPECIAL, "sample/HelloWorld", "privateMethod", "()V", false);
methodVisitor.visitInsn(RETURN);
methodVisitor.visitMaxs(1, 1);
methodVisitor.visitEnd();
```

从Frame的视角来看，local variable和operand stack的变化：

```text
[sample/HelloWorld] []
[sample/HelloWorld] [sample/HelloWorld]
[sample/HelloWorld] []
[] []
```

### invoke super method

从Java语言的视角，有一个`HelloWorld`类，代码如下：

```java
public class HelloWorld {
    public void test() {
        String str = super.toString();
    }
}
```

从Instruction的视角来看，方法体对应的内容如下：

```text
$ javap -c sample.HelloWorld
Compiled from "HelloWorld.java"
public class sample.HelloWorld {
...
  public void test();
    Code:
       0: aload_0
       1: invokespecial #2                  // Method java/lang/Object.toString:()Ljava/lang/String;
       4: astore_1
       5: return
}
```

从ASM的视角来看，方法体对应的内容如下：

```text
methodVisitor.visitCode();
methodVisitor.visitVarInsn(ALOAD, 0);
methodVisitor.visitMethodInsn(INVOKESPECIAL, "java/lang/Object", "toString", "()Ljava/lang/String;", false);
methodVisitor.visitVarInsn(ASTORE, 1);
methodVisitor.visitInsn(RETURN);
methodVisitor.visitMaxs(1, 2);
methodVisitor.visitEnd();
```

从Frame的视角来看，local variable和operand stack的变化：

```text
[sample/HelloWorld] []
[sample/HelloWorld] [sample/HelloWorld]
[sample/HelloWorld] [java/lang/String]
[sample/HelloWorld, java/lang/String] []
[] []
```

## invokestatic

从Java语言的视角，有一个`HelloWorld`类，代码如下：

```java
public class HelloWorld {
    public static void staticPublicMethod(String name, int age) {
        // do nothing
    }

    protected static void staticProtectedMethod() {
        // do nothing
    }

    static void staticPackageMethod() {
        // do nothing
    }

    public void test() {
        staticPublicMethod("tomcat", 10);
        staticProtectedMethod();
        staticPackageMethod();
    }
}
```

从Instruction的视角来看，方法体对应的内容如下：

```text
$ javap -c sample.HelloWorld
Compiled from "HelloWorld.java"
public class sample.HelloWorld {
...
  public void test();
    Code:
       0: ldc           #2                  // String tomcat
       2: bipush        10
       4: invokestatic  #3                  // Method staticPublicMethod:(Ljava/lang/String;I)V
       7: invokestatic  #4                  // Method staticProtectedMethod:()V
      10: invokestatic  #5                  // Method staticPackageMethod:()V
      13: return
}
```

从ASM的视角来看，方法体对应的内容如下：

```text
methodVisitor.visitCode();
methodVisitor.visitLdcInsn("tomcat");
methodVisitor.visitIntInsn(BIPUSH, 10);
methodVisitor.visitMethodInsn(INVOKESTATIC, "sample/HelloWorld", "staticPublicMethod", "(Ljava/lang/String;I)V", false);
methodVisitor.visitMethodInsn(INVOKESTATIC, "sample/HelloWorld", "staticProtectedMethod", "()V", false);
methodVisitor.visitMethodInsn(INVOKESTATIC, "sample/HelloWorld", "staticPackageMethod", "()V", false);
methodVisitor.visitInsn(RETURN);
methodVisitor.visitMaxs(2, 1);
methodVisitor.visitEnd();
```

从Frame的视角来看，local variable和operand stack的变化：

```text
[sample/HelloWorld] []
[sample/HelloWorld] [java/lang/String]
[sample/HelloWorld] [java/lang/String, int]
[sample/HelloWorld] []
[sample/HelloWorld] []
[sample/HelloWorld] []
[] []
```

从JVM规范的角度来看，`invokestatic`指令对应的Operand Stack的变化如下：

```text
..., [arg1, [arg2 ...]] →

...
```

The operand stack must contain `nargs` argument values, where the number, type, and order of the values must be consistent with the descriptor of the resolved method.

## invokeinterface

从Java语言的视角，有一个`HelloWorld`类，代码如下：

```java
public class HelloWorld {
    public void test() {
        MyInterface instance = new MyInterface() {
            @Override
            public void targetMethod() {
                // do nothing
            }
        };
        instance.defaultMethod();
        instance.targetMethod();
        MyInterface.staticMethod();
    }
}

interface MyInterface {
    static void staticMethod() {
        // do nothing
    }

    default void defaultMethod() {
        // do nothing
    }

    void targetMethod();
}
```

从Instruction的视角来看，方法体对应的内容如下：

```text
$ javap -c sample.HelloWorld
Compiled from "HelloWorld.java"
public class sample.HelloWorld {
...
  public void test();
    Code:
       0: new           #2                  // class sample/HelloWorld$1
       3: dup
       4: aload_0
       5: invokespecial #3                  // Method sample/HelloWorld$1."<init>":(Lsample/HelloWorld;)V
       8: astore_1
       9: aload_1
      10: invokeinterface #4,  1            // InterfaceMethod sample/MyInterface.defaultMethod:()V
      15: aload_1
      16: invokeinterface #5,  1            // InterfaceMethod sample/MyInterface.targetMethod:()V
      21: invokestatic  #6                  // InterfaceMethod sample/MyInterface.staticMethod:()V
      24: return
}
```

从ASM的视角来看，方法体对应的内容如下：

```text
methodVisitor.visitCode();
methodVisitor.visitTypeInsn(NEW, "sample/HelloWorld$1");
methodVisitor.visitInsn(DUP);
methodVisitor.visitVarInsn(ALOAD, 0);
methodVisitor.visitMethodInsn(INVOKESPECIAL, "sample/HelloWorld$1", "<init>", "(Lsample/HelloWorld;)V", false);
methodVisitor.visitVarInsn(ASTORE, 1);
methodVisitor.visitVarInsn(ALOAD, 1);
methodVisitor.visitMethodInsn(INVOKEINTERFACE, "sample/MyInterface", "defaultMethod", "()V", true);
methodVisitor.visitVarInsn(ALOAD, 1);
methodVisitor.visitMethodInsn(INVOKEINTERFACE, "sample/MyInterface", "targetMethod", "()V", true);
methodVisitor.visitMethodInsn(INVOKESTATIC, "sample/MyInterface", "staticMethod", "()V", true);
methodVisitor.visitInsn(RETURN);
methodVisitor.visitMaxs(3, 2);
methodVisitor.visitEnd();
```

从Frame的视角来看，local variable和operand stack的变化：

```text
[sample/HelloWorld] []
[sample/HelloWorld] [uninitialized_sample/HelloWorld$1]
[sample/HelloWorld] [uninitialized_sample/HelloWorld$1, uninitialized_sample/HelloWorld$1]
[sample/HelloWorld] [uninitialized_sample/HelloWorld$1, uninitialized_sample/HelloWorld$1, sample/HelloWorld]
[sample/HelloWorld] [sample/HelloWorld$1]
[sample/HelloWorld, sample/HelloWorld$1] []
[sample/HelloWorld, sample/HelloWorld$1] [sample/HelloWorld$1]
[sample/HelloWorld, sample/HelloWorld$1] []
[sample/HelloWorld, sample/HelloWorld$1] [sample/HelloWorld$1]
[sample/HelloWorld, sample/HelloWorld$1] []
[sample/HelloWorld, sample/HelloWorld$1] []
[] []
```

从JVM规范的角度来看，`invokeinterface`指令对应的Operand Stack的变化如下：

```text
..., objectref, [arg1, [arg2 ...]] →

...
```

The `objectref` must be of type `reference` and must be followed on the operand stack by `nargs` argument values, where the number, type, and order of the values must be consistent with the descriptor of the resolved interface method.

## invokedynamic

从Java语言的视角，有一个`HelloWorld`类，代码如下：

```java
import java.util.function.Consumer;

public class HelloWorld {
    public void test() {
        Consumer<String> c = System.out::println;
    }
}
```

从Instruction的视角来看，方法体对应的内容如下：

```text
$ javap -c sample.HelloWorld
Compiled from "HelloWorld.java"
public class sample.HelloWorld {
...
  public void test();
    Code:
       0: getstatic     #2                  // Field java/lang/System.out:Ljava/io/PrintStream;
       3: dup
       4: invokevirtual #3                  // Method java/lang/Object.getClass:()Ljava/lang/Class;
       7: pop
       8: invokedynamic #4,  0              // InvokeDynamic #0:accept:(Ljava/io/PrintStream;)Ljava/util/function/Consumer;
      13: astore_1
      14: return
}
```

从ASM的视角来看，方法体对应的内容如下：

```text
methodVisitor.visitCode();
methodVisitor.visitFieldInsn(GETSTATIC, "java/lang/System", "out", "Ljava/io/PrintStream;");
methodVisitor.visitInsn(DUP);
methodVisitor.visitMethodInsn(INVOKEVIRTUAL, "java/lang/Object", "getClass", "()Ljava/lang/Class;", false);
methodVisitor.visitInsn(POP);
methodVisitor.visitInvokeDynamicInsn("accept", "(Ljava/io/PrintStream;)Ljava/util/function/Consumer;", 
    new Handle(Opcodes.H_INVOKESTATIC, "java/lang/invoke/LambdaMetafactory", "metafactory", 
        "(Ljava/lang/invoke/MethodHandles$Lookup;Ljava/lang/String;Ljava/lang/invoke/MethodType;Ljava/lang/invoke/MethodType;Ljava/lang/invoke/MethodHandle;Ljava/lang/invoke/MethodType;)Ljava/lang/invoke/CallSite;", false), 
    new Object[]{Type.getType("(Ljava/lang/Object;)V"), 
    new Handle(Opcodes.H_INVOKEVIRTUAL, "java/io/PrintStream", "println", "(Ljava/lang/String;)V", false), 
    Type.getType("(Ljava/lang/String;)V")});
methodVisitor.visitVarInsn(ASTORE, 1);
methodVisitor.visitInsn(RETURN);
methodVisitor.visitMaxs(2, 2);
methodVisitor.visitEnd();
```

从Frame的视角来看，local variable和operand stack的变化：

```text
[sample/HelloWorld] []
[sample/HelloWorld] [java/io/PrintStream]
[sample/HelloWorld] [java/io/PrintStream, java/io/PrintStream]
[sample/HelloWorld] [java/io/PrintStream, java/lang/Class]
[sample/HelloWorld] [java/io/PrintStream]
[sample/HelloWorld] [java/util/function/Consumer]
[sample/HelloWorld, java/util/function/Consumer] []
[] []
```

从JVM规范的角度来看，`invokedynamic`指令对应的Operand Stack的变化如下：

```text
..., [arg1, [arg2 ...]] →

...
```
