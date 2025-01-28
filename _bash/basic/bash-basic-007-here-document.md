---
title: "Here Document"
sequence: "107"
---

[UP](/bash.html)


A **here document** is an additional form of I/O redirection
in which we embed a body of text into our script and feed it into the standard input of a command.

## 语法

查看 Here Document 的相关帮助：

- 第 1 步，执行 `man bash` 命令
- 第 2 步，输入 `/Here Documents` 定位到相应位置

语法：

```text
<<[-]word
    here-document
delimiter
```

- `word` 与 `delimiter` 的区别：
  - `word` 可以带引号，也可以不带引号，例如 `'EOF'` 或 `EOF`
  - `delimiter` 就是 `word` 不带引号的值，例如 `EOF`

If the redirection operator is `<<-`,
then **all leading tab characters** are stripped from input lines and the line containing delimiter.
This allows here-documents within shell scripts to be indented in a natural fashion.

## 示例

### cat

The `cat <<EOF` syntax is very useful when working with multi-line text in Bash, eg.
when assigning multi-line string to a shell variable, file or a pipe.

第 1 个示例，Assign multi-line string to a shell variable:

```text
$ sql=$(cat <<EOF
SELECT foo, bar FROM db
WHERE foo='baz'
EOF
)
```

The `$sql` variable now holds the new-line characters too. You can verify with `echo -e "$sql"`.

第 2 个示例，Pass multi-line string to a file in Bash

```text
$ cat <<EOF > print.sh
#!/bin/bash
echo \$PWD
echo $PWD
EOF
```

The `print.sh` file now contains:

```text
#!/bin/bash
echo $PWD
echo /home/user
```

第 3 个示例，Pass multi-line string to a pipe in Bash

```text
$ cat <<EOF | grep 'b' | tee b.txt
foo
bar
baz
EOF
```

The `b.txt` file contains `bar` and `baz` lines. The same output is printed to `stdout`.

### 字母：小写转大写

In the following example, text is passed to the `tr` command
(transliterating lower to upper-case) using a **here document**.
This could be in a shell file, or entered interactively at a prompt.

```text
$ tr a-z A-Z << END_TEXT
    one two three
    four five six
END_TEXT
```

```text
$ tr a-z A-Z << END_TEXT
>     one two three
>     four five six
> END_TEXT
    ONE TWO THREE
    FOUR FIVE SIX
```

`END_TEXT` was used as the delimiting identifier.
It specified the **start** and **end** of **the here document**.

The **redirect**(`<<`) and **the delimiting identifier**(`END_TEXT`) do not need to be separated by a space:
`<<END_TEXT` or `<< END_TEXT` both work equally well.

### 带引号

By default, behavior is largely identical to the contents of **double quotes**:
`variable names` are replaced by their values, commands within `backticks` are evaluated, etc.

第 1 种情况，`EOF` 不带有引号：

```text
$ cat << EOF
\$ Workding dir "$PWD" `pwd`
EOF
```

```text
$ cat << EOF
> \$ Workding dir "$PWD" `pwd`
> EOF
$ Workding dir "/home/devops" /home/devops
```

This can be disabled by quoting any part of the label, which is then ended by the unquoted value;
the behavior is essentially identical to that if the contents were enclosed in **single quotes**.
Thus for example by setting it in single quotes:

第 2 种情况，`EOF` 带有双引号：

```text
$ cat << "EOF"
\$ Workding dir "$PWD" `pwd`
EOF
```

```text
$ cat << "EOF"
> \$ Workding dir "$PWD" `pwd`
> EOF
\$ Workding dir "$PWD" `pwd`
```

第 3 种情况，`EOF` 带有单引号：

```text
$ cat << 'EOF'
\$ Workding dir "$PWD" `pwd`
EOF
```

```bash
$ cat << 'EOF'
> \$ Workding dir "$PWD" `pwd`
> EOF
\$ Workding dir "$PWD" `pwd`
```

### 编写文档

```bash
#!/bin/bash

# Program to output a system information

TITLE="System Information Report For $HOSTNAME"
CURRENT_TIME="$(date +"%x %r %Z")"
TIMESTAMP="Generated $CURRENT_TIME, by $USER"

cat << _EOF_
<html>
    <head>
        <title>$TITLE</title>
    </head>
    <body>
        <h1>$TITLE</h1>
        <p>$TIMESTAMP</p>
    </body>
</html>
_EOF_

```

Instead of using `echo`, our script now uses `cat` and a **here document**.
The string `_EOF_` (meaning end of file, a common convention) was selected as the `token` and
marks the end of the embedded text.
**Note** that the `token` must appear alone and that there must not be trailing spaces on the line.

## Reference

- [How does "cat << EOF" work in bash?](https://stackoverflow.com/questions/2500436/how-does-cat-eof-work-in-bash)
