---
title: "POI 核心概念"
sequence: "101"
---

## Folders Explained

- `HSSF`，提供读写 MicroSoft Excel XLS 格式文件的功能（`.xls` 结尾的 excel，是 excel2003 及以前的版本生成的文件格式）。
- `XSSF`，提供读写 MicroSoft Excel OOXML XLSX 格式文件的功能（`.xlsx` 结尾的 excel，是 excel2007 及以后版本生成的文件格式，向下兼容 xls）。

```text
SS 应该是 Style Sheet 的缩写
```

| Folder Name     | Description                                                          |
|-----------------|----------------------------------------------------------------------|
| SS              | Excel Common examples for both Excel 2003(xls) and Excel 2007+(xlsx) |
| HSSF            | examples for Microsoft Excel BIFF(Excel 97-2003, xls)                |
| XSSF            | Excel 2007(xlsx) examples                                            |
| XWPF            | Word 2007(docx) examples                                             |
| OOXML           | OpenXml format low-level examples                                    |
| ScratchPad/HWPF | Word 2003(doc) examples                                              |
| POIFS           | OLE2/ActiveX document examples                                       |

### 常用类

Workbook，工作簿，相当于整个Excel文件。

可以把一个Excel文件理解为现实中记账本的抽象，

在有电脑办公软件之前，人们各种账都记在一本本本子上，本子的内容往往是各种表（后面的Sheet概念）。
所以新建一个工作簿文件(.xls或.xlsx)，就相当于现实中拿到一本记账本。就像下图一样，

![](/assets/images/office/poi/office-work-book.png)

Sheet，工作表，相当于Excel中的一个sheet。

打开一个Excel文件，呈现在眼前的密密麻麻的方格子页面就是一个Sheet，如下图，在下方你可以切换Sheet，

![](/assets/images/office/poi/excel-sheet.png)

Row，工作表的行

![](/assets/images/office/poi/excel-sheet-row.png)

Cell，行的单元格，
就是行中的一个小方格子。

![](/assets/images/office/poi/excel-sheet-cell.png)

CellStyle，单元格样式，
就是每个格子的边框，填充，居中那些。