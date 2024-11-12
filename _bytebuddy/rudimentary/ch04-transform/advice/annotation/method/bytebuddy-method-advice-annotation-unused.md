---
title: "@Advice.Unused"
sequence: "110"
---

## @Unused

`@Unused` annotation indicates that the parameter is used for internal usage only for
`methodStart` method of `LogInterceptor.java`.
The parameter does not have mapping capability to functional code.
It is just a marker annotation indicates that
the parameter does not map to any of the parameter of functional method.

`@Advice.Unused` 作用：提供一个默认值（default value）
(`0` for numeric values, `false` for boolean types and `null` for reference types).

```text
                                        ┌─── boolean type ─────┼─── false
                                        │
@Advice.Unused ───┼─── default value ───┼─── number values ────┼─── 0
                                        │
                                        └─── reference type ───┼─── null
```

Any assignments to this variable are without any effect.

## 示例

```java
public class HelloWorld {
    public void test() {
        System.out.println("Hello World");
    }
}
```

```java
import net.bytebuddy.asm.Advice;

public class Expert {
    @Advice.OnMethodEnter
    static void methodAbc(
            @Advice.Unused boolean unusedBooleanValue,
            @Advice.Unused int unusedIntValue,
            @Advice.Unused Object unusedRefValue
    ) {
        // 修改是无效的
        unusedBooleanValue = true;

        System.out.println("unusedBooleanValue = " + unusedBooleanValue);
        System.out.println("unusedIntValue = " + unusedIntValue);
        System.out.println("unusedRefValue = " + unusedRefValue);
    }
}
```

```java
import net.bytebuddy.ByteBuddy;
import net.bytebuddy.asm.Advice;
import net.bytebuddy.dynamic.DynamicType;
import net.bytebuddy.matcher.ElementMatchers;

public class HelloWorldRedefine {
    public static void main(String[] args) {
        // 1. prepare
        String className = "sample.HelloWorld";
        Class<?> clazz = ClassUtils.loadClass(className);


        // 2. weave
        ByteBuddy byteBuddy = new ByteBuddy();
        DynamicType.Builder<?> builder = byteBuddy.redefine(clazz);

        builder = builder.visit(
                Advice.to(Expert.class)
                        .on(ElementMatchers.named("test"))
        );


        // 3. output
        DynamicType.Unloaded<?> unloadedType = builder.make();
        OutputUtils.save(unloadedType, true);
    }
}
```

```java
public class HelloWorldRun {
    public static void main(String[] args) {
        HelloWorld instance = new HelloWorld();
        instance.test();
    }
}
```

运行结果：

```text
unusedBooleanValue = false
unusedIntValue = 0
unusedRefValue = null
Hello World
```

