---
title: "多行文本"
sequence: "103"
---

```csharp
using System;
using Autodesk.AutoCAD.ApplicationServices;
using Autodesk.AutoCAD.Colors;
using Autodesk.AutoCAD.DatabaseServices;
using Autodesk.AutoCAD.Runtime;
using DotNetARX;

namespace Lsieun.Cad.Basic.Text
{
    public class MultipleLineText
    {
        [CommandMethod("CmdMText")]
        public void CmdMText()
        {
            Database db = HostApplicationServices.WorkingDatabase;
            using (Transaction trans = db.TransactionManager.StartTransaction())
            {
                MText text = new MText();
                text.Contents = "Hello AutoCAD from C#\n" + 
                                "    欢迎使用C#对AutoCAD进行二次开发";
                text.Height = 500;
                text.Rotation = 30 * Math.PI / 180;
                text.Color = Color.FromRgb(0, 255, 0);

                db.AddToModelSpace(text);

                trans.Commit();
            }

            Document doc = Application.DocumentManager.MdiActiveDocument;
            doc.SendStringToExecute("Zoom E ", true, false, false);
        }
    }
}
```

```csharp
using Autodesk.AutoCAD.ApplicationServices;
using Autodesk.AutoCAD.DatabaseServices;
using Autodesk.AutoCAD.Geometry;
using Autodesk.AutoCAD.Runtime;
using DotNetARX;

namespace Lsieun.Cad.Basic.Text
{
    public class Texts
    {
        [CommandMethod("AddText")]
        public void AddText()
        {
            Database db = HostApplicationServices.WorkingDatabase;
            using (Transaction trans = db.TransactionManager.StartTransaction())
            {
                // 第 1 段文字
                DBText textFirst = new DBText();
                textFirst.Position = new Point3d(50, 50, 0);
                textFirst.Height = 5;
                textFirst.TextString = "面积" + TextSpecialSymbol.AlmostEqual + TextSpecialSymbol.Underline
                                       + "2000" + TextSpecialSymbol.Underline + "m" + TextSpecialSymbol.Square;
                textFirst.HorizontalMode = TextHorizontalMode.TextCenter;
                textFirst.VerticalMode = TextVerticalMode.TextVerticalMid;
                textFirst.AlignmentPoint = textFirst.Position;


                // 第 2 段文字
                DBText textSecond = new DBText();
                textSecond.Height = 5;
                textSecond.TextString = TextSpecialSymbol.Angle + TextSpecialSymbol.Belta +
                                        "=45" + TextSpecialSymbol.Degree;
                textSecond.HorizontalMode = TextHorizontalMode.TextCenter;
                textSecond.VerticalMode = TextVerticalMode.TextVerticalMid;
                textSecond.AlignmentPoint = new Point3d(50, 40, 0);


                // 第 3 段文字
                DBText textLast = new DBText();
                textLast.Height = 5;

                textLast.TextString = TextSpecialSymbol.Diameter + "30 的直径偏差为" +
                                      TextSpecialSymbol.Tolerance + "0.01";
                textLast.HorizontalMode = TextHorizontalMode.TextCenter;
                textLast.VerticalMode = TextVerticalMode.TextVerticalMid;
                textLast.AlignmentPoint = new Point3d(50, 30, 0);

                db.AddToModelSpace(textFirst, textSecond, textLast);
                trans.Commit();
            }

            Document doc = Application.DocumentManager.MdiActiveDocument;
            doc.SendStringToExecute("Zoom E ", true, false, false);
        }

        [CommandMethod("AddStackText")]
        public void AddStackText()
        {
            Database db = HostApplicationServices.WorkingDatabase;
            using (Transaction trans = db.TransactionManager.StartTransaction())
            {
                // 创建水平分数形式的堆叠文字
                string firstLine = TextTools.StackText(
                    TextSpecialSymbol.Diameter + "20",
                    "H7", "P7", StackType.HorizontalFraction, 0.5
                );
                
                // 创建斜分数形式的堆叠文字
                string secondLine = TextTools.StackText(
                    TextSpecialSymbol.Diameter + "20",
                    "H7","P7", StackType.ItalicFraction, 0.5
                );
                
                // 创建公差形式的堆叠文字
                string lastLine = TextTools.StackText(
                    TextSpecialSymbol.Diameter + "20",
                    "H7","P7", StackType.Tolerance, 0.5
                );
                
                MText mtext = new MText();
                mtext.Location = new Point3d(100, 20, 0);
                mtext.Contents = firstLine + MText.ParagraphBreak + secondLine + "\n" + lastLine;
                mtext.TextHeight = 5;
                mtext.Width = 0;
                mtext.Attachment = AttachmentPoint.MiddleCenter;
                
                // 添加文本到模型空间中
                db.AddToModelSpace(mtext);
                trans.Commit();
            }
            
            Document doc = Application.DocumentManager.MdiActiveDocument;
            doc.SendStringToExecute("Zoom E ", true, false, false);
        }
    }
}
```
