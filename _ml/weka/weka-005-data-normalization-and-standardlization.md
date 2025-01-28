---
title: "Normalize and Standardize"
sequence: "105"
---

## Data normalization

Data normalization is the process of rescaling one or more attributes to the range of 0 to 1.
This means that the largest value for each attribute is 1 and the smallest value is 0.

Normalization is a good technique to use
when you do not know the distribution of your data or when you know the distribution is not Gaussian (a bell curve).

Normalization is useful when your data has varying scales and the algorithm
you are using **does not make assumptions about the distribution of your data**,
such as k-Nearest Neighbors and Artificial Neural Networks.

- select the `unsupervised.attribute.Normalize` filter

## Data standardization

Data standardization is the process of rescaling one or more attributes
so that they have a mean value of 0 and a standard deviation of 1.

Standardization assumes that your data has a Gaussian (bell curve) distribution.
This does not strictly have to be true, but the technique is more effective if your attribute distribution is Gaussian.
You can standardize all of the attributes in your dataset with Weka
by choosing the `Standardize` filter and applying it your dataset.

Standardization is useful when your data has varying scales and the algorithm
you are using **does make assumptions** about your data having a **Gaussian distribution**,
such as linear regression, logistic regression and linear discriminant analysis.

- select the `unsupervised.attribute.Standardize` filter.

