---
title: "MethodVisitor 代码示例"
sequence: "209"
---

[上级目录]({% link _posts/2021-06-01-java-asm-index.md %})

![What ASM Can Do](/assets/images/java/asm/what-asm-can-do.png)

在当前阶段，我们只能进行 Class Generation 的操作。

## 示例一：`<init>()` 方法

在 `.class` 文件中，构造方法的名字是 `<init>`，它表示 instance **init**ialization method 的缩写。

### 预期目标

```java
public class HelloWorld {
}
```

或者：

```java
public class HelloWorld {
    public HelloWorld() {
        super();
    }
}
```

### 编码实现

```java
import lsieun.utils.FileUtils;
import org.objectweb.asm.ClassWriter;
import org.objectweb.asm.MethodVisitor;

import static org.objectweb.asm.Opcodes.*;

public class HelloWorldGenerateCore {
    public static void main(String[] args) throws Exception {
        String relative_path = "sample/HelloWorld.class";
        String filepath = FileUtils.getFilePath(relative_path);

        // (1) 生成 byte[] 内容
        byte[] bytes = dump();

        // (2) 保存 byte[] 到文件
        FileUtils.writeBytes(filepath, bytes);
    }

    public static byte[] dump() throws Exception {
        // (1) 创建 ClassWriter 对象
        ClassWriter cw = new ClassWriter(ClassWriter.COMPUTE_FRAMES);

        // (2) 调用 visitXxx() 方法
        cw.visit(V1_8, ACC_PUBLIC + ACC_SUPER, "sample/HelloWorld", null, "java/lang/Object", null);

        {
            MethodVisitor mv1 = cw.visitMethod(ACC_PUBLIC, "<init>", "()V", null, null);
            mv1.visitCode();
            mv1.visitVarInsn(ALOAD, 0);
            mv1.visitMethodInsn(INVOKESPECIAL, "java/lang/Object", "<init>", "()V", false);
            mv1.visitInsn(RETURN);
            mv1.visitMaxs(1, 1);
            mv1.visitEnd();
        }

        cw.visitEnd();

        // (3) 调用 toByteArray() 方法
        return cw.toByteArray();
    }
}
```

### 验证结果

```java
public class HelloWorldRun {
    public static void main(String[] args) throws Exception {
        Class<?> clazz = Class.forName("sample.HelloWorld");
        System.out.println(clazz);
    }
}
```

### Frame 的变化

对于 `HelloWorld` 类中 `<init>()` 方法对应的 Instruction 内容如下：

```text
$ javap -c sample.HelloWorld
public sample.HelloWorld();
  Code:
     0: aload_0
     1: invokespecial #9                  // Method java/lang/Object."<init>":()V
     4: return
```

该方法对应的 Frame 变化情况如下：

```text
<init>()V
[uninitialized_this] []
[uninitialized_this] [uninitialized_this]
[sample/HelloWorld] []
[] []
```

在这里，我们看到一个很“不一样”的变量，就是 `uninitialized_this`，它就是一个“引用”，它指向的内存空间还没有初始化；等经过初始化之后，`uninitialized_this` 变量就变成 `this` 变量。

### 小总结

通过上面的示例，我们注意四个知识点：

- 第一点，如何使用 `ClassWriter` 类。
    - 第一步，创建 `ClassWriter` 类的实例。
    - 第二步，调用 `ClassWriter` 类的 `visitXxx()` 方法。
    - 第三步，调用 `ClassWriter` 类的 `toByteArray()` 方法。
- 第二点，在使用 `MethodVisitor` 类时，其中 `visitXxx()` 方法需要遵循的调用顺序。
    - 第一步，调用 `visitCode()` 方法，调用一次
    - 第二步，调用 `visitXxxInsn()` 方法，可以调用多次
    - 第三步，调用 `visitMaxs()` 方法，调用一次
    - 第四步，调用 `visitEnd()` 方法，调用一次
