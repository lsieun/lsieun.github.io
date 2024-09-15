---
title: "Annotation:查找带有注解的方法"
sequence: "203"
---

## 预期目标

假如有一个`MyTag`注解类，代码如下：

```java
package sample;

import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;

@Retention(RetentionPolicy.RUNTIME)
public @interface MyTag {
    String name();
    int age();
}
```

将`MyTag`应用到`HelloWorld`类和方法里，代码如下：

```java
package sample;

@MyTag(name = "hello", age=100)
public class HelloWorld {
    @MyTag(name = "add", age = 10)
    public int add(int a, int b) {
        return a + b;
    }

    public int sub(int a, int b) {
        return a - b;
    }

    @MyTag(name = "mul", age = 20)
    public int mul(int a, int b) {
        return a * b;
    }

    public int div(int a, int b) {
        return a / b;
    }
}
```

我们想实现的预期目标一：找出`HelloWorld`类当中带有`MyTag`注解的方法。

```text
add:(II)I
mul:(II)I
```

我们想实现的预期目标二：查看`HelloWorld`类和方法注解的具体值。

```text
Class: sample/HelloWorld - Lsample/MyTag;
    name: hello
    age: 100
Method: sample/HelloWorld.add:(II)I - Lsample/MyTag;
    name: add
    age: 10
Method: sample/HelloWorld.mul:(II)I - Lsample/MyTag;
    name: mul
    age: 20
```

## 示例一：查找带注解的方法

### 编码实现

```java
import org.objectweb.asm.AnnotationVisitor;
import org.objectweb.asm.ClassVisitor;
import org.objectweb.asm.MethodVisitor;

import java.util.ArrayList;
import java.util.List;

public class CheckMethodAnnotationVisitor extends ClassVisitor {
    // 需要处理的方法放到这里
    public List<String> result = new ArrayList<>();

    public CheckMethodAnnotationVisitor(int api, ClassVisitor classVisitor) {
        super(api, classVisitor);
    }

    @Override
    public MethodVisitor visitMethod(int access, String name, String descriptor, String signature, String[] exceptions) {
        MethodVisitor mv = super.visitMethod(access, name, descriptor, signature, exceptions);
        mv = new CheckMethodAnnotationAdapter(api, mv, name, descriptor);
        return mv;
    }

    private class CheckMethodAnnotationAdapter extends MethodVisitor {
        private final String methodName;
        private final String methodDesc;

        public CheckMethodAnnotationAdapter(int api, MethodVisitor methodVisitor, String methodName, String methodDesc) {
            super(api, methodVisitor);
            this.methodName = methodName;
            this.methodDesc = methodDesc;
        }

        @Override
        public AnnotationVisitor visitAnnotation(String descriptor, boolean visible) {
            // 在这里进行判断：是否需要对方法进行处理
            if (descriptor.equals("Lsample/MyTag;")) {
                String item = methodName + ":" + methodDesc;
                result.add(item);
            }
            return super.visitAnnotation(descriptor, visible);
        }
    }
}
```

### 进行分析

```java
import lsieun.utils.FileUtils;
import org.objectweb.asm.ClassReader;
import org.objectweb.asm.Opcodes;

import java.util.List;

public class HelloWorldAnalysisCore {
    public static void main(String[] args) {
        String relative_path = "sample/HelloWorld.class";
        String filepath = FileUtils.getFilePath(relative_path);
        byte[] bytes = FileUtils.readBytes(filepath);

        //（1）构建ClassReader
        ClassReader cr = new ClassReader(bytes);

        //（2）分析ClassVisitor
        int api = Opcodes.ASM9;
        CheckMethodAnnotationVisitor cv = new CheckMethodAnnotationVisitor(api, null);

        //（3）结合ClassReader和ClassVisitor
        int parsingOptions = ClassReader.SKIP_DEBUG | ClassReader.SKIP_FRAMES;
        cr.accept(cv, parsingOptions);

        List<String> list = cv.result;
        for (String item : list) {
            System.out.println(item);
        }
    }
}
```

## 示例二：查看注解的值

### 编码实现

