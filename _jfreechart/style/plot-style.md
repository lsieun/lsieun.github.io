---
title: "Plot Style"
sequence: "121"
---

## Plot

```text
                                    ┌─── foregroundAlpha
                                    │
                 ┌─── foreground ───┤                       ┌─── noDataMessage
                 │                  │                       │
                 │                  └─── text-noData ───────┼─── noDataMessageFont
                 │                                          │
                 │                                          └─── noDataMessagePaint
                 │
                 │                  ┌─── backgroundPaint
Plot Property ───┤                  │
                 ├─── background ───┼─── backgroundAlpha
                 │                  │
                 │                  └─── backgroundImage
                 │
                 │                  ┌─── outlineVisible
                 │                  │
                 └─── outline ──────┼─── outlineStroke
                                    │
                                    └─── outlinePaint
```

## CategoryPlot

```text
                                                           ┌─── domainGridlinesVisible
                                                           │
                                                           ├─── domainGridlinePosition
                                            ┌─── domain ───┤
                                            │              ├─── domainGridlineStroke
                                            │              │
                                            │              └─── domainGridlinePaint
                                            │
                         ┌─── grid-line ────┤
                         │                  │              ┌─── rangeGridlinesVisible
                         │                  │              │
                         │                  │              ├─── rangeGridlineStroke
                         │                  │              │
                         │                  └─── range ────┼─── rangeGridlinePaint
                         │                                 │
                         │                                 │                             ┌─── rangeMinorGridlinesVisible
                         │                                 │                             │
                         │                                 └─── minor ───────────────────┼─── rangeMinorGridlineStroke
                         │                                                               │
                         │                                                               └─── rangeMinorGridlinePaint
                         │                  ┌─── domain
CategoryPlot Property ───┤                  │
                         ├─── baseline ─────┤              ┌─── rangeZeroBaselineVisible
                         │                  │              │
                         │                  └─── range ────┼─── rangeZeroBaselinePaint
                         │                                 │
                         │                                 └─── rangeZeroBaselineStroke
                         │
                         │                                 ┌─── domainCrosshairVisible
                         │                                 │
                         │                  ┌─── domain ───┼─── domainCrosshairStroke
                         │                  │              │
                         │                  │              └─── domainCrosshairPaint
                         │                  │
                         └─── cross-hair ───┤
                                            │              ┌─── rangeCrosshairVisible
                                            │              │
                                            │              ├─── rangeCrosshairValue
                                            └─── range ────┤
                                                           ├─── rangeCrosshairStroke
                                                           │
                                                           └─── rangeCrosshairPaint
```

```text
CategoryPlot plot = chart.getCategoryPlot();
// 设置网格背景色
plot.setBackgroundPaint(Color.WHITE);
// 设置网格竖线颜色
plot.setDomainGridlinePaint(Color.RED);
// 设置网络横线颜色
plot.setRangeGridlinePaint(Color.BLUE);
```

## PiePlot

```text
PiePlot plot = (PiePlot) chart.getPlot();
// 设置Label字体
plot.setLabelFont(new Font("宋体", 0, 11));
// 设置饼图是圆形（true），还是椭圆形（false）；默认值为true
plot.setCircular(false);
```

## XYPlot

```text
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
```

