---
title: "查看命令的命令"
sequence: "type-which-man-apropos"
---

[UP](/linux.html)


在 Linux 中，`command` 命令通常具有以下几种形式：

1. 内置命令（Built-in Command）：这些命令是由 shell 程序自带的命令，例如 `cd`、`echo` 等。它们不需要调用外部程序，而是由 shell 直接执行。

2. 外部命令（External Command）：这些命令则是由 Linux 系统上的独立执行文件
   （通常位于 `/bin`、`/usr/bin`、`/sbin` 或 `/usr/sbin` 等目录中）组成的命令。例如，`ls`、`cat` 等工具就是外部命令。

3. shell 函数（Shell Function）：可以在 shell 程序中定义函数，实现一些特定的功能。
   例如，可以使用 `function_name()` 的形式定义函数，然后就可以在 shell 程序中使用这个函数了。

4. 别名（Alias）：可以使用 `alias` 命令为一个命令或一组命令定义别名。别名实际上是一种命令替换机制，当你执行别名时，实际上是执行了别名所对应的命令。

总之，`command` 命令可以调用上述任何一种命令或函数，通常用于在 shell 程序中调用外部命令等。

```text
$ type cd
cd is a shell builtin
$ type find
find is /usr/bin/find
$ type sed
sed is hashed (/usr/bin/sed)
$ type grep
grep is aliased to `grep --color=auto'
```

命令：

```text
type       说明怎样解析一个命令名
which      显示会执行哪个可执行程序
man        显示命令手册
apropos    显示一系列适合的命令
info       显示命令 info
whatis     显示一个命令的简洁描述
alias      创建命令别名
```


## type

command 的 4 种形式：

1. execute binary
2. buildin bash
3. shell function
4. alias

可以使用 type 命令来进行区分

```text
#type command
type type
```



## which

查看可执行命令的存放位置

```text
# which command
which file
which dir
```


## man

type/cd/alias 是 buildin 命令；对于 buildin 命令，可以通过 `help` 命令来查看帮助文档：

```text
#help command
help cd
```


对于非 buildin 命令，可以使用 `--help` 选项来查看帮助文档：

```text
#command --help
dir --help
```

`man`（manual 手册）是可以查看相对比较完整的命令手册，可以通过 `yum -y install man` 来进行安装。使用方法如下：

```text
#man command
man type   #type 是 buildin 命令
man dir    #dir 是非 buildin 命令
```

## apropos

如果完成某个特定任务，不知道用哪个命令，可以通过 apropos 来搜索关键字，apropos 会搜索 man 手册的关键信息。

```text
#apropos <keyword>
# 等价于 man -k <keyword>
```

## whatis

用来显示一个命令的简洁说明，因为有时候会觉得使用 `man` 命令显示了太多信息。

```text
whatis type
whatis cp
whatis apropos
```

## info

```text
#info <keyword>
# 键盘快捷键
#n: next node
#p: previous node
#q: quit
#u: up
#enter: jump to link
```

## 7. alias ##

```text
# 多个命令可以一起拼写，用分号(;)分隔
cd /usr; ls; cd 

# 也可以通过 alias 来建立别名
#alias name='command string'
alias mytest='cd /usr; ls; cd'

# 查看所有 alias
alias

# 删除别名
#unalias name
unalias mytest
```
