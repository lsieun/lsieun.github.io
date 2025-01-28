---
title: "C#"
image: /assets/images/csharp/csharp-cover.png
permalink: /csharp.html
---

C# is a general-purpose, multi-paradigm programming language.

## Basic

<table>
    <thead>
    <tr>
        <th>Basic</th>
        <th>Grammar</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>
{%
assign filtered_posts = site.csharp |
where_exp: "item", "item.url contains '/csharp/basic/'" |
sort: "sequence"
%}
<ol>
    {% for post in filtered_posts %}
    {% assign num = post.sequence | abs %}
    <li>
        <a href="{{ post.url }}">{{ post.title }}</a>
    </li>
    {% endfor %}
</ol>
        </td>
        <td>
{%
assign filtered_posts = site.csharp |
where_exp: "item", "item.url contains '/csharp/grammar/'" |
sort: "sequence"
%}
<ol>
    {% for post in filtered_posts %}
    {% assign num = post.sequence | abs %}
    <li>
        <a href="{{ post.url }}">{{ post.title }}</a>
    </li>
    {% endfor %}
</ol>
        </td>
    </tr>
    </tbody>
</table>

### Type

<table>
    <thead>
    <tr>
        <th>Basic</th>
        <th>Number</th>
        <th>Text</th>
        <th>Time</th>
        <th>Array</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>
{%
assign filtered_posts = site.csharp |
where_exp: "item", "item.url contains '/csharp/type/basic/'" |
sort: "sequence"
%}
<ol>
    {% for post in filtered_posts %}
    {% assign num = post.sequence | abs %}
    <li>
        <a href="{{ post.url }}">{{ post.title }}</a>
    </li>
    {% endfor %}
</ol>
        </td>
        <td>
{%
assign filtered_posts = site.csharp |
where_exp: "item", "item.url contains '/csharp/type/number/'" |
sort: "sequence"
%}
<ol>
    {% for post in filtered_posts %}
    {% assign num = post.sequence | abs %}
    <li>
        <a href="{{ post.url }}">{{ post.title }}</a>
    </li>
    {% endfor %}
</ol>
        </td>
        <td>
{%
assign filtered_posts = site.csharp |
where_exp: "item", "item.url contains '/csharp/type/txt/'" |
sort: "sequence"
%}
<ol>
    {% for post in filtered_posts %}
    {% assign num = post.sequence | abs %}
    <li>
        <a href="{{ post.url }}">{{ post.title }}</a>
    </li>
    {% endfor %}
</ol>
        </td>
        <td>
{%
assign filtered_posts = site.csharp |
where_exp: "item", "item.url contains '/csharp/type/time/'" |
sort: "sequence"
%}
<ol>
    {% for post in filtered_posts %}
    {% assign num = post.sequence | abs %}
    <li>
        <a href="{{ post.url }}">{{ post.title }}</a>
    </li>
    {% endfor %}
</ol>
        </td>
        <td>
{%
assign filtered_posts = site.csharp |
where_exp: "item", "item.url contains '/csharp/type/array/'" |
sort: "sequence"
%}
<ol>
    {% for post in filtered_posts %}
    {% assign num = post.sequence | abs %}
    <li>
        <a href="{{ post.url }}">{{ post.title }}</a>
    </li>
    {% endfor %}
</ol>
        </td>
    </tr>
    </tbody>
</table>


---

<table>
    <thead>
    <tr>
        <th>Enum</th>
        <th>Annotation</th>
        <th>Generic</th>
        <th>Other</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>
{%
assign filtered_posts = site.csharp |
where_exp: "item", "item.url contains '/csharp/type/enum/'" |
sort: "sequence"
%}
<ol>
    {% for post in filtered_posts %}
    {% assign num = post.sequence | abs %}
    <li>
        <a href="{{ post.url }}">{{ post.title }}</a>
    </li>
    {% endfor %}
</ol>
        </td>
        <td>
{%
assign filtered_posts = site.csharp |
where_exp: "item", "item.url contains '/csharp/type/annotation/'" |
sort: "sequence"
%}
<ol>
    {% for post in filtered_posts %}
    {% assign num = post.sequence | abs %}
    <li>
        <a href="{{ post.url }}">{{ post.title }}</a>
    </li>
    {% endfor %}
</ol>
        </td>
        <td>
{%
assign filtered_posts = site.csharp |
where_exp: "item", "item.url contains '/csharp/type/generic/'" |
sort: "sequence"
%}
<ol>
    {% for post in filtered_posts %}
    {% assign num = post.sequence | abs %}
    <li>
        <a href="{{ post.url }}">{{ post.title }}</a>
    </li>
    {% endfor %}
