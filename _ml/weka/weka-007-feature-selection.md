---
title: "Feature Selection"
sequence: "107"
---

Raw machine learning data contains a mixture of attributes,
some of which are relevant to making predictions.
How do you know which features to use and which to remove?
The process of selecting features in your data to model your problem is called **feature selection**.

## Correlation Based Feature Selection

A popular technique for selecting the most relevant attributes in your dataset is to use **correlation**.
More formally, correlation can be calculated to determine how much two variables change together,
either in the same or differing directions on the number line.
You can calculate the correlation between **each attribute** and **the output variable** and
select only those attributes that have a moderate-to-high positive or negative correlation (close to -1 or 1) and
drop those attributes with a low correlation (value close to zero).

Weka supports correlation based feature selection with the `CorrelationAttributeEval` technique
that requires use of a `Ranker` Search Method.

## Information Gain Based Feature Selection

Another popular feature selection technique is to calculate the **information gain**.
You can calculate the **information gain** (also called **entropy**) for each attribute for the output variable.
Entry values vary from `0` (no information) to `1` (maximum information).
Those attributes that contribute more information will have a higher information gain value and can be selected,
whereas those that do not add much information will have a lower score and can be removed.

Weka supports feature selection via information gain using the `InfoGainAttributeEval` Attribute Evaluator.
Like the correlation technique above, the `Ranker` Search Method must be used.

## Learner Based Feature Selection

A popular feature selection technique is to use a generic but powerful learning algorithm and
evaluate the performance of the algorithm on the dataset with different subsets of attributes selected.
The subset that results in the best performance is taken as the selected subset.
The algorithm used to evaluate the subsets does not have to be the algorithm
that you intend to use to model your problem,
but it should be generally quick to train and powerful, like a decision tree method.

In Weka this type of feature selection is supported by the `WrapperSubsetEval` technique and
must use a `GreedyStepwise` or `BestFirst` Search Method.
The latter, `BestFirst`, is preferred if you can spare the compute time.

## Select Attributes in Weka


