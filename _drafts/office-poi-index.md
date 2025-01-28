---
title: "Office POI"
image: /assets/images/apache-poi/apache-poi-cover.png
permalink: /poi.html
---

Apache POI is a popular API that allows programmers to create, modify, and display MS-Office files using Java programs.

POI 是 Poor Obfuscation Implementation 的缩写。

Apache POI 是一个开源的 Java 库，用于处理 Microsoft Office 格式的文件，包括 Excel、Word 和 PowerPoint 等文件。
POI 提供了一组 API，可以读取、写入和修改这些文件的内容。
它是基于 Apache 软件基金会的项目，旨在使 Java 开发人员能够轻松地与 Office 文件进行交互。

## Common

{%
assign filtered_posts = site.office |
where_exp: "item", "item.url contains '/office/poi/common/'" |
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

## Apache POI

### Basic

{%
assign filtered_posts = site.office |
where_exp: "item", "item.url contains '/office/poi/java/basic/'" |
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

### Excel

<table>
    <thead>
    <tr>
        <th>Basic</th>
        <th>Cell Value</th>
        <th>Style</th>
        <th>MISC</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>
{%
assign filtered_posts = site.office |
where_exp: "item", "item.url contains '/office/poi/java/excel/basic/'" |
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
assign filtered_posts = site.office |
where_exp: "item", "item.url contains '/office/poi/java/excel/cell-value/'" |
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
assign filtered_posts = site.office |
where_exp: "item", "item.url contains '/office/poi/java/excel/style/'" |
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
assign filtered_posts = site.office |
where_exp: "item", "item.url contains '/office/poi/java/excel/misc/'" |
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

### Word

{%
assign filtered_posts = site.office |
where_exp: "item", "item.url contains '/office/poi/java/word/'" |
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

## NPOI

### Excel

<table>
    <thead>
    <tr>
        <th>Basic</th>
        <th>Advanced</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>
{%
assign filtered_posts = site.office |
where_exp: "item", "item.url contains '/office/poi/csharp/excel/'" |
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
        <td></td>
    </tr>
    </tbody>
</table>



## Reference

- [learn-apache-poi](https://github.com/lsieun/learn-apache-poi)
- [lsieun/learn-csharp-npoi](https://github.com/lsieun/learn-csharp-npoi)

<table>
    <thead>
    <tr>
        <th>Apache POI</th>
        <th>NPOI</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>
            <ul>
                <li><a href="https://poi.apache.org/">Apache POI</a></li>
                <li>
                    Baeldung
                    <a href="https://www.baeldung.com/tag/excel">Tag: Excel</a>
                    <a href="https://github.com/eugenp/tutorials/tree/master/apache-poi">Code</a>
                </li>
                <li><a href="https://www.javatpoint.com/apache-poi-tutorial">JavaTPoint</a></li>
                <li><a href="https://howtodoinjava.com/java/library/readingwriting-excel-files-in-java-poi-tutorial/">Apache POI – Read and Write Excel File in Java</a></li>
            </ul>
        </td>
        <td>
            <ul>
                <li><a href="https://github.com/nissl-lab/npoi">NPOI</a></li>
                <li><a href="https://github.com/nissl-lab/npoi/wiki/Getting-Started-with-NPOI">Getting Started with NPOI</a></li>
                <li><a href="https://github.com/nissl-lab/npoi-examples">NPOI Examples</a></li>
                <li><a href="https://www.cnblogs.com/hippieZhou/p/15221576.html">NPOI 操作 Excel 从入门到放弃（以 .xlsx 为例）</a></li>
                <li><a href=""></a></li>
            </ul>
        </td>
    </tr>
    </tbody>
</table>
