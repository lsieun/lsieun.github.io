---
title: "AutoCAD .NET 颜色系统"
sequence: "102"
---

AutoCAD 中可以通过**颜色索引（ACI）**和**真彩色**两种方式来指定颜色。

- 颜色索引（ACI）
- 真彩色

```text
ACI 是 AutoCAD Color Index 的缩写
```

![](/assets/images/cad/gui/gui-select-color-index-color.png)


ACI 提供了255种基本颜色和两种逻辑颜色：ByBlock（随块）和 ByLayer（随层）。

ACI 值的范围是 0-256

- `1-255`：255种基本颜色
- `0`：表示 ByBlock
- `256`：表示 ByLayer

对应代码部分
我们可以通过 `Autodesk.AutoCAD.Colors.Color` 的属性 `ColorMethod` 来判别颜色方式。

```text
Entity entity = ......
switch (entity.Color.ColorMethod)
{
        // 真彩色
    case Autodesk.AutoCAD.Colors.ColorMethod.ByColor:
        break;

        // ACI ByBlock
    case Autodesk.AutoCAD.Colors.ColorMethod.ByBlock:
        break;

        // ACI ByLayer
    case Autodesk.AutoCAD.Colors.ColorMethod.ByLayer:
        break;

        // ACI (1-255)
    case Autodesk.AutoCAD.Colors.ColorMethod.ByAci:
        break;
}
```

真彩色

- 颜色值（RGB）为 `entity.Color.ColorValue`。

ACI

- 颜色值（RGB）同样为 `entity.Color.ColorValue`。
- 颜色的索引值为 `entity.Color.ColorIndex`。
