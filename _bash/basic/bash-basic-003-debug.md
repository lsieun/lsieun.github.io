---
title: "调试"
sequence: "103"
---

[UP](/bash.html)


## 选项参数

```bash
sh [-nvx] scripts.sh
```

参数：

- `-n`: 不会执行该脚本，仅查询脚本语法是否有问题，并给出错误提示
- `-v`: 在执行脚本时，先将脚本的内容输出到屏幕上，然后再执行脚本。如果有错误，也会给出错误提示。
- `-x`: 将执行的脚本内容输出显示到屏幕上，这个对调试很有用的参数。

在跟踪 script.sh 脚本执行过程里输出脚本的行号

```bash
$ set | grep "PS[1-5]"
PS1='[\u@\h \W]\$ '
PS2='> '
PS4='+ '
```

提示：PS4 变量默认情况下表示加号。

```bash
export PS4='+${LINENO} '    <=== 此命令即可实现在跟踪过程中显示行号，也可以放在脚本中
sh -x script.sh
```

## 使用 set 命令调试部分脚本内容

set 命令可辅助脚本调试。

- `set -n`: 读命令但并不执行
- `set -v`: 显示读取的所有行
- `set -x`: 显示所有命令及其参数

提示：

- （1） 同 bash 命令参数功能
- （2） 开启调试功能通过 `set -x` 命令，而关闭调试功能通过 `set +x`。

优点：和 `bash -x` 相比，`set -x` 可以缩小调试的作用范围。

```bash
#!/bin/bash
echo "1"
echo "2"

set -x
echo "3"
echo "4"
set +x

echo "5"
echo "6"
```

## 使用 bash 专用调试器 bashdb

bashdb，一个 bash 的专用调试器，可以设置断点、单步跟踪、跳出函数等。
