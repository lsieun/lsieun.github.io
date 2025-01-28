---
title: "FieldAccessor（字段方法）"
sequence: "field-accessor"
---

TODO:

- 从字段取值：
    - 作为返回值
    - 存放到其它局部变量
    - 保存到类里的某个字段上

### 字段值 -FieldAccessor

To create the **method body** of the getter method, the `FieldAccessor` is used.

预期目标：

```java
public class HelloWorld {
    private String name;

    protected String getName() {
        return this.name;
    }

    protected void setName(String str) {
        this.name = str;
    }
}
```

编码实现：

```java
import net.bytebuddy.ByteBuddy;
import net.bytebuddy.description.modifier.Visibility;
import net.bytebuddy.dynamic.DynamicType;
import net.bytebuddy.implementation.FieldAccessor;

public class HelloWorldSubClass {
    public static void main(String[] args) {
        // 1. prepare
        String className = "sample.HelloWorld";


        // 2. weave
        ByteBuddy byteBuddy = new ByteBuddy();
        DynamicType.Builder<?> builder = byteBuddy.subclass(Object.class)
                .modifiers(Visibility.PUBLIC)
                .name(className);

        builder = builder.defineField("name", String.class, Visibility.PRIVATE);

        builder = builder.defineMethod("getName", String.class, Visibility.PROTECTED)
                .intercept(
                        FieldAccessor.ofField("name")
                )
                .defineMethod("setName", void.class, Visibility.PROTECTED)
                .withParameter(String.class, "str")
                .intercept(
                        FieldAccessor.ofField("name")
                );


        // 3. output
        DynamicType.Unloaded<?> unloadedType = builder.make();
        OutputUtils.save(unloadedType);
    }
}
```

Using the `FieldAccessor`, it is possible to implement a method to read or to write a field value.

FieldAccessor.ofField("fieldName").setsValue();

```java
public abstract class FieldAccessor implements Implementation {
}
```

## Getter and Setter

Creating such an implementation is trivial: Simply call `FieldAccessor.ofBeanProperty()`.

However, if you do not want to derive a field's name from a method's name,
you can still specify the field name explicitly by using `FieldAccessor.ofField(String)`.
Using this method, the only argument defines the field's name that should be accessed.
If required, this even allows you to define a new field if such a field does not yet exist.

```java
public class HelloWorld {
    private String name;

    protected String getName() {
        return this.name;
    }

    protected void setName(String str) {
        this.name = str;
    }
}
```

### ofBeanProperty

使用 `FieldAccessor.ofBeanProperty()` 方法：

```java
import net.bytebuddy.ByteBuddy;
import net.bytebuddy.description.modifier.Visibility;
import net.bytebuddy.dynamic.DynamicType;
import net.bytebuddy.implementation.FieldAccessor;

public class HelloWorldGenerate {
    public static void main(String[] args) {
        // 1. prepare
        String className = "sample.HelloWorld";


        // 2. weave
        ByteBuddy byteBuddy = new ByteBuddy();
        DynamicType.Builder<?> builder = byteBuddy.subclass(Object.class)
                .modifiers(Visibility.PUBLIC)
                .name(className);

        builder = builder.defineField("name", String.class, Visibility.PRIVATE);

        builder = builder.defineMethod("getName", String.class, Visibility.PROTECTED)
                .intercept(
                        FieldAccessor.ofBeanProperty()
                )
                .defineMethod("setName", void.class, Visibility.PROTECTED)
                .withParameter(String.class, "str")
                .intercept(
                        FieldAccessor.ofBeanProperty()
                );


        // 3. output
        DynamicType.Unloaded<?> unloadedType = builder.make();
        OutputUtils.save(unloadedType);
    }
}
```

### ofField

使用 `FieldAccessor.ofField()` 方法：

