---
title: "Bar Chart"
sequence: "104"
---

A bar chart uses different orientation (horizontal or vertical) bars to show comparisons in various categories.
One axis (**domain axis**) of the chart shows the specific domain being compared,
and the other axis (**range axis**) represents discrete values.

| Car  | Speed | User | Rating | Millage Safety |
|------|-------|------|--------|----------------|
| Fiat | 1.0   | 3.0  | 5.0    | 5.0            |
| Audi | 5.0   | 6.0  | 10.0   | 4.0            |
| Ford | 4.0   | 2.0  | 3.0    | 6.0            |


```java
import org.jfree.chart.ChartFactory;
import org.jfree.chart.JFreeChart;
import org.jfree.chart.plot.PlotOrientation;
import org.jfree.data.category.DefaultCategoryDataset;

public class BarChartRun {
    public static void main(String[] args) {
        // 第一步，准备数据
        DefaultCategoryDataset dataset = new DefaultCategoryDataset();

        String fiat = "FIAT";
        String audi = "AUDI";
        String ford = "FORD";
        String speed = "Speed";
        String millage = "Millage";
        String userrating = "User Rating";
        String safety = "safety";

        dataset.addValue(1.0, fiat, speed);
        dataset.addValue(3.0, fiat, userrating);
        dataset.addValue(5.0, fiat, millage);
        dataset.addValue(5.0, fiat, safety);

        dataset.addValue(5.0, audi, speed);
        dataset.addValue(6.0, audi, userrating);
        dataset.addValue(10.0, audi, millage);
        dataset.addValue(4.0, audi, safety);

        dataset.addValue(4.0, ford, speed);
        dataset.addValue(2.0, ford, userrating);
        dataset.addValue(3.0, ford, millage);
        dataset.addValue(6.0, ford, safety);

        // 第二步，生成图表
        JFreeChart chart = ChartFactory.createBarChart(
                "Car Usage Statistics", "Category", "Score",
                dataset,
                PlotOrientation.VERTICAL,
                true, true, false
        );

        // 第三步，进行输出
        OutputUtils.show(chart, "bar chart");
    }
}
```

