---
title: "矢量：点乘（Dot Product）"
sequence: "102"
---

A vector has **magnitude** (how long it is) and **direction**:

![](/assets/images/math/vector/vector-mag-dir.svg)

Here are two vectors:

![](/assets/images/math/vector/vectors.svg)

They can be **multiplied** using the "**Dot Product**"

## Calculating

The Dot Product is written using a central dot:

<p>
\[
a \cdot b
\]
</p>

This means the Dot Product of **a** and **b**

![](/assets/images/math/vector/dot-product-1.svg)

### 第一种计算方式

We can calculate the Dot Product of two vectors this way:

<p>
\[
a \cdot b = |a| \times |b| \times cos(\theta)
\]
</p>

Where:

<ul>
<li>\(|a|\) is the magnitude (length) of vector <b>a</b></li>
<li>\(|b|\) is the magnitude (length) of vector <b>b</b></li>
<li>\(\theta\) is the angle between <b>a</b> and <b>b</b></li>
</ul>

So we multiply the length of **a** times the length of **b**,
then multiply by the cosine of the angle between **a** and **b**

### 第二种计算方式

OR we can calculate it this way:

<p>
\[
a \cdot b = a_{x} \times b_{x} + a_{y} \times b_{y}
\]
</p>

So we multiply the x's, multiply the y's, then add.

![](/assets/images/math/vector/dot-product-2.svg)

### 计算结果

Both methods work!

And the result is a **number** (called a "scalar" to show it is not a vector).

Example: Calculate the dot product of vectors **a** and **b**:

![](/assets/images/math/vector/dot-product-ex1.gif)

<p>
\[
\begin{align}
a \cdot b &= |a| \times |b| \times cos(\theta) \\
&= 10 \times 13 \times cos(59.5^{\circ}) \\
&= 10 \times 13 \times 0.5975... \\
&= 65.98... \\
&= 66 (rounded)
\end{align}
\]
</p>

OR we can calculate it this way:

<p>
\[
\begin{align}
a \cdot b &= a_{x} \times b_{x} + a_{y} \times b_{y} \\
&= -6 \times 5 + 8 \times 12 \\
&= -30 + 96 \\
&= 66
\end{align}
\]
</p>

## Why cos(θ)?

OK, to multiply two vectors it makes sense to multiply their lengths together
**but only when they point in the same direction**.

So we make one "point in the same direction" as the other by multiplying by cos(θ):

![](/assets/images/math/vector/dot-product-a-cos.svg)

We take the component of **a** that lies alongside **b**

![](/assets/images/math/vector/dot-product-light.svg)

Like shining a light to see where the shadow lies

THEN we multiply!

It works exactly the same if we "projected" **b** alongside **a** then multiplied:

![](/assets/images/math/vector/dot-product-b-cos.gif)

Because it doesn't matter which order we do the multiplication:

<p>
\[
|a| \times |b| \times cos(\theta) = |a| \times cos(\theta) \times |b|
\]
</p>

## Right Angles

When two vectors are at right angles to each other the dot product is **zero**.

Example: calculate the Dot Product for:

![](/assets/images/math/vector/dot-product-right-angle.gif)

<p>
\[
\begin{align}
a \cdot b &= |a| \times |b| \times cos(\theta) \\
&= |a| \times |b| \times cos(90^{\circ}) \\
&= |a| \times |b| \times 0 \\
&= 0
\end{align}
\]
</p>

OR we can calculate it this way:

<p>
\[
\begin{align}
a \cdot b &= a_{x} \times b_{x} + a_{y} \times b_{y} \\
&= -12 \times 12 + 16 \times 99 \\
&= -144 + 144 \\
&= 0
\end{align}
\]
</p>

This can be a handy way to find out **if two vectors are at right angles**.

## Three or More Dimensions

This all works fine in 3 (or more) dimensions, too.

![](/assets/images/math/vector/dot-product-ex2.gif)

We have 3 dimensions, so don't forget the z-components:

<p>
\[
\begin{align}
a \cdot b &= a_{x} \times b_{x} + a_{y} \times b_{y} + a_{z} \times b_{z} \\
&= 9 \times 4 + 2 \times 8 + 7 \times 10 \\
&= 36 + 16 + 70 \\
&= 122
\end{align}
\]
</p>

Now for the other formula:

<p>
\[
a \cdot b = |a| \times |b| \times cos(\theta)
\]
</p>

But what is |a| ? It is the magnitude, or length, of the vector **a**.
We can use Pythagoras:

<p>
\[
\begin{align}
|a| &= \sqrt {4^{2} + 8^{2} + 100^{2}} \\
&= \sqrt {16 + 64 + 100} \\
&= \sqrt {180}
\end{align}
\]
</p>

Likewise for |b|:

<p>
\[
\begin{align}
|b| &= \sqrt {9^{2} + 2^{2} + 7^{2}} \\
&= \sqrt {81 + 4 + 49} \\
&= \sqrt {134}
\end{align}
\]
</p>

<p>
And we know from the calculation above that \(a \cdot b = 122\), so:
</p>

<p>
\[
a \cdot b = |a| \times |b| \times cos(\theta)
\]
</p>

<p>
\[
\begin{align}
122 &= \sqrt{180} \times \sqrt{134} \times cos(\theta) \\
cos(\theta) &= \frac {122} {\sqrt{180} \times \sqrt{134}} \\
cos(\theta) &= 0.7855... \\
\theta &= arccos(0.7855...) \\
\theta &= 38.2...^{\circ}
\end{align}
\]
</p>

