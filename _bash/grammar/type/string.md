---
title: "String"
sequence: "102"
---

[UP](/bash.html)


## String Operations(bash builtin)

在 `man bash` 的"Parameter Expansion"部分可以查看到相关内容

### Length

- `${#string}`: Length of `$string`

### SubString

- `${string:position}`: Extract substring from `$string` at `$position`
- `${string:position:length}`: Extract `$length` characters substring from `$string` at `$position` (zero-indexed, first character is at position 0)

```bash
$ str="ABCD"
$ echo $str
ABCD
$ echo ${str:1}
BCD
$ echo ${str:1:2}
BC
```

### Strip

- `${string#substring}`: Strip shortest match of `$substring` from front of `$string`
- `${string##substring}`: Strip longest match of `$substring` from front of `$string`
- `${string%substring}`: Strip shortest match of `$substring` from back of `$string`
- `${string%%substring}`: Strip longest match of `$substring` from back of `$string`

```bash
$ str="ABCCCCCCDEF"
$ echo ${str}
ABCCCCCCDEF
$ echo ${#str}
11
$ echo ${str#A*C}
CCCCCDEF
$ echo ${str##A*C}
DEF
```

### Replace

- `${string/substring/replacement}`: Replace first match of `$substring` with `$replacement`
- `${string//substring/replacement}`: Replace all matches of `$substring` with `$replacement`
- `${string/#substring/replacement}`: If `$substring` matches front end of `$string`, substitute `$replacement` for `$substring`
- `${string/%substring/replacement}`: If `$substring` matches back end of `$string`, substitute `$replacement` for `$substring`

```bash
$ ls
pic_01_raw.jpg  pic_02_raw.jpg  pic_03_raw.jpg

# 将 raw 替换为 finished
$ for f in $(ls *.jpg); do mv $f ${f/raw/finished}; done

$ ls
pic_01_finished.jpg  pic_02_finished.jpg  pic_03_finished.jpg
```

### Performance

这里的目的，主要是对比“bash 内置命令”与“外部命令”在执行性能上的差异

举例：字符串的长度

```bash
$ str="ABCD"

# 第一种方式：使用 bash 内置的方式
$ echo ${#str}
4

# 第二种方式：使用外部命令 wc 来处理
$ echo ${str} | wc -m
5

# wc 是外部命令
$ type wc
wc is /usr/bin/wc
```

举例：字符串的子串

```bash
$ str="ABCD"

# 第一种方式：使用 bash 内置的方式
$ echo ${str:1:2}
BC

# 第二种方式：使用外部命令 cut 来处理
$ echo ${str} | cut -c 2-3
BC

# cut 是外部命令
$ type cut
cut is /usr/bin/cut
```

举例：三种不同的方法计算字符串长度

```bash
$ chars=$(seq -s " " 10)
$ echo $chars
1 2 3 4 5 6 7 8 9 10

$ echo ${#chars}
20

$ echo $(expr length "$chars")
20

$ echo ${chars} | wc -m
21
```

```bash
$ max_value=11111

# 第一种，内置命令，耗时最少
$ time for i in $(seq $max_value); do char_num=${#chars}; done
real    0m0.105s
user    0m0.100s
sys    0m0.004s

# 第二种，外部命令 wc，耗时明显增多很大
$ time for i in $(seq $max_value); do char_num=$(echo "$chars" | wc -m); done
real    0m13.232s
user    0m0.704s
sys    0m1.492s

# 第三种，外部命令 expr，耗时最多，可能与 expr 自身拥有的功能紧密相关（即可以处理字符串，也可以处理数值）
$ time for i in $(seq $max_value); do char_num=$(expr length "$chars"); done
real    0m16.795s
user    0m1.200s
sys    0m2.600s
```

## Parameter Substitution and Expansion(bash builtin)

- `${var}`: Value of var (same as `$var`)

- `${var-$DEFAULT}`: If `var` not set, evaluate expression as `$DEFAULT`
- `${var:-$DEFAULT}`: If `var` not set or is empty, evaluate expression as `$DEFAULT`.

- `${var=$DEFAULT}`: If `var` not set, evaluate expression as `$DEFAULT`
- `${var:=$DEFAULT}`: If `var` not set or is empty, evaluate expression as `$DEFAULT`

- `${var+$OTHER}`: If `var` set, evaluate expression as `$OTHER`, otherwise as null string
- `${var:+$OTHER}`: If `var` set, evaluate expression as `$OTHER`, otherwise as null string

- `${var?$ERR_MSG}`: If `var` not set, print `$ERR_MSG` and abort script with an exit status of `1`.
- `${var:?$ERR_MSG}`: If `var` not set, print `$ERR_MSG` and abort script with an exit status of `1`.

- `${!varprefix*}`: Matches all previously declared variables beginning with `varprefix`
- `${!varprefix@}`: Matches all previously declared variables beginning with `varprefix`

```bash
$ cat use_default_value.sh
#!/bin/bash
find ${path:=${HOME}/lib/} -name "*.tar.gz" -type f | xargs rm -f

# 由于 path 没有定义，会自动使用默认值
$ sh -x use_default_value.sh
+ find /home/liusen/lib/ -name *.tar.gz -type f
+ xargs rm -f
```

## expr String Operators

```bash
$ chars="123456789ABCDEF"

# 长度
$ echo $(expr length $chars)
15

# 索引
$ echo $(expr index $chars "345")
3

# 子串
$ echo $(expr substr $chars 3 5)
34567
```

## Reference

- [Reference Cards-String Operations](http://tldp.org/LDP/abs/html/refcards.html)
