---
title: "scp"
sequence: "102"
---

[UP](/linux.html)


## 介绍

scp = secure copy 安全拷贝

scp 可以实现服务器与服务器之间的数据拷贝。（from server1 to server2）

## 基本语法

```text
scp   -r       $pdir/$fname           $user@$host:$pidr/$fname
命令   递归      要拷贝的文件路径/名称     目的地用户 @ 主机：目的地路径/名称
```

```text
$ scp jdk-8u391-linux-x64.tar.gz devops@192.168.80.132:$PWD
```
