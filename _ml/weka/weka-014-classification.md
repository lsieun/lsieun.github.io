---
title: "Weka 分类"
sequence: "114"
---

## Feature Selection

Weka supports this process with an `AttributeSelection` object,
which requires two additional parameters:

- an **evaluator**, which computes how informative an attribute is, and
- a **ranker**, which sorts the attributes according to the score assigned by the evaluator.

## 简单

```java
import weka.classifiers.trees.J48;
import weka.core.Instances;
import weka.core.converters.ConverterUtils.DataSource;

public class ClassificationWekaIris {
    public static void main(String[] args) throws Exception {
        // 第 1 步，加载数据
        DataSource source = new DataSource("data/iris.arff");
        Instances data = source.getDataSet();
        data.setClassIndex(data.numAttributes() - 1);
        System.out.println(data.numInstances() + " instances loaded.");

        // 第 2 步，选择模型算法
        J48 model = new J48();
        String[] options = new String[1];
        options[0] = "-U";
        model.setOptions(options);

        // 第 3 步，求解模型
        model.buildClassifier(data);
        System.out.println(model);
    }
}
```

```text
150 instances loaded.

J48 unpruned tree
------------------

petalwidth <= 0.6: Iris-setosa (50.0)
petalwidth > 0.6
|   petalwidth <= 1.7
|   |   petallength <= 4.9: Iris-versicolor (48.0/1.0)
|   |   petallength > 4.9
|   |   |   petalwidth <= 1.5: Iris-virginica (3.0)
|   |   |   petalwidth > 1.5: Iris-versicolor (3.0/1.0)
|   petalwidth > 1.7: Iris-virginica (46.0/1.0)

Number of Leaves: 5
Size of the tree: 9
```

## 可视化

```java
import weka.classifiers.trees.J48;
import weka.core.Instances;
import weka.core.converters.ConverterUtils.DataSource;
import weka.gui.treevisualizer.PlaceNode2;
import weka.gui.treevisualizer.TreeVisualizer;

import javax.swing.*;

public class ClassificationWekaIris {
    public static void main(String[] args) throws Exception {
        // 第 1 步，加载数据
        DataSource source = new DataSource("data/iris.arff");
        Instances data = source.getDataSet();
        data.setClassIndex(data.numAttributes() - 1);
        System.out.println(data.numInstances() + " instances loaded.");

        // 第 2 步，选择模型算法
        J48 model = new J48();
        String[] options = new String[1];
        options[0] = "-U";
        model.setOptions(options);

        // 第 3 步，求解模型
        model.buildClassifier(data);
        System.out.println(model);

        // 第 4 步，模型显示
        TreeVisualizer tv = new TreeVisualizer(null, model.graph(), new PlaceNode2());
        JFrame frame = new javax.swing.JFrame("Tree Visualizer");
        frame.setSize(800, 500);
        frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        frame.getContentPane().add(tv);
        frame.setVisible(true);
        tv.fitToScreen();
    }
}
```

![](/assets/images/ml/weka/iris-classification-weka-j48-tree-view-swing.png)

We can build other classifiers by following the same steps:
initialize a classifier,
pass the parameters controlling the model complexity,
and call the `buildClassifier(Instances)` method.

## 使用模型

```java
import weka.classifiers.trees.J48;
import weka.core.DenseInstance;
import weka.core.Instance;
import weka.core.Instances;
import weka.core.converters.ConverterUtils.DataSource;

public class ClassificationWekaIris {
    public static void main(String[] args) throws Exception {
        // 第 1 步，加载数据
        DataSource source = new DataSource("data/iris.arff");
        Instances data = source.getDataSet();
        data.setClassIndex(data.numAttributes() - 1);
        System.out.println(data.numInstances() + " instances loaded.");

        // 第 2 步，模型算法
        J48 model = new J48();
        String[] options = new String[1];
        options[0] = "-U";
        model.setOptions(options);

        // 第 3 步，求解模型
        model.buildClassifier(data);
        System.out.println(model);

        // 第 4 步，准备新数据
        double[] array = new double[data.numAttributes()];
        array[0] = 5.1;
        array[1] = 3.5;
        array[2] = 1.4;
        array[3] = 0.2;
        Instance myUnknown = new DenseInstance(1.0, array);
        myUnknown.setDataset(data);

        // 第 5 步，使用模型
        double result = model.classifyInstance(myUnknown);
        System.out.println("result = " + result);
        System.out.println(data.classAttribute().value((int) result));
    }
}
```

```text
result = 0.0
Iris-setosa
```

## 模型评价

Weka offers an `Evaluation` class for implementing cross-validation.
We pass the **model**, **data**, **number of folds**, and **an initial random seed**.

