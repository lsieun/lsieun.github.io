---
title: "Java enum type"
sequence: "103"
---


The basic idea behind Java's enum types is simple:
they are classes that export one instance for each enumeration constant via a `public static final` field.
Enum types are effectively `final`, by virtue of having no accessible constructors.
Because clients can neither create instances of an enum type nor extend it,
there can be no instances but the declared enum constants.
In other words, enum types are instance-controlled.
They are a generalization of singletons, which are essentially single-element enums.

## Advantages

### compile-time type safety

Enums provide **compile-time type safety**.
If you declare a parameter to be of type `Apple`,
you are guaranteed that any non-null object reference passed to the parameter is one of the three valid `Apple` values.

```java
public enum Apple { FUJI, PIPPIN, GRANNY_SMITH }
```

Attempts to pass values of the wrong type will result in compile-time errors,
as will attempts to assign an expression of one enum type to a variable of another,
or to use the `==` operator to compare values of different enum types.

### identically named constants

Enum types with identically named constants coexist peacefully because each type has its own namespace.
You can add or reorder constants in an enum type without recompiling its clients
because the fields that export the constants provide a layer of insulation between an enum type and its clients:
constant values are not compiled into the clients as they are in the `int` enum patterns.

### printable strings

Finally, you can translate enums into printable strings by calling their `toString` method.

## Fields And Methods

In addition to rectifying the deficiencies of `int` enums,
enum types let you add arbitrary methods and fields and implement arbitrary interfaces.
They provide high-quality implementations of all the `Object` methods,
they implement `Comparable` and `Serializable`,
and their serialized form is designed to withstand most changes to the enum type.

So why would you want to add methods or fields to an enum type?
For starters, you might want to associate data with its constants.
Our `Apple` and `Orange` types, for example,
might benefit from a method that returns the color of the fruit, or one that returns an image of it.
You can augment an enum type with any method that seems appropriate.
An enum type can start life as a simple collection of enum constants and evolve over time into a full-featured abstraction.

For a nice example of a rich enum type, consider the eight planets of our solar system.
Each planet has a mass and a radius, and from these two attributes you can compute its surface gravity.
This in turn lets you compute the weight of an object on the planet's surface, given the mass of the object.
Here's how this enum looks.
The numbers in parentheses after each enum constant are parameters that are passed to its constructor.
In this case, they are the planet's mass and radius:

```java
// Enum type with data and behavior
public enum Planet {
    MERCURY(3.302e+23, 2.439e6),
    VENUS(4.869e+24, 6.052e6),
    EARTH(5.975e+24, 6.378e6),
    MARS(6.419e+23, 3.393e6),
    JUPITER(1.899e+27, 7.149e7),
    SATURN(5.685e+26, 6.027e7),
    URANUS(8.683e+25, 2.556e7),
    NEPTUNE(1.024e+26, 2.477e7);
    
    private final double mass;           // In kilograms
    private final double radius;         // In meters
    private final double surfaceGravity; // In m / s^2

    // Universal gravitational constant in m^3 / kg s^2
    private static final double G = 6.67300E-11;

    // Constructor
    Planet(double mass, double radius) {
        this.mass = mass;
        this.radius = radius;
        surfaceGravity = G * mass / (radius * radius);
    }

    public double mass() {
        return mass;
    }

    public double radius() {
        return radius;
    }

    public double surfaceGravity() {
        return surfaceGravity;
    }

    public double surfaceWeight(double mass) {
        return mass * surfaceGravity; // F = ma
    }
}
```

It is easy to write a rich enum type such as `Planet`.
To associate data with enum constants,
declare instance fields and write a constructor that takes the data and stores it in the fields.
Enums are by their nature immutable, so all fields should be `final`.
Fields can be `public`, but it is better to make them `private` and provide `public` accessors.
In the case of `Planet`, the constructor also computes and stores the surface gravity,
but this is just an optimization.
The gravity could be recomputed from the `mass` and radius each time it was used by the `surfaceWeight` method,
which takes an object's `mass` and returns its weight on the planet represented by the constant.

