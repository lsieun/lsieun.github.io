---
title: "特殊变量：$0-$n"
sequence: "103"
---

[UP](/bash.html)


## 位置变量

- `$0`：获取当前执行 Shell 脚本的文件名，包括**路径**。
- `$n`：获取当前执行 Shell 脚本的第 n 个参数值。n=1...9。如果 n 大于 9，用大括号括起来 `${10}`
- `$#`：获取当前 Shell 命令中参数的总个数
- `$@`：这个程序的所有参数 "$1", "$2", "$3", "..."，这是将参数传递给其他程序的最佳方式，因为它会保留所有内嵌在每个参数里的任何空白。
- `$*`：获取当前 Shell 的所有参数，将所有的命令行参数视为单个字符串相当于"$1$2$3..."，注意与 `$@` 的区别。

可以使用 `dirname` 和 `basename` 来获取 `$0` 的路径和名称。

```bash
$ cat dirname.sh
#!/bin/bash
dirname $0

$ sh ~/bin/dirname.sh
/home/liusen/bin

$ cat basename.sh
#!/bin/bash
basename $0

$ sh ~/bin/basename.sh
basename.sh
```

```text
#!/bin/bash

if [ ${#} -ne 1 ]
then
    echo "program need exact one parameter"
    exit 1
fi
```

## 进程状态变量

- `$$`：获取当前 Shell 的进程号（PID）
- `$!`：执行上一个命令的 PID
- `$?`：获取执行上一个命令的返回值。0 为成功，非 0 为失败。
- `$_`：在此之前执行的命令或脚本的最后一个参数

### $?

`$?` 返回值参考：

| 返回值     | 表示涵意                                   |
|---------| ------------------------------------------ |
| 0       | 运行成功                                   |
| 2       | 权限拒绝                                   |
| 1 ~ 125 | 运行失败，脚本命令、系统命令或参数传递错误 |
| 126     | 找到该命令了，但无法执行                   |
| 127     | 未找到要运行的命令                         |
| 128     | 命令被系统强制结束                         |

提示：在脚本调用，一般用 `exit 0`，函数 `return 0`。

返回值为 `0`：

```bash
$ pwd
/home/liusen/bin

$ echo $?
0
```

返回值为 `1`：

```bash
$ ant
Buildfile: build.xml does not exist!
Build failed

$ echo $?
1
```

返回值为 `2`：

```bash
$ ls /root
ls: cannot open directory '/root': Permission denied

$ echo $?
2
```

返回值为 `127`：

```bash
$ ifconfig
bash: ifconfig: command not found

echo $?
127
```

### $_

```bash
$ cat hello_world.sh
#!/bin/bash
echo "Hello World"

$ sh $_
Hello World
```

以前的时候，我会先按一下 `ESC` 键（或者按 `Ctrl+[` 组合键），再按 `.` 会自动补全上一个命令的最后一个参数。
现在我知道，使用 `$_` 可以代替

## Bash 内部命令

有些内部命令在 `man 命令 ` 时是看不见的，它们由 Shell 本身提供。

常用的内部命令有：`echo`, `eval`, `exec`, `export`, `readonly`, `read`, `shift`, `wait`, `exit` 和点（`.`）。

- `echo 变量名列表 `：将变量名列表的内容显示到标准输出
- `eval args`：读入参数 args，并将它们组合成一个新的命令，然后执行。
- `exec 命令参数 `：当 Shell 执行到 exec 语句时，不会去创建新的子进程，而是转去执行指定的命令，当指定的命令执行完时，该进程（也就是最初的 Shell）就终止了，所以 Shell 程序中 exec 后的语句将不再被执行。
- `export 变量名 =value`：Shell 可以用 export 把它的变量向下带入子 Shell，从而让子进程继承父进程中的环境变量。但子 Shell 不能用 export 把它的变量向上传入父 Shell。
- `readonly 变更名 `：只读变量，用 readonly 显示所有只读变量。
- `read 变量名列表 `：从标准输入读字符串，传给指定变量。可以在函数中用 `local 变量名 ` 的方式声明局部变量。
- `shift`：shift 语句会使所有位置参数依次向左移动一个位置，并使位置参数 `$#` 减 1，直到减至 0 为止。即 `$2` 成为 `$1`，`$3` 成为 `$2`。

## Reference Cards

### Special Shell Variables

| Variable  | Meaning                                             |
|-----------|-----------------------------------------------------|
| `$0`      | Filename of script                                  |
| `$1`      | Positional parameter #1                             |
| `$2`-`$9` | Positional parameters #2 - #9                       |
| `${10}`   | Positional parameter #10                            |
| `$#`      | Number of positional parameters                     |
| `"$*"`    | All the positional parameters (as a single word)    |
| `"$@"`    | All the positional parameters (as separate strings) |
| `$?`      | Return value                                        |
| `$$`      | Process ID (PID) of script                          |
| `$-`      | Flags passed to script (using *set*)                |
| `$_`      | Last argument of previous command                   |
| `$!`      | Process ID (PID) of last job run in background      |
