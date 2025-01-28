---
title: "关键字-GetKeywords"
sequence: "105"
---

## 示例

### 示例一

```csharp
using Autodesk.AutoCAD.ApplicationServices;
using Autodesk.AutoCAD.EditorInput;
using Autodesk.AutoCAD.Runtime;

namespace Lsieun.Cad.UserInteraction.Keywords
{
    public class GetKeywordFromUserUtility
    {
        [CommandMethod("GetKeywordFromUser")]
        public void GetKeywordFromUser()
        {
            Document doc = Application.DocumentManager.MdiActiveDocument;

            PromptKeywordOptions prompt = new PromptKeywordOptions("");
            prompt.Message = "\nEnter an option ";
            prompt.Keywords.Add("Line");
            prompt.Keywords.Add("Circle");
            prompt.Keywords.Add("Arc");
            prompt.AllowNone = false;

            PromptResult result = doc.Editor.GetKeywords(prompt);
            string value = result.StringResult;

            string msg = $"\nEntered Keyword: {value}\n";
            doc.Editor.WriteMessage(msg);
        }
    }
}
```

```text
Command: NETLOAD
Command: GETKEYWORDFROMUSER
Enter an option [Line/Circle/Arc]: arc    # A. 输入 arc 不区分大小写
Entered Keyword: Arc                      # A. 输出 Arc
Command: GETKEYWORDFROMUSER
Enter an option [Line/Circle/Arc]: ar     # B. 输入 ar
Entered Keyword: Arc                      # B. 输出 Arc
Command: GETKEYWORDFROMUSER
Enter an option [Line/Circle/Arc]:        # C. 输入回车
Invalid option keyword.
Enter an option [Line/Circle/Arc]:        # C. 提示再次输入
Invalid option keyword.
Enter an option [Line/Circle/Arc]:
Invalid option keyword.
Enter an option [Line/Circle/Arc]: li     # D. 输入 li
Entered Keyword: Line                     # D. 输出 Line
Command: GETKEYWORDFROMUSER
Enter an option [Line/Circle/Arc]: 1      # E. 输入 1
Invalid option keyword.                   # E. 无效输入
Enter an option [Line/Circle/Arc]: *Cancel*    # F. 按 ESC 键
Entered Keyword:                               # F. 输出为空

```

### 示例二

```csharp
using Autodesk.AutoCAD.ApplicationServices;
using Autodesk.AutoCAD.DatabaseServices;
using Autodesk.AutoCAD.EditorInput;
using Autodesk.AutoCAD.Geometry;
using Autodesk.AutoCAD.Runtime;

namespace Lsieun.Cad.UserInteraction.Keywords
{
    public class MyKeywordsUtility
    {
        [CommandMethod("DrawObjectUsingGetKeywords")]
        public void DrawObjectUsingGetKeywords()
        {
            // Get the document object
            Document doc = Application.DocumentManager.MdiActiveDocument;
            Database db = doc.Database;

            // Create a PromptKeyWordOptions
            PromptKeywordOptions prompt = new PromptKeywordOptions("");
            prompt.Message = "\nWhat would you like to draw?";
            prompt.Keywords.Add("Line");
            prompt.Keywords.Add("Circle");
            prompt.Keywords.Add("MText");
            prompt.AllowNone = false;

            PromptResult result = doc.Editor.GetKeywords(prompt);
            string answer = result.StringResult;

            if (answer != null)
            {
                using (Transaction trans = db.TransactionManager.StartTransaction())
                {
                    BlockTable table = (BlockTable) trans.GetObject(db.BlockTableId, OpenMode.ForRead);
                    BlockTableRecord record = (BlockTableRecord) trans.GetObject(
                        table[BlockTableRecord.ModelSpace],
                        OpenMode.ForWrite
                    );

                    switch (answer)
                    {
                        case "Line":
                            // Draw the line
                            Point3d pt1 = new Point3d(0, 0, 0);
                            Point3d pt2 = new Point3d(100, 100, 0);
                            Line line = new Line(pt1, pt2);
                            record.AppendEntity(line);
                            trans.AddNewlyCreatedDBObject(line, true);
                            break;
                        case "Circle":
                            // Draw the circle
                            Point3d centerPoint = new Point3d(0, 0, 0);
                            Circle cir = new Circle();
                            cir.Center = centerPoint;
                            cir.Radius = 10;
                            cir.ColorIndex = 1;
                            record.AppendEntity(cir);
                            trans.AddNewlyCreatedDBObject(cir, true);
                            break;
                        case "MText":
                            // Draw the MText
                            Point3d location = new Point3d(0, 0, 0);
                            MText txt = new MText();
                            txt.Contents = "Hello World!";
                            txt.Location = location;
                            txt.TextHeight = 10;
                            txt.ColorIndex = 2;
                            record.AppendEntity(txt);
                            trans.AddNewlyCreatedDBObject(txt, true);
                            break;
                        default:
                            doc.Editor.WriteMessage("No option selected");
                            break;
                    }

                    // Commit the transaction
                    trans.Commit();
                }
            }
        }
    }
}
```
