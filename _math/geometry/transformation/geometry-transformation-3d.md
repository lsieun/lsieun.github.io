---
title: "三维图形几何变换"
sequence: "102"
---

## 平移

三维图形的平移：

<div>
$$ \begin{align}
x' &= x + T_{x} \\
y' &= y + T_{y} \\
z' &= z + T_{z}
\end{align}
$$
</div>

齐次坐标形式为：

<p>
$$
\begin{bmatrix}
	x' & y' & 1
\end{bmatrix}
=
\begin{bmatrix}
	x & y & 1
\end{bmatrix}
\begin{bmatrix}
	1 & 0 & 0 & 0 \\
	0 & 1 & 0 & 0 \\
	0 & 0 & 1 & 0 \\
	T_{x} & T_{y} & T_{z} & 1
\end{bmatrix}
$$

</p>

## 缩放（变比）

三维图形的缩放：

<div>
$$ \begin{align}
x' &= S_{x} \cdot x \\
y' &= S_{y} \cdot y \\
z' &= S_{z} \cdot z
\end{align}
$$
</div>

齐次坐标形式为：

<p>
$$
\begin{bmatrix}
	x' & y' & 1
\end{bmatrix}
=
\begin{bmatrix}
	x & y & 1
\end{bmatrix}
\begin{bmatrix}
	S_{x} & 0 & 0 & 0 \\
	0 & S_{y} & 0 & 0 \\
	0 & 0 & S_{z} & 0 \\
	0 & 0 & 0 & 1
\end{bmatrix}
$$

</p>

## 旋转

旋转分为三种基本旋转：

- 绕 z 轴旋转
- 绕 x 轴旋转
- 绕 y 轴旋转

<p>
在下述旋转变换公式中，设旋转的参考点在所绕的轴上，绕轴转 \( \theta \) 角，
方向是从轴所指处往原点看的逆时针方向。
</p>

### 绕 z 轴旋

绕 z 轴旋转的公式为：

<div>
$$ \begin{align}
x' &= x cos \theta - y sin \theta \\
y' &= x sin \theta + y cos \theta \\
z' &= z
\end{align}
$$
</div>

矩阵运算的表达为：

<p>
$$
\begin{bmatrix}
	x' & y' & z' & 1
\end{bmatrix}
=
\begin{bmatrix}
	x & y & z & 1
\end{bmatrix}
\begin{bmatrix}
	cos \theta & sin \theta & 0 & 0 \\
	-sin \theta & cos \theta & 0 & 0 \\
	0 & 0 & 1 & 0 \\
	0 & 0 & 0 & 1
\end{bmatrix}
$$

</p>

<p>
记为： \(R_{z}(\theta)\)
</p>

### 绕 x 轴旋

绕 x 轴旋转的公式为：

<div>
$$ \begin{align}
x' &= x \\
y' &= y cos \theta - z sin \theta \\
z' &= y sin \theta + z cos \theta
\end{align}
$$
</div>

矩阵运算的表达为：

<p>
$$
\begin{bmatrix}
	x' & y' & z' & 1
\end{bmatrix}
=
\begin{bmatrix}
	x & y & z & 1
\end{bmatrix}
\begin{bmatrix}
    1 & 0 & 0 & 0 \\
	0 & cos \theta & sin \theta & 0 \\
	0 & -sin \theta & cos \theta & 0 \\
	0 & 0 & 0 & 1
\end{bmatrix}
$$

</p>

<p>
记为： \(R_{x}(\theta)\)
</p>

### 绕 y 轴旋

绕 y 轴旋转的公式为：

<div>
$$ \begin{align}
x' &= z sin \theta + x cos \theta \\
y' &= y \\
z' &= z cos \theta - x sin \theta
\end{align}
$$
</div>

矩阵运算的表达为：

<p>
$$
\begin{bmatrix}
	x' & y' & z' & 1
\end{bmatrix}
=
\begin{bmatrix}
	x & y & z & 1
\end{bmatrix}
\begin{bmatrix}
    cos \theta & 0 & -sin \theta & 0 \\
    0 & 1 & 0 & 0 \\
	 sin \theta & 0 & cos \theta &0 \\
	0 & 0 & 0 & 1
\end{bmatrix}
$$

</p>

<p>
记为： \(R_{y}(\theta)\)
</p>

### 任意轴

如果旋转所绕的轴不是坐标轴，而是一根任意轴，则变换过程便显得较复杂。