```java
import org.objectweb.asm.AnnotationVisitor;
import org.objectweb.asm.ClassVisitor;
import org.objectweb.asm.MethodVisitor;

// 第一个类
public class ClassPrintAnnotationVisitor extends ClassVisitor {
    private String owner;

    public ClassPrintAnnotationVisitor(int api, ClassVisitor classVisitor) {
        super(api, classVisitor);
    }

    @Override
    public void visit(int version, int access, String name, String signature, String superName, String[] interfaces) {
        super.visit(version, access, name, signature, superName, interfaces);
        this.owner = name;
    }

    @Override
    public AnnotationVisitor visitAnnotation(String descriptor, boolean visible) {
        // (1) 调用父类的实现
        AnnotationVisitor av = super.visitAnnotation(descriptor, visible);

        // (2) 添加自己的代码逻辑
        String info = String.format("Class: %s - %s", owner, descriptor);
        System.out.println(info);
        return new AnnotationPrinter(api, av);
    }

    @Override
    public MethodVisitor visitMethod(int access, String name, String descriptor, String signature, String[] exceptions) {
        MethodVisitor mv = super.visitMethod(access, name, descriptor, signature, exceptions);
        mv = new MethodPrintAnnotationAdapter(api, mv, owner, name, descriptor);
        return mv;
    }

    // 第二个类
    private static class MethodPrintAnnotationAdapter extends MethodVisitor {
        private final String owner;
        private final String methodName;
        private final String methodDesc;


        public MethodPrintAnnotationAdapter(int api, MethodVisitor methodVisitor, String owner, String methodName, String methodDesc) {
            super(api, methodVisitor);
            this.owner = owner;
            this.methodName = methodName;
            this.methodDesc = methodDesc;
        }

        @Override
        public AnnotationVisitor visitAnnotation(String descriptor, boolean visible) {
            // (1) 调用父类的实现
            AnnotationVisitor av = super.visitAnnotation(descriptor, visible);
            
            // (2) 添加自己的代码逻辑
            String info = String.format("Method: %s.%s:%s - %s", owner, methodName, methodDesc, descriptor);
            System.out.println(info);
            return new AnnotationPrinter(api, av);
        }
    }

    // 第三个类
    private static class AnnotationPrinter extends AnnotationVisitor {
        public AnnotationPrinter(int api, AnnotationVisitor annotationVisitor) {
            super(api, annotationVisitor);
        }

        @Override
        public void visit(String name, Object value) {
            // (1) 添加自己的代码逻辑
            String info = String.format("    %s: %s", name, value);
            System.out.println(info);

            // (2) 调用父类的实现
            super.visit(name, value);
        }

        @Override
        public void visitEnum(String name, String descriptor, String value) {
            // (1) 添加自己的代码逻辑
            String info = String.format("    %s: %s %s", name, descriptor, value);
            System.out.println(info);

            // (2) 调用父类的实现
            super.visitEnum(name, descriptor, value);
        }

        @Override
        public AnnotationVisitor visitAnnotation(String name, String descriptor) {
            // (1) 添加自己的代码逻辑
            String info = String.format("    %s: %s", name, descriptor);
            System.out.println(info);

            // (2) 调用父类的实现
            return super.visitAnnotation(name, descriptor);
        }

        @Override
        public AnnotationVisitor visitArray(String name) {
            // (1) 添加自己的代码逻辑
            String info = String.format("    %s", name);
            System.out.println(info);

            // (2) 调用父类的实现
            return super.visitArray(name);
        }
    }
}
```

### 进行分析

```java
import lsieun.utils.FileUtils;
import org.objectweb.asm.ClassReader;
import org.objectweb.asm.ClassVisitor;
import org.objectweb.asm.Opcodes;

public class HelloWorldAnalysisCore {
    public static void main(String[] args) {
        String relative_path = "sample/HelloWorld.class";
        String filepath = FileUtils.getFilePath(relative_path);
        byte[] bytes = FileUtils.readBytes(filepath);

        //（1）构建ClassReader
        ClassReader cr = new ClassReader(bytes);

        //（2）分析ClassVisitor
        int api = Opcodes.ASM9;
        ClassVisitor cv = new ClassPrintAnnotationVisitor(api, null);

        //（3）结合ClassReader和ClassVisitor
        int parsingOptions = ClassReader.SKIP_DEBUG | ClassReader.SKIP_FRAMES;
        cr.accept(cv, parsingOptions);
    }
}
```

