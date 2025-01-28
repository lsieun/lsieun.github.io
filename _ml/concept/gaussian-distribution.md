---
title: "Gaussian Distribution"
sequence: "gaussian-distribution"
---

Once you understand the **taxonomy of data**,
you should learn to apply a few essential foundational concepts
that help describe the data using a set of statistical methods.

Before we dive into data and its distribution,
we should understand the difference between two very important keywords - **sample** and **population**.

A **sample** is a snapshot of data from a larger dataset.
This larger dataset which is all of the data that could be possibly collected is called **population**.

In statistics, the **population** is a broad, defined, and often theoretical set of all possible observations
that are generated from an experiment or from a domain.

**Observations** in a **sample** dataset often fit a certain kind of distribution
which is commonly called **normal distribution**, and formally called **Gaussian distribution**.
This is the most studied distribution, and there is an entire sub-field of statistics dedicated to Gaussian data.

## What is normal or Guassian distributon?

When we plot a dataset such as a histogram, the shape of that charted plot is what we call its **distribution**.
The most commonly observed shape of continuous values is the **bell curve**,
which is also called the **Gaussian or normal distribution**.

It is named after the German mathematician, Carl Friedrich Gauss.
Some common example datasets that follow Gaussian distribution are:

- Body temperature
- People's Heights
- Car mileage
- IQ scores

## Estimates of Location

A fundamental step in exploring a dataset is getting **a summarized value** for each feature or variable.
This is commonly an estimate of where most of the data is located, or in other words, the **central tendency**.

At first, summarizing the data might sound like a piece of cake – just take the **mean** of the data.
In reality, although the **mean** is very easy to compute and use,
**it may not always be the best measure for the central value.**

To solve this problem, statisticians have developed alternative estimates to mean.

### Mean

The sum of all values divided by the number of values, also known as the average.

### Weighted mean

The sum of all values times a weight divided by the sum of the weights.
This is also known as the weighted average.

Here are two main motivations for using a weighted mean:

- Some observations are intrinsically more variable (high standard deviation) than others,
  and highly variable observations are given a lower weight.
- The collected data does not equally represent the different groups that we are interested in measuring.

### Median

The value that separates one half of the data from the other, thus dividing it into a higher and lower half.
This is also called the 50th percentile.

### Percentile

The value such that P percent of the data lies below, also known as **quantile**.

### Weighted median

The value such that one half of the sum of the weights lies above and below the sorted data.

### Trimmed mean

The average of all values after **dropping a fixed number of extreme values.**

A trimmed mean eliminates the influence of extreme values.
For example, while judging an event,
we can calculate the final score using the trimmed mean of all the scores so that no judge can manipulate the result.

This is also known as the truncated mean.

### Outlier

An outlier, or extreme value, is a data value that is very different from most of the data.
The median is referred to as a robust estimate of location since it is not influenced by outliers,
i.e. extreme cases whereas the mean is sensitive to outliers.

## Estimates of Variability

Besides **location**, we have another method of summarizing a feature.
**Variability**, also referred to as dispersion, tells us how spread-out or clustered the data is.

### Deviations

The difference between the **observed values** and **the estimate of location**.
Deviations are sometimes called **errors** or **residuals**.

### Variance

**The sum of squared deviations from the mean** divided by `n - 1`
where `n` is the number of data values.
This is also called the **mean-squared-error**.

```text
均方差
```

### Standard deviation

The square root of the **variance**.

### Mean absolute deviation

The **mean** of the **absolute values of the deviations from the mean**.
This is also referred to as the **l1-norm** or **Manhattan norm**.

### Median absolute deviation from the median

The median of the absolute values of the deviations from the median.

### Range

The difference between the largest and the smallest value in a data set.

## Reference

- [How to Explain Data Using Gaussian Distribution and Summary Statistics with Python](https://www.freecodecamp.org/news/how-to-explain-data-using-gaussian-distribution-and-summary-statistics-with-python/)
