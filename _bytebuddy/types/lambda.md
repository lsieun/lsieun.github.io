---
title: "Lambda: InvokeDynamic"
sequence: "111"
---

## Generate Lambda Expression

```java
import java.util.function.Consumer;

public class HelloWorld {
    public Consumer test() {
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
import net.bytebuddy.description.modifier.Visibility;
import net.bytebuddy.dynamic.DynamicType;
import net.bytebuddy.implementation.InvokeDynamic;
import sample.GoodChild;

import java.util.function.Consumer;

public class HelloWorldByteBuddy {
    public static void main(String[] args) throws Exception {
        // 第一步，准备参数
        String className = "sample.HelloWorld";


        // 第二步，生成类
        ByteBuddy byteBuddy = new ByteBuddy();
        DynamicType.Builder<?> builder = byteBuddy.subclass(Object.class)
                .modifiers(Visibility.PUBLIC)
                .name(className);

        builder = builder.defineMethod("test", Consumer.class, Visibility.PUBLIC)
                .intercept(
                        InvokeDynamic.lambda(
                                GoodChild.class.getDeclaredMethod("study", String.class),
                                Consumer.class
                        )
                );


        // 第三步，输出结果
        DynamicType.Unloaded<?> unloadedType = builder.make();
        OutputUtils.save(unloadedType);
    }
}
```
