---
title: "从 invokedynamic 到 bootstrap method"
sequence: "101"
---

第一步：

```text
invokedynamic    ---->    CONSTANT_InvokeDynamic    ---->    LambdaMetafactory.metafactory()
   (Code)                    (Constant Pool)                        (BootstrapMethods)
```

第二步：

```text
理解 LambdaMetafactory.metafactory()方法的 6 个参数的含义
```

第三步：

```text
从 LambdaMetafactory.metafactory()方法的源代码入手，找到新生成的.class 文件，如何输出出来。
```

```java
public final class LambdaMetafactory {
    public static CallSite metafactory(MethodHandles.Lookup caller,
                                       String interfaceMethodName,
                                       MethodType factoryType,
                                       MethodType interfaceMethodType,
                                       MethodHandle implementation,
                                       MethodType dynamicMethodType)
            throws LambdaConversionException {
        AbstractValidatingLambdaMetafactory mf;
        mf = new InnerClassLambdaMetafactory(Objects.requireNonNull(caller),  // 第一步，找到 InnerClassLambdaMetafactory 类
                Objects.requireNonNull(factoryType),
                Objects.requireNonNull(interfaceMethodName),
                Objects.requireNonNull(interfaceMethodType),
                Objects.requireNonNull(implementation),
                Objects.requireNonNull(dynamicMethodType),
                false,
                EMPTY_CLASS_ARRAY,
                EMPTY_MT_ARRAY);
        mf.validateMetafactoryArgs();
        return mf.buildCallSite(); // 第二步，找到该类的 buildCallSite 方法
    }
}
```

```java
final class InnerClassLambdaMetafactory extends AbstractValidatingLambdaMetafactory {
    CallSite buildCallSite() throws LambdaConversionException {
        final Class<?> innerClass = spinInnerClass(); // 第三步，找到 spinInnerClass()方法
        ......
    }

    private Class spinInnerClass() throws LambdaConversionException {
        String[] interfaces;
        String samIntf = samBase.getName().replace('.', '/');
        // ......

        cw.visit(CLASSFILE_VERSION, ACC_SUPER + ACC_FINAL + ACC_SYNTHETIC,
                lambdaClassName, null,
                JAVA_LANG_OBJECT, interfaces);

        // Generate final fields to be filled in by constructor
        for (int i = 0; i < argDescs.length; i++) {
            FieldVisitor fv = cw.visitField(ACC_PRIVATE + ACC_FINAL,
                    argNames[i],
                    argDescs[i],
                    null, null);
            fv.visitEnd();
        }

        generateConstructor();
        // ......

        // Forward the SAM method
        MethodVisitor mv = cw.visitMethod(ACC_PUBLIC, samMethodName,
                samMethodType.toMethodDescriptorString(), null, null);
        mv.visitAnnotation("Ljava/lang/invoke/LambdaForm$Hidden;", true);
        new ForwardingMethodGenerator(mv).generate(samMethodType);

        // Forward the bridges
        // ......

        cw.visitEnd();

        // Define the generated class in this VM.
        final byte[] classBytes = cw.toByteArray();

        // If requested, dump out to a file for debugging purposes
        // ......

        return UNSAFE.defineAnonymousClass(targetClass, classBytes, null);
    }
}
```



