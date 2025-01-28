---
title: "Java ByteBuddy"
image: /assets/images/bytebuddy/byte-buddy-cover.png
permalink: /bytebuddy/bytebuddy-index.html
---

ByteBuddy is a library for generating Java classes dynamically at run-time.

![](/assets/images/bytebuddy/bytebuddy-overview.svg)

## 系列一：基础篇

### 第一章 快速入门

<table>
    <thead>
    <tr>
        <th style="text-align: center;">教程（快速开始）</th>
        <th style="text-align: center;">解读：核心概念</th>
        <th style="text-align: center;">常用语句</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>
{%
assign filtered_posts = site.bytebuddy |
where_exp: "item", "item.path contains 'bytebuddy/rudimentary/ch01/basic/'" |
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
assign filtered_posts = site.bytebuddy |
where_exp: "item", "item.path contains 'bytebuddy/rudimentary/ch01/concept/'" |
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
assign filtered_posts = site.bytebuddy |
where_exp: "item", "item.path contains 'bytebuddy/rudimentary/common-code/'" |
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
        <th style="text-align: center;">解读：ByteBuddy配置</th>
        <th style="text-align: center;">解读：DynamicType配置</th>
        <th style="text-align: center;">解读：其它</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>
{%
assign filtered_posts = site.bytebuddy |
where_exp: "item", "item.path contains 'bytebuddy/rudimentary/ch01/buddy-config/'" |
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
assign filtered_posts = site.bytebuddy |
where_exp: "item", "item.path contains 'bytebuddy/rudimentary/ch01/dynamic-type-config/'" |
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
assign filtered_posts = site.bytebuddy |
where_exp: "item", "item.path contains 'bytebuddy/rudimentary/ch01/other/'" |
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

### 第二章 生成类型

<table>
    <thead>
    <tr>
        <th style="text-align: center;">生成类</th>
        <th style="text-align: center;">生成方法体</th>
        <th style="text-align: center;">生成其它类型</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>
{%
assign filtered_posts = site.bytebuddy |
where_exp: "item", "item.path contains 'bytebuddy/rudimentary/ch02-generation/clazz/'" |
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
assign filtered_posts = site.bytebuddy |
where_exp: "item", "item.path contains 'bytebuddy/rudimentary/ch02-generation/implementation/'" |
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
assign filtered_posts = site.bytebuddy |
where_exp: "item", "item.path contains 'bytebuddy/rudimentary/ch02-generation/types/'" |
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

### 第三章 查看类型

<table>
    <thead>
    <tr>
        <th style="text-align: center;">基础</th>
        <th style="text-align: center;">TypePool</th>
        <th style="text-align: center;">匹配</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>
{%
assign filtered_posts = site.bytebuddy |
where_exp: "item", "item.path contains 'bytebuddy/rudimentary/ch03-analysis/basic/'" |
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
assign filtered_posts = site.bytebuddy |
where_exp: "item", "item.path contains 'bytebuddy/rudimentary/ch03-analysis/pool/'" |
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
assign filtered_posts = site.bytebuddy |
where_exp: "item", "item.path contains 'bytebuddy/rudimentary/ch03-analysis/match/'" |
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

### 第四章 修改类型

#### 基础

<table>
    <thead>
    <tr>
        <th style="text-align: center;">概念</th>
        <th style="text-align: center;">其它</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>
{%
assign filtered_posts = site.bytebuddy |
where_exp: "item", "item.path contains 'bytebuddy/rudimentary/ch04-transform/basic/'" |
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
assign filtered_posts = site.bytebuddy |
where_exp: "item", "item.path contains 'bytebuddy/rudimentary/ch04-transform/asm/'" |
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

#### Advice

<table>
    <thead>
    <tr>
        <th style="text-align: center;">学习</th>
        <th style="text-align: center;">解读</th>
        <th style="text-align: center;">拾遗</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>
{%
assign filtered_posts = site.bytebuddy |
where_exp: "item", "item.path contains 'bytebuddy/rudimentary/ch04-transform/advice/learn/'" |
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
assign filtered_posts = site.bytebuddy |
where_exp: "item", "item.path contains 'bytebuddy/rudimentary/ch04-transform/advice/explain/'" |
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
assign filtered_posts = site.bytebuddy |
where_exp: "item", "item.path contains 'bytebuddy/rudimentary/ch04-transform/advice/other/'" |
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
        <th style="text-align: center;" rowspan="2">注解：方法（代码位置）</th>
        <th style="text-align: center;" colspan="3">注解：方法参数（参数值映射）</th>
    </tr>
    <tr>
        <th style="text-align: center;">类层面</th>
        <th style="text-align: center;">字段层面</th>
        <th style="text-align: center;">方法层面</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>
{%
assign filtered_posts = site.bytebuddy |
where_exp: "item", "item.path contains 'bytebuddy/rudimentary/ch04-transform/advice/annotation/basic/'" |
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
assign filtered_posts = site.bytebuddy |
where_exp: "item", "item.path contains 'bytebuddy/rudimentary/ch04-transform/advice/annotation/clazz/'" |
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
assign filtered_posts = site.bytebuddy |
where_exp: "item", "item.path contains 'bytebuddy/rudimentary/ch04-transform/advice/annotation/field/'" |
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
assign filtered_posts = site.bytebuddy |
where_exp: "item", "item.path contains 'bytebuddy/rudimentary/ch04-transform/advice/annotation/method/'" |
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

#### MethodDelegation

<table>
    <thead>
    <tr>
        <th style="text-align: center;">学习</th>
        <th style="text-align: center;">解读</th>
        <th style="text-align: center;">拾遗</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>
{%
assign filtered_posts = site.bytebuddy |
where_exp: "item", "item.path contains 'bytebuddy/rudimentary/ch04-transform/delegation/learn/'" |
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
assign filtered_posts = site.bytebuddy |
where_exp: "item", "item.path contains 'bytebuddy/rudimentary/ch04-transform/delegation/explain/'" |
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
assign filtered_posts = site.bytebuddy |
where_exp: "item", "item.path contains 'bytebuddy/rudimentary/ch04-transform/delegation/other/'" |
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
        <th style="text-align: center;" rowspan="2">注解：方法</th>
        <th style="text-align: center;" colspan="5">注解：方法参数</th>
    </tr>
    <tr>
        <th style="text-align: center;">类层面</th>
        <th style="text-align: center;">字段层面</th>
        <th style="text-align: center;">方法层面</th>
        <th style="text-align: center;">Hierarchy</th>
        <th style="text-align: center;">其它</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>
{%
assign filtered_posts = site.bytebuddy |
where_exp: "item", "item.path contains 'bytebuddy/rudimentary/ch04-transform/delegation/annotation/basic/'" |
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
assign filtered_posts = site.bytebuddy |
where_exp: "item", "item.path contains 'bytebuddy/rudimentary/ch04-transform/delegation/annotation/clazz/'" |
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
assign filtered_posts = site.bytebuddy |
where_exp: "item", "item.path contains 'bytebuddy/rudimentary/ch04-transform/delegation/annotation/field/'" |
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
assign filtered_posts = site.bytebuddy |
where_exp: "item", "item.path contains 'bytebuddy/rudimentary/ch04-transform/delegation/annotation/method/'" |
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
assign filtered_posts = site.bytebuddy |
where_exp: "item", "item.path contains 'bytebuddy/rudimentary/ch04-transform/delegation/annotation/hierarchy/'" |
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
assign filtered_posts = site.bytebuddy |
where_exp: "item", "item.path contains 'bytebuddy/rudimentary/ch04-transform/delegation/annotation/other/'" |
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

### Maven Build

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
assign filtered_posts = site.bytebuddy |
where_exp: "item", "item.path contains 'bytebuddy/rudimentary/maven-build/'" |
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
        <th style="text-align: center;">注解::基本</th>
        <th style="text-align: center;">注解::读取</th>
        <th style="text-align: center;">注解::创建</th>
        <th style="text-align: center;">注解::修改</th>
        <th style="text-align: center;">注解::其他</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>
{%
assign filtered_posts = site.bytebuddy |
where_exp: "item", "item.path contains 'bytebuddy/theme/annotation/basic/'" |
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
assign filtered_posts = site.bytebuddy |
where_exp: "item", "item.path contains 'bytebuddy/theme/annotation/read/'" |
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
assign filtered_posts = site.bytebuddy |
where_exp: "item", "item.path contains 'bytebuddy/theme/annotation/create/'" |
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
assign filtered_posts = site.bytebuddy |
where_exp: "item", "item.path contains 'bytebuddy/theme/annotation/modify/'" |
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
assign filtered_posts = site.bytebuddy |
where_exp: "item", "item.path contains 'bytebuddy/theme/annotation/other/'" |
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
        <th style="text-align: center;">泛型</th>
        <th style="text-align: center;">泛型::读取</th>
        <th style="text-align: center;">泛型::生成</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>
{%
assign filtered_posts = site.bytebuddy |
where_exp: "item", "item.path contains 'bytebuddy/theme/generic/basic/'" |
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
assign filtered_posts = site.bytebuddy |
where_exp: "item", "item.path contains 'bytebuddy/theme/generic/read/'" |
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
assign filtered_posts = site.bytebuddy |
where_exp: "item", "item.path contains 'bytebuddy/theme/generic/create/'" |
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

### 修改 JDK 的内置类

### ByteCode

<table>
    <thead>
    <tr>
        <th style="text-align: center;">instruction</th>
        <th style="text-align: center;">opcode</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>
{%
assign filtered_posts = site.bytebuddy |
where_exp: "item", "item.path contains 'bytebuddy/theme/bytecode/instruction/'" |
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
assign filtered_posts = site.bytebuddy |
where_exp: "item", "item.path contains 'bytebuddy/theme/bytecode/opcode/'" |
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

## 系列三：Agent篇

For the creation of Java agents, Byte Buddy offers a convenience API implemented by
the `net.bytebuddy.agent.builder.AgentBuilder`.
The API wraps a `ByteBuddy` instance and offers agent-specific configuration opportunities by integrating against the
instrument.Instrumentation API.

{%
assign filtered_posts = site.bytebuddy |
where_exp: "item", "item.path contains 'bytebuddy/agent/'" |
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

- [ ] `AgentBuilder.Transformer` 与 `java.lang.instrument.ClassFileTransformer` 是如何结合到一起的呢？

## 系列四：源码篇

### Implementation

<table>
    <thead>
    <tr>
        <th style="text-align: center;">概览</th>
        <th style="text-align: center;">Basic</th>
        <th style="text-align: center;">ByteCode</th>
        <th style="text-align: center;">设计模式</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>
{%
assign filtered_posts = site.bytebuddy |
where_exp: "item", "item.path contains 'bytebuddy/src/implementation/overview/'" |
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
assign filtered_posts = site.bytebuddy |
where_exp: "item", "item.path contains 'bytebuddy/src/implementation/basic/'" |
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
assign filtered_posts = site.bytebuddy |
where_exp: "item", "item.path contains 'bytebuddy/src/implementation/bytecode/'" |
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
assign filtered_posts = site.bytebuddy |
where_exp: "item", "item.path contains 'bytebuddy/pattern/'" |
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

## API 参考

<table>
    <thead>
    <tr>
        <th style="text-align: center;">Basic</th>
        <th style="text-align: center;">ASM</th>
        <th style="text-align: center;">scaffold</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>
{%
assign filtered_posts = site.bytebuddy |
where_exp: "item", "item.path contains 'bytebuddy/api/basic/'" |
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
assign filtered_posts = site.bytebuddy |
where_exp: "item", "item.path contains 'bytebuddy/api/asm/'" |
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
assign filtered_posts = site.bytebuddy |
where_exp: "item", "item.path contains 'bytebuddy/api/scaffold/'" |
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

### description

<table>
    <thead>
    <tr>
        <th style="text-align: center;">Description::Basic</th>
        <th style="text-align: center;">Description::Type</th>
        <th style="text-align: center;">Description::Member</th>
        <th style="text-align: center;">Description::Other</th>
        <th style="text-align: center;">Matcher</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>
{%
assign filtered_posts = site.bytebuddy |
where_exp: "item", "item.path contains 'bytebuddy/api/description/basic/'" |
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
assign filtered_posts = site.bytebuddy |
where_exp: "item", "item.path contains 'bytebuddy/api/description/type/'" |
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
assign filtered_posts = site.bytebuddy |
where_exp: "item", "item.path contains 'bytebuddy/api/description/member/'" |
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
assign filtered_posts = site.bytebuddy |
where_exp: "item", "item.path contains 'bytebuddy/api/description/other/'" |
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
assign filtered_posts = site.bytebuddy |
where_exp: "item", "item.path contains 'bytebuddy/api/matcher/'" |
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

### implementation

<table>
    <thead>
    <tr>
        <th style="text-align: center;">Implementation</th>
        <th style="text-align: center;">bytecode</th>
        <th style="text-align: center;">auxiliary</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>
{%
assign filtered_posts = site.bytebuddy |
where_exp: "item", "item.path contains 'bytebuddy/api/implementation/basic/'" |
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
assign filtered_posts = site.bytebuddy |
where_exp: "item", "item.path contains 'bytebuddy/api/implementation/bytecode/'" |
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
assign filtered_posts = site.bytebuddy |
where_exp: "item", "item.path contains 'bytebuddy/api/implementation/auxiliary/'" |
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

- [ByteBuddy](https://bytebuddy.net/)
    - [ByteBuddy Tutorial](https://bytebuddy.net/#/tutorial)
    - [Byte Buddy release notes](https://github.com/raphw/byte-buddy/blob/master/release-notes.md)
    - [question](https://github.com/raphw/byte-buddy/labels/question)
    - [Google Group](https://groups.google.com/g/byte-buddy)
- [GitHub: byte-buddy](https://github.com/raphw/byte-buddy)
    - [AdviceLocalValueTest.java](https://github.com/raphw/byte-buddy/blob/master/byte-buddy-dep/src/test/java/net/bytebuddy/asm/AdviceLocalValueTest.java)
- [Stack Overflow: byte-buddy](https://stackoverflow.com/questions/tagged/byte-buddy)
- [The Java Virtual Machine Specification 21](/static/jvms/se21/index.html)

电子书：

- 《Java Interceptor Development with ByteBuddy: Fundamental》 Eric Fong, 2020-10

一定要解决的问题

- [How to restore the modified bytecode?](https://github.com/raphw/byte-buddy/issues/1064)

TO Read

- [Easily Create Java Agents with Byte Buddy](https://www.infoq.com/articles/Easily-Create-Java-Agents-with-ByteBuddy/)
- [探秘 Java：用 ByteBuddy 编写一个简单的 Agent](https://www.swzgeek.com/archives/bytebuddy-javaagent)
- [Runtime Code Generation with Byte Buddy](https://blogs.oracle.com/javamagazine/post/runtime-code-generation-with-byte-buddy)
- [Java Code Manipulation with Byte Buddy](https://sergiomartinrubio.com/articles/java-code-manipulation-with-byte-buddy/)
- [bytebuddy 源码解析](https://www.codenong.com/cs106594057/)
- [JAVA 动态字节码实现方式对比之 Byte Buddy](https://segmentfault.com/a/1190000039808891)
- [bytebuddy 简单入门](https://blog.csdn.net/wanxiaoderen/article/details/106544773)
- [ByteBuddy（史上最全）](https://www.cnblogs.com/crazymakercircle/p/16635330.html)
- [Using Byte Buddy for proxy creation](https://mydailyjava.blogspot.com/2022/02/using-byte-buddy-for-proxy-creation.html)
- [ByteBuddy: how to add local variable across enter/exit when transforming a method](https://stackoverflow.com/questions/57167773/bytebuddy-how-to-add-local-variable-across-enter-exit-when-transforming-a-metho)

- [bytebuddy 核心教程](https://www.bilibili.com/video/BV1G24y1a7bd/)
- [bytebuddy 进阶实战 - skywalking agent 可插拔式架构实现](https://www.bilibili.com/video/BV1Jv4y1a7Kw/)

Baeldung

- [A Guide to Byte Buddy](https://www.baeldung.com/byte-buddy)

- [GitHub: Rafael Winterhalter](https://github.com/raphw)
- [The Java memory model explained, Rafael Winterhalter](https://www.youtube.com/watch?v=qADk_tj4wY8&ab_channel=BulgarianJavaUserGroup)
- [Java Memory Management Garbage Collection, JVM Tuning, and Spotting Memory Leaks](https://www.youtube.com/watch?v=W4SvLYU9H1I&ab_channel=AlphaTutorials-Programming)

Agent

- [When using Advice of byte buddy, Exception of java.lang.NoClassDefFoundError is throwed](https://stackoverflow.com/questions/53625549/when-using-advice-of-byte-buddy-exception-of-java-lang-noclassdeffounderror-is)
- [Java Agents with Byte-Buddy](https://shehan-a-perera.medium.com/java-agents-with-byte-buddy-93185305c9e9)
- [Monkey-patching in Java](https://itnext.io/monkey-patching-in-java-dde4122df84c)
- [How to override private method in Java](https://medium.com/@mark.andreev/how-to-rewrite-private-method-in-java-4e7c0e0ec167)
- [Comparing Different Ways to Build Proxies In Java](https://levelup.gitconnected.com/comparing-different-ways-to-build-proxies-in-java-2d09ae9c233a)
- [ByteBuddy杂谈](https://www.bilibili.com/video/BV13m42137Ct/)

Spring Boot

- [Instrumentation of Spring Boot application with Byte Buddy](https://medium.com/@jakubhal/instrumentation-of-spring-boot-application-with-byte-buddy-bbd28619b7c)
- [用 Byte Buddy 於執行期生成程式碼](https://medium.com/java-magazine-translation/%E7%94%A8-byte-buddy-%E6%96%BC%E5%9F%B7%E8%A1%8C%E6%9C%9F%E7%94%9F%E6%88%90%E7%A8%8B%E5%BC%8F%E7%A2%BC-50055bb48e2c)
