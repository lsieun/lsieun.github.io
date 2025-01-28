---
title: "Streams: reduce"
sequence: "101"
---

```java
public interface Stream<T> extends BaseStream<T, Stream<T>> {
    T reduce(T identity, BinaryOperator<T> accumulator);

    Optional<T> reduce(BinaryOperator<T> accumulator);

    <U> U reduce(U identity,
                 BiFunction<U, ? super T, U> accumulator,
                 BinaryOperator<U> combiner);
}
```

## reduce1

```text
T reduce(T identity, BinaryOperator<T> accumulator);
```

```text
T result = identity;
for (T element : this stream) {
    result = accumulator.apply(result, element);
}
return result;
```

## reduce2

```text
Optional<T> reduce(BinaryOperator<T> accumulator);
```

```text
boolean foundAny = false;
T result = null;
for (T element : this stream) {
    if (!foundAny) {
        foundAny = true;
        result = element;
    }
    else
        result = accumulator.apply(result, element);
}

return foundAny ? Optional.of(result) : Optional.empty();
```

## reduce3

```text
<U> U reduce(U identity,
             BiFunction<U, ? super T, U> accumulator,
             BinaryOperator<U> combiner);
```

```text
T result = identity;
for (T element : this stream) {
    result = accumulator.apply(result, element);
}
return result;
```

```text
combiner.apply(u, accumulator.apply(identity, t)) == accumulator.apply(u, t)
```

