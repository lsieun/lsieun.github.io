---
title: "@Advice.Origin"
sequence: "101"
---

## 介绍

### 作用

`@Advice.Origin` 作用：映射『ClassFile』和『`Class<?>`』的信息到方法参数中。

![](/assets/images/bytebuddy/advice/bytebuddy-method-advice-annotation-origin-illustration.png)


### 如何使用

The `@Advice.Origin` indicates that the annotated parameter should be mapped to 

- **a string representation of the instrumented method**,
- a constant representing the `Class` declaring the adviced method or 
- a `Method`, `Constructor` or `java.lang.reflect.Executable` representing this method.
- the instrumented method's `java.lang.invoke.MethodType`,
  `java.lang.invoke.MethodHandle` or `java.lang.invoke.MethodHandles$Lookup`.

```text
                                     ┌─── default: `toString()`
                                     │
                                     ├─── `#t`: method's declaring **type**
                                     │
                                     ├─── `#m`: the name of the **method**
                                     │
                  ┌─── String ───────┼─── `#d`: method's **descriptor**
                  │                  │
                  │                  ├─── `#s`: method's **signature**
                  │                  │
                  │                  ├─── `#r`: method's **return** type
                  │                  │
                  │                  └─── `#p"`: **property**'s name (Getter/Setter)
                  │
                  │                  ┌─── Class<?>
@Advice.Origin ───┤                  │
                  │                  ├─── Executable
                  ├─── reflection ───┤
                  │                  ├─── Constructor<?>
                  │                  │
                  │                  └─── Method
                  │
                  │                  ┌─── MethodType
                  │                  │
                  └─── handle ───────┼─── MethodHandle
                                     │
                                     └─── MethodHandles.Lookup
```

### 注意事项

- 适用性：`@Advice.Origin("#p")`，只适用于 Getter/Setter，不适合于『构造方法』（Constructor）和『普通方法』。
- 性能考虑：使用 `String` 类型要比使用 `Method` 类型的效率高
    - A constant representing a `Method` or `Constructor` is not cached but is recreated for every read.

## 示例

### String

- `@Advice.Origin`: By default, the `toString()` representation of the method is assigned.
- `@Advice.Origin("#t")`: method's declaring **type**
- `@Advice.Origin("#m")`: the name of the **method** (for constructors and for static initializers)
- `@Advice.Origin("#d")`: method's **descriptor**
- `@Advice.Origin("#s")`: method's **signature**
- `@Advice.Origin("#r")`: method's **return** type
- `@Advice.Origin("#p")`: **property**'s name
    - 注意：构造方法（Constructor）和普通方法，不支持 `#p` 大数，只有 Getter/Setter 支持

#### 普通方法

```java
import java.nio.charset.StandardCharsets;
import java.util.Base64;

public class HelloWorld {
    public String test(String name, int age, Object obj) {
        String msg = String.format("HelloWorld - %s - %d - %s", name, age, obj);
        byte[] bytes = msg.getBytes(StandardCharsets.UTF_8);
        return Base64.getEncoder().encodeToString(bytes);
    }
}
```

```java
import net.bytebuddy.asm.Advice;

public class Expert {
    @Advice.OnMethodEnter
    public static void methodAbc(@Advice.Origin String origin,
                                 // @Advice.Origin("#p") String propertyName,
                                 @Advice.Origin("#t") String methodDeclaringType,
                                 @Advice.Origin("#m") String methodName,
                                 @Advice.Origin("#d") String methodDescriptor,
                                 @Advice.Origin("#s") String methodSignature,
                                 @Advice.Origin("#r") String methodReturnType) {
        // (1) method enter
        String methodEnterMsg = String.format(">>> >>> >>> Method Enter: %s.%s()",
                methodDeclaringType, methodName);
        System.out.println(methodEnterMsg);

        // (2) origin info
        String[][] matrix = {
                {"@Advice.Origin", origin},
                // {"@Advice.Origin(\"#p\")", propertyName},
                {"@Advice.Origin(\"#t\")", methodDeclaringType},
                {"@Advice.Origin(\"#m\")", methodName},
                {"@Advice.Origin(\"#d\")", methodDescriptor},
                {"@Advice.Origin(\"#s\")", methodSignature},
                {"@Advice.Origin(\"#r\")", methodReturnType},
        };

        TableUtils.printTable(matrix);
    }

    @Advice.OnMethodExit
    public static void methodXyz(@Advice.Origin("#t") String methodDeclaringType,
                                 @Advice.Origin("#m") String methodName) {
        // (1) method exit
        String methodExitMsg = String.format("<<< <<< <<< Method  Exit: %s.%s()",
                methodDeclaringType, methodName);
        System.out.println(methodExitMsg);
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
        DynamicType.Builder<?> builder = byteBuddy.redefine(clazz)
                .name(className);

        builder = builder.visit(
                Advice.to(Expert.class).on(ElementMatchers.isMethod())
        );


        // 3. output
        DynamicType.Unloaded<?> unloadedType = builder.make();
        OutputUtils.save(unloadedType, true);
    }
}
```

