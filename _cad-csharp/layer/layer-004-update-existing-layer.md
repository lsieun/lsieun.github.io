---
title: "Update existing Layer"
sequence: "104"
---

```csharp
using Autodesk.AutoCAD.ApplicationServices;
using Autodesk.AutoCAD.Colors;
using Autodesk.AutoCAD.DatabaseServices;
using Autodesk.AutoCAD.Runtime;
using Exception = System.Exception;

namespace Lsieun.Cad.Organization.Layers
{
    public class CUpdateLayerUtility
    {
        [CommandMethod("UpdateLayer")]
        public void UpdateLayer()
        {
            Document doc = Application.DocumentManager.MdiActiveDocument;
            Database db = doc.Database;

            using (Transaction trans = db.TransactionManager.StartTransaction())
            {
                try
                {
                    ObjectId tableId = db.LayerTableId;
                    LayerTable table = trans.GetObject(tableId, OpenMode.ForRead) as LayerTable;

                    foreach (ObjectId layerId in table)
                    {
                        LayerTableRecord layer = trans.GetObject(layerId, OpenMode.ForRead) as LayerTableRecord;

                        if (layer.Name == "Misc")
                        {
                            // 第 1 步，获取 LineType
                            ObjectId linetypeObjectId = ObjectId.Null;
                            ObjectId lineTypeTableId = db.LinetypeTableId;
                            LinetypeTable linetypeTable =
                                trans.GetObject(lineTypeTableId, OpenMode.ForRead) as LinetypeTable;
                            if (linetypeTable.Has("Hidden"))
                            {
                                linetypeObjectId = linetypeTable["Hidden"];
                            }

                            // 第 2 步，更新 Layer
                            layer.UpgradeOpen();

                            // Update the Color
                            layer.Color = Color.FromColorIndex(ColorMethod.ByLayer, 2);
                            // Update the LineType
                            if (linetypeObjectId != ObjectId.Null)
                            {
                                layer.LinetypeObjectId = linetypeObjectId;
                            }

                            layer.DowngradeOpen();

                            // 第 3 步，提交事务
                            trans.Commit();

                            // 第 4 步，信息提示
                            doc.Editor.WriteMessage("Layer [" + layer.Name + "] Updating Completed\n");
                            
                            break;
                        }
                        else
                        {
                            doc.Editor.WriteMessage("Skipping Layer [" + layer.Name + "]\n");
                        }
                    }
                }
                catch (Exception ex)
                {
                    doc.Editor.WriteMessage("Error encountered: " + ex.Message);
                    trans.Abort();
                }
            }
        }
    }
}
```
