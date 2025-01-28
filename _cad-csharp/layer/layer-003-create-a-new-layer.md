---
title: "Create a new Layer"
sequence: "103"
---

```csharp
using Autodesk.AutoCAD.ApplicationServices;
using Autodesk.AutoCAD.Colors;
using Autodesk.AutoCAD.DatabaseServices;
using Autodesk.AutoCAD.Runtime;

namespace Lsieun.Cad.Organization.Layers
{
    public class BCreateLayerUtility
    {
        [CommandMethod("CreateLayer")]
        public void CreateLayer()
        {
            Document doc = Application.DocumentManager.MdiActiveDocument;
            Database db = doc.Database;

            using (Transaction trans = db.TransactionManager.StartTransaction())
            {
                LayerTable table = (LayerTable)trans.GetObject(
                    db.LayerTableId,
                    OpenMode.ForRead
                );

                if (table.Has("Misc"))
                {
                    // 第 1 步，取消事务
                    trans.Abort();

                    // 第 2 步，反馈信息
                    string msg = "Layer already exist.\n";
                    doc.Editor.WriteMessage(msg);
                }
                else
                {
                    // 第 1 步，创建 layer
                    LayerTableRecord layer = new LayerTableRecord();
                    layer.Name = "Misc";
                    layer.Color = Color.FromColorIndex(ColorMethod.ByLayer, 1);

                    // 第 2 步，将 layer 添加到数据库
                    table.UpgradeOpen();
                    ObjectId layerId = table.Add(layer);
                    table.DowngradeOpen();
                    trans.AddNewlyCreatedDBObject(layer, true);

                    // 第 3 步，设置当前图层
                    db.Clayer = layerId;
                    
                    // 第 4 步，提交事务
                    trans.Commit();
                    
                    // 第 5 步，反馈信息
                    doc.Editor.WriteMessage("Layer [" + layer.Name + "] created successfully.");
                }
            }
        }
    }
}
```