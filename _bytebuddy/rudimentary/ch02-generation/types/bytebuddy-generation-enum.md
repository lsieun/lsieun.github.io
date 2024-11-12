---
title: "枚举 Enum"
sequence: "104"
---

## 示例一：

```java
public enum HelloWorld {
    RED,
    GREEN,
    BLUE;

    private HelloWorld() {
    }
}
```

```java
import net.bytebuddy.ByteBuddy;
import net.bytebuddy.dynamic.DynamicType;

public class HelloWorldGenerate {
    public static void main(String[] args) {
        // 1. prepare
        String className = "sample.HelloWorld";


        // 2. weave
        ByteBuddy byteBuddy = new ByteBuddy();
        DynamicType.Builder<?> builder = byteBuddy.makeEnumeration("RED", "GREEN", "BLUE")
                .name(className);

        // 3. output
        DynamicType.Unloaded<?> unloadedType = builder.make();
        OutputUtils.save(unloadedType);
    }
}
```

## 示例二：

```java
package sample;

public enum HelloWorld implements Runnable {
    RED,
    GREEN,
    BLUE;

    public void run() {
    }

    private HelloWorld() {
    }
}
```

```java
import net.bytebuddy.ByteBuddy;
import net.bytebuddy.description.modifier.Visibility;
import net.bytebuddy.dynamic.DynamicType;
import net.bytebuddy.implementation.StubMethod;

public class HelloWorldGenerate {
    public static void main(String[] args) {
        // 1. prepare
        String className = "sample.HelloWorld";


        // 2. weave
        ByteBuddy byteBuddy = new ByteBuddy();
        DynamicType.Builder<?> builder = byteBuddy.makeEnumeration("RED", "GREEN", "BLUE")
                .name(className)
                .implement(Runnable.class);

        builder = builder.defineMethod("run", void.class, Visibility.PUBLIC)
                .intercept(StubMethod.INSTANCE);


        // 3. output
        DynamicType.Unloaded<?> unloadedType = builder.make();
        OutputUtils.save(unloadedType);
    }
}
```

## 示例三：带构造方法的 enum

```java
package sample;

public enum HelloWorld {
    RED("red"),
    GREEN("green"),
    BLUE("blue");

    private String name;

    private HelloWorld(String name) {
        this.name = name;
    }
}
```

我没有尝试过

