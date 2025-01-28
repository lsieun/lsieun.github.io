---
title: "source"
sequence: "source"
---

[UP](/linux.html)


## `source` is builtin bash

```bash
$ type source

source is a shell builtin
```

语法：

```bash
source filename [arguments]
```

Execute commands from a file in the **current shell**.


The dot command `.` is the equivalent of the C Shell (and Bash) `source` command.

## source, . (dot command)

This command, when invoked from the command-line, executes a script.

Within a script, a `source file-name` loads the file `file-name`.
Sourcing a file (dot-command) imports code into the script,
appending to the script (same effect as the `#include` directive in a `C` program).


## linux 里 `source`、`sh`、`bash`、`./` 有什么区别

URL: https://www.cnblogs.com/pcat/p/5467188.html

- `source test.sh`: 在**当前 shell**内去读取、执行 `test.sh`，而 `test.sh`**不需要**有"执行权限"，可以简写为 `. test.sh`
- `sh test.sh` or `bash test.sh`: 打开一个**subshell**去读取、执行 `test.sh`，而 `test.sh`**不需要**有"执行权限"
- `./test.sh`: 打开一个**subshell**去读取、执行 `test.sh`，但 `test.sh`**需要**有"执行权限"，可以用 `chmod +x` 添加执行权限
