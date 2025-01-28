---
title: "Set LineType to an object"
sequence: "106"
---

```csharp
using Autodesk.AutoCAD.ApplicationServices;
using Autodesk.AutoCAD.DatabaseServices;
using Autodesk.AutoCAD.Geometry;
using Autodesk.AutoCAD.Runtime;

namespace Lsieun.Cad.Styles.Lines
{
    public class ESetLineTypeToObject
    {
        [CommandMethod("SetLineTypeToObject")]
        public void SetLineTypeToObject()
        {
            Document doc = Application.DocumentManager.MdiActiveDocument;
            Database db = doc.Database;

            using (Transaction trans = db.TransactionManager.StartTransaction())
            {
                BlockTable table = (BlockTable)trans.GetObject(
                    db.BlockTableId,
                    OpenMode.ForRead
                );
                BlockTableRecord block = (BlockTableRecord)trans.GetObject(
                    table[BlockTableRecord.ModelSpace],
                    OpenMode.ForWrite
                );

                Point3d pt1 = new Point3d(0, 0, 0);
                Point3d pt2 = new Point3d(100, 100, 0);
                Line line = new Line(pt1, pt2);
                
                // Set the LineType
                line.Linetype = "CENTER";

                block.AppendEntity(line);
                trans.AddNewlyCreatedDBObject(line, true);
                
                trans.Commit();
            }
        }
    }
}
```
