---
title: "准备"
sequence: "102"
---

```csharp
using Autodesk.AutoCAD.ApplicationServices;
using Autodesk.AutoCAD.DatabaseServices;
using Autodesk.AutoCAD.EditorInput;
using Autodesk.AutoCAD.Geometry;
using Autodesk.AutoCAD.Runtime;

namespace Lsieun.Cad.UserInteraction.Selections
{
    public class APrepareSelectionUtility
    {
        [CommandMethod("Prepare_Selection")]
        public void PrepareSelection()
        {
            Document doc = Application.DocumentManager.MdiActiveDocument;
            Database db = doc.Database;

            using (Transaction trans = db.TransactionManager.StartTransaction())
            {
                // 第 1 步，获取 block
                BlockTable table = (BlockTable)trans.GetObject(
                    db.BlockTableId,
                    OpenMode.ForRead
                );
                BlockTableRecord block = (BlockTableRecord)trans.GetObject(
                    table[BlockTableRecord.ModelSpace],
                    OpenMode.ForWrite
                );

                // 第 2 步，输入行数和列数
                PromptIntegerResult result1 = doc.Editor.GetInteger("\n请输入行数");
                if (result1.Status != PromptStatus.OK)
                {
                    return;
                }

                PromptIntegerResult result2 = doc.Editor.GetInteger("\n请输入列数");
                if (result2.Status != PromptStatus.OK)
                {
                    return;
                }

                int row = result1.Value;
                int col = result2.Value;

                // 第 3 步，生成圆
                for (int i = 0; i < row; i++)
                {
                    for (int j = 0; j < col; j++)
                    {
                        int x = (i + 1) * 10;
                        int y = (j + 1) * 10;

                        Circle cir = new Circle();
                        cir.Center = new Point3d(x, y, 0);
                        cir.Radius = 3;

                        block.AppendEntity(cir);
                        trans.AddNewlyCreatedDBObject(cir, true);
                    }
                }

                
                // 第 4 步，提交事务
                trans.Commit();

                
                // 第 5 步，信息反馈
                string msg = $"\nDraw Circles ({row}, {col}) successfully!\n";
                doc.Editor.WriteMessage(msg);
                doc.SendStringToExecute("Zoom E ", true, false, false);
            }
        }
    }
}
```
