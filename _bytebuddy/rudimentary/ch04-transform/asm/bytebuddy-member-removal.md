---
title: "Member Removal"
sequence: "125"
---

`net.bytebuddy.asm.MemberRemoval`

```java
public class HelloWorld {
    private final String name;
    private final int age;
    private Date birthDay;

    public HelloWorld() {
        this.name = "Tom";
        this.age = 10;
    }

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
}
```

## 构造方法

### 默认构造方法

删除默认构造方法：

```java
import net.bytebuddy.ByteBuddy;
import net.bytebuddy.asm.AsmVisitorWrapper;
import net.bytebuddy.asm.MemberRemoval;
import net.bytebuddy.dynamic.DynamicType;
import net.bytebuddy.matcher.ElementMatchers;

public class HelloWorldTransform {
    public static void main(String[] args) {
        // 1. prepare
        String className = "sample.HelloWorld";
        Class<?> clazz = ClassUtils.loadClass(className);


        // 2. weave
        ByteBuddy byteBuddy = new ByteBuddy();
        DynamicType.Builder<?> builder = byteBuddy.redefine(clazz);

        AsmVisitorWrapper asmVisitorWrapper = new MemberRemoval().stripConstructors(
                ElementMatchers.isDefaultConstructor()
        );
        builder = builder.visit(asmVisitorWrapper);


        // 3. output
        DynamicType.Unloaded<?> unloadedType = builder.make();
        OutputUtils.save(unloadedType);
    }
}
```

### 带参构造方法：

```java
import net.bytebuddy.ByteBuddy;
import net.bytebuddy.asm.AsmVisitorWrapper;
import net.bytebuddy.asm.MemberRemoval;
import net.bytebuddy.dynamic.DynamicType;
import net.bytebuddy.matcher.ElementMatchers;

public class HelloWorldTransform {
    public static void main(String[] args) {
        // 1. prepare
        String className = "sample.HelloWorld";
        Class<?> clazz = ClassUtils.loadClass(className);


        // 2. weave
        ByteBuddy byteBuddy = new ByteBuddy();
        DynamicType.Builder<?> builder = byteBuddy.redefine(clazz);

        AsmVisitorWrapper asmVisitorWrapper = new MemberRemoval().stripConstructors(
                ElementMatchers.isConstructor().and(
                        ElementMatchers.takesArgument(0, String.class)
                ).and(
                        ElementMatchers.takesArgument(1, int.class)
                )
        );
        builder = builder.visit(asmVisitorWrapper);


        // 3. output
        DynamicType.Unloaded<?> unloadedType = builder.make();
        OutputUtils.save(unloadedType);
    }
}
```

## 删除方法

```java
import net.bytebuddy.ByteBuddy;
import net.bytebuddy.asm.AsmVisitorWrapper;
import net.bytebuddy.asm.MemberRemoval;
import net.bytebuddy.dynamic.DynamicType;
import net.bytebuddy.matcher.ElementMatchers;

public class HelloWorldTransform {
    public static void main(String[] args) {
        // 1. prepare
        String className = "sample.HelloWorld";
        Class<?> clazz = ClassUtils.loadClass(className);


        // 2. weave
        ByteBuddy byteBuddy = new ByteBuddy();
        DynamicType.Builder<?> builder = byteBuddy.redefine(clazz);

        AsmVisitorWrapper asmVisitorWrapper = new MemberRemoval().stripMethods(
                ElementMatchers.named("getName")
        );
        builder = builder.visit(asmVisitorWrapper);


        // 3. output
        DynamicType.Unloaded<?> unloadedType = builder.make();
        OutputUtils.save(unloadedType);
    }
}
```

## 移除字段

```java
import net.bytebuddy.ByteBuddy;
import net.bytebuddy.asm.AsmVisitorWrapper;
import net.bytebuddy.asm.MemberRemoval;
import net.bytebuddy.dynamic.DynamicType;
import net.bytebuddy.matcher.ElementMatchers;

public class HelloWorldTransform {
    public static void main(String[] args) {
        // 1. prepare
        String className = "sample.HelloWorld";
        Class<?> clazz = ClassUtils.loadClass(className);


        // 2. weave
        ByteBuddy byteBuddy = new ByteBuddy();
        DynamicType.Builder<?> builder = byteBuddy.redefine(clazz);

        AsmVisitorWrapper asmVisitorWrapper = new MemberRemoval().stripFields(
                ElementMatchers.named("birthDay")
        );
        builder = builder.visit(asmVisitorWrapper);


        // 3. output
        DynamicType.Unloaded<?> unloadedType = builder.make();
        OutputUtils.save(unloadedType);
    }
}
```