```java
import java.time.LocalDate;

public class HelloWorldRun {
    public static void main(String[] args) {
        HelloWorld instance = new HelloWorld();
        String msg = instance.test("Tom", 10, LocalDate.now());
        System.out.println(msg);
    }
}
```

```text
>>> >>> >>> Method Enter: sample.HelloWorld.test()
┌──────────────────────┬───────────────────────────────────────────────────────────────────────────────────────┐
│    @Advice.Origin    │ public java.lang.String sample.HelloWorld.test(java.lang.String,int,java.lang.Object) │
├──────────────────────┼───────────────────────────────────────────────────────────────────────────────────────┤
│ @Advice.Origin("#t") │                                   sample.HelloWorld                                   │
├──────────────────────┼───────────────────────────────────────────────────────────────────────────────────────┤
│ @Advice.Origin("#m") │                                         test                                          │
├──────────────────────┼───────────────────────────────────────────────────────────────────────────────────────┤
│ @Advice.Origin("#d") │               (Ljava/lang/String;ILjava/lang/Object;)Ljava/lang/String;               │
├──────────────────────┼───────────────────────────────────────────────────────────────────────────────────────┤
│ @Advice.Origin("#s") │                        (java.lang.String,int,java.lang.Object)                        │
├──────────────────────┼───────────────────────────────────────────────────────────────────────────────────────┤
│ @Advice.Origin("#r") │                                   java.lang.String                                    │
└──────────────────────┴───────────────────────────────────────────────────────────────────────────────────────┘

<<< <<< <<< Method  Exit: sample.HelloWorld.test()
SGVsbG9Xb3JsZCAtIFRvbSAtIDEwIC0gMjAyNC0xMC0wMg==
```

#### 属性

移除 `@Advice.Origin("#p") String propertyName` 的注释

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

```text
builder = builder.visit(
        Advice.to(Expert.class)
                .on(ElementMatchers.nameContainsIgnoreCase("name"))
);
```

```java
public class HelloWorldRun {
    public static void main(String[] args) {
        HelloWorld instance = new HelloWorld();
        instance.setName("Tom");
        String name = instance.getName();
        System.out.println("name = " + name);
    }
}
```

```text
>>> >>> >>> Method Enter: sample.HelloWorld.setName()
┌──────────────────────┬─────────────────────────────────────────────────────────┐
│    @Advice.Origin    │ public void sample.HelloWorld.setName(java.lang.String) │
├──────────────────────┼─────────────────────────────────────────────────────────┤
│ @Advice.Origin("#p") │                          name                           │
├──────────────────────┼─────────────────────────────────────────────────────────┤
│ @Advice.Origin("#t") │                    sample.HelloWorld                    │
├──────────────────────┼─────────────────────────────────────────────────────────┤
│ @Advice.Origin("#m") │                         setName                         │
├──────────────────────┼─────────────────────────────────────────────────────────┤
│ @Advice.Origin("#d") │                  (Ljava/lang/String;)V                  │
├──────────────────────┼─────────────────────────────────────────────────────────┤
│ @Advice.Origin("#s") │                   (java.lang.String)                    │
├──────────────────────┼─────────────────────────────────────────────────────────┤
│ @Advice.Origin("#r") │                          void                           │
└──────────────────────┴─────────────────────────────────────────────────────────┘

<<< <<< <<< Method  Exit: sample.HelloWorld.setName()

>>> >>> >>> Method Enter: sample.HelloWorld.getName()
┌──────────────────────┬─────────────────────────────────────────────────────┐
│    @Advice.Origin    │ public java.lang.String sample.HelloWorld.getName() │
├──────────────────────┼─────────────────────────────────────────────────────┤
│ @Advice.Origin("#p") │                        name                         │
├──────────────────────┼─────────────────────────────────────────────────────┤
│ @Advice.Origin("#t") │                  sample.HelloWorld                  │
├──────────────────────┼─────────────────────────────────────────────────────┤
│ @Advice.Origin("#m") │                       getName                       │
├──────────────────────┼─────────────────────────────────────────────────────┤
│ @Advice.Origin("#d") │                ()Ljava/lang/String;                 │
├──────────────────────┼─────────────────────────────────────────────────────┤
│ @Advice.Origin("#s") │                         ()                          │
├──────────────────────┼─────────────────────────────────────────────────────┤
│ @Advice.Origin("#r") │                  java.lang.String                   │
└──────────────────────┴─────────────────────────────────────────────────────┘

<<< <<< <<< Method  Exit: sample.HelloWorld.getName()
name = Tom
```

