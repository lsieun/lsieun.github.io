---
title: "TypeValidation"
sequence: "103"
---

```java
import net.bytebuddy.ByteBuddy;
import net.bytebuddy.dynamic.DynamicType;

public class HelloWorldSubClass {
    public static void main(String[] args) throws Exception {
        ByteBuddy byteBuddy = new ByteBuddy();
        DynamicType.Builder<?> builder = byteBuddy.subclass(Object.class)
                .name("sample.0HelloWorld");
        DynamicType.Unloaded<?> unloadedType = builder.make();
        OutputUtils.save(unloadedType);
    }
}
```

```text
java.lang.IllegalStateException: Illegal type name: sample.0HelloWorld for class sample.0HelloWorld
```

```java
import net.bytebuddy.ByteBuddy;
import net.bytebuddy.dynamic.DynamicType;
import net.bytebuddy.dynamic.scaffold.TypeValidation;

public class HelloWorldSubClass {
    public static void main(String[] args) throws Exception {
        ByteBuddy byteBuddy = new ByteBuddy()
                .with(TypeValidation.DISABLED);
        DynamicType.Builder<?> builder = byteBuddy.subclass(Object.class)
                .name("sample.0HelloWorld");
        DynamicType.Unloaded<?> unloadedType = builder.make();
        OutputUtils.save(unloadedType);
    }
}
```


