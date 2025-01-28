---
title: "tee"
sequence: "tee"
---

[UP](/linux.html)


在执行 Linux 命令时，我们**既想把输出保存到文件中，又想在屏幕上看到输出内容**，就可以使用 `tee` 命令

## Usage

```bash
ls | tee myfile.txt
```

## 帮助

```text
$ man tee
```

```text
NAME
       tee - read from standard input and write to standard output and files

SYNOPSIS
       tee [OPTION]... [FILE]...

DESCRIPTION
       Copy standard input to each FILE, and also to standard output.

       -a, --append
              append to the given FILEs, do not overwrite

       -i, --ignore-interrupts
              ignore interrupt signals

       -p     diagnose errors writing to non pipes

       --output-error[=MODE]
              set behavior on write error.  See MODE below

       --help display this help and exit

       --version
              output version information and exit
```

## 如何使用

`tee` 命令主要用于将一个命令的标准输出分成两份，一份输出到屏幕上，另一份输出到文件中，或者将一个命令的输出重定向到多个文件中。

下面是一些 `tee` 命令的使用示例：

1. 将命令的标准输出保存到文件中：

```
command | tee filename
```

以上命令将执行 `command` 命令，并将命令的标准输出保存到文件 `filename` 中，并在屏幕上显示输出内容。



2. 向文件中追加命令的标准输出：

```
command | tee -a filename
```

以上命令将执行 `command` 命令，并将命令的标准输出追加到文件 `filename` 中，并在屏幕上显示输出内容。

3. 将命令的标准输出输出到多个文件中：

```
command | tee file1 file2 file3
```

以上命令将执行 `command` 命令，并将命令的标准输出输出到三个文件 `file1`、`file2` 和 `file3` 中，并同时在屏幕上显示输出内容。

希望这些示例能够帮助你理解 `tee` 命令的基本用法。

## Here Document

### 写入内容

如果原来文件中有内容，就会

```text
$ tee abc.txt <<EOF
overlay
br_netfilter
EOF
```

### 追加内容

```text
$ tee -a abc.txt <<EOF
overlay
br_netfilter
EOF
```
