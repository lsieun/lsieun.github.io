---
title: "Method Reference"
sequence: "104"
---

```text
                                        ┌─── static ───────┼─── Static Method Reference
                    ┌─── method ────────┤
                    │                   │                  ┌─── Free Instance Method Reference
Method Reference ───┤                   └─── non-static ───┤
                    │                                      └─── Bound Instance Method Reference
                    │
                    └─── constructor ───┼─── Constructor Method Reference
```

## static method

```text
Integer::parseInt
```

## instance method

A method reference to **an instance method of an arbitrary type**:

```text
String::length
```

A method reference to **an instance method of an existing object**:

```text
expensiveTransaction::getValue
```

## constructor

### 无参构造方法

```text
// 第一种：lambda expression
Supplier<Apple> c1 = () -> new Apple();

// 第二种：Constructor references
Supplier<Apple> c1 = Apple::new;

Apple a1 = c1.get();
```

### 一个参数

If you have a constructor with signature Apple(Integer weight), it fits the signature of the Function interface, so you can do this,

```text
// 第一种：lambda expression
Function<Integer, Apple> c1 = (weight) -> new Apple(weight);

// 第二种：Constructor references
Function<Integer, Apple> c2 = Apple::new;

Apple a2 = c2.apply(110);
```

### 二个参数

If you have a two-argument constructor, Apple(String color, Integer weight), it fits the signature of the BiFunction interface, so you can do this:

```text
// 第一种：lambda expression
BiFunction<String, Integer, Apple> c3 = (color, weight) -> new Apple(color, weight);

// 第二种：Constructor references
BiFunction<String, Integer, Apple> c3 = Apple::new;
Apple a3 = c3.apply("green", 110);
```

## 数组

### 一维数组

It's also possible to create arrays using this method. Here is how you would create a String array: `String[]::new`.

```text
import java.util.Arrays;
import java.util.function.Function;

public class HelloWorld {
    public static void main(String[] args) {
        Function<Integer, String[]> func = String[]::new;
        String[] array = func.apply(3);
        System.out.println(Arrays.toString(array));
    }
}
```

### 二维数组

TODO: 为什么这样写是错误的呢？


错误写法：

```java
import java.util.function.BiFunction;

public class HelloWorld {
    public static void main(String[] args) {
        // 编译错误
        BiFunction<Integer, Integer, String[][]> func = String[][]::new;
        String[][] matrix = func.apply(3, 4);
        System.out.println(matrix);
    }
}
```

正确写法：

```java
import java.util.function.Function;

public class HelloWorld {
    public static void main(String[] args) {
        Function<Integer, String[]> func1 = String[]::new;
        Function<Integer, String[][]> func2 = String[][]::new;
        String[][] matrix = func2.apply(3);
        matrix[0] = func1.apply(4);
        matrix[1] = func1.apply(5);
        matrix[2] = func1.apply(6);

        for (int i = 0; i < 3; i++) {
            String[] array = matrix[i];
            int length = array.length;
            System.out.println(length);
        }
    }
}
```
