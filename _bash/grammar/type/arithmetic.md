---
title: "Arithmetic"
sequence: "102"
---

[UP](/bash.html)


变量的数值计算常见的命令有如下几个：

```txt
(()), let, expr, bc, $[]
```

## Arithmetic expansion

在 `man bash` 的 `Arithmetic Expansion` 有关于 `$((expression))` 的说明。

**Arithmetic expansion** allows the evaluation of an **arithmetic expression** and the substitution of the result.  The format for arithmetic expansion is:

```bash
$((expression))
```

注意：

- Arithmetic Expression: `((expression))`，这是“表达式”
- Arithmetic Expansion: `$((expression))`，这是“经过解析之后的值”

The old format `$[expression]` is deprecated and will be removed in upcoming versions of bash.

The evaluation is performed according to the rules listed below under ARITHMETIC EVALUATION.  If expression is invalid, bash prints a message indicating failure and no substitution occurs.

此法很常用，且效率高

执行简单的整数运算，只需将特定的算术表达式用 `$((` 和 `))` 括起来。

- `++`, `--`: 增加及减少，可前置，也可以放在结尾
- `+`, `-`: 一元的正号与负号

算术运算符

- `+`, `-`, `*`, `/`, `%`: 加、减、乘、除、取余
- `**`: exponentiation

```bash
$ a=2
$ b=3
$ echo $((2**3))
8
```

关系运算符

- `<`, `<=`, `>`, `>=`: 比较符号
- `==`, `!=`: 相等、不相等

```bash
LIMIT=10

for ((a=1; a <= LIMIT ; a++))
do
  echo -n "$a "
done
```

条件表达式

- `?:`: 条件表达式

```bash
$ a=2
$ b=3
$ echo $((a>b?a:b))
3
```

逻辑关系：

- `&&`, `||`, `!`: 逻辑的与、或、非

位的操作

- `<<`, `>>`: 向左位移、向右位移
- `&`, `|`, `~`, `^`: 位的“与、或、取反、异或”

- `!`: 逻辑的与、或、非
- `~`: 位的与、或、非

赋值运算符

- `=`: 普通赋值
- `+=`, `-=`, `*=`, `/=`, `%=`: 算术赋值
- `&=`, `|=`, `^=`: 位逻辑赋值
- `<<=`, `>>=`: 位移赋值

## let 命令的用法

格式

```bash
let 赋值表达式
```

```bash
$ i=2
$ let i=i+8
$ echo $i
10
$ i=i+8    <=== 去掉 let 定义
$ echo $i
i+8
```

## expr (evaluate expressions)命令的用法

expr 命令一般用于整数值，但也用于字符串，用来求表达式变量的值，同时 expr 也是一个手工命令计算器。

```bash
$ expr 2 + 2
4
$ expr 2 - 2
0
$ expr 2 * 2
expr: syntax error
$ expr 2 \* 2
4
```

注意：

- （1） 运算符左右都有空格
- （2） 使用乘号时，必须用反斜线屏蔽其特定含义。

expr 用于正则表达式的匹配判断：

- `STRING : REGEXP`: anchored pattern match of `REGEXP` in `STRING`

```bash
$ expr "hello.txt" : ".*\.txt"
9    <===  这里应该是匹配的长度
$ expr "hello.txt" : "ABC.*\.txt"
0
```

判断是否为数字

```bash
$ cat judge_int.sh
#!/bin/bash
read -p "please input something: " value
expr $value + 0 >/dev/null 2>&1
[ $? -eq 0 ] && echo int || echo chars

$ sh judge_int.sh
please input something: 123
int

$ sh judge_int.sh
please input something: abc
chars
```

## Basic Calculator

```bash
$ sudo apt install bc
```

`bc` (Basic Calculator) is a command line utility that offers everything you expect from a simple scientific or financial calculator. It is a language that supports arbitrary precision numbers with interactive execution of statements and it has syntax similar to that of C programming language.

```bash
liusen@Ambition:bin$ bc

10 + 5
15

1000 / 5
200

(2+4)*2
12

3/5
0
```

```bash
$ echo '4/2' | bc
2

$ echo 'scale=3; 5/4' | bc
1.250

$ ans=$(echo "scale=3; 4 * 5/2;" | bc)
$ echo $ans
10.000
```

```bash
$ seq -s "+" 10
1+2+3+4+5+6+7+8+9+10

$ seq -s "+" 10|bc
55
```

## Reference

- [How to Use GNU bc (Basic Calculator) in Linux](https://www.tecmint.com/bc-command-examples/)