### Reflection

```java
import java.nio.charset.StandardCharsets;
import java.util.Base64;

public class HelloWorld {
    public String test(String name, int age, Object obj) {
        String msg = String.format("HelloWorld - %s - %d - %s", name, age, obj);
        byte[] bytes = msg.getBytes(StandardCharsets.UTF_8);
        return Base64.getEncoder().encodeToString(bytes);
    }
}
```

```java
import net.bytebuddy.asm.Advice;

import java.lang.reflect.Constructor;
import java.lang.reflect.Executable;
import java.lang.reflect.Method;
import java.util.Formatter;

public class Expert {
    @Advice.OnMethodEnter
    public static void methodAbc(@Advice.Origin("#t") String methodDeclaringType,
                                 @Advice.Origin("#m") String methodName,
                                 @Advice.Origin Class<?> clazz,
                                 // @Advice.Origin Constructor<?> constructor,
                                 // @Advice.Origin Method method,
                                 @Advice.Origin Executable executable
    ) {
        // (1) method enter
        String methodEnterMsg = String.format(">>> >>> >>> Method Enter: %s.%s()",
                methodDeclaringType, methodName);
        System.out.println(methodEnterMsg);

        // (2) origin info
        Formatter fm = new Formatter();
        fm.format("@Advice.Origin Class         : %s%n", clazz);
        // fm.format("@Advice.Origin Constructor<?>: %s%n", constructor);
        // fm.format("@Advice.Origin Method        : %s%n", method);
        fm.format("@Advice.Origin Executable    : %s%n", executable);
        System.out.println(fm);
    }

    @Advice.OnMethodExit
    public static void methodXyz(@Advice.Origin("#t") String methodDeclaringType,
                                 @Advice.Origin("#m") String methodName) {
        // (1) method exit
        String methodExitMsg = String.format("<<< <<< <<< Method  Exit: %s.%s()",
                methodDeclaringType, methodName);
        System.out.println(methodExitMsg);
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
        DynamicType.Builder<?> builder = byteBuddy.redefine(clazz)
                .name(className);

        builder = builder.visit(
                Advice.to(Expert.class).on(
                        ElementMatchers.isMethod().or(
                                ElementMatchers.isConstructor()
                        )
                )
        );


        // 3. output
        DynamicType.Unloaded<?> unloadedType = builder.make();
        OutputUtils.save(unloadedType, true);
    }
}
```

```java
import java.time.LocalDate;

public class HelloWorldRun {
    public static void main(String[] args) {
        HelloWorld instance = new HelloWorld();
        String msg = instance.test("Tom", 10, LocalDate.now());
        System.out.println(msg);
    }
}
```

```text
>>> >>> >>> Method Enter: sample.HelloWorld.<init>()
@Advice.Origin Class         : class sample.HelloWorld
@Advice.Origin Executable    : public sample.HelloWorld()

<<< <<< <<< Method  Exit: sample.HelloWorld.<init>()
>>> >>> >>> Method Enter: sample.HelloWorld.test()
@Advice.Origin Class         : class sample.HelloWorld
@Advice.Origin Executable    : public java.lang.String sample.HelloWorld.test(java.lang.String,int,java.lang.Object)

<<< <<< <<< Method  Exit: sample.HelloWorld.test()
SGVsbG9Xb3JsZCAtIFRvbSAtIDEwIC0gMjAyNC0xMC0wMg==
```

Note: **A constant representing a `Method` or `Constructor` is not cached but is recreated for every read.**

```java
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.Formatter;

public class HelloWorld {
    public HelloWorld() {
        String msg = String.format(">>> >>> >>> Method Enter: %s.%s()", "sample.HelloWorld", "<init>");
        System.out.println(msg);
        Formatter fm = new Formatter();
        fm.format("@Advice.Origin Class         : %s%n", HelloWorld.class);
        fm.format("@Advice.Origin Executable    : %s%n", HelloWorld.class.getConstructor());
        System.out.println(fm);
        super();
        msg = String.format("<<< <<< <<< Method  Exit: %s.%s()", "sample.HelloWorld", "<init>");
        System.out.println(msg);
    }

    public String test(String name, int age, Object obj) {
        // advice.code.enter
        String methodEnterMsg = String.format(">>> >>> >>> Method Enter: %s.%s()", "sample.HelloWorld", "test");
        System.out.println(methodEnterMsg);

        Formatter fm = new Formatter();
        fm.format("@Advice.Origin Class         : %s%n", HelloWorld.class);
        fm.format("@Advice.Origin Executable    : %s%n", HelloWorld.class.getMethod("test", String.class, Integer.TYPE, Object.class));
        System.out.println(fm);

        // functional code
        String string = String.format("HelloWorld - %s - %d - %s", name, age, obj);
        byte[] bytes = string.getBytes(StandardCharsets.UTF_8);
        String base64Str = Base64.getEncoder().encodeToString(bytes);

        // advice.code.exit
        String methodExitMsg = String.format("<<< <<< <<< Method  Exit: %s.%s()", "sample.HelloWorld", "test");
        System.out.println(methodExitMsg);
        return base64Str;
    }
}
```

