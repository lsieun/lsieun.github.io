---
title: "Helm Chart Directory Structure"
sequence: "106"
---

```text
mysql/
├── charts                # 该目录保存其他依赖的 chart
├── Chart.yaml
├── README.md
├── templates
├── values.schema.json
└── values.yaml           # 定义 chart 模板中的自定义配置的默认值
```

