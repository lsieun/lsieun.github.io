---
title: "chmod"
sequence: "101"
---

[UP](/linux.html)


chmod 命令可以用来修改用户对某个文件和文件夹的权限。

## 查看权限

Linux 系统中，文件的基本权限由 9 个字符组成。

以 `rwxrw-r-x` 为例，我们可以使用数字来代表各个权限，各个权限与数字的对应关系如下：

```text
r --> 4
w --> 2
x --> 1
```

## 实践

### 操作文件

将所有者（`u`）的权限为 `rwx`：

```text
chmod u=rwx abc.txt
```

所有者（`u`）的权限增加 `r`：

```text
chmod u+r abc.txt
```

所有者（`u`）的权限增加 `rx`：

```text
chmod u+rx abc.txt
```

所有者（`u`）的权限取消 `x`：

```text
chmod u-x abc.txt
```

将 `abc.txt` 设为所有人皆可读取:

```text
chmod ugo+r abc.txt
chmod a+r abc.txt
```

多个命令一起操作用 `,` 进行分割：

```text
chmod u-x,o+rw abc.txt
```

```text
chmod ug+w,o-w file1.txt file2.txt

```

### 操作文件夹

需要加入 `-R` 参数

```text
sudo chmod -R 707 <所要操作的文件夹名称>
```

## 两种模式

### symbolic mode

The format of a **symbolic mode** is `[ugoa...][[+-=][perms...]...]`,
where `perms` is either zero or more letters from the set `rwxXst`,
or a single letter from the set `ugo`.
Multiple symbolic modes can be given, separated by commas.

`ugoa` 的含义：

- `u`: 文件的拥有者（the user who owns the file）
- `g`: 文件组的其他成员（other users in the file's group）
- `o`: 其他用户（other users not in the file's group）
- `a`: 所有用户（all users）。这是默认值，如果不指定任何值，就表示所有用户。


`+-=` 的含义：

- `+`: causes the selected file mode bits to be added
- `-`: causes the selected file mode bits to be removed
- `=`: causes the selected file mode bits to be added and causes unmentioned bits to be removed

`rwxXst` 的含义：

- `r`: read
- `w`: write
- `x`: execute  (or search for directories)
- `X`: execute/search only if the file is a directory or already has execute permission for some user
- `s`: set user or group ID on execution
- `t`: restricted deletion flag or sticky bit

### numeric mode

A **numeric mode** is from one to four octal digits (0-7),
derived by adding up the bits with values `4`, `2`, and `1`.
Omitted digits are assumed to be **leading zeros**.

The first digit selects the set user ID (`4`) and set group ID (`2`)
and restricted deletion or sticky (`1`) attributes.

The second digit selects permissions for the user
who owns the file: read (`4`), write (`2`), and execute (`1`);

the third selects permissions for other users in the file's group, with the same values;

and the fourth for other users not in the file's group, with the same values.

```text
chmod 707 abc.txt
```

```text
$ touch abc.txt
$ ls -l
total 0
-rw-rw-r--. 1 devops devops 0 Dec 19 15:49 abc.txt

$ chmod 707 abc.txt
$ ls -l
total 0
-rwx---rwx. 1 devops devops 0 Dec 19 15:49 abc.txt
```

## 帮助

chmod - change file mode bits

SYNOPSIS

```text
chmod [OPTION]... MODE[,MODE]... FILE...
chmod [OPTION]... OCTAL-MODE FILE...
chmod [OPTION]... --reference=RFILE FILE...
```

```text
OPTIONS
       Change the mode of each FILE to MODE.  With --reference, change the mode of each FILE to that of RFILE.

       -c, --changes
              like verbose but report only when a change is made

       -f, --silent, --quiet
              suppress most error messages

       -v, --verbose
              output a diagnostic for every file processed

       --no-preserve-root
              do not treat '/' specially (the default)

       --preserve-root
              fail to operate recursively on '/'

       --reference=RFILE
              use RFILE's mode instead of MODE values

       -R, --recursive
              change files and directories recursively

       --help display this help and exit

       --version
              output version information and exit

       Each MODE is of the form '[ugoa]*([-+=]([rwxXst]*|[ugo]))+|[-+=][0-7]+'.
```

`chmod` changes the file mode bits of each given file according to `mode`,
which can be either a **symbolic representation** of changes to make,
or **an octal number** representing the bit pattern for the new mode bits.
