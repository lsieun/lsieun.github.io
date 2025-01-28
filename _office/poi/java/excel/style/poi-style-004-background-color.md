---
title: "Background Color"
sequence: "104"
---

## Cell Background

On an excel sheet, we can change the cell background just by filling it with color or with a pattern.

Apache POI provides three methods for changing the background color.
In the `CellStyle` class, we can use the `setFillForegroundColor`, `setFillPattern`, and `setFillBackgroundColor`
methods for this purpose.
A list of colors is defined in the `IndexedColors` class.
Similarly, a list of patterns is defined in `FillPatternType`.

Sometimes, the name `setFillBackgroundColor` may mislead us.
But, that method itself is not sufficient for changing cell background.
To change cell background by filling with a solid color,
we use the `setFillForegroundColor` and `setFillPattern` methods.
The first method tells what color to fill, while the second one specifies the solid fill pattern to use.

The following snippet is an example method to change cell background as shown on cell A1:

```text
public void changeCellBackgroundColor(Cell cell) {
    CellStyle cellStyle = cell.getCellStyle();
    if(cellStyle == null) {
        cellStyle = cell.getSheet().getWorkbook().createCellStyle();
    }
    cellStyle.setFillForegroundColor(IndexedColors.LIGHT_BLUE.getIndex());
    cellStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);
    cell.setCellStyle(cellStyle);
}
```

To change a cell background with a pattern, we need to use two colors:
one color to fill the whole background, and one to fill a pattern on top of the first color.
Here, we need to use all those three methods.

Method `setFillBackgroundColor` is used here to specify the background color.
We don't get any effect by using only this method.
We need to use `setFillForegroundColor` to select the second color and
`setFillPattern` to state the pattern type.

The following snippet is an example method to change cell background as shown on cell B1:

```text
public void changeCellBackgroundColorWithPattern(Cell cell) {
    CellStyle cellStyle = cell.getCellStyle();
    if(cellStyle == null) {
        cellStyle = cell.getSheet().getWorkbook().createCellStyle();
    }
    cellStyle.setFillBackgroundColor(IndexedColors.BLACK.index);
    cellStyle.setFillPattern(FillPatternType.BIG_SPOTS);
    cellStyle.setFillForegroundColor(IndexedColors.LIGHT_BLUE.getIndex());
    cell.setCellStyle(cellStyle);
}
```

```java
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFCell;
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

        XSSFCell A1 = sheet.getRow(0).getCell(0);
        XSSFCell B1 = sheet.getRow(0).getCell(1);
        changeCellBackgroundColor(A1);
        changeCellBackgroundColorWithPattern(B1);

        OutputUtils.save(workbook, "excel-creation.xlsx");
    }

    public static void changeCellBackgroundColor(Cell cell) {
        CellStyle cellStyle = cell.getSheet().getWorkbook().createCellStyle();
        cellStyle.setFillForegroundColor(IndexedColors.LIGHT_BLUE.getIndex());
        cellStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);
        cell.setCellStyle(cellStyle);
    }

    public static void changeCellBackgroundColorWithPattern(Cell cell) {
        CellStyle cellStyle = cell.getSheet().getWorkbook().createCellStyle();
        cellStyle.setFillBackgroundColor(IndexedColors.BLACK.index);
        cellStyle.setFillPattern(FillPatternType.BIG_SPOTS);
        cellStyle.setFillForegroundColor(IndexedColors.LIGHT_BLUE.getIndex());
        cell.setCellStyle(cellStyle);
    }
}
```



