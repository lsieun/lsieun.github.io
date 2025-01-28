---
title: "Loading a class"
sequence: "107"
---

A type that is created by Byte Buddy is represented by an instance of `DynamicType.Unloaded`.
As the name suggests, these types are not loaded into the Java virtual machine.
Instead, classes created by Byte Buddy are represented in their binary form, in the Java class file format.
This way, it is up to you to decide what you want to do with a generated type.

For example, you might want to run Byte Buddy from a **build script**
that only generates classes to enhance a Java application before it is deployed.
For this purpose, the `DynamicType.Unloaded` class allows to extract a byte array that represents the dynamic type.
For convenience, the type additionally offers a `saveIn(File)` method that allows you to store a class in **a given folder**.
Furthermore, it allows you to `inject(File)` classes into **an existing jar file**.

While directly accessing a class's binary form is straight forward, **loading a type** is unfortunately more complex.
In Java, all classes are loaded using a `ClassLoader`.
One example for such a class loader is the **bootstrap class loader**
which is responsible for loading the classes that are shipped within the Java class library.
The **system class loader**, on the other hand, is responsible for loading classes on the Java application's class path.
Obviously, none of these preexisting class loaders is aware of any dynamic class we have created.
To overcome this, we have to find other possibilities for loading a runtime generated class.
Byte Buddy offers solutions by different approaches out of the box:

After creating a `DynamicType.Unloaded`, this type can be loaded using a `ClassLoadingStrategy`.
If no such strategy is provided, Byte Buddy infers such a strategy based on the provided class loader and
creates a new class loader only for the bootstrap class loader
where no type can be injected using reflection which is otherwise the default.

Byte Buddy provides several class loadings strategies out of the box
where each follows one of the concepts that were described above.
These strategies are defined in `ClassLoadingStrategy.Default`
where the `WRAPPER` strategy creates a new, wrapping ClassLoader,
where the `CHILD_FIRST` strategy creates a similar class loader with child-first semantics and
where the `INJECTION` strategy injects a dynamic type using reflection.

Both the `WRAPPER` and the `CHILD_FIRST` strategies are also available in so-called **manifest** versions
where a type's binary format is preserved even after a class was loaded.
These alternative versions make the binary representation of a class loader's classes accessible
via the `ClassLoader::getResourceAsStream` method.
However, note that this requires these class loaders to maintain a reference to the full binary representation of a class
what consumes space on a JVM's heap.
Therefore, you should only use the manifest versions if you plan to actually access the binary format.
Since the `INJECTION` strategy works via reflection and
without a possibility to change the semantics of the `ClassLoader::getResourceAsStream` method,
it is naturally not available in a manifest version.

```java
import net.bytebuddy.ByteBuddy;
import net.bytebuddy.dynamic.loading.ClassLoadingStrategy;

public class HelloWorldLoad {
    public static void main(String[] args) {
        ClassLoader classLoader = ClassLoader.getSystemClassLoader();
        Class<?> type = new ByteBuddy()
                .subclass(Object.class)
                .make()
                .load(classLoader, ClassLoadingStrategy.Default.WRAPPER)
                .getLoaded();
        System.out.println(type.getName());
        System.out.println(type.getClassLoader());
    }
}
```





