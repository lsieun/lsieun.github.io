---
title: "list"
sequence: "103"
---

The simplest form for listing a sequence (or collection) is:

```text
<#list sequence as item>
    Part repeated for each item
</#list>
```

and to list the key-value pairs of a hash (since 2.3.25):

```text
<#list hash as key, value>
    Part repeated for each key-value pair
</#list>
```

Generic form 1:

```text
<#list sequence as item>
    Part repeated for each item
<#else>
    Part executed when there are 0 items
</#list>
```

Where:

- The `else` part is optional, and is only supported since FreeMarker 2.3.23.
- `sequence`: Expressions evaluates to a sequence or collection of the items we want to iterate through
- `item`: Name of the loop variable (not an expression)

Generic form 2 (since FreeMarker 2.3.23):

```text
<#list sequence>
    Part executed once if we have more than 0 items
    <#items as item>
        Part repeated for each item
    </#items>
    Part executed once if we have more than 0 items
<#else>
    Part executed when there are 0 items
</#list>
```

```text
<#assign nameList=["lucy","lily","tom","jerry"]>
<#list nameList as name>
    <p>${name}</p>
</#list>
```

```text
<#assign nameList=[]>
<#list nameList as name>
    <p>${name}</p>
<#else>
    <p>empty list</p>
</#list>
```

```text
<#assign nameList=["lucy","lily","tom","jerry"]>
<#list nameList>
    <#items as name>
        <p>${name}</p>
    </#items>
</#list>
```

```text
<#assign nameList=[]>
<#list nameList>
    <#items as name>
        <p>${name}</p>
    </#items>
    <#else>
    <p>empty list</p>
</#list>
```

判断数据不为空，再执行遍历（如果序列不存在，直接遍历会报错）

```text
<#if nameList??>
    <#list nameList as name>
        <p>${name}</p>
    <#else>
        <p>empty list</p>
    </#list>
<#else>
    <p>not exist</p>
</#if>
```

```text
<#assign nameList=["lucy","lily","tom","jerry"]>
<#if nameList??>
    <#list nameList as name>
        <p>${name}</p>
    <#else>
        <p>empty list</p>
    </#list>
<#else>
    <p>not exist</p>
</#if>
```

```text
<#assign nameList=[]>
<#if nameList??>
    <#list nameList as name>
        <p>${name}</p>
    <#else>
        <p>empty list</p>
    </#list>
<#else>
    <p>not exist</p>
</#if>
```

## 特殊情况

### Filtering

In this example, you want to show the recommended products from `products`.
Here's the wrong solution with `if`:

```text
<#-- WRONG solution! The row parity classes will be possibly messed up: -->
<#list products as product>
   <#if product.recommended>
     <div class="${product?item_parity}Row">${product.name}</div>
   </#if>
</#list>
```

Here's the good solution that uses the [`filter` built-in](https://freemarker.apache.org/docs/ref_builtins_sequence.html#ref_builtin_filter):

```text
<#-- Good solution: -->
<#list products?filter(p -> p.recommended) as product>
  <div class="${product?item_parity}Row">${product.name}</div>
</#list>
```

### Stop listing when a certain element is found

Let's say you have a list of lines in `lines`, and you need to stop at the first empty line (if there's any).
Furthermore, you need to `<br>` between the elements.
Here's the wrong solution with `if` and `break`:

```text
<#-- WRONG solution! <br> might be added after the last printed line: -->
<#list lines as line>
   <#if line == ''>
     <#break>
   </#if>
   ${line}<#sep><br>
</#list>
```

Here's the good solution that uses the [`take_while` built-in](https://freemarker.apache.org/docs/ref_builtins_sequence.html#ref_builtin_take_while)
(note that the condition is inverted compared to the `if`+`break` solution):

```text
<#-- Good solution: -->
<#list lines?take_while(line -> line != '') as line>
   ${line}<#sep><br>
</#list>
```





