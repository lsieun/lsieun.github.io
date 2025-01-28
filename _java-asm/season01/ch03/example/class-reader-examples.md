---
title: "ClassReader 代码示例"
sequence: "302"
---

[上级目录]({% link _posts/2021-06-01-java-asm-index.md %})

在现阶段，我们接触了 `ClassVisitor`、`ClassWriter` 和 `ClassReader` 类，因此可以介绍 Class Transformation 的操作。

![What ASM Can Do](/assets/images/java/asm/what-asm-can-do.png)

## 整体思路

对于一个 `.class` 文件进行 Class Transformation 操作，整体思路是这样的：

```text
ClassReader --> ClassVisitor(1) --> ... --> ClassVisitor(N) --> ClassWriter
```

其中，

- `ClassReader` 类，是 ASM 提供的一个类，可以直接拿来使用。
- `ClassWriter` 类，是 ASM 提供的一个类，可以直接拿来使用。
- `ClassVisitor` 类，是 ASM 提供的一个抽象类，因此需要写代码提供一个 `ClassVisitor` 的子类，在这个子类当中可以实现对 `.class` 文件进行各种处理操作。换句话说，进行 Class Transformation 操作，编写 `ClassVisitor` 的子类是关键。

## 修改类的信息

### 示例一：修改类的版本

预期目标：假如有一个 `HelloWorld.java` 文件，经过 Java 8 编译之后，生成的 `HelloWorld.class` 文件的版本就是 Java 8 的版本，我们的目标是将 `HelloWorld.class` 由 Java 8 版本转换成 Java 7 版本。

```java
public class HelloWorld {
}
```

编码实现：

```java
import org.objectweb.asm.ClassVisitor;
import org.objectweb.asm.Opcodes;

public class ClassChangeVersionVisitor extends ClassVisitor {
    public ClassChangeVersionVisitor(int api, ClassVisitor classVisitor) {
        super(api, classVisitor);
    }

    @Override
    public void visit(int version, int access, String name, String signature, String superName, String[] interfaces) {
        super.visit(Opcodes.V1_7, access, name, signature, superName, interfaces);
    }
}
```

进行转换：

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

        //（1）构建 ClassReader
        ClassReader cr = new ClassReader(bytes1);

        //（2）构建 ClassWriter
        ClassWriter cw = new ClassWriter(ClassWriter.COMPUTE_FRAMES);

        //（3）串连 ClassVisitor
        int api = Opcodes.ASM9;
        ClassVisitor cv = new ClassChangeVersionVisitor(api, cw);

        //（4）结合 ClassReader 和 ClassVisitor
        int parsingOptions = ClassReader.SKIP_DEBUG | ClassReader.SKIP_FRAMES;
        cr.accept(cv, parsingOptions);

        //（5）生成 byte[]
        byte[] bytes2 = cw.toByteArray();

        FileUtils.writeBytes(filepath, bytes2);
    }
}
```

验证结果：

```text
$ javap -p -v sample.HelloWorld
```

### 示例二：修改类的接口

预期目标：在下面的 `HelloWorld` 类中，我们定义了一个 `clone()` 方法，但存在一个问题，也就是，如果没有实现 `Cloneable` 接口，`clone()` 方法就会出错，我们的目标是希望通过 ASM 为 `HelloWorld` 类添加上 `Cloneable` 接口。

```java
public class HelloWorld {
    @Override
    public Object clone() throws CloneNotSupportedException {
        return super.clone();
    }
}
```

编码实现：

```java
import org.objectweb.asm.ClassVisitor;

public class ClassCloneVisitor extends ClassVisitor {
    public ClassCloneVisitor(int api, ClassVisitor cw) {
        super(api, cw);
    }

    @Override
    public void visit(int version, int access, String name, String signature, String superName, String[] interfaces) {
        super.visit(version, access, name, signature, superName, new String[]{"java/lang/Cloneable"});
    }
}
```

注意：`ClassCloneVisitor` 这个类写的比较简单，直接添加 `java/lang/Cloneable` 接口信息；在项目代码当中，有一个 `ClassAddInterfaceVisitor` 类，实现更灵活。

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

        //（1）构建 ClassReader
        ClassReader cr = new ClassReader(bytes1);

        //（2）构建 ClassWriter
        ClassWriter cw = new ClassWriter(ClassWriter.COMPUTE_FRAMES);

        //（3）串连 ClassVisitor
        int api = Opcodes.ASM9;
        ClassVisitor cv = new ClassCloneVisitor(api, cw);

        //（4）结合 ClassReader 和 ClassVisitor
        int parsingOptions = ClassReader.SKIP_DEBUG | ClassReader.SKIP_FRAMES;
        cr.accept(cv, parsingOptions);

        //（5）生成 byte[]
        byte[] bytes2 = cw.toByteArray();

        FileUtils.writeBytes(filepath, bytes2);
    }
}
```

