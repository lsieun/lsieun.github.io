---
title: "准备"
sequence: "102"
---

```csharp
using Autodesk.AutoCAD.ApplicationServices;
using Autodesk.AutoCAD.DatabaseServices;
using Autodesk.AutoCAD.Geometry;
using Autodesk.AutoCAD.Runtime;

namespace Lsieun.Cad.DrawObjects.Transformation
{
    public class BasicGraphUtility
    {
        [CommandMethod("PrepareTransformation")]
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


                // 第 4 步，添加到数据库
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


                // 第 5 步，提交事务
                trans.Commit();
            }
        }
    }
}
```

![](/assets/images/cad/csharp/transform/cad-transform-001.png)

