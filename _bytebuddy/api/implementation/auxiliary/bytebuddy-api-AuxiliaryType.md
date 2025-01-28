---
title: "AuxiliaryType"
sequence: "103"
---

## 是什么

```text
HelloWorld$auxiliary$<random>
```

This helper class is called an `AuxiliaryType` within Byte Buddy's terminology.



## 类的方法

```java
public interface AuxiliaryType {
    DynamicType make(String auxiliaryTypeName,
                     ClassFileVersion classFileVersion,
                     MethodAccessorFactory methodAccessorFactory);

    String getSuffix();
}
```

### NamingStrategy

```java
public interface AuxiliaryType {
    interface NamingStrategy {
        String name(TypeDescription instrumentedType, AuxiliaryType auxiliaryType);
    }
}
```

### SuffixingRandom

```java
public interface AuxiliaryType {
    interface NamingStrategy {
        class SuffixingRandom implements NamingStrategy {
            private final String suffix;

            private final RandomString randomString;

            public SuffixingRandom(String suffix) {
                this.suffix = suffix;
                randomString = new RandomString();
            }

            public String name(TypeDescription instrumentedType, AuxiliaryType auxiliaryType) {
                return instrumentedType.getName() + "$" + suffix + "$" + randomString.nextString();
            }
        }
    }
}
```

## ByteBuddy

```java
public class ByteBuddy {
    public static final String DEFAULT_NAMING_PROPERTY = "net.bytebuddy.naming";
    private static final String BYTE_BUDDY_DEFAULT_SUFFIX = "auxiliary";

    private static final AuxiliaryType.NamingStrategy DEFAULT_AUXILIARY_NAMING_STRATEGY;

    static {
        DEFAULT_AUXILIARY_NAMING_STRATEGY == null
    }

    public ByteBuddy() {
        this(ClassFileVersion.ofThisVm(ClassFileVersion.JAVA_V5));
    }

    public ByteBuddy(ClassFileVersion classFileVersion) {
        this(classFileVersion,
                ...
                DEFAULT_AUXILIARY_NAMING_STRATEGY == null
                        ? new AuxiliaryType.NamingStrategy.SuffixingRandom(BYTE_BUDDY_DEFAULT_SUFFIX)
                        : DEFAULT_AUXILIARY_NAMING_STRATEGY,
                ...
    }
}
```

## DynamicType 和 AuxiliaryType 的关系

Auxiliary types are created on demand by Byte Buddy
and are directly accessible from the `DynamicType` interface after a class was created.

```java
public interface DynamicType {
    TypeDescription getTypeDescription();

    byte[] getBytes();
    
    Map<TypeDescription, byte[]> getAuxiliaryTypes();

    Map<TypeDescription, byte[]> getAllTypes();
}
```

```text
getAllTypes() = currentType + getAuxiliaryTypes()

currentType = getTypeDescription() + getBytes()
```

```text
                                                            ┌─── getTypeDescription()
                                     ┌─── currentType ──────┤
DynamicType ───┼─── getAllTypes() ───┤                      └─── getBytes()
                                     │
                                     └─── auxiliaryTypes ───┼─── getAuxiliaryTypes()
```

```java
public interface DynamicType {
    class Default implements DynamicType {
        // （1）当前类型
        protected final TypeDescription typeDescription;
        protected final byte[] binaryRepresentation;

        // （2）辅助类型
        protected final List<? extends DynamicType> auxiliaryTypes;

        // （1）当前类型
        public TypeDescription getTypeDescription() {
            return typeDescription;
        }

        // （1）当前类型
        public byte[] getBytes() {
            return binaryRepresentation;
        }

        // （2）辅助类型
        public Map<TypeDescription, byte[]> getAuxiliaryTypes() {
            Map<TypeDescription, byte[]> auxiliaryTypes = new HashMap<TypeDescription, byte[]>();
            for (DynamicType auxiliaryType : auxiliaryTypes) {
                auxiliaryTypes.put(auxiliaryType.getTypeDescription(), auxiliaryType.getBytes());
                auxiliaryTypes.putAll(auxiliaryType.getAuxiliaryTypes());
            }
            return auxiliaryTypes;
        }

        // （3）所有类型 = 当前类型 + 辅助类型
        public Map<TypeDescription, byte[]> getAllTypes() {
            Map<TypeDescription, byte[]> allTypes = new LinkedHashMap<TypeDescription, byte[]>();
            allTypes.put(typeDescription, binaryRepresentation);
            for (DynamicType auxiliaryType : auxiliaryTypes) {
                allTypes.putAll(auxiliaryType.getAllTypes());
            }
            return allTypes;
        }
    }
}
```

Because of such auxiliary types,
the manual creation of one dynamic type might result in the creation of several additional types
which aid the implementation of the original class.

## 示例

### MethodDelegation

原有 `HelloWorld.test()` 方法的实现：

```java
public class HelloWorld {

    public String test(String name, int age) {
        return String.format("HelloWorld: %s - %d", name, age);
    }
}
```

预期目标：`HelloWorld.test()` 方法交给 `HardWorker.doWork()` 方法来完成。

```java
public class HelloWorld {
    public String test(String name, int age) {
        return HardWorker.doWork(...);
    }
}
```

