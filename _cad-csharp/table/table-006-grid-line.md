---
title: "边框线"
sequence: "106"
---

## LineWeight

```csharp
using Autodesk.AutoCAD.ApplicationServices;
using Autodesk.AutoCAD.DatabaseServices;
using Autodesk.AutoCAD.Geometry;
using Autodesk.AutoCAD.Runtime;

namespace Lsieun.Cad.DrawObjects.TableUtility
{
    public class Table05GridLineUtility
    {
        [CommandMethod("Table05GridLine")]
        public void Table05GridLine()
        {
            Document doc = Application.DocumentManager.MdiActiveDocument;
            Database db = doc.Database;

            using (Transaction trans = db.TransactionManager.StartTransaction())
            {
                // 第 1 步，创建 table
                Table table = new Table();


                // 第 2 步，设置 table 属性
                table.Position = new Point3d(0, 0, 0);
                table.SetSize(11, 11);
                table.SetRowHeight(6);
                table.SetColumnWidth(30);
                table.Cells.TextHeight = 3.5;


                // 第 3 步，设置 table 的数据
                for (int i = 1; i <= 9; i++)
                {
                    for (int j = 1; j <= i; j++)
                    {
                        table.Cells[i, j].Value = $"{j} x {i} = {i * j} ";
                    }
                }


                // A. TableStyle
                string style = "ColorTable";
                ObjectId styleId;
                DBDictionary dict = (DBDictionary)db.TableStyleDictionaryId.GetObject(OpenMode.ForRead);
                if (dict.Contains(style))
                {
                    styleId = dict.GetAt(style);
                    doc.Editor.WriteMessage("TableStyle [" + style + "] already exists!\n");
                }
                else
                {
                    TableStyle ts = new TableStyle();
                    ts.SetGridLineWeight(
                        LineWeight.LineWeight030,
                        (int)GridLineType.OuterGridLines,
                        (int)RowType.DataRow | (int)RowType.HeaderRow | (int)RowType.TitleRow
                    );

                    dict.UpgradeOpen();
                    styleId = dict.SetAt(style, ts);
                    trans.AddNewlyCreatedDBObject(ts, true);
                    doc.Editor.WriteMessage("TableStyle [" + style + "] created!\n");
                }

                // B. set table style
                table.TableStyle = styleId;


                // 第 4 步，将 table 添加到数据库
                BlockTable blockTable = (BlockTable)trans.GetObject(db.BlockTableId, OpenMode.ForRead);
                BlockTableRecord block = (BlockTableRecord)trans.GetObject(
                    blockTable[BlockTableRecord.ModelSpace],
                    OpenMode.ForWrite
                );

                block.AppendEntity(table); // 将图形对象的信息添加到块表记录中
                trans.AddNewlyCreatedDBObject(table, true); // 把对象添加到事务处理中


                // 第 5 步，提交事务
                trans.Commit();


                // 第 6 步，信息反馈
                doc.Editor.WriteMessage("Table added successfully\n");
            }

            // C. 显示线宽
            db.LineWeightDisplay = true;
            doc.SendStringToExecute("Zoom E ", true, false, false);
        }
    }
}
```

![](/assets/images/cad/csharp/table/table-example-007.png)

![](/assets/images/cad/csharp/table/table-example-008.png)

```text
// 设置表格所有行的外边框的线宽为 0.30 mm
ts.SetGridLineWeight(
    LineWeight.LineWeight030,
    (int)GridLineType.OuterGridLines,
    (int)RowType.DataRow | (int)RowType.HeaderRow | (int)RowType.TitleRow
);

// 不加粗表格表头行的底部边框
ts.SetGridLineWeight(
    LineWeight.LineWeight000,
    (int)GridLineType.HorizontalBottom,
    (int)RowType.HeaderRow
);

// 不加粗表格数据行的顶部边框
ts.SetGridLineWeight(
    LineWeight.LineWeight000,
    (int)GridLineType.HorizontalTop,
    (int)RowType.DataRow
);
```

![](/assets/images/cad/csharp/table/table-example-009.png)
