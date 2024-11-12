---
title: "Advice"
sequence: "102"
---

## 概览

### 如何使用

```text
                                                          ┌─── [p] AsmVisitorWrapper
          ┌─── DynamicType.Builder ───┼─── [m] visit() ───┤
          │                                               └─── [r] DynamicType.Builder<T>
          │
          │                           ┌─── [m] wrap() ───────────────┼─── [r] ClassVisitor (ASM)
          ├─── AsmVisitorWrapper ─────┤
advice ───┤                           │                                                               ┌─── [m] wrap() ───┼─── [r] MethodVisitor (ASM)
          │                           └─── [s] ForDeclaredMethods ───┼─── [n] MethodVisitorWrapper ───┤
          │                                                                                           └─── [s] Advice
          │
          │                           ┌─── [m] to() ───┼─── [r] Advice
          └─── Advice ────────────────┤
                                      └─── [m] on() ───┼─── [r] AsmVisitorWrapper.ForDeclaredMethods
```

- m: method
- p: parameter
- r: return
- s: subclass
- n: nested

```java
public class Advice implements AsmVisitorWrapper.ForDeclaredMethods.MethodVisitorWrapper, Implementation {
}
```

## API

```text
                                                                             ┌─── TypeDescription
                                                                             │
                                                              ┌─── params ───┼─── TypeDescription
                                                              │              │
                                  ┌─── to() ──────────────────┤              └─── ClassFileLocator
                                  │                           │
               ┌─── static ───────┤                           └─── return ───┼─── Advice
               │                  │
               │                  └─── withCustomMapping() ───┼─── return ───┼─── Advice.WithCustomMapping
               │
               │                                                                                       ┌─── params ───┼─── Assigner
               │                                                       ┌─── withAssigner() ────────────┤
               │                                                       │                               └─── return ───┼─── Advice
               │                                                       │
               │                                         ┌─── chain ───┤                               ┌─── params ───┼─── Advice.ExceptionHandler
Advice::api ───┤                                         │             ├─── withExceptionHandler() ────┤
               │                                         │             │                               └─── return ───┼─── Advice
               │                  ┌─── builder ──────────┤             │
               │                  │                      │             └─── withExceptionPrinting() ───┼─── return ───┼─── Advice
               │                  │                      │
               │                  │                      │                          ┌─── params ───┼─── ElementMatcher<? super MethodDescription>
               │                  │                      └─── build ───┼─── on() ───┤
               │                  │                                                 └─── return ───┼─── AsmVisitorWrapper.ForDeclaredMethods
               │                  │
               └─── non-static ───┤                                         ┌─── params ───┼─── InstrumentedType
                                  │                      ┌─── prepare() ────┤
                                  │                      │                  └─── return ───┼─── InstrumentedType
                                  ├─── implementation ───┤
                                  │                      │                  ┌─── params ───┼─── Implementation.Target
                                  │                      └─── appender() ───┤
                                  │                                         └─── return ───┼─── ByteCodeAppender
                                  │
                                  └─── asm ──────────────┼─── wrap() ───┼─── [p] MethodVisitor
```

## Annotation

```text
                            ┌─── @OnMethodEnter
          ┌─── method ──────┤
          │                 └─── @OnMethodExit
          │
          │                 ┌─── meta ───────┼─── @Origin
          │                 │
          │                 │                ┌─── @This
          │                 │                │
Advice ───┤                 │                ├─── @Argument
          │                 ├─── argument ───┤
          │                 │                ├─── @AllArguments
          │                 │                │
          │                 │                └─── @Unused
          │                 │
          │                 ├─── local ──────┼─── @Local
          └─── parameter ───┤
                            │                ┌─── @Return
                            │                │
                            ├─── exit ───────┼─── @Thrown
                            │                │
                            │                └─── @StubValue
                            │
                            ├─── field ──────┼─── @FieldValue
                            │
                            │
                            │                ┌─── @Enter
                            └─── advice ─────┤
                                             └─── @Exit
```

