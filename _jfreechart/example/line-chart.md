---
title: "Line Chart"
sequence: "105"
---


| Year | Number OF Schools |
|------|-------------------|
| 1970 | 15                |
| 1980 | 30                |
| 1990 | 60                |
| 2000 | 120               |
| 2013 | 240               |
| 2014 | 300               |

```java
import org.jfree.chart.ChartFactory;
import org.jfree.chart.JFreeChart;
import org.jfree.chart.plot.PlotOrientation;
import org.jfree.data.category.DefaultCategoryDataset;

public class LineChartRun {
    public static void main(String[] args) {
        // 第一步，准备数据
        DefaultCategoryDataset dataset = new DefaultCategoryDataset();
        dataset.addValue(15, "schools", "1970");
        dataset.addValue(30, "schools", "1980");
        dataset.addValue(60, "schools", "1990");
        dataset.addValue(120, "schools", "2000");
        dataset.addValue(240, "schools", "2010");
        dataset.addValue(300, "schools", "2014");

        // 第二步，生成图表
        JFreeChart chart = ChartFactory.createLineChart(
                "School Vs Years",
                "Years", "Number of Schools",
                dataset,
                PlotOrientation.VERTICAL,
                true, true, false
        );

        // 第三步，进行输出
        OutputUtils.show(chart, "line-chart");
    }
}
```



