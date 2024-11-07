---
title: "Bit manipulation"
sequence: "101"
---

The Java programming language also provides operators
that perform **bitwise** and **bit shift operations** on **integral types**.

**The unary bitwise complement operator** "~" inverts a bit pattern;
it can be applied to any of the integral types, making every "0" a "1" and every "1" a "0".
For example, a byte contains 8 bits;
applying this operator to a value whose bit pattern is "00000000" would change its pattern to "11111111".

**The signed left shift operator** `<<` shifts a bit pattern to the left,
and **the signed right shift operator** `>>` shifts a bit pattern to the right.
The bit pattern is given by the left-hand operand, and the number of positions to shift by the right-hand operand.
**The unsigned right shift operator** ">>>" shifts a zero into the leftmost position,
while the leftmost position after ">>" depends on sign extension.

- The bitwise `&` operator performs a bitwise AND operation.
- The bitwise `^` operator performs a bitwise exclusive OR operation.
- The bitwise `|` operator performs a bitwise inclusive OR operation.

**Bit manipulation** is the act of algorithmically manipulating bits using bit-level (bitwise) operations.
These bitwise operations are the heart of bit manipulation.
They are primitive, fast actions that are used in improving the efficiency of a program.

Terminology: A **bitmask** is the data used for bitwise operations, particularly in a bit field.
Using a mask, bits can be set either on/off or vice versa in a single bitwise operation.

## Bitwise Logical Operators

### AND Operator

AND (`&`) is a binary operator that compares two operands of equal length.
The operands are converted from their readable form to binary representation.
For each bit, the operation checks if both bits are `1` across both operands.
If yes, that bit is set to `1` in the answer.
Otherwise, the corresponding result bit is set to `0`.

- If two input bits are `1`, the output is `1`.
- In all other cases it is `0`, for example:
  - `1 & 0` => yields to `0`.
  - `0 & 1` => yields to `0`.
  - `0 & 0` => yields to `0`.

```text
    0101 (decimal 5)
AND 0011 (decimal 3)
--------------------
    0001 (decimal 1)
```

The operation may be used to **determine whether a particular bit is set (`1`) or clear (`0`)**.

### OR Operator

The OR operator (`|`) is a binary operator that takes two equal-length operands
but compares them in the opposite way to AND;
if either corresponding bit is `1`, the answer is `1`.
Otherwise, the answer will be `0`.
In other words, Bitwise OR returns `1` if one of the inputs given is `1`.

- If two input bits are `0`, the output is `0`.
- In all other cases, it is `1`. For example:
  - `1 | 0` => yields to `1`.
  - `0 | 1` => yields to `1`.
  - `1 | 1` => yields to `1`.

This is often used as **an interim logic step** for solving other problems.

### NOT Operator

NOT (`~`), or sometimes called the bitwise complement operator, is a unary operation
that takes **a single input** and **swaps each bit** in its binary representation to the opposite value.

All instances of `0` become `1`, and all instances of `1` become `0`.

For example, consider `x = 1`

The binary number representation of `x` is:

```text
 x = 00000000 00000000 00000000 00000001
```

Now, Bitwise NOT of `x` will be:

```text
~x = 11111111 11111111 11111111 11111110
```

So:

- `x` contains 31 zeros(`0`s) and one `1`
- `~x` contains 31 ones(`1`s) and one `0`

This makes the number negative as **any bit collection that starts with `1` is negative**.

NOT is useful for **flipping unsigned numbers** to **the mirrored value** on the opposite side of their mid-point.

For 8-bit unsigned integers, `NOT x = 255 - x`.

![](/assets/images/java/core/bit-manipulation-not-x.svg)

### XOR Operator

The bitwise XOR operation (`^`), short for “Exclusive-Or”, is a binary operator
that takes two input arguments and compares each corresponding bit.
If the bits are opposite, the result has a `1` in that bit position.
If they match, a `0` is returned.

- `1 ^ 1` => yields to `0`.
- `0 ^ 0` => yields to `0`.
- `1 ^ 0` => yields to `1`.
- `0 ^ 1` => yields to `1`.

```text
a = 12
b = 10
---------------------------------
a in binary : 0000 0000 0000 1100
b in binary : 0000 0000 0000 1010
---------------------------------
a ^ b       : 0000 0000 0000 0110
---------------------------------
```

## Left and right shift operator

A bit shift moves each digit in a number's binary representation left or right
by a number of spaces specified by the second operand.

These operators can be applied to integral types such as `int`, `long`, `short`, `byte`, or `char`.

There are three types of shift:

- **Left shift**: `<<` is the left shift operator and meets both logical and arithmetic shifts' needs.
- **Arithmetic/signed right shift**: `>>` is the arithmetic (or signed) right shift operator.
- **Logical/unsigned right shift**: `>>>` is the logical (or unsigned) right shift operator.

In Java, **all integer data types are signed** and `<<` and `>>` are solely arithmetic shifts.

With **right shift**, you can either do arithmetic (`>>`) or logical (`>>>`) shift.

The difference is that **arithmetic shifts** maintain the same **most significant bit** (MSB) or **sign bit**,
the leftmost bit which determines if a number is positive or negative.

<p>
    Formula: \({a >>> b} = {a \over 2^{b} }\)
</p>





## References

- [A quick guide to bitwise operators in Java](https://www.educative.io/blog/bit-manipulation-in-java)
- [Subtract 1 without arithmetic operators](https://www.geeksforgeeks.org/subtract-1-without-arithmetic-operators/)

