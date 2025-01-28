---
title: "Excel Intro"
sequence: "101"
---

## Important Classes in POI Library

### HSSF, XSSF and SXSSF classes

Apache POI main classes usually start with either **HSSF**, **XSSF** or **SXSSF**.

- **HSSF** – is the POI Project's pure Java implementation of the Excel 97(-2007) file format. e.g. `HSSFWorkbook`, `HSSFSheet`.
- **XSSF** – is the POI Project's pure Java implementation of the Excel 2007 OOXML (`.xlsx`) file format. e.g. `XSSFWorkbook`, `XSSFSheet`.
- **SXSSF** (since 3.8-beta3) – is an API-compatible streaming extension of XSSF to be used when very large spreadsheets have to be produced,
  and heap space is limited. e.g. `SXSSFWorkbook`, `SXSSFSheet`.

SXSSF achieves its **low memory footprint by limiting access to the rows that are within a sliding window**,
while XSSF gives access to all rows in the document.

```text
                                         ┌─── Workbook
                  ┌─── ss.usermodel ─────┤
                  │                      └─── Sheet
                  │
                  │                      ┌─── HSSFWorkbook
                  ├─── hssf.usermodel ───┤
org.apache.poi ───┤                      └─── HSSFSheet
                  │
                  │                                        ┌─── XSSFWorkbook
                  │                      ┌─── usermodel ───┤
                  │                      │                 └─── XSSFSheet
                  └─── xssf ─────────────┤
                                         │                 ┌─── SXSSFWorkbook
                                         └─── streaming ───┤
                                                           └─── SXSSFSheet
```

Depending on the version of the excel file `HSSF` is the prefix of the classes representing the old Excel files (`.xls`),
whereas the `XSSF` is used for the newest versions (`.xlsx`). Therefore we have:

- `XSSFWorkbook` and `HSSFWorkbook` classes represent the Excel workbook
- `Sheet` interface represents Excel worksheets
- The `Row` interface represents rows
- The `Cell` interface represents cells

Since we want to read through any kind of Excel file, we'll iterate through all the sheets
**using three nested for loops, one for the sheets, one for the rows of each sheet,**
and finally **one for the cells of each sheet.**

### Row and Cell

Apart from above classes, `Row` and `Cell` are used to interact with a particular row and a particular cell in excel sheet.

```text
                                         ┌─── Workbook
                                         │
                                         ├─── Sheet
                  ┌─── ss.usermodel ─────┤
                  │                      ├─── Row
                  │                      │
                  │                      └─── Cell
                  │
                  │                      ┌─── HSSFWorkbook
org.apache.poi ───┼─── hssf.usermodel ───┤
                  │                      └─── HSSFSheet
                  │
                  │                                        ┌─── XSSFWorkbook
                  │                      ┌─── usermodel ───┤
                  │                      │                 └─── XSSFSheet
                  └─── xssf ─────────────┤
                                         │                 ┌─── SXSSFWorkbook
                                         └─── streaming ───┤
                                                           └─── SXSSFSheet
```

### Styling Related Classes

A wide range of classes like `CellStyle`, `BuiltinFormats`, `ComparisonOperator`, `ConditionalFormattingRule`,
`FontFormatting`, `IndexedColors`, `PatternFormatting`, `SheetConditionalFormatting` etc.
are used when you have to add formatting in a sheet, mostly based on some rules.

```text
                                       ┌─── Workbook
                                       │
                                       ├─── Sheet
                                       │
                                       ├─── Row
                                       │
                                       ├─── Cell
                                       │
                                       ├─── CellStyle
                  ┌─── ss.usermodel ───┤
                  │                    ├─── BuiltinFormats
                  │                    │
                  │                    ├─── ComparisonOperator
                  │                    │
                  │                    ├─── ConditionalFormattingRule
                  │                    │
                  │                    ├─── IndexedColors
                  │                    │
                  │                    └─── SheetConditionalFormatting
                  │
org.apache.poi ───┤                                      ┌─── HSSFWorkbook
                  │                    ┌─── usermodel ───┤
                  │                    │                 └─── HSSFSheet
                  ├─── hssf ───────────┤
                  │                    │                 ┌─── FontFormatting
                  │                    └─── record.cf ───┤
                  │                                      └─── PatternFormatting
                  │
                  │                                      ┌─── XSSFWorkbook
                  │                    ┌─── usermodel ───┤
                  │                    │                 └─── XSSFSheet
                  └─── xssf ───────────┤
                                       │                 ┌─── SXSSFWorkbook
                                       └─── streaming ───┤
                                                         └─── SXSSFSheet
```

#### FormulaEvaluator

Another useful class `FormulaEvaluator` is used to evaluate the formula cells in excel sheet.

```text
                                       ┌─── Workbook
                                       │
                                       ├─── Sheet
                                       │
                                       ├─── Row
                                       │
                                       ├─── Cell
                                       │
                                       ├─── CellStyle
                                       │
                  ┌─── ss.usermodel ───┼─── BuiltinFormats
                  │                    │
                  │                    ├─── ComparisonOperator
                  │                    │
                  │                    ├─── ConditionalFormattingRule
                  │                    │
                  │                    ├─── IndexedColors
                  │                    │
                  │                    ├─── SheetConditionalFormatting
                  │                    │
                  │                    └─── FormulaEvaluator
                  │
org.apache.poi ───┤                                      ┌─── HSSFWorkbook
                  │                    ┌─── usermodel ───┤
                  │                    │                 └─── HSSFSheet
                  ├─── hssf ───────────┤
                  │                    │                 ┌─── FontFormatting
                  │                    └─── record.cf ───┤
                  │                                      └─── PatternFormatting
                  │
                  │
                  │                                      ┌─── XSSFWorkbook
                  │                    ┌─── usermodel ───┤
                  │                    │                 └─── XSSFSheet
                  └─── xssf ───────────┤
                                       │                 ┌─── SXSSFWorkbook
                                       └─── streaming ───┤
                                                         └─── SXSSFSheet
```

## 示例

### 示例一

```java
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import java.io.FileOutputStream;
import java.io.IOException;

public class ExcelCreation {
    public static void main(String[] args) throws IOException {
        XSSFWorkbook workbook = new XSSFWorkbook();
        XSSFSheet sheet = workbook.createSheet("第一个Sheet");

        try (FileOutputStream out = new FileOutputStream("excel-creation.xlsx")) {
            workbook.write(out);
        }
    }
}
```

### 示例二

```java
import org.apache.poi.xssf.usermodel.XSSFCell;
import org.apache.poi.xssf.usermodel.XSSFRow;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

public class ExcelCreation {
    public static void main(String[] args) {
        XSSFWorkbook workbook = new XSSFWorkbook();
        XSSFSheet sheet = workbook.createSheet("第一个Sheet");

        XSSFRow row0 = sheet.createRow(0);
        XSSFCell cell00 = row0.createCell(0);
        cell00.setCellValue("用户名");
        XSSFCell cell01 = row0.createCell(1);
        cell01.setCellValue("年龄");

        XSSFRow row1 = sheet.createRow(1);
        XSSFCell cell10 = row1.createCell(0);
        cell10.setCellValue("张三");
        XSSFCell cell11 = row1.createCell(1);
        cell11.setCellValue(10);

        XSSFRow row2 = sheet.createRow(2);
        XSSFCell cell20 = row2.createCell(0);
        cell20.setCellValue("李四");
        XSSFCell cell21 = row2.createCell(1);
        cell21.setCellValue(9);

        OutputUtils.save(workbook, "excel-creation.xlsx");
    }
}
```