验证结果：

```java
public class HelloWorldRun {
    public static void main(String[] args) throws Exception {
        HelloWorld obj = new HelloWorld();
        Object anotherObj = obj.clone();
        System.out.println(anotherObj);
    }
}
```

### 小总结

我们看到上面的两个例子，一个是修改类的版本信息，另一个是修改类的接口信息，那么这两个示例都是基于 `ClassVisitor.visit()` 方法实现的：

```text
public void visit(int version, int access, String name, String signature, String superName, String[] interfaces)
```

这两个示例，就是通过修改 `visit()` 方法的参数实现的：

- 修改类的版本信息，是通过修改 `version` 这个参数实现的
- 修改类的接口信息，是通过修改 `interfaces` 这个参数实现的

其实，在 `visit()` 方法当中的其它参数也可以修改：

- 修改 `access` 参数，也就是修改了类的访问标识信息。
- 修改 `name` 参数，也就是修改了类的名称。但是，在大多数的情况下，不推荐修改 `name` 参数。因为调用类里的方法，都是先找到类，再找到相应的方法；如果将当前类的类名修改成别的名称，那么其它类当中可能就找不到原来的方法了，因为类名已经改了。但是，也有少数的情况，可以修改 `name` 参数，比如说对代码进行混淆（obfuscate）操作。
- 修改 `superName` 参数，也就是修改了当前类的父类信息。

## 修改字段信息

### 示例三：删除字段

预期目标：删除掉 `HelloWorld` 类里的 `String strValue` 字段。

```java
public class HelloWorld {
    public int intValue;
    public String strValue; // 删除这个字段
}
```

编码实现：

```java
import org.objectweb.asm.ClassVisitor;
import org.objectweb.asm.FieldVisitor;

public class ClassRemoveFieldVisitor extends ClassVisitor {
    private final String fieldName;
    private final String fieldDesc;

    public ClassRemoveFieldVisitor(int api, ClassVisitor cv, String fieldName, String fieldDesc) {
        super(api, cv);
        this.fieldName = fieldName;
        this.fieldDesc = fieldDesc;
    }

    @Override
    public FieldVisitor visitField(int access, String name, String descriptor, String signature, Object value) {
        if (name.equals(fieldName) && descriptor.equals(fieldDesc)) {
            // 对于想删除的字段，返回一个 null 值
            return null;
        }
        else {
            // 对于不想删除的字段，正常处理
            return super.visitField(access, name, descriptor, signature, value);
        }
    }
}
```

上面代码思路的关键就是 `ClassVisitor.visitField()` 方法。在正常的情况下，`ClassVisitor.visitField()` 方法返回一个 `FieldVisitor` 对象；但是，如果 `ClassVisitor.visitField()` 方法返回的是 `null`，就么能够达到删除该字段的效果。

我们之前说过一个形象的类比，就是将 `ClassReader` 类比喻成河流的“源头”，而 `ClassVisitor` 类比喻成河流的经过的路径上的“水库”，而 `ClassWriter` 类则比喻成“大海”，也就是河水的最终归处。如果说，其中一个“水库”拦截了一部分水流，那么这部分水流就到不了“大海”了；这就相当于 `ClassVisitor.visitField()` 方法返回的是 `null`，从而能够达到删除该字段的效果。。

或者说，换一种类比，用信件的传递作类比。将 `ClassReader` 类想像成信件的“发出地”，将 `ClassVisitor` 类想像成信件运送途中经过的“驿站”，将 `ClassWriter` 类想像成信件的“接收地”；如果是在某个“驿站”中将其中一封邮件丢失了，那么这封信件就抵达不了“接收地”了。

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

        //（1）构建 ClassReader
        ClassReader cr = new ClassReader(bytes1);

        //（2）构建 ClassWriter
        ClassWriter cw = new ClassWriter(ClassWriter.COMPUTE_FRAMES);

        //（3）串连 ClassVisitor
        int api = Opcodes.ASM9;
        ClassVisitor cv = new ClassRemoveFieldVisitor(api, cw, "strValue", "Ljava/lang/String;");

        //（4）结合 ClassReader 和 ClassVisitor
        int parsingOptions = ClassReader.SKIP_DEBUG | ClassReader.SKIP_FRAMES;
        cr.accept(cv, parsingOptions);

        //（5）生成 byte[]
        byte[] bytes2 = cw.toByteArray();

        FileUtils.writeBytes(filepath, bytes2);
    }
}
```

验证结果：

```java
import java.lang.reflect.Field;

