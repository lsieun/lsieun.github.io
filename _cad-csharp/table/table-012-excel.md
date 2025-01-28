---
title: "从Excel中读取数据"
sequence: "112"
---

## 示例

### 添加引用

第 1 步，在 **Reference** 上右键选择 **Manage NuGet Packages...**：

![](/assets/images/cad/csharp/quick/dev-042-vs-manage-nuget-packages.png)

第 2 步，搜索 **EPPlus** 进行安装：

![](/assets/images/cad/csharp/quick/dev-043-vs-search-epplus.png)

### 编写代码

```csharp
using System.IO;
using Autodesk.AutoCAD.ApplicationServices;
using Autodesk.AutoCAD.DatabaseServices;
using Autodesk.AutoCAD.Geometry;
using Autodesk.AutoCAD.Runtime;
using DotNetARX;
using OfficeOpenXml;

namespace Lsieun.Cad.Basic.Tbl
{
    public class ExcelTable
    {
        [CommandMethod("CmdExcel")]
        public void CmdExcel()
        {
            FileInfo file = new FileInfo(@"D:\abc.xlsx");

            ExcelPackage.LicenseContext = LicenseContext.NonCommercial;


            using (ExcelPackage excelPackage = new ExcelPackage(file))
            {
                ExcelWorksheet sheet = excelPackage.Workbook.Worksheets["Sheet1"];

                int rowNum = sheet.Dimension.Rows;
                int colNum = sheet.Dimension.Columns;

                Database db = HostApplicationServices.WorkingDatabase;
                using (Transaction trans = db.TransactionManager.StartTransaction())
                {
                    Table table = new Table();
                    table.Position = new Point3d(0, 0, 0);
                    table.SetSize(rowNum, colNum);
                    table.Columns[0].Width = 20;
                    table.Columns[1].Width = 80;
                    table.Columns[2].Width = 100;
                    table.SetRowHeight(4);
                    table.Cells.TextHeight = 3.5;

                    for (int i = 0; i < rowNum; i++)
                    {
                        for (int j = 0; j < colNum; j++)
                        {
                            object cellValue = sheet.Cells[i + 1, j + 1].Value;
                            string cellStr = cellValue != null ? cellValue.ToString() : "";
                            table.Cells[i, j].Value = cellStr;
                        }
                    }

                    db.AddToModelSpace(table);

                    trans.Commit();
                }
            }


            Document doc = Application.DocumentManager.MdiActiveDocument;
            doc.SendStringToExecute("Zoom E ", true, false, false);
        }
    }
}
```

## Reference

- [EPPlus](https://epplussoftware.com/) is an improved version of the world´s most popular* spreadsheet library for .NET Framework/Core.
  - [Developers](https://epplussoftware.com/en/Developers)


