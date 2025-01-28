---
title: "Copy"
sequence: "102"
---

```csharp
using Autodesk.AutoCAD.ApplicationServices;
using Autodesk.AutoCAD.Colors;
using Autodesk.AutoCAD.DatabaseServices;
using Autodesk.AutoCAD.EditorInput;
using Autodesk.AutoCAD.Runtime;
using Exception = System.Exception;

namespace Lsieun.Cad.ManipulateObjects
{
    public class CopyObjectUtility
    {
        [CommandMethod("CopyObject")]
        public void CopyObject()
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
                    
                    Entity entity = (Entity)trans.GetObject(objId, OpenMode.ForRead);
                    
                    Entity clonedEntity = (Entity)entity.Clone();
                    clonedEntity.Color = Color.FromColorIndex(ColorMethod.ByAci, 1);
                    
                    block.AppendEntity(clonedEntity);
                    trans.AddNewlyCreatedDBObject(clonedEntity, true);

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
