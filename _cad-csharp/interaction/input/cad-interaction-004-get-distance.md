---
title: "距离-GetDistance"
sequence: "104"
---

## 示例

```csharp
using Autodesk.AutoCAD.ApplicationServices;
using Autodesk.AutoCAD.EditorInput;
using Autodesk.AutoCAD.Runtime;

namespace Lsieun.Cad.UserInteraction.Distance
{
    public class MyDistanceUtility
    {
        [CommandMethod("GetDistanceBetweenTwoPoints")]
        public void GetDistanceBetweenTwoPoints()
        {
            // Get the document object
            Document doc = Application.DocumentManager.MdiActiveDocument;
            Editor ed = doc.Editor;

            PromptDoubleResult result = ed.GetDistance("Pick two points to get the distance: ");
            double value = result.Value;

            string msg = $"Distance between points: {value}";
            Application.ShowAlertDialog(msg);
        }
    }
}
```
