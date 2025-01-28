---
title: "Arithmetic"
sequence: "103"
---

## Add two numbers

递归：

```java
public class HelloWorld {
    private static int add(int a, int b) {
        if (b == 0) return a;

        return add(a ^ b, (a & b) << 1);
    }

    public static void main(String[] args) {
        System.out.println(add(18, 1));
        System.out.println(add(20, 12));
    }
}
```

循环：

```java
public class HelloWorld {
    private static int add(int a, int b) {
        while (a != 0) {
            int c = b & a;
            b = b ^ a;
            a = c << 1;
        }
        return b;
    }

    public static void main(String[] args) {
        System.out.println(add(18, 1));
        System.out.println(add(20, 12));
    }
}
```

## Subtract two numbers

递归：

```java
public class HelloWorld {
    private static int sub(int a, int b) {
        if (b == 0) return a;

        return sub(a ^ b, (~a & b) << 1);
    }

    public static void main(String[] args) {
        System.out.println(sub(18, 1));
        System.out.println(sub(20, 12));
    }
}
```

循环：

```java
public class HelloWorld {
    private static int sub(int a, int b) {
        // Iterate till there is no carry
        while (b != 0) {
            // borrow contains common set bits of y and unset bits of x
            int borrow = (~a) & b;

            // Subtraction of bits of x
            // and y where at least one
            // of the bits is not set
            a = a ^ b;

            // Borrow is shifted by one
            // so that subtracting it from
            // x gives the required sum
            b = borrow << 1;
        }

        return a;
    }

    public static void main(String[] args) {
        System.out.println(sub(18, 1));
        System.out.println(sub(20, 12));
    }
}
```

## Subtract 1

```java
public class HelloWorld {
    private static int subtractOne(int x) {
        return ((x << 1) + (~x));
    }

    public static void main(String[] args) {
        System.out.println(subtractOne(18));
    }
}
```

```java
public class HelloWorld {
    private static int subtractOne(int x) {
        int m = 1;

        // Flip all the set bits until we find a 1
        while (!((x & m) > 0)) {
            x = x ^ m;
            m <<= 1;
        }

        // flip the rightmost 1 bit
        x = x ^ m;
        return x;
    }

    public static void main(String[] args) {
        System.out.println(subtractOne(18));
    }
}
```

## Multiply two numbers

```java
public class HelloWorld {
    // Function to multiply two
    // numbers using Russian Peasant method
    static int russianPeasant(int a, int b) {
        // initialize result
        int result = 0;

        // While second number doesn't become 1
        while (b > 0) {
            // If second number becomes odd,
            // add the first number to result
            if ((b & 1) != 0)
                result = result + a;

            // Double the first number
            // and halve the second number
            a = a << 1;
            b = b >> 1;
        }
        return result;
    }

    public static void main(String[] args) {
        System.out.println(russianPeasant(18, 1));
        System.out.println(russianPeasant(20, 12));
    }
}
```

## Divide two integers

```java
public class HelloWorld {
    static int divide(int dividend, int divisor) {

        // Calculate sign of divisor i.e.,
        // sign will be negative only iff
        // either one of them is negative
        // otherwise it will be positive
        int sign = ((dividend < 0) ^ (divisor < 0)) ? -1 : 1;

        // Update both divisor and
        // dividend positive
        dividend = Math.abs(dividend);
        divisor = Math.abs(divisor);

        // Initialize the quotient
        int quotient = 0;

        while (dividend >= divisor) {
            dividend -= divisor;
            ++quotient;
        }
        //if the sign value computed earlier is -1 then negate the value of quotient
        if (sign == -1) quotient = -quotient;

        return quotient;
    }

    public static void main(String[] args) {
        int a = 10;
        int b = 3;

        System.out.println(divide(a, b));

        a = 43;
        b = -8;

        System.out.println(divide(a, b));
    }
}
```

```java
public class HelloWorld {
    public static long divide(long dividend, long divisor) {
        // Calculate sign of divisor
        // i.e., sign will be negative
        // only iff either one of them
        // is negative otherwise it
        // will be positive
        long sign = ((dividend < 0) ^ (divisor < 0)) ? -1 : 1;

        // remove sign of operands
        dividend = Math.abs(dividend);
        divisor = Math.abs(divisor);

        // Initialize the quotient
        long quotient = 0, temp = 0;

        // test down from the highest
        // bit and accumulate the
        // tentative value for
        // valid bit
        // 1<<31 behaves incorrectly and gives Integer
        // Min Value which should not be the case, instead
        // 1L<<31 works correctly.
        for (int i = 31; i >= 0; --i) {

            if (temp + (divisor << i) <= dividend) {
                temp += divisor << i;
                quotient |= 1L << i;
            }
        }

        //if the sign value computed earlier is -1 then negate the value of quotient
        if (sign == -1) quotient = -quotient;
        return quotient;
    }

    public static void main(String args[]) {
        int a = 10, b = 3;
        System.out.println(divide(a, b));

        int a1 = 43, b1 = -8;
        System.out.println(divide(a1, b1));
    }
}
```
