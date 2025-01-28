---
title: "ANSI Color"
sequence: "108"
---

[UP](/bash.html)


The below table shows a summary of 3/4 bit version of ANSI-color

| mode       | octal      | hex       | bash    | description      |
|------------|------------|-----------|---------|------------------|
| color-mode |            |           |         |                  |
| 0          | `\033[0m`  | `\x1b[0m` | `\e[0m` | reset any affect |
| 1          | `\033[1m`  |           |         | bright           |
| 2          | `\033[2m`  |           |         | dark             |
| text-mode  |            |           |         |                  |
| 3          | `\033[3m`  |           |         | italic           |
| 4          | `\033[4m`  |           |         | underline        |
| 5          | `\033[5m`  |           |         | blink (slow)     |
| 6          | `\033[6m`  |           |         | blink (fast)     |
| 7          | `\033[7m`  |           |         | reverse          |
| 8          | `\033[8m`  |           |         | hide             |
| 9          | `\033[9m`  |           |         | cross            |
| foreground |            |           |         |                  |
| 30         | `\033[30m` |           |         | black            |
| 31         | `\033[31m` |           |         | red              |
| 32         | `\033[32m` |           |         | green            |
| 33         | `\033[33m` |           |         | yellow           |
| 34         | `\033[34m` |           |         | blue             |
| 35         | `\033[35m` |           |         | purple           |
| 36         | `\033[36m` |           |         | cyan             |
| 37         | `\033[37m` |           |         | white            |
| background |            |           |         |                  |
| 40         | `\033[40m` |           |         | black            |
| 41         | `\033[41m` |           |         | red              |
| 42         | `\033[42m` |           |         | green            |
| 43         | `\033[43m` |           |         | yellow           |
| 44         | `\033[44m` |           |         | blue             |
| 45         | `\033[45m` |           |         | purple           |
| 46         | `\033[46m` |           |         | cyan             |
| 47         | `\033[47m` |           |         | white            |

注意：八进制的 `\033` 转换为 10 进制是 `27`，查看 ASCII 码表后，可以知道它代表 `escape`。相应的，十六进制的 `0x1b` 也表示十进制的 `27`。对于 bash 而言，`\e` 可能是它对于 `escape` 的一种表达形式。

前景色：

![](/assets/images/linux/bash-scripts/foreground-color.gif)

背景色：

![](/assets/images/linux/bash-scripts/background-color.gif)

color-mode shot

![](/assets/images/linux/bash-scripts/color_mod_0_2.png)

text mode shot

![](/assets/images/linux/bash-scripts/text_mod_3_9.png)

combining is OK

![](/assets/images/linux/bash-scripts/combine_mod.png)

How to calculate the length of code?

`\033[ = 2`, other parts 1

Where can we use these codes?

Anywhere that has a `tty` interpreter, `xterm`, `gnome-terminal`, `kde-terminal`, `mysql-client-CLI` and so on.

```bash
echo -e "\033[30m 黑色字 HelloWorld \033[0m"
echo -e "\033[31m 红色字 HelloWorld \033[0m"
echo -e "\033[32m 绿色字 HelloWorld \033[0m"
echo -e "\033[33m 黄色字 HelloWorld \033[0m"
echo -e "\033[34m 蓝色字 HelloWorld \033[0m"
echo -e "\033[35m 紫色字 HelloWorld \033[0m"
echo -e "\033[36m 天蓝字 HelloWorld \033[0m"
echo -e "\033[37m 白色字 HelloWorld \033[0m"
```

```bash
SETCOLOR_SUCCESS="echo -en \\033[1;32m"
SETCOLOR_FAILURE="echo -en \\033[1;31m"
SETCOLOR_WARNING="echo -en \\033[1;33m"
SETCOLOR_NORMAL="echo -en \\033[1;39m"

echo "success message" && $SETCOLOR_SUCCESS
echo "failure message" && $SETCOLOR_FAILURE
echo "warning message" && $SETCOLOR_WARNING
echo "normal  message" && $SETCOLOR_NORMAL
```


## ASCII Table and Description

ASCII stands for American Standard Code for Information Interchange.

![](/assets/images/linux/bash-scripts/ascii-code.gif)
