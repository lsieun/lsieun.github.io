---
title: "assign"
sequence: "101"
---

语法：

```text
<#assign 变量名=值>
<#assign 变量名=值 变量名=值> <!-- 定义多个变量 -->
```

```text
<#assign str="hello">
<h1>${str}</h1>
```

```text
<#assign num=1 names=["zhangsan", "lisi", "wangwu"] >
${num} -- ${names?join(",")}
```

输出：

```text
1 -- zhangsan,lisi,wangwu
```
