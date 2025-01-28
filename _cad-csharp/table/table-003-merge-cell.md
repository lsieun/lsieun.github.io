---
title: "合并单元格"
sequence: "103"
---

```csharp
using Autodesk.AutoCAD.ApplicationServices;
using Autodesk.AutoCAD.Colors;
using Autodesk.AutoCAD.DatabaseServices;
using Autodesk.AutoCAD.Geometry;
using Autodesk.AutoCAD.Runtime;

namespace Lsieun.Cad.DrawObjects.TableUtility
{
    public class Table02MergeUtility
    {
        [CommandMethod("Table02Merge")]
        public void Table02Merge()
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

                // A. 设置表头
                table.Cells[0, 0].Value = "9 * 9 乘法表";
                table.Cells[0, 0].ContentColor = Color.FromRgb(255, 0, 0);
                table.Cells[0, 0].TextHeight = 10;
                table.Cells[0, 0].Alignment = CellAlignment.MiddleCenter;

                // B. 合并单元格
                CellRange range = CellRange.Create(table, 10, 0, 10, 10);
                table.MergeCells(range);
                table.Cells[10, 0].TextString = "A Merged Cell";
                table.Cells[10, 0].ContentColor = Color.FromRgb(0, 255, 0);
                table.Cells[10, 0].TextHeight = 3;
                table.Cells[10, 0].Alignment = CellAlignment.MiddleCenter;
                

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

![](/assets/images/cad/csharp/table/table-example-002.png)
