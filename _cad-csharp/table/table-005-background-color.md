---
title: "背景颜色"
sequence: "105"
---

## 行的背景色

### 示例代码

```csharp
using Autodesk.AutoCAD.ApplicationServices;
using Autodesk.AutoCAD.Colors;
using Autodesk.AutoCAD.DatabaseServices;
using Autodesk.AutoCAD.Geometry;
using Autodesk.AutoCAD.Runtime;

namespace Lsieun.Cad.DrawObjects.TableUtility
{
    public class Table03BackgroundColorUtility
    {
        [CommandMethod("Table03BackgroundColor")]
        public void Table03BackgroundColor()
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
                    ts.SetBackgroundColor(
                        Color.FromColorIndex(ColorMethod.ByAci, 8),
                        (int)RowType.TitleRow
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


            doc.SendStringToExecute("Zoom E ", true, false, false);
        }
    }
}
```

![](/assets/images/cad/csharp/table/table-example-003.png)

### RowType

```text
TableStyle ts = new TableStyle();
ts.SetBackgroundColor(
    Color.FromColorIndex(ColorMethod.ByAci, 8),
    (int)RowType.TitleRow
);
```

```csharp
public enum RowType {
    DataRow = 1,      // Indicates a row that is neither title row nor header row.
    HeaderRow = 4,    // Indicates the row immediately following the title row.
    TitleRow = 2,     // Indicates the top-most or bottom-most row in a table, depending on the whether the table flow direction is down or up.
    UnknownRow = 0    // Indicates the uninitialized row type.
}
```

- `RowType.TitleRow`

![](/assets/images/cad/csharp/table/table-example-003.png)

- `RowType.HeaderRow`

![](/assets/images/cad/csharp/table/table-example-004.png)

- `RowType.DataRow`

![](/assets/images/cad/csharp/table/table-example-005.png)

## 单元格背景色

```csharp
using Autodesk.AutoCAD.ApplicationServices;
using Autodesk.AutoCAD.Colors;
using Autodesk.AutoCAD.DatabaseServices;
using Autodesk.AutoCAD.Geometry;
using Autodesk.AutoCAD.Runtime;

namespace Lsieun.Cad.DrawObjects.TableUtility
{
    public class Table04CellBackgroundColorUtility
    {
        [CommandMethod("Table04CellBackgroundColor")]
        public void Table04CellBackgroundColor()
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

                // A. 单元格的颜色
                table.Cells[1, 1].BackgroundColor = Color.FromColorIndex(
                    ColorMethod.ByAci, 1
                );


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


            doc.SendStringToExecute("Zoom E ", true, false, false);
        }

        [CommandMethod("Table04ColorIndex")]
        public void Table01MultiplicationTable()
        {
            Document doc = Application.DocumentManager.MdiActiveDocument;
            Database db = doc.Database;

            using (Transaction trans = db.TransactionManager.StartTransaction())
            {
                // 第 1 步，创建 table
                Table table = new Table();


                // 第 2 步，设置 table 属性
                table.Position = new Point3d(20, -20, 0);
                table.SetSize(33, 16);
                table.SetRowHeight(6);
                table.SetColumnWidth(30);
                table.Cells.TextHeight = 3.5;


                // 第 3 步，设置 table 的数据
                for (int i = 0; i < 32; i++)
                {
                    for (int j = 0; j < 8; j++)
                    {
                        int row = i + 1;
                        int col = 2 * j;
                        int index = i + j * 32;
                        
                        // A. 设置颜色
                        table.Cells[row, col].Value = $"{index}";
                        table.Cells[row, col + 1].BackgroundColor = Color.FromColorIndex(
                            ColorMethod.ByAci, (short)index
                        );
                    }
                }


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


            doc.SendStringToExecute("Zoom E ", true, false, false);
        }
    }
}
```

![](/assets/images/cad/csharp/table/table-example-006.png)

![](/assets/images/cad/csharp/table/table-example-color-index.png)
