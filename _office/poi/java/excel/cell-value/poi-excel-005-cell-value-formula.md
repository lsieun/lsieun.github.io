---
title: "Cell Value: Formula"
sequence: "105"
---

We're going to look at different ways to read Excel cell values – rather than the formula
that is calculating the cell values – with the Apache POI Java library.

There are two ways to solve this problem:

- Fetch the last cached value for the cell
- Evaluate the formula at runtime to get the cell value

## Fetch the Last Cached Value

Excel stores two objects for the cell when a formula calculates its value.
One is the formula itself, and the second is the cached value.
The cached value contains the last value evaluated by the formula.

So the idea here is we can fetch the last cached value and consider it as cell value.
It may not always be true that the last cached value is the correct cell value.
However, when we're working with an Excel file that is saved,
and there are no recent modifications to the file,
then the last cached value should be the cell value.

Let's see how to fetch the last cached value for a cell:

```text
FileInputStream inputStream = new FileInputStream(new File("temp.xlsx"));
Workbook workbook = new XSSFWorkbook(inputStream);
Sheet sheet = workbook.getSheetAt(0);

CellAddress cellAddress = new CellAddress("C2");
Row row = sheet.getRow(cellAddress.getRow());
Cell cell = row.getCell(cellAddress.getColumn());

if (cell.getCellType() == CellType.FORMULA) {
    switch (cell.getCachedFormulaResultType()) {
        case BOOLEAN:
            System.out.println(cell.getBooleanCellValue());
            break;
        case NUMERIC:
            System.out.println(cell.getNumericCellValue());
            break;
        case STRING:
            System.out.println(cell.getRichStringCellValue());
            break;
    }
}
```

## Evaluate the Formula to Get the Cell Value

Apache POI provides a `FormulaEvaluator` class, which enables us to calculate the results of formulas in Excel sheets.

So, we can use `FormulaEvaluator` to calculate the cell value at runtime directly.
The `FormulaEvaluator` class provides a method called `evaluateFormulaCell`,
which evaluates the cell value for the given `Cell` object and returns a `CellType` object,
which represents the data type of the cell value.

Let's see this approach in action:

```text
// existing Workbook setup

FormulaEvaluator evaluator = workbook.getCreationHelper().createFormulaEvaluator(); 

// existing Sheet, Row, and Cell setup

if (cell.getCellType() == CellType.FORMULA) {
    switch (evaluator.evaluateFormulaCell(cell)) {
        case BOOLEAN:
            System.out.println(cell.getBooleanCellValue());
            break;
        case NUMERIC:
            System.out.println(cell.getNumericCellValue());
            break;
        case STRING:
            System.out.println(cell.getStringCellValue());
            break;
    }
}
```

```java
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.xssf.usermodel.XSSFCell;
import org.apache.poi.xssf.usermodel.XSSFFormulaEvaluator;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

public class ExcelWrite {
    public static void main(String[] args) {
        XSSFWorkbook workbook = new XSSFWorkbook();
        XSSFSheet sheet = workbook.createSheet("第一个Sheet");

        for (int i = 0; i < 3; i++) {
            Row row = sheet.createRow(i);
            for (int j = 0; j < 2; j++) {
                Cell cell = row.createCell(j);
                int value = (i + 1) * (j + 2);
                cell.setCellValue(value);
            }
        }

        int lastCellNum = sheet.getRow(0).getLastCellNum();
        XSSFCell formulaCell = sheet.getRow(0).createCell(lastCellNum + 1);
        formulaCell.setCellFormula("SUM(A:A)-SUM(B:B)");

        XSSFFormulaEvaluator formulaEvaluator = workbook.getCreationHelper().createFormulaEvaluator();
        formulaEvaluator.evaluateFormulaCell(formulaCell);

        OutputUtils.save(workbook, "excel-creation.xlsx");
    }

}
```

## Which Approach to Choose

The simple difference between the two approaches here is that
the first method uses the last cached value,
and the second method evaluates the formula at runtime.

If we're working with an Excel file that is already saved and
we're not going to make changes to that spreadsheet at runtime,
then the cached value approach is better as we don't have to evaluate the formula.

However, if we know that we're going to make frequent changes at runtime,
then it's better to evaluate the formula at runtime to fetch the cell value.

## Reference

- [Read Excel Cell Value Rather Than Formula With Apache POI](https://www.baeldung.com/apache-poi-read-cell-value-formula)
- [Setting Formulas in Excel with Apache POI](https://www.baeldung.com/java-apache-poi-set-formulas)
