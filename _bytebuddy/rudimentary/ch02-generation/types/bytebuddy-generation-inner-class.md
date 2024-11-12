---
title: "Inner Class"
sequence: "105"
---

## 示例一

预期目标：

```java
public class OuterClass {
    public static class InnerClass {
    }
}
```

编码实现：

```java
import net.bytebuddy.ByteBuddy;
import net.bytebuddy.description.modifier.Ownership;
import net.bytebuddy.description.modifier.Visibility;
import net.bytebuddy.dynamic.DynamicType;

public class HelloWorldGenerate {
    public static void main(String[] args) {
        // 1. prepare
        String outerClassName = "sample.OuterClass";
        String innerClassName = "sample.OuterClass$InnerClass";


        // 2. weave
        ByteBuddy byteBuddy = new ByteBuddy();

        DynamicType.Builder<Object> outerBuilder = byteBuddy.subclass(Object.class)
                .modifiers(Visibility.PUBLIC)
                .name(outerClassName);
        DynamicType.Builder<Object> innerBuilder = byteBuddy.subclass(Object.class)
                .modifiers(Visibility.PUBLIC, Ownership.STATIC)
                .name(innerClassName);

        innerBuilder = innerBuilder.innerTypeOf(outerBuilder.toTypeDescription()).asMemberType();
        outerBuilder = outerBuilder.declaredTypes(innerBuilder.toTypeDescription());


        // 3. output
        DynamicType.Unloaded<?> unloadedType = outerBuilder.make().include(innerBuilder.make());
        OutputUtils.save(unloadedType);
    }
}
```

## 示例二

预期目标：

```java
public class HelloWorld$InnerClass {
    public String test() {
        return null;
    }
}
```

编码实现：

```java
import net.bytebuddy.ByteBuddy;
import net.bytebuddy.description.modifier.Visibility;
import net.bytebuddy.description.type.TypeDescription;
import net.bytebuddy.dynamic.DynamicType;
import net.bytebuddy.implementation.FixedValue;
import net.bytebuddy.jar.asm.Opcodes;

public class HelloWorldGenerate {
    public static void main(String[] args) {
        // 1. prepare
        String className = "sample.HelloWorld$InnerClass";


        // 2. weave
        ByteBuddy byteBuddy = new ByteBuddy();

        TypeDescription innerClassDesc = new TypeDescription.Latent(
                className,
                Opcodes.ACC_PUBLIC,
                TypeDescription.Generic.OBJECT
        ) {
            @Override
            public String getSimpleName() {
                return "Storage";
            }

            @Override
            public boolean isAnonymousType() {
                return false;
            }

            @Override
            public boolean isMemberType() {
                return true;
            }
        };

        DynamicType.Builder<?> builder = byteBuddy.subclass(Object.class)
                .name(innerClassDesc.getName())
                .innerTypeOf(HelloWorld.class)
                .asMemberType();

        builder = builder.defineMethod("test", String.class, Visibility.PUBLIC)
                .intercept(FixedValue.nullValue());


        // 3. output
        DynamicType.Unloaded<?> unloadedType = builder.make();
        OutputUtils.save(unloadedType);
    }
}
```

## Reference

- [How to create a class with an inner classes?](https://github.com/raphw/byte-buddy/issues/1077)
