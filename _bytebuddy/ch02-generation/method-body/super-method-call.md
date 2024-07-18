---
title: "SuperMethodCall"
sequence: "115"
---

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
import sample.Parent;

public class HelloWorldGenerate {
    public static void main(String[] args) throws Exception {
        // 第一步，准备参数
        String className = "sample.HelloWorld";


        // 第二步，生成类
        ByteBuddy byteBuddy = new ByteBuddy();
        DynamicType.Builder<?> builder = byteBuddy.subclass(Parent.class, ConstructorStrategy.Default.NO_CONSTRUCTORS)
                .modifiers(Visibility.PUBLIC)
                .name(className);

        builder = builder.defineConstructor(Visibility.PUBLIC)
                .withParameter(String.class, "name")
                .withParameter(int.class, "age")
                .intercept(SuperMethodCall.INSTANCE);


        // 第三步，输出结果
        DynamicType.Unloaded<?> unloadedType = builder.make();
        OutputUtils.save(unloadedType);
    }
}
```











