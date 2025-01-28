---
title: "JFreeChart 中文乱码"
sequence: "102"
---

```text
//创建主题样式
StandardChartTheme chartTheme=new StandardChartTheme("CN");
//设置图例的字体
chartTheme.setRegularFont(new Font("宋书",Font.PLAIN,15));
//设置轴向的字体
chartTheme.setLargeFont(new Font("宋书",Font.PLAIN,18));
//设置标题字体
chartTheme.setExtraLargeFont(new Font("隶书",Font.BOLD,20));
//应用主题样式
ChartFactory.setChartTheme(chartTheme);
```
