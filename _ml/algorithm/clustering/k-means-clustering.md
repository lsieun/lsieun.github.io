---
title: "K-Means Clustering"
sequence: "101"
---

**K-Means** is a clustering algorithm with one fundamental property:
**the number of clusters is defined in advance**.
In addition to K-Means, there are other types of clustering algorithms like
Hierarchical Clustering, Affinity Propagation, or Spectral Clustering.


K-Means begins with k randomly placed centroids.
**Centroids**, as their name suggests, **are the center points of the clusters.**

## Example

### Record

```java
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.util.Map;

@RequiredArgsConstructor
@Getter
@Setter
@ToString
public class Record {
    private final String description;
    private final Map<String, Double> features;
}
```

### Distance

```java
import java.util.Map;

public interface Distance {
    double calculate(Map<String, Double> f1, Map<String, Double> f2);
}
```

### EuclideanDistance

```java
import java.util.Map;

public class EuclideanDistance implements Distance {
    @Override
    public double calculate(Map<String, Double> f1, Map<String, Double> f2) {
        double sum = 0;
        for (String key : f1.keySet()) {
            Double v1 = f1.get(key);
            Double v2 = f2.get(key);

            if (v1 != null && v2 != null) {
                sum += Math.pow(v1 - v2, 2);
            }
        }

        return Math.sqrt(sum);
    }
}
```

### Centroid

```java
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

import java.util.Map;

@RequiredArgsConstructor
@Getter
@EqualsAndHashCode
public class Centroid {
    private final Map<String, Double> coordinates;
}
```

### KMeans

```java
import java.util.*;
import java.util.stream.Collectors;

import static java.util.stream.Collectors.toList;

public class KMeans {
    private static final Random random = new Random();

    public static Map<Centroid, List<Record>> fit(
            List<Record> records,
            int k,
            Distance distance,
            int maxIterations
    ) {
        List<Centroid> centroids = randomCentroids(records, k);
        Map<Centroid, List<Record>> clusters = new HashMap<>();
        Map<Centroid, List<Record>> lastState = new HashMap<>();

        // iterate for a pre-defined number of times
        for (int i = 0; i < maxIterations; i++) {
            boolean isLastIteration = i == maxIterations - 1;

            // in each iteration we should find the nearest centroid for each record
            for (Record record : records) {
                Centroid centroid = nearestCentroid(record, centroids, distance);
                assignToCluster(clusters, record, centroid);
            }

            // if the assignments do not change, then the algorithm terminates
            // FIXME: equals 是如何判断的呢？
            boolean shouldTerminate = isLastIteration || clusters.equals(lastState);
            lastState = clusters;
            if (shouldTerminate) {
                break;
            }

            // at the end of each iteration we should relocate the centroids
            // FIXME: 可能有的中心点，一直没有点
            centroids = relocateCentroids(clusters);
            clusters = new HashMap<>();
        }

        return lastState;
    }

    private static List<Centroid> randomCentroids(List<Record> records, int k) {
        List<Centroid> centroids = new ArrayList<>();
        Map<String, Double> maxs = new HashMap<>();
        Map<String, Double> mins = new HashMap<>();

        for (Record record : records) {
            record.getFeatures().forEach(
                    (key, value) -> {
                        // compares the value with the current max and choose the bigger value between them
                        maxs.compute(key, (k1, max) -> max == null || value > max ? value : max);

                        // compare the value with the current min and choose the smaller value between them
                        mins.compute(key, (k1, min) -> min == null || value < min ? value : min);
                    }
            );
        }

        Set<String> attributes = records.stream()
                .flatMap(e -> e.getFeatures().keySet().stream())
                .collect(Collectors.toSet());

        for (int i = 0; i < k; i++) {
            Map<String, Double> coordinates = new HashMap<>();
            for (String attribute : attributes) {
                double max = maxs.get(attribute);
                double min = mins.get(attribute);
                coordinates.put(attribute, random.nextDouble() * (max - min) + min);
            }

            centroids.add(new Centroid(coordinates));
        }

        return centroids;
    }

    private static Centroid nearestCentroid(Record record, List<Centroid> centroids, Distance distance) {
        double minimumDistance = Double.MAX_VALUE;
        Centroid nearest = null;

        for (Centroid centroid : centroids) {
            double currentDistance = distance.calculate(record.getFeatures(), centroid.getCoordinates());

            if (currentDistance < minimumDistance) {
                minimumDistance = currentDistance;
                nearest = centroid;
            }
        }

        return nearest;
    }

    private static void assignToCluster(
            Map<Centroid, List<Record>> clusters,
            Record record,
            Centroid centroid
    ) {
        clusters.compute(centroid, (key, list) -> {
            if (list == null) {
                list = new ArrayList<>();
            }

            list.add(record);
            return list;
        });
    }

    private static Centroid average(Centroid centroid, List<Record> records) {
        if (records == null || records.isEmpty()) {
            return centroid;
        }

        Map<String, Double> average = centroid.getCoordinates();
        records.stream().flatMap(e -> e.getFeatures().keySet().stream())
                .forEach(k -> average.put(k, 0.0));

        for (Record record : records) {
            record.getFeatures().forEach(
                    (k, v) -> average.compute(k, (k1, currentValue) -> v + currentValue)
            );
        }

        average.forEach(
                (k, v) -> average.put(k, v / records.size())
        );

        return new Centroid(average);
    }

    private static List<Centroid> relocateCentroids(Map<Centroid, List<Record>> clusters) {
        return clusters.entrySet().stream().map(
                        entry -> average(entry.getKey(), entry.getValue())
                )
                .collect(toList());
    }
}
```

