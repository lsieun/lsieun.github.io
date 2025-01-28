---
title: "特殊场景：构造方法"
sequence: "107"
---

## 预期目标

预期目标：为『构造方法』添加 advice code

修改之前：

```java
public class HelloWorld {
    private final String name;
    private final int age;

    public HelloWorld(String name, int age) {
        super();

        System.out.println("AAA");
        this.name = name;
        this.age = age;
        System.out.println("BBB");
    }

    public void test() {
        String msg = String.format("HelloWorld - %s - %d", name, age);
        System.out.println(msg);
    }
}
```

修改之后：

```java
public class HelloWorld {
    private final String name;
    private final int age;

    public HelloWorld(String name, int age) {
        super();                                   // <-- super()
        
        System.out.println(">>> Method Enter");    // <-- advice code
        
        System.out.println("AAA");
        this.name = name;
        this.age = age;
        System.out.println("BBB");
        
        System.out.println("<<< Method Exit");     // <-- advice code
    }

    public void test() {
        String msg = String.format("HelloWorld - %s - %d", this.name, this.age);
        System.out.println(msg);
    }
}
```

## 编码实现

### Expert

```java
import net.bytebuddy.asm.Advice;

public class Expert {
    @Advice.OnMethodEnter
    static void methodAbc() {
        System.out.println(">>> Method Enter");
    }

    @Advice.OnMethodExit
    static void methodXyz() {
        System.out.println("<<< Method Exit");
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
                Advice.to(Expert.class).on(ElementMatchers.isConstructor())
        );


        // 3. output
        DynamicType.Unloaded<?> unloadedType = builder.make();
        OutputUtils.save(unloadedType, true);
    }
}
```

## 测试

```java
public class HelloWorldRun {
    public static void main(String[] args) {
        HelloWorld instance = new HelloWorld("Tom", 10);
        instance.test();
    }
}
```

## 存在问题

生成的代码存在一个问题：『新添加的语句』放到了 `super()` 方法之前

```java
public class HelloWorld {
    private final String name;
    private final int age;

    public HelloWorld(String name, int age) {
        System.out.println(">>> Method Enter");    // <-- advice code
        super();                                   // <-- super() 后执行（这里会存在一些问题）

        System.out.println("AAA");
        this.name = name;
        this.age = age;
        System.out.println("BBB");
        
        System.out.println("<<< Method Exit");     // <-- advice code
    }

    // ...
}
```

在 `super()` 执行完之前，不能访问 `this`：

```java
import net.bytebuddy.asm.Advice;

public class Expert {
    @Advice.OnMethodEnter
    static void methodAbc(@Advice.This HelloWorld instance) {
        System.out.println(">>> Method Enter");
        instance.test();
    }

    @Advice.OnMethodExit
    static void methodXyz() {
        System.out.println("<<< Method Exit");
    }
}
```

错误信息：

```text
Cannot map this reference for static method or constructor start
```
