---
title: "Numeric Streams"
sequence: "101"
---

Java 8 introduces three primitive specialized stream interfaces to tackle this issue,
`IntStream`, `DoubleStream`, and `LongStream`,
that respectively specialize the elements of a stream to be `int`, `long`, and `double` -
and thereby avoid hidden boxing costs.
Each of these interfaces brings new methods to perform common numeric reductions
such as `sum` to calculate the sum of a numeric stream and max to find the maximum element.
In addition, they have methods to convert back to a stream of objects when necessary.
The thing to remember is that these specializations aren't more complexity about streams
but instead more complexity caused by boxing - the (efficiency-based) difference between `int` and `Integer` and so on.

## Mapping to a numeric stream

The most common methods you'll use to convert a stream to a specialized version
are `mapToInt`, `mapToDouble`, and `mapToLong`.
These methods work exactly like the method `map` but return **a specialized stream** instead of a `Stream<T>`.

```java
public interface Stream<T> extends BaseStream<T, Stream<T>> {
    IntStream mapToInt(ToIntFunction<? super T> mapper);

    LongStream mapToLong(ToLongFunction<? super T> mapper);

    DoubleStream mapToDouble(ToDoubleFunction<? super T> mapper);
}
```

```java
import java.util.List;

public class HelloWorld {
    public static void main(String[] args) {
        List<Dish> menu = Dish.getMenu();
        int calories = menu.stream()
                .mapToInt(Dish::getCalories)
                .sum();
        System.out.println(calories);
    }
}
```

Note that if the stream were empty, `sum` would return `0` by default.

### mapToInt

```java
import java.util.List;

public class Main {
    public static void main(String[] args) {
        List<Shinobi> shinobiList = DataUtils.getShinobiList();

        int sum = shinobiList.stream()
                .mapToInt(Shinobi::getAge)
                .sum();
        System.out.println(sum);
    }
}
```

## Converting back to a stream of objects

Similarly, once you have a numeric stream, you may be interested in converting it back to a non-specialized stream.
For example, the operations of an `IntStream` are restricted to produce primitive integers:
the `map` operation of an `IntStream` takes a lambda that takes an `int` and produces an `int` (an `IntUnaryOperator`).

```java
public interface IntStream extends BaseStream<Integer, IntStream> {
    IntStream map(IntUnaryOperator mapper);
}
```

```java
@FunctionalInterface
public interface IntUnaryOperator {
    int applyAsInt(int operand);
}
```

To convert from **a primitive stream** to **a general stream** (each int will be boxed to an `Integer`)
you can use the method `boxed` as follows:

```text
IntStream intStream = menu.stream().mapToInt(Dish::getCalories);
Stream<Integer> stream = intStream.boxed();
```

```java
import java.util.List;
import java.util.stream.IntStream;
import java.util.stream.Stream;

public class HelloWorld {
    public static void main(String[] args) {
        List<Dish> menu = Dish.getMenu();
        IntStream intStream = menu.stream().mapToInt(Dish::getCalories);
        Stream<Integer> stream = intStream.boxed();
        stream.forEach(System.out::println);
    }
}
```

## Default values: OptionalInt

The sum example was convenient because it has a default value: `0`.
But if you want to calculate the maximum element in an `IntStream`,
you need something different because `0` is a wrong result.
**How can you differentiate that the stream has no element and that the real maximum is 0?**

Earlier we introduced the `Optional` class,
which is a container that indicates the presence or absence of a value.
`Optional` can be parameterized with reference types such as `Integer`, `String`, and so on.
There's a primitive specialized version of `Optional` as well for the three primitive stream specializations:
`OptionalInt`, `OptionalDouble`, and `OptionalLong`.

For example, you can find the maximal element of an `IntStream` by calling the `max` method,
which returns an `OptionalInt`:

```text
OptionalInt maxCalories = menu.stream()
        .mapToInt(Dish::getCalories)
        .max();
int max = maxCalories.orElse(1);
```

```java
import java.util.List;
import java.util.OptionalInt;

public class HelloWorld {
    public static void main(String[] args) {
        List<Dish> menu = Dish.getMenu();
        OptionalInt maxCalories = menu.stream()
                .mapToInt(Dish::getCalories)
                .max();
        int max = maxCalories.orElse(1);
        System.out.println(max);
    }
}
```

## Numeric ranges

A common use case when dealing with numbers is working with ranges of numeric values.
For example, suppose you'd like to generate all numbers between 1 and 100.

Java 8 introduces two static methods available on `IntStream` and `LongStream` to help generate such ranges:
`range` and `rangeClosed`.
Both methods take the starting value of the range as the first parameter and the
end value of the range as the second parameter.
But `range` is exclusive, whereas `rangeClosed` is inclusive.

```java
public interface IntStream extends BaseStream<Integer, IntStream> {
    public static IntStream range(int startInclusive, int endExclusive) {
        // ...
    }

    public static IntStream rangeClosed(int startInclusive, int endInclusive) {
        // ...
    }
}
```

```java
import java.util.Arrays;
import java.util.stream.IntStream;
import java.util.stream.Stream;

public class HelloWorld {
    public static void main(String[] args) {
        Stream<int[]> pythagoreanTriples = IntStream.rangeClosed(1, 100).boxed()
                .flatMap(
                        a -> IntStream.rangeClosed(a, 100)
                                .filter(b -> Math.sqrt(a * a + b * b) % 1 == 0)
                                .mapToObj(b -> new int[]{a, b, (int) (Math.sqrt(a * a + b * b))})
                );
        pythagoreanTriples.forEach(item -> {
            String str = Arrays.toString(item);
            System.out.println(str);
        });
    }
}
```

```text
[3, 4, 5]
[5, 12, 14]
[6, 8, 10]
...
```

The current solution isn't optimal because you calculate the square root twice.
One possible way to make your code more compact is to generate all triples of the form `(a*a, b*b, a*a+b*b)` and
then filter the ones that match your criteria:

```java
import java.util.Arrays;
import java.util.stream.IntStream;
import java.util.stream.Stream;

public class HelloWorld {
    public static void main(String[] args) {
        Stream<double[]> pythagoreanTriples = IntStream.rangeClosed(1, 100).boxed()
                .flatMap(
                        a -> IntStream.rangeClosed(a, 100)
                                .mapToObj(b -> new double[]{a, b, Math.sqrt(a * a + b * b)})
                                .filter(t -> t[2] % 1 == 0)

                );
        pythagoreanTriples.forEach(item -> {
            String str = Arrays.toString(item);
            System.out.println(str);
        });
    }
}
```

## BigDecimal

```text
BigDecimal volume = list.stream()
        .map(CustomerDataDaily::getVolume)
        .reduce(BigDecimal.ZERO, BigDecimal::add);
```
