---
title: "TimeSeries Chart"
sequence: "105"
---

```java
import org.jfree.chart.ChartFactory;
import org.jfree.chart.ChartUtils;
import org.jfree.chart.JFreeChart;
import org.jfree.data.general.SeriesException;
import org.jfree.data.time.Second;
import org.jfree.data.time.TimeSeries;
import org.jfree.data.time.TimeSeriesCollection;
import org.jfree.data.xy.XYDataset;

import java.io.File;
import java.io.IOException;

public class TimeSeriesChart {
    public static void main(String[] args) throws IOException {
        // 第 1 步，Series
        TimeSeries series = new TimeSeries("Random Data");
        Second current = new Second();
        double value = 100.0;

        for (int i = 0; i < 4000; i++) {

            try {
                value = value + Math.random() - 0.5;
                series.add(current, value);
                current = (Second) current.next();
            } catch (SeriesException e) {
                System.err.println("Error adding to series");
            }
        }

        // 第 2 步，Dataset
        XYDataset dataset = new TimeSeriesCollection(series);
        
        // 第 3 步，Chart
        JFreeChart chart = ChartFactory.createTimeSeriesChart(
                "Computing Test",
                "Seconds",
                "Value",
                dataset,
                false,
                false,
                false);

        // 第 4 步，Output
        int width = 640;
        int height = 480;
        File file = FileUtils.getFile("time-series-chart", "png");
        ChartUtils.saveChartAsPNG(file, chart, width, height);
    }
}
```

![](/assets/images/jfreechart/example/jfreechart-example-time-series-chart.png)

