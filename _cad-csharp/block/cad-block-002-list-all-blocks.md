---
title: "List All Blocks"
sequence: "102"
---

```csharp
using Autodesk.AutoCAD.ApplicationServices;
using Autodesk.AutoCAD.DatabaseServices;
using Autodesk.AutoCAD.Runtime;

namespace Lsieun.Cad.Organization.Blocks
{
    public class AListBlockUtility
    {
        [CommandMethod("ListAllBlocks")]
        public void ListAllBlocks()
        {
            Document doc = Application.DocumentManager.MdiActiveDocument;
            Database db = doc.Database;

            using (Transaction trans = db.TransactionManager.StartTransaction())
            {
                BlockTable table = (BlockTable)trans.GetObject(
                    db.BlockTableId,
                    OpenMode.ForRead
                );

                foreach (ObjectId blockId in table)
                {
                    BlockTableRecord block = (BlockTableRecord)trans.GetObject(
                        blockId, OpenMode.ForRead
                    );
                    string blockName = block.Name;

                    string msg = "BlockTableRecord: [" + blockName + "]\n";
                    doc.Editor.WriteMessage(msg);
                }

                trans.Commit();
            }
        }
    }
}
```

```text
Command: LISTALLBLOCKS
BlockTableRecord: [*Model_Space]
BlockTableRecord: [*Paper_Space]
BlockTableRecord: [*Paper_Space0]
```