While the `Planet` enum is simple, it is surprisingly powerful.
Here is a short program that takes the earth weight of an object (in any unit) and
prints a nice table of the object's weight on all eight planets (in the same unit):

```java
public class WeightTable {
    public static void main(String[] args) {
        double earthWeight = Double.parseDouble(args[0]);
        double mass = earthWeight / Planet.EARTH.surfaceGravity();
        for (Planet p : Planet.values()) {
            System.out.printf("Weight on %s is %f%n", p, p.surfaceWeight(mass));
        }
    }
}
```

### values method

Note that `Planet`, like all enums, has a static `values` method
that returns an array of its values in the order they were declared.

### toString

Note also that the `toString` method returns the declared name of each enum value,
enabling easy printing by `println` and `printf`.

If you're dissatisfied with this string representation,
you can change it by overriding the `toString` method.

Here is the result of running our `WeightTable` program (which doesn't override toString) with the command line argument 185:

```text
Weight on MERCURY is 69.912739
Weight on VENUS is 167.434436
Weight on EARTH is 185.000000
Weight on MARS is 70.226739
Weight on JUPITER is 467.990696
Weight on SATURN is 197.120111
Weight on URANUS is 167.398264
Weight on NEPTUNE is 210.208751
```

### remove element

Until 2006, two years after enums were added to Java, `Pluto` was a planet.
This raises the question “what happens when you remove an element from an enum type?”
The answer is that any client program that doesn't refer to the removed element will continue to work fine.
So, for example, our `WeightTable` program would simply print a table with one fewer row.

And what of a client program that refers to the removed element (in this case, `Planet.Pluto`)?
If you recompile the client program,
the compilation will fail with a helpful error message at the line that refers to the erstwhile planet;
if you fail to recompile the client, it will throw a helpful exception from this line at runtime.
This is the best behavior you could hope for, far better than what you'd get with the `int` enum pattern.

## method scope

Some behaviors associated with enum constants may need to be used only from within the class or package
in which the enum is defined.
Such behaviors are best implemented as `private` or **package-private methods**.
Each constant then carries with it a hidden collection of behaviors
that allows the class or package containing the enum to react appropriately
when presented with the constant.
Just as with other classes,
unless you have a compelling reason to expose an enum method to its clients,
declare it `private` or, if need be, **package-private**.

## top-level class

If an enum is generally useful, it should be a top-level class;
if its use is tied to a specific top-level class,
it should be a member class of that top-level class.

For example, the `java.math.RoundingMode` enum represents a rounding mode for decimal fractions.
These rounding modes are used by the `BigDecimal` class,
but they provide a useful abstraction that is not fundamentally tied to `BigDecimal`.
By making `RoundingMode` a top-level enum,
the library designers encourage any programmer who needs rounding modes to reuse this enum,
leading to increased consistency across APIs.

```java
public enum RoundingMode {

    UP(BigDecimal.ROUND_UP),
    DOWN(BigDecimal.ROUND_DOWN),
    CEILING(BigDecimal.ROUND_CEILING),
    FLOOR(BigDecimal.ROUND_FLOOR),
    HALF_UP(BigDecimal.ROUND_HALF_UP),
    HALF_DOWN(BigDecimal.ROUND_HALF_DOWN),
    HALF_EVEN(BigDecimal.ROUND_HALF_EVEN),
    UNNECESSARY(BigDecimal.ROUND_UNNECESSARY);

    final int oldMode;

    RoundingMode(int oldMode) {
        this.oldMode = oldMode;
    }

    public static RoundingMode valueOf(int rm) {
        switch(rm) {

        case BigDecimal.ROUND_UP:
            return UP;

        case BigDecimal.ROUND_DOWN:
            return DOWN;

        case BigDecimal.ROUND_CEILING:
            return CEILING;

        case BigDecimal.ROUND_FLOOR:
            return FLOOR;

        case BigDecimal.ROUND_HALF_UP:
            return HALF_UP;

        case BigDecimal.ROUND_HALF_DOWN:
            return HALF_DOWN;

        case BigDecimal.ROUND_HALF_EVEN:
            return HALF_EVEN;

        case BigDecimal.ROUND_UNNECESSARY:
            return UNNECESSARY;

        default:
            throw new IllegalArgumentException("argument out of range");
        }
    }
}
```

## different behavior

The techniques demonstrated in the `Planet` example are sufficient for most enum types, but sometimes you need more.
There is **different data** associated with each `Planet` constant,
but sometimes you need to associate fundamentally **different behavior** with each constant.
For example, suppose you are writing an enum type to represent the operations on a basic four-function calculator,
and you want to provide a method to perform the arithmetic operation represented by each constant.

### First Way

One way to achieve this is to switch on the value of the enum:

```java
// Enum type that switches on its own value - questionable
public enum Operation {
    PLUS, MINUS, TIMES, DIVIDE;

    // Do the arithmetic operation represented by this constant
    public double apply(double x, double y) {
        switch (this) {
            case PLUS:
                return x + y;
            case MINUS:
                return x - y;
            case TIMES:
                return x * y;
            case DIVIDE:
                return x / y;
        }
        throw new AssertionError("Unknown op: " + this);
    }
}
```

This code works, but it isn't very pretty.
It won't compile without the `throw` statement because the end of the method is technically reachable,
even though it will never be reached.
Worse, the code is fragile.
If you add a new enum constant but forget to add a corresponding case to the switch,
the enum will still compile,
but it will fail at runtime when you try to apply the new operation.

### constant-specific method implementations

Luckily, there is a better way to associate a different behavior with each enum constant:
declare an abstract `apply` method in the enum type,
and override it with a concrete method for each constant in a **constant-specific class body**.
Such methods are known as **constant-specific method implementations**:

```java
// Enum type with constant-specific method implementations
public enum Operation {
    PLUS {public double apply(double x, double y) {return x + y;}},
    MINUS {public double apply(double x, double y) {return x - y;}},
    TIMES {public double apply(double x, double y) {return x * y;}},
    DIVIDE {public double apply(double x, double y) {return x / y;}};

    public abstract double apply(double x, double y);
}
```

If you add a new constant to the second version of `Operation`,
it is unlikely that you'll forget to provide an `apply` method,
because the method immediately follows each constant declaration.
In the unlikely event that you do forget,
the compiler will remind you because abstract methods in an enum type
must be overridden with concrete methods in all of its constants.

**Constant-specific method implementations** can be combined with **constant-specific data**.
For example, here is a version of `Operation` that overrides the `toString` method
to return the symbol commonly associated with the operation:

```java
// Enum type with constant-specific class bodies and data
public enum Operation {
    PLUS("+") {
        public double apply(double x, double y) {return x + y;}
    },
    MINUS("-") {
        public double apply(double x, double y) {return x - y;}
    },
    TIMES("*") {
        public double apply(double x, double y) {return x * y;}
    },
    DIVIDE("/") {
        public double apply(double x, double y) {return x / y;}
    };
    
    private final String symbol;

    Operation(String symbol) {
        this.symbol = symbol;
    }

    @Override
    public String toString() {
        return symbol;
    }

    public abstract double apply(double x, double y);
}
```

The `toString` implementation shown makes it easy to print arithmetic expressions, as demonstrated by this little program:

```text
public static void main(String[] args) {
    double x = Double.parseDouble(args[0]);
    double y = Double.parseDouble(args[1]);
    for (Operation op : Operation.values()) {
        System.out.printf("%f %s %f = %f%n", x, op, y, op.apply(x, y));
    }
}
```

Running this program with 2 and 4 as command line arguments produces the following output:

```text
2.000000 + 4.000000 = 6.000000
2.000000 - 4.000000 = -2.000000
2.000000 * 4.000000 = 8.000000
2.000000 / 4.000000 = 0.500000
```

## valueOf(String)

Enum types have an automatically generated valueOf(String) method
that translates a constant's name into the constant itself.
If you override the `toString` method in an enum type,
consider writing a `fromString` method to translate the custom string representation back to the corresponding enum.
The following code (with the type name changed appropriately) will do the trick for any enum,
so long as each constant has a unique string representation:

```text
// Implementing a fromString method on an enum type
private static final Map<String, Operation> stringToEnum =
        Stream.of(values()).collect(toMap(Object::toString, e -> e));
// Returns Operation for string, if any
public static Optional<Operation> fromString(String symbol) {
    return Optional.ofNullable(stringToEnum.get(symbol));
}
```

Note that the `Operation` constants are put into the `stringToEnum` map
from a static field initialization that runs after the enum constants have been created.
The previous code uses a stream over the array returned by the `values()` method;
prior to Java 8, we would have created an empty hash map and
iterated over the `values` array inserting the string-to-enum mappings into the map,
and you can still do it that way if you prefer.

But note that attempting to have each constant put itself into a map from its own constructor does not work.
It would cause a compilation error, which is good thing because if it were legal,
it would cause a `NullPointerException` at runtime.
**Enum constructors aren't permitted to access the enum's static fields, with the exception of constant variables.**
This restriction is necessary because **static fields** have not yet been initialized when **enum constructors** run.
A special case of this restriction is that enum constants cannot access one another from their constructors.

```text
It is illegal to access static member 'myMap' from enum constructor or instance initializer
```

Also note that the `fromString` method returns an `Optional<String>`.
This allows the method to indicate that the string that was passed in does not represent a valid operation,
and it forces the client to confront this possibility.

A disadvantage of **constant-specific method implementations** is that they make it harder to share code among **enum constants**.
For example, consider an enum representing the days of the week in a payroll package.
This enum has a method that calculates a worker's pay for that day
given the worker's base salary (per hour) and the number of minutes worked on that day.
On the five weekdays, any time worked in excess of a normal shift generates overtime pay;
on the two weekend days, all work generates overtime pay.
With a `switch` statement, it's easy to do this calculation by applying multiple case labels to each of two code fragments:

```java
// Enum that switches on its value to share code - questionable
enum PayrollDay {
    MONDAY, TUESDAY, WEDNESDAY, THURSDAY, FRIDAY,
    SATURDAY, SUNDAY;
    private static final int MINS_PER_SHIFT = 8 * 60;

    int pay(int minutesWorked, int payRate) {
        int basePay = minutesWorked * payRate;
        int overtimePay;
        switch (this) {
            case SATURDAY:
            case SUNDAY: // Weekend
                overtimePay = basePay / 2;
                break;
            default: // Weekday
                overtimePay = minutesWorked <= MINS_PER_SHIFT ?
                        0 : (minutesWorked - MINS_PER_SHIFT) * payRate / 2;
        }
        return basePay + overtimePay;
    }
}
```

This code is undeniably concise, but it is dangerous from a maintenance perspective.
Suppose you add an element to the enum, perhaps a special value to represent a vacation day,
but forget to add a corresponding case to the `switch` statement.
The program will still compile,
but the pay method will silently pay the worker the same amount for a vacation day as for an ordinary weekday.

To perform the pay calculation safely with **constant-specific method implementations**,
you would have to duplicate the overtime pay computation for each constant,
or move the computation into two helper methods, one for weekdays and one for weekend days,
and invoke the appropriate helper method from each constant.
Either approach would result in a fair amount of boilerplate code,
substantially reducing readability and increasing the opportunity for error.

The boilerplate could be reduced by replacing the abstract overtimePay method on `PayrollDay`
with a concrete method that performs the overtime calculation for weekdays.
Then only the weekend days would have to override the method.
But this would have the same disadvantage as the `switch` statement:
if you added another day without overriding the overtimePay method,
you would silently inherit the weekday calculation.

What you really want is to be **forced** to choose **an overtime pay strategy** each time you add an **enum constant**.
Luckily, there is a nice way to achieve this.
The idea is to move the overtime pay computation into a `private` nested enum,
and to pass an instance of this strategy enum to the constructor for the `PayrollDay` enum.
The `PayrollDay` enum then delegates the overtime pay calculation to the strategy enum,
eliminating the need for a `switch` statement or **constant-specific method implementation** in `PayrollDay`.
While this pattern is less concise than the `switch` statement, it is safer and more flexible:

```java
// The strategy enum pattern
enum PayrollDay {
    MONDAY, TUESDAY, WEDNESDAY, THURSDAY, FRIDAY,
    SATURDAY(PayType.WEEKEND), SUNDAY(PayType.WEEKEND);
    private final PayType payType;

    PayrollDay(PayType payType) {this.payType = payType;}

    PayrollDay() {this(PayType.WEEKDAY);} // Default

    int pay(int minutesWorked, int payRate) {
        return payType.pay(minutesWorked, payRate);
    }

    // The strategy enum type
    private enum PayType {
        WEEKDAY {
            int overtimePay(int minsWorked, int payRate) {
                return minsWorked <= MINS_PER_SHIFT ? 0 :
                        (minsWorked - MINS_PER_SHIFT) * payRate / 2;
            }
        },
        WEEKEND {
            int overtimePay(int minsWorked, int payRate) {
                return minsWorked * payRate / 2;
            }
        };

        abstract int overtimePay(int mins, int payRate);

        private static final int MINS_PER_SHIFT = 8 * 60;

        int pay(int minsWorked, int payRate) {
            int basePay = minsWorked * payRate;
            return basePay + overtimePay(minsWorked, payRate);
        }
    }
}
```

If `switch` statements on enums are not a good choice for implementing **constant-specific behavior** on enums,
what are they good for?
**Switches on enums are good for augmenting enum types with constant-specific behavior.**
For example, suppose the `Operation` enum is not under your control and
you wish it had an instance method to return the inverse of each operation.
You could simulate the effect with the following `static` method:

```text
public static Operation inverse(Operation op) {
    switch (op) {
        case PLUS: return Operation.MINUS;
        case MINUS: return Operation.PLUS;
        case TIMES: return Operation.DIVIDE;
        case DIVIDE: return Operation.TIMES;
        default: throw new AssertionError("Unknown op: " + op);
    }
}
```

You should also use this technique on enum types
that are under your control if a method simply doesn't belong in the enum type.
The method may be required for some use but is not generally useful enough to merit inclusion in the enum type.

Enums are, generally speaking, comparable in performance to `int` constants.
A minor performance disadvantage of enums is that there is a space and time cost to load and initialize enum types,
but it is unlikely to be noticeable in practice.

So when should you use enums?
**Use enums any time you need a set of constants whose members are known at compile time.**
Of course, this includes “natural enumerated types,” such as the planets, the days of the week, and the chess pieces.
But it also includes other sets for which you know all the possible values at compile time,
such as choices on a menu, operation codes, and command line flags.
**It is not necessary that the set of constants in an enum type stay fixed for all time.**
The enum feature was specifically designed to allow for binary compatible evolution of enum types.

In summary, the advantages of enum types over `int` constants are compelling.
Enums are more readable, safer, and more powerful.
Many enums require no explicit constructors or members,
but others benefit from associating data with each constant and providing methods whose behavior is affected by this data.
Fewer enums benefit from associating multiple behaviors with a single method.
In this relatively rare case, prefer constant-specific methods to enums that switch on their own values.
Consider the **strategy enum pattern** if some, but not all, enum constants share common behaviors.
