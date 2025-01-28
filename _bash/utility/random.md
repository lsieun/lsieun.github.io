---
title: "随机数"
sequence: "102"
---

[UP](/bash.html)


方法 1：通过系统环境变量（`$RANDOM`）

```bash
$ echo $RANDOM
15681

$ echo $RANDOM
7250
```

方法 2：通过 openssl 产生随机数

```bash
$ openssl rand -base64 8
lcxHjdH3y78=

$ openssl rand -base64 10
kao2JQsEsVSU1Q==
```

方法 3：通过时间获得随机数

```bash
$ date +%s%N
1571818473791275256

$ date +%N%s
3755495461571818483
```

## Example

生成一个随机 8 位字符

```bash
echo $RANDOM | md5sum | cut -c 15-22
echo "$RANDOM$(date +%FT%T)" | md5sum | cut -c 15-22
```
