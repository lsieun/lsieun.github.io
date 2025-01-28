---
title: "macro 自定义指令"
sequence: "104"
---

## Basic

- 指令可以被多次使用。
- 自定义指令中可以包含字符串，也可包含内置指令。

### 基本使用

格式：

```text
<#macro 指令名>
    指令内容
</#macro>
```

使用：

```text
<@指令名></@指令名>
```

```text
<#macro address>
    天心花园小花路198号
</#macro>

<@address></@address>
```

### 有参数的自定义指令

格式：

```text
<#macro 指令名 参数名1 参数名2>
    指令内容
</#macro>
```

使用：

```text
<@指令名 参数名1=参数值1 参数名2=参数值2></@指令名>
```

```text
<#macro message username age>
    你好，${username}，你的年龄是${age}岁了。
</#macro>

<@message username="小明" age=10></@message>
```

```text
<#macro multiply>
    <#list 1..9 as i>
        <#list 1..i as j>
            ${j} * ${i} = ${i * j} &nbsp;
        </#list>
        <br/>
    </#list>
</#macro>

<@multiply></@multiply>
```

```text
<#macro multiply num>
    <#list 1..num as i>
        <#list 1..i as j>
            ${j} * ${i} = ${i * j}
        </#list>
        <br/>
    </#list>
</#macro>

<@multiply num=3></@multiply>
```

## nested 占位指令

`nested`指令执行自定义指令开始和结束标签中间的模板片段。
嵌套的片段可以包含模板中任意合法的内容。

```text
<#macro test>
    这是一段文本
    <#nested>
    <#nested>
</#macro>

<@test><h4>这是文本后面的内容</h4></@test>
```

```text
    这是一段文本
<h4>这是文本后面的内容</h4><h4>这是文本后面的内容</h4>
```

