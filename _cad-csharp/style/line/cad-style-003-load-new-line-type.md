---
title: "Load new LineType"
sequence: "103"
---

```csharp
using Autodesk.AutoCAD.ApplicationServices;
using Autodesk.AutoCAD.DatabaseServices;
using Autodesk.AutoCAD.Runtime;

namespace Lsieun.Cad.Styles.Lines
{
    public class BLoadLineTypeUtility
    {
        [CommandMethod("LoadLineType")]
        public void LoadLineType()
        {
            Document doc = Application.DocumentManager.MdiActiveDocument;
            Database db = doc.Database;

            using (Transaction trans = db.TransactionManager.StartTransaction())
            {
                try
                {
                    LinetypeTable table = (LinetypeTable)trans.GetObject(
                        db.LinetypeTableId,
                        OpenMode.ForRead
                    );

                    string ltName = "CENTER";
                    if (table.Has(ltName))
                    {
                        trans.Abort();
                        
                        doc.Editor.WriteMessage("Linetype already exist");
                    }
                    else
                    {
                        // Load the CENTER Linetype
                        db.LoadLineTypeFile(ltName, "acad.lin");
                        
                        // Commit the transaction
                        trans.Commit();
                        
                        doc.Editor.WriteMessage("Linetype [" + ltName + "] loaded successfully");
                    }
                }
                catch (Exception ex)
                {
                    trans.Abort();

                    doc.Editor.WriteMessage("Error encountered: " + ex.Message);
                }
            }
        }
    }
}
```


