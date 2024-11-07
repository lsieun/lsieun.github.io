---
title: "二维图形几何变换"
sequence: "101"
---

## 平移 Translation

<p>
平移，是将对象从一个位置 \((x,y)\) 移到另一个位置 \((x',y')\) 的变换。
</p>

![](/assets/images/math/geometry/transformation/geometry-2d-translation.svg)

<div>
$$ \begin{align}
T_{x} &= x' - x \\
T_{y} &= y' - y
\end{align} $$
</div>

称为**平移距离**。平移变换的公式为：

<div>
$$ \begin{align}
x' &= x + T_{x} \\
y' &= y + T_{y}
\end{align} $$
</div>

## 旋转 Rotation

<p>
旋转，是以某个参考点为圆心，将对象上的各点\((x,y)\)围绕圆心转动一个逆时针角度\(\theta\)，
变成新的坐标\((x',y')\)的变换。
</p>

![](/assets/images/math/geometry/transformation/geometry-2d-rotate.svg)

### 参考点为零

<p>
当参考点为 \((0,0)\) 时，旋转的公式为：
</p>

<div>
$$ \begin{align}
x' &= r \times cos(\alpha + \theta) = r \times cos(\alpha) \times cos(\theta) - r \times sin(\alpha) \times sin(\theta) \\
y' &= r \times sin(\alpha + \theta) = r \times sin(\alpha) \times cos(\theta) + r \times cos(\alpha) \times sin(\theta)
\end{align} $$
</div>

<p>
由于 \(x = r \times cos(\alpha)\) 且 \(y = r \times sin(\alpha)\)，所以上式可化简为：
</p>

<div>
$$ \begin{align}
x' &= x \times cos(\theta) - y \times sin(\theta) \\
y' &= y \times cos(\theta) + x \times sin(\theta)
\end{align} $$
</div>

### 参考点非零

<p>
如果参考点不是 \((0,0)\)，而是任意一点 \((x_{r}, y_{r})\)，
那么绕 \((x_{r}, y_{r})\) 点的旋转由三个步骤完成：
</p>

<ol>
    <li>将对象平移：\(T_{x} = -x_{r}\)，\(T_{y} = -y_{r}\)</li>
    <li>旋转变换</li>
    <li>平移：\(T_{x} = x_{r}\)，\(T_{y} = y_{r}\)</li>
</ol>

组合这三个步骤的计算公式为：

<div>
$$ \begin{align}
x' &= x_{r} + (x - x_{r}) \times cos(\theta) - (y - y_{r}) \times sin(\theta) \\
y' &= y_{r} + (y - y_{r}) \times cos(\theta) + (x - x_{r}) \times sin(\theta)
\end{align} $$
</div>

## 变比 Scaling

<p>
变比，是使对象按比例因子 \((S_{x}, S_{y})\) 放大或缩小的变换。
</p>

![](/assets/images/math/geometry/transformation/geometry-2d-scaling.svg)

变比计算公式为：

<div>
$$ \begin{align}
x' &= x \times S_{x} \\
y' &= y \times S_{y}
\end{align} $$
</div>

做变比时，不仅对象的大小变化，而且对象离原点的距离也发生了变化。
如果只希望变换对象的大小，而不希望变比对角离原点的距离，
则可采用固定点变比（scaling relative to a fixed point）。

<p>
若以 \(a\) 为固定点进行变比的方法是：
</p>

<ol>
    <li>作平移 \(T_{x} = -x_{a}\)，\(T_{y} = -y_{a}\)</li>
    <li>进行变比</li>
    <li>做平移的逆变换，即平移 \(T_{x} = x_{a}\)，\(T_{y} = y_{a}\)</li>
</ol>

<p>
当比例因子 \(S_{x}\) 或  \(S_{y}\) 小于 \(0\) 时，对象不仅变化大小，
而且分别按 \(x\) 轴，或 \(y\) 轴被反射。
</p>

## 变换矩阵

<p>
三种基本变换公式，都可以表示为 \(3 \times 3\)的变换矩阵和齐次坐标相乘的形式。
</p>

矩阵相乘的原则：

<p>
设有矩阵 \(A\)（\(m \times n\)阶）和矩阵 \(B\)（\(n \times k\)阶），
则有 \(A \times B\) 成立，令 \( C = A \times B \)，\(C\) 的阶数为 \(m \times k\)。
其表示为：
</p>

<div>
$$ \begin{align}
C_{m \times k} &= A_{m \times n} \times B_{n \times k}
\end{align} $$
</div>

<p>
$$
\begin{align}
A \times B &= \\
 &= 
\begin{bmatrix}
	a_{11} & a_{12} \\
	a_{21} & a_{22} \\
	a_{31} & a_{32}
\end{bmatrix}
\times
\begin{bmatrix}
	b_{11} & b_{12} & b_{13} & b_{14} \\
	b_{21} & b_{22} & b_{23} & b_{24}
\end{bmatrix} \\
 &=
