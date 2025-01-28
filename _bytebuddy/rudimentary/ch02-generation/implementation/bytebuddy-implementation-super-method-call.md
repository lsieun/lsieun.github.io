---
title: "SuperMethodCall（调用父类方法）"
sequence: "super-method-call"
---

## SuperMethodCall

```java

```

## SuperMethodCall

```java

```

## Examples

```java
public class Parent {
    public void test() {
        System.out.println("test method from Parent");
    }
}
```

```java
public class HelloWorld extends Parent {
    public void test() {
        super.test();
    }
}
```

```java
import net.bytebuddy.ByteBuddy;
import net.bytebuddy.description.modifier.Visibility;
import net.bytebuddy.dynamic.DynamicType;
import net.bytebuddy.implementation.SuperMethodCall;

public class HelloWorldGenerate {
    public static void main(String[] args) {
        // 1. prepare
        String className = "sample.HelloWorld";


        // 2. weave
        ByteBuddy byteBuddy = new ByteBuddy();
        DynamicType.Builder<?> builder = byteBuddy.subclass(Parent.class)
                .name(className);

        builder = builder.defineMethod("test", void.class, Visibility.PUBLIC)
                .intercept(SuperMethodCall.INSTANCE);


        // 3. output
        DynamicType.Unloaded<?> unloadedType = builder.make();
        OutputUtils.save(unloadedType);
    }
}
```

As the name suggests, the `SuperMethodCall` implementation can be used to invoke a method's super implementation.

At first glance, the sole invocation of a super implementation does not seem very useful
since this will not change an implementation but only replicate existent logic.

However, by overriding a method, you are able to change the annotations of a method and its parameters.

## Constructor

Another rationale for calling a super method in Java is however the definition of a constructor
which must always invoke another constructor of either its super type or of its own type.

```text
MethodCall.invoke(
                PrintStream.class.getMethod("println", String.class)
        )
        .onField(System.class.getField("out"))
        .with("Hello World")
        .andThen(SuperMethodCall.INSTANCE)
```

## 示例

Within the Java class file format, constructors do not generally differ from methods such that Byte Buddy allows them to be treated just as such.

However, constructors are required to contain a hard-coded invocation of another constructor to be accepted by the Java runtime.

For this reason, most predefined implementations besides `SuperMethodCall` will fail to create a valid Java class when applied to a constructor.

```java
public class Parent {
    private String name;
    private int age;


    public Parent() {
        this(null, 0);
    }

    public Parent(String name, int age) {
        this.name = name;
        this.age = age;
    }
}
```

预期目标：

```java
public class HelloWorld extends Parent {
    public HelloWorld(String name, int age) {
        super(name, age);
    }
}
```

```java
import net.bytebuddy.ByteBuddy;
import net.bytebuddy.description.modifier.Visibility;
import net.bytebuddy.dynamic.DynamicType;
import net.bytebuddy.dynamic.scaffold.subclass.ConstructorStrategy;
import net.bytebuddy.implementation.SuperMethodCall;

public class HelloWorldGenerate {
    public static void main(String[] args) {
        // 1. prepare
        String className = "sample.HelloWorld";


        // 2. weave
        ByteBuddy byteBuddy = new ByteBuddy();
        DynamicType.Builder<?> builder = byteBuddy.subclass(Parent.class, ConstructorStrategy.Default.NO_CONSTRUCTORS)
                .modifiers(Visibility.PUBLIC)
                .name(className);

        builder = builder.defineConstructor(Visibility.PUBLIC)
                .withParameter(String.class, "name")
                .withParameter(int.class, "age")
                .intercept(SuperMethodCall.INSTANCE);


        // 3. output
        DynamicType.Unloaded<?> unloadedType = builder.make();
        OutputUtils.save(unloadedType);
    }
}
```
