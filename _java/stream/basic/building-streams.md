---
title: "Building streams"
sequence: "106"
---

This section shows how you can create a stream from **a sequence of values**, from **an array**, from **a file**,
and even from **a generative function** to create infinite streams!

## Streams from values

You can create a stream with explicit values by using the static method `Stream.of`,
which can take any number of parameters.

```java
import java.util.stream.Stream;

public class HelloWorld {
    public static void main(String[] args) {
        Stream<String> stream = Stream.of("Java 8", "Lambdas", "In", "Action");
        stream.map(String::toUpperCase).forEach(System.out::println);
    }
}
```

You can get an empty stream using the empty method as follows:

```text
Stream<String> emptyStream = Stream.empty();
```

## Streams from arrays

You can create a stream from an array using the static method `Arrays.stream`,
which takes an array as parameter.
For example, you can convert an array of primitive `int`s into an `IntStream` as follows:

```java
import java.util.Arrays;
import java.util.stream.IntStream;

public class HelloWorld {
    public static void main(String[] args) {
        int[] numbers = {2, 3, 5, 7, 11, 13};
        IntStream intStream = Arrays.stream(numbers);
        int sum = intStream.sum();
        System.out.println(sum);
    }
}
```

## Streams from collection

```java
public interface Collection<E> extends Iterable<E> {
    default Stream<E> stream() {
        return StreamSupport.stream(spliterator(), false);
    }

    default Stream<E> parallelStream() {
        return StreamSupport.stream(spliterator(), true);
    }
}
```

## Streams from files

Java's NIO API (non-blocking I/O), which is used for I/O operations such as processing a file,
has been updated to take advantage of the Streams API.
Many static methods in `java.nio.file.Files` return a stream.
For example, a useful method is `Files.lines`,
which returns a stream of lines as strings from a given file.
Using what you've learned so far,
you could use this method to find out the number of unique words in a file as follows:

```java
import java.io.IOException;
import java.nio.charset.Charset;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.Arrays;
import java.util.stream.Stream;

public class HelloWorld {
    public static void main(String[] args) {
        try (
                Stream<String> lines = Files.lines(Paths.get("data.txt"), Charset.defaultCharset())
        ) {
            long uniqueWords = lines.flatMap(
                            line -> Arrays.stream(line.split(" "))
                    )
                    .distinct()
                    .count();
            System.out.println(uniqueWords);

        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }
}
```

## Streams from functions: creating infinite streams!

The Streams API provides two static methods to generate a stream from a **function**:
`Stream.iterate` and `Stream.generate`.

```java
public interface Stream<T> extends BaseStream<T, Stream<T>> {
    public static<T> Stream<T> iterate(final T seed, final UnaryOperator<T> f) {
        // ...
    }

    public static<T> Stream<T> iterate(T seed, Predicate<? super T> hasNext, UnaryOperator<T> next) {
        // ...
    }

    public static<T> Stream<T> generate(Supplier<? extends T> s) {
        // ...
    }
}
```

These two operations let you create what we call an infinite stream:
a stream that doesn't have a fixed size like when you create a stream from a fixed collection.
Streams produced by iterate and generate create values on demand given a function
and can therefore calculate values forever!
It's generally sensible to use `limit(n)` on such streams to avoid printing an infinite number of values.

### Iterate

```java
import java.util.stream.Stream;

public class HelloWorld {
    public static void main(String[] args) {
        Stream.iterate(0, n -> n + 2)
                .limit(10)
                .forEach(System.out::println);
    }
}
```

This `iterate` operation is fundamentally **sequential** because the result depends on the previous application.
Note that this operation produces an infinite stream -
the stream doesn't have an end because values are computed on demand and can be computed forever.
We say **the stream is unbounded**.
As we discussed earlier, **this is a key difference between a stream and a collection.**
You're using the `limit` method to explicitly limit the size of the stream.

```java
import java.util.stream.Stream;

public class HelloWorld {
    public static void main(String[] args) {
        Stream.iterate(new int[]{0, 1}, t -> new int[]{t[1], t[0] + t[1]})
                .limit(10)
                .forEach(t -> System.out.println("(" + t[0] + "," + t[1] + ")"));
    }
}
```

```java
import java.util.stream.Stream;

public class HelloWorld {
    public static void main(String[] args) {
        Stream.iterate(new int[]{0, 1}, t -> new int[]{t[1], t[0] + t[1]})
                .limit(10)
                .map(t -> t[0])
                .forEach(System.out::println);
    }
}
```

```text
0
1
1
2
3
5
8
13
21
34
```

### Generate

Similarly to the method `iterate`,
the method `generate` lets you produce an infinite stream of values computed on demand.
But `generate` doesn't apply successively a function on each new produced value.
It takes a lambda of type `Supplier<T>` to provide new values.

```java
import java.util.stream.Stream;

public class HelloWorld {
    public static void main(String[] args) {
        Stream.generate(Math::random)
                .limit(5)
                .forEach(System.out::println);
    }
}
```

```java
import java.util.function.IntSupplier;
import java.util.stream.IntStream;

public class HelloWorld {
    public static void main(String[] args) {
        IntSupplier fib = new IntSupplier() {
            private int previous = 0;
            private int current = 1;

            @Override
            public int getAsInt() {
                int oldPrevious = this.previous;
                int nextValue = this.previous + this.current;
                this.previous = this.current;
                this.current = nextValue;
                return oldPrevious;
            }
        };

        IntStream.generate(fib)
                .limit(10)
                .forEach(System.out::println);
    }
}
```

```text
0
1
1
2
3
5
8
13
21
34
```
