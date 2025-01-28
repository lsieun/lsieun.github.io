---
title: "Weka Datasets"
sequence: "104"
---

## Binary Classification Datasets

### Pima Indians Onset of Diabetes

Each instance represents medical details for one patient and the task is to predict
whether the patient will have an onset of diabetes within the next five years.
There are 8 numerical input variables all of which have varying scales.

- Dataset File: data/diabetes.arff
- More Info: https://archive.ics.uci.edu/ml/datasets/Pima+Indians+Diabetes
- Top results are in the order of 77% accuracy: http://www.is.umk.pl/projects/datasets.html#Diabetes

### Breast Cancer

Each instance represents medical details of patients and samples of their tumor tissue and the
task is to predict whether or not the patient has breast cancer.
There are 9 input variables all of which a nominal.

```text
https://archive.ics.uci.edu/dataset/14/breast+cancer
```

- Dataset File: data/breast-cancer.arff
- More Info: https://archive.ics.uci.edu/ml/datasets/Breast+Cancer
- Top results are in the order of 75% accuracy: http://www.is.umk.pl/projects/datasets.html#Ljubljana

### Ionosphere

Each instance describes the properties of radar returns from the atmosphere and
the task is to predict whether or not there is structure in the ionosphere.
There are 34 numerical input variables of generally the same scale.

- Dataset File: data/ionosphere.arff
- More Info: https://archive.ics.uci.edu/ml/datasets/Ionosphere
- Top results are in the order of 98% accuracy: http://www.is.umk.pl/projects/datasets.html#Ionosphere

## Multiclass Classification Datasets

### Iris Flowers Classification

Each instance describes measurements of iris flowers and
the task is to predict to which species of 3 iris flower the observation belongs.
There are 4 numerical input variables with the same units and generally the same scale.

- Dataset File: data/iris.arff
- More Info: https://archive.ics.uci.edu/ml/datasets/Iris

### Large Soybean Database

Each instance describes properties of a crop of soybeans and
the task is to predict which of the 19 diseases the crop suffers.
There are 35 nominal input variables.

- Dataset File: data/soybean.arff
- More Info: https://archive.ics.uci.edu/ml/datasets/Soybean+(Large)

### Glass Identification

Each instance describes the chemical composition of samples of glass and
the task is to predict the type or use of the class from one of 7 classes.
There are 10 numeric attributes that describe the chemical properties of the glass and its refractive index.

- Dataset File: data/glass.arff
- More Info: https://archive.ics.uci.edu/ml/datasets/Glass+Identification

## Regression Datasets

```text
https://waikato.github.io/weka-wiki/datasets/
https://prdownloads.sourceforge.net/weka/datasets-numeric.jar
```

### Longley Economic Dataset

Each instance describes the gross economic properties of a nation for a given year and
the task is to predict the number of people employed as an integer.
There are 6 numeric input variables of varying scales.

- Dataset File: numeric/longley.arff

### Boston House Price Dataset

Each instance describes the properties of a Boston suburb and
the task is to predict the house prices in thousands of dollars.
There are 13 numerical input variables with varying scales describing the properties of suburbs.

- Dataset File: numeric/housing.arff
- More Info: https://archive.ics.uci.edu/ml/datasets/Housing

### Sleep in Mammals Dataset

Each instance describes the properties of different mammals and
the task is to predict the number of hours of total sleep they require on average.
There are 7 numeric input variables of different scales and measures.

- Dataset File: numeric/sleep.arff
