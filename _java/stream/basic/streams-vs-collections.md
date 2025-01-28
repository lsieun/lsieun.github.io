---
title: "Streams vs. Collections"
sequence: "103"
---

In coarsest terms, the difference between collections and streams has to do with **when things are computed**.

**A collection is an in-memory data structure** that holds all the values
the data structure currently has - every element in the collection has to be computed
before it can be added to the collection.
(You can add things to, and remove them from, the collection,
but at each moment in time, every element in the collection is stored in memory;
elements have to be computed before becoming part of the collection.)

By contrast, **a stream is a conceptually fixed data structure**
(you can't add or remove elements from it) whose elements are computed on demand.
This gives rise to significant programming benefits.
In chapter 6 we show how simple it is to construct a stream containing all the prime numbers (2,3,5,7,11,...)
even though there are an infinite number of them.
The idea is that a user will extract only the values they require from a stream,
and these elements are produced - invisibly to the user - only as and when required.
This is a form of a producer-consumer relationship.
Another view is that **a stream is like a lazily constructed collection**:
values are computed when they're solicited by a consumer
(in management speak this is **demand-driven**, or even just-in-time, manufacturing).

In contrast, a collection is eagerly constructed
(**supplier-driven**: fill your warehouse before you start selling, like a Christmas novelty that has a limited life).
Applying this to the primes example,
attempting to construct a collection of all prime numbers would result in a program loop
that forever computes a new prime, adding it to the collection,
but of course could never finish making the collection, so the consumer would never get to see it.

## Traversable only once

Note that, similarly to iterators, **a stream can be traversed only once**.
After that a stream is said to be consumed.
You can get a new stream from the initial data source to traverse it again just like for an iterator
(assuming it's a repeatable source like a collection; if it's an I/O channel, you're out of luck).

```java
import java.util.Arrays;
import java.util.List;
import java.util.stream.Stream;

public class HelloWorld {
    public static void main(String[] args) {
        List<String> strList = Arrays.asList("Hello", "World");
        Stream<String> s = strList.stream();
        s.forEach(System.out::println);
        // java.lang.IllegalStateException: stream has already been operated upon or closed
        s.forEach(System.out::println);
    }
}
```

Streams and collections philosophically

For readers who like philosophical viewpoints,
you can see **a stream as a set of values spread out in time**.
In contrast, **a collection is a set of values spread out in space (here, computer memory)**,
which all exist at a single point in time - and which you access using an iterator to access
members inside a for-each loop.

## External vs. internal iteration

Using the `Collection` interface requires iteration to be done by the user (for example, using for-each);
this is called **external iteration**.
The `Stream`s library by contrast uses **internal iteration** -
it does the iteration for you and takes care of storing the resulting stream value somewhere;
you merely provide a function saying what's to be done.


