---
title: "特殊场景：使用多个 Advice 的顺序"
sequence: "108"
---

## 多个 Advice

注意：多个 Advice 的顺序，是非常重要的。

### 预期目标

```java
public class HelloWorld {
    public void test() {
        System.out.println("Hello World");
    }
}
```

### 编码实现

#### Expert

```java
import net.bytebuddy.asm.Advice;

public class Expert {
    @Advice.OnMethodEnter
    static void methodAbc() {
        System.out.println("Advice-Method-Enter From Expert");
    }

    @Advice.OnMethodExit
    static void methodXyz() {
        System.out.println("Advice-Method-Exit From Expert");
    }
}
```

#### Citizen

```java
import net.bytebuddy.asm.Advice;

public class Citizen {
    @Advice.OnMethodEnter
    static void methodAbc() {
        System.out.println("Advice-Method-Enter From Citizen");
    }

    @Advice.OnMethodExit
    static void methodXyz() {
        System.out.println("Advice-Method-Exit From Citizen");
    }
}
```

#### Child

```java
import net.bytebuddy.asm.Advice;

public class Child {
    @Advice.OnMethodEnter
    static void methodAbc() {
        System.out.println("Advice-Method-Enter From Child");
    }

    @Advice.OnMethodExit
    static void methodXyz() {
        System.out.println("Advice-Method-Exit From Child");
    }
}
```

### Redefine

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
                Advice.to(Expert.class).on(ElementMatchers.named("test"))
        ).visit(
                Advice.to(Citizen.class).on(ElementMatchers.named("test"))
        ).visit(
                Advice.to(Child.class).on(ElementMatchers.named("test"))
        );


        // 3. output
        DynamicType.Unloaded<?> unloadedType = builder.make();
        OutputUtils.save(unloadedType, true);
    }
}
```

### 验证结果

```java
public class HelloWorldRun {
    public static void main(String[] args) {
        String className = "sample.HelloWorld";
        InvokeUtils.invokeAllMethods(className);
    }
}
```

```text
Advice-Method-Enter From Expert
Advice-Method-Enter From Citizen
Advice-Method-Enter From Child
Hello World
Advice-Method-Exit From Child
Advice-Method-Exit From Citizen
Advice-Method-Exit From Expert
```

## 谁起作用

```java
public class HelloWorld {
    public int test(String name, int age) {
        return age;
    }
}
```

```java
import net.bytebuddy.asm.Advice;

public class Expert {
    @Advice.OnMethodEnter
    static void methodAbc(
            @Advice.Argument(value = 1, readOnly = false) int age
    ) {
        age = 30;
    }
}
```

```java
import net.bytebuddy.asm.Advice;

public class Citizen {
    @Advice.OnMethodEnter
    static void methodAbc(
            @Advice.Argument(value = 1, readOnly = false) int age
    ) {
        age = 20;
    }
}
```

```java
import net.bytebuddy.asm.Advice;

public class Child {
    @Advice.OnMethodEnter
    static void methodAbc(
            @Advice.Argument(value = 1, readOnly = false) int age
    ) {
        age = 10;
    }
}
```

### 第一次修改

为 `Expert` 类添加一个 `methodXyz` 方法：

```java
import net.bytebuddy.asm.Advice;

public class Expert {
    @Advice.OnMethodEnter
    static void methodAbc(
            @Advice.Argument(value = 1, readOnly = false) int age
    ) {
        age = 30;
    }

    @Advice.OnMethodExit
    static void methodXyz(
            @Advice.Argument(value = 1) int age,
            @Advice.Return(readOnly = false) int result
    ) {
        result = age;
    }
}
```

结果：

```text
30
```

### 第二次修改

为三个类分别添加一个 `methodXyz` 方法：

```java
import net.bytebuddy.asm.Advice;

public class Citizen {
    @Advice.OnMethodEnter
    static void methodAbc(
            @Advice.Argument(value = 1, readOnly = false) int age
    ) {
        age = 20;
    }

    @Advice.OnMethodExit
    static void methodXyz(
            @Advice.Argument(value = 1) int age,
            @Advice.Return(readOnly = false) int result
    ) {
        result = age;
    }
}
```

```java
import net.bytebuddy.asm.Advice;

public class Child {
    @Advice.OnMethodEnter
    static void methodAbc(
            @Advice.Argument(value = 1, readOnly = false) int age
    ) {
        age = 10;
    }

    @Advice.OnMethodExit
    static void methodXyz(
            @Advice.Argument(value = 1) int age,
            @Advice.Return(readOnly = false) int result
    ) {
        result = age;
    }
}
```

