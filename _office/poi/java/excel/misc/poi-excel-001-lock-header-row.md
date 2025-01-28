---
title: "Lock Header Rows"
sequence: "101"
---

Locking the header row is common when we deal with large Excel spreadsheets.
This facilitates a more user-friendly experience for data navigation and analysis.

```java
package org.apache.poi.ss.usermodel;

public interface Sheet extends Iterable<Row> {
    /**
     * Creates a split (freezepane). Any existing freezepane or split pane is overwritten.
     * <p>
     *     If both colSplit and rowSplit are zero then the existing freeze pane is removed
     * </p>
     * @param colSplit      Horizontal position of split.
     * @param rowSplit      Vertical position of split.
     */
    void createFreezePane(int colSplit, int rowSplit);
}
```

In most cases, we'll want to **lock the first row** to keep the header row always visible:

```text
sheet.createFreezePane(0, 1);
```

In certain scenarios, we may want to **lock multiple rows**,
providing users with more context as they explore the data.
To achieve this, we can adjust the `rowSplit` argument accordingly:

```text
sheet.createFreezePane(0, 2);
```

Apart from locking rows, Apache POI allows us to **lock columns** as well.
This is useful when we have a large number of columns and
we want to keep a specific column visible for reference:

```text
sheet.createFreezePane(1, 0);
```

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
        sheet.createFreezePane(2, 2);

        Object[][] data = DataUtils.getSheetData(200);

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