- 第三点，在 `.class` 文件中，构造方法的名字是 `<init>`。从 Instruction 的角度来讲，调用构造方法会用到 `invokespecial` 指令。
- 第四点，从 Frame 的角度来讲，在构造方法 `<init>()` 中，local variables 当中索引为 `0` 的位置存储的是什么呢？如果还没有进行初始化操作，就是 `uninitialized_this` 变量；如果已经进行了初始化操作，就是 `this` 变量。

```text
                     ┌─── static method ─────┼─── invokestatic
                     │
                     │                       ┌─── invokevirtual (class)
                     │                       │
                     │                       │                                   ┌─── constructor
                     │                       │                                   │
method invocation ───┼─── instance method ───┼─── invokespecial (class) ─────────┼─── private
                     │                       │                                   │
                     │                       │                                   └─── super
                     │                       │
                     │                       └─── invokeinterface (interface)
                     │
                     └─── dynamic method ────┼─── invokedynamic
```

## 示例二：`<clinit>` 方法

在 `.class` 文件中，静态初始化方法的名字是 `<clinit>`，它表示**cl**ass **init**ialization method 的缩写。

### 预期目标

```java
public class HelloWorld {
    static {
        System.out.println("class initialization method");
    }
}
```

### 编码实现

```java
import lsieun.utils.FileUtils;
import org.objectweb.asm.ClassWriter;
import org.objectweb.asm.MethodVisitor;

import static org.objectweb.asm.Opcodes.*;

public class HelloWorldGenerateCore {
    public static void main(String[] args) throws Exception {
        String relative_path = "sample/HelloWorld.class";
        String filepath = FileUtils.getFilePath(relative_path);

        // (1) 生成 byte[] 内容
        byte[] bytes = dump();

        // (2) 保存 byte[] 到文件
        FileUtils.writeBytes(filepath, bytes);
    }

    public static byte[] dump() throws Exception {
        // (1) 创建 ClassWriter 对象
        ClassWriter cw = new ClassWriter(ClassWriter.COMPUTE_FRAMES);

        // (2) 调用 visitXxx() 方法
        cw.visit(V1_8, ACC_PUBLIC + ACC_SUPER, "sample/HelloWorld", null, "java/lang/Object", null);

        {
            MethodVisitor mv1 = cw.visitMethod(ACC_PUBLIC, "<init>", "()V", null, null);
            mv1.visitCode();
            mv1.visitVarInsn(ALOAD, 0);
            mv1.visitMethodInsn(INVOKESPECIAL, "java/lang/Object", "<init>", "()V", false);
            mv1.visitInsn(RETURN);
            mv1.visitMaxs(1, 1);
            mv1.visitEnd();
        }

        {
            MethodVisitor mv2 = cw.visitMethod(ACC_STATIC, "<clinit>", "()V", null, null);
            mv2.visitCode();
            mv2.visitFieldInsn(GETSTATIC, "java/lang/System", "out", "Ljava/io/PrintStream;");
            mv2.visitLdcInsn("class initialization method");
            mv2.visitMethodInsn(INVOKEVIRTUAL, "java/io/PrintStream", "println", "(Ljava/lang/String;)V", false);
            mv2.visitInsn(RETURN);
            mv2.visitMaxs(2, 0);
            mv2.visitEnd();
        }

        cw.visitEnd();

        // (3) 调用 toByteArray() 方法
        return cw.toByteArray();
    }
}
```

### 验证结果

```java
public class HelloWorldRun {
    public static void main(String[] args) throws Exception {
        Class<?> clazz = Class.forName("sample.HelloWorld");
        System.out.println(clazz);
    }
}
```

### Frame 的变化

对于 `HelloWorld` 类中 `<clinit>()` 方法对应的 Instruction 内容如下：

