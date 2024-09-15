---
title: "FieldVisitor 介绍"
sequence: "204"
---

[上级目录]({% link _posts/2021-06-01-java-asm-index.md %})

通过调用 `ClassVisitor` 类的 `visitField()` 方法，会返回一个 `FieldVisitor` 类型的对象。

```text
public FieldVisitor visitField(int access, String name, String descriptor, String signature, Object value);
```

在本文当中，我们将对 `FieldVisitor` 类进行介绍：

```text
                                                          ┌─── ClassReader
                                                          │
                                                          │
                                                          │                    ┌─── FieldVisitor
                                  ┌─── asm.jar ───────────┼─── ClassVisitor ───┤
                                  │                       │                    └─── MethodVisitor
                                  │                       │
                                  │                       │                    ┌─── FieldWriter
                 ┌─── Core API ───┤                       └─── ClassWriter ────┤
                 │                │                                            └─── MethodWriter
                 │                ├─── asm-util.jar
                 │                │
ObjectWeb ASM ───┤                └─── asm-commons.jar
                 │
                 │
                 │                ┌─── asm-tree.jar
                 └─── Tree API ───┤
                                  └─── asm-analysis.jar
```

## FieldVisitor 类

在学习 `FieldVisitor` 类的时候，可以与 `ClassVisitor` 类进行对比，这两个类在结构上有很大的相似性：两者都是抽象类，都定义了两个字段，都定义了两个构造方法，都定义了 `visitXxx()` 方法。

### class info

第一个部分，`FieldVisitor` 类是一个 `abstract` 类。

```java
public abstract class FieldVisitor {
}
```

### fields

第二个部分，`FieldVisitor` 类定义的字段有哪些。

```java
public abstract class FieldVisitor {
    protected final int api;
    protected FieldVisitor fv;
}
```

### constructors

第三个部分，`FieldVisitor` 类定义的构造方法有哪些。

```java
public abstract class FieldVisitor {
    public FieldVisitor(final int api) {
        this(api, null);
    }

    public FieldVisitor(final int api, final FieldVisitor fieldVisitor) {
        this.api = api;
        this.fv = fieldVisitor;
    }
}
```

### methods

第四个部分，`FieldVisitor` 类定义的方法有哪些。

在 `FieldVisitor` 类当中，一共定义了 4 个 `visitXxx()` 方法，但是，我们只需要关注其中的 `visitEnd()` 方法就可以了。

我们为什么只关注 `visitEnd()` 方法呢？因为我们刚开始学习 ASM，有许多东西不太熟悉，为了减少我们的学习和认知“负担”，那么对于一些非必要的方法，我们就暂时忽略它；将 `visitXxx()` 方法精简到一个最小的认知集合，那么就只剩下 `visitEnd()` 方法了。

```java
public abstract class FieldVisitor {
    // ......

    public void visitEnd() {
        if (fv != null) {
            fv.visitEnd();
        }
    }
}
```

另外，在 `FieldVisitor` 类内定义的多个 `visitXxx()` 方法，也需要遵循一定的调用顺序，如下所示：

```text
(
 visitAnnotation |
 visitTypeAnnotation |
 visitAttribute
)*
visitEnd
```

由于我们只关注 `visitEnd()` 方法，那么，这个调用顺序就变成如下这样：

```text
visitEnd
```

## FieldVisitor 类示例

### 示例一：字段常量

#### 预期目标

```java
public interface HelloWorld {
    int intValue = 100;
    String strValue = "ABC";
}
```

#### 编码实现

