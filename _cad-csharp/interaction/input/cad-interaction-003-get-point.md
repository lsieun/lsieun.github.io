---
title: "点-GetPoint"
sequence: "103"
---

## 示例

### 画线

```csharp
using Autodesk.AutoCAD.ApplicationServices;
using Autodesk.AutoCAD.DatabaseServices;
using Autodesk.AutoCAD.EditorInput;
using Autodesk.AutoCAD.Geometry;
using Autodesk.AutoCAD.Runtime;

namespace Lsieun.Cad.UserInteraction.Point
{
    public class MyPointUtility
    {
        [CommandMethod("CreateLineUsingGetPoint")]
        public void CreateLineUsingGetPoint()
        {
            // Get the document object
            Document doc = Application.DocumentManager.MdiActiveDocument;
            Database db = doc.Database;
            Editor ed = doc.Editor;

            // Prompt for the starting point
            PromptPointOptions prompt1 = new PromptPointOptions("Pick starting points: ");
            PromptPointResult result1 = ed.GetPoint(prompt1);
            Point3d startPoint = result1.Value;

            // Prompt for the end point and specify the startPoint as the base point
            PromptPointOptions prompt2 = new PromptPointOptions("Pick end point: ");
            prompt2.UseBasePoint = true;
            prompt2.BasePoint = startPoint;
            PromptPointResult result2 = ed.GetPoint(prompt2);
            Point3d endPoint = result2.Value;

            if (startPoint == null || endPoint == null)
            {
                ed.WriteMessage("Invalid point.");
                return;
            }

            using (Transaction trans = doc.TransactionManager.StartTransaction())
            {
                // Get the BlockTable
                BlockTable table = (BlockTable) trans.GetObject(db.BlockTableId, OpenMode.ForRead);

                BlockTableRecord block = (BlockTableRecord) trans.GetObject(
                    table[BlockTableRecord.ModelSpace],
                    OpenMode.ForWrite
                );

                // Construct the Line based on the 2 points above
                Line line = new Line(startPoint, endPoint);
                line.SetDatabaseDefaults();

                // Add the line to the drawing
                block.AppendEntity(line);
                trans.AddNewlyCreatedDBObject(line, true);

                // Commit the Transaction
                trans.Commit();
            }
        }
    }
}
```
