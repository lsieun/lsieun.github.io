---
title: "Set Current LineType"
sequence: "104"
---

```csharp
using Autodesk.AutoCAD.ApplicationServices;
using Autodesk.AutoCAD.DatabaseServices;
using Autodesk.AutoCAD.Runtime;

namespace Lsieun.Cad.Styles.Lines
{
    public class CSetCurrentLineTypeUtility
    {
        [CommandMethod("SetCurrentLineType")]
        public void SetCurrentLineType()
        {
            Document doc = Application.DocumentManager.MdiActiveDocument;
            Database db = doc.Database;

            string ltName = "CENTER";
            using (Transaction trans = db.TransactionManager.StartTransaction())
            {
                LinetypeTable table = (LinetypeTable)trans.GetObject(
                    db.LinetypeTableId,
                    OpenMode.ForRead
                );

                if (table.Has(ltName))
                {
                    db.Celtype = table[ltName];
                    trans.Commit();
                    
                    doc.Editor.WriteMessage("LineType [" + ltName + "] is now the current LineType");
                }
            }
        }
    }
}
```
