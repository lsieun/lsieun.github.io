---
title: "花括号展开（brace expansion）"
sequence: "105"
---

[UP](/bash.html)


当使用花括号展开（brace expansion）时，可以生成一系列相似的字符串或命令。

以下是一些常见的花括号展开示例：

1. 字符串展开：

```text
echo {a,b,c}   # 输出：a b c
echo {1..5}   # 输出：1 2 3 4 5
echo {A..E}   # 输出：A B C D E
echo {apple,banana,cherry}   # 输出：apple banana cherry
```

2. 命令展开：

```
touch file{1..5}.txt   # 创建文件：file1.txt, file2.txt, file3.txt, file4.txt, file5.txt
rm mydir/{file1,file2}.txt   # 删除文件：mydir/file1.txt, mydir/file2.txt
# 创建目录：parent-dir/sub-dir1/sub-sub-dir1, parent-dir/sub-dir1/sub-sub-dir2, parent-dir/sub-dir2/sub-sub-dir1, parent-dir/sub-dir2/sub-sub-dir2
mkdir -p parent-dir/{sub-dir1,sub-dir2}/{sub-sub-dir1,sub-sub-dir2}
```

3. 组合展开：

```
echo {a,b}{1,2}   # 输出：a1 a2 b1 b2
echo {red,blue}{1..3}   # 输出：red1 red2 red3 blue1 blue2 blue3
```

这些例子只是展示了花括号展开中的一些常见用法，实际使用时可以根据具体需求进行组合和扩展，以生成所需的字符串或命令。
