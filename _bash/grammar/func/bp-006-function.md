---
title: "Function"
sequence: "106"
---

[UP](/bash.html)


## shell 函数语法

简单的语法：

```bash
# 使用 sh scripts.sh 或 bash scripts.sh 都能执行
函数名() {
    指令...
    return n
}
```

规范的语法：

```bash
# 如果使用 sh scripts.sh，会报错“Syntax error: "(" unexpected”
# 应该使用 bash scripts.sh
function 函数名 { # 注意：这里没有小括号
    指令...
    return n
}
```

## shell 函数执行

直接执行函数名即可。注意：**不需要带小括号**。

```bash
函数名
```

带有参数的函数执行方法：

```bash
函数名 参数 1 参数 2
```

函数带参数说明：

- （1） 在函数体中的位置参数（`$1`, `$2`, `$#`, `$*`, `$@`）都可以是函数的参数
- （2） 父脚本的参数则临时地被函数参数所掩盖或隐藏
- （3） `$0` 比较特殊，它仍然是父脚本的名称
- （4） 在 shell 函数里面，return 命令的功能和工作方式与 exit 相同，用于跳出函数。
- （5） 在 shell 函数体使用 exit 会终止整个 shell 脚本

定义函数的脚本 和 执行函数的脚本 分离

```bash
[ -f ${HOME}/bin/functions.sh ] && . ${HOME}/bin/functions.sh || exit
```

```bash
#!/bin/bash

# Program to output a system information

TITLE="System Information Report For $HOSTNAME"
CURRENT_TIME="$(date +"%x %r %Z")"
TIMESTAMP="Generated $CURRENT_TIME, by $USER"

report_uptime () {
    cat << _EOF_
<h2>System Uptime</h2>
<pre>$(uptime)</pre>
_EOF_
    return
}

report_disk_space () {
    cat << _EOF_
<h2>Disk Space Utilization</h2>
<pre>$(df -h)</pre>
_EOF_
    return
}

report_home_space () {
    cat << _EOF_
<h2>Home Space Utilization</h2>
<pre>$(du -sh /home/*)</pre>
_EOF_
    return
}

cat << _EOF_
<html>
    <head>
        <title>$TITLE</title>
    </head>
    <body>
        <h1>$TITLE</h1>
        <p>$TIMESTAMP</p>
        $(report_uptime)
        $(report_disk_space)
        $(report_home_space)
    </body>
</html>
_EOF_

```

## Shell functions

Shell functions have two syntactic forms.

First, here is the more formal form:

```bash
function name {
    commands
    return
}
```

Here is the simpler (and generally preferred) form:

```bash
name () {
    commands
    return
}
```

where `name` is the name of the function and `commands` is a series of commands contained within the function.

Both forms are equivalent and may be used interchangeably. The following is a script that demonstrates the use of a shell function:

```bash
#!/bin/bash

# Shell function demo

function step2 {
    echo "Step 2"
    return
}

# Main program starts here

echo "Step 1"
step2
echo "Step 3"

```

**Note** that for function calls to be recognized as shell functions and not interpreted as the names of external programs, **shell function definitions** must appear in the script before they are called.

```bash
#!/bin/bash

# Program to output a system information

TITLE="System Information Report For $HOSTNAME"
CURRENT_TIME="$(date +"%x %r %Z")"
TIMESTAMP="Generated $CURRENT_TIME, by $USER"

report_uptime () {
    return
}

report_disk_space () {
    return
}

report_home_space () {
    return
}

cat << _EOF_
<html>
    <head>
        <title>$TITLE</title>
    </head>
    <body>
        <h1>$TITLE</h1>
        <p>$TIMESTAMP</p>
        $(report_uptime)
        $(report_disk_space)
        $(report_home_space)
    </body>
</html>
_EOF_

```

A function must contain at least one command. The `return` command (which is optional) satisfies the requirement.
