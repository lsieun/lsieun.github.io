---
title: "Row and Cell"
sequence: "104"
---

## Row

Then, in order to iterate through the rows of a sheet,
we need to find the index of the **first row** and the **last row** which we get from the sheet object:

```text
int firstRow = sheet.getFirstRowNum();
int lastRow = sheet.getLastRowNum();
for (int index = firstRow + 1; index <= lastRow; index++) {
    Row row = sheet.getRow(index);
}
```

## Cell

While accessing each cell we can optionally pass down a `MissingCellPolicy` which basically tells the POI
what to return when a cell value is empty or null.
The `MissingCellPolicy` enum contains three enumerated values:

- RETURN_NULL_AND_BLANK
- RETURN_BLANK_AS_NULL
- CREATE_NULL_AS_BLANK;

The code for the cell iteration is as follows:

```text
for (int cellIndex = row.getFirstCellNum(); cellIndex < row.getLastCellNum(); cellIndex++) {
    Cell cell = row.getCell(cellIndex, Row.MissingCellPolicy.CREATE_NULL_AS_BLANK);
    ...
}
```

## Reading Cell Values in Excel

Microsoft Excel's cells can contain different value types,
so it's important to be able to distinguish one cell value type from another and
use the appropriate method to extract the value.
Below there's a list of all the value types:

- NONE
- NUMERIC
- STRING
- FORMULA
- BLANK
- BOOLEAN
- ERROR

We'll focus on four main cell value types: `Numeric`, `String`, `Boolean`, and `Formula`,
where the last one contains a calculated value that is of the first three types.

There are two important things worth noting.
First, `Date` values are stored as `Numeric` values,
and also if the cell's value type is `FORMULA` we need to use the `getCachedFormulaResultType()`
instead of the `getCellType()` method to check the result of Formula's calculation:

```text
public static void printCellValue(Cell cell) {
    CellType cellType = cell.getCellType().equals(CellType.FORMULA)
      ? cell.getCachedFormulaResultType() : cell.getCellType();
    if (cellType.equals(CellType.STRING)) {
        System.out.print(cell.getStringCellValue() + " | ");
    }
    if (cellType.equals(CellType.NUMERIC)) {
        if (DateUtil.isCellDateFormatted(cell)) {
            System.out.print(cell.getDateCellValue() + " | ");
        } else {
            System.out.print(cell.getNumericCellValue() + " | ");
        }
    }
    if (cellType.equals(CellType.BOOLEAN)) {
        System.out.print(cell.getBooleanCellValue() + " | ");
    }
}
```

Now, all we need to do is call the `printCellValue` method inside the cell loop and we are done.
Here's a snippet of the full code:

```text
for (int cellIndex = row.getFirstCellNum(); cellIndex < row.getLastCellNum(); cellIndex++) {
    Cell cell = row.getCell(cellIndex, Row.MissingCellPolicy.CREATE_NULL_AS_BLANK);
    printCellValue(cell);
}
```

## 示例

### 写入数据

```java
import org.apache.poi.xssf.usermodel.XSSFCell;
import org.apache.poi.xssf.usermodel.XSSFRow;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;

public class ExcelWrite {
    public static void main(String[] args) {
        XSSFWorkbook workbook = new XSSFWorkbook();
        XSSFSheet sheet = workbook.createSheet("第一个Sheet");

        Object[][] data = DataUtils.getSheetData(20);

        int rowCount = data.length;
        for (int i = 0; i < rowCount; i++) {
            XSSFRow row = sheet.createRow(i);
            Object[] array = data[i];
            int colCount = array.length;
            for (int j = 0; j < colCount; j++) {
                XSSFCell cell = row.createCell(j);
                Object value = array[j];
                if (value instanceof String) {
                    cell.setCellValue((String) value);
                }
                else if (value instanceof Integer) {
                    cell.setCellValue((Integer) value);
                }
                else if (value instanceof Date) {
                    Date date = (Date) value;
                    DateFormat df = new SimpleDateFormat("yyyy-MM-dd");
                    String str = df.format(date);
                    cell.setCellValue(str);
                }
            }
        }

        OutputUtils.save(workbook, "excel-creation.xlsx");
    }
}
```

### 读取数据

```java
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import java.io.FileInputStream;
import java.io.IOException;
import java.util.Iterator;

public class ExcelRead {
    public static void main(String[] args) {
        String filePath = FileUtils.getFilePath("excel-creation.xlsx");
        try (
                FileInputStream fis = new FileInputStream(filePath);
        ) {
            XSSFWorkbook workbook = new XSSFWorkbook(fis);
            XSSFSheet sheet = workbook.getSheetAt(0);

            Iterator<Row> rowIterator = sheet.iterator();
            while (rowIterator.hasNext()) {
                Row row = rowIterator.next();
                //For each row, iterate through all the columns
                Iterator<Cell> cellIterator = row.cellIterator();

                while (cellIterator.hasNext()) {
                    Cell cell = cellIterator.next();
                    //Check the cell type and format accordingly
                    switch (cell.getCellType()) {
                        case NUMERIC:
                            System.out.print(cell.getNumericCellValue() + "    ");
                            break;
                        case STRING:
                            System.out.print(cell.getStringCellValue() + "    ");
                            break;
                    }
                }
                System.out.println();
            }
        }
        catch (IOException e) {
            throw new RuntimeException(e);
        }
    }
}
```

