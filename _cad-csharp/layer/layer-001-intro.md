---
title: "Layer"
sequence: "101"
---

## 图层名称

图层的名称不能包含以下字符：

```text
< > / \ " : ; ? * | = `
```

对图层名进行验证，可以使用 `SymbolUtilityServices.ValidateSymbolName()` 方法。

```csharp
namespace Autodesk.AutoCAD.DatabaseServices
{
    public sealed class SymbolUtilityServices
    {
        public static unsafe void ValidateSymbolName(string name, bool allowVerticalBar)
        {
            // ...
        }
    }
}
```

- 第 1 个参数 `name`，表示符号表的名称。如果 `name` 参数无效，则会抛出 `eInvalidInput` 异常。
- 第 2 个参数 `allowVerticalBar` 参数表示允许 `|` 字符。对于图层来说，这个参数只能设置为 `false`。

- Layer
    - List all Layers
    - Create a new Layer
    - Update existing Layer
    - Turn Layer On/Off
    - Layer Thaw/Freeze
    - Delete existing Layers
    - Set layer to an object

## 删除图层

由于 AutoCAD 不允许删除图形的当前图层，因此在删除图层之前，必须保证它不是当前图层。

