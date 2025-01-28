---
title: "JFreeChart API"
sequence: "104"
---

## Core

### ChartFactory

A `ChartFactory` class prvoides a collection of utility methods for creating some standard charts with JFreeChart.

### JFreeChart

JFreeChart class is the core class under the org.jfree.chart package.
This class provides JFreeChart method to create bar charts, line charts, pie charts, and xy plots including time series data.

```java
public class JFreeChart implements Drawable, TitleChangeListener,
        PlotChangeListener, Serializable, Cloneable {
}
```

### ChartUtils

A `ChartUtils` class provides a collection of utility methods for `JFreeChart`.

- Includes methods for converting charts to image formats (PNG and JPEG) plus creating simple HTML image maps.

## Plot

The `Plot` is the base class for all plots in `JFreeChart`.

```java
public abstract class Plot implements AxisChangeListener,
        DatasetChangeListener, AnnotationChangeListener, MarkerChangeListener,
        LegendItemSource, PublicCloneable, Cloneable, Serializable {
}
```

The JFreeChart class delegates the drawing of **axes** and **data** to the plot.

> 负责axes和data

### PlotOrientation

The `PlotOrientation` is used to indicate the orientation (horizontal or vertical) of a 2D plot.

```java
public final class PlotOrientation implements Serializable {
    public static final PlotOrientation HORIZONTAL
            = new PlotOrientation("PlotOrientation.HORIZONTAL");
    public static final PlotOrientation VERTICAL
            = new PlotOrientation("PlotOrientation.VERTICAL");
}
```

### PiePlot

A `PiePlot` displays data in the form of a pie chart, using data from any class that implements the `PieDataset` interface.

```java
public class PiePlot<K extends Comparable<K>> extends Plot implements Cloneable, Serializable {
}
```

### PiePlot3D

A `PiePlot3D` displays data in the form of a 3D pie chart, using data from any class that implements the `PieDataset` interface.

```java
public class PiePlot3D extends PiePlot implements Serializable {
}
```

### XYPlot

A `XYPlot` is a general class for plotting data in the form of (x, y) pairs.

This plot can use data from any class that implements the `XYDataset` interface.

```java
public class XYPlot extends Plot implements ValueAxisPlot, Pannable, Zoomable,
        RendererChangeListener, Cloneable, PublicCloneable, Serializable {
}
```

### NumberAxis

A `NumberAxis` is an axis for displaying numerical data.

```java
public class NumberAxis extends ValueAxis implements Cloneable, Serializable {
}
```

## Output: Swing

### ChartFrame

A `ChartFrame` is used for displaying a chart.

```java
public class ChartFrame extends JFrame {
}
```

`ChartFrame` class inherits functionalities from parent classes such as `Frame`, `Window`, `Container`, and `Component` classes.

### ChartPanel

A `ChartPanel` is a Swing GUI component for displaying a `JFreeChart` object.


```java
public class ChartPanel extends JPanel implements ChartChangeListener,
        ChartProgressListener, ActionListener, MouseListener,
        MouseMotionListener, OverlayChangeListener, Printable, Serializable {
}
```










