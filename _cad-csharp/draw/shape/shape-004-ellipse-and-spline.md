---
title: "Ellipse And Spline"
sequence: "104"
---

```csharp
using System;
using Autodesk.AutoCAD.ApplicationServices;
using Autodesk.AutoCAD.DatabaseServices;
using Autodesk.AutoCAD.Geometry;
using Autodesk.AutoCAD.Runtime;
using DotNetARX;

namespace Lsieun.Cad.Basic.Shape
{
    public class EllipseAndSpline
    {
        [CommandMethod("AddEllipse")]
        public void AddEllipse()
        {
            Database db = HostApplicationServices.WorkingDatabase;
            using (Transaction trans = db.TransactionManager.StartTransaction())
            {
                Vector3d majorAxis = new Vector3d(40, 0, 0); // 长轴端点

                // 使用中心点、所在平面、长轴矢量和半径比例（0.5）创建一个椭圆
                Ellipse ellipse1 = new Ellipse(
                    Point3d.Origin, Vector3d.ZAxis,
                    majorAxis, 0.5,
                    0, 2 * Math.PI
                );

                Ellipse ellipse2 = new Ellipse();
                Point3d pt1 = new Point3d(-40, -40, 0);
                Point3d pt2 = new Point3d(40, 40, 0);
                ellipse2.CreateEllipse(pt1, pt2);

                // 创建椭圆弧
                majorAxis = new Vector3d(0, 40, 0);
                Ellipse ellipseArc = new Ellipse(
                    Point3d.Origin, Vector3d.ZAxis,
                    majorAxis, 0.25,
                    Math.PI, 2 * Math.PI
                );
                
                // 添加实体到模型空间
                db.AddToModelSpace(ellipse1, ellipse2, ellipseArc);
                trans.Commit();
            }
            
            Document doc = Application.DocumentManager.MdiActiveDocument;
            doc.SendStringToExecute("Zoom E ", true, false, false);
        }

        [CommandMethod("AddSpline")]
        public void AddSpline()
        {
            Database db = HostApplicationServices.WorkingDatabase;
            using (Transaction trans = db.TransactionManager.StartTransaction())
            {
                // 使用样本点直接创建4阶样条曲线
                Point3dCollection pts = new Point3dCollection();
                pts.Add(new Point3d(0, 0, 0));
                pts.Add(new Point3d(10, 30, 0));
                pts.Add(new Point3d(60, 80, 0));
                pts.Add(new Point3d(100, 100, 0));
                Spline spline1 = new Spline(pts, 4, 0);
                
                // 根据起点和终点为的切线方向创建样条曲线
                Vector3d startTangent = new Vector3d(5, 1, 0);
                Vector3d endTangent = new Vector3d(5, 1, 0);
                pts[1] = new Point3d(30, 10, 0);
                pts[2] = new Point3d(80, 60, 0);
                Spline spline2 = new Spline(pts, startTangent, endTangent, 4, 0);

                db.AddToModelSpace(spline1, spline2);
                trans.Commit();
            }
            
            Document doc = Application.DocumentManager.MdiActiveDocument;
            doc.SendStringToExecute("Zoom E ", true, false, false);
        }
    }
}
```
