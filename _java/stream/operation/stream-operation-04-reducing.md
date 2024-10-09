---
title: "Streams: Reducing"
sequence: "104"
---

So far, the terminal operations you've seen return a `boolean` (`allMatch` and so on),
`void` (`forEach`), or an `Optional` object (`findAny` and so on).
You've also been using `collect` to combine all elements in a stream into a List.

In this section, you'll see how you can combine elements of a stream to express more complicated queries
such as "Calculate the sum of all calories in the menu," or
"What is the highest calorie dish in the menu?" using the `reduce` operation.
Such queries combine all the elements in the stream repeatedly to produce a single value such as an `Integer`.
These queries can be classified as **reduction operations** (**a stream is reduced to a value**).
In functional programming-language jargon, this is referred to as a **fold**
because you can view this operation
as repeatedly folding a long piece of paper (your stream) until it forms a small square,
which is the result of the fold operation.


```java

```

## Summing the elements

Before we investigate how to use the `reduce` method,
it helps to first see how you'd sum the elements of a list of numbers using a for-each loop:

```java
import java.util.Arrays;
import java.util.List;

public class HelloWorld {
    public static void main(String[] args) {
        List<Integer> numbers = Arrays.asList(1, 2, 3, 4, 5);
        int sum = 0;
        for (int x : numbers) {
            sum += x;
        }
        System.out.println(sum);
    }
}
```

Each element of numbers is combined iteratively with the addition operator to form a result.
You reduce the list of numbers into one number by repeatedly using addition.

There are two parameters in this code:

- **The initial value** of the sum variable, in this case 0
- **The operation** to combine all the elements of the list, in this case +

Wouldn't it be great if you could also multiply all the numbers
without having to repeatedly copy and paste this code?
This is where the `reduce` operation, which abstracts over this pattern of repeated application, can help.
You can sum all the elements of a stream as follows:

```java
import java.util.Arrays;
import java.util.List;

public class HelloWorld {
    public static void main(String[] args) {
        List<Integer> numbers = Arrays.asList(1, 2, 3, 4, 5);
        Integer sum = numbers.stream()
                .reduce(0, (a, b) -> a + b);
        System.out.println(sum);
    }
}
```

```text
int sum = numbers.stream().reduce(0, (a, b) -> a + b);
```

reduce takes two arguments:

- **An initial value**, here 0.
- A `BinaryOperator<T>` to combine two elements and produce a new value; here you use the lambda `(a, b) -> a + b`.

```java
public interface Stream<T> extends BaseStream<T, Stream<T>> {
    T reduce(T identity, BinaryOperator<T> accumulator);

    Optional<T> reduce(BinaryOperator<T> accumulator);

    <U> U reduce(U identity,
                 BiFunction<U, ? super T, U> accumulator,
                 BinaryOperator<U> combiner);
}
```

You could just as easily multiply all the elements by passing a different lambda, `(a, b) -> a * b`,
to the `reduce` operation:

```text
int product = numbers.stream().reduce(1, (a, b) -> a * b);
```

You can make this code more concise by using a **method reference**.
In Java 8 the `Integer` class now comes with a static `sum` method to add two numbers,
which is just what you want instead
of repeatedly writing out the same code as lambda:

```text
int sum = numbers.stream().reduce(0, Integer::sum);
```

### No initial value

There's also an overloaded variant of reduce that doesn't take an initial value,
but it returns an `Optional` object:

```text
Optional<Integer> sum = numbers.stream().reduce((a, b) -> (a + b));
```

Why does it return an `Optional<Integer>`?
Consider the case when the stream contains no elements.
The `reduce` operation can't return a sum because it doesn't have an initial value.
This is why the result is wrapped in an `Optional` object to indicate that the `sum` may be absent.

## Maximum and minimum

It turns out that reduction is all you need to compute maxima and minima as well!
Let's see how you can apply what you just learned about `reduce`
to calculate the maximum or minimum element in a stream.