public class HelloWorldRun {
    public static void main(String[] args) throws Exception {
        Class<?> clazz = Class.forName("sample.HelloWorld");
        System.out.println(clazz.getName());

        Field[] declaredFields = clazz.getDeclaredFields();
        for (Field f : declaredFields) {
            System.out.println("    " + f.getName());
        }
    }
}
```

### 示例四：添加字段

预期目标：为了 `HelloWorld` 类添加一个 `Object objValue` 字段。

```java
public class HelloWorld {
    public int intValue;
    public String strValue;
    // 添加一个 Object objValue 字段
}
```

编码实现：

```java
import org.objectweb.asm.ClassVisitor;
import org.objectweb.asm.FieldVisitor;

public class ClassAddFieldVisitor extends ClassVisitor {
    private final int fieldAccess;
    private final String fieldName;
    private final String fieldDesc;
    private boolean isFieldPresent;

    public ClassAddFieldVisitor(int api, ClassVisitor classVisitor, int fieldAccess, String fieldName, String fieldDesc) {
        super(api, classVisitor);
        this.fieldAccess = fieldAccess;
        this.fieldName = fieldName;
        this.fieldDesc = fieldDesc;
    }

    @Override
    public FieldVisitor visitField(int access, String name, String descriptor, String signature, Object value) {
        if (name.equals(fieldName)) {
            isFieldPresent = true;
        }
        return super.visitField(access, name, descriptor, signature, value);
    }

    @Override
    public void visitEnd() {
        if (!isFieldPresent) {
            FieldVisitor fv = super.visitField(fieldAccess, fieldName, fieldDesc, null, null);
            if (fv != null) {
                fv.visitEnd();
            }
        }
        super.visitEnd();
    }
}
```

上面的代码思路：第一步，在 `visitField()` 方法中，判断某个字段是否已经存在，其结果存在于 `isFieldPresent` 字段当中；第二步，就是在 `visitEnd()` 方法中，根据 `isFieldPresent` 字段的值，来决定是否添加新的字段。

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

        //（1）构建 ClassReader
        ClassReader cr = new ClassReader(bytes1);

        //（2）构建 ClassWriter
        ClassWriter cw = new ClassWriter(ClassWriter.COMPUTE_FRAMES);

        //（3）串连 ClassVisitor
        int api = Opcodes.ASM9;
        ClassVisitor cv = new ClassAddFieldVisitor(api, cw, Opcodes.ACC_PUBLIC, "objValue", "Ljava/lang/Object;");

        //（4）结合 ClassReader 和 ClassVisitor
        int parsingOptions = ClassReader.SKIP_DEBUG | ClassReader.SKIP_FRAMES;
        cr.accept(cv, parsingOptions);

        //（5）生成 byte[]
        byte[] bytes2 = cw.toByteArray();

        FileUtils.writeBytes(filepath, bytes2);
    }
}
```

验证结果：

```java
import java.lang.reflect.Field;

public class HelloWorldRun {
    public static void main(String[] args) throws Exception {
        Class<?> clazz = Class.forName("sample.HelloWorld");
        System.out.println(clazz.getName());

        Field[] declaredFields = clazz.getDeclaredFields();
        for (Field f : declaredFields) {
            System.out.println("    " + f.getName());
        }
    }
}
```

### 小总结

对于字段的操作，都是基于 `ClassVisitor.visitField()` 方法来实现的：

```text
public FieldVisitor visitField(int access, String name, String descriptor, String signature, Object value);
```

那么，对于字段来说，可以进行哪些操作呢？有三种类型的操作：

- 修改现有的字段。例如，修改字段的名字、修改字段的类型、修改字段的访问标识，这些需要通过修改 `visitField()` 方法的参数来实现。
- 删除已有的字段。在 `visitField()` 方法中，返回 `null` 值，就能够达到删除字段的效果。
- 添加新的字段。在 `visitField()` 方法中，判断该字段是否已经存在；在 `visitEnd()` 方法中，如果该字段不存在，则添加新字段。

一般情况下来说，不推荐“修改已有的字段”，也不推荐“删除已有的字段”，原因如下：

