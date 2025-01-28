---
title: "Rotate"
sequence: "104"
---

```csharp
using System;
using Autodesk.AutoCAD.ApplicationServices;
using Autodesk.AutoCAD.DatabaseServices;
using Autodesk.AutoCAD.Geometry;
using Autodesk.AutoCAD.Runtime;

namespace Lsieun.Cad.DrawObjects.Transformation
{
    public class Rotate01LineUtility
    {
        [CommandMethod("Rotate01Line")]
        public void RotateLine()
        {
            Document doc = Application.DocumentManager.MdiActiveDocument;
            Database db = doc.Database;

            using (Transaction trans = db.TransactionManager.StartTransaction())
            {
                // 第 1 步，添加线
                Point3d pt1 = new Point3d(100, 100, 0);
                Point3d pt2 = new Point3d(200, 200, 0);
                Line line = new Line();
                line.StartPoint = pt1;
                line.EndPoint = pt2;


                // A.
                Matrix3d mt = Matrix3d.Rotation(Math.PI / 2, Vector3d.ZAxis, pt1);

                // B.
                // 注意：这里不能调用 UpgradeOpen，因为还没有添加的数据库
                // line.UpgradeOpen();
                line.TransformBy(mt);
                // line.DowngradeOpen();


                // 第 2 步，添加到数据库
                BlockTable table = (BlockTable)trans.GetObject(
                    db.BlockTableId,
                    OpenMode.ForRead
                );
                BlockTableRecord block = (BlockTableRecord)trans.GetObject(
                    table[BlockTableRecord.ModelSpace],
                    OpenMode.ForWrite
                );

                block.AppendEntity(line);
                trans.AddNewlyCreatedDBObject(line, true);

                // 第 3 步，提交事务
                trans.Commit();
            }
        }
    }

```




