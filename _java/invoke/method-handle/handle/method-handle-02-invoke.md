---
title: "method handles invoke"
sequence: "102"
---



## 两个 invoke 方法

There are two ways to invoke a method handle - `invoke()` and `invokeExact()`.
Both of these take the **receiver** and **call arguments** as **parameters**.
`invokeExact()` tries to call the method handle directly as is,
whereas `invoke()` will massage call arguments if needed.

In general, `invoke()` performs an `asType()` conversion if necessary - this converts arguments according to these rules:

- A primitive argument will be boxed if required.
- A boxed primitive will be unboxed if required.
- Primitives will be widened if necessary.
- A `void` return type will be massaged to `0` or `null`,
  depending on whether the expected return was primitive or of reference type.
- `null` values are passed through, regardless of static type.

```java
import java.lang.invoke.MethodHandle;
import java.lang.invoke.MethodHandles;
import java.lang.invoke.MethodType;

public class MethodHandleInvoke {
    public static void main(String[] args) throws Throwable {
        Object receiver = "a";

        MethodType methodType = MethodType.methodType(int.class);
        MethodHandles.Lookup lookup = MethodHandles.lookup();
        MethodHandle methodHandle = lookup.findVirtual(receiver.getClass(), "hashCode", methodType);

        int returnVal = (int)methodHandle.invoke(receiver);
        System.out.println(returnVal);
    }
}
```

## bindto 方法

```java
public class HelloWorld {
    public String test(String a, String b, int c, int d) {
        return String.format(
                "a = '%s', b = '%s', c = %d, d = %d",
                a, b, c, d
        );
    }
}
```

```java
import java.lang.invoke.MethodHandle;
import java.lang.invoke.MethodHandles;
import java.lang.invoke.MethodType;

public class HelloWorldRun {
    public static void main(String[] args) throws Throwable {
        MethodType methodType = MethodType.methodType(String.class, String.class, String.class, int.class, int.class);
        MethodHandles.Lookup lookup = MethodHandles.lookup();
        MethodHandle methodHandle = lookup.findVirtual(HelloWorld.class, "test", methodType);

        HelloWorld instance = new HelloWorld();
        Object result1 = methodHandle.invoke(instance, "Tom", "Jerry", 10, 20);
        System.out.println("result1 = " + result1);

        MethodHandle methodHandle2 = methodHandle.bindTo(instance);
        Object result2 = methodHandle2.invoke("Tom", "Jerry", 20, 30);
        System.out.println("result2 = " + result2);

        Object result3 = methodHandle2.invoke("Tom", "Jerry", 30, 40);
        System.out.println("result3 = " + result3);

        Object result4 = methodHandle2.bindTo("Tom").bindTo("Jerry").invoke(40, 50);
        System.out.println("result4 = " + result4);
    }
}
```
