---
title: "System.out.println()"
sequence: "101"
---

```text
                                   ┌─── StubMethod
                  ┌─── exit ───────┤
                  │                └─── ExceptionMethod
                  │
                  ├─── constant ───┼─── FixedValue
                  │
                  ├─── field ──────┼─── FieldAccessor
                  │
Implementation ───┤                ┌─── MethodCall
                  │                │
                  │                ├─── SuperMethodCall
                  ├─── method ─────┤
                  │                ├─── DefaultMethodCall
                  │                │
                  │                └─── MethodDelegation
                  │
                  └─── opcode ─────┼─── StackManipulation
```

## 预期目标


```java
public class HelloWorld {
    public void test() {
        System.out.println("Hello Test");
    }
}
```

## 编码实现

### 方式一：反射

```java
import net.bytebuddy.ByteBuddy;
import net.bytebuddy.description.field.FieldDescription;
import net.bytebuddy.description.method.MethodDescription;
import net.bytebuddy.description.modifier.Visibility;
import net.bytebuddy.dynamic.DynamicType;
import net.bytebuddy.implementation.MethodCall;

import java.io.PrintStream;
import java.lang.reflect.Field;
import java.lang.reflect.Method;

public class HelloWorldSubClass {
    public static void main(String[] args) {
        // 1. prepare
        String className = "sample.HelloWorld";


        // 2. weave
        ByteBuddy byteBuddy = new ByteBuddy();
        DynamicType.Builder<?> builder = byteBuddy.subclass(Object.class)
                .modifiers(Visibility.PUBLIC)
                .name(className);

        // PrintStream.println(String)
        Method printMethod = PrintStream.class.getMethod("println", String.class);
        MethodDescription methodDesc = new MethodDescription.ForLoadedMethod(printMethod);

        // System.out
        Field outField = System.class.getField("out");
        FieldDescription fieldDesc = new FieldDescription.ForLoadedField(outField);

        // System.out.println(String)
        MethodCall methodCall = MethodCall.invoke(methodDesc)
                .onField(fieldDesc)
                .with("Hello World");

        builder = builder.defineMethod("test", void.class, Visibility.PUBLIC)
                .intercept(methodCall);


        // 3. output
        DynamicType.Unloaded<?> unloadedType = builder.make();
        OutputUtils.save(unloadedType);
    }
}
```

### 方式二：FilterableList

```java
import net.bytebuddy.ByteBuddy;
import net.bytebuddy.description.field.FieldDescription;
import net.bytebuddy.description.method.MethodDescription;
import net.bytebuddy.description.modifier.Visibility;
import net.bytebuddy.description.type.TypeDescription;
import net.bytebuddy.dynamic.DynamicType;
import net.bytebuddy.implementation.MethodCall;
import net.bytebuddy.matcher.ElementMatchers;

import java.io.PrintStream;

public class HelloWorldSubClass {
    public static void main(String[] args) {
        // 1. prepare
        String className = "sample.HelloWorld";


        // 2. weave
        ByteBuddy byteBuddy = new ByteBuddy();
        DynamicType.Builder<?> builder = byteBuddy.subclass(Object.class)
                .modifiers(Visibility.PUBLIC)
                .name(className);

        // PrintStream.println(String)
        MethodDescription methodDesc = TypeDescription.ForLoadedType.of(PrintStream.class)
                .getDeclaredMethods().filter(
                        ElementMatchers.named("println").and(
                                ElementMatchers.takesArgument(0, String.class)
                        )
                ).getOnly();

        // System.out
        FieldDescription fieldDesc = TypeDescription.ForLoadedType.of(System.class)
                .getDeclaredFields().filter(ElementMatchers.named("out")).getOnly();

        // System.out.println(String)
        MethodCall methodCall = MethodCall.invoke(methodDesc)
                .onField(fieldDesc)
                .with("Hello World");

        builder = builder.defineMethod("test", void.class, Visibility.PUBLIC)
                .intercept(methodCall);


        // 3. output
        DynamicType.Unloaded<?> unloadedType = builder.make();
        OutputUtils.save(unloadedType);
    }
}
```

### 方式三：Latent

- `FieldDescription.Latent`
- `MethodDescription.Latent`

