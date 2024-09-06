---
title: "@Advice.Local"
sequence: "101"
---

从 MethodEnter 向 MethodExit 传递数据

The `@Local` annotation is used to declare the local variable in the method body.
In advice code, this variable is a parameter.
After instrumentation process, the parameter will be changed into local variable in the method body
of the instrumented code.

```java
public class Advice implements AsmVisitorWrapper.ForDeclaredMethods.MethodVisitorWrapper, Implementation {
    @Retention(RetentionPolicy.RUNTIME)
    @java.lang.annotation.Target(ElementType.PARAMETER)
    public @interface Local {

        /**
         * The name of the local variable that the annotated parameter references.
         *
         * @return The name of the local variable that the annotated parameter references.
         */
        String value();
    }
}
```

The `@Local` annotation must be declared in the method with `@OnMethodEnter` annotation.
To use the local variable in exit advice, annotate one of the parameter in exist advice with the `@Local` annotation,
and the annotation must have the same value with the `@Local` annotation in enter advice
if they are referring to the same local variable.



```java
import java.util.Base64;
import java.util.Date;
import java.util.concurrent.TimeUnit;

public class HelloWorld {
    public String test(String name, int age, Date date) {
        String str = String.format("%s:%s:%s", name, age, date);

        try {
            int timeout = (int) (Math.random() * 1000);
            TimeUnit.MILLISECONDS.sleep(timeout);
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        }

        byte[] bytes = str.getBytes();
        return Base64.getEncoder().encodeToString(bytes);
    }
}
```



```java
import net.bytebuddy.asm.Advice;

public class Expert {
    @Advice.OnMethodEnter
    public static void methodEnter(
            @Advice.Local("timestamp") long startTime
    ) {
        startTime = System.currentTimeMillis();
    }

    @Advice.OnMethodExit
    public static void methodExit(
            @Advice.Local("timestamp") long startTime
    ) {
        long endTime = System.currentTimeMillis();
        long diff = endTime - startTime;
        System.out.println("Execution Time: " + diff);
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
                Advice.to(Expert.class).on(ElementMatchers.isMethod())
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
