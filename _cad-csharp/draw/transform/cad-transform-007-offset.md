---
title: "Offset"
sequence: "107"
---

```csharp
using Autodesk.AutoCAD.ApplicationServices;
using Autodesk.AutoCAD.Colors;
using Autodesk.AutoCAD.DatabaseServices;
using Autodesk.AutoCAD.Geometry;
using Autodesk.AutoCAD.Runtime;

namespace Lsieun.Cad.DrawObjects.Transformation
{
    public class Offset01LineUtility
    {
        [CommandMethod("Offset01Line")]
        public void OffsetLine()
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
                DBObjectCollection offsetCurves = line.GetOffsetCurves(10);
                Entity[] offsetEntities = new Entity[offsetCurves.Count];
                offsetCurves.CopyTo(offsetEntities, 0);

                // B.
                foreach (Entity entity in offsetEntities)
                {
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

