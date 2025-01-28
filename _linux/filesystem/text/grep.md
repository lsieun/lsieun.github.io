---
title: "grep"
sequence: "grep"
---

[UP](/linux.html)


```text
grep = global regular expression print
```

## 介绍

In essence, `grep` searches text files for text matching a specified regular expression and
outputs any line containing a match to standard output.

```bash
$ type grep
grep is hashed (/bin/grep)
```

The `grep` program accepts **options** and **arguments** this way,
where `regex` is a regular expression:

```bash
grep [options] regex [file...]
```

### 选项参数

常用的 `grep` 选项参数:

- `-E`, `--extended-regexp`: Interpret PATTERN as an extended regular expression (ERE, see below).
- `-i`, `--ignore-case`: Ignore case. Do not distinguish between uppercase and lowercase characters.
- `-v`, `--invert-match`: Invert match. Normally, grep prints lines that contain a match.
  This option causes grep to print every line that does not contain a match.
- `-n`, `--line-number`: Prefix each matching line with the number of the line within the file.
- `-h`, `--no-filename`: For multifile searches, suppress the output of filenames.

显示聚合之后的结果：

- `-c`, `--count`: Print the number of matches (or non-matches if the `-v` option is also specified) instead of the lines themselves.

只显示文件名：

- `-l`, `--files-with-matches`: Print the name of each file that contains a match instead of the lines themselves.
- `-L`, `--files-without-match`: Like the `-l` option, but print only the names of files that do not contain matches.

## 搜索字符串

```text
$ cat << EOF >> abc.txt
# 这是一注释
server01,192.168.80.131,master
server02,192.168.80.132,slave
server03,192.168.80.133,slave
EOF
```

### 反选

不包含注释行：

```text
$ cat abc.txt | grep -v "^#"
server01,192.168.80.131,master
server02,192.168.80.132,slave
server03,192.168.80.133,slave
```

不包含注释行，且只包含 `slave`：

```text
$ cat abc.txt | grep -v "^#" | grep "slave"
server02,192.168.80.132,slave
server03,192.168.80.133,slave
```

```text
$ cat abc.txt | grep -v "^#" | grep "slave" | awk -F ',' '{print $1}'
server02
server03
```

## 搜索文件

```bash
# 根目录下的 bin 和 sbin
$ ls /bin > dirlist-bin.txt
$ ls /sbin > dirlist-sbin.txt
# /usr 目录下的 bin 和 sbin
$ ls /usr/bin > dirlist-usr-bin.txt
$ ls /usr/sbin > dirlist-usr-sbin.txt
# 显示生成的文件
$ ls dirlist*.txt
dirlist-bin.txt  dirlist-sbin.txt  dirlist-usr-bin.txt  dirlist-usr-sbin.txt
```

### 文件名 + 行

```text
# 显示文件名和行
$ grep bzip dirlist*.txt
dirlist-bin.txt:bzip2
dirlist-bin.txt:bzip2recover
```

### 文件名 + 行号 + 行

```text
# 显示文件名、行号、行
$ grep -n bzip dirlist*.txt
dirlist-bin.txt:11:bzip2
dirlist-bin.txt:12:bzip2recover
```

### 行

```text
# 只显示行，不显示文件名
$ grep -h bzip dirlist*.txt
bzip2
bzip2recover
```

### 文件名

```text
# 只显示文件名
$ grep -l bzip dirlist*.txt
dirlist-bin.txt
```

```text
# 取相反的文件名
$ grep -L bzip dirlist*.txt
dirlist-sbin.txt
dirlist-usr-bin.txt
dirlist-usr-sbin.txt
```

### 聚合

```bash
# 显示聚合之后的结果
$ grep -c bzip dirlist*.txt
dirlist-bin.txt:2
dirlist-sbin.txt:0
dirlist-usr-bin.txt:0
dirlist-usr-sbin.txt:0
```

## 搜索目录

find all files containing specific text

```bash
grep -RIil "text-to-find-here" /
```

- `-R`: stands for recursive.
- `-I`: Ignore the binary files.
- `-i`: stands for ignore case (optional in your case).
- `-l`: stands for "show the file name, not the result itself".
- `/` stands for starting at the root of your machine.

```bash
cd ~/Workspace/git-repo
grep -RIil "ulimit" ./
grep -ERIil "mkdir \-p .*\{" ./
```

## 返回值

return code



```bash
$ sudo dmesg > demsg1.txt
$ grep Linux demsg1.txt
## The `-i` tells `grep` to ignore case
$ grep -i Linux demsg1.txt
```

Now run the following command:

```bash
$ echo $?
```

Assuming the text was found, the return code will be 0. Now search for a string that should not be there, the return code should not be 0.

This might seem a little backwards, that zero means success and non-zero means failure. This is common to many Linux commands, because in many cases the number returned is an error code.

## Reference

- [What's Difference Between Grep, Egrep and Fgrep in Linux?](https://www.tecmint.com/difference-between-grep-egrep-and-fgrep-in-linux/)
