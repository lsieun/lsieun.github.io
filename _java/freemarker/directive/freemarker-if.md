---
title: "if, else, elseif"
sequence: "102"
---

## 基础

语法：

```text
<#if condition>
  ...
<#elseif condition2>
  ...
<#elseif condition3>
  ...
...
<#else>
  ...
</#if>
```

示例：

```text
<#if x == 1>
  x is 1
<#elseif x == 2>
  x is 2
<#elseif x == 3>
  x is 3
<#elseif x == 4>
  x is 4
<#else>
  x is not 1 nor 2 nor 3 nor 4
</#if>
```

```text
<#assign score=80>
<#if score lt 60 >
    不及格
<#elseif score == 60>
    正好及格
<#elseif score gt 60 && score lte 80>
    良：(60, 80]
<#else>
    非常优秀
</#if>
```

```text
<#assign list="">
<#if list??>
    数据存在
<#else>
    数据不存在
</#if>
```

## 特殊情况

### 判断对象是否为空

```text
<#if obj??>不为空处理</#if>
```

```text
<#if obj?default("xxx")></#if>
```

`obj`如果为空则给`obj`复制`xxx`。

### 给对象赋默认值，避免空值

使用`${obj!'xxx'}`来避免对象为空的错误。如果`obj`为空，则`obj=xxx`

```text
<#if obj??>
obj不为空
<#else>
obj为空
</#if>
```