```java
import net.bytebuddy.ByteBuddy;
import net.bytebuddy.description.modifier.Visibility;
import net.bytebuddy.dynamic.DynamicType;
import net.bytebuddy.implementation.FieldAccessor;

public class HelloWorldGenerate {
    public static void main(String[] args) {
        // 1. prepare
        String className = "sample.HelloWorld";


        // 2. weave
        ByteBuddy byteBuddy = new ByteBuddy();
        DynamicType.Builder<?> builder = byteBuddy.subclass(Object.class)
                .modifiers(Visibility.PUBLIC)
                .name(className);

        builder = builder.defineField("name", String.class, Visibility.PRIVATE);

        builder = builder.defineMethod("getName", String.class, Visibility.PROTECTED)
                .intercept(
                        FieldAccessor.ofField("name")
                )
                .defineMethod("setName", void.class, Visibility.PROTECTED)
                .withParameter(String.class, "str")
                .intercept(
                        FieldAccessor.ofField("name")
                );


        // 3. output
        DynamicType.Unloaded<?> unloadedType = builder.make();
        OutputUtils.save(unloadedType);
    }
}
```

## 给字段赋值

### 方法参数 -setsArgumentAt

```java
public class HelloWorld {
    private String name;
    private int age;

    public Object test(String str, int val, Object obj) {
        this.name = str;
        this.age = val;
        return obj;
    }
}
```

```java
import net.bytebuddy.ByteBuddy;
import net.bytebuddy.description.modifier.Visibility;
import net.bytebuddy.dynamic.DynamicType;
import net.bytebuddy.implementation.FieldAccessor;
import net.bytebuddy.implementation.FixedValue;

public class HelloWorldGenerate {
    public static void main(String[] args) {
        // 1. prepare
        String className = "sample.HelloWorld";


        // 2. weave
        ByteBuddy byteBuddy = new ByteBuddy();
        DynamicType.Builder<?> builder = byteBuddy.subclass(Object.class)
                .modifiers(Visibility.PUBLIC)
                .name(className);

        builder = builder.defineField("name", String.class, Visibility.PRIVATE)
                .defineField("age", int.class, Visibility.PRIVATE);

        builder = builder.defineMethod("test", Object.class, Visibility.PUBLIC)
                .withParameter(String.class, "str")
                .withParameter(int.class, "val")
                .withParameter(Object.class, "obj")
                .intercept(
                        FieldAccessor.ofField("name").setsArgumentAt(0)
                                .andThen(
                                        FieldAccessor.ofField("age").setsArgumentAt(1)
                                ).andThen(
                                        FixedValue.argument(2)
                                )
                );


        // 3. output
        DynamicType.Unloaded<?> unloadedType = builder.make();
        OutputUtils.save(unloadedType);
    }
}
```

### 固定值 -setsValue

```java
public class HelloWorld {
    private String name;
    private int age;

    public int test(String str, int val) {
        this.name = "Tom";
        this.age = 10;
        return 100;
    }
}
```

```java
import net.bytebuddy.ByteBuddy;
import net.bytebuddy.description.modifier.Visibility;
import net.bytebuddy.dynamic.DynamicType;
import net.bytebuddy.implementation.FieldAccessor;
import net.bytebuddy.implementation.FixedValue;

public class HelloWorldGenerate {
    public static void main(String[] args) {
        // 1. prepare
        String className = "sample.HelloWorld";


        // 2. weave
        ByteBuddy byteBuddy = new ByteBuddy();
        DynamicType.Builder<?> builder = byteBuddy.subclass(Object.class)
                .modifiers(Visibility.PUBLIC)
                .name(className);

        builder = builder.defineField("name", String.class, Visibility.PRIVATE)
                .defineField("age", int.class, Visibility.PRIVATE);

        builder = builder.defineMethod("test", int.class, Visibility.PUBLIC)
                .withParameter(String.class, "str")
                .withParameter(int.class, "val")
                .intercept(
                        FieldAccessor.ofField("name").setsValue("Tom").andThen(
                                FieldAccessor.ofField("age").setsValue(10)
                        ).andThen(
                                FixedValue.value(100)
                        )
                );


        // 3. output
        DynamicType.Unloaded<?> unloadedType = builder.make();
        OutputUtils.save(unloadedType);
    }
}
```

