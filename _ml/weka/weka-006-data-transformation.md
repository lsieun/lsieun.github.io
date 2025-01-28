---
title: "Data Transformation"
sequence: "106"
---

## Discretization

Some machine learning algorithms prefer or find it easier to work with discrete attributes.
For example, decision tree algorithms can choose split points in real valued attributes,
but are much cleaner when split points are chosen between bins or predefined groups in the real-valued attributes.

Discrete attributes are those that describe a category, called **nominal attributes**.
Those attributes that describe a category that
where **there is a meaning in the order** for the categories are called **ordinal attributes**.
The process of converting a real-valued attribute into an **ordinal attribute** or bins is called **discretization**.

```text
discretization: real-valued attribute --> nominal attribute --> ordinal attribute
```

Discretizing your real valued attributes is most useful when working with decision tree type algorithms.
It is perhaps more useful when you believe that there are natural groupings within
the values of given attributes.

- select the `unsupervised.attribute.Discretize` filter.

## Dummy Variables

Some machine learning algorithms prefer to use real valued inputs and do not support nominal or ordinal attributes.
Nominal attributes can be converted to real values.
This is done by creating one new binary attribute for each category.
For a given instance that has a category for that value, the binary attribute is set to 1 and
the binary attributes for the other categories is set to 0.
This process is called **creating dummy variables**.

Creating dummy variables is useful for techniques that do not support nominal input variables
like linear regression and logistic regression.
It can also prove useful in techniques like k-nearest neighbors and artificial neural networks.

- the `unsupervised.attribute.NominalToBinary` filter.
