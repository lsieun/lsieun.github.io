---
title: "@Default"
sequence: "101"
---

## 介绍

Obviously, default method invocation is only available for classes
that are defined in a class file version equal to Java 8 or newer.

Similarly, in addition to the `@Super` annotation,
there is a `@Default` annotation which injects a proxy for invoking a specific default method explicitly.

## 示例

### HardWorker

```java
import net.bytebuddy.implementation.bind.annotation.Argument;
import net.bytebuddy.implementation.bind.annotation.Default;
import net.bytebuddy.implementation.bind.annotation.RuntimeType;

public class HardWorker {
    @RuntimeType
    public static Object doWork(@Default IDog instance,
                                @Argument(0) String name,
                                @Argument(1) int age) {
        return instance.test(name, age);
    }
}
```

### Weaver

```java
import net.bytebuddy.ByteBuddy;
import net.bytebuddy.dynamic.DynamicType;
import net.bytebuddy.implementation.MethodDelegation;
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

        builder = builder.method(
                ElementMatchers.named("test")
        ).intercept(
                MethodDelegation.to(HardWorker.class)
        );


        // 3. output
        DynamicType.Unloaded<?> unloadedType = builder.make();
        OutputUtils.save(unloadedType, true);
    }
}
```

### 修改之后

```java
public class HelloWorld extends Father implements ICat, IDog {
    public void sayFromHelloWorld() {
        System.out.println("HelloWorld");
    }

    public String test(String name, int age) {
        HelloWorld$auxiliary$Proxy proxyObj = new HelloWorld$auxiliary$Proxy();
        proxyObj.target = this;
        return (String)HardWorker.doWork(proxyObj, name, age);
    }

    final String test$accessor$Abc$Xyz(String name, int age) {
        return super.test(name, age);
    }

    final void sayFromDog$accessor$Abc$Xyz() {
        super.sayFromDog();
    }

    final void sayFromMammal$accessor$Abc$Xyz() {
        super.sayFromMammal();
    }

    final void sayFromAnimal$accessor$Abc$Xyz() {
        super.sayFromAnimal();
    }
}
```

```text
> javap -v -p sample.HelloWorld

  public java.lang.String test(java.lang.String, int);
    descriptor: (Ljava/lang/String;I)Ljava/lang/String;
    flags: (0x0001) ACC_PUBLIC
    Code:
      stack=3, locals=3, args_size=3
         0: new           #34                 // class sample/HelloWorld$auxiliary$Proxy
         3: dup
         4: invokespecial #35                 // Method sample/HelloWorld$auxiliary$Proxy."<init>":()V
         7: dup
         8: aload_0
         9: putfield      #38                 // Field sample/HelloWorld$auxiliary$Proxy.target:Lsample/HelloWorld;
        12: aload_1
        13: iload_2
        14: invokestatic  #44                 // Method HardWorker.doWork:(Lsample/hierarchy/IDog;Ljava/lang/String;I)Ljava/lang/Object;
        17: checkcast     #46                 // class java/lang/String
        20: areturn

```

```java
class HelloWorld$auxiliary$Proxy implements IDog {
    public volatile HelloWorld target;

    public HelloWorld$auxiliary$Proxy() {
    }

    static HelloWorld$auxiliary$Proxy make() {
        return (HelloWorld$auxiliary$Proxy)ReflectionFactory.getReflectionFactory().newConstructorForSerialization(
                HelloWorld$auxiliary$Proxy.class,
                Object.class.getDeclaredConstructor()
        ).newInstance();
    }

    public String test(String name, int age) {
        return this.target.test$accessor$Abc$Xyz(name, age);
    }

    public void sayFromDog() {
        this.target.sayFromDog$accessor$Abc$Xyz();
    }

    public void sayFromMammal() {
        this.target.sayFromMammal$accessor$Abc$Xyz();
    }
    
    public void sayFromAnimal() {
        this.target.sayFromAnimal$accessor$Abc$Xyz();
    }
}
```

## 属性

### serializableProxy

```java
import net.bytebuddy.implementation.bind.annotation.Argument;
import net.bytebuddy.implementation.bind.annotation.Default;
import net.bytebuddy.implementation.bind.annotation.RuntimeType;

public class HardWorker {
    @RuntimeType
    public static Object doWork(@Default(serializableProxy = true) IDog instance, // 使用 serializableProxy 属性
                                @Argument(0) String name,
                                @Argument(1) int age) {
        return instance.test(name, age);
    }
}
```

```java
class HelloWorld$auxiliary$Proxy implements IDog, Serializable {
```

### proxyType

正确示例：

```java
import net.bytebuddy.implementation.bind.annotation.Argument;
import net.bytebuddy.implementation.bind.annotation.Default;
import net.bytebuddy.implementation.bind.annotation.RuntimeType;

public class HardWorker {
    @RuntimeType
    public static Object doWork(@Default(proxyType = ICat.class) IAnimal instance, // 使用 ICat 和 IAnimal 类型
                                @Argument(0) String name,
                                @Argument(1) int age) {
        return instance.test(name, age);
    }
}
```

```java
class HelloWorld$auxiliary$Proxy implements ICat {
}
```

错误示例：

```java
import net.bytebuddy.implementation.bind.annotation.Argument;
import net.bytebuddy.implementation.bind.annotation.Default;
import net.bytebuddy.implementation.bind.annotation.RuntimeType;

public class HardWorker {
    @RuntimeType
    public static Object doWork(@Default(proxyType = IAnimal.class) IAnimal instance, // proxyType 使用了 IAnimal 类型，会出现错误
                                @Argument(0) String name,
                                @Argument(1) int age) {
        return instance.test(name, age);
    }
}
```

## 注意事项

`@Default` 注解对于 `proxyType` 类型有一定的要求：

- `proxyType` 不能使用父类，只能使用接口
- `proxyType` 只能是直接实现的接口，不能是间接实现的接口

### Father

```java
import net.bytebuddy.implementation.bind.annotation.Argument;
import net.bytebuddy.implementation.bind.annotation.Default;
import net.bytebuddy.implementation.bind.annotation.RuntimeType;

public class HardWorker {
    @RuntimeType
    public static Object doWork(@Default Father instance,
                                @Argument(0) String name,
                                @Argument(1) int age) {
        return instance.test(name, age);
    }
}
```

出现错误信息：

```text
Father arg0 uses the @Default annotation on an invalid type
```

### IAnimal

```java
import net.bytebuddy.implementation.bind.annotation.Argument;
import net.bytebuddy.implementation.bind.annotation.Default;
import net.bytebuddy.implementation.bind.annotation.RuntimeType;

public class HardWorker {
    @RuntimeType
    public static Object doWork(@Default(proxyType = IAnimal.class) IAnimal instance,
                                @Argument(0) String name,
                                @Argument(1) int age) {
        return instance.test(name, age);
    }
}
```






