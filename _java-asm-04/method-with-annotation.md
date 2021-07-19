---
title:  "Annotation:查找带有注解的方法"
sequence: "203"
---

## 预期目标

假如有一个`HelloWorld`类，代码如下：

```java
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

我们想实现的预期目标：找`HelloWorld`类当中带有`MyTag`注解的方法。

```java
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;

@Retention(RetentionPolicy.RUNTIME)
public @interface MyTag {
    String name();
    int age();
}
```

## 编码实现

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

## 进行分析

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

输出：

```text
add:(II)I
mul:(II)I
```

