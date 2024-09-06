---
title: "Advice.withCustomMapping()"
sequence: "102"
---

## 示例

```java
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;

@Retention(RetentionPolicy.RUNTIME)
public @interface Custom {
    /* empty */
}
```

### 示例一：null

```java
public class HelloWorld {
    public String test(String name, int age) {
        return String.format("HelloWorld: %s - %d", name, age);
    }
}
```

```java
public class HelloWorldRun {
    public static void main(String[] args) {
        HelloWorld instance = new HelloWorld();
        String msg = instance.test("Tom", 10);
        System.out.println("msg = " + msg);
    }
}
```

```java
import net.bytebuddy.asm.Advice;

public class Expert {
    @Advice.OnMethodEnter
    public static void methodEnter(@Custom Object value) {
        String info = String.format("value = %s", value);
        System.out.println(info);
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
                Advice.withCustomMapping()
                        .bind(Custom.class, (Object) null)
                        .to(Expert.class)
                        .on(ElementMatchers.named("test"))
        );


        // 第三步，输出结果
        DynamicType.Unloaded<?> unloadedType = builder.make();
        OutputUtils.save(unloadedType, true);
    }
}
```

```java
public class HelloWorld {
    public String test(String name, int age) {
        String info = String.format("value = %s", null);
        System.out.println(info);
        return String.format("HelloWorld: %s - %d", name, age);
    }
}
```

### 示例二：Class

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
                Advice.withCustomMapping()
                        .bind(Custom.class, Object.class)    // 注意：只修改了第二个参数为 Object.class
                        .to(Expert.class)
                        .on(ElementMatchers.named("test"))
        );


        // 第三步，输出结果
        DynamicType.Unloaded<?> unloadedType = builder.make();
        OutputUtils.save(unloadedType, true);
    }
}
```

### 示例三：Serializable

```java
public class HelloWorld {

    public String test(String name, int age) {
        return String.format("HelloWorld: %s - %d", name, age);
    }
}
```

```java
public class HelloWorldRun {
    public static void main(String[] args) {
        HelloWorld instance = new HelloWorld();
        String msg = instance.test("Tom", 10);
        System.out.println("msg = " + msg);
    }
}
```

```java
import net.bytebuddy.ByteBuddy;
import net.bytebuddy.asm.Advice;
import net.bytebuddy.dynamic.DynamicType;
import net.bytebuddy.matcher.ElementMatchers;

import java.io.Serializable;
import java.util.Collections;

public class HelloWorldRedefine {
    public static void main(String[] args) throws Exception {
        // 第一步，准备参数
        String className = "sample.HelloWorld";
        Class<?> clazz = Class.forName(className);


        // 第二步，生成类
        ByteBuddy byteBuddy = new ByteBuddy();
        DynamicType.Builder<?> builder = byteBuddy.redefine(clazz);


        builder = builder.visit(
                Advice.withCustomMapping()
                        // 注意：这里不是 bind，而是 bindSerialized 方法
                        .bindSerialized(Custom.class, (Serializable) Collections.singletonMap("name", "tom"))
                        .to(Expert.class)
                        .on(ElementMatchers.named("test"))
        );


        // 第三步，输出结果
        DynamicType.Unloaded<?> unloadedType = builder.make();
        OutputUtils.save(unloadedType, true);
    }
}
```
