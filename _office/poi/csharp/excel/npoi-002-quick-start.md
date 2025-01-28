---
title: "NPOI QuickStart"
sequence: "102"
---

## 添加引用

在 NuGet 下搜索 NPOI，找到合适的版本进行安装

![](/assets/images/office/poi/npoi/nuget-npoi-package.png)

## 示例

### 示例一：创建一个 Excel 文件

```csharp
using System.IO;
using NPOI.XSSF.UserModel;

namespace Lsieun.Office.Excel
{
    internal class Program
    {
        public static void Main(string[] args)
        {
            XSSFWorkbook workbook = new XSSFWorkbook();
            workbook.Write(new FileStream(@"test.xlsx", FileMode.Create));
        }
    }
}
```

在相应的目录下就能看到 `test.xlsx` 文件了，但此时若用 Excel 打开，会报错“文件可能损坏”；
原因是你的文件中只有一个工作簿，没有为工作簿创建工作表。
若你用“桌面右键>新建 MicroSoft Excel 工作表”的方式建一个.xlsx 的方式，则可以正常打开。
两者区别在于桌面右键创建，会往里面加表。
解决方法很简单，你只需要在创建工作簿之后，为工作簿创建一个工作表：

```text
XSSFSheet newSheet = (XSSFSheet)workbook.CreateSheet("mySheet");
```

```csharp
using System.IO;
using NPOI.XSSF.UserModel;

namespace Lsieun.Office.Excel
{
    internal class Program
    {
        public static void Main(string[] args)
        {
            XSSFWorkbook workbook = new XSSFWorkbook();
            XSSFSheet newSheet = (XSSFSheet)workbook.CreateSheet("mySheet");
            workbook.Write(new FileStream(@"test.xlsx", FileMode.Create));
        }
    }
}
```

### 示例二：往单元格写值

```csharp
using System.IO;
using NPOI.XSSF.UserModel;

namespace Lsieun.Office.Excel
{
    internal class Program
    {
        public static void Main(string[] args)
        {
            XSSFWorkbook workbook = new XSSFWorkbook();
            XSSFSheet newSheet = (XSSFSheet)workbook.CreateSheet("mySheet");
            newSheet.GetRow(0).GetCell(0).SetCellValue("你好 Excel");    // A 第 12 行
            workbook.Write(new FileStream(@"D:/abc.xlsx", FileMode.OpenOrCreate, FileAccess.ReadWrite));
        }
    }
}
```

程序运行起来同样会报错：

```text
未经处理的异常:  System.NullReferenceException: 未将对象引用设置到对象的实例。
   在 Lsieun.Office.Excel.Program.Main(String[] args) 位置 D:\...\Program.cs:行号 12
```

原因：还没有创建单元格，就往单元格中写东西了。

把上面修改单元格值的语句换成下面即可：

```text
newSheet.CreateRow(0).CreateCell(0).SetCellValue("你好 Excel");
```

```csharp
using System.IO;
using NPOI.XSSF.UserModel;

namespace Lsieun.Office.Excel
{
    internal class Program
    {
        public static void Main(string[] args)
        {
            XSSFWorkbook workbook = new XSSFWorkbook();
            XSSFSheet newSheet = (XSSFSheet)workbook.CreateSheet("mySheet");
            newSheet.CreateRow(0).CreateCell(0).SetCellValue("你好 Excel");
            workbook.Write(new FileStream(@"D:/abc.xlsx", FileMode.OpenOrCreate, FileAccess.ReadWrite));
        }
    }
}
```

通常来讲，你需要先创建工作簿，再创建工作表，再为工作表创建行，然后再为指定行创建单元格，再去修改单元格的值。

犯上面两个错误，主要是平时可视化编辑 excel 文件习惯了，右键创建好 excel 文件，在 excel 文件里直接修改单元格的值，一切都是那么自然。
其实在可视化操作时，Office 工具为我们做了很多事情了。

### 示例三：文件保存

工作簿调用 Write 方法，写入文件流即可：

```text
workbook.Write(new FileStream(@"D:/abc.xlsx", FileMode.OpenOrCreate, FileAccess.ReadWrite));
```

### 示例四：读取

读取 Excel 的一般写法：