As you saw, `reduce` takes two parameters:

- An initial value
- A lambda to combine two stream elements and produce a new value

```java
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

public class HelloWorld {
    public static void main(String[] args) {
        List<Integer> numbers = Arrays.asList(4, 5, 3, 9);
        Optional<Integer> sum = numbers.stream().reduce(Integer::max);
        System.out.println(sum.get());
    }
}
```

To calculate the minimum, you need to pass `Integer.min` to the reduce operation instead of `Integer.max`:

```text
Optional<Integer> min = numbers.stream().reduce(Integer::min);
```

You could have equally well-used the lambda `(x,y)->x<y?x:y` instead of `Integer::min`,
but the latter is easier to read.

## count

How would you count the number of dishes in a stream using the `map` and `reduce` methods?

```text
int count = menu.stream()
                .map(d -> 1)
                .reduce(0, (a, b) -> a + b);
```

A chain of `map` and `reduce` is commonly known as the **map-reduce pattern**,
made famous by Google's use of it for web searching because it can be easily parallelized.

Note that we can use the built-in method `count` to count the number of elements in the stream:

```text
long count = menu.stream().count();
```

## Benefit of the reduce method and parallelism

The benefit of using `reduce` compared to the step-by-step iteration summation that you wrote earlier
is that the iteration is abstracted using internal iteration,
which enables the internal implementation to choose to perform the reduce operation in parallel.
The iterative summation example involves shared updates to a sum variable, which doesn't parallelize gracefully.
If you add in the needed synchronization, you'll likely discover that
thread contention robs you of all the performance that parallelism was supposed to give you!
Parallelizing this computation requires a different approach:
partition the input, sum the partitions, and combine the sums.
But now the code is starting to look really different.
You'll see what this looks like in chapter 7 using **the fork/join framework**.
But for now it's important to realize that **the mutable accumulator pattern is a dead end for parallelization.**
You need a new pattern, and this is what reduce provides you.
You'll also see in chapter 7 that to sum all the elements in parallel using streams,
there's almost no modification to your code: `stream()` becomes `parallelStream()`:

```text
int sum = numbers.parallelStream().reduce(0, Integer::sum);
```

But there's a price to pay to execute this code in parallel, as we explain later:
**the lambda passed to reduce can't change state** (for example, instance variables),
and the operation needs to be associative, so it can be executed in any order.

So far you saw reduction examples that produced an `Integer`:
the sum of a stream, the maximum of a stream, or the number of elements in a stream.
You'll see in section 5.6 that built-in methods such as `sum` and `max` are available
as well to help you write slightly more concise code for common reduction patterns.
We investigate a more complex form of reductions using the `collect` method in the next chapter.
For example, instead of reducing a stream into an Integer,
you can also reduce it into a `Map` if you want to group dishes by types.

## Stream operations: stateless vs. stateful

Operations like `map` and `filter`
take each element from the input stream and
produce zero or one result in the output stream.
These operations are thus in general **stateless**:
**they don't have an internal state**
(assuming the user-supplied lambda or method reference has no internal mutable state).

But operations like `reduce`, `sum`, and `max` need to have internal state to accumulate the result.
In this case **the internal state is small.**
The internal state is of bounded size no matter how many elements are in the stream being processed.

By contrast, some operations such as `sorted` or `distinct` seem at first
to behave like `filter` or `map` - all take a stream and produce another stream (an intermediate operation),
but there's a crucial difference.
Both sorting and removing duplicates from a stream require knowing the previous history to do their job.
For example, sorting requires all the elements to be buffered
before a single item can be added to the output stream;
**the storage requirement of the operation is unbounded.**
**This can be problematic if the data stream is large or infinite.**
(What should reversing the stream of all prime numbers do?
It should return the largest prime number, which mathematics tells us doesn't exist.)
We call these operations **stateful operations**.