- 首先，对物体作平移和绕轴旋转变换，使得所绕之轴与某一根标准坐标轴重合。
- 然后，绕该标准坐标轴做所需角度的旋转。
- 最后，通过逆变换使所绕之轴恢复到原来位置。

这个过程需由 7 个基本变换的级联才能完成：

<ol>
    <li>\( T(-x_{1}, -y_{1}, -z_{1}) \)，使 p1 点与原点重合；</li>
    <li>\( R_{x}(\alpha) \)，使得\(p_{1}p_{2}\)落入平面\(xoz\)内</li>
    <li>\( R_{y}(\beta) \)，使得\(p_{1}p_{2}\)落入平面\(z\)轴重合</li>
    <li>\( R_{z}(\theta) \)，执行绕 \(p_{1}p_{2}\) 轴的 \(\theta\) 角度旋转</li>
    <li>\( R_{y}(-\beta) \)，做 3 的逆变换</li>
    <li>\( R_{x}(-\alpha) \)，做 2 的逆变换</li>
    <li>\( T(x_{1}, y_{1}, z_{1}) \)，做 1 的逆变换。</li>
</ol>

变换矩阵为：

<p>
\[
T(-x_{1}, -y_{1}, -z_{1})
\cdot
R_{x}(\alpha)
\cdot
R_{y}(\beta)
\cdot
R_{z}(\theta)
\cdot
R_{y}(-\beta)
\cdot
R_{x}(-\alpha)
\cdot
T(x_{1}, y_{1}, z_{1})
\]
</p>

## 参数图形几何变换

前面所介绍的二维、三维图形的几何变换均是基于点的几何变换。
对于可用参数表示的曲线、曲面图形，若其几何变换仍然基于点，
则计算工作量和存储空间都很大。

下面介绍几种对参数表示的点、曲线及曲面直接进行几何变换的算法。

### 圆锥曲线的几何变换

圆锥曲线的二次方程是：

<p>
\[
Ax^{2} + Bxy + Cy^{2} + Dx + Ey + F = 0
\]
</p>

其相应的矩阵表达式是：

<div>
\[
\begin{bmatrix}
	x & y & z
\end{bmatrix}
\begin{bmatrix}
	A & \frac{B}{2} & \frac{D}{2} \\
    \frac{B}{2} & C & \frac{E}{2} \\
    \frac{D}{2} & \frac{E}{2} & F
\end{bmatrix}
\begin{bmatrix}
	x \\
	y \\
	1
\end{bmatrix}
\]
</div>

<p>
简记为：\( XSX^{T} = 0\)
</p>

### 平移变换

若对圆锥曲线平移变换，平移矩阵是：

<div>
\[
T_{r} = 
\begin{bmatrix}
	1 & 0 & 0 \\
	0 & 1 & 0 \\
	m & n & 1
\end{bmatrix}
\]
</div>

则平移后的圆锥曲线矩阵方程是：

<div>
\[
XT_{r}ST^{T}_{r}X^{T} = 0
\]
</div>

### 旋转变换

若对圆锥曲线相对坐标原点做旋转变换，旋转变换矩阵是

<div>
\[
R = 
\begin{bmatrix}
	cos \theta & sin \theta & 0 \\
	-sin \theta & cos \theta & 0 \\
	0 & 0 & 1
\end{bmatrix}
\]
</div>

则旋转后的圆锥曲线矩阵方程是：

<div>
\[
XRSR^{T}X^{T} = 0
\]
</div>

<p>
若对圆锥曲线相对 \((m,n)\) 点做旋转 \(\theta\) 角变换，
则旋转后的圆锥曲线是上述 \(T_{r} \)、\(R\) 变换的复合变换，
变换后圆锥曲线的矩阵方程是
\( XT_{r}RSR^{T}R^{T}_{r}X^{T} = 0 \)
</p>

### 比例变换

<p>
若对圆锥曲线相对 \((m,n)\) 点比例变换，比例变换矩阵为：
</p>

<div>
\[
S_{T} = 
\begin{bmatrix}
	S_{x} & 0 & 0 \\
	0 & S_{y} & 0 \\
	0 & 0 & 1
\end{bmatrix}
\]
</div>

则变换后的圆锥曲线矩阵方程是：

<p>
\[
XT_{r}S_{T}SS^{T}_{T}T^{T}_{r}X^{T} = 0
\]
</p>

