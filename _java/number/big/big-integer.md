---
title: "java.math.BigInteger"
sequence: "101"
---

## 为何需要 BigInteger ？

Sometimes primitive data types are not large enough to store calculated values.
The largest primitive data type that can store integer values in Java is the 64-bit `long`.
Given that it is a signed data type, this gives it the range from `-9,223,372,036,854,775,808` to `9,223,372,036,854,775,807`.

So we already established that BigIntegers are “Big”.
But, what would we need such a data structure for.
Well, there are some applications that come to mind.

- For example, if you are developing an application for Astronomy,
trying to calculate the number of comets in a Galaxy,
or trying to perform a calculation involving the 1,000,000,000,000,000,000,000 stars that exist in the universe.
- Or if you are developing an application for physicists who would like to calculate the weight of a start.
For example, our Sun is estimated to weigh 2 x 10<sup>30</sup> Kilograms.

Big integers would definitely come in handy in such situations.

## 特性

### Immutable

Notice that each time you perform an arithmetic operation, a new `BigInteger` instance is produced.
This is because already instantiated instances of `BigIntegers` are **immutable**.
In other words, **once you have created an instance, you cannot change the value of that instance**.

One can only assume that this was done by the Java creators because it was simpler to implement and less error prone.
However, this also comes at the cost of memory as for each new instance, a new place in the JVM memory is reserved.

### maximum size

The officially supported range of values for Big integers is **-(2<sup>Integer.MAX_VALUE</sup>) -1** to **+(2<sup>Integer.MAX_VALUE</sup>) -1**.

However, larger values are theoretically possible and are technically limited to the amount of memory the Java virtual machine has.
You can read more about this in the [official documentation](https://docs.oracle.com/javase/8/docs/api/java/math/BigInteger.html).

## 操作

### 算术

Given two big integer instances `a` and `b`, one can perform the following arithmetic operations as follows:

| arithmetic operations  | BigInteger      |
|----------------------- |-----------------|
| Addition (a + b)       | `a.add(b)`      |
| Subtraction (a – b)    | `a.subract(b)`  |
| Division (a / b)       | `a.divide(b)`   |
| Multiplication (a * b) | `a.multiply(b)` |
| Modulus (a % b)        | `a.mod(b)`      |
| XOR (a ^ b)            | `a.xor(b)`      |



## References

- [What is a BigInteger and how to use it in Java](https://nullbeans.com/what-is-a-biginteger-and-how-to-use-it-in-java/) 文章的雏形就是来自这里。
