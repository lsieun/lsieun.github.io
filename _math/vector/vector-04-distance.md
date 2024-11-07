---
title: "矢量：三维空间两直线/线段最短距离"
sequence: "104"
---

设有两条空间线段：

<ul>
    <li>\(L_{s}\)，起点为\(s_{0}\)，终点为\(s_{1}\)，方向向量为\(\vec u = s_{1} - s_{0}\)</li>
    <li>\(L_{t}\)，起点为\(t_{0}\)，终点为\(t_{1}\)，方向向量为\(\vec v = t_{1} - t_{0}\)</li>
</ul>

> 其中，s可能表示source单词；相应地，t可能表示target单词。

<p>
    记两条线段对应的直线分别为\(l_{s}\)和\(l_{t}\)，采用向量表示法如下：
</p>

<p>
\[
\begin{align}
l_{s} &= s_{0} + c_{s} \cdot \vec u \\
l_{t} &= t_{0} + c_{t} \cdot \vec v
\end{align}
\]
</p>

<p>
当\(0 \le c_{s}, c_{t} \le 1\)时，上述表达式代表线段\(L_{s}\)和\(L_{t}\)。
</p>

<p>
设最短距离两点分别为\(s_{j}\)和\(t_{j}\)，则有
</p>

<p>
\[
\begin{align}
s_{j} &= s_{0} + s_{c} \cdot \vec u \\
t_{j} &= t_{0} + t_{c} \cdot \vec v
\end{align}
\]
</p>

<p>
其中，\(s_{c}\)和\(t_{c}\)分别为\(s_{j}\)和\(t_{j}\)两点所对应的标量。
</p>

<p>
记向量\( \vec w = s_{j} - t_{j} \)，记向量\( \vec w_{0} = s_{0} - t_{0} \)：
</p>

![](/assets/images/math/vector/skew-line-distance-s-t-w.png)

根据上图可以得出：

<p>
\[
\begin{align}
\vec w &= s_{j} - t_{j} \\
&= (s_{0} + s_{c} \cdot \vec u) - (t_{0} + t_{c} \cdot \vec v) \\
&= (s_{0} - t_{0}) + ( s_{c} \cdot \vec u - t_{c} \cdot \vec v ) \\
& = \vec w_{0} + s_{c} \cdot \vec u - t_{c} \cdot \vec v
\end{align}
\]
</p>

即：

<p>
\[
\begin{align}
\vec w &= \vec w_{0} + s_{c} \cdot \vec u - t_{c} \cdot \vec v （公式1）
\end{align}
\]
</p>

<p>
如果\(s\)和\(t\)两条直线不平行、重合，则存在唯一的两点\(s_{c}\)和\(t_{c}\)使线段\( \overrightarrow{s_{c}t_{c}} \)
为\(l_{s}\)和\(l_{t}\)最近两点的连线。
同时，线段\( \overrightarrow{s_{c}t_{c}} \)也是唯一与两条直线同时垂直的线段。
转换为向量表达式即为：
</p>

<p>
\[
\begin{align}
\vec {u} \cdot \vec {w} &= 0 \\
\vec {v} \cdot \vec {w} &= 0
\end{align}
\]
</p>

将公式1代入上述两式可得：

<p>
\[
\begin{align}
\vec {u} \cdot \vec {w} &= 0 \\
\vec {u} \cdot (\vec w_{0} + s_{c} \cdot \vec u - t_{c} \cdot \vec {v}) &= 0 \\
\vec {u} \cdot \vec w_{0} + \vec {u} \cdot (s_{c} \cdot \vec {u}) - \vec {u} \cdot (t_{c} \cdot \vec {v}) &=0 \\
\vec {u} \cdot \vec w_{0} + (\vec {u} \cdot \vec {u}) s_{c} - (\vec {u} \cdot \vec {v}) t_{c} & = 0 \\
(\vec {u} \cdot \vec {u}) s_{c} - (\vec {u} \cdot \vec {v}) t_{c} & = - (\vec {u} \cdot \vec w_{0})  （公式2）
\end{align}
\]
</p>

