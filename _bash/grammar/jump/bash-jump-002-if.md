---
title: "if"
sequence: "102"
---

[UP](/bash.html)


## 单分支结构

```bash
if [条件]
then
    指令
fi
```

或者

```bash
if [条件]; then
    指令
fi
```

提示：分号（`;`）相当于命令换行

## 双分支结构

```bash
if 条件
then
    指令集
else
    指令集
fi
```

特殊写法：`if [-f "$file"]; then echo 1; else echo 0; fi`

## 多分支结构

```bash
if 条件
then
    指令
elif 条件
then
    指令
else
    指令
fi
```
