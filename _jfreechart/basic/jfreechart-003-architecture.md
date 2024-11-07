---
title: "JFreeChart Architecture"
sequence: "103"
---

## JFreeChart Architecture

This part explains **basic class level** and **application level architectures** of JFreeChart
to give you an idea about how JFreeChart interacts with different classes and
how it fits in your Java based application.

### Class Level Architecture

The class level architecture explains how various classes from the library interact with each other
to create various types of charts.

![](/assets/images/jfreechart/class-level-architecture.jpg)

- **File**: The source having user input to be used for creating a **dataset** in the file.
- **Database**: The source having user input to be used for creating a **dataset** in the database.
- **Create Dataset**: Accepts the dataset and stores the dataset into dataset object.
- **General Dataset**: This type of dataset is mainly used for **pie charts**.
- **Category Dataset**: This type of dataset is used for **bar chart**, **line chart**,etc.
- **Series Dataset**: This type of dataset is used for storing series of data and construct **line charts**.
- **Series Collection Dataset**: The different categories of series datasets are added to series collection dataset.
  This type of dataset is used for **XYLine Charts**.
- **Create Chart**: This is the method which is executed to create final chart.
- **Frame/Image**: The chart is displayed on a Swing Frame or an image is created.

### Application Level Architecture

The application level architecture explains where JFreeChart library sits inside a Java Application.

![](/assets/images/jfreechart/application-level-architecture.jpg)

The client program receives user data,
and then it uses standard Java and JFreeChart APIs based on requirements
to generate the output in the form of either a frame,
which can be displayed directly inside the application or independently in the image formats such as JPEG or PNG.

## Component

JFreeChart 主要由三个部分构成：title(标题)，legend(图释) 和 plot(图表主体)。 

## 几个关键类

```text
JFrame --> JPanel --> ChartPanel --> JFreeChart --> Dataset
```

![](/assets/images/jfreechart/jfreechart-server-classes.png)


在 JFreeChart 库中，`JFrame`、`JPanel`、`ChartPanel`、`JFreeChart` 和 `Dataset` 是用于创建和展示图表的几个关键类。
它们之间的关系可以通过它们在图表创建和显示过程中所扮演的角色来理解。

### `Dataset`

- **作用**：`Dataset` 是一个接口，它代表了图表中要展示的数据集合。
  在 JFreeChart 中，根据不同类型的图表（如折线图、柱状图、饼图等），有不同的 `Dataset` 实现，
  例如 `CategoryDataset` 用于类别图表，`XYDataset` 用于 XY 图表等。
- **关系**：`Dataset` 是图表创建过程中的第一步，它与 `JFreeChart` 对象直接相关，
  因为创建 `JFreeChart` 对象时需要使用到 `Dataset`。

### `JFreeChart`

- **作用**：`JFreeChart` 类是 JFreeChart 库的核心，代表了一个完整的图表，负责图表的绘制管理，包括图表的标题、图例、数据区域等。
- **关系**：`JFreeChart` 对象是基于 `Dataset` 创建的，它将数据通过图表可视化。但是，`JFreeChart` 本身并不负责图表的显示，它需要通过一个组件来展示。

### `ChartPanel`

- **作用**：`ChartPanel` 是一个专门用于展示 JFreeChart 图表的 Swing 组件，它继承自 `JPanel`。
  `ChartPanel` 可以被添加到 Java Swing 的容器中，如 `JFrame` 或 `JPanel`，以便在 GUI 中显示图表。
- **关系**：`ChartPanel` 直接包含 `JFreeChart` 对象，负责将其渲染到面板上。这是 `JFreeChart` 在 Swing 应用程序中被显示的方式。

### `JPanel`

- **作用**：`JPanel` 是 Java Swing 库中的一个容器，可以包含其他 Swing 组件，用于构建复杂的用户界面。
- **关系**：虽然 `JPanel` 直接与 JFreeChart 没有关联，但 `ChartPanel`（继承自 `JPanel`）是其子类，
  用于特定于图表的渲染和展示。同时，`JPanel` 也可以用来组织多个 `ChartPanel` 或其他组件，以实现复杂的布局。

### `JFrame`

- **作用**：`JFrame` 是 Java Swing 库中的一个顶级窗口容器，用于包含整个应用程序的 GUI 界面。
- **关系**：`JFrame` 通常作为应用程序的主窗口，在其中可以添加 `ChartPanel` 或其他 `JPanel` 实例来展示图表和其他 UI 组件。
  `JFrame` 提供了显示窗口所需的所有功能，如标题栏、最大化/最小化按钮、关闭操作等。

### 总结

在 JFreeChart 库中，`Dataset` 用于定义图表的数据，`JFreeChart` 对象基于这些数据创建图表，
`ChartPanel` 是一个特殊的 `JPanel`，用于显示 `JFreeChart` 对象。
`JPanel` 可以用作组织和展示多个图表或其他组件的容器，而 `JFrame` 是顶级容器，用于将 `ChartPanel` 或 `JPanel` 等添加到 GUI 应用程序中。
这些类共同工作，以在 Java 应用程序中创建和展示丰富的图表和图形用户界面。
