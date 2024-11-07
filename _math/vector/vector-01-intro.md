---
title: "矢量：介绍"
sequence: "101"
---

## Intro

This is a vector:

![](/assets/images/math/vector/vector.gif)

A vector has **magnitude** (size) and **direction**:

![](/assets/images/math/vector/vector-mag-dir.svg)

The length of the line shows its magnitude and the arrowhead points in the direction.

### Add

We can add two vectors by joining them head-to-tail:

![](/assets/images/math/vector/vector-add.svg)

And it doesn't matter which order we add them, we get the same result:

![](/assets/images/math/vector/vector-add2.gif)

### Subtract

We can also subtract one vector from another:

- first we reverse the direction of the vector we want to subtract,
- then add them as usual:

![](/assets/images/math/vector/vector-subtract.gif)

### Notation

A vector is often written in **bold**, like **a** or **b**.

A vector can also be written as the letters
of its head and tail with an arrow above it, like this:

![](/assets/images/math/vector/vector-notation.svg)

## Calculations

Now ... how do we do the calculations?

The most common way is to first break up vectors into `x` and `y` parts, like this:

![](/assets/images/math/vector/vector-xy-components.gif)

<p>
The vector <b>a</b> is broken up into
the two vectors \(a_{x}\) and \(a_{y}\).
</p>

### Adding Vectors

We can then add vectors by **adding the x parts** and **adding the y parts**:

![](/assets/images/math/vector/vector-add3.gif)

The vector `(8, 13)` and the vector `(26, 7)` add up to the vector `(34, 20)`

When we break up a vector like that, each part is called a **component**.

```text
Example: add the vectors a = (8, 13) and b = (26, 7)
c = a + b

c = (8, 13) + (26, 7) = (8+26, 13+7) = (34, 20)
```

### Subtracting Vectors

To subtract, first reverse the vector we want to subtract, then add.

```text
Example: subtract k = (4, 5) from v = (12, 2)
a = v + −k

a = (12, 2) + −(4, 5) = (12, 2) + (−4, −5) = (12−4, 2−5) = (8, −3)
```

### Magnitude of a Vector

The magnitude of a vector is shown by two vertical bars on either side of the vector:

<p>
\[
| a |
\]
</p>

OR it can be written with double vertical bars (so as not to confuse it with absolute value):

<p>
\[
|| a ||
\]
</p>

We use Pythagoras' theorem to calculate it:

<p>
\[
| a | = \sqrt {x^{2} + y^{2}}
\]
</p>

<fieldset>
    <legend>Example</legend>
    <p>
        what is the magnitude of the vector <b>b</b> = (6, 8) ?
    </p>
<p>
\[
| b | = \sqrt {6^{2} + 8^{2}} = \sqrt {36+64} = \sqrt {100} = 10
\]
</p>
</fieldset>

A vector with magnitude 1 is called a **Unit Vector**.

### Vector vs Scalar

A **scalar** has **magnitude** (size) only.

```text
Scalar: just a number (like 7 or −0.32) ... definitely not a vector.
```

A **vector** has **magnitude** and **direction**,
and is often written in bold, so we know it is not a scalar:

- so **c** is a vector, it has magnitude and direction
- but c is just a value, like 3 or 12.4

<fieldset>
    <legend>Example</legend>
    <p>
        k<b>b</b> is actually the scalar k times the vector <b>b</b>.
    </p>
</fieldset>

### Multiplying a Vector by a Scalar

When we multiply a vector by a scalar it is called "scaling" a vector,
because we change how big or small the vector is.

Example: multiply the vector **m** = (7, 3) by the scalar 3

![](/assets/images/math/vector/vector-scaling.gif)

**a** = 3**m** = (3×7, 3×3) = (21, 9)

It still points in the same direction, but is 3 times longer

**And now you know why numbers are called "scalars",
because they "scale" the vector up or down.**

### Multiplying a Vector by a Vector

How do we **multiply two vectors** together? There is more than one way!

- The scalar or **Dot Product** (the result is a scalar).
- The vector or **Cross Product** (the result is a vector).

![](/assets/images/math/vector/dot-product-1.svg)

## Reference

- [Vectors](https://www.mathsisfun.com/algebra/vectors.html)
