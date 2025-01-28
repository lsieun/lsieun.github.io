---
title: "IO Redirection"
sequence: "io-redirection"
---

[UP](/linux.html)


URL:

- https://stackoverflow.com/questions/24793069/what-does-do-in-bash
- https://stackoverflow.com/questions/818255/in-the-shell-what-does-21-mean

命令的一般输入来自于键盘，输出一般是在屏幕上；通过重定向，可以使输入来自文件，输出也到文件。


## stdin / stdout / stderr

输入和输出

- File descriptor `0` is the standard input (`stdin`).
- File descriptor `1` is the standard output (`stdout`).
- File descriptor `2` is the standard error (`stderr`).


## 三种语法

The operators we are using here are:

- `>` Syntax: `[file_descriptoropt] > file_name`
- `>&` Syntax: `[file_descriptoropt] >& file_descriptor`
- `&>` Syntax: `&> file_name`


So we have:

- `>name` means `1>name` -- redirect `stdout` to **the file name**
- `2>&1` means -- redirect `stderr` to `stdout`
- `&>name` means `1>name 2>name` -- redirect `stdout` and `stderr` to **the file name**


Here is one way to remember this construct (although it is not entirely accurate): at first, `2>1` may look like a good way to redirect `stderr` to `stdout`. However, it will actually be interpreted as "**redirect stderr to a file named 1**". `&` indicates that what follows is **a file descriptor** and **not a filename**. So the construct becomes: `2>&1`.


## stdout redirect

标准输出的重定向

```bash
#command > file_name
# >  覆盖写入
# >> 追加写入
[root@mini ~]# ls -l . > ls-output.txt
```

> 注意：标准输出的重定向，并不能输出错误信息

## stderr redirect

错误输出的重定向，需要借助于“shell 文件的描述符”。

shell 文件的描述符：

	0 代表 stdin
	1 代表 stdout
	2 代表 stderr

示例：

```bash
ls /usr/local/non-existfolder 2> ls-output.txt
```

注意： `2> ls-output.txt` 中的 `2` 和 `>` 之间似乎不能有空格，否则输出成功不了。

## stdout+stderr redirect

```bash
# 第一种方式
ls -l ./ /usr/local/non-existfolder
ls -l ./ /usr/local/non-existfolder > ls-ouput.txt 2>&1

# 第二种方式
ls -l ./ /usr/local/non-existfolder &> ls-ouput.txt
```

> 如果信息是输出到 `/dev/null`，信息就会都被忽略掉


## redirect stdin

命令：

1. cat      连接文件
2. sort     排序文本行
3. uniq     报道或省略重复行
4. grep     打印匹配行
5. wc       打印文件中换行符、字和字节数
6. head     输出文件第一部分
7. tail     输出文件最后一部分
8. tee      从标准输入读取数据，并同时写到标准输出和文件


```bash
$ cat seasons.txt 

spring
summber
autumn
winter

$ sort < seasons.txt > words.txt
$ cat words.txt 

autumn
spring
summber
winter
```
