---
title: "Grafana 更改背景颜色"
sequence: "109"
---

Grafana 默认主题是黑色，将它修改成白色

编辑配置文件

```text
vim /etc/grafana/grafana.ini
```

将 `default_theme` 由 `dark` 改为 `light`：

```text
# Default UI theme ("dark" or "light")
default_theme = light
```

![](/assets/images/grafana/grafana-administration-default-preference-light.png)