- 不推荐“修改已有的字段”，因为这可能会引起字段的名字不匹配、字段的类型不匹配，从而导致程序报错。例如，假如在 `HelloWorld` 类里有一个 `intValue` 字段，而且 `GoodChild` 类里也使用到了 `HelloWorld` 类的这个 `intValue` 字段；如果我们将 `HelloWorld` 类里的 `intValue` 字段名字修改为 `myValue`，那么 `GoodChild` 类就再也找不到 `intValue` 字段了，这个时候，程序就会出错。当然，如果我们把 `GoodChild` 类里对于 `intValue` 字段的引用修改成 `myValue`，那也不会出错了。但是，我们要保证所有使用 `intValue` 字段的地方，都要进行修改，这样才能让程序不报错。
- 不推荐“删除已有的字段”，因为一般来说，类里的字段都是有作用的，如果随意的删除就会造成字段缺失，也会导致程序报错。

为什么不在 `ClassVisitor.visitField()` 方法当中来添加字段呢？如果在 `ClassVisitor.visitField()` 方法，就可能添加重复的字段，这样就不是一个合法的 ClassFile 了。

## 修改方法信息

### 示例五：删除方法

预期目标：删除掉 `HelloWorld` 类里的 `add()` 方法。

```java
public class HelloWorld {
    public int add(int a, int b) { // 删除 add 方法
        return a + b;
    }

    public int sub(int a, int b) {
        return a - b;
    }
}
```

编码实现：

```java
import org.objectweb.asm.ClassVisitor;
import org.objectweb.asm.MethodVisitor;

public class ClassRemoveMethodVisitor extends ClassVisitor {
    private final String methodName;
    private final String methodDesc;

    public ClassRemoveMethodVisitor(int api, ClassVisitor cv, String methodName, String methodDesc) {
        super(api, cv);
        this.methodName = methodName;
        this.methodDesc = methodDesc;
    }

    @Override
    public MethodVisitor visitMethod(int access, String name, String descriptor, String signature, String[] exceptions) {
        if (name.equals(methodName) && descriptor.equals(methodDesc)) {
            return null;
        }
        else {
            return super.visitMethod(access, name, descriptor, signature, exceptions);
        }
    }
}
```

上面删除方法的代码思路，与删除字段的代码思路是一样的。

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

        //（1）构建 ClassReader
        ClassReader cr = new ClassReader(bytes1);

        //（2）构建 ClassWriter
        ClassWriter cw = new ClassWriter(ClassWriter.COMPUTE_FRAMES);

        //（3）串连 ClassVisitor
        int api = Opcodes.ASM9;
        ClassVisitor cv = new ClassRemoveMethodVisitor(api, cw, "add", "(II)I");

        //（4）结合 ClassReader 和 ClassVisitor
        int parsingOptions = ClassReader.SKIP_DEBUG | ClassReader.SKIP_FRAMES;
        cr.accept(cv, parsingOptions);

        //（5）生成 byte[]
        byte[] bytes2 = cw.toByteArray();

        FileUtils.writeBytes(filepath, bytes2);
    }
}
```

验证结果：

```java
import java.lang.reflect.Method;

public class HelloWorldRun {
    public static void main(String[] args) throws Exception {
        Class<?> clazz = Class.forName("sample.HelloWorld");
        System.out.println(clazz.getName());

        Method[] declaredMethods = clazz.getDeclaredMethods();
        for (Method m : declaredMethods) {
            System.out.println("    " + m.getName());
        }
    }
}
```

### 示例六：添加方法

预期目标：为 `HelloWorld` 类添加一个 `mul()` 方法。

```java
public class HelloWorld {
    public int add(int a, int b) {
        return a + b;
    }

    public int sub(int a, int b) {
        return a - b;
    }

    // TODO: 添加一个乘法
}
```

编码实现：

```java
import org.objectweb.asm.ClassVisitor;
import org.objectweb.asm.MethodVisitor;

public abstract class ClassAddMethodVisitor extends ClassVisitor {
    private final int methodAccess;
    private final String methodName;
    private final String methodDesc;
    private final String methodSignature;
    private final String[] methodExceptions;
    private boolean isMethodPresent;

    public ClassAddMethodVisitor(int api, ClassVisitor cv, int methodAccess, String methodName, String methodDesc,
                                 String signature, String[] exceptions) {
        super(api, cv);
        this.methodAccess = methodAccess;
        this.methodName = methodName;
        this.methodDesc = methodDesc;
        this.methodSignature = signature;
        this.methodExceptions = exceptions;
        this.isMethodPresent = false;
    }

