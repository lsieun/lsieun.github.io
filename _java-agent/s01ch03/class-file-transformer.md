---
title: "ClassFileTransformer"
sequence: "143"
---

[UP]({% link _java-agent/java-agent-01.md %})

## 如何实现 Transformer

An agent provides an implementation of `ClassFileTransformer` interface in order to transform class files.

```java
public interface ClassFileTransformer {
    byte[] transform(ClassLoader         loader,
                     String              className,
                     Class<?>            classBeingRedefined,
                     ProtectionDomain    protectionDomain,
                     byte[]              classfileBuffer)
        throws IllegalClassFormatException;
}
```

如果我们实现了 `ClassFileTransformer` 接口，就可以对某一个 class file（`classfileBuffer`）进行处理，一般要考虑两个问题：

- 首先，有哪些类可以不处理？
- 其次，如何来对 `classfileBuffer` 进行处理

### 有哪些类可以不处理

在实现 `ClassFileTransformer.transform()` 方法时，我们要考虑一下哪些类不需要处理，让“影响范围”最小化：

- 第一， primitive type（原始类型，例如 `int`）和 array（数组）不处理。
- 第二，JDK 的内置类或第三方类库当中的 `.class` 文件，一般情况下不修改，特殊情况下才进行修改。
- 第三，自己写的 Agent Jar 当中的类

注意：对于 primitive type（例如， `int` ）和 array 的判断是多余的。
当使用 `Instrumentation.isModifiableClass()` 对 `int.class` 和 `String[].class` 进行判断时，都会返回 `false` 值。
如果对 `int.class` 和 `String[].class` 进行 `Instrumentation.retransformClasses()` 操作，会出现 `UnmodifiableClassException` 异常。


写法一：（逻辑清晰）

```java
package lsieun.instrument;

import java.lang.instrument.ClassFileTransformer;
import java.lang.instrument.IllegalClassFormatException;
import java.security.ProtectionDomain;

public class FilterTransformer implements ClassFileTransformer {
    @Override
    public byte[] transform(ClassLoader loader,
                            String className,
                            Class<?> classBeingRedefined,
                            ProtectionDomain protectionDomain,
                            byte[] classfileBuffer) throws IllegalClassFormatException {

        // 第一，数组，不处理
        if (className.startsWith("[")) return null;

        // 第二，JDK 的内置类，不处理
        if (className.startsWith("java/")) return null;
        if (className.startsWith("javax/")) return null;
        if (className.startsWith("jdk/")) return null;
        if (className.startsWith("com/sun/")) return null;
        if (className.startsWith("sun/")) return null;
        if (className.startsWith("org/")) return null;

        // 第三，自己写的类，不处理
        if (className.startsWith("lsieun")) return null;

        // TODO: 使用字节码类库对 classfileBuffer 进行转换

        // 如果不修改，则返回 null 值
        return null;
    }
}
```

写法二：（代码简洁）

```java
package lsieun.instrument;

import java.lang.instrument.ClassFileTransformer;
import java.lang.instrument.IllegalClassFormatException;
import java.security.ProtectionDomain;
import java.util.Arrays;
import java.util.List;

public class FilterTransformer implements ClassFileTransformer {
    public static final List<String> ignoredPackages = Arrays.asList("[", "com/", "com/sun/", "java/", "javax/", "jdk/", "lsieun/", "org/", "sun/");
    
    @Override
    public byte[] transform(ClassLoader loader,
                            String className,
                            Class<?> classBeingRedefined,
                            ProtectionDomain protectionDomain,
                            byte[] classfileBuffer) throws IllegalClassFormatException {
        // 有些类，不处理
        if (className == null) return null;
        for (String name : ignoredPackages) {
            if (className.startsWith(name)) {
                return null;
            }
        }

        // TODO: 使用字节码类库对 classfileBuffer 进行转换

        // 如果不修改，则返回 null 值
        return null;
    }
}
```

另外，如果我们不想对 bootstrap classloader 加载的类进行修改，也可以判断 `loader` 是否为 `null`。

