---
title: "字符串-GetString"
sequence: "102"
---

## 示例

### 输入名字



```csharp
using Autodesk.AutoCAD.ApplicationServices;
using Autodesk.AutoCAD.EditorInput;
using Autodesk.AutoCAD.Runtime;

namespace Lsieun.Cad.UserInteraction.Str
{
    public class MyStrUtility
    {
        [CommandMethod("GetName")]
        public void GetNameUsingGetString()
        {
            // Get the document object
            Document doc = Application.DocumentManager.MdiActiveDocument;
            Editor ed = doc.Editor;

            // Prompt the user using PromptStringOptions
            PromptStringOptions prompt = new PromptStringOptions("Enter your name: ");
            prompt.AllowSpaces = true;

            // Get the results of the user input using a PromptResult
            PromptResult result = ed.GetString(prompt);
            if (result.Status == PromptStatus.OK)
            {
                string name = result.StringResult;
                ed.WriteMessage("Hello there: " + name);
                Application.ShowAlertDialog("Your name is: " + name);
            }
            else
            {
                ed.WriteMessage("No name entered.");
                Application.ShowAlertDialog("No name entered.");
            }
        }
    }
}
```

### DefaultValue

```text
using Autodesk.AutoCAD.ApplicationServices;
using Autodesk.AutoCAD.EditorInput;
using Autodesk.AutoCAD.Runtime;

namespace Lsieun.Cad.UserInteraction.Str
{
    public class GetStringFromUserUtility
    {
        [CommandMethod("GetStringFromUser")]
        public void GetStringFromUser()
        {
            Document doc = Application.DocumentManager.MdiActiveDocument;

            PromptStringOptions prompt = new PromptStringOptions("\nEnter your name: ");
            prompt.DefaultValue = "Lsieun";
            prompt.AllowSpaces = true;

            PromptResult result = doc.Editor.GetString(prompt);
            string value = result.StringResult;

            string msg = $"\nThe name entered is {value}\n";
            doc.Editor.WriteMessage(msg);
        }
    }
}
```

### 设置当前图层

```csharp
using Autodesk.AutoCAD.ApplicationServices;
using Autodesk.AutoCAD.DatabaseServices;
using Autodesk.AutoCAD.EditorInput;
using Autodesk.AutoCAD.Runtime;

namespace Lsieun.Cad.UserInteraction.Str
{
    public class SetLayerUtility
    {
        [CommandMethod("SetLayerUsingGetString")]
        public void SetLayerUsingGetString()
        {
            // Get the document object
            Document doc = Application.DocumentManager.MdiActiveDocument;
            Database db = doc.Database;
            Editor ed = doc.Editor;

            using (Transaction trans = doc.TransactionManager.StartTransaction())
            {
                LayerTable table = (LayerTable)trans.GetObject(db.LayerTableId, OpenMode.ForRead);

                PromptStringOptions prompt = new PromptStringOptions("Enter layer to make current: ");
                prompt.AllowSpaces = false;

                // Get the results of the user input using a PromptResult
                PromptResult result = ed.GetString(prompt);
                if (result.Status == PromptStatus.OK)
                {
                    string layerName = result.StringResult;

                    // Check if the enter layer name exist in the layer database
                    if (table.Has(layerName))
                    {
                        // Set the layer current
                        db.Clayer = table[layerName];

                        // Commit the transaction
                        trans.Commit();
                    }
                    else
                    {
                        string msg = $"The layer {layerName} you entered does not exist.";
                        Application.ShowAlertDialog(msg);
                    }
                }
                else
                {
                    Application.ShowAlertDialog("No layer entered.");
                }
            }
        }
    }
}
```


