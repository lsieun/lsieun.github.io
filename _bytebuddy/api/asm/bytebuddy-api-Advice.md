---
title: "Advice"
sequence: "102"
---

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
    public static void methodEnter() {
        System.out.println(">>> >>> >>> >>> >>> >>> >>> >>> >>> Method Enter");
    }

    @Advice.OnMethodExit
    public static void methodExit() {
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
    public static void main(String[] args) throws Exception {
        // 第一步，准备参数
        String className = "sample.HelloWorld";
        Class<?> clazz = Class.forName(className);


        // 第二步，生成类
        ByteBuddy byteBuddy = new ByteBuddy();
        DynamicType.Builder<?> builder = byteBuddy.redefine(clazz)
                .name(className);

        builder = builder.visit(
                Advice.to(Expert.class).on(ElementMatchers.named("test"))
        );

        // 第三步，输出结果
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
    public static void methodEnter() {
        System.out.println(">>> >>> >>> >>> >>> >>> >>> >>> >>> Method Enter");
    }

    @Advice.OnMethodExit
    public static void methodExit() {
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
    public static void main(String[] args) throws Exception {
        // 第一步，准备参数
        String className = "sample.HelloWorld";


        // 第二步，生成类
        ByteBuddy byteBuddy = new ByteBuddy();
        DynamicType.Builder<?> builder = byteBuddy.subclass(Parent.class)
                .modifiers(Visibility.PUBLIC)
                .name(className);

        builder = builder.method(ElementMatchers.named("test"))
                .intercept(Advice.to(Expert.class));

        // 第三步，输出结果
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
