---
title: "Weka API"
sequence: "111"
---

在 Weka 的安装目录下，有一个 `WekaManual.pdf` 文件，其 `Chapter 18 Using the API` 用来介绍 Java API。

## Java API

Weka's Java API is organized into the following top-level packages:

- `weka.associations`: These are data structures and algorithms for association rules learning,
  including Apriori, predictive Apriori, FilteredAssociator, FP-Growth, Generalized Sequential Patterns (GSP), hotSpot,
  and Tertius.
- `weka.classifiers`: These are supervised learning algorithms, evaluators, and data structures.
  The package is further split into the following components:
    - `weka.classifiers.bayes`: This implements Bayesian methods,
      including Naive Bayes, Bayes net, Bayesian logistic regression, and so on.
    - `weka.classifiers.evaluation`: These are supervised evaluation algorithms for nominal and numerical prediction,
      such as evaluation statistics, confusion matrix, ROC curve, and so on.
    - `weka.classifiers.functions`: These are regression algorithms,
      including linear regression, isotonic regression, Gaussian processes,
      **Support Vector Machines (SVMs)**, multilayer perceptron, voted perceptron, and others.
    - `weka.classifiers.lazy`: These are instance-based algorithms
      such as k-nearest neighbors, K*, and lazy Bayesian rules.
    - `weka.classifiers.meta`: These are supervised learning meta-algorithms,
      including AdaBoost, bagging, additive regression, random committee, and so on.
    - `weka.classifiers.mi`: These are multiple-instance learning algorithms,
      such as citation k-nearest neighbors, diverse density, AdaBoost, and others.
    - `weka.classifiers.rules`: These are decision tables and decision rules based on the separate-and-conquer approach,
      RIPPER, PART, PRISM, and so on.
    - `weka.classifiers.trees`: These are various decision trees algorithms,
      including ID3, C4.5, M5, functional tree, logistic tree, random forest, and so on.
- `weka.clusterers`: These are clustering algorithms,
  including k-means, CLOPE, Cobweb, DBSCAN hierarchical clustering, and FarthestFirst.
- `weka.core` : These are various utility classes
  such as the attribute class, statistics class, and instance class.
- `weka.datagenerators`: These are data generators for classification, regression, and clustering algorithms.
- `weka.estimators`: These are various data distribution estimators for discrete/nominal domains,
  conditional probability estimations, and so on.
- `weka.experiment`: These are a set of classes supporting necessary configuration,
  datasets, model setups, and statistics to run experiments.
- `weka.filters`: These are attribute-based and instance-based selection algorithms
  for both supervised and unsupervised data preprocessing.
- `weka.gui`: These are graphical interface implementing explorer, experimenter, and knowledge flow applications.
    - The Weka Explorer allows you to investigate datasets, algorithms, as well as their parameters,
      and visualize datasets with scatter plots and other visualizations.
    - The Weka Experimenter is used to design batches of experiments,
      but it can only be used for classification and regression problems.
    - The Weka KnowledgeFlow implements a visual drag-and-drop user interface to build data flows and,
      for example, load data, apply filter, build classifier, and evaluate it.