```text
$ javap -c sample.HelloWorld
static {};
  Code:
     0: getstatic     #18                 // Field java/lang/System.out:Ljava/io/PrintStream;
     3: ldc           #20                 // String class initialization method
     5: invokevirtual #26                 // Method java/io/PrintStream.println:(Ljava/lang/String;)V
     8: return
```

该方法对应的 Frame 变化情况如下：

```text
<clinit>()V
[] []
[] [java/io/PrintStream]
[] [java/io/PrintStream, java/lang/String]
[] []
[] []
```

### 小总结

通过上面的示例，我们注意三个知识点：

- 第一点，如何使用 `ClassWriter` 类。
- 第二点，在使用 `MethodVisitor` 类时，其中 `visitXxx()` 方法需要遵循的调用顺序。
- 第三点，在 `.class` 文件中，静态初始化方法的名字是 `<clinit>`，它的方法描述符是 `()V`。

## 示例三：创建对象

### 预期目标

假如有一个 `GoodChild` 类，内容如下：

```java
public class GoodChild {
    public String name;
    public int age;

    public GoodChild(String name, int age) {
        this.name = name;
        this.age = age;
    }
}
```

我们的预期目标是生成一个 `HelloWorld` 类：

```java
public class HelloWorld {
    public void test() {
        GoodChild child = new GoodChild("Lucy", 8);
    }
}
```

### 编码实现

```java
import lsieun.utils.FileUtils;
import org.objectweb.asm.ClassWriter;
import org.objectweb.asm.MethodVisitor;

import static org.objectweb.asm.Opcodes.*;

public class HelloWorldGenerateCore {
    public static void main(String[] args) throws Exception {
        String relative_path = "sample/HelloWorld.class";
        String filepath = FileUtils.getFilePath(relative_path);

        // (1) 生成 byte[] 内容
        byte[] bytes = dump();

        // (2) 保存 byte[] 到文件
        FileUtils.writeBytes(filepath, bytes);
    }

    public static byte[] dump() throws Exception {
        // (1) 创建 ClassWriter 对象
        ClassWriter cw = new ClassWriter(ClassWriter.COMPUTE_FRAMES);

        // (2) 调用 visitXxx() 方法
        cw.visit(V1_8, ACC_PUBLIC + ACC_SUPER, "sample/HelloWorld", null, "java/lang/Object", null);

        {
            MethodVisitor mv1 = cw.visitMethod(ACC_PUBLIC, "<init>", "()V", null, null);
            mv1.visitCode();
            mv1.visitVarInsn(ALOAD, 0);
            mv1.visitMethodInsn(INVOKESPECIAL, "java/lang/Object", "<init>", "()V", false);
            mv1.visitInsn(RETURN);
            mv1.visitMaxs(1, 1);
            mv1.visitEnd();
        }

        {
            MethodVisitor mv2 = cw.visitMethod(ACC_PUBLIC, "test", "()V", null, null);
            mv2.visitCode();
            mv2.visitTypeInsn(NEW, "sample/GoodChild");
            mv2.visitInsn(DUP);
            mv2.visitLdcInsn("Lucy");
            mv2.visitIntInsn(BIPUSH, 8);
            mv2.visitMethodInsn(INVOKESPECIAL, "sample/GoodChild", "<init>", "(Ljava/lang/String;I)V", false);
            mv2.visitVarInsn(ASTORE, 1);
            mv2.visitInsn(RETURN);
            mv2.visitMaxs(4, 2);
            mv2.visitEnd();
        }

        cw.visitEnd();

        // (3) 调用 toByteArray() 方法
        return cw.toByteArray();
    }
}
```

### 验证结果

```java
import java.lang.reflect.Method;

public class HelloWorldRun {
    public static void main(String[] args) throws Exception {
        Class<?> clazz = Class.forName("sample.HelloWorld");
        Object obj = clazz.newInstance();

        Method m = clazz.getDeclaredMethod("test");
        m.invoke(obj);
    }
}
```

### Frame 的变化

对于 `HelloWorld` 类中 `test()` 方法对应的 Instruction 内容如下：

