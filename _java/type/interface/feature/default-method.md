---
title: "Default Method"
sequence: "103"
---


## default methods

In previous, we have emphasized on the fact that interfaces in Java can only declare methods but are not allowed to provide their implementations.

> Java 8 以前的情况

With **default methods**, it is not true anymore: an interface can mark a method with the `default` keyword and provide the implementation for it. For example:

```java
package lsieun.advanced.design;

public interface InterfaceWithDefaultMethods {
    void performAction();

    default void performDefaultAction() {
        // Implementation here
    }
}
```

Being **an instance level**, defaults methods could be overridden by each interface implementer.

## JDK

Another **default method** that has been added is the `forEach` method on `Iterable`,
which provides similar functionality to the **for loop** but lets you use a lambda expression as the body of the loop.

```java
public interface Iterable<T> {
    default void forEach(Consumer<? super T> action) {
        for (T t : this) {
            action.accept(t);
        }
    }
}
```

## override Object's methods?

[Allow default methods to override Object's methods](http://mail.openjdk.java.net/pipermail/lambda-dev/2013-March/008435.html)

> However a couple of times I have wanted to override Object's methods, i.e.
> toString, equals, and hashCode. For example in a toy stream library I am
> playing with:
>
> ...
>
> Do you think the above is a genuine example or an outlying case?

The topic of whether default methods should be allowed to override
`Object` methods was one that was discussed extensively in the EG.  While
I can definitely sympathize with the desire for things to work this way,
really what this boils down to is "I want default methods to be more
like traits than they are."  And again, I can sympathize with that --
traits are useful.  (If we were designing Java from scratch today, we
would have certainly come to something different than the current JDK 8
design -- historical constraints do matter.)  But I believe the outcome,
if we went this way, would be worse.

When evaluating a **language feature**, you need to examine both **the cost** and **the benefit** side of the proposal.

**Benefit**: how would having this feature enable **me** to write code that is better than what I can write today.

**Cost**: how would having this feature enable **other people** to write WORSE code than they might write today.

Most people, when proposing a language feature, focus exclusively on the
former, but in reality, the second is often more important.  As an
example, take as a proposed language feature "allow direct access to raw
object pointers."  Clever people can come up with endless examples of
what they could do with raw pointers, whether to improve performance or
to simplify the writing of frameworks and libraries.  But, it should be
obvious that allowing raw access to pointers would also do a tremendous
amount of damage; programs would be less reliable, less secure, and for
most programs (those not written by performance experts) less performant
(because giving users access to raw pointers cripples many optimizations
the VM could otherwise make.)


So, with that preamble, why did we decide to do it the way we did?

### Secondary scope

1.  **Secondary scope**.  The key goal of adding default methods to Java was
    "interface evolution", not "poor man's traits."  It is a significant
    dividend that they enabled many forms of trait-like behavior, and we
    were careful to support this where the costs were within bounds, but
    this proposed behavior was certainly not at all within the scope of
    "interface evolution."  So it is strictly a "nice to have" if we can get
    it cheaply enough, not a goal.

### complexity

2.  **Adds complexity**.  Supporting this behavior had the cost of making
    the **inheritance model** more complicated.  This is definitely a negative;
    there is already a lot of fear that "multiple inheritance" (as if Java
    didn't already have multiple inheritance (of types) from day 1) will
    make Java a lot more complicated.  A great deal of effort went into
    coming up with the simplest possible rules for how implementation
    inheritance will work, which are:

**Rule #1**: **Classes win over interfaces**.  If a class in the superclass
chain has a declaration for the method (concrete or abstract), you're
done, and defaults are irrelevant.

**Rule #2**: **More specific interfaces win over less specific ones** (where
specificity means "subtyping").  A default from `List` wins over a default
from `Collection`, regardless of where or how or how many times `List` and
`Collection` enter the inheritance graph.

**Rule #3**: There's no Rule #3.  **If there is not a unique winner according
to the above rules, concrete classes must disambiguate manually.**

Allowing defaults to override `Object` methods would interfere with the
simplicity of "Class wins".  And the obvious adjustments ("Class wins
except `Object`") run into subtle complexities when you follow them
through, which require further adjustments, the result being that this
adds complexity to the inheritance model.  This did not seem like the
best way to spend our limited complexity budget.

### makes sense in toy examples

3.  **Really only makes sense in toy examples**.  When designing default
    methods, I talked to a number of folks like yourself who asked for this
    feature.  And I asked them to give me an example.  Invariably, the
    example was a type like `List`.  And invariably, after some digging, it
    would become clear that this feature only makes sense in situations
    where the type in question was exclusively single-inherited.  Giving
    people a feature that is essentially multiple inheritance of behavior,
    but which breaks if you actually *use* multiple inheritance, does not
    seem smart.

At root, the methods from `Object` -- such as `toString`, `equals`, and
`hashCode` -- are all about the object's *state*.  But interfaces do not
have state; classes have state.  These methods belong with the code that
owns the object's state -- the class.

Further, it is even harder to ensure compliance with the contracts of
`equals` and `hashCode` when they are provided in an interface.  The common
`equals`/`hashCode` pitfalls outlined in Effective Java become even more
likely to bite you if you try to do this -- as if this wasn't already
hard enough.

### brittle

4.  **It's brittle**.  Methods like `equals` are really fundamental; you don't
    want a classes `equals()` behavior changing out from under you when a
    library is rev'ed and someone adds an `equals()` implementation to some
    interface that you indirectly inherit from nine levels away.  But this
    is exactly what would happen if someone added an `equals()` method to an
    existing interface, if its subtypes didn't provide their own `equals()`.

The decision about `equals`/`hashCode` behavior is so fundamental that it
should belong to the writer of the class, at the time the class is first
written, and changes to the supertype hierarchy should not change that
decision.  If defaults were inherited in this way, it would totally push
us in the wrong direction here.


So, bottom line -- this seems like an "obvious" feature at first, but
when you start digging, the result is that it makes the language more
complicated, invites lots of new corner cases, and doesn't really work
all that well outside of the "obvious" examples.
