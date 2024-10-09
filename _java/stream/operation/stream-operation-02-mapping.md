---
title: "Streams: Mapping"
sequence: "102"
---

A very common data processing idiom is to select information from certain objects.
For example, in SQL you can select a particular column from a table.
The Streams API provides similar facilities through the `map` and `flatMap` methods.

```java
public interface Stream<T> extends BaseStream<T, Stream<T>> {
    <R> Stream<R> map(Function<? super T, ? extends R> mapper);
    
    <R> Stream<R> flatMap(Function<? super T, ? extends Stream<? extends R>> mapper);
}
```

## Applying a function to each element of a stream

Streams support the method `map`, which takes a function as argument.
The function is applied to each element, mapping it into a new element
(the word **mapping** is used because it has a meaning similar to transforming
but with the nuance of "**creating a new version of**" rather than "**modifying**").

```java
import java.util.List;
import java.util.stream.Collectors;

public class HelloWorld {
    public static void main(String[] args) {
        List<Dish> menu = Dish.getMenu();
        List<String> list = menu.stream()
                .map(Dish::getName)
                .collect(Collectors.toList());
        list.forEach(System.out::println);
    }
}
```

```java
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

public class HelloWorld {
    public static void main(String[] args) {
        List<String> words = Arrays.asList("Java8", "Lambdas", "In", "Action");
        List<Integer> list = words.stream()
                .map(String::length)
                .collect(Collectors.toList());
        System.out.println(list);
    }
}
```

```java
import java.util.List;
import java.util.stream.Collectors;

public class HelloWorld {
    public static void main(String[] args) {
        List<Dish> menu = Dish.getMenu();
        List<Integer> dishNameLengths = menu.stream()
                .map(Dish::getName)
                .map(String::length)
                .collect(Collectors.toList());
        System.out.println(dishNameLengths);
    }
}
```

## Flattening streams

You saw how to return the length for each word in a list using the method `map`.
Let's extend this idea a bit further: how could you return a list of all the unique characters for a list of words?
For example, given the list of words `["Hello", "World"]`
you'd like to return the list `["H", "e", "l", "o", "W", "r", "d"]`.

```java
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

public class HelloWorld {
    public static void main(String[] args) {
        List<String> words = Arrays.asList("Hello", "World");
        List<String[]> list = words.stream()
                .map(word -> word.split(""))
                .distinct()
                .collect(Collectors.toList());
        list.forEach(item -> {
            String str = Arrays.toString(item);
            System.out.println(str);
        });
    }
}
```

```text
[H, e, l, l, o]
[W, o, r, l, d]
```

The problem with this approach is that the lambda passed to the `map` method returns a `String[]`
(an array of String) for each word.
So the stream returned by the map method is actually of type `Stream<String[]>`.
What you really want is `Stream<String>` to represent a stream of characters.

Luckily there's a solution to this problem using the method `flatMap`!
Let's see step by step how to solve it.

### Attempt using map and Arrays.stream

First, you need a stream of characters instead of a stream of arrays.
There's a method called `Arrays.stream()` that takes an array and produces a stream, for example:

```java
public class Arrays {
    public static <T> Stream<T> stream(T[] array) {
        return stream(array, 0, array.length);
    }

    public static <T> Stream<T> stream(T[] array, int startInclusive, int endExclusive) {
        return StreamSupport.stream(spliterator(array, startInclusive, endExclusive), false);
    }
}
```

```java
import java.util.Arrays;
import java.util.stream.Stream;

public class HelloWorld {
    public static void main(String[] args) {
        String[] arrayOfWords = {"Goodbye", "World"};
        Stream<String> streamOfWords = Arrays.stream(arrayOfWords);
        streamOfWords.forEach(System.out::println);
    }
}
```

```text
Goodbye
World
```

Use it in the previous pipeline to see what happens:

```java
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

public class HelloWorld {
    public static void main(String[] args) {
        List<String> words = Arrays.asList("Hello", "World");
        List<Stream<String>> list = words.stream()
                .map(word -> word.split(""))
                .map(Arrays::stream)
                .collect(Collectors.toList());
        list.forEach(item -> item.forEach(System.out::println));
    }
}
```

The current solution still doesn't work!
This is because you now end up with a list of streams
(more precisely, `Stream<Stream<String>>`)!
Indeed, you first convert each word into an array
of its individual letters and then make each array into a separate stream.

### Using flatMap

You can fix this problem by using `flatMap` as follows:

```java
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

public class HelloWorld {
    public static void main(String[] args) {
        List<String> words = Arrays.asList("Hello", "World");
        List<String> list = words.stream()
                .map(word -> word.split(""))
                .flatMap(Arrays::stream)
                .distinct()
                .collect(Collectors.toList());
        list.forEach(System.out::println);
    }
}
```

Using the `flatMap` method has the effect of mapping each array not with a stream but with the contents of that stream.
All the separate streams that were generated when using `map(Arrays::stream)` get amalgamated-flattened into a single stream.


Given two lists of numbers, how would you return all pairs of numbers?
For example, given a list `[1, 2, 3]` and a list `[3, 4]`
you should return `[(1, 3), (1, 4), (2, 3), (2, 4), (3, 3), (3, 4)]`.
For simplicity, you can represent a pair as an array with two elements.

```java
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

public class HelloWorld {
    public static void main(String[] args) {
        List<Integer> numbers1 = Arrays.asList(1, 2, 3);
        List<Integer> numbers2 = Arrays.asList(3, 4);
        List<int[]> pairs = numbers1.stream()
                .flatMap(
                        i -> numbers2.stream()
                                .map(j -> new int[]{i, j})
                )
                .collect(Collectors.toList());
        pairs.forEach(item -> {
            String str = Arrays.toString(item);
            System.out.println(str);
        });
    }
}
```

```text
[1, 3]
[1, 4]
[2, 3]
[2, 4]
[3, 3]
[3, 4]
```

How would you extend the previous example to return only pairs whose sum is divisible by 3?
For example, `(2, 4)` and `(3, 3)` are valid.

```java
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

public class HelloWorld {
    public static void main(String[] args) {
        List<Integer> numbers1 = Arrays.asList(1, 2, 3);
        List<Integer> numbers2 = Arrays.asList(3, 4);
        List<int[]> pairs = numbers1.stream()
                .flatMap(
                        i -> numbers2.stream()
                                .filter(j -> (i + j) % 3 == 0)
                                .map(j -> new int[]{i, j})
                )
                .collect(Collectors.toList());
        pairs.forEach(item -> {
            String str = Arrays.toString(item);
            System.out.println(str);
        });
    }
}
```

```text
[2, 4]
[3, 3]
```

