---
title: "Weka 聚类"
sequence: "116"
---

```java
import weka.clusterers.ClusterEvaluation;
import weka.clusterers.EM;
import weka.core.Instances;
import weka.core.converters.ConverterUtils.DataSource;

import java.util.Random;

public class ClusteringWeka {
    public static void main(String[] args) throws Exception {
        // 第 1 步，加载数据
        DataSource source = new DataSource("data/bank-data.arff");
        Instances data = source.getDataSet();
        System.out.println(data.numInstances() + " instances loaded.");

        // 第 2 步，使用模型算法
        EM model = new EM();
        model.buildClusterer(data);
        System.out.println(model);

        // 第 3 步，模型评价
        double logLikelihood = ClusterEvaluation.crossValidateModel(model, data, 10, new Random(1));
        System.out.println(logLikelihood);
    }
}
```
