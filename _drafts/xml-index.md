---
title: "XML"
image: /assets/images/xml/xml-index.jpg
permalink: /xml/xml-index.html
---

XML 1.0 was made a World Wide Web Consortium (W3C) Recommendation in 1998.
The W3C is dedicated to developing interoperable technologies.

## XML

<table>
    <thead>
    <tr>
        <th style="text-align: center;" rowspan="2">Overview</th>
        <th style="text-align: center;" colspan="2">Syntax</th>
        <th style="text-align: center;" rowspan="2">Namespace</th>
    </tr>
    <tr>
        <th style="text-align: center;">Basic</th>
        <th style="text-align: center;">Advanced</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>
{%
assign filtered_posts = site.xml |
where_exp: "item", "item.path contains 'xml/xml/overview/'" |
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
assign filtered_posts = site.xml |
where_exp: "item", "item.path contains 'xml/xml/syntax/basic/'" |
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
assign filtered_posts = site.xml |
where_exp: "item", "item.path contains 'xml/xml/syntax/advanced/'" |
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
assign filtered_posts = site.xml |
where_exp: "item", "item.path contains 'xml/xml/namespace/'" |
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


## Validation

在 IntelliJ IDEA 安装目录下 `lib/app.jar` 里，`standardSchemas` 路径下有许多 `.dtd` 和 `.xsd` 文件。

### Basic

<table>
    <thead>
    <tr>
        <th style="text-align: center;">Basic</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>
{%
assign filtered_posts = site.xml |
where_exp: "item", "item.path contains 'xml/validation/basic/'" |
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

### DTD

<table>
    <thead>
    <tr>
        <th style="text-align: center;">Basic</th>
        <th style="text-align: center;">Advanced</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>
{%
assign filtered_posts = site.xml |
where_exp: "item", "item.path contains 'xml/validation/dtd/basic/'" |
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
assign filtered_posts = site.xml |
where_exp: "item", "item.path contains 'xml/validation/dtd/advanced'" |
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

### XML Schema

<table>
    <thead>
    <tr>
        <th style="text-align: center;">学习</th>
        <th style="text-align: center;">解读</th>
        <th style="text-align: center;">基础</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>
{%
assign filtered_posts = site.xml |
where_exp: "item", "item.path contains 'xml/validation/xsd/learn/'" |
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
assign filtered_posts = site.xml |
where_exp: "item", "item.path contains 'xml/validation/xsd/explain/'" |
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
assign filtered_posts = site.xml |
where_exp: "item", "item.path contains 'xml/validation/xsd/intro/'" |
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

<hr/>

<table>
    <thead>
    <tr>
        <th style="text-align: center;">Type</th>
        <th style="text-align: center;">Middle</th>
        <th style="text-align: center;">Advanced</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>
{%
assign filtered_posts = site.xml |
where_exp: "item", "item.path contains 'xml/validation/xsd/type/'" |
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
assign filtered_posts = site.xml |
where_exp: "item", "item.path contains 'xml/validation/xsd/middle/'" |
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
assign filtered_posts = site.xml |
where_exp: "item", "item.path contains 'xml/validation/xsd/advanced/'" |
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

W3C

- XML
    - [XML 1.0](https://www.w3.org/TR/REC-xml/)
    - [XML 1.1](https://www.w3.org/TR/xml11/)
- XML Namespace
    - [Namespaces in XML 1.0](https://www.w3.org/TR/xml-names/)
    - [Namespaces in XML 1.1](https://www.w3.org/TR/xml-names11/)
- [XML Schema](https://www.w3.org/XML/Schema.html)
    - XML Schema 1.0
        - [Part 0: Primer](https://www.w3.org/TR/xmlschema-0/)
        - [Part 1: Structures](https://www.w3.org/TR/xmlschema-1/)
        - [Part 2: Datatypes](https://www.w3.org/TR/xmlschema-2/)
    - XML Schema 1.1
        - [Part 1: Structures](https://www.w3.org/TR/xmlschema11-1/)
        - [Part 2: Datatypes](https://www.w3.org/TR/xmlschema11-2/)
- [XPATH](https://www.w3.org/TR/xpath/)
- [XSLT](https://www.w3.org/TR/xslt/)
- [Document Object Model (DOM) Level 3 Load and Save Specification](https://www.w3.org/TR/DOM-Level-3-LS/)
- [Document Object Model (DOM) Level 3 Core Specification](https://www.w3.org/TR/DOM-Level-3-Core/)
- [SOAP](https://www.w3.org/TR/soap/)
- [WSDL](https://www.w3.org/TR/wsdl/)

w3schools

- [XML Tutorial](https://www.w3schools.com/xml/)
- [DTD Tutorial](https://www.w3schools.com/xml/xml_dtd_intro.asp)

一些DTD：

- [DTD for XML Schemas: Part 1: Structures](https://www.w3.org/2001/XMLSchema.dtd)
- [DTD for XML Schemas: Part 2: Datatypes](https://www.w3.org/2001/datatypes.dtd)
- [Extensible HTML version 1.0 Transitional DTD](https://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd)

一些XSD：

- [2009-XMLSchema.xsd](https://www.w3.org/2009/XMLSchema/XMLSchema.xsd)
- [2001-XMLSchema.xsd](https://www.w3.org/2001/XMLSchema.xsd)
- [spring-beans.xsd](https://www.springframework.org/schema/beans/spring-beans.xsd)

XML.COM

- [xml.com](https://www.xml.com/)
    - [Norman Walsh](https://www.xml.com/pub/au/44)


