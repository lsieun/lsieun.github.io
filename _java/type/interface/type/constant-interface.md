---
title: "constant interface"
sequence: "102"
---


## Use interfaces only to define types

When a class implements an interface,
the interface serves as a **type** that can be used to refer to instances of the class.
That a class implements an interface should therefore say something about
what a client can do with instances of the class.
It is inappropriate to define an interface for any other purpose.

One kind of interface that fails this test is the so-called **constant interface**.

An **constant interface** contains no methods; it consists solely of `static final` fields, each exporting a constant.
Classes using these constants implement the interface to avoid the need to qualify constant names with a class name.

```java
public interface PhysicalConstants {
    // Avogadro's number (1/mol) 
    double AVOGADROS_NUMBER   = 6.02214199e23;

    // Boltzmann constant (J/K) 
    double BOLTZMANN_CONSTANT = 1.3806503e-23;

    // Mass of the electron (kg) 
    double ELECTRON_MASS      = 9.10938188e-31;
}
```

**The constant interface pattern is a poor use of interfaces.**
That a class uses some constants internally is an implementation detail.
Implementing a **constant interface** causes this implementation detail to leak into the class's exported API.
It is of no consequence to the users of a class that the class implements a constant interface.
In fact, it may even confuse them.
Worse, it represents a commitment:
if in a future release the class is modified so that it no longer needs to use the constants,
it still must implement the interface to ensure **binary compatibility**.
If a non-final class implements a constant interface,
all of its subclasses will have their namespaces polluted by the constants in the interface.

There are several constant interfaces in the java platform libraries, such as `java.io.ObjectStreamConstants`.
These interfaces should be regarded as anomalies and should not be emulated.

If you want to export constants, there are several reasonable choices.
If the constants are strongly tied to an existing class or interface,
you should add them to the class or interface.
For example, all of the numerical wrapper classes in the Java platform libraries,
such as `Integer` and `Float`, export `MIN_VALUE` and `MAX_VALUE` constants.
If the constants are best viewed as members of an enumerated type,
you should export them with a **typesafe enum class**.
Otherwise, you should export the constants with a noninstantiable utility class.
Here is a utility class version of the `PhysicalConstants` example above:

```java
// Constant utility class
public class PhysicalConstants {
    private PhysicalConstants() { }  // Prevents instantiation 

    public static final double AVOGADROS_NUMBER   = 6.02214199e23;
    public static final double BOLTZMANN_CONSTANT = 1.3806503e-23;
    public static final double ELECTRON_MASS      = 9.10938188e-31;
}
```

While the utility class version of `PhysicalConstants` does require clients to qualify constant names with a class name,
this is a small price to pay for sensible APIs.
It is possible that the language may eventually allow the importation of `static` fields.

In the meantime, you can minimize the need for excessive typing
by storing frequently used constants in local variables or `private static` fields, for example:

```text
private static final double PI = Math.PI;
```

In summary, **interfaces** should be used only to define **types**.
They should not be used to export **constants**.
