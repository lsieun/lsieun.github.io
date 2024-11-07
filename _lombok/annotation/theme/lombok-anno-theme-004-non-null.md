---
title: "不为 null：@NonNull"
sequence: "104"
---

## 字段

```java
import lombok.NonNull;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public class HelloWorld {
    @NonNull
    private String name;
    private int age;
}
```

```java
import lombok.NonNull;

public class HelloWorld {
    private @NonNull String name;
    private int age;

    public HelloWorld(@NonNull String name) {
        // 对 name 进行『是否为 null』的判断
        if (name == null) {
            throw new NullPointerException("name is marked non-null but is null");
        } else {
            this.name = name;
        }
    }
}
```

## 方法参数

```java
import lombok.NonNull;

public class HelloWorld {
    public void test(@NonNull String name, int age) {
        System.out.println(name + age);
    }
}
```

```java
import lombok.NonNull;

public class HelloWorld {
    public HelloWorld() {
    }

    public void test(@NonNull String name, int age) {
        // 对 name 进行『是否为 null』的判断
        if (name == null) {
            throw new NullPointerException("name is marked non-null but is null");
        } else {
            System.out.println(name + age);
        }
    }
}
```