    @Override
    public MethodVisitor visitMethod(int access, String name, String descriptor, String signature, String[] exceptions) {
        if (name.equals(methodName) && descriptor.equals(methodDesc)) {
            isMethodPresent = true;
        }
        return super.visitMethod(access, name, descriptor, signature, exceptions);
    }

    @Override
    public void visitEnd() {
        if (!isMethodPresent) {
            MethodVisitor mv = super.visitMethod(methodAccess, methodName, methodDesc, methodSignature, methodExceptions);
            if (mv != null) {
                // create method body
                generateMethodBody(mv);
            }
        }

        super.visitEnd();
    }

    protected abstract void generateMethodBody(MethodVisitor mv);
}
```

添加新的方法，和添加新的字段的思路，在前期，两者是一样的，都是先要判断该字段或该方法是否已经存在；但是，在后期，两者会有一些差异，因为方法需要有“方法体”，在上面的代码中，我们定义了一个 `generateMethodBody()` 方法，这个方法需要在子类当中进行实现。

```java
import lsieun.utils.FileUtils;
import org.objectweb.asm.*;

import static org.objectweb.asm.Opcodes.*;

public class HelloWorldTransformCore {
    public static void main(String[] args) {
        String relative_path = "sample/HelloWorld.class";
        String filepath = FileUtils.getFilePath(relative_path);
        byte[] bytes1 = FileUtils.readBytes(filepath);

        //（1）构建 ClassReader
        ClassReader cr = new ClassReader(bytes1);

        //（2）构建 ClassWriter
        ClassWriter cw = new ClassWriter(ClassWriter.COMPUTE_FRAMES);

        //（3）串连 ClassVisitor
        int api = Opcodes.ASM9;
        ClassVisitor cv = new ClassAddMethodVisitor(api, cw, Opcodes.ACC_PUBLIC, "mul", "(II)I", null, null) {
            @Override
            protected void generateMethodBody(MethodVisitor mv) {
                mv.visitCode();
                mv.visitVarInsn(ILOAD, 1);
                mv.visitVarInsn(ILOAD, 2);
                mv.visitInsn(IMUL);
                mv.visitInsn(IRETURN);
                mv.visitMaxs(2, 3);
                mv.visitEnd();
            }
        };

        //（4）结合 ClassReader 和 ClassVisitor
        int parsingOptions = ClassReader.SKIP_DEBUG | ClassReader.SKIP_FRAMES;
        cr.accept(cv, parsingOptions);

        //（5）生成 byte[]
        byte[] bytes2 = cw.toByteArray();

        FileUtils.writeBytes(filepath, bytes2);
    }
}
```

验证结果：

```java
import java.lang.reflect.Method;

public class HelloWorldRun {
    public static void main(String[] args) throws Exception {
        Class<?> clazz = Class.forName("sample.HelloWorld");
        System.out.println(clazz.getName());

        Method[] declaredMethods = clazz.getDeclaredMethods();
        for (Method m : declaredMethods) {
            System.out.println("    " + m.getName());
        }
    }
}
```

### 小总结

对于方法的操作，都是基于 `ClassVisitor.visitMethod()` 方法来实现的：

```text
public MethodVisitor visitMethod(int access, String name, String descriptor, String signature, String[] exceptions);
```

与字段操作类似，对于方法来说，可以进行的操作也有三种类型：

- 修改现有的方法。
- 删除已有的方法。
- 添加新的方法。

我们不推荐“删除已有的方法”，因为这可能会引起方法调用失败，从而导致程序报错。

另外，对于“修改现有的方法”，我们不建议修改方法的名称、方法的类型（接收参数的类型和返回值的类型），因为别的地方可能会对该方法进行调用，修改了方法名或方法的类型，就会使方法调用失败。但是，我们可以“修改现有方法”的“方法体”，也就是方法的具体实现代码。

## 总结

本文主要是使用 `ClassReader` 类进行 Class Transformation 的代码示例进行介绍，内容总结如下：

- 第一点，类层面的信息，例如，类名、父类、接口等，可以通过 `ClassVisitor.visit()` 方法进行修改。
- 第二点，字段层面的信息，例如，添加新字段、删除已有字段等，可能通过 `ClassVisitor.visitField()` 方法进行修改。
- 第三点，方法层面的信息，例如，添加新方法、删除已有方法等，可以通过 `ClassVisitor.visitMethod()` 方法进行修改。

但是，对于方法层面来说，还有一个重要的方面没有涉及，也就是对于现有方法里面的代码进行修改，我们在后续内容中会有介绍。
