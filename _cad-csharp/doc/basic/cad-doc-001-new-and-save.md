---
title: "New And Save"
sequence: "101"
---

```csharp
using System;
using System.Windows.Forms;
using Autodesk.AutoCAD.ApplicationServices;
using Autodesk.AutoCAD.DatabaseServices;
using Autodesk.AutoCAD.Runtime;
using Application = Autodesk.AutoCAD.ApplicationServices.Application;

namespace Lsieun.Cad.Doc
{
    public class MyDocUtility
    {
        [CommandMethod("NewDrawing", CommandFlags.Session)]
        public void NewDrawing()
        {
            // Specify the template to use, if the template is not found
            // the default settings are used.
            string strTemplatePath = "acad.dwt";

            DocumentCollection docManager = Application.DocumentManager;
            Document doc = docManager.Add(strTemplatePath);

            docManager.MdiActiveDocument = doc;
        }

        [CommandMethod("SaveActiveDrawing")]
        public void SaveActiveDrawing()
        {
            Document doc = Application.DocumentManager.MdiActiveDocument;
            string docName = doc.Name;

            // if this value is 0 then then file has not been renamed
            object obj = Application.GetSystemVariable("DWGTITLED");

            // Check to see if the drawing has been named
            if (Convert.ToInt16(obj) == 0)
            {
                // If the drawing is using a default name (Drawing1, Drawing2, etc)
                // then provide a new name
                docName = "D:\\MyDrawing.dwg";
            }

            // Save the active drawing
            doc.Database.SaveAs(
                docName, 
                true,
                DwgVersion.Current,
                doc.Database.SecurityParameters
                );
        }

        [CommandMethod("DrawingSaved")]
        public void DrawingSaved()
        {
            object obj = Application.GetSystemVariable("DBMOD");

            // Check the value of DBMOD, if 0 then the drawing has no unsaved changes
            if (Convert.ToInt16(obj) != 0)
            {
                DialogResult result = MessageBox.Show(
                    "Do you wish to save this drawing?",
                    "Save Drawing",
                    MessageBoxButtons.YesNo,
                    MessageBoxIcon.Question);
                if (result == DialogResult.Yes)
                {
                    Document doc = Application.DocumentManager.MdiActiveDocument;
                    doc.Database.SaveAs(
                        doc.Name, 
                        true,
                        DwgVersion.Current,
                        doc.Database.SecurityParameters
                    );
                }
            }
        }
    }
}
```