```text
$ javap -c sample.HelloWorld
public void test();
  Code:
     0: new           #11                 // class sample/GoodChild
     3: dup
     4: ldc           #13                 // String Lucy
     6: bipush        8
     8: invokespecial #16                 // Method sample/GoodChild."<init>":(Ljava/lang/String;I)V
    11: astore_1
    12: return
```

该方法对应的 Frame 变化情况如下：

```text
test()V
[sample/HelloWorld] []
[sample/HelloWorld] [uninitialized_sample/GoodChild]
[sample/HelloWorld] [uninitialized_sample/GoodChild, uninitialized_sample/GoodChild]
[sample/HelloWorld] [uninitialized_sample/GoodChild, uninitialized_sample/GoodChild, java/lang/String]
[sample/HelloWorld] [uninitialized_sample/GoodChild, uninitialized_sample/GoodChild, java/lang/String, int]
[sample/HelloWorld] [sample/GoodChild]
[sample/HelloWorld, sample/GoodChild] []
[] []
```

### 小总结

通过上面的示例，我们注意四个知识点：

- 第一点，如何使用 `ClassWriter` 类。
- 第二点，在使用 `MethodVisitor` 类时，其中 `visitXxx()` 方法需要遵循的调用顺序。
- 第三点，从 Instruction 的角度来讲，创建对象的指令集合：
    - `new`
    - `dup`
    - `invokespecial`
- 第四点，从 Frame 的角度来讲，在创建新对象的时候，执行 `new` 指令之后，它是 uninitialized 状态，执行 `invokespecial` 指令之后，它是一个“合格”的对象。

## 示例四：调用方法

### 预期目标

```java
public class HelloWorld {
    public void test(int a, int b) {
        int val = Math.max(a, b); // 对 static 方法进行调用
        System.out.println(val);  // 对 non-static 方法进行调用
    }
}
```

### 编码实现

```java
import lsieun.utils.FileUtils;
import org.objectweb.asm.ClassWriter;
import org.objectweb.asm.MethodVisitor;

import static org.objectweb.asm.Opcodes.*;

public class HelloWorldGenerateCore {
    public static void main(String[] args) throws Exception {
        String relative_path = "sample/HelloWorld.class";
        String filepath = FileUtils.getFilePath(relative_path);

        // (1) 生成 byte[] 内容
        byte[] bytes = dump();

        // (2) 保存 byte[] 到文件
        FileUtils.writeBytes(filepath, bytes);
    }

    public static byte[] dump() throws Exception {
        // (1) 创建 ClassWriter 对象
        ClassWriter cw = new ClassWriter(ClassWriter.COMPUTE_FRAMES);

        // (2) 调用 visitXxx() 方法
        cw.visit(V1_8, ACC_PUBLIC + ACC_SUPER, "sample/HelloWorld", null, "java/lang/Object", null);

        {
            MethodVisitor mv1 = cw.visitMethod(ACC_PUBLIC, "<init>", "()V", null, null);
            mv1.visitCode();
            mv1.visitVarInsn(ALOAD, 0);
            mv1.visitMethodInsn(INVOKESPECIAL, "java/lang/Object", "<init>", "()V", false);
            mv1.visitInsn(RETURN);
            mv1.visitMaxs(1, 1);
            mv1.visitEnd();
        }

        {
            MethodVisitor mv2 = cw.visitMethod(ACC_PUBLIC, "test", "(II)V", null, null);
            mv2.visitCode();
            mv2.visitVarInsn(ILOAD, 1);
            mv2.visitVarInsn(ILOAD, 2);
            mv2.visitMethodInsn(INVOKESTATIC, "java/lang/Math", "max", "(II)I", false);
            mv2.visitVarInsn(ISTORE, 3);
            mv2.visitFieldInsn(GETSTATIC, "java/lang/System", "out", "Ljava/io/PrintStream;");
            mv2.visitVarInsn(ILOAD, 3);
            mv2.visitMethodInsn(INVOKEVIRTUAL, "java/io/PrintStream", "println", "(I)V", false);
            mv2.visitInsn(RETURN);
            mv2.visitMaxs(2, 4);
            mv2.visitEnd();
        }

        cw.visitEnd();

        // (3) 调用 toByteArray() 方法
        return cw.toByteArray();
    }
}
```

