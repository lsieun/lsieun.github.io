---
title: "ARFF file format"
sequence: "103"
---

Weka has a specific computer science centric vocabulary when describing data:

- **Instance**: A row of data is called an instance, as in an instance or observation from the problem domain.
- **Attribute**: A column of data is called a feature or attribute, as in feature of the observation.



## ARFF 文件格式

**Weka prefers to load data in the ARFF format.**
**ARFF** is an acronym that stands for **Attribute-Relation File Format**.

It is an extension of the CSV file format
where a header is used that provides metadata about the data types in the columns.

`iris.arff` 文件位于 `WEKA_HOME/data`目录：

```text
@RELATION iris

@ATTRIBUTE sepallength	REAL
@ATTRIBUTE sepalwidth 	REAL
@ATTRIBUTE petallength 	REAL
@ATTRIBUTE petalwidth	REAL
@ATTRIBUTE class 	{Iris-setosa,Iris-versicolor,Iris-virginica}

@DATA
5.1,3.5,1.4,0.2,Iris-setosa
4.9,3.0,1.4,0.2,Iris-setosa
4.7,3.2,1.3,0.2,Iris-setosa
4.6,3.1,1.5,0.2,Iris-setosa
```

在 `.arff` 文件中，

- Lines in an ARFF file that start with a percentage symbol (`%`) indicate a comment.
- directives 以 `@` 开头。

### Header

- the name of the dataset:`@RELATION iris`
- the name and datatype of each attribute: `@ATTRIBUTE sepallength REAL`

### Data

- the start of the raw data (e.g. `@DATA`).
- Values in the raw data section that have a question mark symbol (`?`) indicate an **unknown or missing value**.

## ARFF 数据类型

Each attribute can have a different type, for example:

- **Real** for numeric values like 1.2.
- **Integer** for numeric values without a fractional part like 5.
- **Nominal** for categorical data like dog and cat.
- **String** for lists of words, like this sentence.

The format supports numeric and categorical values as in the iris example above,
but also supports **dates** and **string** values.
