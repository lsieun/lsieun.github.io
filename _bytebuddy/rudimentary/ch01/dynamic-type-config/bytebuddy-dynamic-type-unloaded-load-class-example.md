---
title: "类的加载"
sequence: "106"
---

## 不同的类加载策略

### Unloaded.load()

在 `DynamicType.Unloaded` 接口中，`load` 方法中可以使用不同的类加载策略（`ClassLoadingStrategy`）：

```java
public interface DynamicType {
    interface Unloaded<T> extends DynamicType {
        Loaded<T> load(ClassLoader classLoader);

        <S extends ClassLoader> Loaded<T> load(S classLoader, ClassLoadingStrategy<? super S> classLoadingStrategy);
    }
}
```

### ClassLoadingStrategy

在 `ClassLoadingStrategy.Default` 中定义了 5 个枚举常量：

- `WRAPPER`
- `WRAPPER_PERSISTENT`
- `CHILD_FIRST`
- `CHILD_FIRST_PERSISTENT`
- `INJECTION`

```java
public interface ClassLoadingStrategy<T extends ClassLoader> {
    enum Default implements Configurable<ClassLoader> {
        WRAPPER(new WrappingDispatcher(ByteArrayClassLoader.PersistenceHandler.LATENT, WrappingDispatcher.PARENT_FIRST)),
        WRAPPER_PERSISTENT(new WrappingDispatcher(ByteArrayClassLoader.PersistenceHandler.MANIFEST, WrappingDispatcher.PARENT_FIRST)),
        CHILD_FIRST(new WrappingDispatcher(ByteArrayClassLoader.PersistenceHandler.LATENT, WrappingDispatcher.CHILD_FIRST)),
        CHILD_FIRST_PERSISTENT(new WrappingDispatcher(ByteArrayClassLoader.PersistenceHandler.MANIFEST, WrappingDispatcher.CHILD_FIRST)),
        INJECTION(new InjectionDispatcher());
    }
}
```

这 5 个不同的枚举常量围绕着两个问题来展开：

- 第一个问题，到底使用哪一个 ClassLoader 来加载呢？
- 第二个问题，该不该保存动态生成的 `byte[]` 内容呢？

![](/assets/images/bytebuddy/dynamic-type-loading.png)

## 示例程序

```java
import net.bytebuddy.ByteBuddy;
import net.bytebuddy.description.modifier.Visibility;
import net.bytebuddy.dynamic.DynamicType;
import net.bytebuddy.dynamic.loading.ClassLoadingStrategy;
import net.bytebuddy.implementation.FixedValue;

import java.io.InputStream;

public class HelloWorldLoad {
    public static void main(String[] args) {
        // 1. prepare
        String className = "sample.HelloWorld";
        ClassLoader classLoader = ClassLoader.getSystemClassLoader();


        // 2. weave
        ByteBuddy byteBuddy = new ByteBuddy();
        DynamicType.Builder<?> builder = byteBuddy.subclass(Object.class)
                .name(className);

        builder = builder.defineMethod("test", Object.class, Visibility.PUBLIC)
                .intercept(FixedValue.nullValue());


        // 第三步，Builder --> Unloaded
        DynamicType.Unloaded<?> unloadedType = builder.make();


        // 第四步，Unloaded --> Loaded
        DynamicType.Loaded<?> loadedType = unloadedType.load(classLoader, ClassLoadingStrategy.Default.CHILD_FIRST);


        // 第五步，Loaded --> Class
        Class<?> clazz = loadedType.getLoaded();


        // 第六步，探究 ClassLoader
        ClassLoader currentLoader = clazz.getClassLoader();
        printClassLoader(currentLoader);
        printResourceAvailable(currentLoader, className.replace(".", "/") + ".class");
    }

    private static void printClassLoader(ClassLoader classLoader) {
        System.out.println(classLoader);
        ClassLoader parent = classLoader.getParent();
        if (parent != null) {
            printClassLoader(parent);
        }
    }

    private static void printResourceAvailable(ClassLoader classLoader, String resourceName) throws Exception {
        try (
                InputStream in = classLoader.getResourceAsStream(resourceName)
        ) {
            if (in != null) {
                System.out.println("resource size: " + in.available());
            }
            else {
                System.out.println("resource is not available");
            }
        }
    }
}
```

### WRAPPER

当使用 `ClassLoadingStrategy.Default.WRAPPER` 时：

