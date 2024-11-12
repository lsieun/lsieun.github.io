---
title: "Target Object"
sequence: "106"
---

## to(Object)

```java
import java.io.Serializable;

public class GoodChild implements Serializable {
    public void play() {
        System.out.println("The Child is Playing");
    }
}
```

```java
import net.bytebuddy.ByteBuddy;
import net.bytebuddy.description.modifier.Visibility;
import net.bytebuddy.dynamic.DynamicType;
import net.bytebuddy.dynamic.loading.ClassLoadingStrategy;
import net.bytebuddy.implementation.MethodDelegation;

import java.lang.reflect.Constructor;
import java.lang.reflect.Method;

public class HelloWorldLoad {
    public static void main(String[] args) {
        // 1. prepare
        String className = "sample.HelloWorld";


        // 2. weave
        ByteBuddy byteBuddy = new ByteBuddy();
        DynamicType.Builder<?> builder = byteBuddy.subclass(Object.class)
                .name(className);

        GoodChild child = new GoodChild();
        builder = builder.defineMethod("test", void.class, Visibility.PUBLIC)
                .intercept(
                        MethodDelegation.to(child)
                );


        // 3. output
        DynamicType.Unloaded<?> unloadedType = builder.make();
        OutputUtils.save(unloadedType);


        // 第四步，进行加载
        ClassLoader classLoader = ClassLoader.getSystemClassLoader();
        DynamicType.Loaded<?> loadedType = unloadedType.load(classLoader, ClassLoadingStrategy.Default.CHILD_FIRST);
        Class<?> clazz = loadedType.getLoaded();


        // 第五步，创建对象
        Constructor<?> constructor = clazz.getDeclaredConstructor();
        Object instance = constructor.newInstance();
        Method method = clazz.getDeclaredMethod("test");
        Object obj = method.invoke(instance);
        System.out.println(obj);
    }
}
```

## toConstructor

```java
public class HelloWorld {
    public Object test() {
        return new String();
    }
}
```

```java
import net.bytebuddy.ByteBuddy;
import net.bytebuddy.description.modifier.Visibility;
import net.bytebuddy.dynamic.DynamicType;
import net.bytebuddy.implementation.MethodDelegation;

public class HelloWorldGenerate {
    public static void main(String[] args) {
        // 1. prepare
        String className = "sample.HelloWorld";


        // 2. weave
        ByteBuddy byteBuddy = new ByteBuddy();
        DynamicType.Builder<?> builder = byteBuddy.subclass(Object.class)
                .modifiers(Visibility.PUBLIC)
                .name(className);

        builder = builder.defineMethod("test", Object.class, Visibility.PUBLIC)
                .intercept(
                        MethodDelegation.toConstructor(String.class)
                );


        // 3. output
        DynamicType.Unloaded<?> unloadedType = builder.make();
        OutputUtils.save(unloadedType);
    }
}
```
