---
title: "for"
sequence: "104"
---

[UP](/bash.html)


## 语法

### 常规

```bash
for 变量名 in 变量取值列表
do
    指令...
done
```

提示：在此结构中，`in 变量取值列表 ` 可省略，省略时相当于 `in "$@"`。换句话说，使用 `for i` 就相当于使用 `for i in "$@"`。

### C 语言型形式

```bash
for((exp1;expr2;exp3))
do
    指令...
done
```

```bash
#!/bin/bash

for ((i=2; i<=10; i+=2)); do
  echo $i
done
```

## 示例

### 循环数字

```bash
#!/bin/bash

for num in 5 4 3 2 1
do
    echo $num
done
```

```bash
#!/bin/bash
# 注意：这种需要使用 bash for-loop.sh 执行
# 如果使用 sh for-loop.sh 则会将{5..1}当成一个值
for num in {5..1}
do
    echo $num
done
```

```bash
#!/bin/bash

for num in $(seq 5 -1 1)
do
    echo $num
done
```



### touch file

```bash
$ ls
myfile.txt

$ cat myfile.txt
pic_01_raw.jpg
pic_02_raw.jpg
pic_03_raw.jpg

$ for f in $(cat myfile.txt); do touch $f; done

$ ls
myfile.txt  pic_01_raw.jpg  pic_02_raw.jpg  pic_03_raw.jpg

$ for f in $(ls *.jpg); do echo $f; done
pic_01_raw.jpg
pic_02_raw.jpg
pic_03_raw.jpg
```

### check url

```bash
#!/bin/bash

if [ $# -ne 1 ]
then
    echo "this program need exactly one parameter"
    exit 1
fi

file=$1
if [ -z $file -o ! -f $file ]
then
    echo "can't find file: $file"
    exit 1
fi

for url in $(cat ${file})
do
    status=$(curl -I -s --connect-timeout 10 $url | head -1 | cut -d " " -f 2)
    if [ "${status}" = "200" ]
    then
        echo "${url} (OK, ${status})"
    else
        echo "${url} (NO, ${status})"
    fi
    sleep 2
done
```

试运行结果：

```bash
$ sh check-url.sh url.txt
https://www.baidu.com (OK, 200)
https://www.none-exist.com (NO, )
https://www.bilibili.com (NO, 302)
https://www.example.com (OK, 200)
https://www.iqiyi.com (OK, 200)
```

### Location of openvpn binary

```bash
#!/bin/bash
openvpn=""
openvpn_locations="/usr/sbin/openvpn /usr/local/sbin/openvpn"

for location in $openvpn_locations
do
    if [ -f "$location" ]
    then
        openvpn=$location
    fi
done

echo "openvpn=${openvpn}"
```

Out:

```bash
$ sh vpn.sh
openvpn=/usr/sbin/openvpn
```

### 修改带有空格的文件名

在 Linux 中，`IFS` 代表**内部字段分隔符**（**Internal Field Separator**）。

`IFS` 是特殊的环境变量，用于定义 bash shell 用户字段分隔符的一系列字符。
默认情况下，bash shell 会将空格、制表符、换行符作为字段分隔符。

在 shell 中使用到 `for` 循环时，是通过 `IFS` 来定义分隔符。如果要指定多个 `IFS` 字符，只要将他们在赋值行串起来就行。如下:

```bash
IFS=$'\n':;"
```

IFS(Internal Field Seprator)，即内部域分隔符，完整定义是
“The shell uses the value stored in IFS, which is the space, tab, and newline characters by default,
to delimit words for the read and set commands,
when parsing output from command substitution, and when performing variable substituioin.”

IFS 查看

IFS 存在于登录 shell 的局部环境变量中

```bash
$ set | grep IFS
IFS=$' \t\n'
```

通常在 shell 脚本中，我们会使用 for 遍历使用特定字符分隔的字符串，而 for 循环的默认分隔符是空格，这是我们就需要修改当前脚本的默认分隔符。
例如，遍历如下用分号分隔的字符串

```bash
#!/bin/sh
file_name='hello.txt:world.txt:test.txt'  # 被遍历的字符串
OLD_IFS=$IFS  # 将默认的 IFS 保存到临时变量中，以便后续恢复默认值
IFS=':'  # 定义新的分隔符
for i in $file_name;do
  echo $i
done
IFS=$OLD_IFS  # 恢复默认的分隔符
```

在有些情况下，我们的分隔符可能用到转义字符，录入换行符(`\n`)、制表符(`\t`)等。
如果直接使用 `IFS='\n'` 或者 `IFS='\t'` 就会发生错误，这时，就需要使用 `$` 符号 + 单引号 + 转义字符的形式了，
例如使用换行符作为分隔符就需要这样设置

```bash
IFS=$'\n'
```

那么下面两个的区别是什么呢？

- `IFS='\n'`：将字符 `\` 和字符 `n` 作为 IFS 的换行符。
- `IFS=$'\n'`：真正的使用换行符做为字段分隔符。

```bash
#!/bin/bash
IFS=$'\n'
for i in $(ls *.srt)
do
    old_name="${i}"
    new_name="${i/\[DownSub.com\] /}"
    if [[ "${old_name}" != "${new_name}" ]]
    then
        echo "${old_name} -> ${new_name}"
        mv "${old_name}" "${new_name}"
    fi
done
```
