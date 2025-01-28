---
title: "面积"
sequence: "103"
---

```csharp
using Autodesk.AutoCAD.ApplicationServices;
using Autodesk.AutoCAD.DatabaseServices;
using Autodesk.AutoCAD.EditorInput;
using Autodesk.AutoCAD.Geometry;
using Autodesk.AutoCAD.Runtime;

namespace Lsieun.Cad.Display.Measure
{
    public class AreaUtility
    {
        [CommandMethod("CalculateDefinedArea")]
        public void CalculateDefinedArea()
        {
            // Prompt the user for 5 points
            Document doc = Application.DocumentManager.MdiActiveDocument;

            
            
            PromptPointOptions prompt = new PromptPointOptions("");
            prompt.Message = "\nSpecify first point: ";
            
            PromptPointResult pointResult = doc.Editor.GetPoint(prompt);
            
            Point2dCollection pointColl = new Point2dCollection();
            pointColl.Add(new Point2d(pointResult.Value.X, pointResult.Value.Y));
            
            // Exit if the user precess ESC or cancels the command
            if (pointResult.Status == PromptStatus.Cancel)
            {
                return;
            }

            int nCounter = 1;
            while (nCounter <= 4)
            {
                // Prompt for the next points
                switch (nCounter)
                {
                    case 1:
                        prompt.Message = "\nSpecify second point: ";
                        break;
                    case 2:
                        prompt.Message = "\nSpecify third point: ";
                        break;
                    case 3:
                        prompt.Message = "\nSpecify fourth point: ";
                        break;
                    case 4:
                        prompt.Message = "\nSpecify fifth point: ";
                        break;
                }
                
                // Use the previous point as the base point
                prompt.UseBasePoint = true;
                prompt.BasePoint = pointResult.Value;

                pointResult = doc.Editor.GetPoint(prompt);
                pointColl.Add(new Point2d(pointResult.Value.X, pointResult.Value.Y));

                if (pointResult.Status == PromptStatus.Cancel)
                {
                    return;
                }
                
                // Increment the counter
                nCounter = nCounter + 1;
            }
            
            // Create a polyline with 5 points
            using (Polyline polyline = new Polyline())
            {
                polyline.AddVertexAt(0, pointColl[0], 0, 0, 0);
                polyline.AddVertexAt(1, pointColl[1], 0, 0, 0);
                polyline.AddVertexAt(2, pointColl[2], 0, 0, 0);
                polyline.AddVertexAt(3, pointColl[3], 0, 0, 0);
                polyline.AddVertexAt(4, pointColl[4], 0, 0, 0);
                
                // Close the polyline
                polyline.Closed = true;

                // Query the area of the polyline
                double area = polyline.Area;
                string msg = $"Area of polyline: {area}";
                Application.ShowAlertDialog(msg);
                
                // Dispose of the polyline
            }
        }
    }
}
```
