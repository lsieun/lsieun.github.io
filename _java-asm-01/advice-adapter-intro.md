---
title:  "AdviceAdapter介绍"
sequence: "405"
---

[UP]({% link _posts/2021-04-22-java-asm-season-01.md %})

对于`AdviceAdapter`类来说，能够很容易的实现在“方法进入”和“方法退出”时添加代码。`AdviceAdapter`类的特点：引入了`onMethodEnter()`方法和`onMethodExit()`方法。

## AdviceAdapter类

### class info

第一个部分，`AdviceAdapter`类是一个抽象的（`abstract`）、特殊的`MethodVisitor`类。

具体来说，`AdviceAdapter`类继承自`GeneratorAdapter`类，而`GeneratorAdapter`类继承自`LocalVariablesSorter`类，`LocalVariablesSorter`类继承自`MethodVisitor`类。

- org.objectweb.asm.MethodVisitor
    - org.objectweb.asm.commons.LocalVariablesSorter
        - org.objectweb.asm.commons.GeneratorAdapter
            - org.objectweb.asm.commons.AdviceAdapter

由于`AdviceAdapter`类是抽象类（`abstract`），如果我们想使用这个类，那么就需要实现一个具体的子类。

```java
public abstract class AdviceAdapter extends GeneratorAdapter implements Opcodes {
}
```

### fields

第二个部分，`AdviceAdapter`类定义的字段有哪些。其中，`isConstructor`是判断当前方法是不是构造方法。如果当前方法是构造方法，在“方法进入”时添加代码，需要特殊处理。

```java
public abstract class AdviceAdapter extends GeneratorAdapter implements Opcodes {
    protected int methodAccess;
    protected String methodDesc;

    private final boolean isConstructor;
}
```

### constructors

第三个部分，`AdviceAdapter`类定义的构造方法有哪些。需要注意的是，`AdviceAdapter`的构造方法是用`protected`修饰，因此这个构造方法只能在子类当中访问。换句话说，在外界不能用`new`关键字来创建对象。

```java
public abstract class AdviceAdapter extends GeneratorAdapter implements Opcodes {
    protected AdviceAdapter(final int api, final MethodVisitor methodVisitor,
                            final int access, final String name, final String descriptor) {
        super(api, methodVisitor, access, name, descriptor);
        methodAccess = access;
        methodDesc = descriptor;
        isConstructor = "<init>".equals(name);
    }
}
```

### methods

第四个部分，`AdviceAdapter`类定义的方法有哪些。

在`AdviceAdapter`类的方法中，定义了两个重要的方法：`onMethodEnter()`方法和`onMethodExit()`方法。

- `onMethodEnter()`方法：在“方法进入”的时候，添加一些代码逻辑。
- `onMethodExit()`方法：在“方法退出”的时候，添加一些代码逻辑。

```java
public abstract class AdviceAdapter extends GeneratorAdapter implements Opcodes {
    // Generates the "before" advice for the visited method.
    // The default implementation of this method does nothing.
    // Subclasses can use or change all the local variables, but should not change state of the stack.
    // This method is called at the beginning of the method or
    // after super class constructor has been called (in constructors).
    protected void onMethodEnter() {}

    // Generates the "after" advice for the visited method.
    // The default implementation of this method does nothing.
    // Subclasses can use or change all the local variables, but should not change state of the stack.
    // This method is called at the end of the method, just before return and athrow instructions.
    // The top element on the stack contains the return value or the exception instance.
    protected void onMethodExit(final int opcode) {}
}
```

如果我们查看一下在哪些地方使用了`onMethodEnter()`和`onMethodExit()`这两个方法，就会发现它们分别在`visitCode()`方法和`visitInsn(int opcode)`方法中调用。使用`onMethodEnter()`和`onMethodExit()`这两个方法，相对于直接使用`visitCode()`方法和`visitInsn(int opcode)`这两个方法，是有一定的优势的：`onMethodEnter()`方法能够处理`<init>()`的复杂情况，而直接使用`visitCode()`方法则可能导致`<init>()`方法出现错误。

## 示例: 打印方法参数

在使用`AdviceAdapter`的时候，需要注意：Subclasses can use or change all the local variables, but should not change state of the stack.

### 预期目标

```java
public class HelloWorld {
    private String name;
    private int age;

    public HelloWorld(String name, int age) {
        this.name = name;
        this.age = age;
    }

    public void test(long idCard, Object obj) {
        int hashCode = 0;
        hashCode += name.hashCode();
        hashCode += age;
        hashCode += (int) (idCard % Integer.MAX_VALUE);
        hashCode += obj.hashCode();
        hashCode = Math.abs(hashCode);
        System.out.println("Hash Code is " + hashCode);
        if (hashCode % 2 == 1) {
            throw new RuntimeException("illegal");
        }
    }
}
```

### 编码实现

```java
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Arrays;
import java.util.Date;

public class ParameterUtils {
    private static final DateFormat fm = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");

    public static void printValueOnStack(Object value) {
        if (value == null) {
            System.out.println("    " + value);
        }
        else if (value instanceof String) {
            System.out.println("    " + value);
        }
        else if (value instanceof Date) {
            System.out.println("    " + fm.format(value));
        }
        else if (value instanceof char[]) {
            System.out.println("    " + Arrays.toString((char[])value));
        }
        else {
            System.out.println("    " + value.getClass() + ": " + value.toString());
        }
    }

    public static void printText(String str) {
        System.out.println(str);
    }
}
```

