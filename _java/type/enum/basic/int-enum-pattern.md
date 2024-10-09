---
title: "int enum pattern"
sequence: "101"
---


Before enum types were added to the language,
a common pattern for representing enumerated types was to declare a group of named `int` constants,
one for each member of the type:

```text
// The int enum pattern - severely deficient!
public static final int APPLE_FUJI         = 0;
public static final int APPLE_PIPPIN       = 1;
public static final int APPLE_GRANNY_SMITH = 2;

public static final int ORANGE_NAVEL  = 0;
public static final int ORANGE_TEMPLE = 1;
public static final int ORANGE_BLOOD  = 2;
```

This technique, known as the **int enum pattern**, has many shortcomings.

## Short Comings

### no type safety

It provides nothing in the way of type safety and little in the way of expressive power.
The compiler won't complain if you pass an apple to a method that expects an orange,
compare apples to oranges with the `==` operator, or worse:

```text
// Tasty citrus flavored apple sauce!
int i = (APPLE_FUJI - ORANGE_TEMPLE) / APPLE_PIPPIN;
```

### brittle

Programs that use `int` enums are brittle.
Because `int` enums are constant variables,
their `int` values are compiled into the clients that use them.
If the value associated with an `int` enum is changed,
its clients must be recompiled.
If not, the clients will still run, but their behavior will be incorrect.

### no printable

There is no easy way to translate `int` enum constants into printable strings.
If you print such a constant or display it from a debugger,
all you see is a number, which isn't very helpful.

### no iterate and size

There is no reliable way to iterate over all the `int` enum constants in a group,
or even to obtain the size of an int enum group.

## String enum pattern

You may encounter a variant of this pattern in which `String` constants are used in place of `int` constants.
This variant, known as the **String enum pattern**, is even less desirable.
While it does provide _printable strings_ for its constants,
it can lead naive users to hard-code string constants into client code instead of using field names.
If such a hard-coded string constant contains a typographical error,
it will escape detection at compile time and result in bugs at runtime.
Also, it might lead to performance problems, because it relies on string comparisons.

## Java enum type

Luckily, Java provides an alternative
that avoids all the shortcomings of the `int` and `string` enum patterns and provides many added benefits.
It is the **enum type**. Here's how it looks in its simplest form:

```java
public enum Apple { FUJI, PIPPIN, GRANNY_SMITH }
public enum Orange { NAVEL, TEMPLE, BLOOD }
```


## JDK

### Pattern

`java.util.regex.Pattern`

```java
public final class Pattern implements java.io.Serializable {
    public static final int UNIX_LINES = 0x01;
    public static final int CASE_INSENSITIVE = 0x02;
    public static final int COMMENTS = 0x04;
    public static final int MULTILINE = 0x08;
    public static final int LITERAL = 0x10;
    public static final int DOTALL = 0x20;
    public static final int UNICODE_CASE = 0x40;
    public static final int CANON_EQ = 0x80;
    public static final int UNICODE_CHARACTER_CLASS = 0x100;
}
```




