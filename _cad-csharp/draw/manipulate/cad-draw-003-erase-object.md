---
title: "Erase"
sequence: "103"
---

```csharp
using Autodesk.AutoCAD.ApplicationServices;
using Autodesk.AutoCAD.DatabaseServices;
using Autodesk.AutoCAD.EditorInput;
using Autodesk.AutoCAD.Runtime;
using Exception = System.Exception;

namespace Lsieun.Cad.ManipulateObjects
{
    public class EraseObjectUtility
    {
        [CommandMethod("EraseObject")]
        public void EraseObject()
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
                    Entity entity = (Entity)objId.GetObject(OpenMode.ForRead);
                    entity.UpgradeOpen();
                    entity.Erase(true);
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