</ol>
        </td>
        <td>
{%
assign filtered_posts = site.csharp |
where_exp: "item", "item.url contains '/csharp/type/other/'" |
sort: "sequence"
%}
<ol>
    {% for post in filtered_posts %}
    {% assign num = post.sequence | abs %}
    <li>
        <a href="{{ post.url }}">{{ post.title }}</a>
    </li>
    {% endfor %}
</ol>
        </td>
    </tr>
    </tbody>
</table>


### Class/Method

<table>
    <thead>
    <tr>
        <th>Class</th>
        <th>Method</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>
{%
assign filtered_posts = site.csharp |
where_exp: "item", "item.url contains '/csharp/class/'" |
sort: "sequence"
%}
<ol>
    {% for post in filtered_posts %}
    {% assign num = post.sequence | abs %}
    <li>
        <a href="{{ post.url }}">{{ post.title }}</a>
    </li>
    {% endfor %}
</ol>
        </td>
        <td>
{%
assign filtered_posts = site.csharp |
where_exp: "item", "item.url contains '/csharp/method/'" |
sort: "sequence"
%}
<ol>
    {% for post in filtered_posts %}
    {% assign num = post.sequence | abs %}
    <li>
        <a href="{{ post.url }}">{{ post.title }}</a>
    </li>
    {% endfor %}
</ol>
        </td>
    </tr>
    </tbody>
</table>

### Collection + Generic

<table>
    <thead>
    <tr>
        <th>Collection</th>
        <th>Generic</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>
{%
assign filtered_posts = site.csharp |
where_exp: "item", "item.url contains '/csharp/collection/'" |
sort: "sequence"
%}
<ol>
    {% for post in filtered_posts %}
    {% assign num = post.sequence | abs %}
    <li>
        <a href="{{ post.url }}">{{ post.title }}</a>
    </li>
    {% endfor %}
</ol>
        </td>
        <td>
{%
assign filtered_posts = site.csharp |
where_exp: "item", "item.url contains '/csharp/generic/'" |
sort: "sequence"
%}
<ol>
    {% for post in filtered_posts %}
    {% assign num = post.sequence | abs %}
    <li>
        <a href="{{ post.url }}">{{ post.title }}</a>
    </li>
    {% endfor %}
</ol>
        </td>
    </tr>
    </tbody>
</table>

## IO



<table>
    <thead>
    <tr>
        <th>Basic</th>
        <th>Directory</th>
        <th>File</th>
        <th>Stream</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>
{%
assign filtered_posts = site.csharp |
where_exp: "item", "item.url contains '/csharp/io/basic/'" |
sort: "sequence"
%}
<ol>
    {% for post in filtered_posts %}
    {% assign num = post.sequence | abs %}
    <li>
        <a href="{{ post.url }}">{{ post.title }}</a>
    </li>
    {% endfor %}
</ol>
        </td>
        <td>
{%
assign filtered_posts = site.csharp |
where_exp: "item", "item.url contains '/csharp/io/dir/'" |
sort: "sequence"
%}
<ol>
    {% for post in filtered_posts %}
    {% assign num = post.sequence | abs %}
    <li>
        <a href="{{ post.url }}">{{ post.title }}</a>
    </li>
    {% endfor %}
</ol>
        </td>
        <td>
{%
assign filtered_posts = site.csharp |
where_exp: "item", "item.url contains '/csharp/io/file/'" |
sort: "sequence"
%}
<ol>
    {% for post in filtered_posts %}
    {% assign num = post.sequence | abs %}
    <li>
        <a href="{{ post.url }}">{{ post.title }}</a>
    </li>
    {% endfor %}
</ol>
        </td>
        <td>
{%
assign filtered_posts = site.csharp |
where_exp: "item", "item.url contains '/csharp/io/stream/'" |
sort: "sequence"
%}
<ol>
    {% for post in filtered_posts %}
    {% assign num = post.sequence | abs %}
    <li>
        <a href="{{ post.url }}">{{ post.title }}</a>
    </li>
    {% endfor %}
</ol>
        </td>
    </tr>
    </tbody>
</table>

## Environment

{%
assign filtered_posts = site.csharp |
where_exp: "item", "item.url contains '/csharp/environment/'" |
sort: "sequence"
%}
<ol>
    {% for post in filtered_posts %}
    {% assign num = post.sequence | abs %}
    <li>
        <a href="{{ post.url }}">{{ post.title }}</a>
    </li>
    {% endfor %}
</ol>

## Interoperability

{%
assign filtered_posts = site.csharp |
where_exp: "item", "item.url contains '/csharp/interoperability/'" |
sort: "sequence"
%}
<ol>
    {% for post in filtered_posts %}
    {% assign num = post.sequence | abs %}
    <li>
        <a href="{{ post.url }}">{{ post.title }}</a>
    </li>
    {% endfor %}
</ol>

