---
title: "StubMethod（默认实现）"
sequence: "stub-method"
---

## 介绍

The `StubMethod.INSTANCE` creates a **method stub**
which returns **the default value** of **the return type** of the method.

```text
method stub = a piece of code
```

```java
public enum StubMethod implements Implementation.Composable, ByteCodeAppender {
    INSTANCE;
}
```

默认值:

- 如果返回值类型是 `void`，则直接返回 `return`。
- 如果返回值类型是 `boolean`，则返回 `return false`。
- 如果返回值类型是 `char`，则返回 `return null`。
- 如果返回值类型是数值类型（numeric type），例如 `int` 和 `long`，则返回 `return 0`。
- 如果返回值类型是引用类型（reference type），包括 `Integer`、`Long` 等，则返回 `return null`。

## 示例

### 示例一

```java
import net.bytebuddy.ByteBuddy;
import net.bytebuddy.description.modifier.Visibility;
import net.bytebuddy.dynamic.DynamicType;
import net.bytebuddy.implementation.StubMethod;

public class HelloWorldSubClass {
    public static void main(String[] args) {
        // 1. prepare
        String className = "sample.HelloWorld";


        // 2. weave
        ByteBuddy byteBuddy = new ByteBuddy();
        DynamicType.Builder<?> builder = byteBuddy.subclass(Object.class)
                .modifiers(Visibility.PUBLIC)
                .name(className);

        builder = builder.defineMethod("test", void.class, Visibility.PUBLIC)    // 可尝试替换成 int.class、String.class
                .intercept(StubMethod.INSTANCE);


        // 3. output
        DynamicType.Unloaded<?> unloadedType = builder.make();
        OutputUtils.save(unloadedType);
    }
}
```

```java
public class HelloWorld {
    public void test() {
    }
}
```

### 示例二

```java
import net.bytebuddy.ByteBuddy;
import net.bytebuddy.description.modifier.Visibility;
import net.bytebuddy.dynamic.DynamicType;
import net.bytebuddy.implementation.StubMethod;

public class HelloWorldSubClass {
    public static void main(String[] args) {
        // 1. prepare
        String className = "sample.HelloWorld";


        // 2. weave
        ByteBuddy byteBuddy = new ByteBuddy();
        DynamicType.Builder<?> builder = byteBuddy.subclass(Object.class)
                .modifiers(Visibility.PUBLIC)
                .name(className);

        Class<?>[] array = {
                void.class,
                boolean.class,
                short.class, char.class,
                int.class, float.class,
                long.class, double.class,
                String.class, Object.class
        };
        for (Class<?> clazz : array) {
            String methodName = String.format("%sMethod", clazz.getSimpleName());
            builder = builder.defineMethod(methodName, clazz, Visibility.PUBLIC)
                    .intercept(StubMethod.INSTANCE);
        }


        // 3. output
        DynamicType.Unloaded<?> unloadedType = builder.make();
        OutputUtils.save(unloadedType);
    }
}
```

```java
public class HelloWorld {
    public void voidMethod() {
    }

    public boolean booleanMethod() {
        return false;
    }

    public short shortMethod() {
        return 0;
    }

    public char charMethod() {
        return '\u0000';
    }

    public int intMethod() {
        return 0;
    }

    public float floatMethod() {
        return 0.0F;
    }

    public long longMethod() {
        return 0L;
    }

    public double doubleMethod() {
        return 0.0;
    }

    public String StringMethod() {
        return null;
    }

    public Object ObjectMethod() {
        return null;
    }
}
```
