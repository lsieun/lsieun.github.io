---
title: "Lambda: Bootstrap"
sequence: "101"
---

TODO:

- [ ] 需要一个实例 GoodChild instance
- [ ] 需要方法参数，看看 closure
- [ ] 

## LambdaMetafactory

```java
public class LambdaMetafactory {
    public static final int FLAG_SERIALIZABLE = 1 << 0;
    public static final int FLAG_MARKERS = 1 << 1;
    public static final int FLAG_BRIDGES = 1 << 2;
}
```

## LambdaMetafactory.altMetafactory

### 代码准备

```java
import java.io.Serializable;
import java.util.function.Function;

public interface SerializableFunction<T, R> extends Function<T, R>, Serializable {
}
```

```java
public class GoodChild {
    public static int play(int val) {
        return 2 * val;
    }
}
```

```java
public class HelloWorld {
    public static SerializableFunction<Integer, Integer> test() {
        SerializableFunction<Integer, Integer> func = GoodChild::play;
        return func;
    }
}
```

```java
public class HelloWorldRun {
    public static void main(String[] args) throws Exception {
        SerializableFunction<Integer, Integer> func = HelloWorld.test();
        Integer result = func.apply(10);
        System.out.println(result);
    }
}
```

### HelloWorld.class

在 `HelloWorld.class` 文件中，注意的地方有两点：

- 第一点，由 Java 编译器会生成 `$deserializeLambda$` 方法，带有 `ACC_SYNTHETIC` 标识

```text
  private static java.lang.Object $deserializeLambda$(java.lang.invoke.SerializedLambda);
    descriptor: (Ljava/lang/invoke/SerializedLambda;)Ljava/lang/Object;
    flags: ACC_PRIVATE, ACC_STATIC, ACC_SYNTHETIC
```

- 第二点，在 `BootstrapMethods` 属性中会调用 `LambdaMetafactory.altMetafactory` 方法：

```text
BootstrapMethods:
  0: #49 invokestatic java/lang/invoke/LambdaMetafactory.altMetafactory:(
          Ljava/lang/invoke/MethodHandles$Lookup;
          Ljava/lang/String;
          Ljava/lang/invoke/MethodType;
          [Ljava/lang/Object;
        )Ljava/lang/invoke/CallSite;
    Method arguments:
      #50 (Ljava/lang/Object;)Ljava/lang/Object;
      #51 invokestatic sample/GoodChild.play:(I)I
      #52 (Ljava/lang/Integer;)Ljava/lang/Integer;
      #53 5
      #54 0
```

```text
public static CallSite altMetafactory(MethodHandles.Lookup caller,
                                      String invokedName,
                                      MethodType invokedType,
                                      Object... args)
```

- `caller`: `sample.HelloWorld`
- `invokedName`: `apply`
- `invokedType`: `()SerializableFunction`
- `args`: 5 个值
  - 0: (Object)Object
  - 1: MethodHandle(int)int - sample.GoodChild.play(int)int/invokeStatic
  - 2: (Integer)Integer
  - 3: 5
  - 4: 0

## JDK 16: ObjectMethods.bootstrap

`java.lang.runtime.ObjectMethods` 是 Java 16 引入的

```java
public record HelloWorld(String name, int age) {
}
```

```text
BootstrapMethods:
  0: #45 REF_invokeStatic java/lang/runtime/ObjectMethods.bootstrap:(Ljava/lang/invoke/MethodHandles$Lookup;
         Ljava/lang/String;
         Ljava/lang/invoke/TypeDescriptor;
         Ljava/lang/Class;Ljava/lang/String;
         [Ljava/lang/invoke/MethodHandle;
     )Ljava/lang/Object;
    Method arguments:
      #8 sample/HelloWorld
      #52 name;age
      #54 REF_getField sample/HelloWorld.name:Ljava/lang/String;
      #55 REF_getField sample/HelloWorld.age:I

```
