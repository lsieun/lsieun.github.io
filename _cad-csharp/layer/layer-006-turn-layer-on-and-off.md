---
title: "Turn Layer On/Off"
sequence: "106"
---

```csharp
using Autodesk.AutoCAD.ApplicationServices;
using Autodesk.AutoCAD.DatabaseServices;
using Autodesk.AutoCAD.Runtime;

namespace Lsieun.Cad.Organization.Layers
{
    public class ESwitchLayerOnOrOffUtility
    {
        [CommandMethod("SwitchLayerOnOrOff")]
        public void SwitchLayerOnOrOff()
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

                            // Turn the layer ON or OFF
                            layer.IsOff = !layer.IsOff;

                            // Commit the transaction
                            trans.Commit();

                            string msg = "Layer [" + layer.Name + "] switch on/off successfully\n";
                            doc.Editor.WriteMessage(msg);

                            break;
                        }
                        else
                        {
                            string msg = "Skipping Layer [" + layer.Name + "]\n";
                            doc.Editor.WriteMessage(msg);
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