### 验证结果

```java
import java.lang.reflect.Method;

public class HelloWorldRun {
    public static void main(String[] args) throws Exception {
        Class<?> clazz = Class.forName("sample.HelloWorld");
        Object obj = clazz.newInstance();

        Method m = clazz.getDeclaredMethod("test", int.class, int.class);
        m.invoke(obj, 10, 20);
    }
}
```

### Frame 的变化

对于 `HelloWorld` 类中 `test()` 方法对应的 Instruction 内容如下：

```text
$ javap -c sample.HelloWorld
public void test(int, int);
  Code:
     0: iload_1
     1: iload_2
     2: invokestatic  #21                 // Method java/lang/Math.max:(II)I
     5: istore_3
     6: getstatic     #27                 // Field java/lang/System.out:Ljava/io/PrintStream;
     9: iload_3
    10: invokevirtual #33                 // Method java/io/PrintStream.println:(I)V
    13: return
```

该方法对应的 Frame 变化情况如下：

```text
test(II)V
[sample/HelloWorld, int, int] []
[sample/HelloWorld, int, int] [int]
[sample/HelloWorld, int, int] [int, int]
[sample/HelloWorld, int, int] [int]
[sample/HelloWorld, int, int, int] []
[sample/HelloWorld, int, int, int] [java/io/PrintStream]
[sample/HelloWorld, int, int, int] [java/io/PrintStream, int]
[sample/HelloWorld, int, int, int] []
[] []
```

### 小总结

通过上面的示例，我们注意四个知识点：

- 第一点，如何使用 `ClassWriter` 类。
- 第二点，在使用 `MethodVisitor` 类时，其中 `visitXxx()` 方法需要遵循的调用顺序。
- 第三点，从 Instruction 的角度来讲，调用 static 方法是使用 `invokestatic` 指令，调用 non-static 方法一般使用 `invokevirtual` 指令。
- 第四点，从 Frame 的角度来讲，实现方法的调用，需要先将 `this` 变量和方法接收的参数放到 operand stack 上。

## 示例五：不调用 `visitMaxs()` 方法

在创建 `ClassWriter` 对象时，使用了 `ClassWriter.COMPUTE_FRAMES` 选项。

```text
ClassWriter cw = new ClassWriter(ClassWriter.COMPUTE_FRAMES);
```

使用 `ClassWriter.COMPUTE_FRAMES` 后，ASM 会自动计算 max stacks、max locals 和 stack map frames 的具体值。
从代码的角度来说，使用 `ClassWriter.COMPUTE_FRAMES`，会忽略我们在代码中 `visitMaxs()` 方法和 `visitFrame()` 方法传入的具体参数值。
换句话说，无论我们传入的参数值是否正确，ASM 会帮助我们从新计算一个正确的值，代替我们在代码中传入的参数。

- 第 1 种情况，在创建 `ClassWriter` 对象时，`flags` 参数使用 `ClassWriter.COMPUTE_FRAMES` 值，在调用 `mv.visitMaxs(0, 0)` 方法之后，仍然能得到一个正确的 `.class` 文件。
- 第 2 种情况，在创建 `ClassWriter` 对象时，`flags` 参数使用 `0` 值，在调用 `mv.visitMaxs(0, 0)` 方法之后，得到的 `.class` 文件就不能正确运行。

