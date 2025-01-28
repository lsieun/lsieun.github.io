---
title: "Lock Document"
sequence: "102"
---

```csharp
using Autodesk.AutoCAD.ApplicationServices;
using Autodesk.AutoCAD.DatabaseServices;
using Autodesk.AutoCAD.Geometry;
using Autodesk.AutoCAD.Runtime;

namespace Lsieun.Cad.Doc
{
    public class MyDocLockUtility
    {
        [CommandMethod("LockDoc", CommandFlags.Session)]
        public void LockDoc()
        {
            // Create a new drawing
            DocumentCollection docManager = Application.DocumentManager;
            Document doc = docManager.Add("acad.dwt");
            Database db = doc.Database;

            // Lock the new document
            using (DocumentLock docLock = doc.LockDocument())
            {
                // Start a transaction in the new database
                using (Transaction trans = db.TransactionManager.StartTransaction())
                {
                    // Open the Block table for read
                    BlockTable table = (BlockTable)trans.GetObject(
                        db.BlockTableId,
                        OpenMode.ForRead
                    );

                    // Open the Block table record Model space for write
                    BlockTableRecord record = (BlockTableRecord)trans.GetObject(
                        table[BlockTableRecord.ModelSpace],
                        OpenMode.ForWrite
                    );

                    Circle cir = new Circle();
                    cir.Center = new Point3d(5, 5, 0);
                    cir.Radius = 3;

                    record.AppendEntity(cir);
                    trans.AddNewlyCreatedDBObject(cir, true);

                    // Save the new object to the database
                    trans.Commit();
                }

                // Unlock the document
            }

            // Set the new document current
            docManager.MdiActiveDocument = doc;
        }
    }
}
```