```java
import weka.classifiers.Evaluation;
import weka.classifiers.trees.J48;
import weka.core.Instances;
import weka.core.converters.ConverterUtils.DataSource;

import java.util.Random;

public class ClassificationWekaIris {
    public static void main(String[] args) throws Exception {
        // 第 1 步，加载数据
        DataSource source = new DataSource("data/iris.arff");
        Instances data = source.getDataSet();
        data.setClassIndex(data.numAttributes() - 1);
        System.out.println(data.numInstances() + " instances loaded.");

        // 第 2 步，模型算法
        J48 model = new J48();
        String[] options = new String[1];
        options[0] = "-U";
        model.setOptions(options);

        // 第 3 步，求解模型
        model.buildClassifier(data);
        System.out.println(model);

        // 第 4 步，模型评价
        Evaluation eval = new Evaluation(data);
        eval.crossValidateModel(model, data, 10, new Random(1), new Object[] {});

        // 第 4.1 步，打印 Summary
        String summary = eval.toSummaryString();
        System.out.println("=== Summary ===");
        System.out.println(summary);
        System.out.println("---------------");

        // 第 4.2 步，打印 Confusion Matrix
        String confusionMatrixStr = eval.toMatrixString();
        double[][] confusionMatrix = eval.confusionMatrix();
        System.out.println(confusionMatrixStr);
    }
}
```

```text
=== Summary ===

Correctly Classified Instances         144               96 %
Incorrectly Classified Instances         6                4 %
Kappa statistic                          0.94  
Mean absolute error                      0.035 
Root mean squared error                  0.1586
Relative absolute error                  7.8705 %
Root relative squared error             33.6353 %
Total Number of Instances              150     

---------------
=== Confusion Matrix ===

  a  b  c   <-- classified as
 49  1  0 |  a = Iris-setosa
  0 47  3 |  b = Iris-versicolor
  0  2 48 |  c = Iris-virginica
```

## classification algorithm

Some other examples of classification algorithms are as follows:

- `weka.classifiers.rules.ZeroR`: This predicts the majority class and is considered a baseline;
  that is, if your classifier's performance is worse than the average value predictor, it is not worth considering it.
- `weka.classifiers.trees.RandomTree`: This constructs a tree that considers K randomly chosen attributes at each node.
- `weka.classifiers.trees.RandomForest`: This constructs a set (forest) of
  random trees and uses majority voting to classify a new instance.
- `weka.classifiers.lazy.IBk`: This is the k-nearest neighbors classifier
  that is able to select an appropriate value of neighbors, based on cross-validation.
- `weka.classifiers.functions.MultilayerPerceptron`: This is a classifier based on neural networks
  that uses backpropagation to classify instances.
  The network can be built by hand, or created by an algorithm, or both.
- `weka.classifiers.bayes.NaiveBayes`: This is a Naive Bayes classifier that uses estimator classes,
  where numeric estimator precision values are chosen based on the analysis of the training data.
- `weka.classifiers.meta.AdaBoostM1`: This is the class for boosting a nominal class classifier
  by using the AdaBoost M1 method. Only nominal class problems can be tackled.
  This often dramatically improves the performance, but sometimes, it overfits.
- `weka.classifiers.meta.Bagging`: This is the class for bagging a classifier to reduce the variance.
  This can perform classification and regression, depending on the base learner.

### ZeroR

```text
import weka.classifiers.rules.ZeroR;

ZeroR model = new ZeroR();
```

### RandomTree

```text
import weka.classifiers.trees.RandomTree;

RandomTree model = new RandomTree();
String[] options = Utils.splitOptions("-K 0 -M 1.0 -V 0.001 -S 1");
model.setOptions(options);
```

### RandomForest

```text
import weka.classifiers.trees.RandomForest;

RandomForest model = new RandomForest();
String[] options = Utils.splitOptions("-P 100 -I 100 -num-slots 1 -K 0 -M 1.0 -V 0.001 -S 1");
model.setOptions(options);
```

### IBk

```text
import weka.classifiers.lazy.IBk;

IBk model = new IBk();
String[] options = Utils.splitOptions("-K 1 -W 0 -A \"weka.core.neighboursearch.LinearNNSearch -A \\\"weka.core.EuclideanDistance -R first-last\\\"\"");
model.setOptions(options);
```

### MultilayerPerceptron

```text
import weka.classifiers.functions.MultilayerPerceptron;

MultilayerPerceptron model = new MultilayerPerceptron();
String[] options = Utils.splitOptions("-L 0.3 -M 0.2 -N 500 -V 0 -S 0 -E 20 -H a");
model.setOptions(options);
```

### NaiveBayes

```text
import weka.classifiers.bayes.NaiveBayes;

NaiveBayes model = new NaiveBayes();
```

### AdaBoostM1

```text
import weka.classifiers.meta.AdaBoostM1;

AdaBoostM1 model = new AdaBoostM1();
String[] options = Utils.splitOptions("-P 100 -S 1 -I 10 -W weka.classifiers.trees.DecisionStump");
model.setOptions(options);
```

### Bagging

```text
import weka.classifiers.meta.Bagging;

Bagging model = new Bagging();
String[] options = Utils.splitOptions("-P 100 -S 1 -num-slots 1 -I 10 -W weka.classifiers.trees.REPTree -- -M 2 -V 0.001 -N 3 -S 1 -L -1 -I 0.0");
model.setOptions(options);
```
