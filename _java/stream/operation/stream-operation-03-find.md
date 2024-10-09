---
title: "Streams: Finding and matching"
sequence: "103"
---

Another common data processing idiom is finding whether some elements in a set of data match a given property.
The Streams API provides such facilities
through the `allMatch`, `anyMatch`, `noneMatch`, `findFirst`, and `findAny` methods of a stream.

## Checking to see if a predicate matches at least one element

The `anyMatch` method can be used to answer
the question "Is there an element in the stream matching the given predicate?"

```java
import java.util.List;

public class HelloWorld {
    public static void main(String[] args) {
        List<Dish> menu = Dish.getMenu();
        if (menu.stream().anyMatch(Dish::isVegetarian)) {
            System.out.println("The menu is (somewhat) vegetarian friendly!!");
        }
    }
}
```

The `anyMatch` method returns a `boolean` and is therefore a terminal operation.

## Checking to see if a predicate matches all elements

### allMatch

The `allMatch` method works similarly to `anyMatch`
but will check to see if all the elements of the stream match the given predicate.

```java
import java.util.List;

public class HelloWorld {
    public static void main(String[] args) {
        List<Dish> menu = Dish.getMenu();
        boolean isHealthy = menu.stream()
                .allMatch(d -> d.getCalories() < 1000);
        System.out.println(isHealthy);
    }
}
```

### noneMatch

The opposite of `allMatch` is `noneMatch`.
It ensures that no elements in the stream match the given predicate.

```java
import java.util.List;

public class HelloWorld {
    public static void main(String[] args) {
        List<Dish> menu = Dish.getMenu();
        boolean isHealthy = menu.stream()
                .noneMatch(d -> d.getCalories() >= 1000);
        System.out.println(isHealthy);
    }
}
```

## Short-circuiting evaluation

These three operations, `anyMatch`, `allMatch`, and `noneMatch`, make use of **short-circuiting**,
a stream version of the familiar Java short-circuiting `&&` and `||` operators.

Some operations don't need to process the whole stream to produce a result.
For example, say you need to evaluate a large boolean expression chained with and operators.
You need only find out that one expression is `false` to deduce that the whole expression will return `false`,
no matter how long the expression is; there's no need to evaluate the entire expression.
This is what **short-circuiting** refers to.

In relation to streams, certain operations such as `allMatch`, `noneMatch`, `findFirst`, and `findAny`
don't need to process the whole stream to produce a result.
As soon as an element is found, a result can be produced.

Similarly, `limit` is also a short-circuiting operation:
the operation only needs to create a stream of a given size without processing all the elements in the stream.
Such operations are useful, for example, when you need to deal with streams of infinite size,
because they can turn an infinite stream into a stream of finite size.

## Finding an element

The `findAny` method returns an arbitrary element of the current stream.
It can be used in conjunction with other stream operations.

```java
import java.util.List;
import java.util.Optional;

public class HelloWorld {
    public static void main(String[] args) {
        List<Dish> menu = Dish.getMenu();
        Optional<Dish> dish = menu.stream()
                .filter(Dish::isVegetarian)
                .findAny();
        dish.ifPresent(d -> System.out.println(d.getName()));
    }
}
```

The stream pipeline will be optimized behind the scenes to perform a single pass and finish
as soon as a result is found by using **short-circuiting**.

## Finding the first element

Some streams have an encounter order that specifies the order in which items logically appear
in the stream (for example, a stream generated from a List or from a sorted sequence of data).
For such streams you may wish to find the first element.
There's the `findFirst` method for this, which works similarly to `findAny`.

```java
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

public class HelloWorld {
    public static void main(String[] args) {
        List<Integer> someNumbers = Arrays.asList(1, 2, 3, 4, 5);
        Optional<Integer> first = someNumbers.stream()
                .map(x -> x * x)
                .filter(x -> x % 3 == 0)
                .findFirst();
        first.ifPresent(System.out::println);
    }
}
```

## When to use findFirst and findAny

You may wonder why we have both findFirst and findAny. The answer is **parallelism**.
**Finding the first element is more constraining in parallel.**
If you don't care about which element is returned,
**use `findAny` because it's less constraining when using parallel streams.**

