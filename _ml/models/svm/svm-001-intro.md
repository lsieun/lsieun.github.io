---
title: "SVM Intro"
sequence: "101"
---

支持向量机 SVM Support Vector Machine

## Origin

SVMs were first introduced by B.E. Boser et al. in 1992 and have become popular
because of success in handwritten digit recognition in 1994.


The algorithm of SVMs is powerful, but the concepts behind are not as complicated as you think.





## 解决的问题

- regression
- classification

The **support vector machine** (**SVM**) is used for solving both **regression** and **classification** problems.
However, they are mostly used in solving **classification** problems.

The algorithm is used for a wide range of tasks
such as **text classification**, **handwriting and face recognition**,
and **identification of genes**, among others.

## 优势

The support vector machine (SVM) algorithm is a machine learning algorithm widely used
because of its high performance, flexibility, and efficiency.
In most cases, you can use it on terabytes of data,
and it will still be much faster and cheaper than working with **deep neural networks**.

## 有没有衰落

Before the emergence of boosting algorithms, for example XGBoost and AdaBoost, SVMs had been commonly used.

## Types of Support Vector Machines

[Link](https://www.spiceworks.com/tech/big-data/articles/what-is-support-vector-machine/)

Support vector machines are broadly classified into two types:
**simple or linear SVM** and **kernel or non-linear SVM**.

### Simple or linear SVM

A linear SVM refers to the SVM type used for classifying linearly separable data.
This implies that when a dataset can be segregated into categories or classes with the help of a single straight line,
it is termed a linear SVM, and the data is referred to as linearly distinct or separable.
Moreover, the classifier that classifies such data is termed a linear SVM classifier.

A simple SVM is typically used to address classification and regression analysis problems.

### Kernel or non-linear SVM

Non-linear data that cannot be segregated into distinct categories
with the help of a straight line is classified using a kernel or non-linear SVM.
Here, the classifier is referred to as a non-linear classifier.
The classification can be performed with a non-linear data type by adding features into higher dimensions
rather than relying on 2D space.
Here, the newly added features fit a hyperplane that helps easily separate classes or categories.

Kernel SVMs are typically used to handle optimization problems that have multiple variables.

## 概念

```text
SVM --> supervised learning --> classification
决策边界：decision boundary
间隔：Margin
间隔距离，可以体现出两类数据的差异大小
超平面：hyperplane

普遍的情况 --> 特殊情况的考虑

maximum margin --> hyperplane
Hard Margin
Soft Margin
损失因子：

升维转换 --> 维度转换函数
核技巧：Kernel Trick
```

## Problem with Logistic Regression

Logistic regression helps solve classification problems separating the instances into two classes.
However, there is an infinite number of decision boundaries, and logistic regression only picks an arbitrary one.

Logistic regression doesn't care if the instances are close to the decision boundary.
Therefore, the decision boundary it picks may not be optimal.
If a point is far from the decision boundary, we may be more confident in our predictions.
Therefore, the optimal decision boundary should be able to
maximize the distance between the decision boundary and all instances (i.e., maximize the margins).
That's why the SVM algorithm is important!.

## What Are SVMs?

Given a set of training examples, each marked as belonging to one or the other of two categories,
an SVM training algorithm builds a model that assigns new examples to one category or the other,
making it a nonprobabilistic binary linear classifier.

The objective of applying SVMs is to find the best line in two dimensions
or the best **hyperplane** in more than two dimensions in order to help us separate our space into classes.
The **hyperplane** (line) is found through the **maximum margin**
(i.e., the maximum distance between data points of both classes).

## Support Vector Machines

Imagine a labeled training set is two classes of data points (two dimensions): Alice and Cinderella.
To separate the two classes, there are so many possible options of hyperplanes that separate correctly.
We can achieve exactly the same result using different hyperplanes.
However, if we add new data points,
the consequence of using various hyperplanes will be very different
in terms of classifying new data point into the right group of class.

With SVM, data from each category located the closest to other categories is marked as
the standard, and the decision boundary is determined using the standard so that
the sum of the Euclidean distance from each marked data and the boundary is
maximized. This marked data is called support vectors. Simply put, SVM sets the
decision boundary in the middle point where the distance from every pattern is
maximized. Therefore, what SVM does in its algorithm is known as maximizing the
margin. The following is the figure of the concept of SVM:

## Reference

文章：

- [What is a Support Vector?](https://programmathically.com/what-is-a-support-vector/)
- [A Top Machine Learning Algorithm Explained: Support Vector Machines (SVM)](https://www.kdnuggets.com/2020/03/machine-learning-algorithm-svm-explained.html)
- [Support Vector Machine — Introduction to Machine Learning Algorithms](https://towardsdatascience.com/support-vector-machine-introduction-to-machine-learning-algorithms-934a444fca47)
- [Support Vector Machine Algorithm](https://www.javatpoint.com/machine-learning-support-vector-machine-algorithm)
- [Support Vector Machines (SVM) Algorithm Explained](https://monkeylearn.com/blog/introduction-to-support-vector-machines-svm/)
- [Support Vector Machines](https://scikit-learn.org/stable/modules/svm.html)
- [What Is a Support Vector Machine? Working, Types, and Examples](https://www.spiceworks.com/tech/big-data/articles/what-is-support-vector-machine/)
- [Support Vector Machine Algorithm](https://serokell.io/blog/support-vector-machine-algorithm)

视频：

- [【数之道】支持向量机SVM是什么](https://www.bilibili.com/video/BV16T4y1y7qj/)