```java
import net.bytebuddy.ByteBuddy;
import net.bytebuddy.description.field.FieldDescription;
import net.bytebuddy.description.method.MethodDescription;
import net.bytebuddy.description.modifier.Visibility;
import net.bytebuddy.description.type.TypeDescription;
import net.bytebuddy.dynamic.DynamicType;
import net.bytebuddy.implementation.MethodCall;
import org.objectweb.asm.Opcodes;

import java.io.PrintStream;
import java.util.List;

public class HelloWorldSubClass {
    public static void main(String[] args) {
        // 1. prepare
        String className = "sample.HelloWorld";


        // 2. weave
        ByteBuddy byteBuddy = new ByteBuddy();
        DynamicType.Builder<?> builder = byteBuddy.subclass(Object.class)
                .modifiers(Visibility.PUBLIC)
                .name(className);

        // PrintStream.println(String)
        MethodDescription methodDesc = new MethodDescription.Latent(
                TypeDescription.ForLoadedType.of(PrintStream.class),
                new MethodDescription.Token(
                        "println",
                        Opcodes.ACC_PUBLIC,
                        TypeDescription.Generic.OfNonGenericType.ForLoadedType.of(void.class),
                        List.of(
                                TypeDescription.Generic.OfNonGenericType.ForLoadedType.of(String.class)
                        )
                )
        );

        // System.out
        FieldDescription fieldDesc = new FieldDescription.Latent(
                TypeDescription.ForLoadedType.of(System.class),
                new FieldDescription.Token(
                        "out",
                        Opcodes.ACC_PUBLIC | Opcodes.ACC_STATIC | Opcodes.ACC_FINAL,
                        TypeDescription.Generic.OfNonGenericType.ForLoadedType.of(PrintStream.class)
                )
        );

        // System.out.println(String)
        MethodCall methodCall = MethodCall.invoke(methodDesc)
                .onField(fieldDesc)
                .with("Hello World");

        builder = builder.defineMethod("test", void.class, Visibility.PUBLIC)
                .intercept(methodCall);


        // 3. output
        DynamicType.Unloaded<?> unloadedType = builder.make();
        OutputUtils.save(unloadedType);
    }
}
```

### 方式四：ByteCodeAppender

#### Subclass

```java
import net.bytebuddy.ByteBuddy;
import net.bytebuddy.description.modifier.Visibility;
import net.bytebuddy.dynamic.DynamicType;
import sample.MyImplementation;

public class HelloWorldSubClass {
    public static void main(String[] args) {
        // 1. prepare
        String className = "sample.HelloWorld";


        // 2. weave
        ByteBuddy byteBuddy = new ByteBuddy();
        DynamicType.Builder<?> builder = byteBuddy.subclass(Object.class)
                .modifiers(Visibility.PUBLIC)
                .name(className);

        builder = builder.defineMethod("test", void.class, Visibility.PUBLIC)
                .intercept(MyImplementation.of("Hello Test"));

        // 3. output
        DynamicType.Unloaded<?> unloadedType = builder.make();
        OutputUtils.save(unloadedType, true);
    }
}
```

#### Implementation

```java
import net.bytebuddy.dynamic.scaffold.InstrumentedType;
import net.bytebuddy.implementation.Implementation;
import net.bytebuddy.implementation.StubMethod;
import net.bytebuddy.implementation.bytecode.ByteCodeAppender;

public class MyImplementation implements Implementation {

    private final String str;

    private MyImplementation(String str) {
        this.str = str;
    }

    @Override
    public InstrumentedType prepare(InstrumentedType instrumentedType) {
        return instrumentedType;
    }

    @Override
    public ByteCodeAppender appender(Target implementationTarget) {
        return new ByteCodeAppender.Compound(
                MyByteCodeAppender.of(str),
                StubMethod.INSTANCE
        );
    }

    public static MyImplementation of(String str) {
        return new MyImplementation(str);
    }
}
```

#### ByteCodeAppender

```java
import net.bytebuddy.description.method.MethodDescription;
import net.bytebuddy.implementation.Implementation;
import net.bytebuddy.implementation.bytecode.ByteCodeAppender;
import org.objectweb.asm.MethodVisitor;
import org.objectweb.asm.Opcodes;

public class MyByteCodeAppender implements ByteCodeAppender {
    private final String str;

    private MyByteCodeAppender(String str) {
        this.str = str;
    }

    @Override
    public Size apply(MethodVisitor methodVisitor,
                      Implementation.Context implementationContext,
                      MethodDescription instrumentedMethod) {
        methodVisitor.visitFieldInsn(Opcodes.GETSTATIC, "java/lang/System", "out", "Ljava/io/PrintStream;");
        methodVisitor.visitLdcInsn(str);
        methodVisitor.visitMethodInsn(Opcodes.INVOKEVIRTUAL, "java/io/PrintStream", "println", "(Ljava/lang/String;)V", false);
        return new Size(2, instrumentedMethod.getStackSize());
    }

    public static MyByteCodeAppender of(String str) {
        return new MyByteCodeAppender(str);
    }
}
```




