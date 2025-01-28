---
title: "typesafe enum pattern"
sequence: "102"
---


Luckily, the Java programming language presents an alternative
that avoids all the shortcomings of the common `int` and `String` patterns and provides many added benefits.
It is called the **typesafe enum pattern**.
Unfortunately, it is not yet widely known.(《Effective Java》 1st 是在 2001 年出版的 )

The basic idea is simple:
Define a class representing a single element of the enumerated type,
and don't provide any `public` constructors.
Instead, provide `public static final` fields,
one for each constant in the enumerated type.
Here's how the pattern looks in its simplest form:

```java
// The typesafe enum pattern
public class Suit { 
    private final String name; 
 
    private Suit(String name) { this.name = name; } 
 
    public String toString()  { return name; } 
 
    public static final Suit CLUBS    = new Suit("clubs"); 
    public static final Suit DIAMONDS = new Suit("diamonds"); 
    public static final Suit HEARTS   = new Suit("hearts"); 
    public static final Suit SPADES   = new Suit("spades"); 
}
```

Because there is no way for clients to create objects of the class or to extend it,
there will never be any objects of the type besides those exported via the `public static final` fields.
Even though the class is not declared `final`, there is no way to extend it:
Subclass constructors must invoke a superclass constructor, and no such constructor is accessible.

### compile-time type safety

As its name implies, the **typesafe enum pattern** provides **compile-time type safety**.
If you declare a method with a parameter of type `Suit`,
you are guaranteed that any non-null object reference passed in represents one of the four valid suits.
Any attempt to pass an incorrectly typed object will be caught at compile time,
as will any attempt to assign an expression of one enumerated type to a variable of another.
Multiple typesafe enum classes with identically named enumeration constants coexist peacefully
because each class has its own name space.

Constants may be added to a typesafe enum class without recompiling its clients
because the `public static` object reference fields containing the enumeration constants
provide a layer of insulation between the client and the enum class.
The constants themselves are never compiled into clients
as they are in the more common `int` pattern and its `String` variant.

### toString: printable strings

Because typesafe enums are full-fledged classes, you can override the `toString` method,
allowing values to be translated into **printable strings**.

You can, if you desire, go one step further and internationalize typesafe enums by standard means.

Note that string names are used only by the `toString` method;
they are not used for **equality comparisons**, as the `equals` implementation,
which is inherited from `Object`, performs a **reference identity comparison**.

### any method

More generally, you can augment a typesafe enum class with any method that seems appropriate.
Our `Suit` class, for example, might benefit from the addition of a method
that returns the color of the suit or one that returns an image representing the suit.
A class can start life as a simple typesafe enum and evolve over time into a full-featured abstraction.

### interface

Because arbitrary methods can be added to typesafe enum classes, they can be made to implement any interface.
For example, suppose that you want `Suit` to implement `Comparable` so clients can sort bridge hands by suit.
Here's a slight variant on the original pattern that accomplishes this feat.
A static variable, `nextOrdinal`, is used to assign an ordinal number to each instance as it is created.
These ordinals are used by the `compareTo` method to order instances:

```java
// Ordinal-based typesafe enum
public class Suit implements Comparable<Suit> {
    private final String name;

    // Ordinal of next suit to be created 
    private static int nextOrdinal = 0;

    // Assign an ordinal to this suit 
    private final int ordinal = nextOrdinal++;

    private Suit(String name) { this.name = name; }

    public String toString()  { return name; }

    @Override
    public int compareTo(Suit another) {
        return this.ordinal - another.ordinal;
    }
    
    
    public static final Suit CLUBS    = new Suit("clubs");
    public static final Suit DIAMONDS = new Suit("diamonds");
    public static final Suit HEARTS   = new Suit("hearts");
    public static final Suit SPADES   = new Suit("spades");
}
```

Because typesafe enum constants are objects, you can put them into collections.
For example, suppose you want the `Suit` class to export an immutable list of the suits in standard order.
Merely add these two field declarations to the class:

```text
private static final Suit[] PRIVATE_VALUES = { CLUBS, DIAMONDS, HEARTS, SPADES };
public static final List<Suit> VALUES = Collections.unmodifiableList(Arrays.asList(PRIVATE_VALUES));
```

```java
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

public class Suit implements Comparable<Suit> {
    private final String name;

    // Ordinal of next suit to be created
    private static int nextOrdinal = 0;

    // Assign an ordinal to this suit
    private final int ordinal = nextOrdinal++;

    private Suit(String name) { this.name = name; }

    public String toString()  { return name; }

    @Override
    public int compareTo(Suit another) {
        return this.ordinal - another.ordinal;
    }

    public static final Suit CLUBS    = new Suit("clubs");
    public static final Suit DIAMONDS = new Suit("diamonds");
    public static final Suit HEARTS   = new Suit("hearts");
    public static final Suit SPADES   = new Suit("spades");

    private static final Suit[] PRIVATE_VALUES = { CLUBS, DIAMONDS, HEARTS, SPADES };
    public static final List<Suit> VALUES = Collections.unmodifiableList(Arrays.asList(PRIVATE_VALUES));
}
```

## Serializable

Unlike the simplest form of the typesafe enum pattern,
classes of the ordinal-based form above can be made serializable with a little care.
It is not sufficient merely to add `implements Serializable` to the class declaration.
You must also provide a `readResolve` method:

```text
private Object readResolve() throws ObjectStreamException {
    return PRIVATE_VALUES[ordinal]; // Canonicalize 
}
```

```java
import java.io.ObjectStreamException;
import java.io.Serializable;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

public class Suit implements Comparable<Suit>, Serializable {
    private final String name;

    // Ordinal of next suit to be created
    private static int nextOrdinal = 0;

    // Assign an ordinal to this suit
    private final int ordinal = nextOrdinal++;

    private Suit(String name) { this.name = name; }

    public String toString()  { return name; }

    @Override
    public int compareTo(Suit another) {
        return this.ordinal - another.ordinal;
    }

    private Object readResolve() throws ObjectStreamException {
        return PRIVATE_VALUES[ordinal]; // Canonicalize
    }

    public static final Suit CLUBS    = new Suit("clubs");
    public static final Suit DIAMONDS = new Suit("diamonds");
    public static final Suit HEARTS   = new Suit("hearts");
    public static final Suit SPADES   = new Suit("spades");

    private static final Suit[] PRIVATE_VALUES = { CLUBS, DIAMONDS, HEARTS, SPADES };
    public static final List<Suit> VALUES = Collections.unmodifiableList(Arrays.asList(PRIVATE_VALUES));
}
```

This method, which is invoked automatically by the serialization system,
prevents duplicate constants from coexisting as a result of deserialization.
This maintains the guarantee that only a single object represents each enum constant,
avoiding the need to override `Object.equals`.
Without this guarantee, `Object.equals` would report a false negative
when presented with two equal but distinct enumeration constants.
Note that the `readResolve` method refers to the `PRIVATE_VALUES` array,
so you must declare this array even if you choose not to export `VALUES`.
Note also that the `name` field is not used by the `readResolve` method,
so it can and should be made `transient`.

The resulting class is **somewhat brittle**;
constructors for any new values must appear after those of all existing values,
to ensure that previously serialized instances do not change their value when they're deserialized.
This is so because the serialized form of an enumeration constant consists solely of its `ordinal`.
If the enumeration constant pertaining to an ordinal changes,
a serialized constant with that ordinal will take on the new value when it is deserialized.



