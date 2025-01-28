---
title: "Scale"
sequence: "105"
---

## Matrix3d.Scaling

```csharp
namespace Autodesk.AutoCAD.Geometry
{
    public struct Matrix3d : IFormattable
    {
        public static Matrix3d Scaling(double scaleAll, Point3d center)
        {
        }
    }
}
```

- `scaleAll`：表示缩放比例
- `center`：表示缩放中心

## 示例一

```csharp
using Autodesk.AutoCAD.ApplicationServices;
using Autodesk.AutoCAD.Colors;
using Autodesk.AutoCAD.DatabaseServices;
using Autodesk.AutoCAD.Geometry;
using Autodesk.AutoCAD.Runtime;

namespace Lsieun.Cad.DrawObjects.Transformation
{
    public class Scale01LineUtility
    {
        [CommandMethod("Scale01Line")]
        public void ScaleLine()
        {
            Document doc = Application.DocumentManager.MdiActiveDocument;
            Database db = doc.Database;

            using (Transaction trans = db.TransactionManager.StartTransaction())
            {
                // 第 1 步，添加线
                Point3d pt1 = new Point3d(100, 100, 0);
                Point3d pt2 = new Point3d(200, 200, 0);
                Line line = new Line();
                line.StartPoint = pt1;
                line.EndPoint = pt2;
                line.Color = Color.FromRgb(0, 255, 0);


                // A.
                Matrix3d mt = Matrix3d.Scaling(2, pt1);

                // B.
                // 注意：这里不能调用 UpgradeOpen，因为还没有添加的数据库
                // line.UpgradeOpen();
                line.TransformBy(mt);
                // line.DowngradeOpen();


                // 第 2 步，添加到数据库
                BlockTable table = (BlockTable)trans.GetObject(
                    db.BlockTableId,
                    OpenMode.ForRead
                );
                BlockTableRecord block = (BlockTableRecord)trans.GetObject(
                    table[BlockTableRecord.ModelSpace],
                    OpenMode.ForWrite
                );

                block.AppendEntity(line);
                trans.AddNewlyCreatedDBObject(line, true);

                // 第 3 步，提交事务
                trans.Commit();
            }
        }
    }
}
```

## 示例二

```csharp
using System;
using Autodesk.AutoCAD.ApplicationServices;
using Autodesk.AutoCAD.Colors;
using Autodesk.AutoCAD.DatabaseServices;
using Autodesk.AutoCAD.Geometry;
using Autodesk.AutoCAD.Runtime;

namespace Lsieun.Cad.DrawObjects.Transformation
{
    public class Rotate02PolarUtility
    {
        [CommandMethod("Rotate02Line")]
        public void RotateLine()
        {
            Document doc = Application.DocumentManager.MdiActiveDocument;
            Database db = doc.Database;

            using (Transaction trans = db.TransactionManager.StartTransaction())
            {
                // 第 1 步，添加线
                Point3d pt1 = new Point3d(100, 100, 0);
                Point3d pt2 = new Point3d(200, 200, 0);
                Line line = new Line();
                line.StartPoint = pt1;
                line.EndPoint = pt2;


                // 第 2 步，添加到数据库
                BlockTable table = (BlockTable)trans.GetObject(
                    db.BlockTableId,
                    OpenMode.ForRead
                );
                BlockTableRecord block = (BlockTableRecord)trans.GetObject(
                    table[BlockTableRecord.ModelSpace],
                    OpenMode.ForWrite
                );

                block.AppendEntity(line);
                trans.AddNewlyCreatedDBObject(line, true);


                // A.
                int num = 8;
                for (int i = 1; i < num; i++)
                {
                    Matrix3d mt = Matrix3d.Rotation(2 * Math.PI / num * i, Vector3d.ZAxis, pt1);
                    Entity entity = line.GetTransformedCopy(mt);
                    entity.Color = Color.FromRgb(0, 255, 0);

                    block.AppendEntity(entity);
                    trans.AddNewlyCreatedDBObject(entity, true);
                }


                // 第 3 步，提交事务
                trans.Commit();
            }
        }
    }
}
```
