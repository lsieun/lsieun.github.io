---
title: "Type Variance"
sequence: "106"
---

This is an example of a concept called **type variance**,
which is the general theory of how inheritance between **container types** relates to the inheritance of **their payload types**.

- **Type covariance**: This means that **the container types** have **the same relationship** to each other as **the payload types** do. This is expressed using the `extends` keyword.
- **Type contravariance**: This means that **the container types** have **the inverse relationship** to each other as **the payload types**. This is expressed using the `super` keyword.

These ideas tend to appear when discussing container types.
For example, if `Cat` extends `Pet`, then `List<Cat>` is a subtype of `List<? extends Pet>`, and so:

```text
List<Cat> cats = new ArrayList<Cat>();
List<? extends Pet> pets = cats;
```

However, this differs from the array case, because type safety is maintained in the following way:

```text
pets.add(new Cat()); // won't compile
pets.add(new Pet()); // won't compile
cats.add(new Cat());
```

The compiler cannot prove that the storage pointed at by `pets` is capable of storing a `Cat` and so it rejects the call to `add()`.
However, as `cats` definitely points at a list of `Cat` objects, then it must be acceptable to add a new one to the list.

As a result, it is very commonplace to see these types of generic constructions with types
that act as **producers** or **consumers** of payload types.

For example, when the `List` is acting as a producer of `Pet` objects, then the appropriate keyword is `extends`.

```text
Pet p = pets.get(0);
```

Note that for the producer case, **the payload type** appears as the return type of the producer method.

For **a container type** that is acting purely as a **consumer** of instances of a type, we would use the `super` keyword,
and we would expect to see **the payload type** as the type of a method argument.

This is codified in the **Producer Extends**, **Consumer Super** (`PECS`) principle coined by Joshua Bloch.


