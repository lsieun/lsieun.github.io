---
title: "对话框"
sequence: "105"
---

## AlertDialog

```csharp
using Autodesk.AutoCAD.ApplicationServices;
using Autodesk.AutoCAD.Runtime;

namespace Lsieun.Cad.UserInteraction.Dialog
{
    public class ShowDialogUtility
    {
        [CommandMethod("ShowAlertDialog")]
        public void ShowAlertDialog()
        {
            Application.ShowAlertDialog("Hello Alert Dialog!");
        }
    }
}
```
