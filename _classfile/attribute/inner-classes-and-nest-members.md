---
title: "InnerClasses 和 NestMembers"
sequence: "102"
---

## 示例

### 示例一

```java
import java.util.function.Supplier;

public class HelloWorld {
    public void test() {
        Supplier<String> supplier = () -> "Hello World";
        String str = supplier.get();
        System.out.println(str);
    }
}
```

```text
InnerClasses:
     public static final #68= #64 of #66; //Lookup=class java/lang/invoke/MethodHandles$Lookup of class java/lang/invoke/MethodHandles
```

### 示例二

```java
import java.lang.invoke.MethodHandle;
import java.lang.invoke.MethodHandles;
import java.lang.invoke.MethodType;

public class HelloWorld {
    public static String getText() {
        return "Hello World";
    }

    public void test() throws Throwable {
        MethodHandles.Lookup lookup = MethodHandles.lookup();
        MethodType methodType = MethodType.methodType(String.class);
        MethodHandle methodHandle = lookup.findStatic(HelloWorld.class, "getText", methodType);
        Object result = methodHandle.invoke();
        System.out.println(result);
    }

    public class InnerClass {
    }

    public static class StaticNestedClass {
    }
}
```

```text
D:\git-repo\learn-java-classfile\target\classes>javap -v -p sample.HelloWorld
NestMembers:
  sample/HelloWorld$StaticNestedClass
  sample/HelloWorld$InnerClass
InnerClasses:
  public static final #75= #28 of #10;    // Lookup=class java/lang/invoke/MethodHandles$Lookup of class java/lang/invoke/MethodHandles
  public static #76= #70 of #23;          // StaticNestedClass=class sample/HelloWorld$StaticNestedClass of class sample/HelloWorld
  public #77= #72 of #23;                 // InnerClass=class sample/HelloWorld$InnerClass of class sample/HelloWorld
```
