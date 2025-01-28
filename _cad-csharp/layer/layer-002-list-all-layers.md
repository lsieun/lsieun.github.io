---
title: "List all Layers"
sequence: "102"
---

```csharp
using Autodesk.AutoCAD.ApplicationServices;
using Autodesk.AutoCAD.DatabaseServices;
using Autodesk.AutoCAD.Runtime;

namespace Lsieun.Cad.Organization.Layers
{
    public class AListLayersUtility
    {
        [CommandMethod("ListLayers")]
        public void ListLayers()
        {
            Document doc = Application.DocumentManager.MdiActiveDocument;
            Database db = doc.Database;

            using (Transaction trans = db.TransactionManager.StartTransaction())
            {
                LayerTable table = (LayerTable)trans.GetObject(db.LayerTableId, OpenMode.ForRead);

                foreach (ObjectId layerId in table)
                {
                    LayerTableRecord layer = trans.GetObject(layerId, OpenMode.ForRead) as LayerTableRecord;

                    string msg = "Layer name: " + layer.Name + "\n";
                    doc.Editor.WriteMessage(msg);
                }

                // Commit the transaction
                trans.Commit();
            }
        }
    }
}
```