需要注意的是，在创建 `ClassWriter` 对象时，`flags` 参数使用 `ClassWriter.COMPUTE_FRAMES` 值，我们可以给 `visitMaxs()` 方法传入一个错误的值，但是不能省略对于 `visitMaxs()` 方法的调用。
如果我们省略掉 `visitCode()` 和 `visitEnd()` 方法，生成的 `.class` 文件也不会出错；当然，并不建议这么做。但是，如果我们省略掉对于 `visitMaxs()` 方法的调用，生成的 `.class` 文件就会出错。

如果省略掉对于 `visitMaxs()` 方法的调用，会出现如下错误：

```text
Exception in thread "main" java.lang.VerifyError: Operand stack overflow
```

## 示例六：不同的 MethodVisitor 交叉使用

假如我们有两个 `MethodVisitor` 对象 `mv1` 和 `mv2`，如下所示：

```text
MethodVisitor mv1 = cw.visitMethod(...);
MethodVisitor mv2 = cw.visitMethod(...);
```

同时，我们也知道 `MethodVisitor` 类里的 `visitXxx()` 方法需要遵循一定的调用顺序：

- 第一步，调用 `visitCode()` 方法，调用一次
- 第二步，调用 `visitXxxInsn()` 方法，可以调用多次
- 第三步，调用 `visitMaxs()` 方法，调用一次
- 第四步，调用 `visitEnd()` 方法，调用一次

对于 `mv1` 和 `mv2` 这两个对象来说，它们的 `visitXxx()` 方法的调用顺序是彼此独立的、不会相互干扰。

一般情况下，我们可以如下写代码，这样逻辑比较清晰：

```text
MethodVisitor mv1 = cw.visitMethod(...);
mv1.visitCode(...);
mv1.visitXxxInsn(...)
mv1.visitMaxs(...);
mv1.visitEnd();

MethodVisitor mv2 = cw.visitMethod(...);
mv2.visitCode(...);
mv2.visitXxxInsn(...)
mv2.visitMaxs(...);
mv2.visitEnd();
```

但是，我们也可以这样来写代码：

```text
MethodVisitor mv1 = cw.visitMethod(...);
MethodVisitor mv2 = cw.visitMethod(...);

mv1.visitCode(...);
mv2.visitCode(...);

mv2.visitXxxInsn(...)
mv1.visitXxxInsn(...)

mv1.visitMaxs(...);
mv1.visitEnd();
mv2.visitMaxs(...);
mv2.visitEnd();
```

在上面的代码中，`mv1` 和 `mv2` 这两个对象的 `visitXxx()` 方法交叉调用，这是可以的。
换句话说，只要每一个 `MethodVisitor` 对象在调用 `visitXxx()` 方法时，遵循了调用顺序，那结果就是正确的；
不同的 `MethodVisitor` 对象，是相互独立的、不会彼此影响。

那么，可能有的同学会问：`MethodVisitor` 对象交叉使用有什么作用呢？有没有什么场景下的应用呢？回答是“有的”。
在 ASM 当中，有一个 `org.objectweb.asm.commons.StaticInitMerger` 类，其中有一个 `MethodVisitor mergedClinitVisitor` 字段，它就是一个很好的示例，在后续内容中，我们会介绍到这个类。

### 预期目标

```java
import java.util.Date;

public class HelloWorld {
    public void test() {
        System.out.println("This is a test method.");
    }
    
    public void printDate() {
        Date now = new Date();
        System.out.println(now);
    }
}
```

### 编码实现（第一种方式，顺序）

