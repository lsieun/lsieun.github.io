---
title: "清理文件"
sequence: "103"
---

[UP](/git/git-index.html)


## clean

Remove untracked files from the working tree

```text
git help clean
```

`git clean` 命令是删除“未跟踪”的文件，其参数有：

- `-n`: 不实际删除，只是进行演练，展示将要进行的操作，有哪些文件将要被删除。（可先使用该命令参数，然后再决定是否执行）
- `-f`: 强制删除文件
- `-i`: 显示将要删除的文件
- `-d`: 递归删除目录及文件（未跟踪的）
- `-q`: 仅显示错误，成功删除的文件不显示

```text
git clean -ndf
```

不会删除 `.gitignore` 中要排除的内容：

```text
git clean -df
```

会删除 `.gitignore` 中要排除的内容：

```text
git clean -xdf
```
