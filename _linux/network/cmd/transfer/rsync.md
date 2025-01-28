---
title: "rsync"
sequence: "102"
---

[UP](/linux.html)


```text
$ sudo yum -y install rsync
```

rsync 主要用于备份和镜像。

rsync 的特点：

- 速度快
- 避免复制相同内容
- 支持符号链接

rsync 和 scp 区别：

- 速度：用 rsync 做文件的复制要比 scp 的速度快
- 内容：rsync 只对差异文件做更新，scp 是把所有文件都复制过去

### 基本语法

```text
rsync -av $pdir/$fname $user@$host:$pdir/$fname
```

选项参数说明：

- `-a`：归档拷贝
- `-v`：显示复制过程

### 示例操作

```text
$ rsync -av hadoop-3.1.3/ devops@server3:/opt/module/hadoop-3.1.3/
```
