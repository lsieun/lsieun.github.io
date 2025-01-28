---
title: "Move"
sequence: "103"
---

注意：图形对象必须在**写**的状态下，才能进行平移，其他编辑操作也是这样。

还未加入到数据库中的实体，本身就处于打开状态，因此可以直接对实体进行移动。

## 加入数据库之前

```csharp
using Autodesk.AutoCAD.ApplicationServices;
using Autodesk.AutoCAD.DatabaseServices;
using Autodesk.AutoCAD.Geometry;
using Autodesk.AutoCAD.Runtime;

namespace Lsieun.Cad.DrawObjects.Transformation
{
    public class Move01LineUtility
    {
        [CommandMethod("MoveLine")]
        public void MoveLine()
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


                // A.
                Point3d sourcePt = Point3d.Origin;
                Point3d targetPt = new Point3d(50, -50, 0);
                Vector3d vector = sourcePt.GetVectorTo(targetPt);
                Matrix3d mt = Matrix3d.Displacement(vector);
                
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

## 加入数据库之后

```csharp
using Autodesk.AutoCAD.ApplicationServices;
using Autodesk.AutoCAD.DatabaseServices;
using Autodesk.AutoCAD.Geometry;
using Autodesk.AutoCAD.Runtime;

namespace Lsieun.Cad.DrawObjects.Transformation
{
    public class Move02LineUtility
    {
        [CommandMethod("Move02Line")]
        public void MoveLine()
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
                Point3d sourcePt = Point3d.Origin;
                Point3d targetPt = new Point3d(50, -50, 0);
                Vector3d vector = sourcePt.GetVectorTo(targetPt);
                Matrix3d mt = Matrix3d.Displacement(vector);
                
                // B. 
                // 可以调用 UpgradeOpen 方法。
                // 注意：即使不调用，也能移动成功。
                // line.UpgradeOpen();
                line.TransformBy(mt);
                // line.DowngradeOpen();

                // 第 3 步，提交事务
                trans.Commit();
            }
        }
    }
}
```

### 无聊的测试

```csharp
using Autodesk.AutoCAD.ApplicationServices;
using Autodesk.AutoCAD.DatabaseServices;
using Autodesk.AutoCAD.Geometry;
using Autodesk.AutoCAD.Runtime;

namespace Lsieun.Cad.DrawObjects.Transformation
{
    public class Move03LineUtility
    {
        [CommandMethod("Move03Line")]
        public void MoveLine()
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

                ObjectId lineId = block.AppendEntity(line);
                trans.AddNewlyCreatedDBObject(line, true);
                
                // A.
                Point3d sourcePt = Point3d.Origin;
                Point3d targetPt = new Point3d(50, -50, 0);
                Vector3d vector = sourcePt.GetVectorTo(targetPt);
                Matrix3d mt = Matrix3d.Displacement(vector);
                
                // B. 
                Entity entity = (Entity)trans.GetObject(
                    lineId,
                    OpenMode.ForRead
                );
                // entity.UpgradeOpen();
                entity.TransformBy(mt);
                // entity.DowngradeOpen();

                // 第 3 步，提交事务
                trans.Commit();
            }
        }
    }
}
```

### Copy

```csharp
using Autodesk.AutoCAD.ApplicationServices;
using Autodesk.AutoCAD.DatabaseServices;
using Autodesk.AutoCAD.Geometry;
using Autodesk.AutoCAD.Runtime;

namespace Lsieun.Cad.DrawObjects.Transformation
{
    public class Move04LineByCopyUtility
    {
        [CommandMethod("MoveLineByCopy")]
        public void MoveLine()
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

                // 第 2 步，添加圆
                Circle cir = new Circle();
                cir.Center = pt1;
                cir.Radius = 50;

                // 第 3 步，添加矩形
                Polyline rectangle = new Polyline();
                rectangle.AddVertexAt(0, new Point2d(50, 50), 0, 0, 0);
                rectangle.AddVertexAt(1, new Point2d(50, 150), 0, 0, 0);
                rectangle.AddVertexAt(2, new Point2d(150, 150), 0, 0, 0);
                rectangle.AddVertexAt(3, new Point2d(150, 50), 0, 0, 0);
                rectangle.Closed = true;
                
                // 第 4 步，移动
                Point3d sourcePt = Point3d.Origin;
                Point3d targetPt = new Point3d(50, -50, 0);
                Vector3d vector = sourcePt.GetVectorTo(targetPt);
                Matrix3d mt = Matrix3d.Displacement(vector);
                Entity copy = line.GetTransformedCopy(mt);

                
                // 第 5 步，添加到数据库
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

                block.AppendEntity(cir);
                trans.AddNewlyCreatedDBObject(cir, true);

                block.AppendEntity(rectangle);
                trans.AddNewlyCreatedDBObject(rectangle, true);

                block.AppendEntity(copy);
                trans.AddNewlyCreatedDBObject(copy, true);

                // 第 6 步，提交事务
                trans.Commit();
            }
        }
    }
}
```
