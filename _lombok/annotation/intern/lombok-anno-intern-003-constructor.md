---
title: "Constructor"
sequence: "103"
---

[UP](/lombok.html)

## @NoArgsConstructor

```java
import lombok.NoArgsConstructor;

@NoArgsConstructor
public class HelloWorld {
    private String name;
    private int age;

    public HelloWorld(String name, int age) {
        this.name = name;
        this.age = age;
    }
}
```

```java
public class HelloWorld {
    private String name;
    private int age;

    public HelloWorld(String name, int age) {
        this.name = name;
        this.age = age;
    }

    // 无参构造方法
    public HelloWorld() {
    }
}
```

## @AllArgsConstructor

```java
import lombok.AllArgsConstructor;

@AllArgsConstructor
public class HelloWorld {
    private String name;
    private int age;
}
```

```java
public class HelloWorld {
    private String name;
    private int age;

    // 生成构造方法
    public HelloWorld(String name, int age) {
        this.name = name;
        this.age = age;
    }
}
```

## @RequiredArgsConstructor

### 无参数

```java
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public class HelloWorld {
    private final String name;
    private final int age;

    private String email;
}
```

```java
public class HelloWorld {
    private final String name;
    private final int age;
    private String email;

    public HelloWorld(String name, int age) {
        this.name = name;
        this.age = age;
    }
}
```

### AccessLevel

```java
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor(access = AccessLevel.PRIVATE)
public class HelloWorld {
    private final String name;
    private final int age;

    private String email;
}
```

```java
public class HelloWorld {
    private final String name;
    private final int age;
    private String email;

    // 注意：这里是 private 修饰
    private HelloWorld(String name, int age) {
        this.name = name;
        this.age = age;
    }
}
```

### staticName

```java
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor(staticName = "of")
public class HelloWorld {
    private final String name;
    private final int age;

    private String email;
}
```

```java
public class HelloWorld {
    private final String name;
    private final int age;
    private String email;

    private HelloWorld(String name, int age) {
        this.name = name;
        this.age = age;
    }

    public static HelloWorld of(String name, int age) {
        return new HelloWorld(name, age);
    }
}
```
