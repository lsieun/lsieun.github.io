---
title: "Cell Font"
sequence: "102"
---

## Using CellStyle to Format the Font

The `Font` property of a `CellStyle` is where we set font-related formatting.
For instance, we can set the font name, color, and size.

### Bold/Italic

We can set whether the font is bold or italic.
Both properties of Font can either be true or false.

### underline

We can also set underline style to:

- `U_NONE`: Text without underline
- `U_SINGLE`: Single underline text where only the word is underlined
- `U_SINGLE_ACCOUNTING`: Single underline text where almost the entire cell width is underlined
- `U_DOUBLE`: Double underline text where only the word is underlined
- `U_DOUBLE_ACCOUNTING`: Double underline text where almost the entire cell width is underlined

## 示例

```java
import org.apache.poi.hssf.util.HSSFColor;
import org.apache.poi.ss.usermodel.*;

public class CellStyler {
    public CellStyle createWarningColor(Workbook workbook) {
        CellStyle style = workbook.createCellStyle();

        Font font = workbook.createFont();
        font.setFontName("Courier New");
        font.setBold(true);
        font.setUnderline(Font.U_SINGLE);
        font.setColor(HSSFColor.HSSFColorPredefined.DARK_RED.getIndex());
        style.setFont(font);

        style.setAlignment(HorizontalAlignment.CENTER);
        style.setVerticalAlignment(VerticalAlignment.CENTER);
        return style;
    }
}
```

```java
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

public class ExcelWrite {
    public static void main(String[] args) {
        XSSFWorkbook workbook = new XSSFWorkbook();
        XSSFSheet sheet = workbook.createSheet("第一个Sheet");

        Row row1 = sheet.createRow(0);
        row1.setHeightInPoints((short) 40);

        CellStyler styler = new CellStyler();
        CellStyle style = styler.createWarningColor(workbook);

        Cell cell1 = row1.createCell(0);
        cell1.setCellStyle(style);
        cell1.setCellValue("Hello");

        Cell cell2 = row1.createCell(1);
        cell2.setCellStyle(style);
        cell2.setCellValue("world!");


        OutputUtils.save(workbook, "excel-creation.xlsx");
    }
}
```

![](/assets/images/office/poi/cell-style-example-001.png)

## Common Pitfalls

Let's look at two common mistakes made when using `CellStyle`.

### Accidentally Modify All Cell Styles

Firstly, it's a common mistake to get `CellStyle` from a cell and start to modify it.
Apache POI documentation for the `getCellStyle` method mentions
that a cell's `getCellStyle` method will always return a non-null value.
This means that the cell has a default value,
which is also the **default style** that is initially being used by all cells in the workbook.
Therefore, the below code will make all cells have date format:

```text
cell.setCellValue(rdf.getEffectiveDate());
cell.getCellStyle().setDataFormat(HSSFDataFormat.getBuiltinFormat("d-mmm-yy"));
```

### Create New Style for Each Cell

Another common mistake is to have too many similar styles in a workbook:

```text
CellStyle style1 = codeToCreateCellStyle();
Cell cell1 = row1.createCell(0);
cell1.setCellStyle(style1);

CellStyle style2 = codeToCreateCellStyle();
Cell cell2 = row1.createCell(1);
cell2.setCellStyle(style2);
```

**A `CellStyle` is scoped to a workbook.**
Because of this, a similar style should be shared by multiple cells.
In the above example, the style should be created only once and shared between cell1 and cell2:

```text
CellStyle style1 = codeToCreateCellStyle();
Cell cell1 = row1.createCell(0);
cell1.setCellStyle(style1);
cell1.setCellValue("Hello");

Cell cell2 = row1.createCell(1);
cell2.setCellStyle(style1);
cell2.setCellValue("world!");
```