<p>
\[
\begin{align}
\vec {v} \cdot \vec {w} &= 0 \\
\vec {v} \cdot (\vec w_{0} + s_{c} \vec u - t_{c} \vec {v}) &= 0 \\
(\vec {v} \cdot \vec w_{0}) + (\vec {v} \cdot \vec u) s_{c} - (\vec {v} \cdot \vec {v}) t_{c} &=0 \\
(\vec {v} \cdot \vec u) s_{c} - (\vec {v} \cdot \vec {v}) t_{c} &= - (\vec {v} \cdot \vec w_{0})  （公式3）
\end{align}
\]
</p>

<p>
为了方便理解，现在假设：
</p>

<p>
\[
\begin{align}
a &= \vec {u} \cdot \vec {u} \\
b &= \vec {u} \cdot \vec {v} \\
c &= \vec {v} \cdot \vec {v} \\
d &= \vec {u} \cdot \vec {w_{0}} \\
e &= \vec {v} \cdot \vec {w_{0}}
\end{align}
\]
</p>

代入公式2和公式3则可得：

<p>
\[
\begin{align}
a s_{c} - b t_{c} &= -d \\
b s_{c} - c t_{c} &= -e
\end{align}
\]
</p>

<p>
求解\(t_{c}\)：
</p>

<p>
\[
\begin{align}
a s_{c} &= b t_{c} -d \\
b s_{c} &= c t_{c} -e
\end{align}
\]
</p>

两者相除：

<p>
\[
\begin{align}
\frac{a}{b} &= \frac{b t_{c} -d}{c t_{c} -e} \\
ac t_{c} - ae &= b^{2} t_{c} - bd \\
(ac - b^{2}) t_{c} &= ae - bd \\
t_{c} &= \frac{ae - bd}{ac - b^{2}}  （公式5）
\end{align}
\]
</p>

<p>
求解\(s_{c}\)：
</p>

<p>
\[
\begin{align}
b t_{c} &= a s_{c} + d \\
c t_{c} &= b s_{c} +e
\end{align}
\]
</p>

两者相除：

<p>
\[
\begin{align}
\frac{b}{c} &= \frac{a s_{c} + d}{b s_{c} +e} \\
b^{2} s_{c} + be &= ac s_{c} + cd \\
be - cd &= (ac - b^{2}) s_{c} \\
s_{c} &= \frac{be - cd}{ac - b^{2}}  （公式4）
\end{align}
\]
</p>

<p>
注意到上式中分母：
</p>

<p>
\[
\begin{align}
ac - b^{2} &= (\vec {u} \cdot \vec {u}) \times (\vec {v} \cdot \vec {v}) - (\vec{u} \cdot \vec{v})^{2} \\
&= |\vec u|^{2} \times |\vec v|^{2} - (|\vec u| \times |\vec v| \times cos \theta )^{2} \\
&= (|\vec u| \times |\vec v| \times sin \theta )^{2} \ge 0
\end{align}
\]
</p>

<p>
当\(ac-b^{2} = 0\)时，公式2和公式3相互独立，则两直线平行，直线间的距离为一常数，我们可以在任意一条直线上指定一个固定点，
然后代入公式求距离。我们可以指定\(s_{c} = 0\)，然后可以求得\( t_{c} = \frac{d}{b} = \frac{e}{c} \)。
</p>

<p>
当求出\(s_{c}\)和\(t_{c}\)后，我们就可以求得\(s_{j}\)和\(t_{j}\)两点，则两点之间的距离可按下式求解：
</p>

<p>
\[
\begin{align}
d(l_{s}, l_{t}) &= |s_{j} - t_{j}| \\
&= |s_{0} - t_{0} + \frac{(be-cd)\vec {u}-(ae-bd)\vec{v}}{ac-b^{2}}|
\end{align}
\]
</p>