### 默认值 -setsDefaultValue

预期目标：

```java
public class HelloWorld {
    private String name;
    private int age;
    private boolean gender;

    public void test() {
        this.name = null;
        this.age = 0;
        this.gender = false;
    }
}
```

编码实现：

```java
import net.bytebuddy.ByteBuddy;
import net.bytebuddy.description.modifier.Visibility;
import net.bytebuddy.dynamic.DynamicType;
import net.bytebuddy.implementation.FieldAccessor;
import net.bytebuddy.implementation.StubMethod;

public class HelloWorldGenerate {
    public static void main(String[] args) {
        // 1. prepare
        String className = "sample.HelloWorld";


        // 2. weave
        ByteBuddy byteBuddy = new ByteBuddy();
        DynamicType.Builder<?> builder = byteBuddy.subclass(Object.class)
                .modifiers(Visibility.PUBLIC)
                .name(className);

        builder = builder.defineField("name", String.class, Visibility.PRIVATE)
                .defineField("age", int.class, Visibility.PRIVATE)
                .defineField("gender", boolean.class, Visibility.PRIVATE);

        builder = builder.defineMethod("test", void.class, Visibility.PUBLIC)
                .intercept(
                        FieldAccessor.ofField("name").setsDefaultValue()
                                .andThen(
                                        FieldAccessor.ofField("age").setsDefaultValue()
                                ).andThen(
                                        FieldAccessor.ofField("gender").setsDefaultValue()
                                ).andThen(
                                        StubMethod.INSTANCE
                                )
                );


        // 3. output
        DynamicType.Unloaded<?> unloadedType = builder.make();
        OutputUtils.save(unloadedType);
    }
}
```

### 字段 -setsFieldValueOf

```java
public class GoodChild {
    public static final String name = "Jerry";
    public static final int age = 9;
}
```

```java
public class HelloWorld {
    private String name;
    private int age;

    public void test(String str, int val) {
        this.name = GoodChild.name;
        this.age = GoodChild.age;
    }
}
```

```java
import net.bytebuddy.ByteBuddy;
import net.bytebuddy.description.modifier.Visibility;
import net.bytebuddy.dynamic.DynamicType;
import net.bytebuddy.implementation.FieldAccessor;
import net.bytebuddy.implementation.StubMethod;

public class HelloWorldGenerate {
    public static void main(String[] args) {
        // 1. prepare
        String className = "sample.HelloWorld";


        // 2. weave
        ByteBuddy byteBuddy = new ByteBuddy();
        DynamicType.Builder<?> builder = byteBuddy.subclass(Object.class)
                .modifiers(Visibility.PUBLIC)
                .name(className);

        builder = builder.defineField("name", String.class, Visibility.PRIVATE)
                .defineField("age", int.class, Visibility.PRIVATE);

        builder = builder.defineMethod("test", void.class, Visibility.PUBLIC)
                .withParameter(String.class, "str")
                .withParameter(int.class, "val")
                .intercept(
                        FieldAccessor.ofField("name").setsFieldValueOf(
                                GoodChild.class.getDeclaredField("name")
                        ).andThen(
                                FieldAccessor.ofField("age").setsFieldValueOf(
                                        GoodChild.class.getDeclaredField("age")
                                )
                        ).andThen(
                                StubMethod.INSTANCE
                        )
                );


        // 3. output
        DynamicType.Unloaded<?> unloadedType = builder.make();
        OutputUtils.save(unloadedType);
    }
}
```

### 给静态字段赋值

```java
public class HelloWorld {
    public void test(String str, int val) {
        GoodChild.name = "Tom";
        GoodChild.age = 10;
    }
}
```

