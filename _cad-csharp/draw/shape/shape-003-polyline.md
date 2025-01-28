---
title: "Polyline"
sequence: "103"
---

## 多段线

AutoCAD 中包括三种类型的多段线：

- 优化多段线：也称为轻量多段线，可以包含直线和圆弧段，可以指定线宽，但是所有顶点必须在同一个平面上。
- 二维多段线：也称为重量多段线，是 AutoCAD 早期的多段线版本，不推荐使用。
- 三维多段线：只能包含直线段，可以指定线宽，不要求所有顶点在同一个平面上。

相比起来，优化多段线使用的范围更广，使用起来涉及的细节也更多。

优化多段线在 .NET 中对应的是 Polyline 对象。

## 代码示例

```csharp
using Autodesk.AutoCAD.ApplicationServices;
using Autodesk.AutoCAD.DatabaseServices;
using Autodesk.AutoCAD.Geometry;
using Autodesk.AutoCAD.Runtime;
using DotNetARX;

namespace Lsieun.Cad.Basic.Shape
{
    public class Polylines
    {
        [CommandMethod("AddPolyline")]
        public void AddPolyline()
        {
            Database db = HostApplicationServices.WorkingDatabase;
            using (Transaction trans = db.TransactionManager.StartTransaction())
            {
                Point2d startPoint = Point2d.Origin;
                Point2d endPoint = new Point2d(100, 100);
                Point2d pt = new Point2d(60, 70);
                Point2d center = new Point2d(50, 50);
                
                // 创建直线
                Polyline pline = new Polyline();
                pline.CreatePolyline(startPoint, endPoint);
                
                // 创建矩形
                Polyline rectangle = new Polyline();
                rectangle.CreateRectangle(pt, endPoint);
                
                // 创建正六边形
                Polyline polygon = new Polyline();
                polygon.CreatePolygon(Point2d.Origin, 6, 30);
                
                // 创建半径为 30 的圆
                Polyline circle = new Polyline();
                circle.CreatePolyCircle(center, 30);
                
                // 创建圆弧，起点角度为 45 度，终点角度为 225 度
                Polyline arc = new Polyline();
                double startAngle = 45;
                double endAngle = 225;
                arc.CreatePolyArc(center, 50, startAngle.DegreeToRadian(), endAngle.DegreeToRadian());
                
                // 添加对象到模型空间
                db.AddToModelSpace(pline, rectangle, polygon, circle, arc);
                trans.Commit();
            }
            
            Document doc = Application.DocumentManager.MdiActiveDocument;
            doc.SendStringToExecute("Zoom E ", true, false, false);
        }
    }
}
```
