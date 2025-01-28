---
title: "Annotation Proxy"
sequence: "111"
---

```java
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;

@Retention(RetentionPolicy.RUNTIME)
public @interface MyTag {
}
```

```java
@MyTag
public class HelloWorld {
}
```

```java
import java.lang.reflect.Proxy;

public class Program {
    public static void main(String[] args) {
        MyTag tag = HelloWorld.class.getAnnotation(MyTag.class);
        System.out.println("tag = " + tag);

        Class<?> clazz = tag.getClass();
        System.out.println("clazz = " + clazz);

        boolean flag = Proxy.isProxyClass(clazz);
        System.out.println("flag = " + flag);
    }
}
```

```text
tag = @lsieun.annotation.MyTag()
clazz = class jdk.proxy2.$Proxy1
flag = true
```
