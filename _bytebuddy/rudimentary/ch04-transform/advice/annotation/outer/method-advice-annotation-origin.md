---
title: "@Advice.Origin"
sequence: "101"
---

## Advice Mapping Parameter

Advice mapping parameter must use advice annotation.

Indicates that the annotated parameter should be mapped to **a string representation of the instrumented method**,
a constant representing the `Class` declaring the adviced method or a `Method`, `Constructor`
or `java.lang.reflect.Executable` representing this method.
It can also load the instrumented method's `java.lang.invoke.MethodType`,
`java.lang.invoke.MethodHandle` or `java.lang.invoke.MethodHandles$Lookup`.

Note: A constant representing a `Method` or `Constructor` is not cached but is recreated for every read.

Important: Don't confuse this annotation with `net.bytebuddy.implementation.bind.annotation.Origin`
or `MemberSubstitution.Origin`.
This annotation should be used only in combination with Advice.

## String

- `@Advice.Origin`: By default, the `toString()` representation of the method is assigned.
- `@Advice.Origin("#t")`: method's declaring **type**
- `@Advice.Origin("#m")`: the name of the **method** (for constructors and for static initializers)
- `@Advice.Origin("#d")`: method's **descriptor**
- `@Advice.Origin("#s")`: method's **signature**
- `@Advice.Origin("#r")`: method's **return** type
- `@Advice.Origin("#p")`: **property**'s name
    - 注意：构造方法（Constructor）和普通方法，不支持 `#p` 大数，只有 Getter/Setter 支持

```java
public class HelloWorld {
    private String name;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
```

```java
import net.bytebuddy.asm.Advice;

public class Expert {
  @Advice.OnMethodEnter
  public static void giveMeSomeAdvice(
          @Advice.Origin String origin,
          @Advice.Origin("#p") String propertyName,      // 注意：只支持 Getter/Setter，不支持构造方法和普通方法
          @Advice.Origin("#t") String methodDeclaringType,
          @Advice.Origin("#m") String methodName,
          @Advice.Origin("#d") String methodDescriptor,
          @Advice.Origin("#s") String methodSignature,
          @Advice.Origin("#r") String methodReturnType
  ) {
    System.out.println("@Advice.Origin: " + origin);
    System.out.println("@Advice.Origin(\"#p\"): " + propertyName);
    System.out.println("@Advice.Origin(\"#t\"): " + methodDeclaringType);
    System.out.println("@Advice.Origin(\"#m\"): " + methodName);
    System.out.println("@Advice.Origin(\"#d\"): " + methodDescriptor);
    System.out.println("@Advice.Origin(\"#s\"): " + methodSignature);
    System.out.println("@Advice.Origin(\"#r\"): " + methodReturnType);
  }
}
```

```java
import net.bytebuddy.ByteBuddy;
import net.bytebuddy.asm.Advice;
import net.bytebuddy.dynamic.DynamicType;
import net.bytebuddy.matcher.ElementMatchers;

public class HelloWorldRedefine {
    public static void main(String[] args) throws Exception {
        // 第一步，准备参数
        String className = "sample.HelloWorld";
        Class<?> clazz = Class.forName(className);


        // 第二步，生成类
        ByteBuddy byteBuddy = new ByteBuddy();
        DynamicType.Builder<?> builder = byteBuddy.redefine(clazz);

        builder = builder.visit(
                Advice.to(Expert.class)
                        .on(ElementMatchers.nameContainsIgnoreCase("name"))
        );


        // 第三步，输出结果
        DynamicType.Unloaded<?> unloadedType = builder.make();
        OutputUtils.save(unloadedType, true);
    }
}
```

```java
public class HelloWorldRun {
    public static void main(String[] args) throws Exception {
        String className = "sample.HelloWorld";
        InvokeUtils.invokeAllMethods(className);
    }
}
```

```text
[Method] public String getName() --> []
@Advice.Origin: public java.lang.String sample.HelloWorld.getName()
@Advice.Origin("#p"): name
@Advice.Origin("#t"): sample.HelloWorld
@Advice.Origin("#m"): getName
@Advice.Origin("#d"): ()Ljava/lang/String;
@Advice.Origin("#s"): ()
@Advice.Origin("#r"): java.lang.String
[Result] null

[Method] public void setName(String) --> [vxvYVX6A]
@Advice.Origin: public void sample.HelloWorld.setName(java.lang.String)
@Advice.Origin("#p"): name
@Advice.Origin("#t"): sample.HelloWorld
@Advice.Origin("#m"): setName
@Advice.Origin("#d"): (Ljava/lang/String;)V
@Advice.Origin("#s"): (java.lang.String)
@Advice.Origin("#r"): void
[Result] null
```

## Other Type

```java
import java.util.Date;

public class HelloWorld {
    public String test(String name, int age, Date date) {
        return String.format("Name: %s, Age: %s, Date: %s", name, age, date);
    }
}
```

```java
import java.lang.invoke.MethodHandle;
import java.lang.invoke.MethodHandles;
import java.lang.invoke.MethodType;
import java.lang.reflect.Executable;
import java.util.Formatter;

public class Expert {
    @Advice.OnMethodEnter
    public static void giveMeSomeAdvice(
            @Advice.Origin Class<?> clazz,
            @Advice.Origin Executable executable,
            @Advice.Origin MethodHandle methodHandle,
            @Advice.Origin MethodType methodType,
            @Advice.Origin MethodHandles.Lookup lookup
    ) {
        StringBuilder sb = new StringBuilder();
        Formatter fm = new Formatter(sb);
        fm.format("@Advice.Origin Class               : %s%n", clazz);
        fm.format("@Advice.Origin Executable          : %s%n", executable);
        fm.format("@Advice.Origin MethodHandle        : %s%n", methodHandle);
        fm.format("@Advice.Origin MethodType          : %s%n", methodType);
        fm.format("@Advice.Origin MethodHandles.Lookup: %s%n", lookup);
        System.out.println(sb);
    }
}
```

```java
import net.bytebuddy.ByteBuddy;
import net.bytebuddy.asm.Advice;
import net.bytebuddy.dynamic.DynamicType;
import net.bytebuddy.matcher.ElementMatchers;

public class HelloWorldRedefine {
    public static void main(String[] args) throws Exception {
        // 第一步，准备参数
        String className = "sample.HelloWorld";
        Class<?> clazz = Class.forName(className);


        // 第二步，生成类
        ByteBuddy byteBuddy = new ByteBuddy();
        DynamicType.Builder<?> builder = byteBuddy.redefine(clazz);

        builder = builder.visit(
                Advice.to(Expert.class)
                        .on(ElementMatchers.named("test"))
        );


        // 第三步，输出结果
        DynamicType.Unloaded<?> unloadedType = builder.make();
        OutputUtils.save(unloadedType, true);
    }
}
```

```java
public class HelloWorldRun {
    public static void main(String[] args) throws Exception {
        String className = "sample.HelloWorld";
        InvokeUtils.invokeAllMethods(className);
    }
}
```