## WinForm

{%
assign filtered_posts = site.csharp |
where_exp: "item", "item.url contains '/csharp/winform/'" |
sort: "sequence"
%}
<ol>
    {% for post in filtered_posts %}
    {% assign num = post.sequence | abs %}
    <li>
        <a href="{{ post.url }}">{{ post.title }}</a>
    </li>
    {% endfor %}
</ol>

## Visual Studio

{%
assign filtered_posts = site.csharp |
where_exp: "item", "item.url contains '/csharp/visual-studio/'" |
sort: "sequence"
%}
<ol>
    {% for post in filtered_posts %}
    {% assign num = post.sequence | abs %}
    <li>
        <a href="{{ post.url }}">{{ post.title }}</a>
    </li>
    {% endfor %}
</ol>

## Assembly

<table>
    <thead>
    <tr>
        <th>Basic</th>
        <th>Private Assembly</th>
        <th>Shared Assembly</th>
        <th>Config</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>
{%
assign filtered_posts = site.csharp |
where_exp: "item", "item.url contains '/csharp/assembly/basic/'" |
sort: "sequence"
%}
<ol>
    {% for post in filtered_posts %}
    {% assign num = post.sequence | abs %}
    <li>
        <a href="{{ post.url }}">{{ post.title }}</a>
    </li>
    {% endfor %}
</ol>
        </td>
        <td>
{%
assign filtered_posts = site.csharp |
where_exp: "item", "item.url contains '/csharp/assembly/private/'" |
sort: "sequence"
%}
<ol>
    {% for post in filtered_posts %}
    {% assign num = post.sequence | abs %}
    <li>
        <a href="{{ post.url }}">{{ post.title }}</a>
    </li>
    {% endfor %}
</ol>
        </td>
        <td>
{%
assign filtered_posts = site.csharp |
where_exp: "item", "item.url contains '/csharp/assembly/shared/'" |
sort: "sequence"
%}
<ol>
    {% for post in filtered_posts %}
    {% assign num = post.sequence | abs %}
    <li>
        <a href="{{ post.url }}">{{ post.title }}</a>
    </li>
    {% endfor %}
</ol>
        </td>
        <td>
{%
assign filtered_posts = site.csharp |
where_exp: "item", "item.url contains '/csharp/assembly/config/'" |
sort: "sequence"
%}
<ol>
    {% for post in filtered_posts %}
    {% assign num = post.sequence | abs %}
    <li>
        <a href="{{ post.url }}">{{ post.title }}</a>
    </li>
    {% endfor %}
</ol>
        </td>
    </tr>
    </tbody>
</table>

### Attribute

<table>
    <thead>
    <tr>
        <th>Reflection</th>
        <th>Attribute</th>
        <th>Format</th>
        <th>Code Example</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>
{%
assign filtered_posts = site.csharp |
where_exp: "item", "item.url contains '/csharp/assembly/reflection/'" |
sort: "sequence"
%}
<ol>
    {% for post in filtered_posts %}
    {% assign num = post.sequence | abs %}
    <li>
        <a href="{{ post.url }}">{{ post.title }}</a>
    </li>
    {% endfor %}
</ol>
        </td>
        <td>
{%
assign filtered_posts = site.csharp |
where_exp: "item", "item.url contains '/csharp/assembly/attribute/'" |
sort: "sequence"
%}
<ol>
    {% for post in filtered_posts %}
    {% assign num = post.sequence | abs %}
    <li>
        <a href="{{ post.url }}">{{ post.title }}</a>
    </li>
    {% endfor %}
</ol>
        </td>
        <td>
{%
assign filtered_posts = site.csharp |
where_exp: "item", "item.url contains '/csharp/assembly/format/'" |
sort: "sequence"
%}
<ol>
    {% for post in filtered_posts %}
    {% assign num = post.sequence | abs %}
    <li>
        <a href="{{ post.url }}">{{ post.title }}</a>
    </li>
    {% endfor %}
</ol>
        </td>
        <td>
{%
assign filtered_posts = site.csharp |
where_exp: "item", "item.url contains '/csharp/assembly/code/'" |
sort: "sequence"
%}
<ol>
    {% for post in filtered_posts %}
    {% assign num = post.sequence | abs %}
    <li>
        <a href="{{ post.url }}">{{ post.title }}</a>
    </li>
    {% endfor %}
</ol>
        </td>
    </tr>
    </tbody>
</table>

### AppDomain

<table>
    <thead>
    <tr>
        <th>Application Domains</th>
        <th>New Domain</th>
        <th>Assembly</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>
{%
assign filtered_posts = site.csharp |
where_exp: "item", "item.url contains '/csharp/app-domain/basic/'" |
sort: "sequence"
%}
<ol>
    {% for post in filtered_posts %}
    {% assign num = post.sequence | abs %}
    <li>
        <a href="{{ post.url }}">{{ post.title }}</a>
    </li>
    {% endfor %}
