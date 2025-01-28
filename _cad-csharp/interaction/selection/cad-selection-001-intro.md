---
title: "选择集"
sequence: "101"
---

## 选择集

### 选择集的创建

选择集通过调用 Editor 类的 GetSelection 及 SelectXXX 函数来实现：

- `GetSelection`：用户在图形窗口中选择实体。
- `SelectAll`：选择所有的实体。
- `SelectCrossingWindow`：选择窗口中及和窗口四条边界相交的实体。
- `SelectCrossingPolygon`：选择多边形圈内及和多边形边界相交的实体。
- `SelectFence`：选择围栏中的实体。
- `SelectImplied`：选择当前图形窗口中已经选择的实体。
- `SelectLast`：选择最近生成的实体。
- `SelectPrevious`：选择上一个选择集。
- `SelectWindow`：选择窗口中的实体。
- `SelectWindowPolygon`：选择多边形圈内的实体。