再有一点，Lambda 表达式生成的类要慎重处理。
在[Alibaba Arthas](https://github.com/alibaba/arthas)当中对 Lambda 表达式生成的类进行了“忽略”处理：

```java
public class ClassUtils {
    public static boolean isLambdaClass(Class<?> clazz) {
        return clazz.getName().contains("$$Lambda$");
    }
}
```

下面是对 `ClassUtils.isLambdaClass()` 方法的使用示例：

```java
public class InstrumentationUtils {
    public static void retransformClasses(Instrumentation inst, ClassFileTransformer transformer, Set<Class<?>> classes) {
        try {
            inst.addTransformer(transformer, true);

            for (Class<?> clazz : classes) {
                if (ClassUtils.isLambdaClass(clazz)) {
                    logger.info("ignore lambda class: {}, because jdk do not support retransform lambda class: https://github.com/alibaba/arthas/issues/1512.",
                            clazz.getName());
                    continue;
                }
                try {
                    inst.retransformClasses(clazz);
                } catch (Throwable e) {
                    String errorMsg = "retransformClasses class error, name: " + clazz.getName();
                    logger.error(errorMsg, e);
                }
            }
        } finally {
            inst.removeTransformer(transformer);
        }
    }
}
```

在 `InnerClassLambdaMetafactory` 类的构造方法中，有如下代码：

```text
lambdaClassName = targetClass.getName().replace('.', '/') + "$$Lambda$" + counter.incrementAndGet();
```

还有一种情况，我们明确知道要处理的是哪一个类：

```java
package lsieun.instrument;

import java.lang.instrument.ClassFileTransformer;
import java.lang.instrument.IllegalClassFormatException;
import java.security.ProtectionDomain;
import java.util.Objects;

public class FilterTransformer implements ClassFileTransformer {
    private final String internalName;

    public FilterTransformer(String internalName) {
        Objects.requireNonNull(internalName);
        this.internalName = internalName.replace(".", "/");
    }

    @Override
    public byte[] transform(ClassLoader loader,
                            String className,
                            Class<?> classBeingRedefined,
                            ProtectionDomain protectionDomain,
                            byte[] classfileBuffer) throws IllegalClassFormatException {
        if (className.equals(internalName)) {
            // TODO: 使用字节码类库对 classfileBuffer 进行转换
        }

        // 如果不修改，则返回 null 值
        return null;
    }
}
```

### 如何来处理 classfileBuffer

处理 `ClassFileTransformer.transform()` 方法中的 `byte[] classfileBuffer` 参数，一般要借助于第三方的操作字节码的类库，例如[ASM](https://asm.ow2.io/)、[ByteBuddy](https://bytebuddy.net/)和[Javassist](https://www.javassist.org/)。

### 返回值

If the implementing method determines that no transformations are needed, it should return `null`.

Otherwise, it should create a new `byte[]` array, copy the input `classfileBuffer` into it,
along with all desired transformations,
and return the new array.

The input `classfileBuffer` must not be modified.

小总结：

- 第一，无论是否要进行 transform 操作，一定不要修改 `classfileBuffer` 的内容。
- 第二，如果不进行 transform 操作，则直接返回 `null` 就可以了。
- 第三，如果进行 transform 操作，则可以复制 `classfileBuffer` 内容后进行修改，再返回。

### Lambda

在 Java 8 版本当中，我们可以将 `ClassFileTransformer` 接口用 Lambda 表达式提供实现，因为它有一个抽象的 `transform` 方法；
但是，到了 Java 9 之后，`ClassFileTransformer` 接口就不能再用 Lambda 表达式了，因为它有两个 `default` 实现的 `transform` 方法。

我的个人理解：

- 对于一个简单的功能，将 `ClassFileTransformer` 接口写成 Lambda 表达式的形式，会方便一些；
- 对于一个复杂的功能，我更愿意把 `ClassFileTransformer` 写成一个具体的实现类，作为一个单独的文件存在。

```java
package lsieun.agent;

import lsieun.utils.*;

import java.lang.instrument.ClassFileTransformer;
import java.lang.instrument.Instrumentation;

public class LoadTimeAgent {
    public static void premain(String agentArgs, Instrumentation inst) {
        // 第一步，打印信息：agentArgs, inst, classloader, thread
        PrintUtils.printAgentInfo(LoadTimeAgent.class, "Premain-Class", agentArgs, inst);

        // 第二步，使用 inst：添加 transformer
        ClassFileTransformer transformer = (loader, className, classBeingRedefined, protectionDomain, classfileBuffer) -> {
            return null;
        };
        inst.addTransformer(transformer, false);
    }
}
```

## 示例一：不排除自己写的类

### Agent Jar

#### LoadTimeAgent

```java
package lsieun.agent;

import lsieun.instrument.*;
import lsieun.utils.*;

import java.lang.instrument.ClassFileTransformer;
import java.lang.instrument.Instrumentation;

public class LoadTimeAgent {
    public static void premain(String agentArgs, Instrumentation inst) {
        // 第一步，打印信息：agentArgs, inst, classloader, thread
        PrintUtils.printAgentInfo(LoadTimeAgent.class, "Premain-Class", agentArgs, inst);

        // 第二步，使用 inst：添加 transformer
        ClassFileTransformer transformer = new FilterTransformer();
        inst.addTransformer(transformer, false);
    }
}
```

#### FilterTransformer

```java
package lsieun.instrument;

import lsieun.asm.visitor.*;
import org.objectweb.asm.ClassReader;
import org.objectweb.asm.ClassVisitor;
import org.objectweb.asm.ClassWriter;

import java.lang.instrument.ClassFileTransformer;
import java.lang.instrument.IllegalClassFormatException;
import java.security.ProtectionDomain;

public class FilterTransformer implements ClassFileTransformer {
    @Override
    public byte[] transform(ClassLoader loader,
                            String className,
                            Class<?> classBeingRedefined,
                            ProtectionDomain protectionDomain,
                            byte[] classfileBuffer) throws IllegalClassFormatException {
        // 第一，数组，不处理
        if (className.startsWith("[")) return null;

        // 第二，JDK 的内置类，不处理
        if (className.startsWith("java")) return null;
        if (className.startsWith("javax")) return null;
        if (className.startsWith("jdk")) return null;
        if (className.startsWith("com/sun")) return null;
        if (className.startsWith("sun")) return null;
        if (className.startsWith("org")) return null;

        // 使用 ASM 进行转换
        System.out.println("transform class: " + className);
        ClassReader cr = new ClassReader(classfileBuffer);
        ClassWriter cw = new ClassWriter(ClassWriter.COMPUTE_FRAMES);
        ClassVisitor cv = new MethodEnterVisitor(cw);

        int parsingOptions = ClassReader.SKIP_DEBUG | ClassReader.SKIP_FRAMES;
        cr.accept(cv, parsingOptions);

        return cw.toByteArray();
    }
}
```

#### MethodEnterVisitor

```java
package lsieun.asm.visitor;

import lsieun.cst.Const;
import org.objectweb.asm.ClassVisitor;
import org.objectweb.asm.MethodVisitor;
import org.objectweb.asm.Opcodes;

public class MethodEnterVisitor extends ClassVisitor {
    private String owner;

    public MethodEnterVisitor(ClassVisitor classVisitor) {
        super(Const.ASM_VERSION, classVisitor);
    }

    @Override
    public void visit(int version, int access, String name, String signature, String superName, String[] interfaces) {
        super.visit(version, access, name, signature, superName, interfaces);
        this.owner = name;
    }

    @Override
    public MethodVisitor visitMethod(int access, String name, String descriptor, String signature, String[] exceptions) {
        MethodVisitor mv = super.visitMethod(access, name, descriptor, signature, exceptions);
        if (mv != null && !"<init>".equals(name) && !"<clinit>".equals(name)) {
            boolean isAbstractMethod = (access & Opcodes.ACC_ABSTRACT) == Opcodes.ACC_ABSTRACT;
            boolean isNativeMethod = (access & Opcodes.ACC_NATIVE) == Opcodes.ACC_NATIVE;
            if (!isAbstractMethod && !isNativeMethod) {
                mv = new MethodEnterAdapter(mv, owner, name, descriptor);
            }
        }
        return mv;
    }

    private static class MethodEnterAdapter extends MethodVisitor {
        private final String owner;
        private final String methodName;
        private final String methodDesc;

        public MethodEnterAdapter(MethodVisitor methodVisitor, String owner, String methodName, String methodDesc) {
            super(Const.ASM_VERSION, methodVisitor);
            this.owner = owner;
            this.methodName = methodName;
            this.methodDesc = methodDesc;
        }

        @Override
        public void visitCode() {
            // 首先，处理自己的代码逻辑
            String message = String.format("Method Enter: %s.%s%s", owner, methodName, methodDesc);
            // (1) 引用自定义的类
            super.visitLdcInsn(message);
            super.visitMethodInsn(Opcodes.INVOKESTATIC, "lsieun/utils/ParameterUtils", "printText", "(Ljava/lang/String;)V", false);

            // (2) 引用 JDK 的内部类
//            super.visitFieldInsn(Opcodes.GETSTATIC, "java/lang/System", "out", "Ljava/io/PrintStream;");
//            super.visitLdcInsn(message);
//            super.visitMethodInsn(Opcodes.INVOKEVIRTUAL, "java/io/PrintStream", "println", "(Ljava/lang/String;)V", false);

            // 其次，调用父类的方法实现
            super.visitCode();
        }
    }
}
```

### Run

当我们运行的时候，会出现 `StackOverflowError` 错误：

```text
$ java -cp ./target/classes/ -javaagent:./target/TheAgent.jar sample.Program

transform class: sample/Program
transform class: lsieun/utils/ParameterUtils
Exception in thread "main" java.lang.StackOverflowError
        at lsieun.utils.ParameterUtils.printText(Unknown Source)
        at lsieun.utils.ParameterUtils.printText(Unknown Source)
        at lsieun.utils.ParameterUtils.printText(Unknown Source)
        ...
```

分析原因：`ParameterUtils` 类当中的 `printText` 对自身进行了调用，进入无尽循环的状态。

```text
public class ParameterUtils {
    public static void printText(String var0) {
        printText("Method Enter: lsieun/utils/ParameterUtils.printText(Ljava/lang/String;)V");
        System.out.println(var0);
    }
}
```

## 一个 Transformer

### Transformer 的分类

There are two kinds of transformers, determined by the `canRetransform` parameter of `Instrumentation.addTransformer(ClassFileTransformer,boolean)`:

- **retransformation capable transformers** that were added with `canRetransform` as `true`
- **retransformation incapable transformers** that were added with `canRetransform` as `false` or where added with `Instrumentation.addTransformer(ClassFileTransformer)`

```java
public interface Instrumentation {
    void addTransformer(ClassFileTransformer transformer);
    void addTransformer(ClassFileTransformer transformer, boolean canRetransform);
}
```

### 调用时机

- Once a transformer has been registered with `addTransformer`,
  the transformer will be called for **every new class definition** and **every class redefinition**.
- **Retransformation capable transformers** will also be called on **every class retransformation**.

![](/assets/images/java/agent/define-redefine-retransform.png)

- The request for a **new class definition** is made with `ClassLoader.defineClass` or its native equivalents.
- The request for a **class redefinition** is made with `Instrumentation.redefineClasses` or its native equivalents.
- The request for a **class retransformation** is made with `Instrumentation.retransformClasses` or its native equivalents.

```text
                               ┌─── define: ClassLoader.defineClass
               ┌─── loading ───┤
               │               └─── transform
class state ───┤
               │               ┌─── redefine: Instrumentation.redefineClasses
               └─── loaded ────┤
                               └─── retransform: Instrumentation.retransformClasses
```

在 OpenJDK 的源码中，`hotspot/src/share/vm/prims/jvmtiThreadState.hpp` 文件定义了一个 `JvmtiClassLoadKind` 结构：

```text
enum JvmtiClassLoadKind {
    jvmti_class_load_kind_load = 100,
    jvmti_class_load_kind_retransform,
    jvmti_class_load_kind_redefine
};
```

## 多个 Transformer

### 串联执行

When there are **multiple transformers**, transformations are composed by chaining the `transform` calls.
That is, the byte array returned by one call to `transform` becomes the input (via the `classfileBuffer` parameter) to the next call.

Transformations are applied in the following order:

- Retransformation incapable transformers
- Retransformation incapable native transformers
- Retransformation capable transformers
- Retransformation capable native transformers

For **retransformations**, the **retransformation incapable transformers** are not called,
instead the result of the previous transformation is reused.
In all other cases, this method is called.
Within each of these groupings, transformers are called in the order registered.
Native transformers are provided by the `ClassFileLoadHook` event in the Java Virtual Machine Tool Interface.

JVM 会去调用 `InstrumentationImpl.transform()` 方法，会再进一步调用 `TransformerManager.transform()` 方法：

```java
public class InstrumentationImpl implements Instrumentation {
    // WARNING: the native code knows the name & signature of this method
    private byte[] transform(ClassLoader loader,
                             String classname,
                             Class<?> classBeingRedefined,
                             ProtectionDomain protectionDomain,
                             byte[] classfileBuffer,
                             boolean isRetransformer) {
        TransformerManager mgr = isRetransformer ? mRetransfomableTransformerManager : mTransformerManager;
        if (mgr == null) {
            return null; // no manager, no transform
        }
        else {
            return mgr.transform(loader, classname, classBeingRedefined, protectionDomain, classfileBuffer);
        }
    }
}
```

在 `TransformerManager.transform()` 方法中，我们重点关注 `someoneTouchedTheBytecode` 和 `bufferToUse` 两个局部变量：

```java
public class TransformerManager {
    public byte[] transform(ClassLoader loader,
                            String classname,
                            Class<?> classBeingRedefined,
                            ProtectionDomain protectionDomain,
                            byte[] classfileBuffer) {
        boolean someoneTouchedTheBytecode = false;

        TransformerInfo[] transformerList = getSnapshotTransformerList();

        byte[] bufferToUse = classfileBuffer;

        // order matters, gotta run 'em in the order they were added
        for (int x = 0; x < transformerList.length; x++) {
            TransformerInfo transformerInfo = transformerList[x];
            ClassFileTransformer transformer = transformerInfo.transformer();
            byte[] transformedBytes = null;

            try {
                transformedBytes = transformer.transform(loader, classname, classBeingRedefined, protectionDomain, bufferToUse);
            } catch (Throwable t) {
                // don't let any one transformer mess it up for the others.
                // This is where we need to put some logging. What should go here? FIXME
            }

            if (transformedBytes != null) {
                someoneTouchedTheBytecode = true;
                bufferToUse = transformedBytes;
            }
        }

        // if someone modified it, return the modified buffer.
        // otherwise return null to mean "no transforms occurred"
        byte[] result;
        if (someoneTouchedTheBytecode) {
            result = bufferToUse;
        }
        else {
            result = null;
        }

        return result;
    }    
}
```

If the transformer throws an exception (which it doesn't catch),
subsequent transformers will still be called and the load, redefine or retransform will still be attempted.
**Thus, throwing an exception has the same effect as returning `null`.**

小总结：

- 第一，在多个 transformer 当中，任何一个 transform 抛出任何异常，则相当于该 transformer 返回了 `null` 值。
- 第二，在多个 transformer 当中，某一个 transform 抛出任何异常，并不会影响后续 transformer 的执行。


### First Input

The input (via the `classfileBuffer` parameter) to the first transformer is:

- for **new class definition**, the bytes passed to `ClassLoader.defineClass`
- for **class redefinition**, `definitions.getDefinitionClassFile()` where `definitions` is the parameter to `Instrumentation.redefineClasses`
- for **class retransformation**, the bytes passed to the **new class definition** or, **if redefined, the last redefinition**,
  with all transformations made by **retransformation incapable transformers** reapplied automatically and unaltered

![](/assets/images/java/agent/define-redefine-retransform.png)

在 OpenJDK 的源码中，`hotspot/src/share/vm/prims/jvmtiExport.cpp` 文件有如下代码：

```text
void post_all_envs() {
    if (_load_kind != jvmti_class_load_kind_retransform) {
        // for class load and redefine,
        // call the non-retransformable agents
        JvmtiEnvIterator it;
        for (JvmtiEnv* env = it.first(); env != NULL; env = it.next(env)) {
            if (!env->is_retransformable() && env->is_enabled(JVMTI_EVENT_CLASS_FILE_LOAD_HOOK)) {
                // non-retransformable agents cannot retransform back,
                // so no need to cache the original class file bytes
                post_to_env(env, false);
            }
        }
    }
    JvmtiEnvIterator it;
    for (JvmtiEnv* env = it.first(); env != NULL; env = it.next(env)) {
        // retransformable agents get all events
        if (env->is_retransformable() && env->is_enabled(JVMTI_EVENT_CLASS_FILE_LOAD_HOOK)) {
            // retransformable agents need to cache the original class file bytes
            // if changes are made via the ClassFileLoadHook
            post_to_env(env, true);
        }
    }
}

void post_to_env(JvmtiEnv* env, bool caching_needed) {
    unsigned char *new_data = NULL;
    jint new_len = 0;

    JvmtiClassFileLoadEventMark jem(_thread, _h_name, _class_loader,
                                    _h_protection_domain,
                                    _h_class_being_redefined);
    JvmtiJavaThreadEventTransition jet(_thread);
    JNIEnv* jni_env =  (JvmtiEnv::get_phase() == JVMTI_PHASE_PRIMORDIAL) ? NULL : jem.jni_env();
    jvmtiEventClassFileLoadHook callback = env->callbacks()->ClassFileLoadHook;
    if (callback != NULL) {
        (*callback)(env->jvmti_external(), jni_env,
                    jem.class_being_redefined(),
                    jem.jloader(), jem.class_name(),
                    jem.protection_domain(),
                    _curr_len, _curr_data,
                    &new_len, &new_data);
    }
    if (new_data != NULL) {
        // this agent has modified class data.
        if (caching_needed && *_cached_class_file_ptr == NULL) {
            // data has been changed by the new retransformable agent
            // and it hasn't already been cached, cache it
            JvmtiCachedClassFileData *p;
            p = (JvmtiCachedClassFileData *)os::malloc(
                    offset_of(JvmtiCachedClassFileData, data) + _curr_len, mtInternal);

            p->length = _curr_len;
            memcpy(p->data, _curr_data, _curr_len);
            *_cached_class_file_ptr = p;
        }

        if (_curr_data != *_data_ptr) {
            // curr_data is previous agent modified class data.
            // And this has been changed by the new agent so
            // we can delete it now.
            _curr_env->Deallocate(_curr_data);
        }

        // Class file data has changed by the current agent.
        _curr_data = new_data;
        _curr_len = new_len;
        // Save the current agent env we need this to deallocate the
        // memory allocated by this agent.
        _curr_env = env;
    }
}
```

## 示例二：First Input

### Agent Jar

#### LoadTimeAgent

```java
package lsieun.agent;

import lsieun.asm.visitor.MethodInfo;
import lsieun.instrument.*;
import lsieun.utils.*;

import java.lang.instrument.ClassFileTransformer;
import java.lang.instrument.Instrumentation;
import java.util.EnumSet;

public class LoadTimeAgent {
    public static void premain(String agentArgs, Instrumentation inst) {
        // 第一步，打印信息：agentArgs, inst, classloader, thread
        PrintUtils.printAgentInfo(LoadTimeAgent.class, "Premain-Class", agentArgs, inst);

        // 第二步，指定要处理的类
        String className = "sample.HelloWorld";

        // 第三步，使用 inst：添加 incapable transformer
        ClassFileTransformer transformer1 = new VersatileTransformer(className, EnumSet.of(MethodInfo.PARAMETER_VALUES));
        ClassFileTransformer transformer2 = new VersatileTransformer(className, EnumSet.of(MethodInfo.NAME_AND_DESC));
        inst.addTransformer(transformer1, false);
        inst.addTransformer(transformer2, false);

        // 第四步，使用 inst：添加 capable transformer
        ClassFileTransformer transformer3 = new VersatileTransformer(className, EnumSet.of(MethodInfo.THREAD_INFO));
        inst.addTransformer(transformer3, true);
        ClassFileTransformer transformer4 = new VersatileTransformer(className, EnumSet.of(MethodInfo.CLASSLOADER));
        inst.addTransformer(transformer4, true);
        ClassFileTransformer transformer5 = new DumpTransformer(className);
        inst.addTransformer(transformer5, true);
        
        // 第五步，加载目标类 define
        try {
            System.out.println("load class: " + className);
            Class<?> clazz = Class.forName(className);
            System.out.println("load success");
        } catch (ClassNotFoundException e) {
            System.out.println("load failed");
            e.printStackTrace();
        }

        // 第六步，使用 inst：移除 transformer
        inst.removeTransformer(transformer3);
    }
}
```

#### DynamicAgent

```java
package lsieun.agent;

import lsieun.utils.*;

import java.io.InputStream;
import java.lang.instrument.ClassDefinition;
import java.lang.instrument.Instrumentation;

public class DynamicAgent {
    public static void agentmain(String agentArgs, Instrumentation inst) {
        // 第一步，打印信息：agentArgs, inst, classloader, thread
        PrintUtils.printAgentInfo(DynamicAgent.class, "Agent-Class", agentArgs, inst);

        // 第二步，指定要处理的类
        String className = "sample.HelloWorld";

        // 第三步，使用 inst：进行 redefine 操作
        try {
            Class<?> clazz = Class.forName(className);
            if (inst.isModifiableClass(clazz)) {
                InputStream in = LoadTimeAgent.class.getResourceAsStream("/sample/HelloWorld.class");
                int available = in.available();
                byte[] bytes = new byte[available];
                in.read(bytes);
                ClassDefinition classDefinition = new ClassDefinition(clazz, bytes);
                inst.redefineClasses(classDefinition);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        // 第三步，使用 inst：进行 re-transform 操作
        try {
            Class<?> clazz = Class.forName(className);
            if (inst.isModifiableClass(clazz)) {
                inst.retransformClasses(clazz);
            }
        } catch (Exception ex) {
            ex.printStackTrace();
        }
    }
}
```

### Run

#### define

```text
$ java -cp ./target/classes/ -javaagent:./target/TheAgent.jar sample.Program

load class: sample.HelloWorld
transform class: sample/HelloWorld with [PARAMETER_VALUES]
---> sample/HelloWorld.add:(II)I
---> sample/HelloWorld.sub:(II)I
transform class: sample/HelloWorld with [NAME_AND_DESC]
---> sample/HelloWorld.add:(II)I
---> sample/HelloWorld.sub:(II)I
load success
transform class: sample/HelloWorld with [THREAD_INFO]
---> sample/HelloWorld.add:(II)I
---> sample/HelloWorld.sub:(II)I
transform class: sample/HelloWorld with [CLASSLOADER]
---> sample/HelloWorld.add:(II)I
---> sample/HelloWorld.sub:(II)I
```

#### redefine

```text
transform class: sample/HelloWorld with [PARAMETER_VALUES]
---> sample/HelloWorld.add:(II)I
---> sample/HelloWorld.sub:(II)I
transform class: sample/HelloWorld with [NAME_AND_DESC]
---> sample/HelloWorld.add:(II)I
---> sample/HelloWorld.sub:(II)I
transform class: sample/HelloWorld with [CLASSLOADER]
---> sample/HelloWorld.add:(II)I
---> sample/HelloWorld.sub:(II)I
```

#### retransform

```text
transform class: sample/HelloWorld with [CLASSLOADER]
---> sample/HelloWorld.add:(II)I
---> sample/HelloWorld.sub:(II)I
```





## 总结

本文内容总结如下：

- 第一点，如何实现 `ClassFileTransformer` 接口，应考虑哪些事情。
- 第二点，一个 transformer 关注的内容有两个：
  - Transformer 的分类：retransform capable transformer 和 retransform incapable transformer
  - Transformer 被 JVM 调用的三个时机：define、redefine 和 retransform
- 第三点，多个 transformer 关注的内容也有两个：
  - 在多个 transformer 的情况下，它们的前后调用关系：串联执行，前面的 transformer 输出，成为后面 transformer 的输入；遇到 transformer 异常，相当于返回 `null` 值，不影响后续 transformer 执行。
  - 在多个 transformer 的情况下，第一个 transformer 接收到 `classfileBuffer` 到底是什么呢？在三种不同的时机下，它的值是不同的。
