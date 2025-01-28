---
title: "fork/source/exec"
sequence: "104"
---

[UP](/bash.html)


## fork、source、exec

通常我们执行 Script 时，默认为 `fork` 方式。

- 使用 `fork` 方式运行 script 时
    - 进程：让 Shell (parent process) 产生一个 child process 去执行该 script，当 child process 结束后，会返回 parent process
    - 环境：但 parent process 的环境是不会因 child process 的改变而改变的。
- 使用 `source`（或 `.`） 方式运行 script 时
    - 进程：让 script 在当前 process 内执行， 而不是产生一个 child process 来执行。
    - 环境：由于所有执行结果均于当前 process 内完成，若 script 的环境有所改变， 当然也会改变当前 process 环境了。
- 使用 `exec` 方式运行 script 时
    - 进程：它和 source 一样，也是让 script 在当前 process 内执行，但是 process 内的原代码剩下部分将被终止。
    - 环境：同样，process 内的环境随 script 改变而改变。

The shell commands can be divided into **internal commands** and **external commands**.
Internal commands are implemented by special file formats. Def, such as `cd`,`ls`.
While external commands are implemented through system calls or standalone programs, such as `awk`, `sed`.
`Source` and `exec` are internal commands.

Fork

When you run a script using fork, the shell (parent process) produces a child process to execute the script,
and when the child process finishes, it returns to the parent process,
but The environment of parent process is not changed by the change of child process.

Source

When you run a script using `source`, the script executes within the current process,
rather than creating a child process.
As all execution results are completed within the current process,
if the context of the script changes, it will certainly change the current process environment.
source./my.sh or. ./my.sh

Exec

When you run script with `exec`, it is the same as source,
where script executes within the current process,
but the remainder of the original code within the process is terminated.
Similarly, the environment within the process changes as the script changes.

Conclusion: Usually, if we execute, it is the default `fork`.
You can see the relationship of the parent-child process through the `pstree` command.
As above, if you want the parent process to get the environment variable of the child process, it is the `source` mode.

## 示例

下面的例子挺有趣的：

1.sh

```bash
#!/bin/bash
A=B
echo "PID for 1.sh before exec/source/fork:$$"
export A
echo "1.sh: \$A is $A"
case $1 in
    exec)
        echo "using exec..."
        exec ./2.sh
    ;;
    source)
        echo "using source..."
        . ./2.sh
    ;;
    *)
        echo "using fork by default..."
        ./2.sh
    ;;
esac
echo "PID for 1.sh after exec/source/fork:$$"
echo "1.sh: \$A is $A"
```

2.sh

```bash
#!/bin/bash
echo "=== === ==="
echo "PID for 2.sh: $$"
echo "2.sh get \$A=$A from 1.sh"
A=C
export A
echo "2.sh: \$A is $A"
echo "=== === ==="
```

Run:

```bash
chmod u+x 1.sh
chmod u+x 2.sh
./1.sh fork
./1.sh source
./1.sh exec
```

Output:

```bash
$ ./1.sh fork

PID for 1.sh before exec/source/fork:5416  ## 注意：两个 PID 是不一样的
1.sh: $A is B
using fork by default...
=== === ===
PID for 2.sh: 5423
2.sh get $A=B from 1.sh
2.sh: $A is C
=== === ===
PID for 1.sh after exec/source/fork:5416
1.sh: $A is B


$ ./1.sh source

PID for 1.sh before exec/source/fork:5437  ## 注意：PID 是一样的
1.sh: $A is B
using source...
=== === ===
PID for 2.sh: 5437
2.sh get $A=B from 1.sh
2.sh: $A is C
=== === ===
PID for 1.sh after exec/source/fork:5437
1.sh: $A is C


$ ./1.sh exec

PID for 1.sh before exec/source/fork:5477  ## 注意：PID 是一样的
1.sh: $A is B
using exec...
=== === ===
PID for 2.sh: 5477
2.sh get $A=B from 1.sh
2.sh: $A is C  ## 注意：1.sh 后面的代码没有执行
=== === ===
```
