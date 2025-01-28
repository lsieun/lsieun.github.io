---
title: "echo"
---

[UP](/linux.html)


## Intro

`echo` command in linux is used to display line of text/string that are passed as an argument.

```bash
$ type echo
echo is a shell builtin
```

This is a built-in command that is mostly used in shell scripts and batch files to output status text to the screen or a file.

Syntax:

```text
echo [option] [string]
```

查看帮助：

```bash
$ man echo
NAME
       echo - display a line of text

SYNOPSIS
       echo [SHORT-OPTION]... [STRING]...
       echo LONG-OPTION

DESCRIPTION
       Echo the STRING(s) to standard output.

       -n     do not output the trailing newline

       -e     enable interpretation of backslash escapes

       -E     disable interpretation of backslash escapes (default)

       --help display this help and exit
```

```text
$ echo "This is an example string"
This is an example string
```

## Options

### -n

By default, `echo` includes `'\n'` at the end of every string it outputs.

`-n` option can be used to remove the `'\n'` (newline character) from the output.

```bash
[liusen@centos7 hello-git]$ echo "This is an example string"
This is an example string
[liusen@centos7 hello-git]$ echo -n "This is an example string"
This is an example string[liusen@centos7 hello-git]$
```

### -E

`-E` option when used, disables the recognition of **escape sequence** in strings. This option is enabled by default.

### -e

`-e` option enables the terminal to recognize **escape sequences** in the inputted string.
The following sequences are recognized, as described in the Linux man page.

- `\\`: backslash character
- `\a`: alert (BEL): A sound is played when this character is encountered in an inputted string.
- `\b`: backspace: Backspace is triggered when this character is encountered in a string. Hence, the character before '\b' is removed from the output, as shown below.

```bash
$ echo -e "This is an example\b string"
This is an exampl string
```

- `\c`: produce no further output. All characters after '\c' in a string are omitted from the output.

```bash
$ echo "This is an example\c string"
This is an example\c string
[liusen@centos7 hello-git]$ echo -e "This is an example\c string"
This is an example[liusen@centos7 hello-git]$
```

- `\n`: newline. When encountered in a string, this escape sequence triggers the creation of a new line. As a result, characters after `\n` are outputted in a new line.

```bash
$ echo -e "This is \nan example string"
This is 
an example string
$ echo -e "This is \nan example \nstring"
This is 
an example 
string
```

- `\r`: carriage return. Characters before `\r` in a string are omitted from the output, as shown in the example below.

```bash
$ echo -e "This is \ran example string"
an example string
```

- `\t`: horizontal tab. A tab space is created in the output, wherever `\t` appears in the string.

```bash
$ echo "This is \tan example string"
This is \tan example string
$ echo -e "This is \tan example string"
This is 	an example string
```

- `\v`: vertical tab. A vertical tab space is created in the output, wherever `\v` appears in the string.

```bash
$ echo -e "This is an example\v string"
This is an example
                   string
```

- `\a`: alert. to have sound alert.

```bash
$ echo -e "\aThis is an example string"
This is an example string
```

## Advanced Examples

### directory files

Linux `echo` command is used with the wildcard character `*` to display the names of all files present in the current directory.

```bash
$ ls
branches  config  description  HEAD  hooks  index  info  objects  refs
$ echo *
branches config description HEAD hooks index info objects refs
$ echo i*
index info
```

### basic arithmetic

Linux `echo` command can be used to perform basic arithmetic operations and display the result as output.

This is done by enclosing the mathematical part within `(( ))` preceded by a `$` symbol.

```bash
$ echo $((50*2))
100
```

### display variables

We can use `echo` command to display **user-defined variables** or even **environment variables**.

```bash
$ str="this is a string"
$ echo $str
this is a string
$ echo $PATH
/usr/local/bin:/usr/bin:/usr/local/sbin:/usr/sbin:/usr/libexec/git-core:/home/liusen/.local/bin:/home/liusen/bin
```

> End
