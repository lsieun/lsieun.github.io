---
title: "sed"
sequence: "sed"
---

[UP](/linux.html)


sed（Stream Editor）是一个流式文本编辑器，它可以在文本流中进行查找、替换、删除等操作。

下面是一些常见的 sed 命令用法：

1. 替换字符串：

```
$ sed 's/old_text/new_text/g' filename
```

上述命令将会在 filename 文件中查找每一个 old_text，并将其替换成 new_text。其中 g 表示全局替换，如果使用 /g，sed 将会替换所有匹配到的 old_text。

2. 删除某一行或者多行：

```
$ sed 'nd' filename        # 删除文件中的第 n 行
$ sed '1d' filename        # 删除文件中的第一行
$ sed 'n1,n2d' filename    # 删除文件中 n1 到 n2 行
$ sed '/pattern/d' filename # 删除文件中匹配 pattern 的行
```

上述命令将会删除指定的行或匹配到的行。

3. 插入或追加一行：

```
$ sed 'nd' filename        # 在第 n 行后插入一行
$ sed '1i text' filename   # 在第一行前插入一行 text
$ sed '$a text' filename   # 在最后一行后追加一行 text
```

上述命令将会在文件中插入或追加指定的行。

4. 输出指定行：

```
$ sed -n 'nd' filename   # 输出文件中的第 n 行
$ sed -n 'n1,n2p' filename  # 输出文件中 n1 到 n2 行
```

上述命令将会输出指定的行。

注意事项：

- sed 命令通常不会对原文件进行修改，如果需要直接修改原文件，可以使用 `sed -i` 选项，例如：`sed -i 's/old_text/new_text/g' filename`。
- sed 命令使用正则表达式进行匹配，因此正则表达式的语法和用法要注意。
- sed 命令也可以从标准输入流中读取内容，例如：`echo "text" | sed 's/t/T/g'`，该命令会将 "text" 中的每个 t 替换成 T，输出 T exT。


## 示例

```text
$ sudo sed -i 's@//.*archive.ubuntu.com@//mirrors.ustc.edu.cn@g' /etc/apt/sources.list
```

该命令的作用是将 `/etc/apt/sources.list` 文件中将 `//.*archive.ubuntu.com` 开头的字符串替换为 `//mirrors.ustc.edu.cn`，
即将 Ubuntu 软件源修改为中国科学技术大学的镜像，具体修改方式如下：

- `-i` 参数表示直接修改源文件，而不是在输出中显示修改结果。
- `'s@//.*archive.ubuntu.com@//mirrors.ustc.edu.cn@g'` 表示将以 `//.*archive.ubuntu.com` 开头的字符串替换为
  `//mirrors.ustc.edu.cn`，其中 `s@` 表示以 `@` 作为分隔符，`g` 表示全局替换。这种替换方式可以避免在字符串中包含反斜杠时的转义问题。

该命令通常用于将 Ubuntu 软件源的镜像地址修改为国内的镜像，加速软件包的下载和更新。