</ol>
        </td>
        <td>
{%
assign filtered_posts = site.csharp |
where_exp: "item", "item.url contains '/csharp/app-domain/new/'" |
sort: "sequence"
%}
<ol>
    {% for post in filtered_posts %}
    {% assign num = post.sequence | abs %}
    <li>
        <a href="{{ post.url }}">{{ post.title }}</a>
    </li>
    {% endfor %}
</ol>
        </td>
        <td>
{%
assign filtered_posts = site.csharp |
where_exp: "item", "item.url contains '/csharp/app-domain/assembly/'" |
sort: "sequence"
%}
<ol>
    {% for post in filtered_posts %}
    {% assign num = post.sequence | abs %}
    <li>
        <a href="{{ post.url }}">{{ post.title }}</a>
    </li>
    {% endfor %}
</ol>
        </td>
    </tr>
    </tbody>
</table>

### Dynamic Assemblies

<table>
    <thead>
    <tr>
        <th>Dynamic Assemblies</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>
{%
assign filtered_posts = site.csharp |
where_exp: "item", "item.url contains '/csharp/assembly/cil/'" |
sort: "sequence"
%}
<ol>
    {% for post in filtered_posts %}
    {% assign num = post.sequence | abs %}
    <li>
        <a href="{{ post.url }}">{{ post.title }}</a>
    </li>
    {% endfor %}
</ol>
        </td>
    </tr>
    </tbody>
</table>

## Reference

- [lsieun/learn-csharp-type](https://github.com/lsieun/learn-csharp-type)
- [lsieun/learn-csharp-io](https://github.com/lsieun/learn-csharp-io)
- [lsieun/learn-csharp-assembly](https://github.com/lsieun/learn-csharp-assembly)

- [.NET API](https://learn.microsoft.com/en-us/dotnet/api/)
- [.NET Framework tools](https://learn.microsoft.com/en-us/dotnet/framework/tools/)
- [C# Tutorials](https://www.tutorialsteacher.com/csharp)

C# 语言视频

- [C# 从入门到精通](https://www.bilibili.com/video/BV1EK4y1b7ux/)
    - 136 Windows 打印技术
    - p139 注册表基础
    - p140 在 C# 中操作注册表

- [传智黑马 C# 基础加强](https://www.bilibili.com/video/BV1ju411Q7kU)
    - p20 sealed 关键字
    - p40 params 关键字
    - p41 ref 与 out 参数
    - p86 大文件拷贝
- [.Net 基础视频教程 + 项目实战播放器项目](https://www.bilibili.com/video/BV127411q7gV)
    - p263 窗体传值
- [传智播客赵剑宇的 C# 基础完整版 1](https://www.bilibili.com/video/BV1Vu411v7zr)
- [传智播客赵剑宇的 C# 基础完整版 2](https://www.bilibili.com/video/BV1t94y1d7jU)

### WinForm

- [C# 窗体经典教程](https://www.bilibili.com/video/BV11f4y1D7CA/)

- [C#Chart 控件画折线图的使用](https://www.bilibili.com/video/BV1B64y117Yr) 40 分钟，感觉很有用，没有看呢
- [c#winform chart 控件实现上位机看板监控](https://www.bilibili.com/video/BV13y4y1V7Y3)
- [上位机开发 25- 图表](https://www.bilibili.com/video/BV1vf4y1L7Wz)

- [winformchart1](https://www.bilibili.com/video/BV1TA411B7Gc)
- [winformchart1_2](https://www.bilibili.com/video/BV1kg4y1i7AU)
- [WinForm Chart](https://search.bilibili.com/all?keyword=WinForm+Chart)

- [C# WinForm 入门课程 _ 图形界面 GUI 编程 _62 集视频教程](https://www.bilibili.com/video/BV1d7411F7PG)
- [C# WinForm 高级教程 _ 图形界面 GUI 开发](https://www.bilibili.com/video/BV1Nc411h7rE/)


- [C#-Winform- 如何创建一个带进度显示的启动界面 -Splash Screen](https://www.bilibili.com/video/BV1E64y1B7Sh)
- [C# winform 扁平化界面,管理系统演示(附源码)](https://www.bilibili.com/video/BV1Hy4y1h7KE)
- [C#Winform 图表控件应用详解](https://www.bilibili.com/video/BV1rp4y1s76g)

- [Aspose.pdf无水印版下载（10.1 .Net，老版本亲测可用 ）](https://jhrs.com/2022/44982.html)

### 打包

- [C# 编译的 exe 程序如何生成安装包](https://www.bilibili.com/video/BV1xb4y1o7gh/)

