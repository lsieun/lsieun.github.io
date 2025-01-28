---
title: "矢量：叉乘（Cross Product）"
sequence: "103"
---

## Intro

A vector has **magnitude** (how long it is) and **direction**:

![](/assets/images/math/vector/vector-mag-dir.svg)

**Two vectors** can be **multiplied** using the "**Cross Product**"

![](/assets/images/math/vector/vectors-ab.svg)

<p>
The Cross Product \( a \times b \) of two vectors is <b>another vector</b>
that is at right angles to both:
</p>

![](/assets/images/math/vector/cross-product-simple.svg)

The **magnitude** (length) of the cross product equals
the area of a parallelogram with vectors **a** and **b** for sides:

![](/assets/images/math/vector/cross-product-area.svg)

## Calculating

### 第一种计算方式

We can calculate the **Cross Product** this way:

<p>
\[
a \times b = |a| \times |b| sin(\theta) n
\]
</p>

<ul>
    <li>\(|a|\) is the magnitude (length) of vector <b>a</b></li>
    <li>\(|b|\) is the magnitude (length) of vector <b>b</b></li>
    <li>\(\theta\) is the angle between <b>a</b> and <b>b</b></li>
    <li>\(n\) is the unit vector at right angles to both <b>a</b> and <b>b</b></li>
</ul>

So the **length** is: the length of **a** times the length of **b** times
the sine of the angle between **a** and **b**,

Then we multiply by the vector **n**
so it heads in the correct **direction**
(at right angles to both **a** and **b**).

### 第二种计算方式

OR we can calculate it this way:

When **a** and **b** start at the origin point (0,0,0),
the Cross Product will end at:

<p>
\[
\begin{align}
c_{x} &= a_{y}b_{z} - a_{z}b_{y} \\
c_{y} &= a_{z}b_{x} - a_{x}b_{z} \\
c_{z} &= a_{x}b_{y} - a_{y}b_{x}
\end{align}
\]
</p>

![](/assets/images/math/vector/cross-product-components.svg)

Example: The cross product of **a** = (2,3,4) and **b** = (5,6,7)

<p>
\[
\begin{align}
c_{x} &= a_{y}b_{z} - a_{z}b_{y} = 3 \times 7 - 4 \times 6 = -3 \\
c_{y} &= a_{z}b_{x} - a_{x}b_{z} = 4 \times 5 - 2 \times 7 = 6\\
c_{z} &= a_{x}b_{y} - a_{y}b_{x} = 2 \times 6 - 3 \times 5 = -3
\end{align}
\]
</p>

<p>
Answer: \(a \times b  = (−3,6,−3) \)
</p>

## Which Direction?

The cross product could point in the completely opposite direction
and still be at right angles to the two other vectors, so we have the:
"**Right Hand Rule**".

![](/assets/images/math/vector/right-hand-rule.jpg)

With your right-hand, point your index finger along vector **a**,
and point your middle finger along vector **b**:
the cross product goes in the direction of your thumb.
