---
title: "Add Borders"
sequence: "103"
---

## Excel Borders

We can create borders to an excel cell or for a range of cells.
**These borderlines can be in a variety of styles.**
Some example styles include thick lines, thin lines, medium lines, dotted lines.
To add more variety, we can have colored borders.

This image shows some of these variety borders:

![](/assets/images/office/poi/excel-cell-border-example-001.webp)

- Cell `B2` is with thick line border
- `D2` cell is with a wide violet border
- `F2` cell is with a crazy border, each side of the border is with different style and color
- Range `B4:F6` is with medium-sized border
- Region `B8:F9` is with medium-sized orange border


## Coding for the Excel Borders

The Apache POI library provides multiple ways to handle borders.
One simple way is to refer to cell ranges and apply borders.

### Cell Ranges or Regions

To refer to a range of cells we can use `CellRangeAddress` class:

```text
CellRangeAddress region = new CellRangeAddress(7, 8, 1, 5);
```

`CellRangeAddress` constructor takes four parameters first row, last row, first column, and last column.
**Each row and column index starts with zero.**
In above code, it refers to cell range B8:F9.

We can also refer to one cell using `CellRangeAddress` class:

```text
CellRangeAddress region = new CellRangeAddress(1, 1, 5, 5);
```

The above code is referring to the F2 cell.

### Cell Borders

Each border has four sides: Top, Bottom, Left, and Right borders.
We have to set each side of the border style separately.
`BorderStyle` class provides a variety of styles.

We can set borders using `RangeUtil` class:

```text
RegionUtil.setBorderTop(BorderStyle.DASH_DOT, region, sheet);
RegionUtil.setBorderBottom(BorderStyle.DOUBLE, region, sheet);
RegionUtil.setBorderLeft(BorderStyle.DOTTED, region, sheet);
RegionUtil.setBorderRight(BorderStyle.SLANTED_DASH_DOT, region, sheet);
```

### Border Colors

Border colors also have to be set separately on each side.
`IndexedColors` class provides a range of colors to use.

We can set border colors using `RangeUtil` class:

```text
RegionUtil.setTopBorderColor(IndexedColors.RED.index, region, sheet);
RegionUtil.setBottomBorderColor(IndexedColors.GREEN.index, region, sheet);
RegionUtil.setLeftBorderColor(IndexedColors.BLUE.index, region, sheet);
RegionUtil.setRightBorderColor(IndexedColors.VIOLET.index, region, sheet);
```

## 示例

```java
import org.apache.poi.ss.usermodel.BorderStyle;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.IndexedColors;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.util.CellRangeAddress;
import org.apache.poi.ss.util.RegionUtil;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

public class ExcelWrite {
    public static void main(String[] args) {
        XSSFWorkbook workbook = new XSSFWorkbook();
        XSSFSheet sheet = workbook.createSheet("第一个Sheet");

        for (int i = 0; i < 10; i++) {
            Row row = sheet.createRow(i);
            for (int j = 0; j < 10; j++) {
                Cell cell = row.createCell(j);
                String value = String.format("(%s, %s)", i, j);
                cell.setCellValue(value);
            }
        }

        {
            CellRangeAddress region = new CellRangeAddress(1, 1, 1, 1);
            RegionUtil.setBorderTop(BorderStyle.THICK, region, sheet);
            RegionUtil.setBorderBottom(BorderStyle.THICK, region, sheet);
            RegionUtil.setBorderLeft(BorderStyle.THICK, region, sheet);
            RegionUtil.setBorderRight(BorderStyle.THICK, region, sheet);
        }

        {
            CellRangeAddress region = new CellRangeAddress(1, 1, 3, 3);
            RegionUtil.setBorderTop(BorderStyle.THICK, region, sheet);
            RegionUtil.setBorderBottom(BorderStyle.THICK, region, sheet);
            RegionUtil.setBorderLeft(BorderStyle.THICK, region, sheet);
            RegionUtil.setBorderRight(BorderStyle.THICK, region, sheet);

            RegionUtil.setTopBorderColor(IndexedColors.VIOLET.index, region, sheet);
            RegionUtil.setBottomBorderColor(IndexedColors.VIOLET.index, region, sheet);
            RegionUtil.setLeftBorderColor(IndexedColors.VIOLET.index, region, sheet);
            RegionUtil.setRightBorderColor(IndexedColors.VIOLET.index, region, sheet);
        }

        {
            CellRangeAddress region = new CellRangeAddress(1, 1, 5, 5);
            RegionUtil.setBorderTop(BorderStyle.DASH_DOT, region, sheet);
            RegionUtil.setBorderBottom(BorderStyle.DOUBLE, region, sheet);
            RegionUtil.setBorderLeft(BorderStyle.DOTTED, region, sheet);
            RegionUtil.setBorderRight(BorderStyle.SLANTED_DASH_DOT, region, sheet);

            RegionUtil.setTopBorderColor(IndexedColors.RED.index, region, sheet);
            RegionUtil.setBottomBorderColor(IndexedColors.GREEN.index, region, sheet);
            RegionUtil.setLeftBorderColor(IndexedColors.BLUE.index, region, sheet);
            RegionUtil.setRightBorderColor(IndexedColors.VIOLET.index, region, sheet);
        }

        {
            CellRangeAddress region = new CellRangeAddress(3, 5, 1, 5);
            RegionUtil.setBorderTop(BorderStyle.THICK, region, sheet);
            RegionUtil.setBorderBottom(BorderStyle.THICK, region, sheet);
            RegionUtil.setBorderLeft(BorderStyle.THICK, region, sheet);
            RegionUtil.setBorderRight(BorderStyle.THICK, region, sheet);
        }

        {
            CellRangeAddress region = new CellRangeAddress(7, 8, 1, 5);
            RegionUtil.setBorderTop(BorderStyle.THICK, region, sheet);
            RegionUtil.setBorderBottom(BorderStyle.THICK, region, sheet);
            RegionUtil.setBorderLeft(BorderStyle.THICK, region, sheet);
            RegionUtil.setBorderRight(BorderStyle.THICK, region, sheet);

            RegionUtil.setTopBorderColor(IndexedColors.ORANGE.index, region, sheet);
            RegionUtil.setBottomBorderColor(IndexedColors.ORANGE.index, region, sheet);
            RegionUtil.setLeftBorderColor(IndexedColors.ORANGE.index, region, sheet);
            RegionUtil.setRightBorderColor(IndexedColors.ORANGE.index, region, sheet);
        }

        OutputUtils.save(workbook, "excel-creation.xlsx");
    }
}
```