```java
import lsieun.utils.FileUtils;
import org.objectweb.asm.ClassWriter;
import org.objectweb.asm.MethodVisitor;

import static org.objectweb.asm.Opcodes.*;

public class HelloWorldGenerateCore {
    public static void main(String[] args) throws Exception {
        String relative_path = "sample/HelloWorld.class";
        String filepath = FileUtils.getFilePath(relative_path);

        // (1) 生成 byte[] 内容
        byte[] bytes = dump();

        // (2) 保存 byte[] 到文件
        FileUtils.writeBytes(filepath, bytes);
    }

    public static byte[] dump() throws Exception {
        // (1) 创建 ClassWriter 对象
        ClassWriter cw = new ClassWriter(ClassWriter.COMPUTE_FRAMES);

        // (2) 调用 visitXxx() 方法
        cw.visit(V1_8, ACC_PUBLIC + ACC_SUPER, "sample/HelloWorld",
                null, "java/lang/Object", null);

        {
            MethodVisitor mv1 = cw.visitMethod(ACC_PUBLIC, "<init>", "()V", null, null);
            mv1.visitCode();
            mv1.visitVarInsn(ALOAD, 0);
            mv1.visitMethodInsn(INVOKESPECIAL, "java/lang/Object", "<init>", "()V", false);
            mv1.visitInsn(RETURN);
            mv1.visitMaxs(1, 1);
            mv1.visitEnd();
        }

        {
            MethodVisitor mv2 = cw.visitMethod(ACC_PUBLIC, "test", "()V", null, null);
            mv2.visitCode();
            mv2.visitFieldInsn(GETSTATIC, "java/lang/System", "out", "Ljava/io/PrintStream;");
            mv2.visitLdcInsn("This is a test method.");
            mv2.visitMethodInsn(INVOKEVIRTUAL, "java/io/PrintStream", "println", "(Ljava/lang/String;)V", false);
            mv2.visitInsn(RETURN);
            mv2.visitMaxs(2, 1);
            mv2.visitEnd();
        }

        {
            MethodVisitor mv3 = cw.visitMethod(ACC_PUBLIC, "printDate", "()V", null, null);
            mv3.visitCode();
            mv3.visitTypeInsn(NEW, "java/util/Date");
            mv3.visitInsn(DUP);
            mv3.visitMethodInsn(INVOKESPECIAL, "java/util/Date", "<init>", "()V", false);
            mv3.visitVarInsn(ASTORE, 1);
            mv3.visitFieldInsn(GETSTATIC, "java/lang/System", "out", "Ljava/io/PrintStream;");
            mv3.visitVarInsn(ALOAD, 1);
            mv3.visitMethodInsn(INVOKEVIRTUAL, "java/io/PrintStream", "println", "(Ljava/lang/Object;)V", false);
            mv3.visitInsn(RETURN);
            mv3.visitMaxs(2, 2);
            mv3.visitEnd();
        }

        cw.visitEnd();

        // (3) 调用 toByteArray() 方法
        return cw.toByteArray();
    }
}
```

### 编码实现（第二种方式，交叉）

