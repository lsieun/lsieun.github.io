---
title: "chown"
sequence: "102"
---

[UP](/linux.html)


## 查看帮助

```text
$ man chown
```

chown - change file owner and group

SYNOPSIS

```text
chown [OPTION]... [OWNER][:[GROUP]] FILE...
chown [OPTION]... --reference=RFILE FILE...
```

## 示例

```text
$ sudo chown devops:devops -R /opt/{module,software}
```

```text
$ sudo chown $USER: -R /opt/{module,software}
```

## 示例一

```text
$ sudo mkdir /opt/nexus-data
$ sudo chown -R $USER /opt/nexus-data
```

## 示例二

```text
$ sudo chown -R 200:. /path/to/dir
```

命令解析：

- `chown`: 代表 change owner，用于修改文件或目录的所有者。
- `-R`: 代表递归地修改指定目录下的所有文件和子目录。
- `200`: 代表用户 ID。这里将所有文件和目录的所有者改为用户 ID 为 200 的用户。
- `.`: 代表所属组。这里将所有文件和目录的所属组设置为与当前目录相同的所属组。
- `/path/to/dir`: 代表目标目录的路径。你需要将其替换为实际的目录路径。

执行该命令后，指定目录中的所有文件和子目录的所有者将会被修改为用户 ID 为 200 的用户，并且所属组将会被设置为与当前目录相同的所属组。
