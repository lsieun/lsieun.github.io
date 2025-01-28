---
title: "距离"
sequence: "102"
---

```csharp
using Autodesk.AutoCAD.ApplicationServices;
using Autodesk.AutoCAD.EditorInput;
using Autodesk.AutoCAD.Geometry;
using Autodesk.AutoCAD.Runtime;

namespace Lsieun.Cad.Basic.Shape
{
    public class MyDistanceUtility
    {
        [CommandMethod("ShowDistance")]
        public void ShowDistance()
        {
            Point3d pt1 = Point3d.Origin;
            Point3d pt2 = new Point3d(1, 1, 1);
            double distance = pt1.DistanceTo(pt2);

            string msg = "distance = " + distance;

            Document doc = Application.DocumentManager.MdiActiveDocument;
            Editor ed = doc.Editor;
            ed.WriteMessage(msg);
        }
    }
}
```
