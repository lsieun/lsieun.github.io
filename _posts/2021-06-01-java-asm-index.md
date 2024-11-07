---
title: "Java ASM系列"
image: /assets/images/java/asm/brew-your-own-bytecode-with-asm.jpg
permalink: /java-asm/java-asm-index.html
---

ASM is an open-source java library for manipulating bytecode.  
Note that the scope of the ASM library is strictly limited to reading, writing, transforming and analyzing classes.
In particular the class loading process is out of scope.

## 系列一：Core API 篇

### 第一章 基础

<table>
    <thead>
    <tr>
        <th style="text-align: center;">快速开始</th>
        <th style="text-align: center;">简单介绍</th>
        <th style="text-align: center;">如何写代码</th>
        <th style="text-align: center;">设计模式</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>
{%
assign filtered_posts = site.java-asm |
where_exp: "item", "item.path contains 'java-asm/season01/ch01/quick-start/'" |
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
assign filtered_posts = site.java-asm |
where_exp: "item", "item.path contains 'java-asm/season01/ch01/basic/'" |
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
assign filtered_posts = site.java-asm |
where_exp: "item", "item.path contains 'java-asm/season01/ch01/how-to/'" |
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
assign filtered_posts = site.java-asm |
where_exp: "item", "item.path contains 'java-asm/season01/ch01/design-pattern/'" |
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

### 第二章 生成新的类

<table>
    <thead>
    <tr>
        <th style="text-align: center;">API</th>
        <th style="text-align: center;">重要概念</th>
        <th style="text-align: center;">示例</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>
{%
assign filtered_posts = site.java-asm |
where_exp: "item", "item.path contains 'java-asm/season01/ch02/api/'" |
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
assign filtered_posts = site.java-asm |
where_exp: "item", "item.path contains 'java-asm/season01/ch02/concept/'" |
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
assign filtered_posts = site.java-asm |
where_exp: "item", "item.path contains 'java-asm/season01/ch02/example/'" |
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

### 第三章 转换已有的类

<table>
    <thead>
    <tr>
        <th style="text-align: center;">API</th>
        <th style="text-align: center;">示例</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>
{%
assign filtered_posts = site.java-asm |
where_exp: "item", "item.path contains 'java-asm/season01/ch03/api/'" |
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
assign filtered_posts = site.java-asm |
where_exp: "item", "item.path contains 'java-asm/season01/ch03/example/'" |
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

### 第四章 工具类和常用类

<table>
    <thead>
    <tr>
        <th style="text-align: center;">Basic</th>
        <th style="text-align: center;">asm-util</th>
        <th style="text-align: center;">asm-commons</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>
{%
assign filtered_posts = site.java-asm |
where_exp: "item", "item.path contains 'java-asm/season01/ch04/basic/'" |
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
assign filtered_posts = site.java-asm |
where_exp: "item", "item.path contains 'java-asm/season01/ch04/util/'" |
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
assign filtered_posts = site.java-asm |
where_exp: "item", "item.path contains 'java-asm/season01/ch04/commons/'" |
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

## 系列二：专题篇

### 注解

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
assign filtered_posts = site.java-asm |
where_exp: "item", "item.path contains 'java-asm/season02/annotation/'" |
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

### 泛型

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
assign filtered_posts = site.java-asm |
where_exp: "item", "item.path contains 'java-asm/season02/generic/'" |
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

### 属性

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
assign filtered_posts = site.java-asm |
where_exp: "item", "item.path contains 'java-asm/season02/attribute/'" |
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

### 指令

<table>
    <thead>
    <tr>
        <th style="text-align: center;">JVM</th>
        <th style="text-align: center;">OPCODE</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>
{%
assign filtered_posts = site.java-asm |
where_exp: "item", "item.path contains 'java-asm/season02/instruction/jvm/'" |
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
assign filtered_posts = site.java-asm |
where_exp: "item", "item.path contains 'java-asm/season02/instruction/opcode/'" |
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

### 难点解析

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
assign filtered_posts = site.java-asm |
where_exp: "item", "item.path contains 'java-asm/season02/fun/'" |
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

## 系列三：Tree API 篇

### 第一章 基础

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
assign filtered_posts = site.java-asm |
where_exp: "item", "item.path contains 'java-asm/season03/ch01/'" |
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

### 第二章 生成新的类

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
assign filtered_posts = site.java-asm |
where_exp: "item", "item.path contains 'java-asm/season03/ch02/'" |
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

### 第三章 转换已有的类

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
assign filtered_posts = site.java-asm |
where_exp: "item", "item.path contains 'java-asm/season03/ch03/'" |
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

### 第四章 方法分析

<table>
    <thead>
    <tr>
        <th style="text-align: center;">Basic</th>
        <th style="text-align: center;">BasicValue</th>
        <th style="text-align: center;">SourceValue</th>
        <th style="text-align: center;">Other</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>
{%
assign filtered_posts = site.java-asm |
where_exp: "item", "item.path contains 'java-asm/season03/ch04/basic/'" |
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
assign filtered_posts = site.java-asm |
where_exp: "item", "item.path contains 'java-asm/season03/ch04/basic-value/'" |
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
assign filtered_posts = site.java-asm |
where_exp: "item", "item.path contains 'java-asm/season03/ch04/src-value/'" |
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
assign filtered_posts = site.java-asm |
where_exp: "item", "item.path contains 'java-asm/season03/ch04/other/'" |
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

## 系列四：代码模板

### 类层面

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
assign filtered_posts = site.java-asm |
where_exp: "item", "item.path contains 'java-asm/season04/ch01/'" |
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

### 方法层面

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
assign filtered_posts = site.java-asm |
where_exp: "item", "item.path contains 'java-asm/season04/ch02/'" |
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

### 其它

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
assign filtered_posts = site.java-asm |
where_exp: "item", "item.path contains 'java-asm/season04/ch03/'" |
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

### 文章

文章列表：

- 《[Java ASM系列一：Core API]({% link _java-asm/java-asm-season-01.md %})》主要是针对 ASM 当中 Core API 的内容进行展开。
- 《[Java ASM系列二：OPCODE]({% link _java-asm/java-asm-season-02.md %})》主要是针对 `MethodVisitor.visitXxxInsn()` 方法与
  200 个 opcode 之间的关系展开，同时也会涉及到 opcode 对于 Stack Frame 的影响。
- 《[Java ASM系列三：Tree API]({% link _java-asm/java-asm-season-03.md %})》主要是针对 ASM 当中 Tree API 的内容进行展开。
- 《[Java ASM系列四：代码模板]({% link _java-asm/java-asm-season-04.md %})》主要是整理 ASM
  代码，将常用的功能编写成“模板”，在使用时进行必要的修改，才能使用。
- 《[Java ASM系列五：源码分析]({% link _java-asm/java-asm-season-05.md %})》主要是对 ASM 源代码进行介绍。

## 资源

### 视频

视频列表：

| Website  | Core API(90个视频)                                                                                                    | OPCODE(41个视频)                                                                      | Tree API(52个视频)                                                                      |
|----------|--------------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------|
| 51CTO    | [Core API](https://edu.51cto.com/course/28517.html)                                                                | [OPCODE](https://edu.51cto.com/course/28870.html)                                  | [Tree API](https://edu.51cto.com/course/29459.html)                                  |
| Bilibili | [All In One = Core API + OPCODE + Tree API](https://space.bilibili.com/1321054247/channel/seriesdetail?sid=381716) |                                                                                    |                                                                                      |
| Youtube  | [Core API](https://www.youtube.com/playlist?list=PLMxK51MH9Tart9g54B7FsvAioqCGXLOS9)                               | [OPCODE](https://www.youtube.com/playlist?list=PLMxK51MH9TapRian5wb0Zqu0UJ9mUcF0q) | [Tree API](https://www.youtube.com/playlist?list=PLMxK51MH9Taoha4D5PDCNPnInxZIsSxNn) |

需要注意的一点，在B站当中，Java ASM 的系列一、二、三的视频放到了一个视频列表里：

- 编号为 001~090 的视频属于系列一
- 编号为 101~141 的视频属于系列二
- 编号为 201~252 的视频属于系列三

### 代码

代码仓库：

- [Gitee](https://gitee.com/lsieun/learn-java-asm)
- [Github](https://github.com/lsieun/learn-java-asm)

### 网盘下载

JavaASM系列（百度网盘）

- 链接：[https://pan.baidu.com/s/1P9_ja4VXYXw99cadRV97eg](https://pan.baidu.com/s/1P9_ja4VXYXw99cadRV97eg)
- 提取码：`fsnf`

JavaASM系列（阿里云盘）

- 链接：[https://www.aliyundrive.com/s/HKGRaTSFV3N](https://www.aliyundrive.com/s/HKGRaTSFV3N)
- 提取码: `dt64`

## 参考资料

ASM相关：

- [ASM官网](https://asm.ow2.io/)
- ASM源码：[GitLab](https://gitlab.ow2.org/asm/asm)
- ASM API文档：[javadoc](https://asm.ow2.io/javadoc/index.html)
- ASM使用手册：[英文版](https://asm.ow2.io/asm4-guide.pdf)、[中文版](https://www.yuque.com/mikaelzero/asm)
- [ASM mailing list](https://mail.ow2.org/wws/info/asm)
- 参考文献
    - 2002年，[ASM: a code manipulation tool to implement adaptable systems(PDF)](/assets/pdf/asm-eng.pdf)
    -
    2007年，[Using the ASM framework to implement common Java bytecode transformation patterns(PDF)](/assets/pdf/asm-transformations.pdf)

Oracle相关文档：

- [Oracle: The Java Virtual Machine Specification, Java SE 8 Edition](https://docs.oracle.com/javase/specs/jvms/se8/html/index.html)
    - [Chapter 2. The Structure of the Java Virtual Machine](https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-2.html)
    - [Chapter 4. The class File Format](https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-4.html)
    - [Chapter 6. The Java Virtual Machine Instruction Set](https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-6.html)
- [Oracle: The Java Virtual Machine Specification, Java SE 17 Edition](https://docs.oracle.com/javase/specs/jvms/se17/html/index.html)
- [Oracle: The Java Virtual Machine Specification, Java SE 21 Edition](https://docs.oracle.com/javase/specs/jvms/se21/html/index.html)

常用的字节码类库：

- [ASM](https://asm.ow2.io)
- [BCEL](https://commons.apache.org/proper/commons-bcel/)
- [Byte Buddy](https://bytebuddy.net)
- [Javassist](https://www.javassist.org/)

使用字节码进行代码分析：

- [Static Code Analysis in Java](https://www.baeldung.com/java-static-code-analysis-tutorial)

- [How to Compile Java to WASM (Web Assembly)](https://www.baeldung.com/java-wasm-web-assembly)
    - [CheerpJ](https://cheerpj.com/)

Java字节码交流群：

![QQ Group](/assets/images/contact/qq-group.jpg)