### Errors

```java
import java.util.List;
import java.util.Map;

public class Errors {
    public static double sse(Map<Centroid, List<Record>> clustered, Distance distance) {
        double sum = 0;
        for (Map.Entry<Centroid, List<Record>> entry : clustered.entrySet()) {
            Centroid centroid = entry.getKey();
            for (Record record : entry.getValue()) {
                double d = distance.calculate(centroid.getCoordinates(), record.getFeatures());
                sum += Math.pow(d, 2);
            }
        }
        return sum;
    }
}
```

### Main

```java
import lsieun.utils.io.FileUtils;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

public class Main {
    public static void main(String[] args) {
        // FIXME: 缺少数据
        String filepath = "D:\\workspace\\git-repo\\learn-java-ml\\learn-java-weka\\src\\main\\resources\\data\\iris.data.csv";
        List<String> lineList = FileUtils.readLines(filepath);

        List<Record> records = new ArrayList<>();
        for (String item : lineList) {
            if ("".equals(item)) {
                continue;
            }

            String[] array = item.split(",");
            if (array.length != 5) {
                continue;
            }

            Map<String, Double> features = new HashMap<>();
            features.put("X1", Double.parseDouble(array[0]));
            features.put("X2", Double.parseDouble(array[1]));
            features.put("X3", Double.parseDouble(array[2]));
            features.put("X4", Double.parseDouble(array[3]));
            String description = array[4];
            Record record = new Record(description, features);
            records.add(record);
        }

        Distance distance = new EuclideanDistance();
//        List<Double> sumOfSquaredErrors = new ArrayList<>();
//        for (int k = 2; k <= 16; k++) {
//            Map<Centroid, List<Record>> clusters = KMeans.fit(records, k, distance, 1000);
//            double sse = Errors.sse(clusters, distance);
//            sumOfSquaredErrors.add(sse);
//        }
//
//        int size = sumOfSquaredErrors.size();
//
//        for (int i = 0; i< size; i++) {
//            int k = 2 + i;
//            Double item = sumOfSquaredErrors.get(i);
//            String msg = String.format("%03d: %s", k, item);
//            System.out.println(msg);
//        }

        Map<Centroid, List<Record>> clusters = KMeans.fit(records, 7, distance, 1000);
        for (Map.Entry<Centroid, List<Record>> entry : clusters.entrySet()) {
            List<Record> list = entry.getValue();
            System.out.println("size = " + list.size());
            Map<String, Long> map = list.stream().collect(Collectors.groupingBy(Record::getDescription, Collectors.counting()));
//            for (Record record : list) {
//                System.out.println(record);
//            }
            System.out.println(map);
            System.out.println("============================================");
        }
    }
}
```

## Reference

- [The K-Means Clustering Algorithm in Java](https://www.baeldung.com/java-k-means-clustering-algorithm)
