---
title: "单行文本"
sequence: "102"
---

注意：需要将 `DotNetARX.dll` 复制到 AutoCAD 的安装目录。

## 直接添加

```csharp
using Autodesk.AutoCAD.ApplicationServices;
using Autodesk.AutoCAD.Colors;
using Autodesk.AutoCAD.DatabaseServices;
using Autodesk.AutoCAD.Geometry;
using Autodesk.AutoCAD.Runtime;
using DotNetARX;

namespace Lsieun.Cad.Basic.Text
{
    public class OneLineText
    {
        [CommandMethod("CmdDBText")]
        public void CmdDBText()
        {

            Database db = HostApplicationServices.WorkingDatabase;
            using (Transaction trans = db.TransactionManager.StartTransaction())
            {
                DBText text = new DBText();
                text.TextString = "Text From C# 二次开发";
                text.Position = new Point3d(0, 0, 0);
                text.Height = 500;
                text.Color = Color.FromRgb(200, 200, 200);

                db.AddToModelSpace(text);

                trans.Commit();
            }

            Document doc = Application.DocumentManager.MdiActiveDocument;
            doc.SendStringToExecute("Zoom E ", true, false, false);

            // Database db = doc.Database;
        }
    }
}
```

## LineWithARX

```csharp
using Autodesk.AutoCAD.DatabaseServices;
using Autodesk.AutoCAD.Geometry;
using Autodesk.AutoCAD.Runtime;
using DotNetARX;

namespace Lsieun.Cad.Basic.Shape
{
    public class LinesWithARX
    {
        [CommandMethod("SecondLine")]
        public void SecondLine()
        {
            Database db = HostApplicationServices.WorkingDatabase;
            Point3d startPoint = new Point3d(0, 100, 0);
            Point3d stopPoint = new Point3d(100, 200, 0);
            Line line = new Line(startPoint, stopPoint);
            db.AddToModelSpace(line);
        }
    }
}
```