---
title: "局部变量"
sequence: "102"
---

[UP](/bash.html)


## 普通字符串变量定义

```bash
变量名 =value
变量名 ='value'
变量名 ="value"
```

第一种定义方式（` 变量名 =value`），并没有使用引号，用于直接定义变量内容，内容一般为简单的数字、字符串、路径名。

第二种定义方式（` 变量名 ='value'`），使用单引号来定义变量。它的特点：输出变量时，引号里是什么就输出什么，即使内容中有变量也会把变量名原样输出。此种方法比较适合于定义显示纯字符串。

第三种定义方式（` 变量名 ="value"`），使用双引号来定义变量。它的特点：输出变量时，引号里的变量会经过解析后输出该变量的内容。

```bash
$ echo `date`
Fri Oct 18 10:07:26 CST 2019

$ echo '`date`'
`date`

$ echo "`date`"
Fri Oct 18 10:07:48 CST 2019
```

自定义变量的建议：

- （1） 纯数字（不带空格）或者类似于布尔值的变量，定义方式不加引号

```bash
apple_count=10
NETWORKING=yes
```

- （2） 路径，定义方式不加引号

```bash
ANT_HOME=/opt/ant
```

- （3） 字符串，一般用双引号

```bash
APP_NAME="Hello World"
WARN_MESSAGE="There is something wrong."
```

- （4） 变量合并：当某些变量要组合起来才有意义时，建议将要组合的变量合并到一起赋值给一个新的变量。

```bash
VERSION="V1.0"
SOFTWARE_NAME="httpd"
SOFTWARE_FULLNAME="${SOFTWARE_NAME}-${VERSION}.tar.gz"
```

## 全局变量和局部变量命名

- （1） 脚本中的全局变量定义，如 `ANT_HOME`，在使用变量时使用 `{}` 将变量括起来，例如 `${ANT_HOME}`

- （2） 脚本中的局部变量定义：存在于脚本函数（function）中的变量称为“局部变量”，要以 `local` 方式进行声明，使之在本函数作用域内有效。

```bash
function TestFunc()
{
    local i
    for ((i=0;i<n;i++))
    do
        echo "do something"
    done
}
```

## 将一个命令作为变量

The `$(...)` form has superseded **backticks** for command substitution.

主要是两种方式：

```bash
# 第一种：
变量名 =` 命令 `
# 第二种：推荐使用这种，因为"`"容易被误读成"'"
变量名 =$(命令)
```

```bash
$ CMD=`ls`

$ echo $CMD
function_demo hello_world local-vars sys_info_page

$ CMD1=$(pwd)

$ echo $CMD1
/home/liusen/bin

$ CMD2=`date +%F`

$ echo $CMD2
2019-10-18

$ CMD3=$(date +%F)

$ echo $CMD3
2019-10-18
```

## scripts

In the scripts we have written so far, all the variables (including constants) have been **global variables**. Global variables maintain their existence throughout the program. This is fine for many things, but it can sometimes complicate the use of shell functions.

Inside shell functions, it is often desirable to have **local variables**. Local variables are accessible only within the shell function in which they are defined and cease to exist once the shell function terminates.

```bash
#!/bin/bash

# local-vars: script to demonstrate local variables

foo=0    # global variable foo

funct_1 () {
    local foo    # variable foo local to funct_1
    foo=1
    echo "funct_1: foo=$foo"
}

funct_2 () {
    local foo    # variable foo local to funct_2

    foo=2
    echo "funct_2: foo=$foo"
}

echo "global: foo = $foo"
funct_1
echo "global: foo = $foo"
funct_2
echo "global: foo = $foo"

```

As we can see, local variables are defined by preceding the variable name with the word `local`. This creates a variable that is local to the shell function in which it is defined. Once outside the shell function, the variable no longer exists.

When we run this script, we see these results:

```bash
$ local-vars
global: foo = 0
funct_1: foo=1
global: foo = 0
funct_2: foo=2
global: foo = 0
```
