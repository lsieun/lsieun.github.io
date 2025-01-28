---
title: "XWPFDocument"
sequence: "141"
---

The `XWPFDocument` is used to create MS-Word Document with `.docx` file format.

```java
import org.apache.poi.xwpf.usermodel.XWPFDocument;

import java.io.FileOutputStream;
import java.io.IOException;

public class WordCreation {
    public static void main(String[] args) throws IOException {
        // Blank Document
        XWPFDocument document = new XWPFDocument();

        // Write the Document in file system
        String filepath = "word-creation.docx";
        FileOutputStream out = new FileOutputStream(filepath);
        document.write(out);
    }
}
```

## Paragraph

### Text

```java
import org.apache.poi.xwpf.usermodel.XWPFDocument;
import org.apache.poi.xwpf.usermodel.XWPFParagraph;
import org.apache.poi.xwpf.usermodel.XWPFRun;

public class WordCreation {
    public static void main(String[] args) {
        XWPFDocument document = new XWPFDocument();

        XWPFParagraph paragraph = document.createParagraph();
        XWPFRun run = paragraph.createRun();
        run.setText("这是一个段落！");

        OutputUtils.save(document, "word-creation.docx");
    }
}
```

### Border

```java
import org.apache.poi.xwpf.usermodel.Borders;
import org.apache.poi.xwpf.usermodel.XWPFDocument;
import org.apache.poi.xwpf.usermodel.XWPFParagraph;
import org.apache.poi.xwpf.usermodel.XWPFRun;

public class WordCreation {
    public static void main(String[] args) {
        XWPFDocument document = new XWPFDocument();

        XWPFParagraph paragraph = document.createParagraph();
        paragraph.setBorderTop(Borders.BASIC_BLACK_DASHES);
        paragraph.setBorderBottom(Borders.BASIC_BLACK_DASHES);
        paragraph.setBorderLeft(Borders.BASIC_BLACK_DASHES);
        paragraph.setBorderRight(Borders.BASIC_BLACK_DASHES);

        XWPFRun run = paragraph.createRun();
        run.setText("这是一个段落！");

        OutputUtils.save(document, "word-creation.docx");
    }
}
```

## Table

```java
import org.apache.poi.xwpf.usermodel.XWPFDocument;
import org.apache.poi.xwpf.usermodel.XWPFTable;

public class WordCreation {
    public static void main(String[] args) {
        XWPFDocument document = new XWPFDocument();

        XWPFTable table = document.createTable();
        table.getRow(0).getCell(0).setText("这是一个表格");

        OutputUtils.save(document, "word-creation.docx");
    }
}
```

```java
import org.apache.poi.xwpf.usermodel.XWPFDocument;
import org.apache.poi.xwpf.usermodel.XWPFTable;
import org.apache.poi.xwpf.usermodel.XWPFTableRow;

public class WordCreation {
    public static void main(String[] args) {
        XWPFDocument document = new XWPFDocument();

        XWPFTable table = document.createTable();
        XWPFTableRow row0 = table.getRow(0);
        row0.getCell(0).setText("第一行第1列");
        row0.addNewTableCell().setText("第一行第2列");
        row0.addNewTableCell().setText("第一行第3列");

        OutputUtils.save(document, "word-creation.docx");
    }
}
```

```java
import org.apache.poi.xwpf.usermodel.XWPFDocument;
import org.apache.poi.xwpf.usermodel.XWPFTable;
import org.apache.poi.xwpf.usermodel.XWPFTableRow;

public class WordCreation {
    public static void main(String[] args) {
        XWPFDocument document = new XWPFDocument();

        XWPFTable table = document.createTable();

        XWPFTableRow row0 = table.getRow(0);
        row0.getCell(0).setText("第一行第1列");
        row0.addNewTableCell().setText("第一行第2列");
        row0.addNewTableCell().setText("第一行第3列");

        XWPFTableRow row1 = table.createRow();
        row1.getCell(0).setText("第二行第1列");
        row1.getCell(1).setText("第二行第2列");
        row1.getCell(2).setText("第二行第3列");

        XWPFTableRow row2 = table.createRow();
        row2.getCell(0).setText("第三行第1列");
        row2.getCell(1).setText("第三行第2列");
        row2.getCell(2).setText("第三行第3列");

        OutputUtils.save(document, "word-creation.docx");
    }
}
```

## Font Style

```java
import org.apache.poi.xwpf.usermodel.VerticalAlign;
import org.apache.poi.xwpf.usermodel.XWPFDocument;
import org.apache.poi.xwpf.usermodel.XWPFParagraph;
import org.apache.poi.xwpf.usermodel.XWPFRun;

public class WordCreation {
    public static void main(String[] args) {
        XWPFDocument document = new XWPFDocument();

        XWPFParagraph paragraph = document.createParagraph();

        XWPFRun run1 = paragraph.createRun();
        run1.setBold(true);
        run1.setItalic(true);
        run1.setText("这是第1段文本");
        run1.addBreak();

        XWPFRun run2 = paragraph.createRun();
        run2.setTextPosition(300);
        run2.setText("这是第2段文本");

        XWPFRun run3 = paragraph.createRun();
        run3.setStrikeThrough(true);
        run3.setFontSize(50);
        run3.setSubscript(VerticalAlign.SUBSCRIPT);
        run3.setText("这是第3段文本");

        OutputUtils.save(document, "word-creation.docx");
    }
}
```

## Alignment

```java
import org.apache.poi.xwpf.usermodel.ParagraphAlignment;
import org.apache.poi.xwpf.usermodel.XWPFDocument;
import org.apache.poi.xwpf.usermodel.XWPFParagraph;
import org.apache.poi.xwpf.usermodel.XWPFRun;

public class WordCreation {
    public static void main(String[] args) {
        XWPFDocument document = new XWPFDocument();

        XWPFParagraph paragraph = document.createParagraph();
        paragraph.setAlignment(ParagraphAlignment.CENTER);

        XWPFRun run = paragraph.createRun();
        run.setText("这是一段文字");

        OutputUtils.save(document, "word-creation.docx");
    }
}
```

## Text Extraction

```java
import org.apache.poi.xwpf.extractor.XWPFWordExtractor;
import org.apache.poi.xwpf.usermodel.XWPFDocument;

import java.io.FileInputStream;
import java.io.IOException;

public class WordRead {
    public static void main(String[] args) throws IOException {
        String filePath = FileUtils.getFilePath("word-creation.docx");
        FileInputStream fis = new FileInputStream(filePath);
        XWPFDocument document = new XWPFDocument(fis);

        XWPFWordExtractor wordExtractor = new XWPFWordExtractor(document);
        System.out.println(wordExtractor.getText());
    }
}
```