```java
import lsieun.utils.FileUtils;
import org.objectweb.asm.ClassWriter;
import org.objectweb.asm.MethodVisitor;

import static org.objectweb.asm.Opcodes.*;

public class HelloWorldGenerateCore {
    public static void main(String[] args) throws Exception {
        String relative_path = "sample/HelloWorld.class";
        String filepath = FileUtils.getFilePath(relative_path);

        // (1) 生成 byte[] 内容
        byte[] bytes = dump();

        // (2) 保存 byte[] 到文件
        FileUtils.writeBytes(filepath, bytes);
    }

    public static byte[] dump() throws Exception {
        // (1) 创建 ClassWriter 对象
        ClassWriter cw = new ClassWriter(ClassWriter.COMPUTE_FRAMES);

        // (2) 调用 visitXxx() 方法
        cw.visit(V1_8, ACC_PUBLIC + ACC_SUPER, "sample/HelloWorld",
                null, "java/lang/Object", null);

        {
            MethodVisitor mv1 = cw.visitMethod(ACC_PUBLIC, "<init>", "()V", null, null);
            mv1.visitCode();
            mv1.visitVarInsn(ALOAD, 0);
            mv1.visitMethodInsn(INVOKESPECIAL, "java/lang/Object", "<init>", "()V", false);
            mv1.visitInsn(RETURN);
            mv1.visitMaxs(1, 1);
            mv1.visitEnd();
        }

        {
            // 第 1 部分，mv2
            MethodVisitor mv2 = cw.visitMethod(ACC_PUBLIC, "test", "()V", null, null);

            // 第 2 部分，mv3
            MethodVisitor mv3 = cw.visitMethod(ACC_PUBLIC, "printDate", "()V", null, null);
            mv3.visitCode();
            mv3.visitTypeInsn(NEW, "java/util/Date");
            mv3.visitInsn(DUP);
            mv3.visitMethodInsn(INVOKESPECIAL, "java/util/Date", "<init>", "()V", false);

            // 第 3 部分，mv2
            mv2.visitCode();
            mv2.visitFieldInsn(GETSTATIC, "java/lang/System", "out", "Ljava/io/PrintStream;");
            mv2.visitLdcInsn("This is a test method.");
            mv2.visitMethodInsn(INVOKEVIRTUAL, "java/io/PrintStream", "println", "(Ljava/lang/String;)V", false);

            // 第 4 部分，mv3
            mv3.visitVarInsn(ASTORE, 1);
            mv3.visitFieldInsn(GETSTATIC, "java/lang/System", "out", "Ljava/io/PrintStream;");
            mv3.visitVarInsn(ALOAD, 1);
            mv3.visitMethodInsn(INVOKEVIRTUAL, "java/io/PrintStream", "println", "(Ljava/lang/Object;)V", false);

            // 第 5 部分，mv2
            mv2.visitInsn(RETURN);
            mv2.visitMaxs(2, 1);
            mv2.visitEnd();

            // 第 6 部分，mv3
            mv3.visitInsn(RETURN);
            mv3.visitMaxs(2, 2);
            mv3.visitEnd();
        }

        cw.visitEnd();

        // (3) 调用 toByteArray() 方法
        return cw.toByteArray();
    }
}
```

### 验证结果

```java
import java.lang.reflect.Method;

public class HelloWorldRun {
    public static void main(String[] args) throws Exception {
        Class<?> clazz = Class.forName("sample.HelloWorld");
        Object instance = clazz.newInstance();
        invokeMethod(clazz, "test", instance);
        invokeMethod(clazz, "printDate", instance);
    }

    public static void invokeMethod(Class<?> clazz, String methodName, Object instance) throws Exception {
        Method m = clazz.getDeclaredMethod(methodName);
        m.invoke(instance);
    }
}
```

## 总结

本文主要介绍了 `MethodVisitor` 类的示例，内容总结如下：

- 第一点，要注意 `MethodVisitor` 类里 `visitXxx()` 的调用顺序
    - 第一步，调用 `visitCode()` 方法，调用一次
    - 第二步，调用 `visitXxxInsn()` 方法，可以调用多次
    - 第三步，调用 `visitMaxs()` 方法，调用一次
    - 第四步，调用 `visitEnd()` 方法，调用一次
- 第二点，在 `.class` 文件当中，构造方法的名字是 `<init>`，静态初始化方法的名字是 `<clinit>`。
- 第三点，针对方法里包含的 Instruction 内容，需要放到 Frame 当中才能更好的理解。对每一条 Instruction 来说，它都有可能引起 local variables 和 operand stack 的变化。
- 第四点，在使用 `COMPUTE_FRAMES` 的前提下，我们可以给 `visitMaxs()` 方法参数传入错误的值，但不能忽略对于 `visitMaxs()` 方法的调用。
- 第五点，不同的 `MethodVisitor` 对象，它们的 `visitXxx()` 方法是彼此独立的，只要各自遵循方法的调用顺序，就能够得到正确的结果。

最后，本文列举的代码示例是有限的，能够讲到 `visitXxxInsn()` 方法也是有限的。针对于某一个具体的 `visitXxxInsn()` 方法，我们可能不太了解它的作用和如何使用它，这个是需要我们在日后的使用过程中一点一点积累和熟悉起来的。
