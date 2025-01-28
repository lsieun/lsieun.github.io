---
title: "JFreeChart类"
sequence: "102"
---

- 添加附标题：`chart.addSubtitle(new TextTitle("这是附标题"));`

```text
// 设置主标题
chart.setTitle(new TextTitle("这是一个新标题", new Font("隶书", Font.ITALIC, 15)));
// 设置子标题
TextTitle subtitle = new TextTitle("这是附标题", new Font("黑体", Font.BOLD, 12));
chart.addSubtitle(subtitle);
chart.setAntiAlias(true);
```
