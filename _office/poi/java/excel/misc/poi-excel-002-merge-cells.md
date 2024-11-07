---
title: "Merge Cells"
sequence: "102"
---

## Merge Cells

In Excel, we sometimes want to display a string across two or more cells.

![](/assets/images/office/poi/excel-cell-merge-example-001.png)

**To achieve this, we can use `addMergedRegion` to merge several cells defined by `CellRangeAddress`.**
There are two ways to set the cell range.
Firstly, we can use four zero-based indexes to define the top-left cell location and the bottom-right cell location:

```text
sheet = // existing Sheet setup
int firstRow = 0;
int lastRow = 0;
int firstCol = 0;
int lastCol = 2;
sheet.addMergedRegion(new CellRangeAddress(firstRow, lastRow, firstCol, lastCol));
```

We can also use a cell range reference string to provide the merged region:

```text
sheet = // existing Sheet setup
sheet.addMergedRegion(CellRangeAddress.valueOf("A1:C1"));
```

**If cells have data before we merge them,
Excel will use the top-left cell value as the merged region value.
For the other cells, Excel will discard their data.**

**When we add multiple merged regions on an Excel file, we should not create any overlaps.
Otherwise, Apache POI will throw an exception at runtime.**

```java
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.util.CellRangeAddress;
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

        int firstRow = 0;
        int lastRow = 0;
        int firstCol = 0;
        int lastCol = 2;
        sheet.addMergedRegion(new CellRangeAddress(firstRow, lastRow, firstCol, lastCol));

        OutputUtils.save(workbook, "excel-creation.xlsx");
    }

}
```