## 向量点乘（内积）

**点乘**（**Dot Product**）的结果是**点积**，又称**数量积**或**标量积**（Scalar Product）。

<p>
在空间中有两个向量：
</p>

<p>
\[
\begin{align}
\vec a &= (x_{1}, y_{1}, z_{1}) \\
\vec b &= (x_{2}, y_{2}, z_{2})
\end{align}
\]
</p>

<p>
\( \vec a \)与\( \vec b \)之间夹角为\( \theta \)。
</p>

从代数角度看，**点积**是对两个向量对应位置上的值相乘再相加的操作，其结果即为点积。

<p>
\[
\vec a \cdot \vec b = x_{1}x_{2} + y_{1}y_{2} + z_{1}z_{2}
\]
</p>

### 几何角度

从几何角度看，点积是两个向量的长度与它们夹角余弦的积。

<p>
\[
\vec a \cdot \vec b = |\vec a| |\vec b| cos \theta
\]
</p>

![](/assets/images/math/vector/vector-dot-product-a-b-cos-theta.jpg)

### 几何意义

<p>
点乘的结果表示\( \vec a \)在\( \vec b \)方向上的**投影**与\( |\vec b| \)的乘积，
反映了两个向量在方向上的相似度，结果越大越相似。
</p>

基于结果可以判断这两个向量**是否是同一方向**，**是否正交垂直**，具体对应关系为：

<ul>
    <li>第一种情况，\( \vec a \cdot \vec b \gt 0 \)则方向基本相同，夹角在0°到90°之间</li>
    <li>第二种情况，\( \vec a \cdot \vec b = 0 \)则正交，相互垂直</li>
    <li>第三种情况，\( \vec a \cdot \vec b \lt 0 \)则方向基本相反，夹角在90°到180°之间</li>
</ul>

点乘代数定义推导几何定义：（常用来求向量夹角）

<p>
设\( \vec a \)终点为\( A(x_{1}, y_{1}, z_{1}) \)，\( \vec b \)的终点为\( B(x_{2}, y_{2}, z_{2}) \)，
原点为\( O \)，则
\[
\vec {AB} = (x_{2} - x_{1}, y_{2} - y_{1}, z_{2}-z_{1})
\]
</p>

<p>
在\( \triangle OAB \)中，由<b>余弦定理</b>得：
</p>

使用距离公式进行处理，可得：

<p>
\[
|\vec a| |\vec b| cos \theta = 
\frac{
x_{1}^{2} + y_{1}^{2} + z_{1}^{2} + 
x_{2}^{2} + y_{2}^{2} + z_{2}^{2} +
[
(x_{2} - x_{1})^{2} + 
(y_{2} - y_{1})^{2} + 
(z_{2} - z_{1})^{2}
]
}{2}
\]
</p>

去括号后合并，可得：

<p>
\[
|\vec a| |\vec b| cos \theta = 
x_{1}x_{2} + y_{1}y_{2} + z_{1}z_{2} = \vec a \cdot \vec b
\]
</p>

<p>
根据上面的公式，可以计算\( \vec a \)与\( \vec b \)之间的夹角：
\[
\theta = arccos(\frac{\vec a \cdot \vec b}{|\vec a| |\vec b|})
\]
</p>

## 向量叉乘（外积）

**叉乘**（**Cross Product**）又称向量积（Vector Product）。

<p>
在空间中有两个向量：
</p>

<p>
\[
\begin{align}
\vec a &= (x_{1}, y_{1}, z_{1}) \\
\vec b &= (x_{2}, y_{2}, z_{2})
\end{align}
\]
</p>

<p>
\( \vec a \)与\( \vec b \)之间夹角为\( \theta \)。
</p>

从代数角度计算：

<p>
\[
\vec a \times \vec b = 
(y_{1}z_{2} - z_{1}y_{2}, z_{1}x_{2} - x_{1}z_{2}, x_{1}y_{2} - y_{1}x_{2})
\]
</p>

<p>
从几何角度计算：（\( \vec n \)为\( \vec a \)与\( \vec b \)所构成平面的单位向量）
\[
\vec a \times \vec b = |\vec a| |\vec b| sin \theta \vec n
\]
</p>

其运算结果是一个向量，并且与这两个向量都**垂直**，是这两个向量所在平面的**法线向量**。
使用右手定则确定其方向。

![](/assets/images/math/vector/right-hand-rule-cross-product.svg)

### 几何意义

<p>
如果以向量\( \vec a \)和\( \vec b \)为边构成一个平行四边形，
那么这两个向量外积的模长与这个平行四边形的面积相等。
</p>

![](/assets/images/math/vector/vector-cross-product-parallelogram.jpg)

## dot vs cross

A **dot product** of two vectors is also called the **scalar product**.
It is the product of the magnitude of the two vectors and
**the cosine of the angle** that they form with each other.


A **cross product** of two vectors is also called the **vector product**.
It is the product of the magnitude of the two vectors and
**the sine of the angle** that they form with each other.

## Reference

- [Dot Product](https://www.mathsisfun.com/algebra/vectors-dot-product.html)
- [Difference Between Dot Product and Cross Product](https://askanydifference.com/difference-between-dot-product-and-cross-product/)
- [Dot Product vs Cross Product](https://crossproductcalculator.org/dot-product-vs-cross-product/)
