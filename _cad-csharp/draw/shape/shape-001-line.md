//---
title: "Line"
sequence: "101"
---

```csharp
using Autodesk.AutoCAD.DatabaseServices;
using Autodesk.AutoCAD.Geometry;
using Autodesk.AutoCAD.Runtime;

namespace Lsieun.Cad.Basic.Shape
{
    public class Lines
    {
        [CommandMethod("FirstLine")]
        public void FirstLine()
        {
            Database db = HostApplicationServices.WorkingDatabase;

            Point3d startPoint = new Point3d(0, 100, 0);
            Point3d stopPoint = new Point3d(100, 100, 0);
            Line line = new Line(startPoint, stopPoint);

            using (Transaction trans = db.TransactionManager.StartTransaction())
            {
                // 以读方式打开块表
                BlockTable bt = trans.GetObject(db.BlockTableId, OpenMode.ForRead) as BlockTable;
                // 以写方式打开模型空间块表记录
                BlockTableRecord btr =
                    trans.GetObject(bt[BlockTableRecord.ModelSpace], OpenMode.ForWrite) as BlockTableRecord;
                // 将图形对象的信息添加到块表记录中，并返回ObjectId对象
                btr.AppendEntity(line);

                // 把对象添加到事务处理中
                trans.AddNewlyCreatedDBObject(line, true);
                // 提交事务
                trans.Commit();
            }
        }
    }
}
```

```csharp
using Autodesk.AutoCAD.ApplicationServices;
using Autodesk.AutoCAD.DatabaseServices;
using Autodesk.AutoCAD.Geometry;
using Autodesk.AutoCAD.Runtime;

namespace Lsieun.Cad.DrawObjects.Lines
{
    public class Draw01LineUtility
    {
        [CommandMethod("DrawLine")]
        public void DrawLine()
        {
            Document doc = Application.DocumentManager.MdiActiveDocument;
            Database db = doc.Database;

            using (Transaction trans = db.TransactionManager.StartTransaction())
            {
                try
                {
                    BlockTable table = (BlockTable)trans.GetObject(
                        db.BlockTableId,
                        OpenMode.ForRead
                    );
                    BlockTableRecord block = (BlockTableRecord)trans.GetObject(
                        table[BlockTableRecord.ModelSpace],
                        OpenMode.ForWrite
                    );

                    // Send a message to the user
                    doc.Editor.WriteMessage("\nDrawing a Line object: ");
                    Point3d pt1 = Point3d.Origin;
                    Point3d pt2 = new Point3d(100, 100, 0);

                    Line line = new Line(pt1, pt2);
                    line.ColorIndex = 1;    // Color is red

                    block.AppendEntity(line);
                    trans.AddNewlyCreatedDBObject(line, true);

                    trans.Commit();
                }
                catch (Exception ex)
                {
                    trans.Abort();
                    doc.Editor.WriteMessage("Error encountered: " + ex.Message);
                }
            }
        }
    }
}
```

```csharp
using Autodesk.AutoCAD.DatabaseServices;
using Autodesk.AutoCAD.Geometry;
using Autodesk.AutoCAD.Runtime;
using DotNetARX;

namespace Lsieun.Cad.Basic.Shape
{
    public class LinesWithARX
    {
        [CommandMethod("SecondLine")]
        public void SecondLine()
        {
            Database db = HostApplicationServices.WorkingDatabase;
            Point3d startPoint = new Point3d(0, 100, 0);
            Point3d stopPoint = new Point3d(100, 200, 0);
            Line line = new Line(startPoint, stopPoint);
            db.AddToModelSpace(line);
        }
    }
}
```
