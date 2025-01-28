---
title: "Shell 脚本开发基本规范及习惯"
sequence: "102"
---

[UP](/bash.html)


## 目录和文件

### 脚本目录

- `~/bin`: **personal use**
- `/usr/local/bin`: **everyone on a system**
- `/usr/local/sbin`: **system administrator**

### 文件后缀

脚本以 `.sh` 为扩展名。

## 文件内容

### 解释器

第一，开头指定脚本解释器

```bash
#!/bin/sh
```

或者

```bash
#!/bin/bash
```

This is the first line of the script above.
The hash exclamation mark (`#!`) character sequence is referred to as the Shebang.
Following it is the path to the interpreter (or program) that should be used
to run (or interpret) the rest of the lines in the text file.


The shebang must be on the very first line of the file (line 2 won't do, even if the first line is blank).

> 只能是第一行

There must also be no spaces before the `#` or between the `!` and the path to the interpreter.

> 不能有空格



### 版本 + 版权信息

```bash
#Date:     HH:mm yyyy-MM-dd
#Author:   Create By XXX
#Email:    username@example.com
#Function: This script function is ...
#Version:  V1.0
```

提示：可以通过使用 `./vimrc` 配置文件的方式，来使 Vim 软件自动添加以上信息

第三，脚本当中，尽量使用英文注释。如果中文注释，可能在不同的操作系统环境下产生乱码的字符。

### 格式

代码书写优秀习惯

- （1） 成对内容一次写出来，防止遗漏。例如：

```txt
{}, [], '', ``, ""
```

- （2） `[]` 中括号两端要有空格，书写时即可留出空格 `[  ]`，然后再退格书写内容。
- （3） 流程控制语句一次书写完，再添加内容。

if 语句格式一次完成：

```bash
if 条件内容
    then
        内容
fi
```

for 循环格式一次完成：

```bash
for
do
    内容
done
```

第六，通过缩进让代码易读。

> 好的习惯可以让我们避免很多不必要的麻烦，提升很多的工作效率。

### 变量

在使用变量的时候，尽可能的要加上 `""`，除非影响功能。

```bash
if [ -f "$file" ]; then echo 1; else echo 0; fi
```

变量 `$file` 加了双引号，这是编程的好习惯，可以防止很多意外的错误发生。
