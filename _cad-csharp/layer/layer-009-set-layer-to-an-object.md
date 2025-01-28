---
title: "Set layer to an object"
sequence: "109"
---

```csharp
using Autodesk.AutoCAD.ApplicationServices;
using Autodesk.AutoCAD.DatabaseServices;
using Autodesk.AutoCAD.Geometry;
using Autodesk.AutoCAD.Runtime;

namespace Lsieun.Cad.Organization.Layers
{
    public class HSetLayerToObjectUtility
    {
        [CommandMethod("SetLayerToObject")]
        public void SetLayerToObject()
        {
            Document doc = Application.DocumentManager.MdiActiveDocument;
            Database db = doc.Database;

            using (Transaction trans = db.TransactionManager.StartTransaction())
            {
                ObjectId tableId = db.BlockTableId;
                BlockTable table = trans.GetObject(tableId, OpenMode.ForRead) as BlockTable;

                BlockTableRecord record = trans.GetObject(
                    table[BlockTableRecord.ModelSpace], OpenMode.ForWrite
                ) as BlockTableRecord;

                Point3d pt1 = new Point3d(0, 0, 0);
                Point3d pt2 = new Point3d(100, 100, 0);
                Line line = new Line(pt1, pt2);
                
                
                // Assign a layer to the line
                line.Layer = "Misc";


                record.AppendEntity(line);
                trans.AddNewlyCreatedDBObject(line, true);
                
                trans.Commit();

                string msg = "New line object was added to Misc Layer\n";
                doc.Editor.WriteMessage(msg);
            }
        }
    }
}
```
