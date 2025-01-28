---
title: "List all LineTypes"
sequence: "102"
---

```csharp
using Autodesk.AutoCAD.ApplicationServices;
using Autodesk.AutoCAD.DatabaseServices;
using Autodesk.AutoCAD.Runtime;

namespace Lsieun.Cad.Styles.Lines
{
    public class AListLineTypesUtility
    {
        [CommandMethod("ListLineTypes")]
        public void ListLineTypes()
        {
            Document doc = Application.DocumentManager.MdiActiveDocument;
            Database db = doc.Database;

            using (Transaction trans = db.TransactionManager.StartTransaction())
            {
                LinetypeTable table = (LinetypeTable)trans.GetObject(
                    db.LinetypeTableId,
                    OpenMode.ForRead
                );

                foreach (ObjectId objId in table)
                {
                    LinetypeTableRecord type = (LinetypeTableRecord)trans.GetObject(
                        objId,
                        OpenMode.ForRead
                    );

                    string msg = $"\nLinetype name: [{type.Name}]\n";
                    doc.Editor.WriteMessage(msg);
                }

                trans.Commit();
            }
        }
    }
}
```
