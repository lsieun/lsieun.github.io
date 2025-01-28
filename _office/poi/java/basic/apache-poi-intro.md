---
title: "Apache POI Intro"
sequence: "101"
---

## Version

- Version 5.2.2 (2022-03-19)
- Version 5.2.1 (2022-03-03)
- Version 5.2.0 (2022-01-14)
- Version 5.1.0 (2021-11-01)
- Version 5.0.0 (2021-01-20)
- Version 4.1.2 (2020-02-17)
- Version 4.1.1 (2019-10-20)
- Version 4.1.0 (2019-04-09)
- Version 4.0.1 (2018-12-03)
- Version 4.0.0 (2018-09-07)

## Components of Apache POI

Apache POI contains classes and methods to work on all OLE2 Compound documents of MS-Office.

- **POIFS (Poor Obfuscation Implementation File System)** −
  This component is the basic factor of all other POI elements.
  It is used to read different files explicitly.
- Excel
    - **HSSF (Horrible SpreadSheet Format)** − It is used to read and write `.xls` format of MS-Excel files.
    - **XSSF (XML SpreadSheet Format)** − It is used for `.xlsx` file format of MS-Excel.
- **HPSF (Horrible Property Set Format)** − It is used to extract property sets of the MS-Office files.
- Word
    - **HWPF (Horrible Word Processor Format)** − It is used to read and write `.doc` extension files of MS-Word.
    - **XWPF (XML Word Processor Format)** − It is used to read and write `.docx` extension files of MS-Word.
- PPT
    - **HSLF (Horrible Slide Layout Format)** − It is used to read, create, and edit PowerPoint presentations.
- Visio
    - **HDGF (Horrible DiaGram Format)** − It contains classes and methods for MS-Visio binary files.
- **HPBF (Horrible PuBlisher Format)** − It is used to read and write MS-Publisher files.