```java
public class GoodChild {
    public static String name = "Jerry";
    public static int age = 9;
}
```

```java
import net.bytebuddy.ByteBuddy;
import net.bytebuddy.description.modifier.Visibility;
import net.bytebuddy.dynamic.DynamicType;
import net.bytebuddy.implementation.FieldAccessor;
import net.bytebuddy.implementation.StubMethod;

public class HelloWorldGenerate {
    public static void main(String[] args) {
        // 1. prepare
        String className = "sample.HelloWorld";


        // 2. weave
        ByteBuddy byteBuddy = new ByteBuddy();
        DynamicType.Builder<?> builder = byteBuddy.subclass(Object.class)
                .modifiers(Visibility.PUBLIC)
                .name(className);

        builder = builder.defineMethod("test", void.class, Visibility.PUBLIC)
                .withParameter(String.class, "str")
                .withParameter(int.class, "val")
                .intercept(
                        FieldAccessor.ofField("name").in(GoodChild.class).setsValue("Tom").andThen(
                                FieldAccessor.ofField("age").in(GoodChild.class).setsValue(10)
                        ).andThen(
                                StubMethod.INSTANCE
                        )
                );


        // 3. output
        DynamicType.Unloaded<?> unloadedType = builder.make();
        OutputUtils.save(unloadedType);
    }
}
```

## Hierarchy

When accessing an existing field, you are able to specify the type in which a field is defined by calling the `in`
method.
In Java, it is legal to define a field in several classes of a hierarchy.
In the process, a field of a class is shadowed by the field definition in its subclass.

Without such an explicit location of the field's class, Byte Buddy will access the first field
it encounters by traversing through a class hierarchy, starting with the most specific class.

## 实现接口

```java
public interface Dog {
    String getName();

    void setName(String str);
}
```

```java
public class HelloWorld implements Dog {
    private String name;

    public String getName() {
        return this.name;
    }

    public void setName(String var1) {
        this.name = var1;
    }
}
```

```java
import net.bytebuddy.ByteBuddy;
import net.bytebuddy.description.modifier.Visibility;
import net.bytebuddy.dynamic.DynamicType;
import net.bytebuddy.implementation.FieldAccessor;

public class HelloWorldGenerate {
    public static void main(String[] args) {
        // 1. prepare
        String className = "sample.HelloWorld";


        // 2. weave
        ByteBuddy byteBuddy = new ByteBuddy();
        DynamicType.Builder<?> builder = byteBuddy.subclass(Object.class)
                .modifiers(Visibility.PUBLIC)
                .name(className);

        builder = builder.defineField("name", String.class, Visibility.PRIVATE)
                .implement(Dog.class).intercept(FieldAccessor.ofBeanProperty());


        // 3. output
        DynamicType.Unloaded<?> unloadedType = builder.make();
        OutputUtils.save(unloadedType);
    }
}
```

```java
package sample;

public interface Dog {
    String getName();

    void setName(String str);

    int getAge();

    void setAge(int age);
}
```

```java
import net.bytebuddy.ByteBuddy;
import net.bytebuddy.description.modifier.Visibility;
import net.bytebuddy.dynamic.DynamicType;
import net.bytebuddy.implementation.FieldAccessor;

public class HelloWorldSubClass {
    public static void main(String[] args) {
        ByteBuddy byteBuddy = new ByteBuddy();
        DynamicType.Builder<?> builder = byteBuddy.subclass(Object.class)
                .modifiers(Visibility.PUBLIC)
                .name("sample.HelloWorld");

        builder = builder.defineField("name", String.class, Visibility.PRIVATE)
                .defineField("age", int.class, Visibility.PRIVATE)
                .implement(Dog.class)
                .intercept(FieldAccessor.ofBeanProperty());

        DynamicType.Unloaded<?> unloaded = builder.make();
        OutputUtils.save(unloaded);
    }
}
```

