---
title: "条件测试"
sequence: "101"
---

[UP](/bash.html)


## 测试语句

在 bash 的各种流程控制结构，通常要进行各种测试，然后根据测试结果执行不同的操作，有时也会通过与 if 等条件语句相结合，使我们可以方便的完成判断。

### 条件测试语法

- 格式一： `test <测试表达式>`
- 格式二： `[ <测试表达式> ]`
- 格式三： `[[<测试表达式>]]`

格式一和格式二是等价的，格式三为扩展的 test 命令。**推荐**使用**格式二**。为什么要推荐使用格式二呢？如果使用 `bash myscript.sh` 或 `./myscript.sh`，对于 `[[...]]` 处理没有问题；但是如果使用 `sh myscript.sh`，则会出现 `[[: not found` 的错误，出现错误的原因就是 `[[expression]]` 是 bash 的内置命令。

The `[[ ]]` construct is the more versatile Bash version of `[ ]`. This is the extended test command, adopted from ksh88.

Using the `[[ ... ]]` test construct, rather than `[ ... ]` can prevent many logic errors in scripts. For example, the `&&`, `||`, `<`, and `>` operators work within a `[[ ]]` test, despite giving an error within a `[ ]` construct.

注意：`&&`, `||`, `>`, `<` 等操作符可以应用于 `[[]]` 中，但不能应用于 `[]` 中。在 `[[]]` 中，还可以使用符进行模式匹配。

```bash
$ test -f file && echo "regular file" || echo "not regular file"
not regular file

$ touch file
$ test -f file && echo "regular file" || echo "not regular file"
regular file

$ [ -f file ] && echo "regular file" || echo "not regular file"
regular file

$ [[ -f file ]] && echo "regular file" || echo "not regular file"
regular file

$ [[ -f file && -d folder ]] && echo "OK" || echo "NO"
NO

$ mkdir folder
$ [[ -f file && -d folder ]] && echo "OK" || echo "NO"
OK

$ [ -f file && -d folder ] && echo "OK" || echo "NO"
bash: [: missing `]'    <===  注意：出错，这里说明"[]"当中不能使用"&&"
NO

