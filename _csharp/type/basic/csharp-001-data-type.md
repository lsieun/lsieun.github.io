---
title: "数据类型"
sequence: "101"
---

The .NET type system is composed of classes, structures, enumerations, interfaces, and delegates.

- 数据类型
  - 值类型
    - 简单
      - 整数、实数
      - 字符
      - 布尔
    - 复杂
      - 结构
      - 枚举
  - 引用类型
    - 类
    - 接口
    - 数组
    - 委托

<table border="" cellpadding="5">
<tbody><tr> <th>C# Datatype</th> <th>Bytes</th>
<th>Range</th> </tr>

<tr> 
<td><span class="tt">byte</span></td> 
<td>1</td> 
<td>0 to 255</td> 
</tr>

<tr> 
<td><span class="tt">
<span style="tt">sbyte</span></span></td> 
<td>1</td> 
<td>-128 to 127</td>  
</tr>

<tr> 
<td><span class="tt">short</span></td> 
<td>2</td> 
<td>-32,768 to 32,767</td>    
</tr>

<tr> 
<td><span class="tt">
<span style="tt">ushort</span></span></td> 
<td>2</td> 
<td>0 to 65,535</td>     
</tr>

<tr> 
<td><span class="tt">int</span></td> 
<td>4</td> 
<td>-2 billion to 2 billion</td>   
</tr>

<tr> 
<td><span class="tt">
<span style="tt">uint</span></span></td> 
<td>4</td> 
<td>0 to 4 billion</td>   
</tr>

<tr> 
<td><span class="tt">long</span></td> 
<td>8</td> 
<td>-9 quintillion to 9 quintillion</td>   
</tr>

<tr> 
<td><span class="tt">
<span style="tt">ulong</span></span></td> 
<td>8</td> 
<td>0 to 18 quintillion</td>   
</tr>

<tr> 
<td><span class="tt">float</span></td> 
<td>4</td> 
<td> 7 significant digits<sup font="-1">1</sup> </td>    
</tr>

<tr> 
<td><span class="tt">double</span></td> 
<td>8</td> 
<td>15 significant digits<sup font="-1">2</sup></td>     
</tr>

<tr> 
<td><span class="tt">object</span></td> 
<td>4 byte address</td> 
<td>All C# Objects</td>  
</tr>

<tr> 
<td><span class="tt">char</span></td> 
<td>2</td> 
<td>Unicode characters</td>   
</tr>

<tr> 
<td><span class="tt">string</span></td> 
<td>4 byte address</td> 
<td>Length up to 2 billion bytes<sup font="-1">3</sup></td></tr>  
<tr> 
<td><span class="tt">decimal</span></td> 
<td>24</td> 
<td>28 to 29 significant digits<sup font="-1">4</sup></td></tr>



<tr> 
<td><span class="tt">bool</span></td> 
<td>1</td> 
<td>true, false<sup font="-1">5</sup></td> 
</tr>

<tr>
<td><span class="tt">DateTime</span><br>&nbsp; </td> 
<td>8<br>&nbsp;</td>
<td>0:00:00am 1/1/01 to<br> 11:59:59pm 12/31/9999</td></tr>


<tr>
<td><span class="tt">DateSpan</span><br>&nbsp;</td> 
<td>&nbsp;<br>&nbsp;</td>
<td>-10675199.02:48:05.4775808 to<br>
10675199.02:48:05.4775807<sup font="-1">6</sup> </td></tr>


</tbody></table>

## float和double

可以用`F`和`D`来作结尾。

## decimal

正确的写法：

```text
decimal pi = 3.14M;
```

或

```text
decimal pi = 3.14m;
```

如果省略掉`M`或`m`就会出错。

```csharp
class Program
{
    static void Main(string[] args)
    {
        decimal pi = 3.14M;
        Console.WriteLine(pi);
        Console.Read();
    }
}
```

## bool

```text
bool x = true;
```

## string

- string.Empty
