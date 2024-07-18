---
title: "ClassLoadingStrategy"
sequence: "105"
---

```java
public interface ClassLoadingStrategy<T extends ClassLoader> {
    Map<TypeDescription, Class<?>> load(@MaybeNull T classLoader, Map<TypeDescription, byte[]> types);
}
```

```java
public interface ClassLoadingStrategy<T extends ClassLoader> {
    enum Default implements Configurable<ClassLoader> {
        WRAPPER(new WrappingDispatcher(
                ByteArrayClassLoader.PersistenceHandler.LATENT,
                WrappingDispatcher.PARENT_FIRST)),
        WRAPPER_PERSISTENT(new WrappingDispatcher(
                ByteArrayClassLoader.PersistenceHandler.MANIFEST,
                WrappingDispatcher.PARENT_FIRST)),

        CHILD_FIRST(new WrappingDispatcher(
                ByteArrayClassLoader.PersistenceHandler.LATENT,
                WrappingDispatcher.CHILD_FIRST)),
        CHILD_FIRST_PERSISTENT(new WrappingDispatcher(
                ByteArrayClassLoader.PersistenceHandler.MANIFEST,
                WrappingDispatcher.CHILD_FIRST)),

        INJECTION(new InjectionDispatcher());
    }
}
```

- `ClassLoadingStrategy.Default.CHILD_FIRST`:
  The child-first class loading strategy is a modified version of the `WRAPPER`
  where the dynamic types are given priority over any types of a parent class loader with the same name.

```java
public class HelloWorld {
    public void test() {
        System.out.println("test");
    }
}
```

```java
import net.bytebuddy.ByteBuddy;
import net.bytebuddy.description.modifier.Visibility;
import net.bytebuddy.dynamic.DynamicType;
import net.bytebuddy.dynamic.loading.ClassLoadingStrategy;
import net.bytebuddy.implementation.FixedValue;

public class HelloWorldLoad {
    public static void main(String[] args) throws Exception {
        // 第一步，准备参数
        String className = "sample.HelloWorld";
        Class<?> clazz = Class.forName(className);


        // 第二步，生成类
        ByteBuddy byteBuddy = new ByteBuddy();
        DynamicType.Builder<?> builder = byteBuddy.subclass(Object.class)
                .name(className);

        builder = builder.defineMethod("test", Object.class, Visibility.PUBLIC)
                .intercept(FixedValue.nullValue());


        // 第三步，输出结果
        DynamicType.Unloaded<?> unloadedType = builder.make();


        // 第四步，进行加载
        ClassLoader classLoader = ClassLoader.getSystemClassLoader();
        DynamicType.Loaded<?> loadedType = unloadedType.load(classLoader, ClassLoadingStrategy.Default.CHILD_FIRST);
        Class<?> loadedClazz = loadedType.getLoaded();

        System.out.println("First  ClassLoader: " + clazz.getClassLoader());
        System.out.println("Second ClassLoader: " + loadedClazz.getClassLoader());
    }
}
```

```text
First  ClassLoader: jdk.internal.loader.ClassLoaders$AppClassLoader@78308db1
Second ClassLoader: net.bytebuddy.dynamic.loading.ByteArrayClassLoader$ChildFirst@418e7838
```
