---
title: "Data"
sequence: "110"
---

UC Irvine Machine Learning Repository:

```text
https://archive.ics.uci.edu/
https://archive.ics.uci.edu/datasets
```

## Iris

```text
https://archive.ics.uci.edu/dataset/53/iris
```

Iris 数据集是常用的分类实验数据集，由Fisher, 1936 年收集整理。
Iris 也称**鸢尾花卉数据集**，是一类多重变量分析的数据集。
数据集包含 150 个数据样本，分为 3 类，每类 50 个数据，每个数据包含 4 个属性。
可通过花萼长度，花萼宽度，花瓣长度，花瓣宽度 4 个属性，
来预测鸢尾花卉属于（Setosa，Versicolour，Virginica）三个种类中的哪一类。

iris 以鸢尾花的特征作为数据来源，常用在分类操作中。
该数据集由 3 种不同类型的鸢尾花的各 50 个样本数据构成。
其中的一个种类与另外两个种类是**线性可分离**的，后两个种类是**非线性可分离**的。

该数据集包含了 4 个属性：

- `Sepal.Length`（花萼长度），单位是 `cm`;
- `Sepal.Width`（花萼宽度），单位是 `cm`;
- `Petal.Length`（花瓣长度），单位是 `cm`;
- `Petal.Width`（花瓣宽度），单位是 `cm`;

- 种类：Iris Setosa（山鸢尾）、Iris Versicolour（杂色鸢尾），以及Iris Virginica（维吉尼亚鸢尾）。

![](/assets/images/ml/iris.png)

![](/assets/images/ml/iris.svg)


## Energy efficiency

```text
https://archive.ics.uci.edu/dataset/242/energy+efficiency
```

This study looked into assessing the heating load and cooling load requirements of buildings
(that is, energy efficiency) as a function of building parameters.

### Information

Additional Information

We perform energy analysis using 12 different building shapes simulated in Ecotect.
The buildings differ with respect to the glazing area, the glazing area distribution, and the orientation,
amongst other parameters.
We simulate various settings as functions of the afore-mentioned characteristics to obtain 768 building shapes.
The dataset comprises 768 samples and 8 features, aiming to predict two real valued responses.
It can also be used as a multi-class classification problem if the response is rounded to the nearest integer.

### Attribute Information

The dataset contains eight attributes (or features, denoted by X1...X8) and
two responses (or outcomes, denoted by y1 and y2).
The aim is to use the eight features to predict each of the two responses.

Specifically:

- X1: Relative Compactness
- X2: Surface Area
- X3: Wall Area
- X4: Roof Area
- X5: Overall Height
- X6: Orientation
- X7: Glazing Area
- X8: Glazing Area Distribution
- y1: Heating Load
- y2: Cooling Load

## KDD

KDD CUP ARCHIVES = Special Interest Group on Knowledge Discovery and Data Mining

```text
https://www.kdd.org/kdd-cup
```
