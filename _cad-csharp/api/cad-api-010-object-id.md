---
title: "ObjectId"
sequence: "110"
---

在 .NET 中，`ObjectId` 是表示实体对象的最常用的一种方式。

## 创建

当一个实体被创建时，AutoCAD 图形数据库将自动为这个实体分配一个 `ObjectId`。
因此，在创建对象时，可以将该对象的 `ObjectId` 保存起来。
在需要访问该对象时，再根据这个 `ObjectId` 打开其表示的实体对象，就可以修改或查询该对象的特性。

## ObjectId

### GetObject

- `mode`：表示打开对象的方式。
- `openErased`：表示是否获取数据库中已经被删除的对象。
- `forceOpenOnLockedLayer`：表示是否强制打开在锁定层上的对象。

需要注意：`ObjectId` 的 `GetObject` 函数必须保证 `ObjectId` 所在的**数据库开启了事务处理**；否则，会造成 AutoCAD 的崩溃。

```csharp
namespace Autodesk.AutoCAD.DatabaseServices
{
    public struct ObjectId : IComparable<ObjectId>, IDynamicMetaObjectProvider
    {
        public DBObject GetObject(OpenMode mode) => this.GetObject(mode, false, false);
        
        public DBObject GetObject(OpenMode mode, bool openErased) => this.GetObject(mode, openErased, false);
        
        public unsafe DBObject GetObject(OpenMode mode, bool openErased, bool forceOpenOnLockedLayer) => {...}
    }
}
```

## Database

```csharp
namespace Autodesk.AutoCAD.DatabaseServices
{
    public sealed class Database : RXObject, IDynamicMetaObjectProvider
    {
        public ObjectId BlockTableId;
        public ObjectId DimStyleTableId;
        public ObjectId LayerTableId;
        public ObjectId LinetypeTableId;
        public ObjectId TextStyleTableId;
        
        public ObjectId RegAppTableId;
        
        public ObjectId UcsTableId;
        public ObjectId ViewportTableId;
        public ObjectId ViewTableId;
    }
}
```
