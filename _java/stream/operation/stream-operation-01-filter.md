---
title: "Streams: Filtering and slicing"
sequence: "101"
---

In this section, we look at how to select elements of a stream:

- filtering with a predicate,
- filtering only unique elements,
- ignoring the first few elements of a stream, or
- truncating a stream to a given size.

## Filtering with a predicate: filter

The `Stream` interface supports a `filter` method.
This operation takes as argument a predicate (a function returning a boolean) and
returns a stream including all elements that match the predicate.

```java
public interface Stream<T> extends BaseStream<T, Stream<T>> {
    Stream<T> filter(Predicate<? super T> predicate);
}
```

```java
import java.util.List;
import java.util.stream.Collectors;

public class HelloWorld {
    public static void main(String[] args) {
        List<Dish> menu = Dish.getMenu();
        List<Dish> vegetarianMenu = menu.stream()
                .filter(Dish::isVegetarian)
                .collect(Collectors.toList());
        vegetarianMenu.forEach(System.out::println);
    }
}
```

## Filtering unique elements: distinct

Streams also support a method called `distinct` that returns a stream with unique elements
(according to the implementation of the `hashCode` and `equals` methods of the objects produced by the stream).

```java
import java.util.Arrays;
import java.util.List;

public class HelloWorld {
    public static void main(String[] args) {
        List<Integer> numbers = Arrays.asList(1, 2, 1, 3, 3, 2, 4);
        numbers.stream()
                .filter(i -> i % 2 == 0)
                .distinct()
                .forEach(System.out::println);
    }
}
```

## Truncating a stream: limit

Streams support the `limit(n)` method, which returns another stream that's no longer than a given size.
The requested size is passed as argument to `limit`.

- If the stream is **ordered**, the first elements are returned up to a maximum of `n`.
- Note that limit also works on **unordered streams** (for example, if the source is a `Set`).
  In this case you shouldn't assume any order on the result produced by `limit`.

```java
import java.util.List;
import java.util.stream.Collectors;

public class HelloWorld {
    public static void main(String[] args) {
        List<Dish> menu = Dish.getMenu();
        List<Dish> list = menu.stream()
                .filter(d -> d.getCalories() > 300)
                .limit(3)
                .collect(Collectors.toList());
        list.forEach(System.out::println);
    }
}
```

## Skipping elements: skip

Streams support the `skip(n)` method to return a stream that discards the first `n` elements.
If the stream has fewer elements than `n`, then an empty stream is returned.

Note that `limit(n)` and `skip(n)` are complementary!

```java
import java.util.List;
import java.util.stream.Collectors;

public class HelloWorld {
    public static void main(String[] args) {
        List<Dish> menu = Dish.getMenu();
        List<Dish> list = menu.stream()
                .filter(d -> d.getCalories() > 300)
                .skip(2)
                .collect(Collectors.toList());
        list.forEach(System.out::println);
    }
}
```