其中，`HardWorker` 的实现如下：

```java
import net.bytebuddy.implementation.bind.annotation.RuntimeType;
import net.bytebuddy.implementation.bind.annotation.SuperCall;

import java.util.concurrent.Callable;

public class HardWorker {
    @RuntimeType
    public static Object doWork(@SuperCall Callable<String> executable) throws Exception {
        String result = executable.call();
        return "HardWorker: " + result;
    }
}
```

编码实现：

```java
import net.bytebuddy.ByteBuddy;
import net.bytebuddy.dynamic.DynamicType;
import net.bytebuddy.implementation.MethodDelegation;
import net.bytebuddy.matcher.ElementMatchers;

public class HelloWorldRebase {
    public static void main(String[] args) {
        // 1. prepare
        String className = "sample.HelloWorld";
        Class<?> clazz = ClassUtils.loadClass(className);


        // 2. weave
        ByteBuddy byteBuddy = new ByteBuddy();
        DynamicType.Builder<?> builder = byteBuddy.rebase(clazz);

        builder = builder.method(
                ElementMatchers.named("test")
        ).intercept(
                MethodDelegation.to(HardWorker.class)
        );


        // 3. output
        DynamicType.Unloaded<?> unloadedType = builder.make();
        OutputUtils.save(unloadedType, true);
    }
}
```

输出结果：

```text
Main Type: 
    sample.HelloWorld
Auxiliary Types: 1
    sample.HelloWorld$auxiliary$Random
```

新生成的 `HelloWorld` 类：

```java
public class HelloWorld {
    public String test(String name, int age) {
        return (String)HardWorker.doWork(new HelloWorld$auxiliary$Random(this, name, age));
    }

    private String test$original$Abc(String name, int age) {
        return String.format("HelloWorld: %s - %d", name, age);
    }

    final String test$original$Abc$accessor$Xyz(String name, int age) {
        return this.test$original$Abc(name, age);
    }
}
```

新生成的 `HelloWorld$auxiliary$<random>` 辅助类：

```java
class HelloWorld$auxiliary$Random implements Runnable, Callable {
    private HelloWorld instance;
    private String name;
    private int age;

    HelloWorld$auxiliary$Random(HelloWorld instance, String name, int age) {
        this.instance = instance;
        this.name = name;
        this.age = age;
    }

    public void run() {
        this.instance.test$original$Abc$accessor$Xyz(this.name, this.age);
    }

    public Object call() throws Exception {
        return this.instance.test$original$Abc$accessor$Xyz(this.name, this.age);
    }
}
```

### 内部类

平常的情况，一个类就能独立存在，不需要依赖其它的类型：

```java
public class HelloWorld {
    public void test() {
        System.out.println("Hello World");
    }
}
```

在有些情况下，一个类与其它类之间有关联关系：

```java
public class OuterClass {

    public class FirstInnerClass {
    }

    public class SecondInnerClass {
    }
}
```

`OuterClass` 类与 `FirstInnerClass` 和 `SecondInnerClass` 内部类有关联。
我们可以将 `OuterClass` 类看成主要的类，而 `FirstInnerClass` 和 `SecondInnerClass` 内部类可以看成是辅助类（AuxiliaryType）。

大多数情况下，辅助类（AuxiliaryType）是由 ByteBuddy 帮助我们生成的。当然，我们也可以自己添加辅助类（AuxiliaryType）。

```java
import net.bytebuddy.ByteBuddy;
import net.bytebuddy.description.modifier.Visibility;
import net.bytebuddy.dynamic.DynamicType;

public class HelloWorldGenerate {
    public static void main(String[] args) {
        // 1. prepare
        String outerClassName = "sample.OuterClass";
        String innerClassName1 = "sample.OuterClass$FirstInnerClass";
        String innerClassName2 = "sample.OuterClass$SecondInnerClass";


        // 2. weave
        ByteBuddy byteBuddy = new ByteBuddy();

        DynamicType.Builder<Object> outerBuilder = byteBuddy.subclass(Object.class)
                .modifiers(Visibility.PUBLIC)
                .name(outerClassName);
        DynamicType.Builder<Object> innerBuilder1 = byteBuddy.subclass(Object.class)
                .modifiers(Visibility.PUBLIC)
                .name(innerClassName1);
        DynamicType.Builder<Object> innerBuilder2 = byteBuddy.subclass(Object.class)
                .modifiers(Visibility.PUBLIC)
                .name(innerClassName2);

        innerBuilder1 = innerBuilder1.innerTypeOf(outerBuilder.toTypeDescription()).asMemberType();
        innerBuilder2 = innerBuilder2.innerTypeOf(outerBuilder.toTypeDescription()).asMemberType();
        outerBuilder = outerBuilder.declaredTypes(innerBuilder1.toTypeDescription(), innerBuilder2.toTypeDescription());


        // 第三步，Builder --> Unloaded
        DynamicType.Unloaded<?> unloadedType = outerBuilder.make().include(innerBuilder1.make(), innerBuilder2.make());
        OutputUtils.save(unloadedType, true);
    }
}
```

输出结果：

```text
Main Type: 
    sample.OuterClass
Auxiliary Types: 2
    sample.OuterClass$FirstInnerClass
    sample.OuterClass$SecondInnerClass
```
