---
title: "NamingStrategy"
sequence: "103"
---

## name

```java
import net.bytebuddy.ByteBuddy;
import net.bytebuddy.dynamic.DynamicType;

public class HelloWorldSubClass {
    public static void main(String[] args) {
        ByteBuddy byteBuddy = new ByteBuddy();
        DynamicType.Builder<?> builder = byteBuddy.subclass(Object.class)
                .name("sample.HelloWorld");
        DynamicType.Unloaded<?> unloadedType = builder.make();
        OutputUtils.save(unloadedType);
    }
}
```

```text
sample.HelloWorld
```

## NamingStrategy

The default Byte Buddy configuration provides a `NamingStrategy`
which randomly creates a class name based on a dynamic type's superclass name.

Furthermore, the name is defined to be in the same package as the super class
such that package-private methods of the direct superclass are always visible to the dynamic type.
If you for example subclassed a type named `example.Foo`,
the generated name will be something like `example.Foo$$ByteBuddy$$1376491271`
where the numeric sequence is random.

An exception of this rule is made
when subclassing types from the `java.lang` package where types such as `Object` live.
Java's security model does not allow custom types to live in this namespace.
Therefore, such type names are prefixed with `net.bytebuddy.renamed` by the **default naming strategy**.

### java.lang.Object

```java
import net.bytebuddy.ByteBuddy;
import net.bytebuddy.dynamic.DynamicType;

public class HelloWorldSubClass {
    public static void main(String[] args) {
        ByteBuddy byteBuddy = new ByteBuddy();
        DynamicType.Builder<?> builder = byteBuddy.subclass(Object.class);
        DynamicType.Unloaded<?> unloadedType = builder.make();
        OutputUtils.save(unloadedType);
    }
}
```

```text
net.bytebuddy.renamed.java.lang.Object$ByteBuddy$W6uyclA9
```

### sample.Parent

```java
public class Parent {
}
```

```text
sample.Parent$ByteBuddy$UXFXJs9h
```



### Custom

```java
import net.bytebuddy.ByteBuddy;
import net.bytebuddy.NamingStrategy;
import net.bytebuddy.description.type.TypeDescription;
import net.bytebuddy.dynamic.DynamicType;

public class HelloWorldGenerate {
    public static void main(String[] args) {
        ByteBuddy byteBuddy = new ByteBuddy();
        byteBuddy = byteBuddy.with(new NamingStrategy.AbstractBase() {
            @Override
            protected String name(TypeDescription superClass) {
                return "i.love.ByteBuddy." + superClass.getSimpleName();
            }
        });
        DynamicType.Builder<?> builder = byteBuddy.subclass(Object.class);
        DynamicType.Unloaded<?> unloadedType = builder.make();
        OutputUtils.save(unloadedType);
    }
}
```

```text
i.love.ByteBuddy.Object
```

### SuffixingRandom

If you need to customize the naming behavior,
consider using Byte Buddy's built-in `NamingStrategy.SuffixingRandom`
which you can customize to include a prefix that is more meaningful to your application than our default.

```java
import net.bytebuddy.ByteBuddy;
import net.bytebuddy.NamingStrategy;
import net.bytebuddy.dynamic.DynamicType;

public class HelloWorldSubClass {
    public static void main(String[] args) {
        NamingStrategy namingStrategy = new NamingStrategy.SuffixingRandom("xyz");

        ByteBuddy byteBuddy = new ByteBuddy()
                .with(namingStrategy);
        DynamicType.Builder<?> builder = byteBuddy.subclass(Object.class);
        DynamicType.Unloaded<?> unloadedType = builder.make();
        OutputUtils.save(unloadedType);
    }
}
```

```text
net.bytebuddy.renamed.java.lang.Object$xyz$7JbozHCz
```

### PrefixingRandom

```java
import net.bytebuddy.ByteBuddy;
import net.bytebuddy.NamingStrategy;
import net.bytebuddy.dynamic.DynamicType;

public class HelloWorldSubClass {
    public static void main(String[] args) {
        NamingStrategy namingStrategy = new NamingStrategy.PrefixingRandom("xyz");

        ByteBuddy byteBuddy = new ByteBuddy()
                .with(namingStrategy);
        DynamicType.Builder<?> builder = byteBuddy.subclass(Object.class);
        DynamicType.Unloaded<?> unloadedType = builder.make();
        OutputUtils.save(unloadedType);
    }
}
```

```text
xyz.java.lang.Object$AP5T8FNN
```
