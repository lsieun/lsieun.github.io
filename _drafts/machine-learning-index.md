---
title: "Machine Learning"
image: /assets/images/ml/machine-learning-cover.png
permalink: /machine-learning.html
---

Machine learning (ML) is an umbrella term for solving problems
for which development of algorithms by human programmers would be cost-prohibitive,
and instead the problems are solved by helping machines 'discover' their 'own' algorithms,
without needing to be explicitly told what to do by any human-developed algorithms.

- CML: Classic machine learning

## Basic

{%
assign filtered_posts = site.ml |
where_exp: "item", "item.url contains '/ml/basic/'" |
sort: "sequence"
%}
<ol>
    {% for post in filtered_posts %}
    {% assign num = post.sequence | abs %}
    <li>
        <a href="{{ post.url }}">{{ post.title }}</a>
    </li>
    {% endfor %}
</ol>

## Weka

{%
assign filtered_posts = site.ml |
where_exp: "item", "item.url contains '/ml/weka/'" |
sort: "sequence"
%}
<ol>
    {% for post in filtered_posts %}
    {% assign num = post.sequence | abs %}
    <li>
        <a href="{{ post.url }}">{{ post.title }}</a>
    </li>
    {% endfor %}
</ol>

## Models

<table>
    <thead>
    <tr>
        <th>Linear Models</th>
        <th>Non-Linear Models</th>
        <th>Ensemble Learning and Meta Learners</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>
{%
assign filtered_posts = site.ml |
where_exp: "item", "item.url contains '/ml/models/linear/'" |
sort: "sequence"
%}
<ol>
    {% for post in filtered_posts %}
    {% assign num = post.sequence | abs %}
    <li>
        <a href="{{ post.url }}">{{ post.title }}</a>
    </li>
    {% endfor %}
</ol>
        </td>
        <td></td>
        <td></td>
    </tr>
    </tbody>
</table>

## SVM

{%
assign filtered_posts = site.ml |
where_exp: "item", "item.url contains '/ml/models/svm/'" |
sort: "sequence"
%}
<ol>
    {% for post in filtered_posts %}
    {% assign num = post.sequence | abs %}
    <li>
        <a href="{{ post.url }}">{{ post.title }}</a>
    </li>
    {% endfor %}
</ol>

## Spark MLlib



## Other

