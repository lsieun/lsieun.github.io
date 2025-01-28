---
title: "import 导入指令"
sequence: "105"
---

## import 导入指令

File: `commons.ftl`

```text
<#macro multiply num>
    <#list 1..num as i>
        <#list 1..i as j>
            ${j} * ${i} = ${i * j}
        </#list>
        <br/>
    </#list>
</#macro>
```

File: `test.ftlh`

```text
<#-- 导入命名空间 -->
<#import "commons.ftl" as common>
<#-- 使用命名空间中的指令 -->
<@common.multiply num=3></@common.multiply>
```

## include 包含指令

可以使用`include`指令在模板中插入另外一个FreeMarker模板文件。

- 位置：被包含模板的输出模式是在`include`标签出现的位置插入的。
- 共享变量：被包含的文件和包含它的模板共享变量，就像是被复制粘贴进去的一样。

```text
<#-- html文件 -->
<#include "abc.html">

<#-- freemarker文件 -->
<#include "abc.ftl">

<#-- text文件 -->
<#include "abc.txt">
```

