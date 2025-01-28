---
title: "Weka 回归"
sequence: "115"
---

## Linear Regression

```java
import weka.classifiers.Evaluation;
import weka.classifiers.functions.LinearRegression;
import weka.core.Instances;
import weka.core.converters.CSVLoader;
import weka.filters.Filter;
import weka.filters.unsupervised.attribute.Remove;

import java.io.File;
import java.util.Random;

public class RegressionWeka {
    public static void main(String[] args) throws Exception {
        // 第 1 步，加载数据
        CSVLoader loader = new CSVLoader();
        loader.setFieldSeparator(",");
        loader.setSource(new File("data/ENB2012_data.csv"));
        Instances data = loader.getDataSet();

        // 第 2 步，数据处理
        Filter removeFilter = new Remove();
        removeFilter.setOptions(new String[]{"-R", data.numAttributes() + ""});
        removeFilter.setInputFormat(data);
        data = Filter.useFilter(data, removeFilter);

        data.setClassIndex(data.numAttributes() - 1);

        // 第 3 步，选择模型算法
        LinearRegression model = new LinearRegression();
        model.buildClassifier(data);
        System.out.println(model);

        // 第 4 步，模型评估
        Evaluation eval = new Evaluation(data);
        eval.crossValidateModel(model, data, 10, new Random(1), new String[]{});
        String summary = eval.toSummaryString();
        System.out.println(summary);
    }
}
```

## Regression Trees

```java
import weka.classifiers.Evaluation;
import weka.classifiers.trees.M5P;
import weka.core.Instances;
import weka.core.converters.CSVLoader;
import weka.filters.Filter;
import weka.filters.unsupervised.attribute.Remove;

import java.io.File;
import java.util.Random;

public class RegressionWeka {
    public static void main(String[] args) throws Exception {
        // 第 1 步，加载数据
        CSVLoader loader = new CSVLoader();
        loader.setFieldSeparator(",");
        loader.setSource(new File("data/ENB2012_data.csv"));
        Instances data = loader.getDataSet();

        // 第 2 步，数据处理
        Filter removeFilter = new Remove();
        removeFilter.setOptions(new String[]{"-R", data.numAttributes() + ""});
        removeFilter.setInputFormat(data);
        data = Filter.useFilter(data, removeFilter);

        data.setClassIndex(data.numAttributes() - 1);

        // 第 3 步，选择模型算法
        M5P model = new M5P();
        model.setOptions(new String[]{""});
        model.buildClassifier(data);
        System.out.println(model);

        // 第 4 步，模型评估
        Evaluation eval = new Evaluation(data);
        eval.crossValidateModel(model, data, 10, new Random(1), new String[]{});
        String summary = eval.toSummaryString();
        System.out.println(summary);
    }
}
```
