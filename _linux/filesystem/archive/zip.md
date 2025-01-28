---
title: "zip"
sequence: "zip"
---

[UP](/linux.html)


```text
$ sudo yum -y install unzip zip
```

解压：

```text
$ unzip 文件名.zip
```

压缩：

```text
$ zip 文件名.zip 文件夹名称或文件名称
```

## create

```bash
$ zip my.zip f1.txt f2.txt f3.txt
$ zip my.zip *.txt
$ zip my.zip *.txt *.dat
```

## extract

```bash
$ cd test
$ unzip my.zip
```

解压到指定目录：

```bash
$ unzip my.zip -d ~/Software/
```

## view

You can also view the contents of a ZIP file, without extracting anything, by running the following command:

```bash
$ unzip -l <zipped-file>
```