$ [ -f file -a -d folder ] && echo "OK" || echo "NO"
OK    <===  在"[]"中使用"-a"
```

### 逻辑连接符

| 在 `[]` 中使用 | 在 `[[]]` 中使用 |
| ------------ | -------------- |
| `-a`         | `&&`           |
| `-o`         | `||`           |
| `!`          | `!`            |

## Arithmetic Comparison

### [[<expression>]]

相等

- `-eq`： Equal to
- `-ne`： Not equal to

小于

- `-lt`： Less than
- `-le`： Less than or equal to

大于

- `-gt`： Greater than
- `-ge`： Greater than or equal to

### (())

对整数进行关系运算，也可以使用 Shell 的算术运算符 `(())`。

- `>`： Greater than
- `>=`： Greater than or equal to
- `<`： Less than
- `<=`： Less than or equal to

整数二元比较操作符

| 在 `[]` 中使用 | 在 `(())` 和 `[[]]` 中使用 |
| ------------ | ---------------------- |
| `-eq`        | `==`                   |
| `-ne`        | `!=`                   |
| `-gt`        | `>`                    |
| `-ge`        | `>=`                   |
| `-lt`        | `<`                    |
| `-le`        | `<=`                   |

### 判断变量是否为整数

思路：如果 num 长度不为 0,并且把 num 中的非数字部分删除，然后看结果是不是等于 num 本身，如果两者都成立就是数字。

- `-n "$num"`: 如果 num 长度为 0 的表达式
- `"$num" = "${num//[^0-9]/}"`: 把 num 中的非数字部分删除，然后看结果是不是等于 num 本身

完整表达式：

```bash
$ num="123abc789xyz"
$ echo ${num//[^0-9]/}
123789

$ [ -n "${num}" -a "${num}" = "${num//[^0-9]/}" ] && echo "Num" || echo "Not Num"
Not Num

$ [[ -n "${num}" && "${num}" = "${num//[^0-9]/}" ]] && echo "Num" || echo "Not Num"
Not Num
```

使用 expr 来判断是否是整数

```bash
$ expr ${num} + 0 > /dev/null 2>&1
$ echo $?
2
```

## String Comparison

相等

- `=`： Equal to
- `==`： Equal to
- `!=`： Not equal to

`=` 比较两个字符串是否相同，与 `==` 等价，例如 `[[ "$a" == "$b" ]]`，其中 `$a` 这样的变量最好用 `""` 括起来，因为中间如果有空格、`*` 等符号就可能出错了。当然更好的方法就是 `[[ "${a}" == "${b}" ]]`。

```bash
$ a="abc"
$ b="abc"

$ [["$a"=="$b"]] && echo "OK"
bash: [[abc==abc]]: command not found  <=== 这里说明，空格不能少
$ [["$a" == "$b"]] && echo "OK"
bash: [[abc: command not found  <=== 这里说明，空格不能少

$ [[ "$a" == "$b" ]] && echo "OK"
OK

$ [[ "${a}" == "${b}" ]] && echo "OK"
OK
```

大小

- `\<`： Less than (ASCII)
- `\>`： Greater than (ASCII)

空与非空

- `-z`： String is empty
- `-n`： String is not empty 可能是 `none-zero` 的缩写

```bash
$ [[ -z "$mystr" ]] && echo "zero" || echo "none zero"
zero

$ [[ -n "$mystr" ]] && echo "none-zero" || echo "zero"
zero

$ mystr="HelloWorld"
$ [[ -n "$mystr" ]] && echo "none-zero" || echo "zero"
none-zero
```

## Files

文件是否存在

- `-e`: File exists

文件类型

- `-f`: File is a regular file
- `-d`: File is a directory
- `-h`: File is a symbolic link
- `-L`: File is a symbolic link
- `-b`: File is a block device
- `-c`: File is a character device
- `-p`: File is a pipe
- `-S`: File is a socket
- `-t`: File is associated with a terminal

A **block device** reads and/or writes data in chunks, or blocks, in contrast to a **character device**, which acesses data in character units. Examples of **block devices** are hard drives, CDROM drives, and flash drives. Examples of **character devices** are keyboards, modems, sound cards.

- 查看 block device: `find /dev -type b`
- 查看 character device: `find /dev -type c`

文件所属的用户和组

- `-N`: File modified since it was last read
- `-O`: You own the file
- `-G`: Group id of file same as yours

文件大小

- `-s`: File is not zero size 文件存在，且不为空。

文件权限

- `-r`: File has read permission
- `-w`: File has write permission
- `-x`: File has execute permission

取反

- `!`: NOT (inverts sense of above tests)

对比两个文件

- `F1 -nt F2`: File F1 is newer than F2
- `F1 -ot F2`: File F1 is older than F2
- `F1 -ef F2`: Files F1 and F2 are hard links to the same file

## User

```bash
$ echo $UID
1000

$ cat test.sh
#!/bin/bash
echo "UID=" $UID

$ sh user_id.sh
UID=    <===  这里居然是空值，是为什么呢？
```

`$UID` is a Bash variable that is not set under `sh`, that may be why it outputs blank lines.

Try `bash test.sh` or make your script executable with `chmod u+x test.sh`, the program defined in shebang will then be used (`/bin/bash`)

If it doesn't work, you can use `uid=$(id -u)`.

案例：判断当前用户是否需要 root 权限

```bash
$ cat user.sh
#!/bin/bash
ROOT_UID=0

echo "Before If: UID=${UID}"

if [ "${UID:=$(id -u)}" -ne "${ROOT_UID}" ]
then
    echo "After If: UID=${UID}"
    echo "Must be root to run this script."
    exit 1
fi

$ sh user.sh
Before If: UID=
After If: UID=1000
Must be root to run this script.

$ sudo sh user.sh
Before If: UID=
```
