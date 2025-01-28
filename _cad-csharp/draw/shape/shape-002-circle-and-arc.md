---
title: "Circle And Arc"
sequence: "102"
---

```csharp
using Autodesk.AutoCAD.ApplicationServices;
using Autodesk.AutoCAD.DatabaseServices;
using Autodesk.AutoCAD.Geometry;
using Autodesk.AutoCAD.Runtime;
using DotNetARX;

namespace Lsieun.Cad.Basic.Shape
{
    public class CircleAndArc
    {
        [CommandMethod("Fan")]
        public void Fan()
        {
            Database db = HostApplicationServices.WorkingDatabase;
            using (Transaction trans = db.TransactionManager.StartTransaction())
            {
                // 定义圆弧上的三个点
                Point3d startPoint = new Point3d(100, 0, 0);
                Point3d pointOnArc = new Point3d(50, 25, 0);
                Point3d endPoint = new Point3d();

                // 调用三点法画圆弧的扩展函数创建扇形的圆弧
                Arc arc = new Arc();
                arc.CreateArc(startPoint, pointOnArc, endPoint);

                // 创建扇形的两条半径
                Line line1 = new Line(arc.Center, startPoint);
                Line line2 = new Line(arc.Center, endPoint);

                // 一次性添加实体到模型空间，完成扇形的创建
                db.AddToModelSpace(line1, line2, arc);
                trans.Commit();
            }

            Document doc = Application.DocumentManager.MdiActiveDocument;
            doc.SendStringToExecute("Zoom E ", true, false, false);
        }
    }
}
```
