---
title: "@Advice.FieldSetterHandle"
sequence: "103"
---

## 示例

### 预期目标

```java
public class HelloWorld {
    private String name;
    private final int age;

    public HelloWorld(String name, int age) {
        this.name = name;
        this.age = age;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getAge() {
        return age;
    }

    public void test() {
        String msg = String.format("HelloWorld - %s - %d", name, age);
        System.out.println(msg);
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
            @Advice.FieldSetterHandle("name") MethodHandle nameHandle
    ) throws Throwable {
        nameHandle.invoke("Jerry");
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
HelloWorld - Jerry - 10
```