```csharp
using System;
using System.IO;
using NPOI.SS.UserModel;
using NPOI.XSSF.UserModel;

namespace Lsieun.Office.Excel
{
    internal class Program
    {
        public static void Main(string[] args)
        {
            using (FileStream fs = new FileStream(@"D:\test.xlsx", FileMode.Open, FileAccess.Read))
            {
                XSSFWorkbook workbook = new XSSFWorkbook(fs);
                ISheet sheet = workbook.GetSheetAt(0);
                for (int rowNum = 0; rowNum < 2; rowNum++)
                {
                    for (int colNum = 0; colNum < 2; colNum++)
                    {
                        ICell cell = sheet.GetRow(rowNum).GetCell(colNum);
                        string value = cell.ToString();
                        Console.WriteLine(value);
                    }
                }
            }
        }
    }
}
```

### 示例五：写入

```csharp
using System.IO;
using NPOI.SS.UserModel;
using NPOI.XSSF.UserModel;

namespace Lsieun.Office.Excel
{
    internal class Program
    {
        public static void Main(string[] args)
        {
            // Create a new workbook
            IWorkbook workbook = new XSSFWorkbook();

            // Create a new sheet in the workbook
            ISheet sheet = workbook.CreateSheet("Sheet1");

            // Create a new row in the sheet
            IRow row = sheet.CreateRow(0);

            // Create a new cell in the row
            ICell cell = row.CreateCell(0);

            // Set the value of the cell to "Hello World!".
            cell.SetCellValue("Hello, World!");
            
            using (FileStream fs = new FileStream(@"D:/myExcel.xlsx", FileMode.OpenOrCreate, FileAccess.ReadWrite))
            {
                // Save the workbook to file
                workbook.Write(fs);
            }
        }
    }
}
```

### 示例六：修改


修改已有的 Excel：

```csharp
IWorkbook workBook = null;
using(FileStream fs = new FileStream(@"D:/a3.xlsx", FileMode.Open, FileAccess.Read))
{
    workBook = new XSSFWorkbook(fs);
    ISheet sheet = workBook.GetSheetAt(0);
    sheet.GetRow(3).GetCell(3).SetCellValue(33);
    sheet.GetRow(4).GetCell(3).SetCellValue(22);
    sheet.GetRow(5).GetCell(3).SetCellValue(22);
    sheet.GetRow(6).GetCell(3).SetCellValue(33);
}
using(FileStream fs = new FileStream(@"D:/a3.xlsx", FileMode.Create, FileAccess.Write))
{
    workBook.Write(fs);
}
```

修改内容的示例中，在第二次打开文件流，`FileMode` 枚举使用的是 `Create` 而不是 `Open`。
关于这点，网上的说法是，`Open` 会在文件末尾写入内容，`Create` 则是覆盖内容（在文件已存在的情况下），
所以使用 `Open` 时，会在已存在的 xlsx 文件末尾写入 workbook 内容导致文件损坏。

### 常用操作汇总

```text
FileStream fs = new FileStream(filepath, FileMode.Open, FileAccess.ReadWrite);
// 1. 获取工作簿对象
IWorkbook workbook = new XSSFWorkbook(fs);	// 2007
// IWorkbook workbook = new HSSFWorkbook(fs); // 2003
// 2. 获取工作表对象（第一个表，序号从0开始）
ISheet sheet = workbook.GetSheetAt(0);
// 3. 获取工作表的行（第一行）
IRow row = sheet.GetRow(0);
// 4. 获取指定行的单元格
ICell cell = row.GetCell(0);
// 5. 获取单元格样式
ICellStyle cellStyle = cell.CellStyle;
// 6. 创建工作簿对象
XSSFWorkbook workBook= new XSSFWorkbook();
// 7. 创建工作表对象
XSSFSheet newSheet = (XSSFSheet)workBook.CreateSheet("new sheet");
// 8. 创建工作表的行
XSSFRow newRow = (XSSFRow)newSheet.CreateRow(0);
// 9. 创建单元格
XSSFCell newCell = (XSSFCell)newRow.CreateCell(0);
// 10. 单元格写值
newCell.SetCellValue(1);
// 11. 设置Sheet名称
workBook.SetSheetName(0, "第一张表");
// 12. 设置单元格内容
newCell.SetCellValue(11);
// 13. 得到工作簿中Sheet数量
workBook.NumberOfSheets
// 14. 保存excel文件
workBook.Write(new FileStream(@"pathName", FileMode.Create, FileAccess.ReadWrite));
```

## 使用注意项

表更新问题，报表的时候经常会有这样的用法，Excel模板已经给你做好了，你只需要往里面指定单元格写数据，然后模板根据数据变化自动改变。但是你按上述方式写入时，会发现数据变了，公式单元格并没自动改变。你需要在改变完后，加上下面这句代码。

```text
sheet.ForceFormulaRecalculation = true;
```

## Reference

- [C# NPOI初级使用](https://blog.csdn.net/BadAyase/article/details/126497115)
