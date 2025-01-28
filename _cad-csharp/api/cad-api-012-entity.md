---
title: "Entity"
sequence: "112"
---

## 改变对象的读/写状态

当使用 `GetObject` 或 `Open` 函数打开对象后，
可以使用对象的 `UpgradeOpen` 或 `DowngradeOpen` 函数改变对象的打开状态。

- `UpgradeOpen` 函数将对象由**只读**的状态升级为**可写**的状态
- `DowngradeOpen` 函数则将对象由**可写**的状态降级为**只读**状态。

当使用 `UpgradeOpen` 或 `DowngradeOpen` 函数进行状态切换后，无需再次调用相关的函数恢复对象的原始状态，
因为关闭一个对象或结束事务处理后，对象的打开状态会被清除。

```csharp
namespace Autodesk.AutoCAD.DatabaseServices
{
    public abstract class DBObject : Drawable
    {
        public void UpgradeOpen()
        {
        }
        
        public void DowngradeOpen()
        {
        }
    }
}
```

提示：如果只需要访问对象的属性，那么请尽量使用**读**的方式打开对象。虽然以**写**的方式也能访问对象的属性，但其效率远比**读**的方式低。

### 实体的几何变换

如果需要对实体进行移动、旋转、镜像之类的几何变换等操作，就得使用 `Entity` 类的 `TransformBy` 函数。

```csharp
namespace Autodesk.AutoCAD.DatabaseServices
{
    public abstract class Entity : DBObject
    {
        public void TransformBy(Matrix3d transform)
        {
        }
    }
}
```

`Entity.TransformBy()` 接收的参数类型是 `Matrix3d`，它位于 Geometry 命名空间：

```csharp
namespace Autodesk.AutoCAD.Geometry
{
    public struct Matrix3d : IFormattable
    {
        public Vector3d Translation{}
        public static Matrix3d Displacement(Vector3d vector)
        {
        }
        public static Matrix3d Rotation(double angle, Vector3d axis, Point3d center)
        {
        }
        public static Matrix3d Scaling(double scaleAll, Point3d center)
        {
        }
    }
}
```

## Reference

- [DBObject Class](https://help.autodesk.com/view/OARX/2024/ENU/?guid=OARX-ManagedRefGuide-Autodesk_AutoCAD_DatabaseServices_DBObject)