- [Deep Java Library](https://docs.djl.ai/)

Deep Java Library (DJL) is an open-source, high-level, engine-agnostic Java framework for deep learning.
DJL is designed to be easy to get started with and simple to use for Java developers.
DJL provides a native Java development experience and functions like any other regular Java library.

1. Weka：Weka 是机器学习的 Java 类库，它提供了许多算法如分类、回归、聚类、关联规则等。
   Weka 已经成为了机器学习领域的重要实验平台，是 Java 中最流行的机器学习工具之一。

2. Mahout：Mahout 是 Apache 基金会下的一个顶级项目，提供了大规模机器学习的 Java 库。
   Mahout 主要用于处理海量数据，支持多种算法如分类、聚类、推荐、降维等。

3. DL4J：DL4J 是一个基于深度学习的 Java 库，可以实现各种神经网络模型如卷积神经网络、循环神经网络等。DL4J 的优势在于其快速的训练速度和可扩展性。

4. Smile：Smile 是一个快速、高效的机器学习 Java 库，支持多种算法如分类、聚类、降维、神经网络等。
   Smile 提供了许多高级工具如特征选择、模型选择、交叉验证等，可以帮助用户更好地优化模型。

5. SuanFa：SuanFa 是一个 Java 机器学习库，提供了多种算法如聚类、分类、回归、降维等。
   SuanFa 支持多种数据类型如文本、图像、音频等，并提供了更高级的特征工程工具和模型调整工具。

6. H2O：H2O 是一种快速、可扩展的分布式机器学习平台，支持多种算法如分类、回归、聚类、降维等。
   H2O 的特点在于其快速的训练速度和可扩展性，可以轻松地处理大型数据集。


## Reference

- [Overview of AI Libraries in Java](https://www.baeldung.com/java-ai)
- [Performing Calculations in the Database vs. the Application](https://www.baeldung.com/calculations-in-db-vs-app)
- [Quick Guide to Spring Roo](https://www.baeldung.com/spring-roo)

---

具体的 Java 算法：

- [The K-Means Clustering Algorithm in Java](https://www.baeldung.com/java-k-means-clustering-algorithm)
- [Matrix Multiplication in Java](https://www.baeldung.com/java-matrix-multiplication)

---

类库

- [A Guide to Deeplearning4j](https://www.baeldung.com/deeplearning4j)
- 遗传算法
    - [Introduction to Jenetics Library](https://www.baeldung.com/jenetics)
    - [Design a Genetic Algorithm in Java](https://www.baeldung.com/java-genetic-algorithm)

---

- [What Is Machine Learning?](https://ww2.mathworks.cn/en/discovery/machine-learning.html)
- [Machine Learning Tutorial – All the Essential Concepts in Single Tutorial](https://data-flair.training/blogs/machine-learning-tutorial/)
- [Machine Learning Tutorial for Beginners: What is, Basics of ML](https://www.guru99.com/machine-learning-tutorial.html)
- [What Is Reinforcement Learning?](https://ww2.mathworks.cn/en/discovery/reinforcement-learning.html)
- [What Is a Convolutional Neural Network?](https://ww2.mathworks.cn/en/discovery/convolutional-neural-network-matlab.html)
- [What Is Deep Learning?](https://ww2.mathworks.cn/en/discovery/deep-learning.html)
- [Why Predictive Maintenance Matters](https://ww2.mathworks.cn/en/discovery/predictive-maintenance-matlab.html)
- [What Is a Digital Twin?](https://ww2.mathworks.cn/en/discovery/digital-twin.html)
- [What Is Anomaly Detection?](https://ww2.mathworks.cn/en/discovery/anomaly-detection.html)
- [What Is Condition Monitoring?](https://ww2.mathworks.cn/en/discovery/condition-monitoring.html)
- [What Is Artificial Intelligence (AI)?](https://ww2.mathworks.cn/en/discovery/artificial-intelligence.html)
- [18 Machine Learning Tools That You Can't Go Without](https://serokell.io/blog/popular-machine-learning-tools)

---

文章系列

- [Machine Learning Mastery](https://machinelearningmastery.com/start-here/)
- [javatpoint: Machine Learning Tutorial](https://www.javatpoint.com/machine-learning)
- [datacamp.com: Machine Learning Tutorial](https://www.datacamp.com/tutorial/category/machine-learning)
- [scaler: Machine Learning Tutorial](https://www.scaler.com/topics/machine-learning/)
- [Machine Learning Tutorial](https://tutorialforbeginner.com/machine-learning-tutorial)
- [Machine Learning Tutorial - The Complete Guide(Updated)](https://intellipaat.com/blog/tutorial/machine-learning-tutorial/?US)
- [Intro to Machine Learning](https://www.kaggle.com/learn/intro-to-machine-learning)
- [Machine Learning Tutorial](https://www.tutorialspoint.com/machine_learning/index.htm)

---

B 站视频

- [机器学习算法](https://www.bilibili.com/video/BV1gu411j7bj/)
- [机器学习与深度学习课程](https://www.bilibili.com/video/BV1Ca411M7KA/)
- [2023 最通俗易懂的周志华《西瓜书》解读教程](https://www.bilibili.com/video/BV1j8411S7Kj)
- [机器学习 - 数学基础](https://www.bilibili.com/video/BV1ze411V7AU/)
- [机器学习中的数学基础](https://www.bilibili.com/video/BV1oV4y1474Q/)
- [线性代数动画课程](https://www.bilibili.com/video/BV1SA411G7FM/)
- [合集 · 数之道](https://space.bilibili.com/152254793/channel/collectiondetail?sid=1050)


Spark MLlib

- []()
