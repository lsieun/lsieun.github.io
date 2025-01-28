---
title: "Send Command"
sequence: "101"
---

```text
doc.SendStringToExecute("Zoom E ", true, false, false);
```

## 示例

### 示例一

```csharp
using Autodesk.AutoCAD.ApplicationServices;
using Autodesk.AutoCAD.Runtime;

namespace Lsieun.Cad.Doc.Cmd
{
    public class Cmd01Utility
    {
        [CommandMethod("SendACommandToAutoCAD")]
        public void SendACommandToAutoCAD()
        {
            Document doc = Application.DocumentManager.MdiActiveDocument;
            
            // Draw a circle and zooms to the extents or
            // limits of the drawing
            doc.SendStringToExecute("._circle 2,2,0 4 ", true, false, false);
            doc.SendStringToExecute("._zoom _all ", true, false, false);
        }
    }
}
```

### 示例二

```csharp
using Autodesk.AutoCAD.ApplicationServices;
using Autodesk.AutoCAD.EditorInput;
using Autodesk.AutoCAD.Runtime;

namespace Lsieun.Cad.Doc.Cmd
{
    public class Cmd02Utility
    {
        [CommandMethod("SendCustomCommandToAutoCAD")]
        public void SendACustomCommandToAutoCAD()
        {
            Document doc = Application.DocumentManager.MdiActiveDocument;

            // prompt user to enter command
            PromptKeywordOptions prompt = new PromptKeywordOptions("\nEnter Command to Execute: ");

            // Define the valid keywords and allow Enter
            prompt.Keywords.Add("Circle");
            prompt.Keywords.Add("Zoom all");
            prompt.Keywords.Add("MessageBox");
            prompt.Keywords.Add("GetStringFromUser");
            prompt.AllowNone = true;

            PromptResult result = doc.Editor.GetKeywords(prompt);
            if (result.Status == PromptStatus.OK)
            {
                switch (result.StringResult)
                {
                    case "Circle":
                        // Draw a circle
                        doc.SendStringToExecute("._circle 2,2,0 4 ", true, false, false);
                        break;
                    case "Zoom":
                        // zooms to the extents or limits of the drawing
                        doc.SendStringToExecute("._zoom _all ", true, false, false);
                        break;
                    case "MessageBox":
                        Application.ShowAlertDialog("Hello Dialog");
                        break;
                    case "GetStringFromUser":
                        GetStringFromUser();
                        break;
                    default:
                        doc.SendStringToExecute(result.ToString(), true, false, false);
                        break;
                }
            }
            else
            {
                doc.Editor.WriteMessage("\nMessage goes missing!\n");
            }
        }

        private void GetStringFromUser()
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