```java
import lsieun.utils.FileUtils;
import org.objectweb.asm.ClassWriter;
import org.objectweb.asm.FieldVisitor;

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
        cw.visit(V1_8, ACC_PUBLIC + ACC_ABSTRACT + ACC_INTERFACE, "sample/HelloWorld", null, "java/lang/Object", null);

        {
            // 多个 ACC_XXX 之间用 | 或 + 的效果是一样的
            FieldVisitor fv1 = cw.visitField(ACC_PUBLIC | ACC_FINAL | ACC_STATIC, "intValue", "I", null, 100);
            fv1.visitEnd();
        }

        {
            // 多个 ACC_XXX 之间用 | 或 + 的效果是一样的
            FieldVisitor fv2 = cw.visitField(ACC_PUBLIC + ACC_FINAL + ACC_STATIC, "strValue", "Ljava/lang/String;", null, "ABC");
            fv2.visitEnd();
        }

        cw.visitEnd();

        // (3) 调用 toByteArray() 方法
        return cw.toByteArray();
    }
}
```

#### 验证结果

```java
import java.lang.reflect.Field;

public class HelloWorldRun {
    public static void main(String[] args) throws Exception {
        Class<?> clazz = Class.forName("sample.HelloWorld");
        Field[] declaredFields = clazz.getDeclaredFields();
        if (declaredFields.length > 0) {
            System.out.println("fields:");
            for (Field f : declaredFields) {
                Object value = f.get(null);
                System.out.println("    " + f.getName() + ": " + value);
            }
        }
    }
}
```

输出结果：

```text
fields:
    intValue: 100
    strValue: ABC
```

#### 小总结

通过这个示例，我们想说明：在得到一个 `FieldVisitor` 对象之后，要记得调用它的 `visitEnd()` 方法。

### 示例二：visitAnnotation

无论是 `ClassVisitor` 类，还是 `FieldVisitor` 类，又或者是 `MethodVisitor` 类，总会有一些 `visitXxx()` 方法是在课程当中不会涉及到的。但是，在日后的工作和学习当中，很可能，在某一天你突然就对一个 `visitXxx()` 方法产生了兴趣，那该如何学习这个 `visitXxx()` 方法呢？我们可以借助于 `PrintASMCodeCore` 类。

#### 预期目标

假如我们想生成如下 `HelloWorld` 类：

```java
public interface HelloWorld {
    @MyTag(name = "tomcat", age = 10)
    int intValue = 100;
}
```

其中，`MyTag` 定义如下：

```java
public @interface MyTag {
    String name();
    int age();
}
```

#### 编码实现

```java
import lsieun.utils.FileUtils;
import org.objectweb.asm.AnnotationVisitor;
import org.objectweb.asm.ClassWriter;
import org.objectweb.asm.FieldVisitor;

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
        cw.visit(V1_8, ACC_PUBLIC | ACC_ABSTRACT | ACC_INTERFACE, "sample/HelloWorld", null, "java/lang/Object", null);

        {
            FieldVisitor fv1 = cw.visitField(ACC_PUBLIC | ACC_FINAL | ACC_STATIC, "intValue", "I", null, 100);

            {
                AnnotationVisitor anno = fv1.visitAnnotation("Lsample/MyTag;", false);
                anno.visit("name", "tomcat");
                anno.visit("age", 10);
                anno.visitEnd();
            }

            fv1.visitEnd();
        }

        cw.visitEnd();

        // (3) 调用 toByteArray() 方法
        return cw.toByteArray();
    }
}
```

#### 小总结

在这个示例当中，我们并不是想针对 `visitAnnotation()` 方法来讲解，而是想讲一下学习 `visitXxx()` 方法的通用思路。

## 总结

本文主要对 `FieldVisitor` 类进行了介绍，内容总结如下：

- 第一点，`FieldVisitor` 类，从结构上来说，与 `ClassVisitor` 很相似；对于 `FieldVisitor` 类的各个不同部分进行介绍，以便从整体上来理解 `FieldVisitor` 类。
- 第二点，对于 `FieldVisitor` 类定义的方法，我们只需要关心 `FieldVisitor.visitEnd()` 方法就可以了。
- 第三点，我们可以借助于 `PrintASMCodeCore` 类来帮助我们学习新的 `visitXxx()` 方法。

