---
title: "Lambda: InvokeDynamic"
sequence: "111"
---

## Generate Lambda Expression

```java
import java.util.function.Consumer;

public class HelloWorld {
    public Consumer<String> test() {
        return GoodChild::study;
    }
}
```

```java
public class GoodChild {
    public static void study(String subject) {
        System.out.println("I'm studying " + subject);
    }
}
```

```java
import net.bytebuddy.ByteBuddy;
import net.bytebuddy.description.method.MethodDescription;
import net.bytebuddy.description.modifier.Visibility;
import net.bytebuddy.description.type.TypeDescription;
import net.bytebuddy.dynamic.DynamicType;
import net.bytebuddy.implementation.InvokeDynamic;
import net.bytebuddy.matcher.ElementMatchers;


import java.util.function.Consumer;

public class HelloWorldGenerate {
    public static void main(String[] args) {
        // 1. prepare
        String className = "sample.HelloWorld";


        // 2. weave
        ByteBuddy byteBuddy = new ByteBuddy();
        DynamicType.Builder<?> builder = byteBuddy.subclass(Object.class)
                .modifiers(Visibility.PUBLIC)
                .name(className);


        TypeDescription.Generic generic = TypeDescription.Generic.Builder
                .parameterizedType(Consumer.class, String.class)
                .build();
        MethodDescription.InDefinedShape implMethod = TypeDescription.ForLoadedType.of(GoodChild.class)
                .getDeclaredMethods()
                .filter(ElementMatchers.named("study"))
                .getOnly();

        builder = builder.defineMethod("test", generic, Visibility.PUBLIC)
                .intercept(
                        InvokeDynamic.lambda(
                                implMethod,
                                generic
                        )
                );


        // 3. output
        DynamicType.Unloaded<?> unloadedType = builder.make();
        OutputUtils.save(unloadedType);
    }
}
```
