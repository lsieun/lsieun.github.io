---
title: "Cell Value: String"
sequence: "105"
---

Apache POI uses the `Workbook` interface to represent an Excel file.
It also uses `Sheet`, `Row`, and `Cell` interfaces to model different levels of elements in an Excel file.
At the `Cell` level, we can use its `getCellType()` method to get the cell type.

Apache POI supports the following cell types:

- BLANK
- BOOLEAN
- ERROR
- FORMULA
- NUMERIC
- STRING

If we want to display the Excel file content on the screen,
we would like to get the string representation of a cell,
instead of its raw value.
Therefore, **for cells that are not of type STRING, we need to convert their data into string values.**

## Get Cell String Value

We can use `DataFormatter` to fetch the string value of an Excel cell.
It can get a formatted string representation of the value stored in a cell.

For example, if a cell's numeric value is `1.234`,
and the format rule of this cell is two decimal points, we'll get string representation “1.23”:

```text
Cell cell = // a numeric cell with value of 1.234 and format rule "0.00"

DataFormatter formatter = new DataFormatter();
String strValue = formatter.formatCellValue(cell);

assertEquals("1.23", strValue);
```

Therefore, the result of `DataFormatter.formatCellValue()` is the display string exactly as it appears in Excel.

## Get String Value of a Formula Cell

If the cell's type is `FORMULA`, the previous method will return the original formula string,
instead of the calculated formula value.
Therefore, to get the string representation of the formula value,
we need to use `FormulaEvaluator` to evaluate the formula:

```text
Workbook workbook = // existing Workbook setup
FormulaEvaluator evaluator = workbook.getCreationHelper().createFormulaEvaluator();

Cell cell = // a formula cell with value of "SUM(1,2)"

DataFormatter formatter = new DataFormatter();
String strValue = formatter.formatCellValue(cell, evaluator);

assertEquals("3", strValue);
```

This method is general to all cell types.
If the cell type is `FORMULA`, we'll evaluate it using the given `FormulaEvaluator`.
Otherwise, we'll return the string representation without any evaluations.

## Reference

- [Get String Value of Excel Cell with Apache POI](https://www.baeldung.com/java-apache-poi-cell-string-value)
