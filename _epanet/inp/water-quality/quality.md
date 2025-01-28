---
title: "QUALITY"
sequence: "quality"
---

The `[QUALITY]` defines **initial water quality** at **nodes**.

## 应用对象

- Junction
- Reservoir
- Tank

## 格式

One line per node containing:

- Node ID label
- Initial quality

Remarks:

- Quality is assumed to be **zero** for nodes not listed. (默认值)
- Quality represents (水质有不同的表现形式)
    - concentration for chemicals,
    - hours for water age, or
    - percent for source tracing.
- The `[QUALITY]` section is optional.


