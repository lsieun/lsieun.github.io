---
title: "Advice Custom Mapping"
sequence: "104"
---

## 介绍

在 `Advice` 类中，提供了多个注解，用于『注解-参数值』的映射，例如：

- `@Advice.This` 会映射成 `this`
- `@Advice.FieldValue` 会映射成『字段』
- `@Advice.Argument` 会映射成『方法的参数』

除此之外，`Advice` 类也提供了自定义『注解-参数值』的映射，例如：

- 自己编写一个 `@Custom` 注解，然后映射成『某一个值』

```text
                         ┌─── Advice.withCustomMapping() ───┼─── [r] Advice.WithCustomMapping
                         │
                         │                                                                    ┌─── bind()
                         │                                                                    │
                         │                                                                    ├─── bindDynamic()
                         │                                                                    │
advice.custom.mapping ───┤                                                ┌─── bind ──────────┼─── bindLambda()
                         │                                                │                   │
                         │                                                │                   ├─── bindProperty()
                         │                                                │                   │
                         │                                  ┌─── chain ───┤                   └─── bindSerialized()
                         │                                  │             │
                         │                                  │             ├─── bootstrap()
                         └─── Advice.WithCustomMapping ─────┤             │
                                                            │             └─── with()
                                                            │
                                                            └─── build ───┼─── to() ───┼─── [r] Advice
```

## 示例

```java
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Retention(RetentionPolicy.RUNTIME)
@Target({ElementType.PARAMETER})
public @interface Custom {
    /* empty */
}
```

```java
public class HelloWorld {
    public String test(String name, int age) {
        return String.format("HelloWorld - %s - %d", name, age);
    }
}
```

```java
public class HelloWorldRun {
    public static void main(String[] args) {
        HelloWorld instance = new HelloWorld();
        String msg = instance.test("Tom", 10);
        System.out.println(msg);
    }
}
```

```java
import net.bytebuddy.asm.Advice;

public class Expert {
    @Advice.OnMethodEnter
    static void methodAbc(@Custom Object value) {
        String msg = String.format("value = %s", value);
        System.out.println(msg);
    }
}
```

### 示例一：映射为 null

```java
import net.bytebuddy.ByteBuddy;
import net.bytebuddy.asm.Advice;
import net.bytebuddy.dynamic.DynamicType;
import net.bytebuddy.matcher.ElementMatchers;
import sample.Custom;

public class HelloWorldRedefine {
    public static void main(String[] args) {
        // 1. prepare
        String className = "sample.HelloWorld";
        Class<?> clazz = ClassUtils.loadClass(className);


        // 2. weave
        ByteBuddy byteBuddy = new ByteBuddy();
        DynamicType.Builder<?> builder = byteBuddy.redefine(clazz);

        builder = builder.visit(
                Advice.withCustomMapping()
                        .bind(Custom.class, (Object) null)
                        .to(Expert.class)
                        .on(ElementMatchers.named("test"))
        );


        // 3. output
        DynamicType.Unloaded<?> unloadedType = builder.make();
        OutputUtils.save(unloadedType, true);
    }
}
```

生成的类：

```java
public class HelloWorld {
    public String test(String name, int age) {
        String msg = String.format("value = %s", null);
        System.out.println(msg);
        return String.format("HelloWorld - %s - %d", name, age);
    }
}
```

### 示例二：映射成 Class

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
                Advice.withCustomMapping()
                        .bind(Custom.class, Object.class)    // 注意：只修改了第二个参数为 Object.class
                        .to(Expert.class)
                        .on(ElementMatchers.named("test"))
        );


        // 3. output
        DynamicType.Unloaded<?> unloadedType = builder.make();
        OutputUtils.save(unloadedType, true);
    }
}
```

生成类：

```java
public class HelloWorld {
    public String test(String name, int age) {
        String msg = String.format("value = %s", Object.class);
        System.out.println(msg);
        return String.format("HelloWorld - %s - %d", name, age);
    }
}
```

### 示例三：映射成 Serializable

```java
import net.bytebuddy.ByteBuddy;
import net.bytebuddy.asm.Advice;
import net.bytebuddy.dynamic.DynamicType;
import net.bytebuddy.matcher.ElementMatchers;

import java.io.Serializable;
import java.util.Collections;

public class HelloWorldRedefine {
    public static void main(String[] args) {
        // 1. prepare
        String className = "sample.HelloWorld";
        Class<?> clazz = ClassUtils.loadClass(className);


        // 2. weave
        ByteBuddy byteBuddy = new ByteBuddy();
        DynamicType.Builder<?> builder = byteBuddy.redefine(clazz);


        builder = builder.visit(
                Advice.withCustomMapping()
                        // 注意：这里不是 bind，而是 bindSerialized 方法
                        .bindSerialized(Custom.class, (Serializable) Collections.singletonMap("name", "tom"))
                        .to(Expert.class)
                        .on(ElementMatchers.named("test"))
        );


        // 3. output
        DynamicType.Unloaded<?> unloadedType = builder.make();
        OutputUtils.save(unloadedType, true);
    }
}
```

```java
public class HelloWorld {
    public String test(String name, int age) {
        String msg = String.format("value = %s", (new ObjectInputStream(
                new ByteArrayInputStream("...".getBytes("ISO-8859-1"))
        )).readObject());
        System.out.println(msg);
        return String.format("HelloWorld - %s - %d", name, age);
    }
}
```

输出信息：

```text
value = {name=tom}
HelloWorld - Tom - 10
```

```text
AC ED 00 05 73 72 00 22 6A 61 76 61 2E 75 74 69 6C 2E 43 6F 6C 6C 65 63 74 69 6F 6E 73 24 53 69
6E 67 6C 65 74 6F 6E 4D 61 70 9F 23 09 91 71 7F 6B 91 02 00 02 4C 00 01 6B 74 00 12 4C 6A 61 76
61 2F 6C 61 6E 67 2F 4F 62 6A 65 63 74 3B 4C 00 01 76 71 00 7E 00 01 78 70 74 00 04 6E 61 6D 65
74 00 03 74 6F 6D
```

```text
STREAM_MAGIC       = 'ACED' (ACED)
STREAM_VERSION     = '0005' (0005)
TC_OBJECT          = '73' (TC_OBJECT)
    TC_CLASSDESC       = '72' (TC_CLASSDESC)
        length             = '0022' (34)
        className          = '6A6176612E7574696C2E436F6C6C656374696F6E732453696E676C65746F6E4D6170' (java.util.Collections$SingletonMap)
        serialVersionUID   = '9F230991717F6B91' (-6979724477215052911)
        classDescFlags     = '02' ([SC_SERIALIZABLE])
        fields count       = '0002' (2)
        field[0] {
            type               = '4C' (L: object)
            length             = '0001' (1)
            name               = '6B' (k)
            TC_STRING          = '74' (TC_STRING)
                length             = '0012' (18)
                contents           = '4C6A6176612F6C616E672F4F626A6563743B' (Ljava/lang/Object;)
        }
        field[1] {
            type               = '4C' (L: object)
            length             = '0001' (1)
            name               = '76' (v)
            TC_REFERENCE       = '71' (TC_REFERENCE)
                handle             = '007E0001' (007E0001)
        }
    TC_ENDBLOCKDATA    = '78' (TC_ENDBLOCKDATA)
    TC_NULL            = '70' (TC_NULL)
    TC_STRING          = '74' (TC_STRING)
        length             = '0004' (4)
        contents           = '6E616D65' (name)
    TC_STRING          = '74' (TC_STRING)
        length             = '0003' (3)
        contents           = '746F6D' (tom)
```
