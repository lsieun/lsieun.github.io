---
title: "StackManipulation（栈操作）"
sequence: "stack-manipulation"
---

- Implementation: method body
- ByteCodeAppender: code segment (multiple instruction)
- StackManipulation: one instruction

## 示例

```java
import net.bytebuddy.implementation.Implementation;
import net.bytebuddy.implementation.bytecode.StackManipulation;
import net.bytebuddy.jar.asm.MethodVisitor;
import net.bytebuddy.jar.asm.Opcodes;

public enum IntegerSum implements StackManipulation {
    INSTANCE; // singleton

    @Override
    public boolean isValid() {
        return true;
    }

    @Override
    public Size apply(MethodVisitor methodVisitor, Implementation.Context implementationContext) {
        methodVisitor.visitInsn(Opcodes.IADD);
        return new Size(-1, 0);
    }
}
```

```java
import net.bytebuddy.description.method.MethodDescription;
import net.bytebuddy.implementation.Implementation;
import net.bytebuddy.implementation.bytecode.ByteCodeAppender;
import net.bytebuddy.implementation.bytecode.StackManipulation;
import net.bytebuddy.implementation.bytecode.constant.IntegerConstant;
import net.bytebuddy.implementation.bytecode.member.MethodReturn;
import net.bytebuddy.jar.asm.MethodVisitor;

public enum SumMethod implements ByteCodeAppender {
    INSTANCE; // singleton

    @Override
    public Size apply(MethodVisitor methodVisitor,
                      Implementation.Context implementationContext,
                      MethodDescription instrumentedMethod) {
        if (!instrumentedMethod.getReturnType().asErasure().represents(int.class)) {
            throw new IllegalArgumentException(instrumentedMethod + "must return int");
        }

        StackManipulation.Size operandStackSize = new StackManipulation.Compound(
                IntegerConstant.forValue(10),
                IntegerConstant.forValue(50),
                IntegerSum.INSTANCE,
                MethodReturn.INTEGER
        ).apply(methodVisitor, implementationContext);

        return new Size(operandStackSize.getMaximalSize(), instrumentedMethod.getStackSize());
    }
}
```

```java
import lsieun.buddy.implementation.bytecode.SumMethod;
import net.bytebuddy.dynamic.scaffold.InstrumentedType;
import net.bytebuddy.implementation.Implementation;
import net.bytebuddy.implementation.bytecode.ByteCodeAppender;

public enum SumImplementation implements Implementation {
    INSTANCE; // singleton

    @Override
    public InstrumentedType prepare(InstrumentedType instrumentedType) {
        return instrumentedType;
    }

    @Override
    public ByteCodeAppender appender(Target implementationTarget) {
        return SumMethod.INSTANCE;
    }
}
```

```java
import net.bytebuddy.ByteBuddy;
import net.bytebuddy.description.modifier.Visibility;
import net.bytebuddy.description.type.TypeDescription;
import net.bytebuddy.dynamic.DynamicType;

import java.io.File;
import java.util.Map;

public class HelloWorldGenerate {
    public static void main(String[] args) {
        // 1. prepare
        String className = "sample.HelloWorld";

        // 2. weave
        ByteBuddy byteBuddy = new ByteBuddy();
        DynamicType.Builder<?> builder = byteBuddy.subclass(Object.class)
                .modifiers(Visibility.PUBLIC)
                .name(className);

        builder = builder.defineMethod("test",int.class, Visibility.PUBLIC)
                .intercept(
                        SumImplementation.INSTANCE
                );

        // 3. output
        DynamicType.Unloaded<?> unloadedType = builder.make();
        Map<TypeDescription, File> map = unloadedType.saveIn(FileUtils.OUTPUT_DIR);
        for (Map.Entry<TypeDescription, File> entry : map.entrySet()) {
            String type = entry.getKey().getName();
            String path = entry.getValue().getPath().replace("\\", "/");
            String message = String.format("%s: file:///%s", type, path);
            System.out.println(message);
        }
    }
}
```

```java
import java.lang.reflect.Method;

public class HelloWorldRun {
    public static void main(String[] args) {
        Class<?> clazz = Class.forName("sample.HelloWorld");
        Method method = clazz.getDeclaredMethod("test");

        Object instance = clazz.newInstance();
        Object result = method.invoke(instance);
        System.out.println(result);
    }
}
```


