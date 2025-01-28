---
title: "Regen"
sequence: "102"
---

```csharp
using Autodesk.AutoCAD.ApplicationServices;
using Autodesk.AutoCAD.Runtime;

namespace Lsieun.Cad.Display
{
    public class MyReGenUtility
    {
        [CommandMethod("CallRegen")]
        public void CallRegen()
        {
            // Redraw the drawing
            Application.UpdateScreen();
            Application.DocumentManager.MdiActiveDocument.Editor.UpdateScreen();
            
            // Regenerate the drawing
            Application.DocumentManager.MdiActiveDocument.Editor.Regen();
        }
    }
}
```
