---
title: "简单块"
sequence: "103"
---

```csharp
using Autodesk.AutoCAD.DatabaseServices;
using Autodesk.AutoCAD.Geometry;
using Autodesk.AutoCAD.Runtime;

namespace Lsieun.Cad.Organization.Blocks
{
    public class AAddBlockUtility
    {
        [CommandMethod("AddBlockDef")]
        public void AddBlockDef()
        {
            Database db = HostApplicationServices.WorkingDatabase;

            Line line = new Line(Point3d.Origin, new Point3d(10, 15, 0));
            Circle circle = new Circle(Point3d.Origin, Vector3d.ZAxis, 10);

            BlockTableRecord btr = new BlockTableRecord();
            btr.Name = "bimcad";
            btr.AppendEntity(line);
            btr.AppendEntity(circle);

            AddBlockTableRecord(db, btr);
        }

        public ObjectId AddBlockTableRecord(Database db, BlockTableRecord btr)
        {
            using (Transaction trans = db.TransactionManager.StartTransaction())
            {
                BlockTable bt = (BlockTable)trans.GetObject(db.BlockTableId, OpenMode.ForWrite);
                ObjectId id = bt.Add(btr);
                trans.AddNewlyCreatedDBObject(btr, true);
                trans.Commit();
                return id;
            }
        }
    }
}
```
