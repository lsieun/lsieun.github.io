---
title: "Class"
sequence: "102"
---

Javassist library can be used for generating new Java class files.

The `ClassFile` is used to create a new class file and `FieldInfo` is used to add a new field to a class:

```java
import javassist.CannotCompileException;
import javassist.ClassPool;
import javassist.CtClass;
import javassist.bytecode.AccessFlag;
import javassist.bytecode.ClassFile;
import javassist.bytecode.FieldInfo;
import lsieun.utils.FileUtils;

import java.io.IOException;

public class HelloWorldGenerate {
    public static void main(String[] args) throws CannotCompileException, IOException {
        ClassFile cf = new ClassFile(false, "sample.HelloWorld", null);
        cf.setInterfaces(new String[] {"java.lang.Cloneable"});

        FieldInfo f = new FieldInfo(cf.getConstPool(), "id", "I");
        f.setAccessFlags(AccessFlag.PUBLIC);
        cf.addField(f);

        ClassPool classPool = ClassPool.getDefault();
        CtClass ctClass = classPool.makeClass(cf);
        byte[] bytes = ctClass.toBytecode();

        String filepath = FileUtils.getFilePath("/sample/HelloWorld.class");
        FileUtils.writeBytes(filepath, bytes);
    }
}
```

## Loading Bytecode Instructions of Class

If we want to load bytecode instructions of an already existing class method,
we can get a `CodeAttribute` of a specific method of the class.
Then we can get a `CodeIterator` to iterate over all bytecode instructions of that method.

```java
import javassist.ClassPool;
import javassist.NotFoundException;
import javassist.bytecode.*;

import java.util.LinkedList;
import java.util.List;

public class HelloWorldAnalysis {
    public static void main(String[] args) throws NotFoundException, BadBytecode {
        ClassPool cp = ClassPool.getDefault();
        ClassFile cf = cp.get("sample.Point").getClassFile();
        MethodInfo minfo = cf.getMethod("move");
        CodeAttribute ca = minfo.getCodeAttribute();
        CodeIterator ci = ca.iterator();

        List<String> operations = new LinkedList<>();
        while (ci.hasNext()) {
            int index = ci.next();
            int op = ci.byteAt(index);
            operations.add(Mnemonic.OPCODE[op]);
        }

        System.out.println(operations);
    }
}
```

```java
public class HelloWorld {
    private int x;
    private int y;

    public void move(int x, int y) {
        this.x = x;
        this.y = y;
    }

    public int getX() {
        return x;
    }

    public void setX(int x) {
        this.x = x;
    }

    public int getY() {
        return y;
    }

    public void setY(int y) {
        this.y = y;
    }
}
```

## Adding Fields to Existing Class Bytecode

```java
import javassist.CannotCompileException;
import javassist.ClassPool;
import javassist.CtClass;
import javassist.NotFoundException;
import javassist.bytecode.AccessFlag;
import javassist.bytecode.BadBytecode;
import javassist.bytecode.ClassFile;
import javassist.bytecode.FieldInfo;

import java.io.IOException;

public class HelloWorldTransform {
    public static void main(String[] args) throws NotFoundException, BadBytecode, CannotCompileException, IOException {
        ClassPool classPool = ClassPool.getDefault();
        ClassFile cf = classPool.get("sample.HelloWorld").getClassFile();

        FieldInfo f = new FieldInfo(cf.getConstPool(), "id", "I");
        f.setAccessFlags(AccessFlag.PUBLIC);
        cf.addField(f);

        CtClass ctClass = classPool.makeClass(cf);
        byte[] bytes = ctClass.toBytecode();

        String filepath = FileUtils.getFilePath("/sample/HelloWorld.class");
        FileUtils.writeBytes(filepath, bytes);
    }
}
```

## Adding Constructor to Class Bytecode

We can add a constructor to the existing class mentioned in one of the previous examples
by using an `addInvokespecial()` method.

And we can add a parameterless constructor by invoking a `<init>` method from `java.lang.Object` class:

```java
import javassist.CannotCompileException;
import javassist.ClassPool;
import javassist.CtClass;
import javassist.NotFoundException;
import javassist.bytecode.Bytecode;
import javassist.bytecode.ClassFile;
import javassist.bytecode.MethodInfo;
import lsieun.utils.FileUtils;

import java.io.IOException;

public class HelloWorldTransform {
    public static void main(String[] args) throws NotFoundException, CannotCompileException, IOException {
        ClassPool classPool = ClassPool.getDefault();
        ClassFile cf = classPool.get("sample.HelloWorld").getClassFile();
        Bytecode code = new Bytecode(cf.getConstPool());
        code.addAload(0);
        code.addInvokespecial("java/lang/Object", MethodInfo.nameInit, "()V");
        code.addReturn(null);

        MethodInfo minfo = new MethodInfo(
                cf.getConstPool(), MethodInfo.nameInit, "()V");
        minfo.setCodeAttribute(code.toCodeAttribute());
        cf.addMethod(minfo);

        CtClass ctClass = classPool.makeClass(cf);
        byte[] bytes = ctClass.toBytecode();

        String filepath = FileUtils.getFilePath("/sample/HelloWorld.class");
        FileUtils.writeBytes(filepath, bytes);
    }
}
```

