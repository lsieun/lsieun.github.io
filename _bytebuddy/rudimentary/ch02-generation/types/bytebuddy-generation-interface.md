---
title: "接口 Interface"
sequence: "102"
---

## 定义接口

### Marker Interface

预期目标：

```java
public interface HelloWorld {
}
```

编码实现：

```java
import net.bytebuddy.ByteBuddy;
import net.bytebuddy.dynamic.DynamicType;

public class HelloWorldGenerate {
    public static void main(String[] args) {
        // 1. prepare
        String className = "sample.HelloWorld";


        // 2. weave
        ByteBuddy byteBuddy = new ByteBuddy();
        DynamicType.Builder<?> builder = byteBuddy.makeInterface()
                .name(className);

        // 3. output
        DynamicType.Unloaded<?> unloadedType = builder.make();
        OutputUtils.save(unloadedType);
    }
}
```



### 字段

预期目标：

```java
public interface HelloWorld {
    String str = "HelloWorld";
}
```

编码实现：

```java
import net.bytebuddy.ByteBuddy;
import net.bytebuddy.description.modifier.FieldManifestation;
import net.bytebuddy.description.modifier.Ownership;
import net.bytebuddy.description.modifier.Visibility;
import net.bytebuddy.dynamic.DynamicType;

public class HelloWorldGenerate {
    public static void main(String[] args) {
        // 1. prepare
        String className = "sample.HelloWorld";


        // 2. weave
        ByteBuddy byteBuddy = new ByteBuddy();
        DynamicType.Builder<?> builder = byteBuddy.makeInterface()
                .name(className);

        builder = builder.defineField(
                        "str",
                        String.class,
                        Visibility.PUBLIC,
                        Ownership.STATIC,
                        FieldManifestation.FINAL
                )
                .value("HelloWorld");

        // 3. output
        DynamicType.Unloaded<?> unloadedType = builder.make();
        OutputUtils.save(unloadedType);
    }
}
```

### 抽象方法

预期目标：

```java
public interface HelloWorld {
    void test();
}
```

编码实现：

```java
import net.bytebuddy.ByteBuddy;
import net.bytebuddy.description.modifier.Visibility;
import net.bytebuddy.dynamic.DynamicType;

public class HelloWorldGenerate {
    public static void main(String[] args) {
        // 1. prepare
        String className = "sample.HelloWorld";


        // 2. weave
        ByteBuddy byteBuddy = new ByteBuddy();
        DynamicType.Builder<?> builder = byteBuddy.makeInterface()
                .name(className);

        builder = builder.defineMethod("test", void.class, Visibility.PUBLIC)
                .withoutCode();

        // 3. output
        DynamicType.Unloaded<?> unloadedType = builder.make();
        OutputUtils.save(unloadedType);
    }
}
```

### default 方法

预期目标：生成 `MyInterface`，带有 `default` 方法

```java
public interface MyInterface {
    default void test() {
        System.out.println("Hello World");
    }
}
```

编码实现：

```java
import net.bytebuddy.ByteBuddy;
import net.bytebuddy.description.modifier.Visibility;
import net.bytebuddy.dynamic.DynamicType;

public class HelloWorldGenerate {
    public static void main(String[] args) {
        // 1. prepare
        String className = "sample.MyInterface";


        // 2. weave
        ByteBuddy byteBuddy = new ByteBuddy();
        DynamicType.Builder<?> builder = byteBuddy.makeInterface()
                .name(className);


        builder = builder.defineMethod("test", void.class, Visibility.PUBLIC)
                .intercept(
                        ImplementationUtils.print("Hello World")
                );

        // 3. output
        DynamicType.Unloaded<?> unloadedType = builder.make();
        OutputUtils.save(unloadedType);
    }
}
```

进行验证：

```java
import net.bytebuddy.ByteBuddy;
import net.bytebuddy.description.modifier.Visibility;
import net.bytebuddy.description.type.TypeDescription;
import net.bytebuddy.dynamic.DynamicType;

public class HelloWorldSubClass {
    public static void main(String[] args) {
        // 1. prepare
        String className = "sample.HelloWorld";


        // 2. weave
        ByteBuddy byteBuddy = new ByteBuddy();
        DynamicType.Builder<?> builder = byteBuddy.subclass(Object.class)
                .modifiers(Visibility.PUBLIC)
                .name(className);

        builder = builder.implement(
                TypeDescription.ForLoadedType.of(
                        Class.forName("sample.MyInterface")
                )
        );


        // 3. output
        DynamicType.Unloaded<?> unloadedType = builder.make();
        OutputUtils.save(unloadedType);
    }
}
```

```java
import java.lang.reflect.Constructor;
import java.lang.reflect.Method;

public class HelloWorldRun {
    public static void main(String[] args) {
        Class<?> myInterface = Class.forName("sample.MyInterface");
        Method method = myInterface.getDeclaredMethod("test");

        String className = "sample.HelloWorld";
        Class<?> clazz = ClassUtils.loadClass(className);
        Constructor<?> constructor = clazz.getConstructor();
        Object instance = constructor.newInstance();

        Object result = method.invoke(instance);
        System.out.println("result = " + result);
    }
}
```

## 实现接口

### Marker Interface

预期目标：

```java
public interface HelloWorld extends Cloneable, Serializable {
}
```

编码实现：

