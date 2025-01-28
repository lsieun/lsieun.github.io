---
title: "角度"
sequence: "101"
---

## 二维

```csharp
using System;
using Autodesk.AutoCAD.ApplicationServices;
using Autodesk.AutoCAD.EditorInput;
using Autodesk.AutoCAD.Geometry;
using Autodesk.AutoCAD.Runtime;

namespace Lsieun.Cad.Basic.Shape
{
    public class MyAngleUtility
    {
        [CommandMethod("ShowAngle")]
        public void ShowAngle()
        {
            double x = Math.Sqrt(3);
            double y = 1;

            Vector2d vector = new Vector2d(x, y);
            double angle = vector.Angle;

            double degree = angle * 180 / Math.PI;

            Document doc = Application.DocumentManager.MdiActiveDocument;
            Editor ed = doc.Editor;
            ed.WriteMessage("degree = " + degree);
        }
    }
}
```

```csharp
using System;
using Autodesk.AutoCAD.ApplicationServices;
using Autodesk.AutoCAD.EditorInput;
using Autodesk.AutoCAD.Geometry;
using Autodesk.AutoCAD.Runtime;

namespace Lsieun.Cad.Basic.Shape
{
    public class MyAngleUtility
    {
        [CommandMethod("ShowAngle")]
        public void ShowAngle()
        {
            double x = Math.Sqrt(3);
            double y = 1;

            Vector2d vector = new Vector2d(x, y);
            double radian1 = vector.Angle;

            double degree1 = FromRadian2Degree(radian1);
            
            double radian2 = GetRadian(x, 0, x, y);
            double degree2 = FromRadian2Degree(radian2);

            string msg = "degree1 = " + degree1 + "\n" +
                         "degree2 = " + degree2 + "\n";
            
            Document doc = Application.DocumentManager.MdiActiveDocument;
            Editor ed = doc.Editor;
            ed.WriteMessage(msg);
        }

        public double FromRadian2Degree(double radian)
        {
            double degree = radian * 180 / Math.PI;
            return degree;
        }

        public double GetRadian(double x1, double y1, double x2, double y2)
        {
            double dotProduct = x1 * x2 + y1 * y2;
            double magnitudeA = Math.Sqrt(x1 * x1 + y1 * y1);
            double magnitudeB = Math.Sqrt(x2 * x2 + y2 * y2);
            double cosTheta = dotProduct / (magnitudeA * magnitudeB);
            return Math.Acos(cosTheta);
        }
    }
}
```
