---
title: "Type Erasure: Signature"
sequence: "117"
---

## 1. T

```java
public class HelloWorld<T> {
}
```

```txt
<T:Ljava/lang/Object;>Ljava/lang/Object;
```

## 2. T extends Number

注意：extends 之后是“类名”

```java
public class HelloWorld<T extends Number> {
}
```

```txt
<T:Ljava/lang/Number;>Ljava/lang/Object;
```

## 3. T extends Runnable

注意：extends 之后是“接口名”

```java
public class HelloWorld<T extends Runnable> {
}
```

```txt
<T::Ljava/io/Serializable;>Ljava/lang/Object;
```

注意：这里使用了 `T::`，是因为 `T:类名:接口名 `，而“类名”省略了，因此多了一个 `:`。

## 4. T super Number

尽管我很愿意写这样一个示例，但实际上却不能通过编译。

```text
public class HelloWorld <T super Number> {
}
```

## 5. More

```java
public class HelloWorld<T extends Number & Runnable> {
}
```

```txt
<T:Ljava/lang/Number;:Ljava/lang/Runnable;>Ljava/lang/Object;
```

```java
import java.io.Serializable;

public class HelloWorld<T extends Serializable & Runnable> {
}
```

```txt
<T::Ljava/io/Serializable;:Ljava/lang/Runnable;>Ljava/lang/Object;
```

注意：这里使用了 `T::`，是因为 `T:类名:接口名 `，而“类名”省略了，因此多了一个 `:`。
