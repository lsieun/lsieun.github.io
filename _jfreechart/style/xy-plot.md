---
title: "XYPlot Style"
sequence: "124"
---

```java
import org.jfree.chart.ChartFactory;
import org.jfree.chart.JFreeChart;
import org.jfree.chart.axis.DateAxis;
import org.jfree.chart.axis.DateTickUnit;
import org.jfree.chart.axis.DateTickUnitType;
import org.jfree.chart.labels.ItemLabelAnchor;
import org.jfree.chart.labels.ItemLabelPosition;
import org.jfree.chart.labels.StandardXYItemLabelGenerator;
import org.jfree.chart.plot.XYPlot;
import org.jfree.chart.renderer.xy.XYItemRenderer;
import org.jfree.chart.renderer.xy.XYLineAndShapeRenderer;
import org.jfree.chart.title.TextTitle;
import org.jfree.chart.ui.TextAnchor;
import org.jfree.data.time.Second;
import org.jfree.data.time.TimeSeries;
import org.jfree.data.time.TimeSeriesCollection;

import java.awt.*;
import java.text.SimpleDateFormat;

public class TimeSeriesRun {
    public static void main(String[] args) {
        // 第一步，准备数据
        int count = 20;
        Second current = new Second();
        TimeSeries series1 = getTimeSeries("First Data", count, current);
        TimeSeries series2 = getTimeSeries("Second Data", count, current);

        TimeSeriesCollection dataset = new TimeSeriesCollection();
        dataset.addSeries(series1);
        dataset.addSeries(series2);

        // 第二步，生成图表
        JFreeChart chart = ChartFactory.createTimeSeriesChart(
                "Computing Test",
                "Seconds", "Value",
                dataset,
                false, false, false
        );
        // 设置主标题
        chart.setTitle(new TextTitle("这是一个新标题", new Font("隶书", Font.ITALIC, 15)));
        // 设置子标题
        TextTitle subtitle = new TextTitle("这是附标题", new Font("黑体", Font.BOLD, 12));
        chart.addSubtitle(subtitle);
        chart.setAntiAlias(true);

        // 设置时间轴的范围
        XYPlot plot = chart.getXYPlot();
        DateAxis dateAxis = (DateAxis) plot.getDomainAxis();
        dateAxis.setDateFormatOverride(new SimpleDateFormat("mm:ss"));
        dateAxis.setTickUnit(new DateTickUnit(DateTickUnitType.SECOND, 1));

        // 设置曲线是否显示数据点
        XYLineAndShapeRenderer xyLineAndShapeRenderer = (XYLineAndShapeRenderer) plot.getRenderer();
        xyLineAndShapeRenderer.setDefaultShapesVisible(true);

        // 设置曲线显示各数据点的值
        XYItemRenderer renderer = plot.getRenderer();
        renderer.setDefaultItemLabelsVisible(true);
        renderer.setDefaultPositiveItemLabelPosition(new ItemLabelPosition(ItemLabelAnchor.OUTSIDE12, TextAnchor.BASELINE_CENTER));
        renderer.setDefaultItemLabelGenerator(new StandardXYItemLabelGenerator());
        renderer.setDefaultItemLabelFont(new Font("Dialog", Font.BOLD, 12));
        plot.setRenderer(renderer);

        // 第三步，进行输出
        OutputUtils.show(chart, "time-series-chart");
    }

    private static TimeSeries getTimeSeries(String name, int count, Second current) {
        TimeSeries series = new TimeSeries(name);

        double value = 100.0;
        for (int i = 0; i < count; i++) {
            value = value + Math.random() - 0.5;
            series.add(current, new Double(value));
            current = (Second) current.next();
        }

        return series;
    }
}
```
