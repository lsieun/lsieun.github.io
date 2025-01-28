---
title: "Weka 数据"
sequence: "112"
---

## ARFF

```java
import weka.core.Instances;
import weka.core.converters.ConverterUtils.DataSource;

public class ArffData {
    public static void main(String[] args) throws Exception {
        // 第 1 步，读取数据(ARFF, CSV, XRFF, ...)
        DataSource source = new DataSource("data/zoo.arff");
        Instances instances = source.getDataSet();

        // 第 2 步，获取信息
        int numAttributes = instances.numAttributes();
        int numInstances = instances.numInstances();

        System.out.println("numAttributes = " + numAttributes);
        System.out.println("numInstances = " + numInstances);
    }
}
```

## CSV

```java
import weka.core.Instances;
import weka.core.converters.CSVLoader;

import java.io.File;
import java.io.IOException;

public class CSVData {
    public static void main(String[] args) throws IOException {
        CSVLoader loader = new CSVLoader();
        loader.setFieldSeparator(",");
        loader.setSource(new File("data/ENB2012_data.csv"));
        Instances instances = loader.getDataSet();

        System.out.println(instances);
    }
}
```

## Store Data in Memory

```java
import weka.core.Instance;
import weka.core.Instances;
import weka.core.converters.ConverterUtils.DataSource;

public class WekaInstance {
    public static void main(String[] args) throws Exception {
        DataSource source = new DataSource("data/iris.arff");
        Instances instances = source.getDataSet();
        int numInstances = instances.numInstances();

        Instance firstInstance = instances.instance(0);
        System.out.println(firstInstance);

        Instance lastInstance = instances.instance(numInstances - 1);
        System.out.println(lastInstance);
    }
}
```

```text
import weka.core.Instance;
import weka.core.Instances;
import weka.core.converters.ConverterUtils.DataSource;

public class WekaInstance {
    public static void main(String[] args) throws Exception {
        DataSource source = new DataSource("data/iris.arff");
        Instances instances = source.getDataSet();

        Instance firstInstance = instances.firstInstance();
        System.out.println(firstInstance);

        Instance lastInstance = instances.lastInstance();
        System.out.println(lastInstance);
    }
}
```

```java
import weka.core.Attribute;
import weka.core.Instances;
import weka.core.converters.ConverterUtils.DataSource;

public class WekaInstance {
    public static void main(String[] args) throws Exception {
        DataSource source = new DataSource("data/iris.arff");
        Instances instances = source.getDataSet();
        int numAttributes = instances.numAttributes();

        Attribute firstAttribute = instances.attribute(0);
        System.out.println(firstAttribute);

        Attribute lastAttribute = instances.attribute(numAttributes - 1);
        System.out.println(lastAttribute);
    }
}
```