```java
import net.bytebuddy.ByteBuddy;
import net.bytebuddy.dynamic.DynamicType;

import java.io.Serializable;

public class HelloWorldGenerate {
    public static void main(String[] args) {
        // 1. prepare
        String className = "sample.HelloWorld";


        // 2. weave
        ByteBuddy byteBuddy = new ByteBuddy();
        DynamicType.Builder<?> builder = byteBuddy.makeInterface(
                        Cloneable.class,
                        Serializable.class
                )
                .name(className);

        // 3. output
        DynamicType.Unloaded<?> unloadedType = builder.make();
        OutputUtils.save(unloadedType);
    }
}
```


### 泛型接口

预期目标：

```java
public class HelloWorld implements Comparable<HelloWorld> {
    private final int intValue;

    public HelloWorld(int intValue) {
        this.intValue = intValue;
    }

    @Override
    public int compareTo(HelloWorld that) {
        return this.intValue - that.intValue;
    }
}
```

编码实现：

```java
import net.bytebuddy.dynamic.scaffold.InstrumentedType;
import net.bytebuddy.implementation.Implementation;
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
        return MyByteCodeAppender.of(str);
    }

    public static MyImplementation of(String str) {
        return new MyImplementation(str);
    }
}
```

```java
import net.bytebuddy.description.method.MethodDescription;
import net.bytebuddy.implementation.Implementation;
import net.bytebuddy.implementation.bytecode.ByteCodeAppender;
import org.objectweb.asm.MethodVisitor;
import org.objectweb.asm.Opcodes;

public class MyByteCodeAppender implements ByteCodeAppender {
    private final String fieldName;

    private MyByteCodeAppender(String fieldName) {
        this.fieldName = fieldName;
    }

    @Override
    public Size apply(MethodVisitor methodVisitor,
                      Implementation.Context implementationContext,
                      MethodDescription instrumentedMethod) {
        String internalName = implementationContext.getInstrumentedType().getInternalName();


        methodVisitor.visitVarInsn(Opcodes.ALOAD, 0);
        methodVisitor.visitFieldInsn(Opcodes.GETFIELD, internalName, fieldName, "I");
        methodVisitor.visitVarInsn(Opcodes.ALOAD, 1);
        methodVisitor.visitFieldInsn(Opcodes.GETFIELD, internalName, fieldName, "I");
        methodVisitor.visitInsn(Opcodes.ISUB);
        methodVisitor.visitInsn(Opcodes.IRETURN);
        return new Size(2, instrumentedMethod.getStackSize());
    }

    public static MyByteCodeAppender of(String fieldName) {
        return new MyByteCodeAppender(fieldName);
    }
}
```

```java
import net.bytebuddy.ByteBuddy;
import net.bytebuddy.description.method.MethodDescription;
import net.bytebuddy.description.modifier.FieldManifestation;
import net.bytebuddy.description.modifier.Visibility;
import net.bytebuddy.description.type.TypeDescription;
import net.bytebuddy.dynamic.DynamicType;
import net.bytebuddy.dynamic.scaffold.subclass.ConstructorStrategy;
import net.bytebuddy.implementation.FieldAccessor;
import net.bytebuddy.implementation.MethodCall;
import net.bytebuddy.matcher.ElementMatchers;
import sample.MyImplementation;

public class HelloWorldSubClass {
    public static void main(String[] args) {
        // 1. prepare
        String className = "sample.HelloWorld";


        // 2. weave
        ByteBuddy byteBuddy = new ByteBuddy();
        DynamicType.Builder<?> builder = byteBuddy.subclass(Object.class, ConstructorStrategy.Default.NO_CONSTRUCTORS)
                .modifiers(Visibility.PUBLIC)
                .name(className);

        // interface: Comparable<HelloWorld>
        TypeDescription compareType = TypeDescription.ForLoadedType.of(Comparable.class);
        TypeDescription.Generic compareParameterized = TypeDescription.Generic.Builder
                .parameterizedType(compareType, builder.toTypeDescription())
                .build();
        builder = builder.implement(compareParameterized);

        // field: intValue
        builder = builder.defineField(
                "intValue",
                int.class,
                Visibility.PRIVATE, FieldManifestation.FINAL
        );

        // constructor
        TypeDescription.Generic superClass = builder.toTypeDescription().getSuperClass();
        MethodDescription.InGenericShape superConstructor = superClass.getDeclaredMethods()
                .filter(ElementMatchers.isDefaultConstructor())
                .getOnly();
        builder = builder.defineConstructor(Visibility.PUBLIC)
                .withParameter(int.class, "val")
                .intercept(
                        MethodCall.invoke(
                                superConstructor
                        ).andThen(
                                FieldAccessor.ofField("intValue").setsArgumentAt(0)
                        )
                );

        // method: compareTo
        builder = builder.method(ElementMatchers.named("compareTo"))
                .intercept(MyImplementation.of("intValue"));

        // method: toString
        builder = builder.withToString();


        // 3. output
        DynamicType.Unloaded<?> unloadedType = builder.make();
        OutputUtils.save(unloadedType);
    }
}
```

进行验证：

```java
import java.lang.reflect.Constructor;
import java.lang.reflect.Method;

public class HelloWorldRun {
    public static void main(String[] args) {
        String className = "sample.HelloWorld";
        Class<?> clazz = ClassUtils.loadClass(className);

        Constructor<?> constructor = clazz.getConstructor(int.class);
        Object instance1 = constructor.newInstance(10);
        Object instance2 = constructor.newInstance(20);


        Method method = Comparable.class.getMethod("compareTo", Object.class);
        Object result = method.invoke(instance1, instance2);
        System.out.println("result = " + result);
    }
}
```