```text
                                 ┌─── meta ─────┼─── @Advice.Origin
                                 │
                                 ├─── field ────┼─── @Advice.FieldValue
          ┌─── Both ─────────────┤
          │                      │              ┌─── instance ───┼─── @Advice.This
          │                      │              │
          │                      │              │                ┌─── @Advice.Argument
          │                      └─── method ───┼─── arg ────────┤
          │                                     │                └─── @Advice.AllArguments
Advice ───┤                                     │
          │                                     └─── local ──────┼─── @Advice.Local
          │
          ├─── @OnMethodEnter
          │
          │                      ┌─── local ───┼─── @Advice.Enter
          │                      │
          └─── @OnMethodExit ────┤                               ┌─── @Advice.Return
                                 │             ┌─── return ──────┤
                                 └─── exit ────┤                 └─── @Advice.StubValue
                                               │
                                               └─── exception ───┼─── @Advice.Thrown
```

## 示例

### AsmVisitorWrapper

原有的 `HelloWorld` 类：

```java
public class HelloWorld {
    public void test() {
        System.out.println("Hello Test");
    }
}
```

预期目标：

```java
public class HelloWorld {
    public void test() {
        System.out.println(">>> >>> >>> >>> >>> >>> >>> >>> >>> Method Enter");
        System.out.println("Hello Test");
        System.out.println("<<< <<< <<< <<< <<< <<< <<< <<< <<< Method Exit");
    }
}
```

编码实现：

```java
import net.bytebuddy.asm.Advice;

public class Expert {
    @Advice.OnMethodEnter
    static void methodAbc() {
        System.out.println(">>> >>> >>> >>> >>> >>> >>> >>> >>> Method Enter");
    }

    @Advice.OnMethodExit
    static void methodXyz() {
        System.out.println("<<< <<< <<< <<< <<< <<< <<< <<< <<< Method Exit");
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
                Advice.to(Expert.class).on(ElementMatchers.named("test"))
        );

        // 3. output
        DynamicType.Unloaded<?> unloadedType = builder.make();
        OutputUtils.save(unloadedType);
    }
}
```

### Implementation

```java
public class HelloWorld extends Parent {
    public void test() {
        System.out.println(">>> >>> >>> >>> >>> >>> >>> >>> >>> Method Enter");
        super.test();
        System.out.println("<<< <<< <<< <<< <<< <<< <<< <<< <<< Method Exit");
    }
}
```

```java
public class Parent {
    public void test() {
        System.out.println("Hello Test");
    }
}
```

```java
import net.bytebuddy.asm.Advice;

public class Expert {
    @Advice.OnMethodEnter
    static void methodAbc() {
        System.out.println(">>> >>> >>> >>> >>> >>> >>> >>> >>> Method Enter");
    }

    @Advice.OnMethodExit
    static void methodXyz() {
        System.out.println("<<< <<< <<< <<< <<< <<< <<< <<< <<< Method Exit");
    }
}
```

```java
import net.bytebuddy.ByteBuddy;
import net.bytebuddy.asm.Advice;
import net.bytebuddy.description.modifier.Visibility;
import net.bytebuddy.dynamic.DynamicType;
import net.bytebuddy.matcher.ElementMatchers;


public class HelloWorldSubClass {
    public static void main(String[] args) {
        // 1. prepare
        String className = "sample.HelloWorld";


        // 2. weave
        ByteBuddy byteBuddy = new ByteBuddy();
        DynamicType.Builder<?> builder = byteBuddy.subclass(Parent.class)
                .modifiers(Visibility.PUBLIC)
                .name(className);

        builder = builder.method(ElementMatchers.named("test"))
                .intercept(Advice.to(Expert.class));

        // 3. output
        DynamicType.Unloaded<?> unloadedType = builder.make();
        OutputUtils.save(unloadedType, true);
    }
}
```

```text
>>> >>> >>> >>> >>> >>> >>> >>> >>> Method Enter
Hello Test
<<< <<< <<< <<< <<< <<< <<< <<< <<< Method Exit
```
