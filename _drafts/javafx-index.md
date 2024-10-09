---
title: "JavaFX"
image: /assets/images/java/fx/java-fx-cover.png
permalink: /javafx/javafx-index.html
---

JavaFX is a software platform for creating and delivering desktop applications,
as well as rich web applications that can run across a wide variety of devices.

## API

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
assign filtered_posts = site.javafx |
where_exp: "item", "item.path contains 'javafx/api/'" |
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

## 基础篇

{%
assign filtered_posts = site.javafx |
where_exp: "item", "item.path contains 'javafx/basic/'" |
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

## Properties and Bindings

{%
assign filtered_posts = site.javafx |
where_exp: "item", "item.path contains 'javafx/property-and-binding/'" |
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

## Stage

<table>
    <thead>
    <tr>
        <th style="text-align: center;">Screen</th>
        <th style="text-align: center;">Window</th>
        <th style="text-align: center;">Stage</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>
{%
assign filtered_posts = site.javafx |
where_exp: "item", "item.path contains 'javafx/stage/screen/'" |
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
assign filtered_posts = site.javafx |
where_exp: "item", "item.path contains 'javafx/stage/window/'" |
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
assign filtered_posts = site.javafx |
where_exp: "item", "item.path contains 'javafx/stage/stage/'" |
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



## Layout

{%
assign filtered_posts = site.javafx |
where_exp: "item", "item.path contains 'javafx/layout/'" |
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

## Package

{%
assign filtered_posts = site.javafx |
where_exp: "item", "item.path contains 'javafx/package/'" |
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

- [JavaFX项目基础应用 Graalvm打包javafx项目成exe](https://blog.csdn.net/ailice001/article/details/123167937)
- [Windows下使用Graalvm将Javafx应用编译成exe](https://www.cnblogs.com/dehai/p/14258391.html)
- [使用 GraalVM 将纯 JavaFX 项目打包成 EXE](https://blog.csdn.net/wangpaiblog/article/details/122850438)

- Download JavaFX SDK [JavaFX](https://openjfx.io/)
- Install JavaFX plugin
- Create new JavaFX project
- Create User library
- Add user library
- Configure build path
- Add VM arguments


Stage --> scence --> BorderPane --> label

Layout


```text
init() --> start() --> stop()
```

## Stage

- title
- icon
- resizable
- x,y,width,height
- StageStyle: setInitStyle
- Modality
- Event




## Node

- layoutX/layoutY/preWidth/preHeight
- style/visible/opacity/blendMode
- tanslateX
- parent

## Event

## Color Font Image

## JavaFX Features

JavaFX offers two ways to build a user interface (UI): using Java code and using FXML.
FXML is an XML-based scriptable markup language to define a UI declaratively.
Oracle provides a tool called **Scene Builder**, which is a visual editor for FXML.

The GUI in JavaFX is constructed as a **scene graph**.
A scene graph is a collection of visual elements, called **nodes**, arranged in a hierarchical fashion.
A scene graph is built using the public JavaFX API.
Nodes in a scene graph can handle user inputs and user gestures.
They can have effects, transformations, and states.
Types of nodes in a scene graph include
simple UI controls such as buttons, text fields, two-dimensional (2D) and three-dimensional (3D) shapes,
images, media (audio and video), web content, and charts.

> 引入 scene graph 和 node 两个概念

In JavaFX, event queues are managed by a single, operating system – level thread called **JavaFX Application Thread**.
All user input events are dispatched on the JavaFX Application Thread.
JavaFX requires that a live scene graph must be modified only on the JavaFX Application Thread.



## Reference

- [JavaFX](https://openjfx.io/)
- [JavaFX-Gluon](https://gluonhq.com/products/javafx/)

- [Learn JavaFX 8](https://link.springer.com/book/10.1007/978-1-4842-1142-7) Authors: Kishori Sharan

Github:

- [apress/learn-javafx17](https://github.com/apress/learn-javafx17)

Website

- [JavaFX Tutorial](https://www.javatpoint.com/javafx-tutorial)
  - [JavaFX Architecture](https://www.javatpoint.com/javafx-architecture)
  - [JavaFX CSS](https://www.javatpoint.com/javafx-css)

示例

- [JavaFX 源码分析实战：如何设置窗体标题小图标和任务栏图标](https://eguid.blog.csdn.net/article/details/115209658)
- [JavaFX 教程——菜单条](https://baijiahao.baidu.com/s?id=1720354106499120541&wfr=spider&for=pc)
- [3 easy ways to get the current Stage in a JavaFX controller](https://zditect.com/code/java/3-easy-ways-to-get-the-current-stage-in-a-javafx-controller.html)


