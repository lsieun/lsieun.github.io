---
title: "Type Safety"
---

## confuse Java's type system

In early implementations of the Java virtual machine, it was possible to confuse Java's type system.
A Java application could trick the Java virtual machine into using an object of one type
as if it were an object of a different type.
This capability makes cracker's happy,
because they can potentially spoof( 滑稽地模仿 ) trusted classes to gain access
to non-public data or change the behavior of methods by replacing them with new versions.

## compile-time vs runtime

At **compile time**, a type is uniquely identifiable by its fully qualified name.

At **runtime**, however, a fully qualified name is not enough to uniquely identify a type that has been loaded into a Java virtual machine.
Because a Java application can have multiple class loaders,
and each class loader maintains its own namespace,
multiple types with the same fully qualified name can be loaded into the same Java virtual machine.
Thus, to uniquely identify a type loaded into a Java virtual machine requires the **fully qualified name** and **the defining class loader**.

```text
               ┌─── compile time ───┼─── fully qualified class name
               │
type safety ───┤
               │                    ┌─── fully qualified class name
               └─── runtime ────────┤
                                    └─── defining class loader
```

## type safety problems

The **type safety problems** made possible by this class loader architecture arose
from the Java virtual machine's initial reliance on the compile time notion of a type being uniquely identifiable by only its fully qualified name.

## address problem: Loading constraints

To address this problem, the second edition of the Java virtual machine specification introduced the notion of **loading constraints**.
**Loading constraints** basically enable the Java virtual machine to enforce **type safety** based not just on **fully qualified name**,
but also on **the defining class loader**, without forcing eager class loading.