```text
DynamicType.Loaded<?> loadedType = unloadedType.load(classLoader, ClassLoadingStrategy.Default.WRAPPER);
```

出现如下错误：

```text
java.lang.IllegalStateException: Class already loaded: class sample.HelloWorld
```

原因分析：在项目代码中，有一个 `sample/HelloWorld.java` 文件，它编译过后生成的 `sample/HelloWorld.class` 文件会被 System ClassLoader 加载。

解决方法：删除项目当中的 `sample/HelloWorld.java` 文件，然后执行 `mvn clean compile`，再次运行。

这时候，输出结果如下：

```text
net.bytebuddy.dynamic.loading.ByteArrayClassLoader@309e345f
jdk.internal.loader.ClassLoaders$AppClassLoader@682a0b20
jdk.internal.loader.ClassLoaders$PlatformClassLoader@318ba8c8
resource is not available
```

### WRAPPER_PERSISTENT

当使用 `ClassLoadingStrategy.Default.WRAPPER_PERSISTENT` 时：

```text
DynamicType.Loaded<?> loadedType = unloadedType.load(classLoader, ClassLoadingStrategy.Default.WRAPPER_PERSISTENT);
```

输出结果如下：

```text
net.bytebuddy.dynamic.loading.ByteArrayClassLoader@309e345f
jdk.internal.loader.ClassLoaders$AppClassLoader@682a0b20
jdk.internal.loader.ClassLoaders$PlatformClassLoader@318ba8c8
resource size: 190    // 注意，此时可以读取到相应的 byte[] 内容
```

### CHILD_FIRST

当使用 `ClassLoadingStrategy.Default.CHILD_FIRST` 时：

```text
DynamicType.Loaded<?> loadedType = unloadedType.load(classLoader, ClassLoadingStrategy.Default.CHILD_FIRST);
```

输出结果如下：

```text
net.bytebuddy.dynamic.loading.ByteArrayClassLoader$ChildFirst@4445629
jdk.internal.loader.ClassLoaders$AppClassLoader@682a0b20
jdk.internal.loader.ClassLoaders$PlatformClassLoader@647fd8ce
resource is not available
```

此时，注意两个事情：

- 第一件事情，现在使用的是 `ByteArrayClassLoader.ChildFirst` 类加载器，它是 `ByteArrayClassLoader` 的子类。
- 第二件事情，即使项目当中有 `sample/HelloWorld.java` 文件，也会加载动态生成的类

### CHILD_FIRST_PERSISTENT

当使用 `ClassLoadingStrategy.Default.CHILD_FIRST_PERSISTENT` 时：

```text
DynamicType.Loaded<?> loadedType = unloadedType.load(classLoader, ClassLoadingStrategy.Default.CHILD_FIRST_PERSISTENT);
```

输出结果如下：

```text
net.bytebuddy.dynamic.loading.ByteArrayClassLoader$ChildFirst@4445629
jdk.internal.loader.ClassLoaders$AppClassLoader@682a0b20
jdk.internal.loader.ClassLoaders$PlatformClassLoader@647fd8ce
resource size: 190
```

### INJECTION

当使用 `ClassLoadingStrategy.Default.INJECTION` 时：

```text
DynamicType.Loaded<?> loadedType = unloadedType.load(classLoader, ClassLoadingStrategy.Default.INJECTION);
```

会出现如下错误：

```text
java.lang.IllegalStateException: Cannot inject already loaded type: class sample.HelloWorld
```

下面的话来自 `ClassLoadingStrategy.Default.INJECTION` 的注解：

Class injection requires access to JVM internal methods
that are sealed by security managers and the Java Platform module system.
**Since Java 11, access to these methods is no longer feasible unless those packages are explicitly opened.**

因为 `sun.misc.Unsafe` 位于 `jdk.unsupported` 模块当中，我们需要在 `module-info.java` 中添加对它的依赖：

```java
module lsieun.buddy {
    requires net.bytebuddy;
    requires jdk.unsupported;
}
```

输出结果如下：

```text
jdk.internal.loader.ClassLoaders$AppClassLoader@682a0b20
jdk.internal.loader.ClassLoaders$PlatformClassLoader@24269709
resource is not available
```

## 总结

本文内容总结如下：

- 第一点，动态生成的类，需要加载进到 JVM 当中，才能应用起来。
- 第二点，加载类，有不同的策略 / 方式。