\begin{bmatrix}
	a_{11}b_{11} + a_{12}b_{21} & a_{11}b_{12} + a_{12}b_{22} & a_{11}b_{13} + a_{12}b_{23} & a_{11}b_{14} + a_{12}b_{24} \\
	a_{21}b_{11} + a_{22}b_{21} & a_{21}b_{12} + a_{22}b_{22} & a_{21}b_{13} + a_{22}b_{23} & a_{21}b_{14} + a_{22}b_{24} \\
	a_{31}b_{11} + a_{32}b_{21} & a_{31}b_{12} + a_{32}b_{22} & a_{31}b_{13} + a_{32}b_{23} & a_{31}b_{14} + a_{32}b_{24}
\end{bmatrix}

\end{align}

$$
</p>

### 平移

平移的矩阵运算表示：

<p>
$$
\begin{bmatrix}
	x' & y' & 1
\end{bmatrix}
=
\begin{bmatrix}
	x & y & 1
\end{bmatrix}
\times
\begin{bmatrix}
	1 & 0 & 0 \\
	0 & 1 & 0 \\
	T_{x} & T_{y} & 1
\end{bmatrix}
$$
</p>

<p>
简记为\(p'=p \cdot T(T_{x}, T_{y})\)。
其中，
</p>

<ul>
    <li>
$$
p' = 
\begin{bmatrix}
	x' & y' & 1
\end{bmatrix}
$$
    </li>
    <li>
$$
p = 
\begin{bmatrix}
	x & y & 1
\end{bmatrix}
$$
    </li>
    <li>
$$
T(T_{x}, T_{y}) = 
\begin{bmatrix}
	1 & 0 & 0 \\
	0 & 1 & 0 \\
	T_{x} & T_{y} & 1 \\
\end{bmatrix}
$$
    </li>
</ul>

### 旋转

旋转的矩阵运算表示：

<p>
$$
\begin{bmatrix}
	x' & y' & 1
\end{bmatrix}
=
\begin{bmatrix}
	x & y & 1
\end{bmatrix}
\times
\begin{bmatrix}
	cos \theta & sin \theta & 0 \\
	-sin \theta & cos \theta & 0 \\
	0 & 0 & 1
\end{bmatrix}
$$
</p>

<p>
简记为\(p'=p \cdot R(\theta)\)。
其中，
</p>

<ul>
    <li>
$$
p' = 
\begin{bmatrix}
	x' & y' & 1
\end{bmatrix}
$$
    </li>
    <li>
$$
p = 
\begin{bmatrix}
	x & y & 1
\end{bmatrix}
$$
    </li>
    <li>
$$
R(\theta) = 
\begin{bmatrix}
	cos \theta & sin \theta & 0 \\
	-sin \theta & cos \theta & 0 \\
	0 & 0 & 1
\end{bmatrix}
$$
    </li>
</ul>

### 变比

变比的矩阵运算表示：

<p>
$$
\begin{bmatrix}
	x' & y' & 1
\end{bmatrix}
=
\begin{bmatrix}
	x & y & 1
\end{bmatrix}
\times
\begin{bmatrix}
	S_{x} & 0 & 0 \\
	0 & S_{y} & 0 \\
	0 & 0 & 1
\end{bmatrix}
$$
</p>

<p>
简记为\(p'=p \cdot S(S_{x},S_{y})\)。
其中，
</p>

<ul>
    <li>
$$
p' = 
\begin{bmatrix}
	x' & y' & 1
\end{bmatrix}
$$
    </li>
    <li>
$$
p = 
\begin{bmatrix}
	x & y & 1
\end{bmatrix}
$$
    </li>
    <li>
$$
S(S_{x},S_{y}) = 
\begin{bmatrix}
	S_{x} & 0 & 0 \\
	0 & S_{y} & 0 \\
	0 & 0 & 1
\end{bmatrix}
$$
    </li>
</ul>

## 级联变换 Composite Transformation

<p>
一个比较复杂的变换，要连续进行若干个基本变换才能完成。<br/>
例如，围绕任意点 \((x_{r}, y_{r})\) 的旋转，就要通过 3 个基本变换：
\(T(-x_{r}, -y_{r})\)、\(R(\theta)\)、\(T(x_{r}, y_{r})\) 才能完成。<br/>
这些由基本变换构成的连续变换序列称为<b>级联变换</b>。
</p>

<p>
以绕任意点 \((x_{r}, y_{r})\) 旋转变换为例，应该做如下三次变换：
</p>

<ul>
    <li>\(p' = p \cdot T(-x_{r}, -y_{r})\)</li>
    <li>\(p'' = p' \cdot R(\theta) \)</li>
    <li>\(p''' = p'' \cdot T(x_{r}, y_{r})\)</li>
</ul>



<p>
整理得到：
</p>

<p>
$$
p''' = p \cdot T(-x_{r}, -y_{r}) \cdot R(\theta) \cdot T(x_{r}, y_{r})
$$
</p>

令

<p>
\[
T_{c} = T(-x_{r}, -y_{r}) \cdot R(\theta) \cdot T(x_{r}, y_{r})
\]
</p>

则有

<p>
\[
p''' = p \cdot T_{c}
\]
</p>

<p>
\(T_{c}\) 称为<b>级联变换矩阵</b>。
</p>


