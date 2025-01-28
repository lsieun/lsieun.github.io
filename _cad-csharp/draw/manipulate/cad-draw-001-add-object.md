---
title: "Add"
sequence: "101"
---

```csharp
using Autodesk.AutoCAD.ApplicationServices;
using Autodesk.AutoCAD.DatabaseServices;
using Autodesk.AutoCAD.Geometry;
using Autodesk.AutoCAD.Runtime;
using Exception = System.Exception;

namespace Lsieun.Cad.ManipulateObjects
{
    public class AddObjectUtility
    {
        [CommandMethod("AddObject")]
        public void AddObject()
        {
            // Get the current document and database
            Document doc = Application.DocumentManager.MdiActiveDocument;
            Database db = doc.Database;

            // Start a transaction
            using (Transaction trans = db.TransactionManager.StartTransaction())
            {
                try
                {
                    // Open the BlockTable for read
                    BlockTable table = (BlockTable)trans.GetObject(
                        db.BlockTableId,
                        OpenMode.ForRead
                    );
                    // Open the Block table record Model space for write
                    BlockTableRecord block = (BlockTableRecord)trans.GetObject(
                        table[BlockTableRecord.ModelSpace],
                        OpenMode.ForWrite
                    );

                    using (Circle c1 = new Circle())
                    {
                        c1.Center = new Point3d(2, 3, 0);
                        c1.Radius = 4.25;

                        block.AppendEntity(c1);
                        trans.AddNewlyCreatedDBObject(c1, true);
                    }

                    trans.Commit();

                    doc.SendStringToExecute("._zoom e ", false, false, false);
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
