---
title: "array"
sequence: "102"
---

[UP](/bash.html)


## 定义数组

在 Bash 脚本中，你可以通过多种方式来定义字符串数组。

三种常见的定义字符串数组的方法：

方法一：在一行中定义字符串数组并进行赋值

```bash
strings=("string1" "string2" "string3")
```

在这个方法中，我们使用圆括号 `(` 和 `)` 将所有字符串括起来，并使用空格将它们分隔开。

方法二：逐行定义字符串数组

```bash
strings[0]="string1"
strings[1]="string2"
strings[2]="string3"
```

在这种方法中，我们逐行为数组中的每个索引位置赋值。

方法三：使用 `+=` 运算符逐个添加元素到数组中

```bash
strings+=("string1")
strings+=("string2")
strings+=("string3")
```

这种方法允许你在任何时候为数组添加新的元素，无论是在定义数组时还是在脚本的其它部分。

## 遍历数组

```bash
#!/bin/bash

# 定义一个数组
my_array=("apple" "banana" "cherry" "date")

# 使用 for 循环遍历数组
for item in "${my_array[@]}"
do
    echo $item
done
```
