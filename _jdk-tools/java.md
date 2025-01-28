---
title: "java"
sequence: "104"
---

## Standard Options

List all standard options:

```text
$ java
```

- `-javaagent:/path/to/agent.jar`: loads the java agent in `agent.jar`
- `-agentpath:pathname`: Loads the native agent library specified by the absolute path name
- `-verbose:[class/gc/jni]`: Display information about each loaded class/gc event/JNI activity

参考：

- [java - windows](https://docs.oracle.com/javase/8/docs/technotes/tools/windows/java.html#BABDJJFI)
- [java - unix](https://docs.oracle.com/javase/8/docs/technotes/tools/unix/java.html#BABDJJFI)

## Non-Standard Options

List all non-standard options:

```text
$ java -X
```

- `-Xint`: Runs the application in interpreted-only mode.
- `-Xbootclasspath:path`: Path and archive list of boot class files.
- `-Xloggc:filename`: Log verbose GC events to filename.
- `-Xms1g`: Set the initial size (in bytes) of the heap.
- `-Xmx8g`: Specifies the max size (in bytes) of the heap.
- `-Xnoclassgc`: Disables class garbage collection.
- `-Xprof`: Profiles the running program

参考：

- [java - windows](https://docs.oracle.com/javase/8/docs/technotes/tools/windows/java.html#BABHDABI)
- [java - unix](https://docs.oracle.com/javase/8/docs/technotes/tools/unix/java.html#BABHDABI)

## Advanced Options

参考：

- [java - windows](https://docs.oracle.com/javase/8/docs/technotes/tools/windows/java.html#BABCBGHF)
- [java - unix](https://docs.oracle.com/javase/8/docs/technotes/tools/unix/java.html#BABCBGHF)

### Behavior

- `-XX:+UseConcMarkSweepGC`: Enables CMS garbage collection.
- `-XX:+UseParallelGC`: Enables parallel garbage collection.
- `-XX:+UseSerialGC`: Enables serial garbage collection.
- `-XX:+UseG1GC`: Enables G1GC garbage collection.
- `-XX:+FlightRecorder`: (requires `-XX:+UnlockCommercialFeatures`) Enables the use of the Java Flight Recorder.

### Debugging

- `-XX:ErrorFile=file.log`: Save the error data to file.log.
- `-XX:+HeapDumpOnOutOfMemory`: Enables heap dump when `OutOfMemoryError` is thrown.
- `-XX:+PrintGC`: Enables printing messages during garbage collection.
- `-XX:+TraceClassLoading`: Enables Trace loading of classes.
- `-XX:+PrintClassHistogram`: Enables printing of a class instance histogram after a Control+C event (SIGTERM).

### Performance

- `-XX:MaxPermSize=128m`: (Java 7 or earlier) Sets the max perm space size (in bytes).
- `-XX:ThreadStackSize=256k`: Sets Thread Stack Size (in bytes). (Same as `-Xss256k`)
- `-XX:+UseStringCache`: Enables caching of commonly allocated strings.
- `-XX:G1HeapRegionSize=4m`: Sets the sub-division size of G1 heap (in bytes).
- `-XX:MaxGCPauseMillis=n`: Sets a target for the maximum GC pause time.
- `-XX:MaxNewSize=256m`: Max size of new generation (in bytes).
- `-XX:+AggressiveOpts`: Enables the use of aggressive performance optimization features.
- `-XX:OnError="<cmd args>”`: Run user-defined commands on fatal error.

## Locale

```text
$ java -Duser.language=en -help
```

Windows

For me changing the `HKEY_CURRENT_USER\Control Panel\International\LocaleName` to `en-US` did the trick.

原来是`zh-CN`，将其修改为`en-US`

`user.language` and `user.country` work, you can try the following examples:

```text
java -Duser.language=en -Duser.country=US
```

If you want jvm to select it by default, you should set environment variable `JAVA_TOOL_OPTIONS`,
it works on Windows too (except that setting environment variable is a little different on Windows)!

```text
export JAVA_TOOL_OPTIONS="-Duser.language=en -Duser.country=US"
```

[How do I view and change the system locale settings to use my language of choice?](https://www.java.com/en/download/help/locale.html)

在Git Bash中，添加`~/.bash_profile`文件：

```text
$ cat ~/.bash_profile
export JAVA_TOOL_OPTIONS="-Duser.language=en -Duser.country=US"
```

## Verify

Run the program with the `-noverify` (or `-Xverify:none`) option:

```text
java -noverify sample.HelloWorld
```

```text
java -Xverify:none sample.HelloWorld
```

我们可以使用ASM进行生成`if`语句测试：

```java
package sample;

import java.util.Random;

public class HelloWorld {
    public static void main(String[] args) {
        Random rand = new Random();
        boolean flag = rand.nextBoolean();
        if (flag) {
            System.out.println("value is true");
        }
        else {
            System.out.println("value is false");
        }
    }
}
```

在创建`ClassWriter`对象时，使用`COMPUTE_MAXS`选项，这样就不会生成stack map frame信息，我们可以使用`-noverify`选项不验证stack map frame信息。

```java
import lsieun.utils.FileUtils;
import org.objectweb.asm.*;

import static org.objectweb.asm.Opcodes.*;

public class HelloWorldGenerateCore {
    public static void main(String[] args) throws Exception {
        String relative_path = "sample/HelloWorld.class";
        String filepath = FileUtils.getFilePath(relative_path);

        // (1) 生成byte[]内容
        byte[] bytes = dump();

        // (2) 保存byte[]到文件
        FileUtils.writeBytes(filepath, bytes);
    }

    public static byte[] dump() throws Exception {
        // (1) 创建ClassWriter对象
        ClassWriter cw = new ClassWriter(ClassWriter.COMPUTE_MAXS);

        // (2) 调用visitXxx()方法
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
            MethodVisitor mv2 = cw.visitMethod(ACC_PUBLIC | ACC_STATIC, "main", "([Ljava/lang/String;)V", null, null);

            Label elseLabel = new Label();
            Label returnLabel = new Label();
            
            mv2.visitCode();
            mv2.visitTypeInsn(NEW, "java/util/Random");
            mv2.visitInsn(DUP);
            mv2.visitMethodInsn(INVOKESPECIAL, "java/util/Random", "<init>", "()V", false);
            mv2.visitVarInsn(ASTORE, 1);
            mv2.visitVarInsn(ALOAD, 1);
            mv2.visitMethodInsn(INVOKEVIRTUAL, "java/util/Random", "nextBoolean", "()Z", false);
            mv2.visitVarInsn(ISTORE, 2);
            mv2.visitVarInsn(ILOAD, 2);
            mv2.visitJumpInsn(IFEQ, elseLabel);
            mv2.visitFieldInsn(GETSTATIC, "java/lang/System", "out", "Ljava/io/PrintStream;");
            mv2.visitLdcInsn("value is true");
            mv2.visitMethodInsn(INVOKEVIRTUAL, "java/io/PrintStream", "println", "(Ljava/lang/String;)V", false);
            mv2.visitJumpInsn(GOTO, returnLabel);

            mv2.visitLabel(elseLabel);
            mv2.visitFieldInsn(GETSTATIC, "java/lang/System", "out", "Ljava/io/PrintStream;");
            mv2.visitLdcInsn("value is false");
            mv2.visitMethodInsn(INVOKEVIRTUAL, "java/io/PrintStream", "println", "(Ljava/lang/String;)V", false);
            
            mv2.visitLabel(returnLabel);
            mv2.visitInsn(RETURN);
            mv2.visitMaxs(2, 3);
            mv2.visitEnd();
        }
        cw.visitEnd();

        // (3) 调用toByteArray()方法
        return cw.toByteArray();
    }
}
```

## Reference

- [Java HotSpot VM Options - JDK 7](https://www.oracle.com/java/technologies/javase/vmoptions-jsp.html)
- [java 8 - unix](https://docs.oracle.com/javase/8/docs/technotes/tools/unix/java.html)
- [java 8 - windows](https://docs.oracle.com/javase/8/docs/technotes/tools/windows/java.html)