```java
import org.objectweb.asm.ClassVisitor;
import org.objectweb.asm.MethodVisitor;
import org.objectweb.asm.Type;
import org.objectweb.asm.commons.AdviceAdapter;

public class ClassPrintParameterVisitor extends ClassVisitor {
    public ClassPrintParameterVisitor(int api, ClassVisitor classVisitor) {
        super(api, classVisitor);
    }

    @Override
    public MethodVisitor visitMethod(int access, String name, String descriptor, String signature, String[] exceptions) {
        MethodVisitor mv = super.visitMethod(access, name, descriptor, signature, exceptions);
        if (mv != null) {
            mv = new MethodPrintParameterAdapter(api, mv, access, name, descriptor);
        }
        return mv;
    }

    public static class MethodPrintParameterAdapter extends AdviceAdapter {
        public MethodPrintParameterAdapter(int api, MethodVisitor mv, int access, String name, String descriptor) {
            super(api, mv, access, name, descriptor);
        }

        @Override
        protected void onMethodEnter() {
            int slotIndex = (methodAccess & ACC_STATIC) != 0 ? 0 : 1;

            printMessage("Method Enter: " + getName() + methodDesc);

            Type methodType = Type.getMethodType(methodDesc);
            Type[] argumentTypes = methodType.getArgumentTypes();
            for (int i = 0; i < argumentTypes.length; i++) {
                Type t = argumentTypes[i];
                loadArg(i);
                box(t);
                printValueOnStack("(Ljava/lang/Object;)V");
            }
        }

        @Override
        protected void onMethodExit(int opcode) {
            printMessage("Method Exit: " + getName() + methodDesc);

            if (opcode == ATHROW) {
                super.visitLdcInsn("abnormal return");
            }
            else if (opcode == RETURN) {
                super.visitLdcInsn("return void");
            }
            else if (opcode == ARETURN) {
                dup();
            }
            else {
                if (opcode == LRETURN || opcode == DRETURN) {
                    dup2();
                }
                else {
                    dup();
                }
                box(Type.getReturnType(this.methodDesc));
            }
            printValueOnStack("(Ljava/lang/Object;)V");
        }

        private void printMessage(String str) {
            super.visitLdcInsn(str);
            super.visitMethodInsn(INVOKESTATIC, "sample/ParameterUtils", "printText", "(Ljava/lang/String;)V", false);
        }

        private void printValueOnStack(String descriptor) {
            super.visitMethodInsn(INVOKESTATIC, "sample/ParameterUtils", "printValueOnStack", descriptor, false);
        }
    }
}
```

### 进行转换

```java
import lsieun.utils.FileUtils;
import org.objectweb.asm.ClassReader;
import org.objectweb.asm.ClassVisitor;
import org.objectweb.asm.ClassWriter;
import org.objectweb.asm.Opcodes;

public class HelloWorldTransformCore {
    public static void main(String[] args) {
        String relative_path = "sample/HelloWorld.class";
        String filepath = FileUtils.getFilePath(relative_path);
        byte[] bytes1 = FileUtils.readBytes(filepath);

        //（1）构建ClassReader
        ClassReader cr = new ClassReader(bytes1);

        //（2）构建ClassWriter
        ClassWriter cw = new ClassWriter(ClassWriter.COMPUTE_FRAMES);

        //（3）串连ClassVisitor
        int api = Opcodes.ASM9;
        ClassVisitor cv = new ClassPrintParameterVisitor(api, cw);

        //（4）结合ClassReader和ClassVisitor
        int parsingOptions = ClassReader.SKIP_DEBUG | ClassReader.SKIP_FRAMES;
        cr.accept(cv, parsingOptions);

        //（5）生成byte[]
        byte[] bytes2 = cw.toByteArray();

        FileUtils.writeBytes(filepath, bytes2);
    }
}
```

### 验证结果

```java
import java.util.Date;

public class HelloWorldRun {
    public static void main(String[] args) {
        HelloWorld instance = new HelloWorld("tomcat", 10);
        instance.test(441622197605122816L, new Date());
    }
}
```

## 总结

本文对`AdviceAdapter`类进行介绍，内容总结如下：

- 第一点，从使用场景的角度来说，`AdviceAdapter`类能够很容易的在“方法进入”时和“方法退出”时添加一些代码。
- 第二点，在`AdviceAdapter`类当中，有两个关键的方法，即`onMethodEnter()`和`onMethodExit()`方法。
- 第三点，Subclasses can use or change all the local variables, but should not change state of the stack.
- 第四点，有一些很特殊的情况，`AdviceAdapter`类是不能正常处理的。比如说，一些代码经过混淆（obfuscate）之后，ByteCode的内容就会变得复杂，就会出现处理不了的情况。这个时候，我们还是应该回归到`visitCode()`和`visitInsn(opcode)`方法来解决问题。
