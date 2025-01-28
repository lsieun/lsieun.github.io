---
title: "case"
sequence: "103"
---

[UP](/bash.html)


## 语法

case 结构条件句语法

```bash
case "字符串变量" in
    值 1) 指令 1...
;;
    值 2) 指令 2...
;;
    *) 指令...
esac
```

## 示例

### 输入数字

```bash
$ cat num.sh
#!/bin/bash

read -p "please input a number: " ans
case "$ans" in
    1)
        echo "the num you input is 1"
    ;;
    2)
        echo "the num you input is 2"
    ;;
    [3-9])
        echo "the num you input is $ans"
    ;;
    *)
        echo "the num is not in [1-9]"
        exit
    ;;
esac

$ sh num.sh
please input a number: 0
the num is not in [1-9]

$ sh num.sh
please input a number: 5
the num you input is 5
```

### 显示不同颜色

```bash
#!/bin/bash
# color defined
RED_COLOR='\e[1;31m'
GREEN_COLOR='\e[1;32m'
YELLOW_COLOR='\e[1;33m'
BLUE_COLOR='\e[1;34m'
RES='\e[0m'

read -p "please input the fruit name you like: " input
case "$input" in
    apple|APPLE)
        echo -e "the fruit name you like is ${RED_COLOR}${input}${RES}"
    ;;
    banana|BANANA)
        echo -e "the fruit name you like is ${YELLOW_COLOR}${input}${RES}"
    ;;
    pear|PEAR)
        echo -e "the fruit name you like is ${GREEN_COLOR}${input}${RES}"
    ;;
    *)
        echo -e "the fruit name you like is ${BLUE_COLOR}${input}${RES}"
        exit
    ;;
esac
```

### 应用启动和停止

```bash
#!/bin/bash

if [ ${#} -ne 1 ]
then
    echo "program need exact one parameter"
    exit 1
fi

case $1 in
    start)
        echo "start program"
    ;;
    stop)
        echo "stop program"
    ;;
    restart)
        echo "restart program"
    ;;
    *)
        echo "Usage: $0 {start|stop|restart}"
        exit 1
    ;;
esac
```
