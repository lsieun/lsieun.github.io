---
title:  "Java ASM系列四：代码模板"
categories: java asm
image: /assets/images/manga/pig-fly.jpg
tags: java asm
published: false
---

ASM is an open source Java Library for manipulating java byte code.（不断更新中。。。）

---

适合人群：对Java ASM知识有一定了解的开发人员，不适合刚刚接触ASM的初学者（beginner）。

---

在编写ASM代码时，本文遵循的编码命名规则如下：

- 如果一个类继承自`ClassVisitor`，我们将其命名为`XxxVisitor`。
- 如果一个类继承自`MethodVisitor`，我们将其命名为`XxxAdapter`。

通过类的名字，我们可以很容易地区分出哪些类是继承自`ClassVisitor`，哪些类是继承自`MethodVisitor`。

---

## 类层面

{% assign filtered_posts = site.java-asm-04 | sort: "sequence" %}
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

## 方法层面

{% assign filtered_posts = site.java-asm-04 | sort: "sequence" %}
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

对带有注解的方法进行处理。
