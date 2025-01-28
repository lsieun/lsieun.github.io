---
title: "@Advice.FieldValue"
sequence: "101"
---

## 介绍

### 作用

`@Advice.FieldValue` 作用：对『字段』进行映射。

```java
@Retention(RetentionPolicy.RUNTIME)
@java.lang.annotation.Target(ElementType.PARAMETER)
public @interface FieldValue {
    String value() default OffsetMapping.ForField.Unresolved.BEAN_PROPERTY;
    Class<?> declaringType() default void.class;

    boolean readOnly() default true;
    Assigner.Typing typing() default Assigner.Typing.STATIC;
}
```

### 注意事项

- 在静态方法（static method）中，不能访问非静态字段（non-static field）。
- 在构造方法（constructor）中，`this` 还没有完成初始化时，不能访问非静态字段（non-static field）。

第 1 个示例，静态方法：

```java
public class HelloWorld {
    private static int staticIntValue = 10;
    private int nonStaticIntValue = 20;

    public static String test() {
        return "Hello World";
    }
}
```

第 2 个示例，构造方法：

```java
public class HelloWorld {
    private static int staticIntValue = 10;
    private int nonStaticIntValue = 20;

    public HelloWorld() {
        System.out.println("Hello World");
    }
}
```

访问静态字段：

```java
import net.bytebuddy.asm.Advice;

public class Expert {
    @Advice.OnMethodEnter
    static void methodAbc(
            @Advice.FieldValue(value = "staticIntValue") int staticValue
            // @Advice.FieldValue(value = "nonStaticIntValue") int nonStaticValue
    ) {
        System.out.println("staticIntValue   : " + staticValue);
        // System.out.println("nonStaticIntValue: " + nonStaticValue);
    }
}
```

## 示例

### 读取当前类的字段值

```java
public class HelloWorld {
    private final String name;
    private final int age;

    public HelloWorld() {
        this.name = "Tom";
        this.age = 10;
    }

    public String test() {
        return String.format("Name: %s, Age: %s", name, age);
    }
}
```

```java
import net.bytebuddy.asm.Advice;

public class Expert {
    @Advice.OnMethodEnter
    static void methodAbc(
            @Advice.FieldValue("name") String fieldNameValue,
            @Advice.FieldValue("age") int fieldAgeValue
    ) {
        System.out.println("@Advice.FieldValue(\"name\"): " + fieldNameValue);
        System.out.println("@Advice.FieldValue(\"age\") : " + fieldAgeValue);
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
        DynamicType.Builder<?> builder = byteBuddy.redefine(clazz);

        builder = builder.visit(
                Advice.to(Expert.class)
                        .on(ElementMatchers.named("test"))
        );


        // 3. output
        DynamicType.Unloaded<?> unloadedType = builder.make();
        OutputUtils.save(unloadedType, true);
    }
}
```

```java
public class HelloWorldRun {
    public static void main(String[] args) {
        String className = "sample.HelloWorld";
        InvokeUtils.invokeAllMethods(className);
    }
}
```

```text
@Advice.FieldValue("name"): Tom
@Advice.FieldValue("age") : 10
```

### 读取父类的字段值

```java
public class Parent {
    protected String name = "Tom";
    protected int age = 10;
}
```

```java
public class HelloWorld extends Parent {
    public String test() {
        return "Hello World";
    }
}
```

```java
import net.bytebuddy.asm.Advice;

public class Expert {
    @Advice.OnMethodEnter
    static void methodAbc(
            @Advice.FieldValue(value = "name", declaringType = Parent.class) String parentFieldNameValue,
            @Advice.FieldValue(value = "age", declaringType = Parent.class) int parentFieldAgeValue
    ) {
        System.out.println("Parent.name: " + parentFieldNameValue);
        System.out.println("Parent.age : " + parentFieldAgeValue);
    }
}
```

### 修改类的字段值

```java
public class HelloWorld {
    private static String staticField = "Hello World";
    private String name;
    private int age;

    public HelloWorld() {
        this.name = "Tom";
        this.age = 10;
    }

    public void test() {
        System.out.println("name       : " + name);
        System.out.println("age        : " + age);
        System.out.println("staticField: " + staticField);
    }
}
```

```java
import net.bytebuddy.asm.Advice;

public class Expert {
    @Advice.OnMethodEnter
    static void methodAbc(
            @Advice.FieldValue(value = "name", readOnly = false) String fieldNameValue,
            @Advice.FieldValue(value = "age", readOnly = false) int fieldAgeValue,
            @Advice.FieldValue(value = "staticField", readOnly = false) String staticFieldValue
    ) {
        fieldNameValue = "Jerry";
        fieldAgeValue = 9;
        staticFieldValue = "Hello ByteBuddy";
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
        DynamicType.Builder<?> builder = byteBuddy.redefine(clazz);

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
public class HelloWorldRun {
    public static void main(String[] args) {
        HelloWorld instance = new HelloWorld();
        instance.test();
    }
}
```


