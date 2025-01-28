---
title: "Linear Regression"
sequence: "102"
---

Linear Regression can be used for both classification and estimation problems.
It is one of the most widely used methods in practice.
It consists of finding the best-fitting hyperplane through the data points.

## Algorithm input and output

Features must be numeric.
Categorical features are transformed using various preprocessing techniques,
as when a categorical value becomes a feature with `1` and `0` values.

```text
- linear regress model
    - input: numeric
```

Linear Regression models output a categorical class in classification or numeric values in regression.
Many implementations also give confidence values.

```text
- linear regress model
    - output:
        - classification: categorical class
        - regression    : numeric
```

## How does it work?

The model tries to learn a "hyperplane" in the input space
that minimizes the error between the data points of each class.




