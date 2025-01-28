---
title: "Window"
sequence: "101"
---

## Main Window

```csharp
using System.Windows;
using Autodesk.AutoCAD.ApplicationServices;
using Autodesk.AutoCAD.EditorInput;
using Autodesk.AutoCAD.Runtime;

namespace Lsieun.Cad.Win
{
    public class MyMainWindowUtility
    {
        [CommandMethod("SetWindowSize")]
        public void SetWindowSize()
        {
            Document doc = Application.DocumentManager.MdiActiveDocument;
            Editor ed = doc.Editor;

            // position of the window
            Point pt = new Point(100, 100);
            Application.MainWindow.DeviceIndependentLocation = pt;

            // size of window
            Size windowSize = new Size(700, 700);
            Application.MainWindow.DeviceIndependentSize = windowSize;

            ed.WriteMessage("Your window is set!!!");
        }
    }
}
```

## Doc Window

```csharp
using System.Threading;
using System.Windows;
using Autodesk.AutoCAD.ApplicationServices;
using Autodesk.AutoCAD.EditorInput;
using Autodesk.AutoCAD.Runtime;
using Autodesk.AutoCAD.Windows;

namespace Lsieun.Cad.Win
{
    public class MyDocWindowUtility
    {
        [CommandMethod("SetDocWindowSize")]
        public void SetDocWindowSize()
        {
            Document doc = Application.DocumentManager.MdiActiveDocument;
            Editor ed = doc.Editor;
            
            // Works around what looks to be a refesh problem with the Application window
            doc.Window.WindowState = Window.State.Normal;
            
            // position of the window
            Point pt = new Point(0, 0);
            doc.Window.DeviceIndependentLocation = pt;
            
            // size of window
            Size windowSize = new Size(400, 400);
            doc.Window.DeviceIndependentSize = windowSize;
            
            ed.WriteMessage("Your doc window is set!!!");
        }

        
        [CommandMethod("MinMaxDocWindow")]
        public void MinMaxDocumentWindow()
        {
            Document doc = Application.DocumentManager.MdiActiveDocument;
            Editor ed = doc.Editor;
            
            // Minimize the Document window
            doc.Window.WindowState = Window.State.Minimized;
            ed.WriteMessage("Window Minimized");
            Thread.Sleep(2000);

            doc.Window.WindowState = Window.State.Maximized;
            ed.WriteMessage("Window Maximized");
        }

        
        [CommandMethod("CurrentDocWindowState")]
        public void CurrentDocWindowState()
        {
            Document doc = Application.DocumentManager.MdiActiveDocument;
            Editor ed = doc.Editor;
            
            ed.WriteMessage("The document window is " + doc.Window.WindowState);
        }
    }
}
```
