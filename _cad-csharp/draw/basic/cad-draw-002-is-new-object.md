---
title: "DBObject.IsNewObject"
sequence: "102"
---

## DBObject.IsNewObject

判断实体是否被添加到数据库中，可以通过 `DBObject` 类的 `IsNewObject` 属性实现。

```csharp
namespace Autodesk.AutoCAD.DatabaseServices
{
    public abstract class DBObject : Drawable
    {
        public bool IsNewObject {get;}
    }
}
```

## 示例

```csharp
using Autodesk.AutoCAD.ApplicationServices;
using Autodesk.AutoCAD.DatabaseServices;
using Autodesk.AutoCAD.Geometry;
using Autodesk.AutoCAD.Runtime;

namespace Lsieun.Cad.DrawObjects.Lines
{
    public class IsNewObjectUtility
    {
        [CommandMethod("IsNewObject")]
        public void IsNewObject()
        {
            Document doc = Application.DocumentManager.MdiActiveDocument;
            Database db = doc.Database;

            using (Transaction trans = db.TransactionManager.StartTransaction())
            {
                Circle cir = new Circle();
                cir.Center = Point3d.Origin;
                cir.Radius = 10;

                doc.Editor.WriteMessage($"\n[1] circle is new object: {cir.IsNewObject}\n");

                BlockTable table = (BlockTable)trans.GetObject(
                    db.BlockTableId,
                    OpenMode.ForRead
                );
                BlockTableRecord block = (BlockTableRecord)trans.GetObject(
                    table[BlockTableRecord.ModelSpace],
                    OpenMode.ForWrite
                );

                doc.Editor.WriteMessage($"\n[2] circle is new object: {cir.IsNewObject}\n");

                block.AppendEntity(cir);

                doc.Editor.WriteMessage($"\n[3] circle is new object: {cir.IsNewObject}\n");

                trans.AddNewlyCreatedDBObject(cir, true);

                doc.Editor.WriteMessage($"\n[4] circle is new object: {cir.IsNewObject}\n");

                trans.Commit();
            }
        }
    }
}
```

```text
[1] circle is new object: True
[2] circle is new object: True
[3] circle is new object: True
[4] circle is new object: False
```
