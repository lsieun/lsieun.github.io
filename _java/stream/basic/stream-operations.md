---
title: "Stream Operations"
sequence: "104"
---

The `Stream` interface in `java.util.stream.Stream` defines many operations.
They can be classified into two categories.

```java
import java.util.List;
import java.util.stream.Collectors;

public class HelloWorld {
    public static void main(String[] args) {
        List<Dish> menu = Dish.getMenu();
        List<String> threeHighCaloricDishNames = menu.stream()
                .filter(d -> d.getCalories() > 300)
                .map(Dish::getName)
                .limit(3)
                .collect(Collectors.toList());
        System.out.println(threeHighCaloricDishNames);
    }
}
```

You can see two groups of operations:

- `filter`, `map`, and `limit` can be connected together to form a pipeline.
- `collect` causes the pipeline to be executed and closes it.

**Stream operations** that can be connected are called **intermediate operations**,
and operations that close a stream are called **terminal operations**.

## Intermediate operations

**Intermediate operations** such as filter or sorted return another stream as the return type.
This allows the operations to be connected to form a query.
**What's important is that intermediate operations don't perform any processing
until a terminal operation is invoked on the stream pipeline—they're lazy.**
This is because intermediate operations can usually be merged and
processed into a single pass by the terminal operation.

```java
import java.util.List;
import java.util.stream.Collectors;

public class HelloWorld {
    public static void main(String[] args) {
        List<Dish> menu = Dish.getMenu();
        List<String> names = menu.stream()
                .filter(d -> {
                    System.out.println("filtering " + d.getName());
                    return d.getCalories() > 300;
                })
                .map(d -> {
                    System.out.println("mapping " + d.getName());
                    return d.getName();
                })
                .limit(3)
                .collect(Collectors.toList());
        System.out.println(names);
    }
}
```

```text
filtering pork
mapping pork
filtering beef
mapping beef
filtering chicken
mapping chicken
[pork, beef, chicken]
```

## Terminal operations

Terminal operations produce a result from a stream pipeline.
A result is any non-stream value such as a `List`, an `Integer`, or even `void`.

