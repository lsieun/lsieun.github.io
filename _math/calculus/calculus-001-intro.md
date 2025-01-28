---
title: "微积分介绍"
sequence: "101"
---

## 注意区分

<p>
\(\Delta x = dx \)，但是 \(\Delta y\) 与 \(dy\) 是不一样的：
</p>

<ul>
  <li>\(\Delta y\) 是 \(dx\) 的<b>曲线</b>增量</li>
  <li>\(dy\) 是 \(dx\) 的<b>切线</b>增量</li>
  <li>\(\Delta y = dy + o(\Delta x)\)</li>
</ul>

## 定积分的性质

<p>
$$
\int_{a}^{b}[f(x)  \pm g(x)]dx = \int_{a}^{b}f(x)dx \pm \int_{a}^{b} g(x) dx
$$
</p>

<p>
$$
\int_{a}^{b} k f(x) dx = k \int_{a}^{b} f(x) dx
$$
</p>

在上式中，`k` 为常数。

<p>
假设 \( a < c < b \)，则
</p>

<p>
$$
\int_{a}^{b} f(x) dx = \int_{a}^{c} f(x) dx + \int_{c}^{b} f(x) dx
$$
</p>

<p>
如果在区间 \([a,b]\) 上，\(f(x) \ge 0\)，则
</p>

<p>
$$
\int_{a}^{b} f(x) dx \ge 0
$$
</p>

### 第一中值定理

<p>
如果函数 \(f(x)\) 在闭区间 \([a,b]\) 上连续，则在积分区间 \([a,b]\) 上至少存在一个点 \(\xi\)，使
</p>

<p>
$$
\int_{a}^{b} f(x) dx = f(\xi)(b - a). \qquad (a \le \xi \le b)
$$
</p>

### 积分上限函数

<p>
函数 \(f(x)\) 在区间 \([a,b]\) 上连续，对于定积分 \(\int_{a}^{x} f(x) dx\) 每一个取值的 \(x\) 都有一个对应的定积分值，记作
</p>

<p>
$$
\Phi(x) = \int_{a}^{x} f(t) dt
$$
</p>

<p>
如果 \(f(x)\) 在区间 \([a,b]\) 上连续，则积分上限函数 \(\Phi(x)\) 就是 \(f(x)\) 在 \([a,b]\) 上的原函数。
</p>

## 牛顿-茉布尼茨公式

<p>
如果 \(F(x)\) 是连续函数 \(f(x)\) 在区间 \([a,b]\) 上的一个原函数，则
</p>

<p>
$$
\int_{a}^{b} f(x) dx = F(b) - F(a)
$$
</p>

<p>
解释：一个连续函数在区间 \([a,b]\) 上的定积分等于它的任意一个原函数在区间 \([a,b]\) 上的增量。
</p>


## Reference

- [30分钟微积分通俗讲解](https://www.bilibili.com/video/BV1K64y1Y7hZ/) 视频讲的挺好的
    - 极限 --> 微分、积分、导数
- [原来【微积分】可以这么简单？30分钟带你快速掌握！](https://www.bilibili.com/video/BV1kD4y1v7Y2/?p=5)
