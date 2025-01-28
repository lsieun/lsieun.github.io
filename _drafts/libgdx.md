---
title: "libGDX(Java)"
categories: game
image: /assets/images/libgdx/libgdx-cover.png
permalink: /libgdx.html
---

libGDX is a free and open-source game-development application framework written in the Java programming language with some C and C++ components for performance dependent code. It allows for the development of desktop and mobile games by using the same code base.

The acronym `LWJGL` stands for the **Lightweight Java Game Library**,
an open source Java library originally created by Caspian Rychlik-Prince
to simplify game development in terms of accessing the desktop computer hardware resources.
In LibGDX, `LWJGL` is used for the desktop backend to support all the major desktop operating systems, such as Windows, Linux, and Mac OS X.

## 主要内容

### 第一章 基础

{%
assign filtered_posts = site.libgdx |
sort: "sequence"
%}
<ol>
    {% for post in filtered_posts %}
    {% assign num = post.sequence | abs %}
    {% if num > 100 and num < 200 %}
    <li>
        <a href="{{ post.url }}" target="_blank">{{ post.title }}</a>
    </li>
    {% endif %}
    {% endfor %}
</ol>

### 第二章 Animation

{%
assign filtered_posts = site.libgdx |
sort: "sequence"
%}
<ol>
    {% for post in filtered_posts %}
    {% assign num = post.sequence | abs %}
    {% if num > 200 and num < 300 %}
    <li>
        <a href="{{ post.url }}" target="_blank">{{ post.title }}</a>
    </li>
    {% endif %}
    {% endfor %}
</ol>

## Content

- A `Texture` is an object that stores image-related data: the dimensions (width and height) of an image and the color of each pixel.
- A `SpriteBatch` is an object that draws images to the screen.

- A `FileHandle` is a LibGDX object that is used to access files stored on the computer.

- The `Gdx` class contains many useful static objects and methods (similar to Java's `Math` class)

- A `LwjglApplication` class sets up a window and manages the graphics and audio, keyboard and mouse input, and file access.

- The `Batch` class, used for drawing, optimizes graphics operations by sending multiple images at once to the computer's graphics processing unit (GPU).

The main difference between these classes is that a `TextureRegion` can be used to store a `Texture`
that contains multiple images or animation frames,
and a `TextureRegion` also stores coordinates, called `(u,v)` coordinates,
that determine which rectangular sub-area of the `Texture` is to be used.

## References

- [libGDX 官网](https://libgdx.com/)
- [Github: Apress/java-game-dev-LibGDX](https://github.com/Apress/java-game-dev-LibGDX)

游戏

- [java 五子棋客户端](https://github.com/vencc/game)
- [大鱼吃小鱼项目](https://www.bilibili.com/video/BV1LL4y167Xf)
- [超级玛丽](https://www.bilibili.com/video/BV1uA411F7QV)
- [开发王者](https://www.bilibili.com/video/BV1eh411n7iH)
- [快速使用 Java 语言开发游戏辅助外挂](https://www.bilibili.com/video/BV1vt411g7AE)
- [Robocode](https://robocode.sourceforge.io/) is a programming game, where the goal is to develop a robot battle tank to battle against other tanks in Java or .NET.
