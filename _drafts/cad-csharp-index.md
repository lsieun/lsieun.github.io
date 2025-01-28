---
title: "AutoCAD Development With C#"
image: /assets/images/cad/introduction-to-autocad.jpg
permalink: /cad-csharp.html
---

I say, "programming has to be in you." Otherwise, you might as well quit.
You can't learn to drive a car from a book.
You can learn the mechanics of driving a car,
such as shifting gears, operating the turn signals, and even how to check the oil.
But gaining insight into traffic conditions, being able to operate the car subconsciously,
and the ability to anticipate to other road users will never happen
if you don't have the ability to drive properly.

## 二次开发 (C#)

<table>
    <thead>
    <tr>
        <th>Basic</th>
        <th>Quick Start</th>
        <th>API</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>
{%
assign filtered_posts = site.cad-csharp |
where_exp: "item", "item.url contains '/cad-csharp/basic/'" |
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
assign filtered_posts = site.cad-csharp |
where_exp: "item", "item.url contains '/cad-csharp/quick/'" |
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
assign filtered_posts = site.cad-csharp |
where_exp: "item", "item.url contains '/cad-csharp/api/'" |
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

## 文档

<table>
    <thead>
    <tr>
        <th>Basic</th>
        <th>Other</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>
{%
assign filtered_posts = site.cad-csharp |
where_exp: "item", "item.url contains '/cad-csharp/doc/basic/'" |
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
assign filtered_posts = site.cad-csharp |
where_exp: "item", "item.url contains '/cad-csharp/doc/other/'" |
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

## 图形

### 显示

<table>
    <thead>
    <tr>
        <th>窗口</th>
        <th>视图</th>
        <th>测量</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>
{%
assign filtered_posts = site.cad-csharp |
where_exp: "item", "item.url contains '/cad-csharp/display/window/'" |
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
assign filtered_posts = site.cad-csharp |
where_exp: "item", "item.url contains '/cad-csharp/display/view/'" |
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
assign filtered_posts = site.cad-csharp |
where_exp: "item", "item.url contains '/cad-csharp/display/measure/'" |
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

### 绘制

<table>
    <thead>
    <tr>
        <th>Basic</th>
        <th>Shape</th>
        <th>Text</th>
        <th>Manipulate</th>
        <th>Transform</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>
{%
assign filtered_posts = site.cad-csharp |
where_exp: "item", "item.url contains '/cad-csharp/draw/basic/'" |
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
assign filtered_posts = site.cad-csharp |
where_exp: "item", "item.url contains '/cad-csharp/draw/shape/'" |
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
assign filtered_posts = site.cad-csharp |
where_exp: "item", "item.url contains '/cad-csharp/draw/text/'" |
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
assign filtered_posts = site.cad-csharp |
where_exp: "item", "item.url contains '/cad-csharp/draw/manipulate/'" |
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
assign filtered_posts = site.cad-csharp |
where_exp: "item", "item.url contains '/cad-csharp/draw/transform/'" |
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


<table>
    <thead>
    <tr>
        <th>Table</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>
{%
assign filtered_posts = site.cad-csharp |
where_exp: "item", "item.url contains '/cad-csharp/table/'" |
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


### 样式

<table>
    <thead>
    <tr>
        <th>颜色</th>
        <th>文字样式</th>
        <th>线样式</th>
        <th>区域样式</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>
{%
assign filtered_posts = site.cad-csharp |
where_exp: "item", "item.url contains '/cad-csharp/style/color/'" |
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
assign filtered_posts = site.cad-csharp |
where_exp: "item", "item.url contains '/cad-csharp/style/text/'" |
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
assign filtered_posts = site.cad-csharp |
where_exp: "item", "item.url contains '/cad-csharp/style/line/'" |
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
assign filtered_posts = site.cad-csharp |
where_exp: "item", "item.url contains '/cad-csharp/style/region/'" |
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

## 用户交互

<table>
    <thead>
    <tr>
        <th>输入</th>
        <th>对话框</th>
        <th>选择集</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>
{%
assign filtered_posts = site.cad-csharp |
where_exp: "item", "item.url contains '/cad-csharp/interaction/input/'" |
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
assign filtered_posts = site.cad-csharp |
where_exp: "item", "item.url contains '/cad-csharp/interaction/dialog/'" |
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
assign filtered_posts = site.cad-csharp |
where_exp: "item", "item.url contains '/cad-csharp/interaction/selection/'" |
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

## 数据组织

<table>
    <thead>
    <tr>
        <th>Layer</th>
        <th>Block</th>
        <th>Group</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>
{%
assign filtered_posts = site.cad-csharp |
where_exp: "item", "item.url contains '/cad-csharp/layer/'" |
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
assign filtered_posts = site.cad-csharp |
where_exp: "item", "item.url contains '/cad-csharp/block/'" |
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
assign filtered_posts = site.cad-csharp |
where_exp: "item", "item.url contains '/cad-csharp/group/'" |
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

- [lsieun/DotNetARX](https://github.com/lsieun/DotNetARX)
- [lsieun/Lsieun.Cad](https://github.com/lsieun/Lsieun.Cad)

- [AutoCAD Documentation](https://aps.autodesk.com/developer/overview/autocad)
    - [AutoLISP Developer's Guide](https://help.autodesk.com/view/OARX/2024/ENU/)
    - [Managed .NET Developer's Guide](https://help.autodesk.com/view/OARX/2024/ENU/?guid=GUID-C3F3C736-40CF-44A0-9210-55F6A939B6F2)
    - [Managed .NET Reference Guide](https://help.autodesk.com/view/OARX/2024/ENU/?guid=OARX-ManagedRefGuide-Migration_Guide)
        - [Autodesk.AutoCAD.ApplicationServices Namespace](https://help.autodesk.com/view/OARX/2024/ENU/?guid=OARX-ManagedRefGuide-Autodesk_AutoCAD_ApplicationServices)
        - [Autodesk.AutoCAD.Colors Namespace](https://help.autodesk.com/view/OARX/2024/ENU/?guid=OARX-ManagedRefGuide-Autodesk_AutoCAD_Colors)
        - [Autodesk.AutoCAD.DatabaseServices Namespace](https://help.autodesk.com/view/OARX/2024/ENU/?guid=OARX-ManagedRefGuide-Autodesk_AutoCAD_DatabaseServices)
        - [Autodesk.AutoCAD.Geometry Namespace](https://help.autodesk.com/view/OARX/2024/ENU/?guid=OARX-ManagedRefGuide-Autodesk_AutoCAD_Geometry)
        - [Autodesk.AutoCAD.Runtime Namespace](https://help.autodesk.com/view/OARX/2024/ENU/?guid=OARX-ManagedRefGuide-Autodesk_AutoCAD_Runtime)
    - [2022](https://help.autodesk.com/view/OARX/2022/ENU/)
        - [Use Layers, Colors, and Linetypes (.NET)](https://help.autodesk.com/view/OARX/2022/ENU/?guid=GUID-758F50B8-A2A0-429C-AC31-88B3A2D1BBBC)
    - [DXF Format](https://help.autodesk.com/view/OARX/2024/ENU/?guid=GUID-235B22E0-A567-4CF6-92D3-38A2306D73F3)
- [明经 CAD 社区](http://www.mjtd.com/)
    - [AutoCAD.net/VB.net/C# 编程技术](http://bbs.mjtd.com/forum-33-1.html)

书籍：

- 《Start Programming in .NET for AutoCAD》
- 《深入浅出 AutoCAD.NET 二次开发》 李冠亿
- 《AUTOCAD VBA&VB.NET 开发基础与实例教程》 第 2 版
- 《AutoCAD Platform Customization - VBA》

GitHub:

- [Linq2Acad](https://github.com/wtertinek/Linq2Acad)
- [AutoCAD Code Pack](https://github.com/luanshixia/AutoCADCodePack)
- [MgdDbg](https://github.com/ADN-DevTech/MgdDbg)

视频：

- [闻人南 131](https://space.bilibili.com/2114059610)
    - [CAD 二次开发](https://space.bilibili.com/2114059610/channel/collectiondetail?sid=1113903)

博客：

- [Drive AutoCAD with Code](https://drive-cad-with-code.blogspot.com/)

文章：

- [AutoCAD C# 二次开发](https://www.cnblogs.com/gisoracle/p/2357925.html)
- [CAD 二次开发之命名空间](https://www.cnblogs.com/minhost/p/10863315.html)

系列文章

- [CAD 二次开发](https://blog.csdn.net/qq_41441896/category_9599478.html)
- [IFoxCAD 类库从入门到精通](https://www.kdocs.cn/l/cc6ZXSa0vMgD)

付费文章

- [CAD 工程二次开发总结](https://blog.csdn.net/qq_42539194/category_11254221.html)

特殊问题

- [cad.net dll 动态加载和卸载](https://www.cnblogs.com/JJBox/p/13833350.html)
- [NetLoadX 源码发布，NetApi 调试再不是问题](http://bbs.mjtd.com/forum.php?mod=viewthread&tid=113591&highlight=netloadx)

- [Reload Dll file without Restarting Autocad](https://forums.autodesk.com/t5/net/reload-dll-file-without-restarting-autocad/td-p/11358653)
- [How to update dll/plug-in without restarting AutoCAD?](https://stackoverflow.com/questions/28732962/how-to-update-dll-plug-in-without-restarting-autocad)
- [Topic: How to reload a .dll into AutoCAD without closing or restarting](http://www.theswamp.org/index.php?topic=57348.0)
- [Restart AutoCAD every time .DLL is recompiled](https://www.theswamp.org/index.php?topic=44434.0)
- [Load additional dll's](https://adndevblog.typepad.com/autocad/2012/04/load-additional-dlls.html)
- [.Net CAD调试不重启CAD(源码交流)](http://bbs.mjtd.com/thread-186211-1-1.html)


- Exploring AutoCAD .NET API
- Create Objects
- ManipulateObjects
- Explore Dictionaries
- User Interactions
- SelectionSets

- HelloAutoCAD
- DrawObjects
- LayersLineTypesAndStyles
- ManipulateObjects

- LineTypes
    - List all LineTypes
    - Load new LineType
    - Set Current LineType
    - Delete a LineType
    - Set LineType to an object
- Styles
    - List all TextStyles
    - Update Current TextStyle Font
    - Set Current TextStyle
    - Set TextStyle to an object

