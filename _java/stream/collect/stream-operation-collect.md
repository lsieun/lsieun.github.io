---
title: "Streams: collect"
sequence: "102"
---

A well-designed functional API has a higher degree of composability and reusability.
`Collector`s are extremely useful because they provide a concise yet flexible way
to define the criteria that collect uses to produce the resulting collection.

More specifically, invoking the `collect` method on a stream triggers a **reduction operation**
(parameterized by a `Collector`) on the elements of the stream itself.

```java
public interface Stream<T> extends BaseStream<T, Stream<T>> {
    <R> R collect(Supplier<R> supplier,
                  BiConsumer<R, ? super T> accumulator,
                  BiConsumer<R, R> combiner);

    <R, A> R collect(Collector<? super T, A, R> collector);
}
```

## collect1

```text
<R> R collect(Supplier<R> supplier,
              BiConsumer<R, ? super T> accumulator,
              BiConsumer<R, R> combiner);
```

```text
R result = supplier.get();
for (T element : this stream)
    accumulator.accept(result, element);
return result;
```

```text
List<String> asList = stringStream.collect(ArrayList::new, ArrayList::add, ArrayList::addAll);
```

```text
String concat = stringStream.collect(
    StringBuilder::new,
    StringBuilder::append,
    StringBuilder::append
).toString();
```

## collect2

```text
<R, A> R collect(Collector<? super T, A, R> collector);
```

```text
List<String> asList = stringStream.collect(Collectors.toList());

Map<String, List<Person>> peopleByCity = personStream.collect(
    Collectors.groupingBy(Person::getCity)
);

Map<String, Map<String, List<Person>>> peopleByStateAndCity = personStream.collect(
    Collectors.groupingBy(
        Person::getState,
        Collectors.groupingBy(Person::getCity)
    )
);
```

## Collector

```java
public interface Collector<T, A, R> {
    Supplier<A> supplier();

    BiConsumer<A, T> accumulator();

    BinaryOperator<A> combiner();

    Function<A, R> finisher();

    Set<Characteristics> characteristics();
}
```

```java
public interface Collector<T, A, R> {
    enum Characteristics {
        CONCURRENT,
        UNORDERED,
        IDENTITY_FINISH
    }
}
```

```java
public interface Collector<T, A, R> {
    static<T, R> Collector<T, R, R> of(Supplier<R> supplier,
                                       BiConsumer<R, T> accumulator,
                                       BinaryOperator<R> combiner,
                                       Characteristics... characteristics) {
        // ...
    }

    static<T, A, R> Collector<T, A, R> of(Supplier<A> supplier,
                                          BiConsumer<A, T> accumulator,
                                          BinaryOperator<A> combiner,
                                          Function<A, R> finisher,
                                          Characteristics... characteristics) {
        // ...
    }
}
```

```text
A container = collector.supplier().get();
for (T t : data)
    collector.accumulator().accept(container, t);
return collector.finisher().apply(container);
```

```text
A a1 = supplier.get();
accumulator.accept(a1, t1);
accumulator.accept(a1, t2);
R r1 = finisher.apply(a1);  // result without splitting
```

```text
A a2 = supplier.get();
accumulator.accept(a2, t1);
A a3 = supplier.get();
accumulator.accept(a3, t2);
R r2 = finisher.apply(combiner.apply(a2, a3));  // result with splitting 
```

```text
Collector<Widget, ?, TreeSet<Widget>> intoSet = Collector.of(
    TreeSet::new,
    TreeSet::add,
    (left, right) -> {
        left.addAll(right);
        return left;
    }
);
```
