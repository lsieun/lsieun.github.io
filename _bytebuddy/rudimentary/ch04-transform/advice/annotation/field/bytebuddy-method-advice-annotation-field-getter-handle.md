---
title: "@Advice.FieldGetterHandle"
sequence: "102"
---

## 示例

### 预期目标

```java
import java.nio.charset.StandardCharsets;
import java.util.Base64;

public class HelloWorld {
    private final String name;
    private final int age;

    public HelloWorld(String name, int age) {
        this.name = name;
        this.age = age;
    }

    public String getName() {
        return name;
    }

    public int getAge() {
        return age;
    }

    public void test() {
        String msg = String.format("HelloWorld - %s - %d", name, age);
        byte[] bytes = msg.getBytes(StandardCharsets.UTF_8);
        String base64Str = Base64.getEncoder().encodeToString(bytes);
        System.out.println(base64Str);
    }
}
```

### 编码实现

#### Expert

```java
import net.bytebuddy.asm.Advice;

import java.lang.invoke.MethodHandle;

public class Expert {
    @Advice.OnMethodEnter
    static void methodAbc(
            @Advice.FieldGetterHandle("name") MethodHandle nameHandle,
            @Advice.FieldGetterHandle("age") MethodHandle ageHandle
    ) throws Throwable {
        String name = (String) nameHandle.invoke();
        int age = (int) ageHandle.invoke();
        String info = String.format("name = '%s', age = %d", name, age);
        System.out.println(info);
    }
}
```

#### Redefine

```java
import net.bytebuddy.ByteBuddy;
import net.bytebuddy.asm.Advice;
import net.bytebuddy.dynamic.DynamicType;
import net.bytebuddy.dynamic.scaffold.TypeValidation;
import net.bytebuddy.matcher.ElementMatchers;

public class HelloWorldRedefine {
    public static void main(String[] args) {
        // 1. prepare
        String className = "sample.HelloWorld";
        Class<?> clazz = ClassUtils.loadClass(className);


        // 2. weave
        ByteBuddy byteBuddy = new ByteBuddy().with(TypeValidation.DISABLED);
        DynamicType.Builder<?> builder = byteBuddy.redefine(clazz);

        builder = builder.visit(
                Advice.to(Expert.class).on(ElementMatchers.named("test"))
        );


        // 3. output
        DynamicType.Unloaded<?> unloadedType = builder.make();
        OutputUtils.save(unloadedType, true);
    }
}
```

### 测试

```java
public class HelloWorldRun {
    public static void main(String[] args) {
        HelloWorld instance = new HelloWorld("Tom", 10);
        instance.test();
    }
}
```

```text
name = 'Tom', age = 10
SGVsbG9Xb3JsZCAtIFRvbSAtIDEw
```
