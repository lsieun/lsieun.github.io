---
title: "Comparing Doubles in Java"
sequence: "101"
---

## Overview

In this tutorial, we'll talk about the different ways of comparing double values in Java.
In particular, it isn't as easy as comparing other primitive types.
As a matter of fact, it's problematic in many other languages, not only Java.

First, we'll explain why using the simple `==` operator is inaccurate and
might cause difficult to trace bugs in the runtime.
Then, we'll show how to compare doubles in plain Java and common third-party libraries correctly.

## Using the `==` Operator

Inaccuracy with comparisons using the `==` operator is caused by the way
**double values are stored in a computer's memory.**
We need to remember that there is **an infinite number of values that must fit in limited memory space, usually 64 bits.**
**As a result, we can't have an exact representation of most double values in our computers.**
They must be rounded to be saved.

Because of the rounding inaccuracy, interesting errors might occur:

```java
public class HelloWorld {
    public static void main(String[] args) {
        double d1 = 0;
        for (int i = 1; i <= 8; i++) {
            d1 += 0.1;
        }

        double d2 = 0.1 * 8;

        System.out.println(d1);
        System.out.println(d2);
    }
}
```

Both variables, `d1` and `d2`, should equal `0.8`.
However, when we run the code above, we'll see the following results:

```text
0.7999999999999999
0.8
```

In that case, comparing both values with the `==` operator would produce a wrong result.
For this reason, we must use a more complex comparison algorithm.

If we want to have the best precision and control over the rounding mechanism, we can use `java.math.BigDecimal` class.

## Comparing Doubles in Plain Java


The recommended algorithm to compare `double` values in plain Java is a **threshold comparison method**.
In this case, we need to check whether
**the difference between both numbers is within the specified tolerance, commonly called epsilon**:

```java
public class ComparingDoubleJDK {
    public static void main(String[] args) {
        double d1 = 0;
        for (int i = 1; i <= 8; i++) {
            d1 += 0.1;
        }

        double d2 = 0.1 * 8;

        System.out.println(d1);
        System.out.println(d2);

        double epsilon = 0.000001d;
        boolean flag = Math.abs(d1 - d2) < epsilon;
        System.out.println("equals: " + flag);
    }
}
```

```text
0.7999999999999999
0.8
equals: true
```

The smaller the epsilon's value, the greater the comparison accuracy.
However, if we specify the tolerance value too small, we'll get the same false result as in the simple `==` comparison.
**In general, epsilon's value with `5` and `6` decimals is usually a good place to start.**

Unfortunately, there is no utility from the standard JDK
that we could use to compare double values in the recommended and precise way.
Luckily, we don't need to write it by ourselves.
We can use a variety of dedicated methods provided by free and widely known third-party libraries.

## Using Apache Commons Math

[Apache Commons Math](https://www.baeldung.com/apache-commons-math)
is one of the biggest open-source library dedicated to mathematics and statistics components.
From the variety of different classes and methods,
we'll focus on `org.apache.commons.math3.util.Precision` class in particular.
It contains 2 helpful `equals()` methods to compare `double` values correctly:

```java
import org.apache.commons.math3.util.Precision;

public class ComparingDoubleApache {
    public static void main(String[] args) {
        double d1 = 0;
        for (int i = 1; i <= 8; i++) {
            d1 += 0.1;
        }

        double d2 = 0.1 * 8;

        System.out.println(d1);
        System.out.println(d2);

        double epsilon = 0.000001d;

        boolean flag1 = Precision.equals(d1, d2, epsilon);
        boolean flag2 = Precision.equals(d1, d2);
        System.out.println("flag1: " + flag1);
        System.out.println("flag2: " + flag2);
    }
}
```

```text
0.7999999999999999
0.8
flag1: true
flag2: true
```

The `epsilon` variable used here has the same meaning as in the previous example.
It is an amount of allowed absolute error.
However, it's not the only similarity to the threshold algorithm.
In particular, both `equals` methods use the same approach under the hood.

The two-argument function version is just a shortcut for the `equals(d1, d2, 1)` method call.
In this case, `d1` and `d2` are considered equal if there are no floating point numbers between them.

## Using Guava

Google's [Guava](https://www.baeldung.com/guava-guide) is a big set of core Java libraries
that extend the standard JDK capabilities.
It contains a big number of useful math utils in the `com.google.common.math` package.
To compare `double` values correctly in Guava,
let's implement the `fuzzyEquals()` method from the `DoubleMath` class:

```java
import com.google.common.math.DoubleMath;

public class ComparingDoubleGuava {
    public static void main(String[] args) {
        double d1 = 0;
        for (int i = 1; i <= 8; i++) {
            d1 += 0.1;
        }

        double d2 = 0.1 * 8;

        System.out.println(d1);
        System.out.println(d2);

        double epsilon = 0.000001d;
        boolean flag = DoubleMath.fuzzyEquals(d1, d2, epsilon);
        System.out.println("equals: " + flag);
    }
}
```

```text
0.7999999999999999
0.8
equals: true
```

The method name is different from in the Apache Commons Math,
but it works practically identically under the hood.
The only difference is that there is no overloaded method with the epsilon's default value.

## Reference

- [Comparing Doubles in Java](https://www.baeldung.com/java-comparing-doubles)
