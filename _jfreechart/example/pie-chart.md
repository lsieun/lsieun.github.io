---
title: "Pie Chart"
sequence: "103"
---


```java
import org.jfree.chart.ChartFactory;
import org.jfree.chart.JFreeChart;
import org.jfree.data.general.DefaultPieDataset;

public class PieChartRun {
    public static void main(String[] args) {
        // 第一步，准备数据
        DefaultPieDataset<String> dataset = new DefaultPieDataset<>();
        dataset.setValue("IPhone 5s", new Double(20));
        dataset.setValue("SamSung Grand", new Double(20));
        dataset.setValue("MotoG", new Double(40));
        dataset.setValue("Nokia Lumia", new Double(10));

        // 第二步，生成图表
        JFreeChart chart = ChartFactory.createPieChart("Mobile Sales", dataset, true, true, true);

        // 第三步，进行输出
        OutputUtils.show(chart, "pie-chart");
    }
}
```




