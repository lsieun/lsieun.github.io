---
title: "Delete existing Layers"
sequence: "105"
---

```csharp
using Autodesk.AutoCAD.ApplicationServices;
using Autodesk.AutoCAD.DatabaseServices;
using Autodesk.AutoCAD.Runtime;

namespace Lsieun.Cad.Organization.Layers
{
    public class DDeleteLayerUtility
    {
        [CommandMethod("DeleteLayer")]
        public void DeleteLayer()
        {
            Document doc = Application.DocumentManager.MdiActiveDocument;
            Database db = doc.Database;

            using (Transaction trans = db.TransactionManager.StartTransaction())
            {
                try
                {
                    ObjectId tableId = db.LayerTableId;
                    LayerTable table = trans.GetObject(tableId, OpenMode.ForRead) as LayerTable;
                    db.Clayer = table["0"];

                    foreach (ObjectId layerId in table)
                    {
                        LayerTableRecord layer = trans.GetObject(layerId, OpenMode.ForRead) as LayerTableRecord;

                        if (layer.Name == "Misc")
                        {
                            layer.UpgradeOpen();

                            // Delete the layer
                            layer.Erase(true);

                            // Commit the transaction
                            trans.Commit();

                            string msg = "Layer [" + layer.Name + "] deleted successfully\n";
                            doc.Editor.WriteMessage(msg);
                            
                            break;
                        }


                    }
                }
                catch (System.Exception ex)
                {
                    trans.Abort();
                    
                    string msg = "Error encountered: " + ex.Message + "\n";
                    doc.Editor.WriteMessage(msg);
                }
            }
        }
    }
}
```
