---
title: "Tricks"
sequence: "109"
---

[UP](/bash.html)


## 查看可用 Shell

To list available valid login shells for use at time, type following command:

```bash
cat /etc/shells
```

## 清空文件

适用场景：保留文件，清除文件内容

```bash
## 第一种方式（推荐）：没有空白行
$ cat /dev/null > abc.txt
## 第二种方式：会有一个空白行
$ echo "" > abc.txt
## 第三种方式(与第一种效果相同)
$ > abc.txt
```

## Two Command

Keyword: `&&`, `||`

- `make && make install`: 如果 `make` 命令执行成功，就再接着执行 `make install`。如果第一个命令执行不造成，则第二个命令不执行。
- `cd /var/log || echo "change directory fail"`: 如果 `cd /var/log` 执行失败，则执行 `echo "change directory fail"`。如果第一个命令执行成功，则第二个命令不执行。

```bash
cd /var/log || {
    echo "change directory failed"
    pwd
}

cd /root || {
    echo "change directory failed"
    pwd
}
```
