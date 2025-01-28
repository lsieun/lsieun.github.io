---
title: "Move"
sequence: "104"
---

```csharp
using Autodesk.AutoCAD.ApplicationServices;
using Autodesk.AutoCAD.DatabaseServices;
using Autodesk.AutoCAD.EditorInput;
using Autodesk.AutoCAD.Geometry;
using Autodesk.AutoCAD.Runtime;
using Exception = System.Exception;

namespace Lsieun.Cad.ManipulateObjects
{
    public class MoveObjectUtility
    {
        [CommandMethod("MoveObject")]
        public void MoveObject()
        {
            // Get the current document and database
            Document doc = Application.DocumentManager.MdiActiveDocument;
            Database db = doc.Database;
            
            PromptEntityResult result = doc.Editor.GetEntity("\n选择实体");
            if (result.Status != PromptStatus.OK)
            {
                return;
            }

            ObjectId objId = result.ObjectId;

            // Start a transaction
            using (Transaction trans = db.TransactionManager.StartTransaction())
            {
                try
                {
                    // Create a matrix and move the circle using a vector from (0,0,0) to (2,0,0)
                    Point3d srcPt = new Point3d(0, 0, 0);
                    Point3d destPt = new Point3d(2, 0, 0);
                    Vector3d vector = srcPt.GetVectorTo(destPt);
                    Matrix3d mt = Matrix3d.Displacement(vector);
                    
                    Entity entity = (Entity)trans.GetObject(objId, OpenMode.ForRead);
                    entity.UpgradeOpen();
                    entity.TransformBy(mt);
                    entity.DowngradeOpen();

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