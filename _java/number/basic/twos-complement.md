---
title: "Two's Complement"
sequence: "102"
---

The rightmost digit is called the **least significant bit (LSB)**, and the leftmost digit is the **most significant bit (MSB)**.

## negative integer

To get the two's complement negative notation of an integer, you write out the number in binary. You then invert the digits, and add one to the result.

Suppose we're working with 8 bit quantities (for simplicity's sake) and suppose we want to find how `-28` would be expressed in two's complement notation. First we write out 28 in binary form.

```text
00011100
```

Then we invert the digits. `0` becomes `1`, `1` becomes `0`.

```text
11100011
```

Then we add `1`.

```text
11100100
```

That is how one would write `-28` in 8 bit binary.

## Conversion from Two's Complement

Use the number `0xFFFFFFFF` as an example. In binary, that is:

```text
1111 1111 1111 1111 1111 1111 1111 1111
```

What can we say about this number? It's first (leftmost) bit is `1`, which means that this represents a number that is **negative**.
That's just the way that things are in two's complement: **a leading 1 means the number is negative, a leading 0 means the number is 0 or positive**.

To see what this number is a negative of, we reverse the sign of this number.
But how to do that? **To reverse the sign you simply invert the bits (0 goes to 1, and 1 to 0) and add one to the resulting number**.

The inversion of that binary number is, obviously:

```text
0000 0000 0000 0000 0000 0000 0000 0000
```

Then we add one.

```text
0000 0000 0000 0000 0000 0000 0000 0001
```

So the negative of `0xFFFFFFFF` is `0x00000001`, more commonly known as `1`. So `0xFFFFFFFF` is `-1`.

## Conversion to Two's Complement

Note that this works both ways. If you have `-30`, and want to represent it in 2's complement, you take the binary representation of `30`:

```text
0000 0000 0000 0000 0000 0000 0001 1110
```

Invert the digits.

```text
1111 1111 1111 1111 1111 1111 1110 0001
```

And add one.

```text
1111 1111 1111 1111 1111 1111 1110 0010
```

Converted back into hex, this is `0xFFFFFFE2`. That should yield an output of `-30`.

## Arithmetic with Two's Complement

One of the nice properties of two's complement is that **addition** and **subtraction** is made very simple.
With a system like two's complement, the circuitry for addition and subtraction can be unified, whereas otherwise they would have to be treated as separate operations.

In the examples in this section, I do addition and subtraction in two's complement, but you'll notice that every time I do actual operations with binary numbers I am always adding.

### Example 1: addition

Suppose we want to add two numbers `69` and `12` together.
If we're to use decimal, we see the sum is `81`.
But let's use binary instead, since that's what the computer uses.

```text
                                   1 1   Carry Row
  0000 0000 0000 0000 0000 0000 0100 0101 (69)
+ 0000 0000 0000 0000 0000 0000 0000 1100 (12)
  0000 0000 0000 0000 0000 0000 0101 0001 (81)
```

### Example 2: subtraction

Now suppose we want to subtract `12` from `69`. Now, `69 - 12 = 69 + (-12)`.
To get the negative of 12 we take its binary representation, invert, and add one.

```text
0000 0000 0000 0000 0000 0000 0000 1100
```

Invert the digits.

```text
1111 1111 1111 1111 1111 1111 1111 0011
```

And add one.

```text
1111 1111 1111 1111 1111 1111 1111 0100
```

The last is the binary representation for `-12`.
As before, we'll add the two numbers together.

```text
  1111 1111 1111 1111 1111 1111 1    1 Carry Row
  0000 0000 0000 0000 0000 0000 0100 0101 (69)
+ 1111 1111 1111 1111 1111 1111 1111 0100 (-12)
  0000 0000 0000 0000 0000 0000 0011 1001 (57)
```

We result in `57`, which is `69-12`.

### Example 3: subtraction

Lastly, we'll subtract `69` from `12`.
Similar to our operation in example 2, `12 - 69 = 12 + (- 69)`.
The two's complement representation of 69 is the following.
I assume you've had enough illustrations of inverting and adding one.

```text
1111 1111 1111 1111 1111 1111 1011 1011
```

So we add this number to `12`.

```text
                                 111 Carry Row
  0000 0000 0000 0000 0000 0000 0000 1100 (12)
+ 1111 1111 1111 1111 1111 1111 1011 1011 (-69)
  1111 1111 1111 1111 1111 1111 1100 0111 (-57)
```

This results in `12 - 69 = -57`, which is correct.

## Why Inversion and Adding One Works

Invert and add one.
Invert and add one.
It works, and you may want to know why.
If you don't care, skip this, as it is hardly essential.
This is only intended for those curious as to why that rather strange technique actually makes mathematical sense.

Inverting and adding one might sound like a stupid thing to do, but it's actually just a mathematical shortcut of a rather straightforward computation.

## References

- [Two's Complement](https://www.cs.cornell.edu/~tomf/notes/cps104/twoscomp.html)
