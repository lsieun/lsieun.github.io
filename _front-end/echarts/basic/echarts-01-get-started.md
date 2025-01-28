---
title: "Get Started"
sequence: "101"
---

使用步骤：

- 第1步，引入`echarts.js`
- 第2步，添加一个`<div>`
- 第3步，使用echarts
  - 第3.1步，调用`echarts.init()`方法初始化`<div>`。
  - 第3.2步，准备一个`option`用来配置选项。
  - 第3.3步，调用`myChart.setOption(option)`方法。

```html
<!DOCTYPE html>
<html lang="zh">
<head>
    <meta charset="utf-8" />
    <!-- Include the ECharts file you just downloaded -->
    <script src="../../js/echarts.js"></script>
    <title>Echarts</title>
</head>

<body>
<!-- Prepare a DOM with a defined width and height for ECharts -->
<div id="main" style="width: 600px;height:400px;"></div>
</body>

<script type="text/javascript">
    // Initialize the echarts instance based on the prepared dom
    const myChart = echarts.init(document.getElementById('main'));

    // Specify the configuration items and data for the chart
    const option = {
        title: {
            text: 'ECharts Getting Started Example'
        },
        tooltip: {},
        legend: {
            data: ['sales']
        },
        xAxis: {
            data: ['Shirts', 'Cardigans', 'Chiffons', 'Pants', 'Heels', 'Socks']
        },
        yAxis: {},
        series: [
            {
                name: 'sales',
                type: 'bar',
                data: [5, 20, 36, 10, 10, 20]
            }
        ]
    };

    // Display the chart using the configuration items and data just specified.
    myChart.setOption(option);
</script>

</html>
```