### Handle

```java
import java.nio.charset.StandardCharsets;
import java.util.Base64;

public class HelloWorld {
    public String test(String name, int age, Object obj) {
        String msg = String.format("HelloWorld - %s - %d - %s", name, age, obj);
        byte[] bytes = msg.getBytes(StandardCharsets.UTF_8);
        return Base64.getEncoder().encodeToString(bytes);
    }
}
```

```java
import net.bytebuddy.asm.Advice;

import java.lang.invoke.MethodHandle;
import java.lang.invoke.MethodHandles;
import java.lang.invoke.MethodType;
import java.util.Formatter;

public class Expert {
    @Advice.OnMethodEnter
    public static void methodAbc(@Advice.Origin("#t") String methodDeclaringType,
                                 @Advice.Origin("#m") String methodName,
                                 @Advice.Origin MethodHandles.Lookup lookup,
                                 @Advice.Origin MethodType methodType,
                                 @Advice.Origin MethodHandle methodHandle
    ) {
        // (1) method enter
        String methodEnterMsg = String.format(">>> >>> >>> Method Enter: %s.%s()",
                methodDeclaringType, methodName);
        System.out.println(methodEnterMsg);

        // (2) origin info
        Formatter fm = new Formatter();
        fm.format("@Advice.Origin MethodHandles.Lookup: %s%n", lookup);
        fm.format("@Advice.Origin MethodType          : %s%n", methodType);
        fm.format("@Advice.Origin MethodHandle        : %s%n", methodHandle);
        System.out.println(fm);
    }

    @Advice.OnMethodExit
    public static void methodXyz(@Advice.Origin("#t") String methodDeclaringType,
                                 @Advice.Origin("#m") String methodName) {
        // (1) method exit
        String methodExitMsg = String.format("<<< <<< <<< Method  Exit: %s.%s()",
                methodDeclaringType, methodName);
        System.out.println(methodExitMsg);
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
        DynamicType.Builder<?> builder = byteBuddy.redefine(clazz)
                .name(className);

        builder = builder.visit(
                Advice.to(Expert.class).on(ElementMatchers.isMethod())
        );


        // 3. output
        DynamicType.Unloaded<?> unloadedType = builder.make();
        OutputUtils.save(unloadedType, true);
    }
}
```

```java
import java.time.LocalDate;

public class HelloWorldRun {
    public static void main(String[] args) {
        HelloWorld instance = new HelloWorld();
        String msg = instance.test("Tom", 10, LocalDate.now());
        System.out.println(msg);
    }
}
```

```text
>>> >>> >>> Method Enter: sample.HelloWorld.test()
@Advice.Origin MethodHandles.Lookup: sample.HelloWorld
@Advice.Origin MethodType          : (HelloWorld,String,int,Object)String
@Advice.Origin MethodHandle        : MethodHandle(HelloWorld,String,int,Object)String

<<< <<< <<< Method  Exit: sample.HelloWorld.test()
SGVsbG9Xb3JsZCAtIFRvbSAtIDEwIC0gMjAyNC0xMC0wMg==
```

```text
> javap -v -p HelloWorld.class

  public java.lang.String test(java.lang.String, int, java.lang.Object);
    descriptor: (Ljava/lang/String;ILjava/lang/Object;)Ljava/lang/String;
    flags: ACC_PUBLIC
    Code:
      stack=6, locals=11, args_size=4
        48: invokestatic  Method java/lang/invoke/MethodHandles.lookup:()Ljava/lang/invoke/MethodHandles$Lookup;
        66: ldc           MethodType (Lsample/HelloWorld;Ljava/lang/String;ILjava/lang/Object;)Ljava/lang/String;
        83: ldc           MethodHandle invokevirtual sample/HelloWorld.test:(Ljava/lang/String;ILjava/lang/Object;)Ljava/lang/String;
```
